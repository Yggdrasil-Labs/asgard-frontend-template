import { createApp } from 'vue'
import App from './App.vue'
import i18n from './locales/i18n'
import router from './router'
import { initAppSettings } from './utils/initApp'
import './assets/css/global.css'

// 初始化应用设置
initAppSettings()

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')
