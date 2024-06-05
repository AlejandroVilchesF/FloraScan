import { defineStore } from 'pinia';
import Settings from "@/settings"
import { getEncryptedLocalStorage } from '../utils/local.storage';

export const useCommonStore = defineStore('common', {
  state: () => ({
    basicSettings: Settings.template,
    screenResolution: {
      width: 0,
      height: 0
    },
    lang: localStorage.getItem('lang')? localStorage.getItem('lang') : 'ES',
    encryptedLocalStorage: null
  }),

  actions: {
    a_getScreenParams() {
      const data = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      this.screenResolution = data;
      return true;
    },

    async a_getEncryptedLocalStorage(){
      return new Promise( async resolve => {
        this.encryptedLocalStorage = await getEncryptedLocalStorage();
        resolve();
      });
    }
  },

  getters: {}
});