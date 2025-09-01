import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

import '@/styles/index.scss'
import 'uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(router)
  return {
    app,
    pinia,
    router,
  }
}
