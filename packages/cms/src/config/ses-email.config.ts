export const sesMailConfig = {
  host: process.env.SES_MAIL_SMTP_HOST,
  port: parseInt(process.env.SES_MAIL_SMTP_PORT) || 465,
  username: process.env.SES_MAIL_SMTP_USERNAME,
  password: process.env.SES_MAIL_SMTP_PASSWORD,
  email: process.env.SES_MAIL_SMTP_EMAIL_FROM,
};
