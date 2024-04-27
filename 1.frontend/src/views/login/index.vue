<template>
  <section class="vh-100 d-flex flex-column justify-content-center align-items-center">
    <video
      ref="videoBackground"
      class="d-none d-lg-inline video-background"
      autoplay
      loop
      muted
      playsinline
    >
      <source src="~@/assets/video/login_bg.mp4" type="video/mp4" />
      Your browser does not admit the video tag
    </video>
    <div class="card">
      <div class="d-block d-md-none" v-if="!showForm" style="height: 700px;"></div>
      <div class="d-block d-md-none" v-if="showAuthForm" style="height: 500px;"></div>
      <div class="d-block d-md-none" v-if="showRegisterForm" style="height: 600px;"></div>
      <div class="d-block d-md-none" v-if="showRecoverForm" style="height: 500px;"></div>
      <div class="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center">
          <div class="col-12 col-md-5 order-2 order-md-1 text-center">
            <!-- <img src="~@/assets/img/us-full.svg" class="img-fluid rounded-end" style="width: 800px;" /> -->
            <img src="~@/assets/img/us-full.svg" class="img-fluid rounded-end d-none d-md-block" style="width: 800px;"/>
            <img src="~@/assets/img/us-full.svg" class="rounded-end d-block d-md-none" style="width: 100%;"/>
          </div>
          <div class="col-md-8 col-lg-7 col-xl d-flex justify-content-center align-items-center order-1 order-md-2">
            <!-- AUTH FORM and LOGO-->
            <div class="col-xl-8">
              <div :class="showForm? 'd-none' : 'd-flex justify-content-center align-items-center'" :style="`max-width: 400px; height: 400px`">
                <img src="~@/assets/img/bouncing-circles.svg" style="width: 200px;" />
              </div>
              <div :class="showForm ? 'd-block' : 'd-none'">
                <div class="themeSelector me-1">
                  <ThemeMode></ThemeMode>
                </div>
                <div class="mt-5 mt-md-0 mb-0 mb-md-4 d-flex justify-content-center align-items-center">
                  <img src="~@/assets/logo/logo-gie-01.png" class="d-none d-md-block pt-4" style="width: 300px; height: 180px"/>
                  <img src="~@/assets/logo/logo-gie-01.png" class="d-block d-md-none mb-4" style="width: 300px; height: 180px"/>
                </div>
                <div class="d-flex justify-content-center">
                  <div class="mx-4 mx-md-0 d-none d-md-block formContainer w-100" v-if="showAuthForm"><auth-form></auth-form></div>
                  <div class="mx-4 mx-md-0 d-none d-md-block formContainer w-100" v-if="showRegisterForm"><register-form></register-form></div>
                  <div class="mx-4 mx-md-0 d-none d-md-block formContainer w-100" v-if="showRecoverForm"><recover-form></recover-form></div>
                </div>
                <div class="mx-4 mx-md-0 d-block d-md-none" v-if="showAuthForm"><auth-form></auth-form></div>
                <div class="mx-4 mx-md-0 d-block d-md-none" v-if="showRegisterForm"><register-form></register-form></div>
                <div class="mx-4 mx-md-0 d-block d-md-none" v-if="showRecoverForm"><recover-form></recover-form></div>

                <div class="w-100 text-center my-3" v-if="showAuthForm">{{ '¿No tienes cuenta? ' }}<a href="#" style="text-decoration: none;" @click="loadAnimation('showRegisterForm')"><i class="fas fa-user-plus"></i>{{ ' Regístrate' }}</a></div>
                <div class="w-100 text-center my-3" v-if="showAuthForm">{{ '¿Has olvidado la contraseña? ' }}<a href="#" style="text-decoration: none;" @click="loadAnimation('showRecoverForm')"><i class="fas fa-rotate-left"></i>{{ ' Recupérala' }}</a></div>
                <div class="w-100 d-flex align-items-center" :class="(showRegisterForm || showRecoverForm) ? 'justify-content-between':'justify-content-end'">
                  <a href="#" style="text-decoration: none;" class="ms-4 ms-md-0"  @click="loadAnimation('showAuthForm')" v-if="showRegisterForm || showRecoverForm"><i class="fas fa-right-to-bracket"></i>{{ 'Inicia sesión' }}</a>
                  <router-link :to="{ name: 'inicio' }" class="routerLink me-4 me-md-0">
                    <a href="#" style="text-decoration: none;">
                      <i class="bi bi-box-arrow-right"></i>
                      <span>{{ 'Atrás' }}</span>
                    </a>
                  </router-link>
                </div>
              </div>
              <hr v-if="showForm" class="my-4">
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>


<script>
import AuthForm from "./components/AuthForm";
import RegisterForm from "./components/RegisterForm.vue";
import RecoverForm from "./components/RecoverForm.vue";
import ThemeMode from "@/layout/components/extras/ThemeMode";
import { useCommonStore } from "@/stores/CommonVuex";


export default {
  data() {
    return {
      showForm: true, 
      showAuthForm: false,
      showRegisterForm: false,
      showRecoverForm: false
    };
  },
  components: {
    "auth-form": AuthForm,
    "register-form": RegisterForm,
    "recover-form": RecoverForm,
    ThemeMode
  },
  mounted() {
    this.loadAnimation('showAuthForm');
  },
  computed: {},
  methods: {
    loadAnimation(formToShow){
      this.showAuthForm = false;
      this.showRegisterForm = false;
      this.showRecoverForm = false;
      this[formToShow] = true;
    }
  }
};
</script>

<style lang="css">
@import "~@/assets/css/main.css";
</style>

<style scoped>
.row > * {
  --bs-gutter-x: 0rem;
}

@media (min-width: 992px) and (max-width: 1520px) {
  .card {
    max-width: 80vw;
  }
}

.logo-alt {
  filter: brightness(0) invert(0.7);
}

.logo-alt:hover {
  filter: brightness(1) invert(0.4);
}

.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}

/* MOBILE RESOLUTION */
@media (max-width: 992px) {
  .h-custom {
    height: 100%;
  }

  .card {
    all: unset;
  }
}

/* Estilo para el video en el fondo */
.video-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  opacity: 0.8;
  filter: brightness(0.6);
  object-fit: cover; /* Ajusta el video para que ocupe todo el fondo */
}

/* Capa semi-transparente con fondo oscuro */
.video-background::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(
    0,
    0,
    0
  ); /* Valor del alfa (0.7) determina la opacidad */
  z-index: 1; /* Asegura que la capa esté encima del video */
}


/* Posicion del themeSelector*/
.themeSelector{
  position: absolute;
  top: 0;
  right: 0;
  zoom: 1.1;
}
.formContainer{
  max-width: 370px;
}
</style>

