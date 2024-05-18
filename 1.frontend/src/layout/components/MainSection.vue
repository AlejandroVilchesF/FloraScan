<template>
  <div id="page-content-wrapper">
    <!-- Top navigation-->
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <!-- No borrar la clase sidebarToggle:: referencia con listeners para el menu-->
        <h3
          class="ms-3 cursor-pointer sidebarToggle"
          title="Desplegar menú"
        >
          <i class="bi bi-list"></i>
        </h3>
        <Breadcrumb class="ms-4 mt-2 d-none d-lg-inline"/>
        <!-- DROPDOWN -->
        <div class="navbar-collapse d-flex flex-wrap position-relative me-4" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto mt-2 mt-lg-0 ">       
            <li class="nav-item me-2 mt-1"><ThemeMode /></li>
            <li class="nav-item dropdown" v-if="isLogged">
              <dropdown-layout :title="'Menu de usuario'" />
            </li>
            <li class="nav-item me-3" style="margin-top: 10px;" v-else>
                <router-link :to="{ name: 'login' }" class="routerLink">
                  <a class="dropdown-item" href="#">
                    <i class="bi bi-box-arrow-in-right"></i>
                    <span>{{ ' Iniciar sesión' }}</span>
                  </a>
                </router-link>
            </li>
          </ul>
        </div>
        <!-- DROPDOWN -->
      </div>
    </nav>
    <!-- Page content-->
    <div class="container-fluid px-md-4 bp-md-4">
      <router-view v-slot="{ Component, route }">
        <!-- Use any custom transition and  to `fade` -->
        <transition name="fade" mode="out-in">
          <div>
            <component :is="Component" :key="route.path"/>
          </div>
        </transition>
      </router-view>
    </div>
  </div>
</template>


<script>
import Breadcrumb from "./extras/Breadcrumb";
import Dropdown from "./extras/Dropdown";
import ThemeMode from "@/layout/components/extras/ThemeMode";
import { useUsersStore } from "@/stores/UsersVuex";
import { useCommonStore } from "@/stores/CommonVuex";

export default {
  data() {
    return {};
  },
  components: {
    "dropdown-layout": Dropdown,
    ThemeMode,
    Breadcrumb
  },
  mounted() {},
  computed: {
    isLogged: function(){
      return useUsersStore().v_userdata? true:false;
    }
  },
  methods: {}
};
</script>