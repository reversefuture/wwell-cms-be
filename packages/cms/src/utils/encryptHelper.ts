import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

// 加密函数
export function encryptAES256CBC(plainText: string, password: string): string {
  // 生成一个随机的 16 字节盐
  const salt = randomBytes(16);

  // 使用 scryptSync 从密码和盐派生一个 32 字节的密钥
  const key = scryptSync(password, salt, 32);

  // 生成一个随机的 16 字节初始化向量 (IV)
  const iv = randomBytes(16);

  // 创建 AES-256-CBC 加密器
  const cipher = createCipheriv('aes-256-cbc', key, iv);

  // 加密数据
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // 返回格式为 "salt:iv:encryptedData"
  return `${salt.toString('hex')}:${iv.toString('hex')}:${encrypted}`;
}

// 解密函数
export function decryptAES256CBC(encryptedText: string, password: string): string {
  // 拆分加密文本为 salt, iv 和加密数据
  const [saltHex, ivHex, encryptedData] = encryptedText.split(':');

  // 将 hex 字符串转换回 Buffer
  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');

  // 使用 scryptSync 从密码和盐派生一个 32 字节的密钥
  const key = scryptSync(password, salt, 32);

  // 创建 AES-256-CBC 解密器
  const decipher = createDecipheriv('aes-256-cbc', key, iv);

  // 解密数据
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// 示例用法
// const password = '123asdSlz';
// const plainText = 'This is a secret message!';
// const encrypted = encryptAES256CBC(plainText, password);
// console.log('Encrypted:', encrypted);
// const decrypted = decryptAES256CBC(encrypted, password);
// console.log('Decrypted:', decrypted);