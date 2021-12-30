import Storage from './storage';

function currentMillis(): number {
  return new Date().getTime();
}

export default function implementStorage(size: number): Storage {
  const store = new Map<string, any>();
  const insertedAtMillis = new Map<string, any>();
  const startRefreshingAtMillis = new Map<string, number>();

  const get = (k: string) => store.get(k);

  const removeRandomKeyInCache = (): void => {
    const getRandomKey = () => {
      const keys: any = Array.from(store.keys());
      return keys[Math.floor(Math.random() * keys.length)];
    };
    store.delete(getRandomKey());
  };
  const set = (k: string, v: any) => {
    if (store.size >= size) {
      removeRandomKeyInCache();
    }
    store.set(k, v);
    insertedAtMillis.set(k, currentMillis());
  };

  const has = (k: string) => store.has(k);

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

  return {
    set,
    get,
    has,
    startRefreshing,
    stopRefreshing,
    isRefreshing,
    getAliveTimeInMillis,
  };
}
