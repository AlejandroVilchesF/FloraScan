<template>
    <div>
        <ModalConfirm 
            id="deleteAccountModal" 
            :title="'Borrar cuenta'" 
            :message="'Su cuenta será complatamente borrada de la base de datos, esta accion es irreversible'"
            :confirm="'Sí, borrar mi cuenta'"
            :reject="'No, me he equivocado'"
        />
        <ModalConfirm 
            id="globalLogoutModal" 
            :title="'Cerrar sesiones'" 
            :message="'Todas sus sesiones abiertas actualmente serán cerradas.'"
            :confirm="'Sí, cerrar todas mis sesiones'"
            :reject="'No, me he equivocado'"
        />
        <h5 class="form-label fst-italic">{{ 'Datos básicos' }}</h5>
        <div class="row pt-3">
            <div class="col-12 col-md-6">
                <Input
                    :label="'Nombre'" 
                    id="self-name"
                    type="text"
                    v-model="localName"
                    icon="fas fa-user"
                >
                <template v-slot:message>
                    <small class="fw-bold text-danger col-12" v-if="invalidName">Please enter a username between 1 and 30 characters</small>
                </template>
                </Input>
            </div>
            <div class="col-12 col-md-6">
                <Input
                    :label="'Email'" 
                    id="self-email"
                    type="text"
                    v-model="localEmail"
                    icon="fas fa-envelope"
                    :disabled="!isUserAdmin"
                ><template v-slot:message>
                    <small class="fw-bold text-danger col-12" v-if="invalidEmail">Please enter an email between 1 and 30 characters</small>
                </template>
                </Input>
            </div>
            <div class="col-12">
                <label for="biography" class="form-label fileLabel d-block">{{ 'Sobre mi' }}</label>
                <div 
                    v-html="bioCopy"
                    id="biography"
                    contenteditable="true"
                    :style="`font-size: 16px;`"
                    class="p-4 border border-2 mt-0"
                    ref="biography"
                    @paste="checkPaste($event)"
                    @input="insertLocalBio($event)"
                >
                </div>
                <div class="d-flex justify-content-end">
                    <span>
                        <i 
                            class="fas fa-font cursor pointer p-2 border border-2 border-end-0 border-top-0 cursor-pointer"
                            :class="selectedColor == 'default'? '':`text-${selectedColor}`"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="inside"
                            aria-expanded="false"
                            ref="dropdownToggle"
                            focusable="true"
                            @click="triggerClick"
                        ></i>
                        <ul class="dropdown-menu" ref="dropdownMenu">
                            <li><a class="dropdown-item" href="#" @click="changeColor('default')">Default</a></li>
                            <li><a class="dropdown-item text-danger" href="#" @click="changeColor('danger')">Red</a></li>
                            <li><a class="dropdown-item text-success" href="#" @click="changeColor('success')">Green</a></li>
                            <li><a class="dropdown-item text-warning" href="#" @click="changeColor('warning')">Yellow</a></li>
                            <li><a class="dropdown-item text-primary" href="#" @click="changeColor('primary')">Blue</a></li>
                            <li><a class="dropdown-item text-info" href="#" @click="changeColor('info')">Cyan</a></li>
                            <li><a class="dropdown-item text-secondary" href="#" @click="changeColor('secondary')">Grey</a></li>
                        </ul>
                        <i class="fas fa-bold fw-bold cursor pointer p-2 border border-2 border-top-0 cursor-pointer" @click="addHtml('b')"></i>
                        <i class="fas fa-italic cursor pointer p-2 border border-2 border-start-0 border-top-0 cursor-pointer" @click="addHtml('i')"></i>
                        <i class="fas fa-underline cursor pointer p-2 border border-2 border-start-0 border-top-0 cursor-pointer" @click="addHtml('u')"></i>
                        <i class="fas fa-link cursor pointer p-2 border border-2 border-start-0 border-top-0 cursor-pointer" @click="linkURLs()"></i>
                    </span>
                </div>
                <small class="fw-bold text-danger col-12" v-if="invalidBio">Please enter a shorter text (max. 500 characters)</small>
            </div>
        </div>  
        <hr class="mt-3">
        <h5 class="form-label fst-italic">{{ 'Cambiar contraseña' }}</h5>
        <div class="row pt-3">
            <div class="col-12 col-md-6">
                <Input
                    :label="'Nueva contraseña'" 
                    id="new-pw"
                    type="password"
                    v-model="newPassword"
                    icon="bi bi-key-fill"
                ><template v-slot:message>
                    <small class="fw-bold text-danger col-12" v-if="invalidPw">Please enter a password between 6 and 20 characters</small>
                </template>
                </Input>
            </div>
            <div class="col-12 col-md-6">
                <Input
                    :label="'Confirmar contraseña'" 
                    id="new-pw-confirm"
                    type="password"
                    v-model="newPasswordRepeat"
                    icon="bi bi-key-fill"
                >
                <template v-slot:message>
                    <small class="fw-bold text-danger col-12" v-if="invalidPwR">The passwords don't match</small>
                </template>
                </Input>
            </div>
            <div class="col-12 col-md-6">
                <Input 
                    :label="'Contraseña actual'" 
                    id="old-pw"
                    type="password"
                    v-model="oldPassword"
                    icon="bi bi-key text-danger"
                >
                    <template v-slot:message>
                        <small class="fw-bold text-danger col-12" v-if="invalidPwO">Please enter your current password</small>
                    </template>
                </Input>    
            </div>
        </div>
        <hr class="mt-3">
        <h5 class="form-label fst-italic">{{ 'Cambiar imagen de perfil' }}</h5>
        <div class="row pt-3">
            <div class="col-auto">
                <label for="avatarFile" class="form-label fileLabel d-block">{{ 'Elija archivo de imagen ( .jpg .jpeg .png ) máximo 512KB' }}</label>
                <button class="btn btn-primary" @click="simulateClick">
                    <i class="fas fa-upload"></i>
                    <span>{{ ' Subir' }}</span>
                </button>
                <input id="avatarFile" ref="avatarFile" type="file" accept=".jpg, .jpeg, .png" @change="handleImageChange($event)" :hidden="true" style="max-width: 250px; cursor: pointer;" />
                <small class="fw-bold text-danger col-12 mt-2" v-if="invalidFile">Invalid file</small>
            </div>
        </div>
        <hr class="mt-3">
        <div class="row justify-content-start">
            <div class="col-12 col-md-auto mb-2 mb-md-0">
                <button class="btn btn-success" @click="saveData">
                    <i class="fas fa-edit"></i>
                    <span>{{ ' Guardar cambios' }}</span>
                </button>
            </div>
            <div class="col-12 col-md-auto">
                <button class="btn btn-secondary" @click="restoreData">
                    <i class="fas fa-backward"></i>
                    <span>{{ ' Restaurar' }}</span>
                </button>
            </div>
        </div>
        <hr class="mt-4 text-warning border-4">
        <div class="row justify-content-start">
            <div class="col-12 col-md-auto">
                <h5 class="form-label fst-italic text-warning">{{ 'Administrar sesiones' }}</h5>
                <label class="form-label fileLabel d-block">{{ activeSessionText }}</label>
                <button class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#globalLogoutModal" @click="listenLogoutConfirm()">
                    <i class="fas fa-warning"></i>
                    <span>{{ 'Cerrar todas las sesiones' }}</span>
                </button>
            </div>
        </div>
        <hr class="mt-4 text-danger border-4">
        <div class="row justify-content-start">
            <div class="col-12 col-md-auto">
                <h5 class="form-label fst-italic text-danger">{{ 'Zona crítica' }}</h5>
                <button class="btn btn-danger" data-bs-toggle="modal" data-bs-target="#deleteAccountModal" @click="listenDeleteConfirm()">
                    <i class="fas fa-warning"></i>
                    <span>{{ ' Borrar cuenta' }}</span>
                </button>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import { useUsersStore } from '@/stores/UsersVuex';
  import { useCommonStore } from "@/stores/CommonVuex";
  import UserService from '../../../services/UserService';
  import Input from '../../../components/commons/Input.vue';
  import ModalConfirm from '../../../components/commons/ModalConfirm.vue';

  export default {
    name: "EditProfile",
    data() {
      return {
        localName: null,
        localEmail: null,
        localBio: null,
        localAvatar: null,
        newPassword: null,
        newPasswordRepeat: null,
        oldPassword: null,
        invalidName: false,
        invalidEmail: false,
        invalidPw: false,
        invalidPwR: false,
        invalidPwO: false,
        invalidFile: false,
        invalidBio: false,
        selectedColor: 'default',
        bioLength: 0,
        bioCopy: null,
        localOldAvatar: null
      };
    },
    components: {
        Input,
        ModalConfirm
    },
    computed: {
        userData: function(){
            return useUsersStore().v_userdata;
        },
        isUserAdmin: function(){
            return useUsersStore().v_userdata?.role?.actions?.includes('USER_ADMIN') || useUsersStore().v_userdata?.role?.actions?.includes('ADMIN');
        },
        activeSessionText: function () {
            return `Actualmente tiene ${this.userData?.token.length} sesiones activas`;
        }
    },
    watch: {
        userData: function(){
            this.restoreData();
        }
    },
    mounted(){
        if(this.userData){
            this.localName = this.userData.info.nombre_usuario;
            this.localEmail = this.userData.info.email;
            this.localBio = this.userData.info.bio;
            if(this.localBio){
                this.calculateBioLength();
                this.bioCopy = this.userData.info.bio;
            }
            this.localAvatar = this.userData.info.avatar;
            this.localOldAvatar = this.userData.info.avatar;
        }
    },
    methods: {
        handleImageChange(event){
            const file = event.target.files[0];
            const maxSizeInBytes = 512 * 1024; // 512KB
            if (file && file.size <= maxSizeInBytes) {
                this.invalidFile = false;
                this.convertImageToBase64(file);
            }else{
                this.$refs.avatarFile.value = '';
                this.invalidFile = true;
                setTimeout(() => {
                    this.invalidFile = false;
                }, 1000)
            }
        },
        convertImageToBase64(file) {
            const reader = new FileReader();
            reader.onload = async () => {
                this.localAvatar = reader.result;
                await useUsersStore().v_setPreviewAvatar(this.localAvatar);
            };
            reader.readAsDataURL(file);
        },
        async saveData(){
            this.invalidName = this.localName != this.userData.info.nombre_usuario && (!this.localName || this.localName == '' || this.localName?.length > 30);
            this.invalidEmail = this.localEmail != this.userData.info.email && (!this.localEmail || this.localEmail == '' || this.localEmail?.length > 30);
            this.invalidBio =  this.bioLength > 500;
            let newPw = this.newPassword && this.newPassword != '';
            this.invalidPw = newPw && (this.newPassword?.length < 6 || this.newPassword?.length > 20);
            this.invalidPwR = newPw && this.newPassword != this.newPasswordRepeat;
            this.invalidPwO = newPw && (!this.oldPassword || this.oldPassword == '');

            let validData = !(this.invalidName || this.invalidEmail || this.invalidBio|| this.invalidPw || this.invalidPwR || this.invalidPwO);

            if(validData){
                let updateData = {
                    data: {
                        info: {
                            name: this.localName,
                            email: this.localEmail,
                            avatar: this.localAvatar,
                            bio: this.localBio
                        },
                    }
                }
                if(newPw){
                    updateData.data.info['password'] = this.newPassword;
                    updateData['oldpassword'] = this.oldPassword;
                }
                try{
                    await useUsersStore().v_updateSelfData(updateData);
                    if(newPw){
                        await this.asyncSetCryptKey(this.newPassword);
                        await useCommonStore().a_getEncryptedLocalStorage();
                        await this.saveLocalStorageDB();
                    }
                }catch(err){
                    console.log(err);
                }
            }
        },
        asyncSetCryptKey(key){
            return new Promise( resolve => {
                localStorage.setItem('cryptkey',key);
                resolve();
            });
        },
        async saveLocalStorageDB(){
            if (this.userData) {
                await UserService.saverUserLocalStorage(useCommonStore().encryptedLocalStorage);
            }
        },
        simulateClick(){
            this.$refs.avatarFile.click();
        },
        listenDeleteConfirm(){
            document.getElementById("deleteAccountModal" + "confirmModalBtn").addEventListener('click', () =>{
                this.deleteAccount();
            }, false);
        },
        listenLogoutConfirm(){
            document.getElementById("globalLogoutModal" + "confirmModalBtn").addEventListener('click', () =>{
                this.globalLogout();
            }, false);
        },
        async deleteAccount(){
            try{
                await useUsersStore().v_deleteSelf();
                await useUsersStore().v_removeSeflData();
                this.$router.push({name: 'inicio'});
            }catch(err){
                console.log(err);
            }
        },
        async globalLogout(){
            try{
                await useUsersStore().v_closeSession(true);
                this.$router.push({ name: 'inicio' });
            }catch(err){
                console.log(err);
            }
        },
        changeColor(color){
            this.selectedColor = color;
            this.addHtml();
        },
        addHtml(add){
            const editableDiv = this.$refs.biography;
            if(!add && this.selectedColor != 'default'){
                editableDiv.innerHTML = `${editableDiv.innerHTML}<span class="text-${this.selectedColor}">&nbsp;</span>`;
            }else if(!add && this.selectedColor == 'default'){
                editableDiv.innerHTML = `${editableDiv.innerHTML}<span>&nbsp;</span>`;
            }else{
                editableDiv.innerHTML = `${editableDiv.innerHTML}<${add}>&nbsp;</${add}>`;
            }
        },
        linkURLs() {
            const editableDiv = this.$refs.biography;
            const regexURL = /(^|[^<a>"])(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
            editableDiv.innerHTML = editableDiv.innerHTML.replace(regexURL, function(match, prevChar, url) {
                if (prevChar === '<' || prevChar === '"' || prevChar === "a>") {
                    return match;
                } else {
                    return prevChar + '<a href="' + url + '" target="_blank">' + url + '</a>';
                }
            });
        },
        triggerClick(){
            setTimeout(()=>{
                this.$refs.dropdownMenu.addEventListener('click', this.clickHandler);
            },10);
        },
        clickHandler(){
            // Handler executes twice
            this.$refs.dropdownToggle.click();
            this.removeTrigerClick();
        },
        removeTrigerClick(){
            setTimeout(()=>{
                this.$refs.dropdownMenu.removeEventListener('click', this.clickHandler);
            },10);
        },
        /**
         * Prevents from pasting pre-formatted text
         * @param {ClipboardEvent} event Paste event
         */
        checkPaste(event){
            event.preventDefault();
            let plainText = event.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, plainText);
        },
        insertLocalBio(event){
            this.localBio = event.target.innerHTML;
            this.calculateBioLength();
        },
        calculateBioLength(){
            let contentCopy = this.localBio;
            contentCopy = contentCopy.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ');
            this.bioLength = contentCopy.length;
        },
        async restoreData(){
            if(this.userData){
                this.localName = this.userData.info.nombre_usuario;
                this.localEmail = this.userData.info.email;
                this.localBio = this.userData.info.bio;
                if(this.localBio){
                    this.calculateBioLength();
                    this.bioCopy = this.userData.info.bio;
                }
                this.$refs.biography.innerHTML = this.userData.info.bio;
                if(this.localOldAvatar){
                    await useUsersStore().v_setPreviewAvatar(this.localOldAvatar);
                }else{
                    this.localOldAvatar = this.userData.info.avatar;
                }
                this.localAvatar = this.userData.info.avatar;
                this.newPassword = null;
                this.newPasswordRepeat = null;
                this.oldPassword = null;
                this.invalidName = false;
                this.invalidEmail = false;
                this.invalidPw = false;
                this.invalidPwR = false;
                this.invalidPwO = false;
                this.invalidFile = false;
                this.invalidBio = false;
            }
        },
        getText(enText, jpText){
            return this.language == 'EN'? enText : this.language == 'JP'? jpText:''
        }
    }
  };
  </script>
  
<style scoped>
.fileLabel{
    font-size: 0.875rem;
  font-weight: 500;
}
</style>