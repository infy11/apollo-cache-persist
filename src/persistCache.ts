import CachePersistor from './CachePersistor';
import { ApolloPersistOptions } from './types';

export default (options: ApolloPersistOptions) => {
  const persistor = new CachePersistor(options);
  return persistor.restore();
};
