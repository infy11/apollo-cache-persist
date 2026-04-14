import { ApolloCache } from '@apollo/client/core';
import { ApolloPersistOptions, PersistedData } from './types';

export default class Cache {
  cache: ApolloCache;
  serialize: boolean;

  constructor(options: Pick<ApolloPersistOptions, 'cache' | 'serialize'>) {
    const { cache, serialize = true } = options;

    this.cache = cache;
    this.serialize = serialize;
  }

  extract(): PersistedData {
    let data: PersistedData = this.cache.extract() as any;

    if (this.serialize) {
      data = JSON.stringify(data) as string;
    }

    return data;
  }

  restore(data: PersistedData): void {
    if (this.serialize && typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (data != null) {
      this.cache.restore(data);
    }
  }
}
