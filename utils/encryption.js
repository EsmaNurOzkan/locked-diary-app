import CryptoJS from 'crypto-js';
import * as Random from 'expo-random';

export const encryptData = (data, password) => {
  return CryptoJS.AES.encrypt(data, password).toString();
};

export const decryptData = (encryptedData, password) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, password);
  return bytes.toString(CryptoJS.enc.Utf8);
};
