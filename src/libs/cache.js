class CacheItem {
  constructor(value, expiredAt) {
    this.value = value
    this.expiredAt = expiredAt
  }

  isExpired() {
    return this.expiredAt < Date.now()
  }
}

class ExpiredCacheItem extends CacheItem {
  constructor() {
    const secondInMs = 1000
    super({}, Date.now() - secondInMs)
  }
}

class CacheController {
  constructor() {
    this.items = new Map()
  }

  // EXTERNAL API
  async get(key, realFunc) {
    const item = this.items.get(key)
    // console.log('my cache item: ', item);
    if (item == null || item.isExpired()) {
      const rawValue = await realFunc()
      const realValue = (() => {
        try {
          return JSON.parse(rawValue)
        } catch (e) {
          return rawValue
        }
      })()
      // console.log('NOT CACHED: ', key, ' & ', realValue);
      this.items.set(key, new CacheItem(realValue, this._defaultExpiredAt()))
      return realValue
    }
    // console.log('CACHED: ', key, ' & ', item);
    return item.value
  }

  invalidate(key) {
    this.items.set(key, new ExpiredCacheItem())
  }

  // INTERNAL API
  set(key, value) {
    this.items.set(key, new CacheItem(value, this._defaultExpiredAt()))
  }

  _defaultExpiredAt() {
    // expired in 5 minutes
    const defaultDuration = 5 * 60 * 1000
    return Date.now() + defaultDuration
  }
} 

const CacheFactory = (() => {
  let cacheInstance; // CacheController

  return {
    getInstance: () => {
      if (cacheInstance == null) {
        cacheInstance = new CacheController()
        cacheInstance.constructor = null
      }
      return cacheInstance
    },
  }
})()

module.exports = {
  CacheFactory
}