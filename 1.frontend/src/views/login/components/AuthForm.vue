<template>
  <form
    class="needs-validation"
    @submit="subLogin"
  >
    <Input
      type="text"
      v-model="key"
      id="access-key"
      :label="'Nombre/Email'"
      icon="bi bi-envelope-at fs-5"
      :required="true"
    />

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
    >
      <template v-slot:message>
        <span class="input-group-text text-center revealPassword rounded-end" @click="revealPassword">
          <i class="bi bi-eye-slash-fill fs-5 eye" id="show_eye"></i>
          <i class="bi bi-eye d-none fs-5 eye" id="hide_eye"></i>
        </span>
      </template>
    </Input>

    <Select 
      :label="'Duración sesión'"
      id="duration"
      :modelValue="duration"
      :options="durationOptions"
      valKey="value"
      textKey="key"
      icon="bi bi-clock-fill fs-5"
      :required="true"
      :removeDefault="true"
      @change="changeDuration($event)"
    />

    <div class="col d-flex justify-content-center">
      <button
        class="
          col-12 col-sm-12 col-md-10 col-lg-12 col-xl-6
          btn btn-lg btn-primary
          btnSubmit me-2
        "
        type="submit"
        title="Submit access data"
      >
        {{ 'Acceder' }}
      </button>
      <Spinner v-if="isLoading"></Spinner>
    </div>

  </form>
</template>


<script>
import Input from "@/components/commons/Input";
import Select from "@/components/commons/Select"
import Spinner from "../../../components/commons/Spinner.vue";
import { useUsersStore } from '@/stores/UsersVuex'; 
import { useCommonStore } from "@/stores/CommonVuex";
import { setLocalStorage } from "../../../utils/local.storage.js";

export default {
  data() {
    return {
      key: null,
      password: null,
      duration: 1800,
      isLoading: false
    };
  },
  components: {
    Input,
    Select,
    Spinner
  },
  computed: {
    durationOptions: function (){
      let options = [
        {key: '30 min', value: 1800},
        {key: '1h', value: 3600},
        {key: '24h', value: 86400},
        {key: 'Permanente', value: 1500000000}
      ]
      return options;
    }
  },
  methods: {
    subLogin(e) {
      this.isLoading = true;
      e.preventDefault();
      let data = {
        key: this.key,
        password: this.password,
        duration: this.duration
      };
      useUsersStore().login(data)
      .then(async res => {
        if (res.data) {
          this.isLoading = false;
          await this.asyncSetCryptKey(this.password);
          if(res.data.user.localStorage){
            setLocalStorage(res.data.user.localStorage);
            useCommonStore().a_getEncryptedLocalStorage();
          }
          this.$router.push({ name: "inicio" });
        }
      })
      .catch(err => {
        this.isLoading = false;
        console.log(err);
      });
    },
    asyncSetCryptKey(key){
      return new Promise( resolve => {
        localStorage.setItem('cryptkey',key);
        resolve();
      });
    },
    revealPassword() {
      var inputField = document.getElementById("i-password");
      var show_eye = document.getElementById("show_eye");
      var hide_eye = document.getElementById("hide_eye");
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
    changeDuration(e){
      this.duration = parseInt(e.target.value);
    }
  },
};
</script>

<style scoped>
#password{
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
