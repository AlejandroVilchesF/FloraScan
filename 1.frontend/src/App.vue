<!-- MAIN LAYOUT OF VUE INSTANCE-->
<template>
  <div id="appInner">
    <Toast />
    <router-view />
  </div>
</template>


<script setup>
import { onMounted, onBeforeUnmount } from "vue";
import Toast from "@/components/commons/Toast";
import { useCommonStore } from "@/stores/CommonVuex";
//import { useEventsStore } from "@/stores/EventsVuex";
import { useUsersStore } from "@/stores/UsersVuex";
import { setLocalStorage } from "./utils/local.storage.js";
import { useToastStore } from "@/stores/ToastVuex";
// Variables
/////////////////////////////////
const commonStore = useCommonStore();
//const eventsStore = useEventsStore();
const usersStore = useUsersStore();
const toastStore = useToastStore();

// Methods
/////////////////////////////////
const fetchScreenParams = async () => {
  try {
    await commonStore.a_getScreenParams();
  } catch (error) {
    console.error(error);
  }
};

const handleResize = () => {
  fetchScreenParams();
};

// Events
/////////////////////////////////
onMounted(() => {

  // Subscribe to screen resolution change
  if (commonStore.screenResolution.width === 0) {
    fetchScreenParams();
  }
  window.addEventListener("resize", handleResize, true);

  // Subscribe to real time notifications
  // eventsStore.subscribe()

  //Obtain self data
  if(usersStore.token){
    usersStore.v_getselfdata().then( async response => {
      if(response.data.localStorage){
        const decryptionFlag = setLocalStorage(response.data.localStorage);
        if(!decryptionFlag){
          toastStore.showMessage({
            message: 'Su contraseña ha sido cambiada\nInicie sesión de nuevo',
            style: "error"
          });
          await usersStore.v_removeSeflData();
        }
      }
    }).catch( err => {
      console.log(err);
    });
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize, true);
});
</script>




<style>
/* Specify main div gets max width and height of the screen*/
#appInner {
  height: 100vh;
  width: 100vw;
  overflow-x: hidden;
}

/* Default font */
body {
  font-family: "Open Sans", sans-serif;
  color: #333;
  font-weight: 400;
  background-color: #f2f2f2;
  font-size: 100%;
}
</style>