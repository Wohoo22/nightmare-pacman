/* eslint-disable no-case-declarations */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Cache, { GetDataInput, Time } from './cache';

function currentMillis(): number {
  return new Date().getTime();
}

function convertToMillis(time: Time) {
  const millis = time.milliseconds || 0;
  const seconds = time.seconds || 30;
  const minutes = time.minutes || 0;
  return minutes * 60000 + seconds * 1000 + millis;
}

export default function implementCache(defaultSize: number, md5: any): Cache {
  let size: number = defaultSize;

  const storage = (() => {
    const cache = new Map<string, any>();
    const insertedAtMillis = new Map<string, any>();
    const startRefreshingAtMillis = new Map<string, number>();

    const get = (k: string) => cache.get(k);

    const set = (k: string, v: any) => {
      if (cache.size >= size) {
        removeRandomKeyInCache();
      }
      cache.set(k, v);
      insertedAtMillis.set(k, currentMillis());
    };

    const has = (k: string) => cache.has(k);

    const removeRandomKeyInCache = (): void => {
      const getRandomKey = () => {
        const keys: any = Array.from(cache.keys());
        return keys[Math.floor(Math.random() * keys.length)];
      };
      cache.delete(getRandomKey());
    };

    const startRefresh = (k: string): void => {
      startRefreshingAtMillis.set(k, currentMillis());
    };

    const stopRefresh = (k: string): void => {
      startRefreshingAtMillis.delete(k);
    };

    const isRefreshing = (k: string, refreshTimeOutAfterMillis: number): boolean => {
      const startRefreshingAt = startRefreshingAtMillis.get(k);
      if (!startRefreshingAt) {
        return false;
      }
      return currentMillis() - startRefreshingAt <= refreshTimeOutAfterMillis;
    };

    const getAliveTimeInMillis = (k: string): number => currentMillis() - insertedAtMillis.get(k);

    return {
      get,
      set,
      has,
      startRefresh,
      stopRefresh,
      isRefreshing,
      getAliveTimeInMillis,
    };
  })();

  function setSize(value: number): void {
    size = value;
  }

  async function getData(input: GetDataInput): Promise<any> {
    const key: string = input.identifier + md5(input.args);
    const status: string = checkDataStatusInCache({
      key,
      refreshAfterMillis: convertToMillis(input.refreshAfter),
      expireAfterMillis: convertToMillis(input.expireAfter),
      refreshTimeOutAfter: convertToMillis(input.refreshTimeOutAfter),
    });
    switch (status) {
      case 'REFRESHING':
      case 'HIT':
        return storage.get(key);
      case 'NEED_REFRESH':
        (async () => {
          storage.startRefresh(key);
          storage.set(key, await input.callback());
          storage.stopRefresh(key);
        })();
        return storage.get(key);
      case 'MISS':
      case 'EXPIRED':
        const data = await input.callback();
        storage.set(key, data);
        return data;
      default:
        // Cannot reach
        return null;
    }
  }

  function checkDataStatusInCache({
    key,
    refreshAfterMillis,
    expireAfterMillis,
    refreshTimeOutAfter,
  }: {
    key: string;
    refreshAfterMillis: number;
    expireAfterMillis: number;
    refreshTimeOutAfter: number;
  }) {
    if (!storage.has(key)) {
      return 'MISS';
    }
    if (storage.isRefreshing(key, refreshTimeOutAfter)) {
      return 'REFRESHING';
    }
    const aliveTime: number = storage.getAliveTimeInMillis(key);
    if (aliveTime < refreshAfterMillis) {
      return 'HIT';
    }
    if (aliveTime < expireAfterMillis) {
      return 'NEED_REFRESH';
    }
    return 'EXPIRED';
  }

  return {
    setSize,
    getData,
  };
}
