export const AppConfig = {
  title: process.env.APP_TITLE + '' || 'WWELL_CMS',
  version: process.env.APP_VERSION + '' || '1.0.0',
  DATABASE_URL: process.env.DATABASE_URL + '',
  LOG_LEVEL: process.env.LOG_LEVEL + '' || 'info',
  API_KEY: process.env.API_KEY + '' || 'x-wwell-cms-api-key',
  TOKEN_KEY: process.env.TOKEN_KEY + '' || 'x-token',
  PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS + '') || 10,
  JWT_SECRET: process.env.JWT_SECRET + '' || 'aia-wwell-39',
  JWT_EXPIRATION_TIME:
    parseInt(process.env.JWT_EXPIRATION_TIME + '') || 86400000,
  otpIssuer: process.env.OTP_ISSUER + '',
  otpDigits: parseInt(process.env.OTP_DIGITS + '') || 6,
  otpTimestep: parseInt(process.env.OTP_TIMESTEP + '') || 120,
};
