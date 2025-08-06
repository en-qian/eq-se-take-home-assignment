import crypto from 'crypto-js';
import cookies from 'js-cookie';
import axios from 'axios';

export const axiosInstance = axios.create();

export const generateHash =
  (algorithm: 'sha1' | 'sha256' | 'sha512') => (input: string) => {
    if (algorithm === 'sha1') {
      return crypto.SHA1(input).toString();
    } else if (algorithm === 'sha256') {
      return crypto.SHA256(input).toString();
    } else {
      return crypto.SHA512(input).toString();
    }
  };

export const encrypt = (encData: any): string => {
  const key = crypto.enc.Utf8.parse(process.env.REACT_APP_AES_KEY);
  const iv = crypto.enc.Utf8.parse(process.env.REACT_APP_AES_IV);

  const encrypted = crypto.AES.encrypt(JSON.stringify(encData), key, {
    iv,
    mode: crypto.mode.CBC,
    padding: crypto.pad.Pkcs7,
  });

  return encodeBytes(encrypted.ciphertext);
};

export const decrypt = (decData: string): string => {
  const key = crypto.enc.Utf8.parse(process.env.REACT_APP_AES_KEY);
  const iv = crypto.enc.Utf8.parse(process.env.REACT_APP_AES_IV);

  const encryptedWA = decodeBytes(decData);

  const decrypted = crypto.AES.decrypt(
    { ciphertext: encryptedWA } as any,
    key,
    { iv, mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7 }
  );

  return decrypted.toString(crypto.enc.Utf8);
};

export const decryptData = <T>(decData: string): T => {
  return JSON.parse(decrypt(decData)) as T;
};

const encodeBytes = (wordArray: crypto.lib.WordArray): string => {
  const bytes = crypto.enc.Hex.parse(wordArray.toString()).words;
  const byteLength = wordArray.sigBytes;
  let result = '';

  for (let i = 0; i < byteLength; i++) {
    const byte = (bytes[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    result += String.fromCharCode(((byte >> 4) & 0xf) + 'a'.charCodeAt(0));
    result += String.fromCharCode((byte & 0xf) + 'a'.charCodeAt(0));
  }

  return result;
};

const decodeBytes = (str: string): crypto.lib.WordArray => {
  const len = str.length / 2;
  const byteArray = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    const high = str.charCodeAt(i * 2) - 'a'.charCodeAt(0);
    const low = str.charCodeAt(i * 2 + 1) - 'a'.charCodeAt(0);
    byteArray[i] = (high << 4) + low;
  }

  return crypto.lib.WordArray.create(byteArray);
};

axiosInstance.interceptors.response.use(
  response => {
    try {
      response.data = decryptData(response.data.data);
    } catch (err) {
      // Decryption will failed if api returned data is not aes encrypted
      // Fallback to use original response data
      response.data = response.data;
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export const setCookie = (key: string, value: any) => {
  cookies.set(key, encrypt(value), { expires: 1 });
};

export const getCookie = <T>(key: string) => {
  const value = cookies.get(key);

  if (!value) return null;

  return decryptData<T>(value);
};

export const clearCookie = () => {
  cookies.remove('user_data');
  cookies.remove('sid');
};

export const generateId = (segmentLength: number, split?: boolean) => {
  const segments = 5;

  const remainder = segmentLength % 5;

  segmentLength =
    remainder <= 5 - remainder
      ? segmentLength - remainder
      : segmentLength + (5 - remainder);

  const CHARS =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const generateSegment = (length: number) =>
    new Array(length)
      .fill('')
      .map(() => CHARS[Math.floor(Math.random() * CHARS.length)])
      .join('');

  return new Array(segments)
    .fill('')
    .map(() => generateSegment(segmentLength / segments))
    .join(split ? '-' : '');
};
