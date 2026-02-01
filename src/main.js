import i18n from '@locales/i18n'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createAppPinia } from '@/stores/pinia'
import { initAppSettings } from '@/utils/initApp'
import '@scss/main.scss'

initAppSettings()

const app = createApp(App)
const pinia = createAppPinia()
app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
