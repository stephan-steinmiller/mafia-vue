import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import RoleSelection from '../views/RoleSelection.vue'
import PlayerWaiting from '../views/PlayerWaiting.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/roles',
    name: 'RoleSelection',
    component: RoleSelection
  },
  {
    path: '/playerWaiting',
    name: 'PlayerWaiting',
    component: PlayerWaiting
  },
  {
    path: '/night',
    name: 'Night',
    component: () => import(/* webpackChunkName: "night" */ '../views/Night.vue')
  },
  {
    path: '/day',
    name: 'Day',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "night" */ '../views/Day.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
