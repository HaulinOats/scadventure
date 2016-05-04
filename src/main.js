import Vue from 'vue'
import Router from 'vue-router'
import VueFire from 'vuefire'
import { domain, fromNow } from './filters'
import App from './components/App.vue'
import NewsView from './components/NewsView.vue'
import ItemView from './components/ItemView.vue'
import UserView from './components/UserView.vue'
import HomeView from './components/HomeView.vue'
import LoginView from './components/LoginView.vue'
import ModalView from './components/ModalView.vue'
import CreateHuntView from './components/CreateHuntView.vue'
import ProfileView from './components/ProfileView.vue'
import ShowHuntsView from './components/ShowHuntsView.vue'
import SingleHuntView from './components/SingleHuntView.vue'

// install router
Vue.use(Router)
Vue.use(VueFire)
// register filters globally
Vue.filter('fromNow', fromNow)
Vue.filter('domain', domain)

// routing
var router = new Router()

router.map({
  '/': {
    component: HomeView
  },
  '/login': {
    component: LoginView
  },
  '/my-profile/:id': {
    component: ProfileView
  },
  '/create-hunt': {
    component: CreateHuntView
  },
  '/my-hunts': {
    component: ShowHuntsView
  },
  '/view-hunt/:id': {
    component: SingleHuntView,
    name:"SingleHuntView"
  },
  '/news/:page': {
    component: NewsView
  },
  '/user/:id': {
    component: UserView
  },
  '/item/:id': {
    component: ItemView
  }
})

router.beforeEach(function () {
  window.scrollTo(0, 0)
})

router.redirect({
  '*': '/'
})

router.start(App, '#app')
