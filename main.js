// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
import uviewPlus from '@/uni_modules/uview-plus'
import customNavBar from '@/components/custom-nav-bar/index.vue'
import customTabBar from '@/components/custom-tab-bar/index.vue'
import pinia from './store'

export function createApp() {
  const app = createSSRApp(App)
  app.use(pinia)
  app.use(uviewPlus)
  app.component('customNavBar', customNavBar)
  app.component('customTabBar', customTabBar)
  return {
    app,
    pinia
  }
}
// #endif