<template>
  <div class="card mb-3">
    <div class="card-header">
      <h5 class="card-title mb-0">{{ 'Información usuario' }}</h5>
    </div>
    <div class="card-body text-center">
      <img
        :src="avatar"
        :alt="username"
        class="img-fluid rounded-circle mb-2"
        width="128"
        height="128"
         />
      <h5 class="card-title mb-0">{{ username }}</h5>
    </div>
    <hr class="my-0" />
    <div class="card-body">
      <p class="infoTitle">{{ 'Rol: ' }}<span class="infoData text-info">{{ rolename }}</span></p>
      <p class="infoTitle">{{ 'Email: ' }}<span class="infoData text-info">{{ email }}</span></p>
      <p class="infoTitle">{{ 'Ultimo acceso: ' }}<span class="infoData text-info">{{ lastAccess }}</span></p>
      <p class="infoTitle" v-if="biography && biography != ''">{{ 'Sobre mi' }}<br> <div class="infoData border p-2" v-html="biography"></div></p>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import { useUsersStore } from '@/stores/UsersVuex'; 
import { useCommonStore } from '@/stores/CommonVuex'; 

export default {
  name: "Info",
  data() {
    return { 
      defaultImage: require('@/assets/avatar/default.png')
    };
  },
  computed: {
    username: function(){
      if(useUsersStore().v_userdata && useUsersStore().v_userdata.info)
      return useUsersStore().v_userdata.info.name;
    },
    rolename: function(){
      if(useUsersStore().v_userdata  && useUsersStore().v_userdata.role)
      return useUsersStore().v_userdata.role.alias;
    },
    email: function(){
      if(useUsersStore().v_userdata  && useUsersStore().v_userdata.info)
      return useUsersStore().v_userdata.info.email;
    },   
    biography: function(){
      if(useUsersStore().v_userdata  && useUsersStore().v_userdata.info)
      return useUsersStore().v_userdata.info.bio;
    },
    avatar: function(){
      if(useUsersStore().v_userdata && useUsersStore().v_userdata.info)
      return useUsersStore().v_userdata.info.avatar? useUsersStore().v_userdata.info.avatar : this.defaultImage;
    },
    lastAccess: function(){
      if(useUsersStore().v_userdata && useUsersStore().v_userdata.info)
      return dayjs(new Date(useUsersStore().v_userdata.info.lastAccess)).format('YYYY-MM-DD H:mm A');
    }
  },
  watch: {
    username: function(val){
      return val;
    },
    rolename: function(val){
      return val;
    },
    email: function(val){
      return val;
    }
  },
  methods: {}
};
</script>

<style scoped>
.infoTitle{
  font-size: 0.93rem;
  font-weight: 500;
}

.infoData{
  font-size: 0.87rem;
  font-weight: 300;
}
</style>