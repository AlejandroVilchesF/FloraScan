/* IMPORTACIONES */
import axios from "axios";
import settings from "@/settings";
import router from "@/router";
import { useUsersStore } from "@/stores/UsersVuex";
import { useToastStore } from "@/stores/ToastVuex";

/* INSTANCIANDO AXIOS Y SU CONFIG INICIAL */
/*****************************************/
const service = axios.create({
  baseURL: settings.template.site.apiurl,
  timeout: 60000 * 5, // Timeout de la peticion (5 minutos)
  headers: {
    "Content-type": "application/json"
  }
});


/* INTERCEPTOR DE PETICIONES AXIOS */
/**********************************/
service.interceptors.request.use(

  config => {
    const usersStore = useUsersStore();
    // Interceptamos cada petición que realizamos por Axios
    // para que incluya el token
    if (usersStore.token) {
      config.headers['x-access-token'] = usersStore.token
    }


    return config
  },


  error => {
    return Promise.reject(error)
  }

)


/* INTEPCEPTOR DE RESPUESTAS AXIOS */
/**********************************/
service.interceptors.response.use(
  response => {
    // CÓDIGO: 2000 == La operación es correcta y se mostrará el TOAST
    // CÓDIGO: 2001 == La operación es correcta y no se mostrará el TOAST
    // CÓDIGO: 3000 == La operación no ha salido correctamente y se mostrará TOAST
    // CÓDIGO: 4000 == La ha sido bloqueada por un administrador y se mostrará TOAST

    // Personalizamos el código para saber que las credenciales no son
    // válidas:: es distinto al 401 que lo usaremos para eliminar los datos de sesión
    // para borrarle el token y redirigirlo al login automaticamente
    if ((response.data.code === 2000)) {
      useToastStore().showMessage({
        message: response.data.message,
        style: "success"
      });
      // Devolvemos el objeto de los datos
      // quitandole las cabeceras, config, etc
      return response.data
    } else if ((response.data.code === 2001)) {
      // Devolvemos el objeto de los datos
      // quitandole las cabeceras, config, etc
      return response.data
    } else if ((response.data.code === 3000)) {
      useToastStore().showMessage({
        message: response.data.message,
        style: "error"
      });
      // Devolvemos el objeto de los datos
      // quitandole las cabeceras, config, etc      
      return response.data
    } else if ((response.data.code === 3001)) {
      // Devolvemos el objeto de los datos
      // quitandole las cabeceras, config, etc
      return response.data;
    } else if ((response.data.code === 4000)) {
      useToastStore().showMessage({
        message: response.data.message,
        style: "error"
      });
      // Devolvemos el objeto de los datos
      // quitandole las cabeceras, config, etc      
      return response.data
    }
    else {
      // Devolvemos la respeusta para que siga su flujo
      // en caso de que no exista ningún codigo que nos interese
      // se devolverán cabeceras, config, data, ==> todo
      return response
    }

  },


  /* MANEJO DE CODIGO DE ERRORES 400..404.. 500, 502*/
  async error => {
    //400 Bad Request
    if (error.response.status === 400) {
      useToastStore().showMessage({
        message: error.response.data.message ? error.response.data.message : 'Bad Request',
        style: "error",
      });
    }

    // 401 Unauthorized
    if (error.response.status === 401) {
      useToastStore().showMessage({
        message: error.response.data.message ? error.response.data.message : 'Unauthorized',
        style: "error",
      });
      await useUsersStore().v_removeSeflData();
      router.push({ name: 'inicio' });
    }

    // 403 Forbidden 
    if (error.response.status === 403) {
      useToastStore().showMessage({
        message: error.response.data.message ? error.response.data.message : 'Forbidden',
        style: "error",
      });
    }

    // 404 Not found
    if (error.response.status === 404) {
      useToastStore().showMessage({
        message: error.response.data.message ? error.response.data.message : 'Not found',
        style: "error",
      });
    }

    // 413 Payload too large
    if (error.response.status === 413) {
      useToastStore().showMessage({
        message: 'Request payload too large',
        style: "error",
      });
    }

    // 500 Internal Server Error
    if (error.response.status === 500) {
      useToastStore().showMessage({
        message: "API comunication error",
        style: "error",
      });
    }

    // 502 Bad Gateway
    if (error.response.status === 502) {
      useToastStore().showMessage({
        message: "API comunication error",
        style: "error",
      });
    }

    return Promise.reject();
  }
)


/* EXPORTACIÓN PUBLICA */
export default service