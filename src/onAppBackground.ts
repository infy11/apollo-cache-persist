import { ApolloCache } from '@apollo/client/core';

import Log from './Log';
import onCacheWrite from './onCacheWrite';

export interface TriggerFunctionConfig {
  log: Log;
  cache: ApolloCache;
}

export default ({ log, cache }: TriggerFunctionConfig) => (
  persist: () => void,
) => {
  log.warn(
    'Trigger option `background` not available on web; using `write` trigger',
  );
  return onCacheWrite({ cache })(persist);
};
