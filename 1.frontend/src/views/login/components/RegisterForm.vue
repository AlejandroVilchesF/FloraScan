<template>
    <div>
        <form @submit="register($event)">
            <Input 
                type="text" 
                v-model="name" 
                id="name-key" 
                :maxlength="30" 
                :label="'Nombre'"
                icon="bi bi-person-fill fs-5" 
                :required="true" 
            />
            <Input 
                type="text" 
                v-model="email" 
                id="email-key" 
                :label="'Email'"
                icon="bi bi-envelope-at fs-5" 
                :required="true" 
            />
            <div class="row mx-0 px-0">
                <div class="col-12 col-md-6 mx-0 ps-0 pe-md-1 pe-0">
                    <Input
                        type="password"
                        v-model="password"
                        id="password"
                        :minlength="6"
                        :maxlength="20"
                        :label="'Contraseña'"
                        icon="bi bi-key-fill fs-5"
                        :required="true"
                        :notRoundedEnd="true"
                        class="password"
                        @input="clearRePassword"
                    >
                        <template v-slot:message>
                            <span id="pw_eye" class="input-group-text text-center revealPassword rounded-end" @click="revealPassword($event)">
                            <i class="bi bi-eye-slash-fill fs-5 eye" id="show_eye_pw"></i>
                            <i class="bi bi-eye d-none fs-5 eye" id="hide_eye_pw"></i>
                            </span>
                        </template>
                    </Input>
                </div>
                <div class="col-12 col-md-6 mx-0 pe-0 ps-md-1 ps-0">
                    <Input
                        type="password"
                        v-model="repassword"
                        id="password-re"
                        :label="'Confirme la contraseña'"
                        icon="bi bi-key-fill fs-5"
                        :required="true"
                        :notRoundedEnd="true"
                        class="password"
                        @input="checkPasswordValidity"
                    >
                        <template v-slot:message>
                            <span id="rpw_eye" class="input-group-text text-center revealPassword rounded-end" @click="revealRePassword($event)">
                            <i class="bi bi-eye-slash-fill fs-5 eye" id="show_eye_rpw"></i>
                            <i class="bi bi-eye d-none fs-5 eye" id="hide_eye_rpw"></i>
                            </span>
                        </template>
                    </Input>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <button
                    class="
                    col-12 col-sm-12 col-md-10 col-lg-12 col-xl-6
                    btn btn-lg btn-success
                    btnSubmit me-2
                    "
                    type="submit"
                    title="Register"
                >
                    {{ 'Registrar' }}
                </button>
                <Spinner v-if="isLoading"></Spinner>
            </div>
            <div class="w-100 d-flex justify-content-center align-items-center" style="height: 97px;">
                <div class="text-center" v-if="submitSuccess">
                    <h5 class="text-success fw-bold">{{ 'Registro solicitado' }}</h5>
                    <h6 class="text-success fw-bold">{{ 'Link de activacion enviado a su email. Por favor complete el proceso en 30 minutos' }}</h6>
                </div>
            </div>
        </form>
    </div>
</template>
  
  
<script>
import { useCommonStore } from "@/stores/CommonVuex";
import Spinner from "../../../components/commons/Spinner.vue";
import Input from "@/components/commons/Input";
import UserService from "../../../services/UserService";
export default {
    name: "RegisterForm",
    props: {},
    data() {
        return {
            name: null,
            email: null,
            password: null,
            repassword: null,
            submitSuccess: false,
            isLoading: false
        };
    },
    components: {
        Input,
        Spinner
    },
    mounted() {},
    computed: {
        repasswordValidityText: function(){
            return 'Las contraseñas no coinciden'
        }
    },
    watch: {},
    methods: {
        async register(event){
            this.isLoading = true;
            this.submitSuccess = false;
            await this.checkPasswordValidity();
            event.preventDefault();
            try{
                await UserService.registerAccount(this.name, this.email, this.password);
                this.isLoading = false;
                this.submitSuccess = true;
                this.clearForm();
            }catch(err){
                this.isLoading = false;
                console.log(err);
            }
            
        },
        revealPassword() {
            var inputField = document.getElementById('i-password');
            var show_eye = document.getElementById('show_eye_pw');
            var hide_eye = document.getElementById('hide_eye_pw');

            hide_eye.classList.remove("d-none");
            if (inputField.type === "password") {
                inputField.type = "text";
                show_eye.style.display = "none";
                hide_eye.style.display = "block";
            } else {
                inputField.type = "password";
                show_eye.style.display = "block";
                hide_eye.style.display = "none";
            }
        },
        revealRePassword(){
            var inputField = document.getElementById('i-password-re');
            var show_eye = document.getElementById('show_eye_rpw');
            var hide_eye = document.getElementById('hide_eye_rpw');

            hide_eye.classList.remove("d-none");
            if (inputField.type === "password") {
                inputField.type = "text";
                show_eye.style.display = "none";
                hide_eye.style.display = "block";
            } else {
                inputField.type = "password";
                show_eye.style.display = "block";
                hide_eye.style.display = "none";
            }
        },
        checkPasswordValidity(){
            return new Promise( resolve => {
                const RePasswordInput = document.getElementById('i-password-re');
                RePasswordInput.setCustomValidity('');
                if(this.password != this.repassword){
                    RePasswordInput.setCustomValidity(this.repasswordValidityText);
                }
                resolve();
            });
        },
        clearRePassword(){
            this.repassword = null;
            const RePasswordInput = document.getElementById('i-password-re');
            RePasswordInput.setCustomValidity('');
        },
        clearForm(){
            this.name = null;
            this.email = null;
            this.password = null;
            this.repassword = null;
        }
    }
};
</script>
  
<style scoped>
.password{
  border-top-right-radius: 0 !important;
  border-bottom-right-radius: 0 !important;
}

.eye{
  min-width: 20px !important;
}

.revealPassword {
  cursor:pointer;
  border-left: none;
}
</style>