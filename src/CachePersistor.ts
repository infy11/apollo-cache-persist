import Log from './Log';
import Cache from './Cache';
import Storage from './Storage';
import Persistor from './Persistor';
import Trigger from './Trigger';

import { ApolloPersistOptions, LogLine } from './types';

export default class CachePersistor {
  log: Log;
  cache: Cache;
  storage: Storage;
  persistor: Persistor;
  trigger: Trigger;

  constructor(options: ApolloPersistOptions) {
    if (!options.cache) {
      throw new Error(
        'In order to persist your Apollo Cache, you need to pass in a cache. ' +
          'Please see https://www.apollographql.com/docs/react/basics/caching.html for our default InMemoryCache.',
      );
    }

    if (!options.storage) {
      throw new Error(
        'In order to persist your Apollo Cache, you need to pass in an underlying storage provider. ' +
          'Please see https://github.com/apollographql/apollo-cache-persist#storage-providers',
      );
    }

    const log = new Log(options);
    const cache = new Cache(options);
    const storage = new Storage(options);
    const persistor = new Persistor({ log, cache, storage }, options);
    const trigger = new Trigger({ log, persistor }, options);

    this.log = log;
    this.cache = cache;
    // TODO: remove type assertion
    this.storage = storage as Storage;
    this.persistor = persistor as Persistor;
    this.trigger = trigger as Trigger;
  }

  /**
   * Manual persistence controls.
   */

  persist(): Promise<void> {
    return this.persistor.persist();
  }

  restore(): Promise<void> {
    return this.persistor.restore();
  }

  purge(): Promise<void> {
    return this.persistor.purge();
  }

  /**
   * Trigger controls.
   */

  pause(): void {
    this.trigger.pause();
  }

  resume(): void {
    this.trigger.resume();
  }

  remove(): void {
    this.trigger.remove();
  }

  /**
   * Info accessor.
   */

  getLogs(print = false): Array<LogLine> | void {
    if (print) {
      this.log.tailLogs();
    } else {
      return this.log.getLogs();
    }
  }

  getSize(): Promise<number | null> {
    return this.storage.getSize();
  }
}
