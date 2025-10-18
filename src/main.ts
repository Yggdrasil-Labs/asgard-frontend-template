import i18n from '@locales/i18n'
import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { initAppSettings } from '@/utils/initApp'
import '@scss/main.scss'

// 初始化应用设置
initAppSettings()

const app = createApp(App)

app.use(router)
app.use(i18n)

app.mount('#app')
