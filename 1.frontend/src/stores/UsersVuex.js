import { defineStore } from 'pinia';
import UserService from "@/services/UserService";
import { parseJwt } from "@/utils/general";
import { setUserToken, getUserToken, removeUserToken } from '@/utils/auth';
import { cleanLocalStorage } from '../utils/local.storage';

export const useUsersStore = defineStore('users', {
  state: () => ({
    id: null,
    token: getUserToken(),
    v_userdata: null,
    v_decodedToken: null,
    v_cleanLocalData: false
  }),

  actions: {
    async login(userData) {
      try {
        const res = await UserService.login({
          key: userData.key,
          password: userData.password,
          duration: userData.duration
        });

        if (res.code === 3000 || res.code === 4000) {
          throw new Error(res.data.message);
        } else {
          this.id = res.data.user._id;
          this.token = res.data.token;
          this.v_userdata = res.data.user;
          setUserToken(res.data.token);

          return res;
        }
      } catch (error) {
        throw error;
      }
    },

    v_getselfdata() {
      return new Promise( async (resolve, reject) => {
        try{
          const id = parseJwt(this.token)?._id;
          const res = await UserService.getUser(id != undefined? id : 'null');
          this.id = res.data._id;
          this.v_userdata = res.data;
          resolve(res);
        }catch(err){
          reject(err);
        }
      });
    },

    async v_updateSelfData(data) {
      return new Promise( async ( resolve, reject ) => {
        try{
          let response = await UserService.updateUser(this.id, data );
          this.v_userdata = response.data;
          resolve();
        }catch(err){
          reject(err);
        }
      });
    },

    async v_decodeToken() {
      if (this.v_decodedToken === null) {
        const data = this.token ? parseJwt(this.token) : parseJwt(await getUserToken());
        this.v_decodedToken = data;
        return data;
      } else {
        return this.v_decodedToken;
      }
    },


    v_closeSession(global) {
      return new Promise (async resolve => {
        await UserService.logout(global);
        removeUserToken();
        cleanLocalStorage();
        this.v_cleanLocalData = !this.v_cleanLocalData;
        this.v_decodedToken = null;
        this.token = null;
        this.id = null;
        this.v_userdata = null;
        resolve();
      });
    },

    v_removeSeflData(){
      return new Promise (resolve => {
        removeUserToken();
        cleanLocalStorage();
        this.v_cleanLocalData = !this.v_cleanLocalData;
        this.v_decodedToken = null;
        this.token = null;
        this.id = null;
        this.v_userdata = null;
        resolve();
      });
    },

    v_setPreviewAvatar(avatar){
      return new Promise (resolve => {
        this.v_userdata.info.avatar = avatar;
        resolve();
      });
    },

    v_deleteSelf(){
      return new Promise ( async (resolve, reject) => {
        try{
          await UserService.deleteAccount();
          resolve();
        }catch(err){
          reject(err);
        }
      });
    }

  },

  getters: {
    getID() {
      return this.id;
    },
    getToken() {
      return this.token;
    },
    getData() {
      return this.v_userdata;
    }
  }
});
