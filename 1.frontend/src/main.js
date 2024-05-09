/* Hacemos las importaciones generales de nuestra instancia
   en VUE.
 */

window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = true;

import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from '@/router'


import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import { tooltip } from './utils/tooltip';



/** Instanciando VueJS **/
/********************** */
//Crear instancia con Root Component
const app = createApp(App);

app.directive('tooltip', tooltip)


// Carga de plugins en la instancia
app.use(router)
app.use(createPinia())
// Montarla en el div #app
app.mount('#app')