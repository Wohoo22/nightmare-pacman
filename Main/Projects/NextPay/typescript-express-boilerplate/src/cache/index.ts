import md5 from 'md5';
import Cache from './cache';
import implementCache from './cache.impl';
import Storage from './storage';
import implementStorage from './storage.impl';

export default function initCache(): Cache {
  const defaultSize: number = 10000;
  const storage: Storage = implementStorage(defaultSize);
  const cache: Cache = implementCache(md5, storage);
  return cache;
}
