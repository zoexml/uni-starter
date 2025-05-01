import { createSSRApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './stores'

import '@/styles/index.scss'
import 'uno.css'

export function createApp() {
  const app = createSSRApp(App)
  app.use(store)
  app.use(router)
  return {
    app,
    store,
    router,
  }
}
