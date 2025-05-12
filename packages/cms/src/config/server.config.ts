const NODE_ENV = process.env.NODE_ENV + '' || 'development';
const HOSTNAME = process.env.SERVER_HOSTNAME + '' || '127.0.0.1';
const PORT = parseInt(process.env.PORT + '', 10) || 3000;

export const serverConfig = {
  nodeEnv: NODE_ENV,
  hostname: HOSTNAME,
  port: PORT,
};

export function isDevEnv() {
  return serverConfig.nodeEnv.toLowerCase() === 'development';
}
export function isProductionEnv() {
  return serverConfig.nodeEnv.toLowerCase() === 'production';
}
