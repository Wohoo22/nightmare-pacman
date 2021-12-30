import Storage from './storage';

function currentMillis(): number {
  return new Date().getTime();
}

export default function implementStorage(defaultSize: number): Storage {
  let size: number = defaultSize;

  const cache = new Map<string, any>();
  const insertedAtMillis = new Map<string, any>();
  const startRefreshingAtMillis = new Map<string, number>();

  const get = (k: string) => cache.get(k);

  const removeRandomKeyInCache = (): void => {
    const getRandomKey = () => {
      const keys: any = Array.from(cache.keys());
      return keys[Math.floor(Math.random() * keys.length)];
    };
    cache.delete(getRandomKey());
  };
  const set = (k: string, v: any) => {
    if (cache.size >= size) {
      removeRandomKeyInCache();
    }
    cache.set(k, v);
    insertedAtMillis.set(k, currentMillis());
  };

  const has = (k: string) => cache.has(k);

  const startRefreshing = (k: string): void => {
    startRefreshingAtMillis.set(k, currentMillis());
  };

  const stopRefreshing = (k: string): void => {
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

  const setSize = (val: number) => {
    size = val;
  };

  return {
    set,
    get,
    has,
    startRefreshing,
    stopRefreshing,
    setSize,
    isRefreshing,
    getAliveTimeInMillis,
  };
}
