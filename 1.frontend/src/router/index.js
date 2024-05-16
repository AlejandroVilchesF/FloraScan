import { createRouter, createWebHistory } from 'vue-router'
import settings from '@/settings'
import Layout from '@/layout'
import { useCommonStore } from '@/stores/CommonVuex';
import { useUsersStore } from '@/stores/UsersVuex'; 

const routes = [
  {
    path: '/',
    name: 'home',
    component: {
      async beforeRouteEnter(to, from, next) {
        const hasToken = await useUsersStore().v_decodeToken()
        if (hasToken && hasToken.hasOwnProperty('exp') && (hasToken.exp > Date.now() / 1000)) {
          return next({ name: 'inicio' });
        } else {
          await useUsersStore().v_removeSeflData();
          return next({ name: 'inicio' });
        }       
      }
    }  
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    async beforeEnter(to, from, next) {
      if(useUsersStore().token){
        return next({ name: 'inicio' });
      }else{
        return next();
      }
    },
    meta: {
      title: 'Login system',
      guest: true
    }
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      breadCrumb: 'Usuario'
    },
    component: Layout,
    children: [
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/views/profile'),
        meta: {
          title: 'Perfil',
          breadCrumb: 'Perfil',
          action: 'USER_SELF',
          guest: false
        }
      },
      {
        path: 'logout',
        name: 'logout',
        component: {
          async beforeRouteEnter(to, from, next) {
            const hasToken = await useUsersStore().v_decodeToken()
            if (hasToken && hasToken.hasOwnProperty('exp') && (hasToken.exp > Date.now() / 1000)) {
              await useUsersStore().v_closeSession();
            } else {
              await useUsersStore().v_removeSeflData();
            }
            return next({ name: 'inicio' });
          }
        },
        meta: {
          title: 'Close session',
          guest: true
        }
      }
    ]
  },
  {
    path: '/general',
    name: 'general',
    meta: {
      breadCrumb: 'General'
    },
    component: Layout,
    children: [
      {
        path: 'inicio',
        name: 'inicio',
        component: () => import('@/views/home'),
        meta: {
          title: 'Inicio',
          breadCrumb: 'Inicio',
          action: null,
          guest: true
        }
      },
      {
        path: 'identificacion',
        name: 'identificacion',
        component: () => import('@/views/identify'),
        meta: {
          title: 'Identificacion',
          breadCrumb: 'Identificacion',
          action: 'USER_SELF',
          guest: false
        }
      },
      {
        path: 'contribuir',
        name: 'contribuir',
        component: () => import('@/views/contribute'),
        meta: {
          title: 'Contribuir',
          breadCrumb: 'Contribuir',
          action: 'USER_SELF',
          guest: false
        }
      },
      {
        path: 'busqueda',
        name: 'busqueda',
        component: () => import('@/views/search'),
        meta: {
          title: 'Busqueda',
          breadCrumb: 'Busqueda',
          action: 'USER_SELF',
          guest: false
        }
      }
    ]
  },   
  {
    path: '/admin',
    meta: {
      breadCrumb: 'Administración',
      action: 'USER_SEE' || 'PANEL_ADMIN',
      guest: false
    },
    component: Layout,
    children: [
      {
        path: 'settings',
        name: 'settings',
        component: () => import('@/views/settings'),
        meta: {
          title: 'Settings',
          breadCrumb: 'Settings',
          action: 'ADMIN',
          guest: false
        }
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/views/users'),
        meta: {
          title: 'Usuarios y roles',
          breadCrumb: 'Usuarios y roles',
          action: 'USER_SEE',
          guest: false
        }
      },
      {
        path: 'log',
        name: 'log',
        component: () => import('@/views/log'),
        meta: {
          title: 'Logs',
          breadCrumb: 'Logs',
          action: 'PANEL_ADMIN',
          guest: false
        }
      },
    ]
  }
]


/* Crar historial de rutas ***/
/****************************/
const router = createRouter({
  history: createWebHistory(),
  routes
})


/* Acciones a realizar antes de entrar en cada ruta */
/****************************************************/
router.beforeEach(async (to, from, next) => {
  const commonStore = useCommonStore();
  const usersStore = useUsersStore();
  const hasToken = await usersStore.v_decodeToken();

  // Cambiar título de la página
  let secTitle = "";
  if (commonStore.g_BasicSettings) {
    secTitle = await commonStore.g_BasicSettings.site.shortname + " - " + to.meta.title;
  } else {
    secTitle = settings.template.site.shortname;
  }
  document.title = secTitle;

  if (to.meta.guest === true) {
    return next();
  } else {
    try {
      if (hasToken) {
        if (hasToken.hasOwnProperty('exp') && (hasToken.exp > Date.now() / 1000)) {
          if ((hasToken.role.actions).includes(to.meta.action) || (hasToken.role.alias.includes(settings.template.superuser))) {
            return next();
          } else {
            return next({ name: 'logout' });
          }
        } else {
          await usersStore.v_removeSeflData();
          return next({ name: 'inicio' });
        }
      } else {
        return next({ name: 'inicio' });
      }
    } catch (err) {
      console.log(err);
      await usersStore.v_removeSeflData();
      return next({ name: 'inicio' });
    }
  }
});


export default router
