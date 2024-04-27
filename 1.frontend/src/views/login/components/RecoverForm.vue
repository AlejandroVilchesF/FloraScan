<template>
  <div>
    <Input 
      type="text" 
      v-model="email" 
      id="email-key" 
      :label="'Email de registro'"
      icon="bi bi-envelope-at fs-5" 
      :required="true" 
    />
    <div class="d-flex justify-content-center">
      <button
        class="
        col-12 col-sm-12 col-md-10 col-lg-12 col-xl-6
        btn btn-lg btn-success
        btnSubmit me-2
        "
        @click="sendRecover"
      >
        {{ 'Solicitar' }}
      </button>
      <Spinner v-if="isLoading"></Spinner>
    </div>
    <div class="w-100 d-flex justify-content-center align-items-center" style="height: 279px;">
      <div class="text-center" v-if="submitSuccess">
        <h5 class="text-success fw-bold">{{ 'Recuperación de contraseña' }}</h5>
        <h6 class="text-success fw-bold">{{ 'Enlace de restablecimiento de contraseña enviado a su email. Por favor complete el proceso en 30 minutos' }}</h6>
      </div>
    </div>
  </div>
</template>
  
  
<script>
import { useCommonStore } from "@/stores/CommonVuex";
import Spinner from "../../../components/commons/Spinner.vue";
import Input from "@/components/commons/Input";
import UserService from "../../../services/UserService";
export default {
  name: "RecoverForm",
  props: {},
  data() {
    return {
      email: null,
      isLoading: false,
      submitSuccess: false
    };
  },
  components: {
    Spinner,
    Input
  },
  computed: {},
  watch: {},
  methods: {
    async sendRecover(){
      this.isLoading = true;
      try{
        await UserService.setRecoveryToken(this.email);
        this.submitSuccess = true;
        this.isLoading = false;
      }catch(err){
        this.isLoading = false;
        console.log(err);
      }
    }
  }
};
</script>
  
<style scoped></style>