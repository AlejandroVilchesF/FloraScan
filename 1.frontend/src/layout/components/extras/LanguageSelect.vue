<template>
    <ul class="navbar-nav ml-auto" :title="langText">
      <li class="nav-item dropdown">
        <button
          aria-expanded="false"
          class="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center"
          data-bs-toggle="dropdown"
          type="button"
        >
          <i
            class="bi bi-translate"
          ></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <button
              class="dropdown-item d-flex align-items-center"
              type="button"
              @click="selectLang('EN')"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Flag_of_the_United_Kingdom_%281-2%29.svg" alt="United Kingdom Flag" height="25" width="35">
              &nbsp;English
            </button>
          </li>
          <li>
            <button
              class="dropdown-item d-flex align-items-center"
              type="button"
              @click="selectLang('JP')"
            >
            <img src="https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg" alt="日本の旗" height="25" width="35">
              &nbsp;日本語
            </button>
          </li>
        </ul>
      </li>
    </ul>
  </template>
  
  <script>
  import { useCommonStore } from "@/stores/CommonVuex";
 
  export default {
    data() {
      return {
        commonStore: useCommonStore()
      };
    },
    mounted() {},
    computed: {
      language: function () {
        return useCommonStore().lang
      },
      langText: function () {
        return this.getText('Language', '言語');
      }
    },
    methods: {
      selectLang(lang){
          this.commonStore.a_setLanguage(lang);
      },
      getText(enText, jpText){
        return this.language == 'EN'? enText : this.language == 'JP'? jpText:''
      }
    }
  };
  </script>
  
  <style scoped>
  /* THEME TOOGLE */
  .bi {
    width: 1em;
    height: 1em;
    vertical-align: -0.125em;
    fill: currentcolor;
  }
  
  .me-2 {
    margin-right: 0.5rem !important;
  }
  .opacity-50 {
    opacity: 0.5 !important;
  }
  </style>