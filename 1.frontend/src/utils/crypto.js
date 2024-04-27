const CryptoJS = require('crypto-js');

/**
 * Encrypts a string using AES algorithm
 * @param {String} plainText String to encrypt
 * @returns {String} Encrypted string
 */
export function encrypt(plainText) {
    let encryptedText = null;
    const cryptkey = window.localStorage.getItem('cryptkey');
    try{
        encryptedText = CryptoJS.AES.encrypt(plainText, cryptkey).toString();
    }catch(err){
        console.log(err)
    }
    return encryptedText;
}

/**
 * Decrypts a string encrypted by AES algorithm
 * @param {String} encryptedText Encrypted string
 * @returns {String} Decrypted string
 */
export function decrypt(encryptedText) {
    let decryptedBytes = null;
    const cryptkey = window.localStorage.getItem('cryptkey');
    try{
        decryptedBytes = CryptoJS.AES.decrypt(encryptedText, cryptkey);
    }catch(err){
        console.log(err)
    }
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
}