import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FrontaView from '../views/FrontaView.vue'
import StatistikyView from '../views/StatistikyView.vue'
import DokonceneView from '../views/DokonceneView.vue'
import PlanovaniView from '../views/PlanovaniView.vue'

const routes = [
  {
    path: '/',
    name: 'fronta',
    component: FrontaView,
  },
  {
    path: '/ukoly',
    name: 'home',
    component: HomeView
  },
  {
    path: '/statistiky',
    name: 'statistiky',
    component: StatistikyView
  },
  {
    path: '/ukoly/:id(\\d+)?',
    name: 'ukol',
    component: HomeView
  },
  {
    path: '/planovani',
    name: 'planovani',
    component: PlanovaniView
  },
  {
    path: '/dokoncene/:id(\\d+)?',
    name: 'dokoncene',
    component: DokonceneView
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
