import { isProductionEnv } from 'config/server.config';

export const PipeOptions = {
  whitelist: true,
  transform: true,
  enableDebugMessages: !isProductionEnv(),
};
