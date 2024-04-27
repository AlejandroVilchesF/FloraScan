<template>
  <div class="dropdown">
    <a
      class="nav-link dropdown-toggle"
      :class="modo"
      href="#"
      data-bs-toggle="dropdown"
    >
      <span class="d-none d-sm-inline me-sm-3 username">{{ username }}</span>
      <img :src="avatar" class="avatar profileImage" />
    </a>
    <div class="dropdown-menu dropdown-menu-end">
      <router-link :to="{ name: 'profile' }" class="routerLink">
        <a class="dropdown-item" href="#">
          <i class="bi bi-person"></i>
          <span>{{ 'Perfil de usuario' }}</span>
        </a>
      </router-link>
      <div class="dropdown-divider"></div>
      <router-link :to="{ name: 'logout' }" class="routerLink">
        <a class="dropdown-item" href="#">
          <i class="bi bi-box-arrow-right"></i>
          <span>{{ 'Cerrar sesión' }}</span>
        </a>
      </router-link>
    </div>
  </div>
</template>


<script>
import { useUsersStore } from "@/stores/UsersVuex";
import { useCommonStore } from "@/stores/CommonVuex";

export default {
  props: {
    modo: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      defaultImage: require('@/assets/avatar/default.png')
    };
  },
  mounted(){},
  computed: {
    avatar: function(){
      if(useUsersStore().v_userdata && useUsersStore().v_userdata.info)
      return useUsersStore().v_userdata.info.avatar? useUsersStore().v_userdata.info.avatar : this.defaultImage;
    },
    username: function(){
      if(useUsersStore().v_userdata && useUsersStore().v_userdata.info)
      return useUsersStore().v_userdata.info.name;
    }
  },
  methods: {}
};
</script>

<style scoped>
i {
  margin-right: 10px;
}
.avatar {
  height: 30px;
}
.username {
  font-size: 1rem;
}

.dropdown {
  float: right;
  font-size: 100%;
}

.dropdown-menu {
  margin-right: 1vw;
}

.navbar-toggler {
  border: 0px !important;
}

.profileImage{
  border-radius: 50%;
}
</style>