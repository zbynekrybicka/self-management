import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import FrontaView from '../views/FrontaView.vue'
// import StatistikyView from '../views/StatistikyView.vue'
import DokonceneView from '../views/DokonceneView.vue'
import WidgetyView from '../views/WidgetyView.vue'
// import PlanovaniView from '../views/PlanovaniView.vue'

const routes = [
  {
    path: '/dokoncene',
    name: 'dokoncene',
    component: DokonceneView
  },
  {
    path: '/widgety',
    name: 'widgety',
    component: WidgetyView
  },
  {
    path: '/ukoly/:id?',
    name: 'ukoly',
    component: HomeView
  },
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
