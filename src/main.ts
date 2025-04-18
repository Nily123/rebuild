import { createApp } from 'vue'
import './style.css'
//pinia
import { createPinia } from 'pinia'
const pinia = createPinia()
// Vuetify
import 'vuetify/lib/styles/main.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'virtual:uno.css'
import '@mdi/font/css/materialdesignicons.css'

import router from './router/index'   
import App from './App.vue'



const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
    },
  })


createApp(App).use(router).use(pinia).use(vuetify).mount('#app')

import { useUserStore } from './stores/index'
const userStore = useUserStore()
userStore.loadUserFromSession()