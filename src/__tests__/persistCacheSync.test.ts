import { describe, it, expect, vi } from 'vitest';
import { SynchronousCachePersistor } from '..';
import MockStorageSync from '../__mocks__/MockStorageSync';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client/core';
import gql from 'graphql-tag';
import { ApolloPersistOptions } from '../types';
import {of} from 'rxjs'
describe('persistCacheSync', () => {
  describe('setup', () => {
    it('persists cache', async () => {
      const operation = gql`
        {
          hello
        }
      `;
      const result = { data: { hello: 'world' } };
      const storage = new MockStorageSync();
      const cache = new InMemoryCache();

      const persistOptions: ApolloPersistOptions<NormalizedCacheObject> = {
        cache,
        storage,
      };
      // @ts-ignore
      const cachePersistor = new SynchronousCachePersistor(persistOptions);

      const link = new ApolloLink(() => of(result));
      const client = new ApolloClient({ cache, link });
      expect(cache.extract()).toEqual({});

      await client.query({ query: operation });
      vi.advanceTimersByTime(
        persistOptions.debounce ? persistOptions.debounce + 1 : 1001,
      );

      const cache2 = new InMemoryCache();
      const cachePersistor2 = new SynchronousCachePersistor({
        cache: cache2,
        storage,
      });
      cachePersistor2.restoreSync();
      const keys = Object.keys(cache2.extract());
      expect(keys.length).toEqual(1);
    });
  });
});
