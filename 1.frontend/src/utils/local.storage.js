import { encrypt, decrypt } from './crypto';
const encryptFields = []

/**
 * Sets the user's encrypted local storage from database into browser's local storage
 * @param {Object} userLocalStorage User encrypted local storage from database
 * @returns {Boolean} decryption flag
 */
export function setLocalStorage(userLocalStorage) {
    const decryptionFlag = decrypt(userLocalStorage['encryption'])  == 'success';
    if(decryptionFlag){
        for (const [field, value] of  Object.entries(userLocalStorage)) {
            window.localStorage.setItem(field, encryptFields.includes(field)? decrypt(value) : value);
        }
    }
    return decryptionFlag;
}

/**
 * Removes all sensible local storage information from browser
 */
export function cleanLocalStorage(){
    const fields = [ 'cryptkey' ];
    fields.forEach(field => {
        window.localStorage.removeItem(field);
    });
}

/**
 * Gets encrypted browser's local storage
 * @returns {Object} Encrypted local storage
 */
export function getEncryptedLocalStorage(){
    return new Promise( resolve => {
        let localStorageData = {}
        let encryptedLocalStorage = {}
        for (const [field, value] of Object.entries(localStorageData)) {
            if(value != null){
                encryptedLocalStorage[field] = encryptFields.includes(field)? encrypt(value) : value;
            }
        }
        encryptedLocalStorage['encryption'] = encrypt('success');
        resolve(encryptedLocalStorage);
    });
}