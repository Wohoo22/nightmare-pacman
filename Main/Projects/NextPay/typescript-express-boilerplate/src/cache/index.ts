import md5 from 'md5';
import Cache from './cache';
import implementCache from './cache.impl';
import Storage from './storage';
import implementStorage from './storage.impl';

export default function initCache(size: number): Cache {
  const storage: Storage = implementStorage(size);
  const cache: Cache = implementCache(md5, storage);
  return cache;
}
