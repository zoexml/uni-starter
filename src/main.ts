import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { installVueErrorHandler } from './utils/global-error-reporting'

import '@/styles/index.scss'
import 'uno.css'

export function createApp() {
  const app = createSSRApp(App)
  installVueErrorHandler(app)
  app.use(pinia)
  app.use(router)
  return {
    app,
    pinia,
    router,
  }
}
