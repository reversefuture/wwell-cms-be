import { isProductionEnv } from "config";

export const PipeOptions = {
  whitelist: true,
  transform: true,
  enableDebugMessages: !isProductionEnv(),
};
