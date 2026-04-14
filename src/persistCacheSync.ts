import { ApolloPersistOptions } from './types';
import CachePersistor from './CachePersistor';
import Persistor, { PersistorConfig } from './Persistor';
import Storage from './Storage';

/**
 * Add cache to persist engine using synchronous API
 * 
 * @see SynchronousCachePersistor for advanced use cases
 * @param options options for persist engine
 */
export const persistCacheSync = (options: ApolloPersistOptions) => {
  const cachePersistor = new SynchronousCachePersistor(options);
  cachePersistor.restoreSync();
};

/**
 * Persistor engine that is going to use synchronous api
 */
export class SynchronousCachePersistor extends CachePersistor {
  persistor: SynchronousPersistor;

  constructor(options: ApolloPersistOptions) {
    super(options);

    this.storage = new SynchronousStorage(options);
    this.persistor = new SynchronousPersistor(
      { log: this.log, cache: this.cache, storage: this.storage },
      options,
    );
  }

  restoreSync() {
    this.persistor.restoreSync();
  }
}

export class SynchronousPersistor extends Persistor {
  storage: SynchronousStorage;

  constructor(
    { log, cache, storage }: PersistorConfig,
    options: ApolloPersistOptions,
  ) {
    super({ log, cache, storage }, options);
  }

  restoreSync() {
    this.cache.restore(this.storage.readSync());
  }
}

export class SynchronousStorage extends Storage {
  constructor(options: ApolloPersistOptions) {
    super(options);
  }

  readSync(): any {
    return this.storage.getItem(this.key);
  }
}
