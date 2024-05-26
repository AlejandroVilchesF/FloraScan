<template>
  <section class="vh-100 d-flex flex-column justify-content-center align-items-center">
    <video ref="videoBackground" class="d-none d-lg-inline video-background" autoplay loop muted playsinline>
      <source src="~@/assets/video/login_bg.mp4" type="video/mp4" />
      Tu navegador no admite la etiqueta video
    </video>
    <div class="card">
      <div class="d-block d-md-none" v-if="!showForm" style="height: 700px;"></div>
      <div class="d-block d-md-none" v-if="showAuthForm" style="height: 500px;"></div>
      <div class="d-block d-md-none" v-if="showRegisterForm" style="height: 600px;"></div>
      <div class="container-fluid h-custom">
        <div class="row d-flex justify-content-center align-items-center">
          <!-- Div logo -->
          <div class="col-12 col-md-5 order-2 order-md-1 text-center leftCard">
            <img src="~@/assets/img/flora-logo.jpg" class="img-fluid rounded-end d-none d-md-block"
              style="width: 800px;" />
            <img src="~@/assets/img/flora-logo.jpg" class="rounded-end d-block d-md-none" style="width: 100%;" />
          </div>
          <!-- Divs Formularios-->
          <div class="col-md-8 col-lg-7 col-xl d-flex justify-content-center align-items-center order-1 order-md-2">
            <div class="col-xl-8">
              <div :class="showForm ? 'd-none' : 'd-flex justify-content-center align-items-center'"
                :style="`max-width: 400px; height: 400px`">
                <img src="~@/assets/img/bouncing-circles.svg" style="width: 200px;" />
              </div>
              <div :class="showForm ? 'd-block' : 'd-none'">
                <!--Theme Selector-->
                <div class="themeSelector me-1">
                  <ThemeMode></ThemeMode>
                </div>
                <!--Formularios-->
                <div class="d-flex justify-content-center">
                  <div class="mx-4 mx-md-0 d-none d-md-block formContainer w-100" v-if="showAuthForm">
                    <auth-form></auth-form></div>
                  <div class="mx-4 mx-md-0 d-none d-md-block formContainer w-100" v-if="showRegisterForm">
                    <register-form></register-form></div>
                </div>
                <div class="mx-4 mx-md-0 d-block d-md-none" v-if="showAuthForm"><auth-form></auth-form></div>
                <div class="mx-4 mx-md-0 d-block d-md-none" v-if="showRegisterForm"><register-form></register-form>
                </div>
                <!-- Controles -->
                <div class="w-100 text-center my-2" v-if="showAuthForm">{{ '¿No tienes cuenta? ' }}<a href="#"
                    style="text-decoration: none;" @click="loadAnimation('showRegisterForm')"><i
                      class="fas fa-user-plus"></i>{{ ' Regístrate' }}</a></div>
                <div class="w-100 d-flex align-items-center"
                  :class="(showRegisterForm) ? 'justify-content-between' : 'justify-content-end'">
                  <a href="#" style="text-decoration: none;" class="ms-4 ms-md-0" @click="loadAnimation('showAuthForm')"
                    v-if="showRegisterForm"><i class="fas fa-right-to-bracket"></i>{{ ' Inicia sesión' }}</a>
                  <router-link :to="{ name: 'inicio' }" class="routerLink me-4 me-md-0">
                    <a href="#" style="text-decoration: none;">
                      <i class="bi bi-box-arrow-right"></i>
                      <span>{{ ' Atrás' }}</span>
                    </a>
                  </router-link>
                </div>
              </div>
              <hr v-if="showForm" class="my-2">
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
import ThemeMode from "@/layout/components/extras/ThemeMode";

export default {
  data() {
    return {
      showForm: true,
      showAuthForm: false,
      showRegisterForm: false
    };
  },
  components: {
    "auth-form": AuthForm,
    "register-form": RegisterForm,
    ThemeMode
  },
  mounted() {
    this.loadAnimation('showAuthForm');
  },
  computed: {},
  methods: {
    loadAnimation(formToShow) {
      this.showAuthForm = false;
      this.showRegisterForm = false;
      this[formToShow] = true;
    }
  }
};
</script>

<style lang="css">
@import "~@/assets/css/main.css";
</style>

<style scoped>
.row>* {
  --bs-gutter-x: 0rem;
}

.leftCard {
  background-color: #00a6ca;
}

.rightCard {
  background-color: #66e797;
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
  object-fit: cover;
  /* Ajusta el video para que ocupe todo el fondo */
}

/* Posicion del themeSelector*/
.themeSelector {
  position: absolute;
  top: 0;
  right: 0;
  zoom: 1.1;
}

.formContainer {
  max-width: 370px;
}
</style>
