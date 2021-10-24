import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Visualizer from './pages/Visualizer'
import About from './pages/About'
import Recommender from './pages/Recommendations'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/visualizer',
      name: 'about',
      component: Visualizer
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/recommender',
      name: 'Get Recommendations',
      component: Recommender
    }
  ]
})
