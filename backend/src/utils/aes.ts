import crypto from 'crypto';

export const encrypt = (encData: string) => {
  const key = Buffer.from(process.env.AES_KEY, 'utf-8');
  const iv = Buffer.from(process.env.AES_IV, 'utf-8');

  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  let encrypted = cipher.update(encData, 'utf-8');
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encodeBytes(encrypted);
};

export const decrypt = (decData: string) => {
  const key = Buffer.from(process.env.AES_KEY, 'utf-8');
  const iv = Buffer.from(process.env.AES_IV, 'utf-8');
  const encryptedBytes = decodeBytes(decData);

  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(encryptedBytes);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString('utf-8');
};

export const encodeBytes = (buffer: Buffer): string => {
  let result = '';

  for (const byte of buffer) {
    result += String.fromCharCode(((byte >> 4) & 0xf) + 'a'.charCodeAt(0));
    result += String.fromCharCode((byte & 0xf) + 'a'.charCodeAt(0));
  }

  return result;
};

export const decodeBytes = (str: string): Buffer => {
  const len = str.length / 2;
  const result = Buffer.alloc(len);

  for (let i = 0; i < len; i++) {
    const high = str.charCodeAt(i * 2) - 'a'.charCodeAt(0);
    const low = str.charCodeAt(i * 2 + 1) - 'a'.charCodeAt(0);
    result[i] = (high << 4) + low;
  }

  return result;
};
