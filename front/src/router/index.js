import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
// import FrontaView from '../views/FrontaView.vue'
// import StatistikyView from '../views/StatistikyView.vue'
import DokonceneView from '../views/DokonceneView.vue'
// import PlanovaniView from '../views/PlanovaniView.vue'

const routes = [
  {
    path: '/:id?',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dokoncene',
    name: 'dokoncene',
    component: DokonceneView
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
