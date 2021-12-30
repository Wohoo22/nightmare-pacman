/* eslint-disable no-case-declarations */
/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-use-before-define */
import Cache, { GetDataInput, Time } from './cache';
import Storage from './storage';

function convertToMillis(time: Time) {
  const millis = time.milliseconds || 0;
  const seconds = time.seconds || 30;
  const minutes = time.minutes || 0;
  return minutes * 60000 + seconds * 1000 + millis;
}

export default function implementCache(md5: any, storage: Storage): Cache {
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
          storage.startRefreshing(key);
          storage.set(key, await input.callback());
          storage.stopRefreshing(key);
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
    getData,
  };
}
