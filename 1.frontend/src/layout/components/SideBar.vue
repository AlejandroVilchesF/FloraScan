<template>
  <div class="border-end bg-white" id="sidebar-wrapper">
    <a class="sidebar-brand" style="text-decoration: none">
      <div class="mx-0 px-0 text-center">
        <img src="~@/assets/logo/logo-no-background.png" style="height: 100px; width: 100px;"/>
      </div>
    </a>
 
    <ul class="sidebar-nav">
      <li class="sidebar-header text-uppercase">{{ 'Publico' }}</li>

      <router-link :to="{ name: 'inicio' }" class="routerLink">
        <li
          class="sidebar-item"
          :class="{ active: isCurrentRoute('inicio') }"
        >
          <a class="sidebar-link">
            <i
              class="bi bi-house me-2 opacity-50"
              data-theme-icon="bi-house"
            ></i>
            <span class="align-middle">{{ 'Inicio' }}</span>
          </a>
        </li>
      </router-link>

      <router-link :to="{ name: 'private' }" class="routerLink"  v-if="isLogged && allowedRoute('PRIVATE_SEE', 'admin')">
        <li
          class="sidebar-item"
          :class="{ active: isCurrentRoute('private') }"
        >
          <a class="sidebar-link">
            <i 
              class="bi bi-lock me-2 opacity-50"
              data-theme-icon="bi-lock"
            ></i>
            <span class="align-middle">{{ 'Restringido' }}</span>
          </a>
          
        </li>
      </router-link>

      <li
        class="sidebar-header text-uppercase mt-3"
        v-if="allowedRoute('USER_SEE', 'admin')"
      >
        Administración
      </li>

      <router-link :to="{ name: 'users' }" class="routerLink">
        <li
          class="sidebar-item"
          :class="{ active: isCurrentRoute('users') }"
        >
          <a class="sidebar-link" v-if="allowedRoute('USER_SEE', 'admin')">
            <i
              class="bi bi-people me-2 opacity-50"
              data-theme-icon="bi-people"
            ></i>
            <span class="align-middle">Usuarios</span>
          </a>
        </li>
      </router-link>

      <router-link :to="{ name: 'log' }" class="routerLink">
        <li
          class="sidebar-item"
          :class="{ active: isCurrentRoute('log') }"
        >
          <a class="sidebar-link" v-if="allowedRoute('PANEL_ADMIN', 'admin')">
            <i
              class="bi bi-terminal me-2 opacity-50"
              data-theme-icon="bi-terminal"
            ></i>
            <span class="align-middle">Log del sistema</span>
          </a>
        </li>
      </router-link>

      <!-- <router-link :to="{ name: 'settings' }" class="routerLink">
        <li
          class="sidebar-item"
          :class="{ active: isCurrentRoute('settings') }"
        >
          <a class="sidebar-link" v-if="allowedRoute('ADMIN', 'admin')">
            <i class="bi bi-gear me-2 opacity-50" data-theme-icon="bi-gear"></i>
            <span class="align-middle">Configuración</span>
          </a>
        </li>
      </router-link> -->
    </ul>
  </div>
</template>


<script>
/* OJO:: No borrar la clase routerLink puesto que en el componente padre se llama para
         detectar los eventos de toogle
 */
import settings from "@/settings";
import { useCommonStore } from "@/stores/CommonVuex";
import { useUsersStore } from "@/stores/UsersVuex";
import { Tooltip } from 'bootstrap'

export default {
  data() {
    return {
      currentRoute: null,
      commonStore: useCommonStore(),
      usersStore: useUsersStore()
    };
  },
  watch: {
    $route(to, from) {
      this.currentRoute = to.name;
    }
  },
  computed: {
    panelVersion: function () {
      return settings?.template?.panelVersion
        ? "V" + settings.template.panelVersion
        : "V0.0";
    },
    isLogged: function(){
      return this.usersStore.v_userdata? true:false;
    }
  },
  mounted() {
    this.currentRoute = this.$route.name;
  },
  methods: {
    isCurrentRoute(routeName) {
      return this.currentRoute === routeName;
    },
    allowedRoute(route, title) {
      //Si la ruta la tiene permitida se le da paso
      if (
        this.usersStore.v_userdata?.role?.actions?.includes(route) ||
        this.usersStore.v_userdata?.role?.alias == settings.template.superuser
      ) {
        return true;
      } else {
        return false;
      }
    }
  },
};
</script>
<style scoped>
</style>