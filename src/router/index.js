import Vue from 'vue'
import VueRouter from 'vue-router'
//import UserList from '../views/UserList.vue'
import ChatBoard from '../views/ChatBoard.vue'
import LoginPage from '../views/LoginPage.vue'
import SignUp from '../views/SignUp.vue'
import RoomList from '../views/RoomList.vue'
import ProfilePage from '../views/ProfilePage.vue'
//import firebase from "@/firebase/firebase"

Vue.use(VueRouter)
Vue.directive('scroll', {
  inserted: function (el, binding) {
    let f = function (evt) {
      if (binding.value(evt, el)) {
        window.removeEventListener('scroll', f)
      }
    }
    window.addEventListener('scroll', f)
  }
})
const routes = [
  {
    path: '/',
    name: 'ChatBoard',
    component: ChatBoard,
    meta: {requiresAuth: true}
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/room',
    name: 'RoomList',
    component: RoomList
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/profilepage',
    name: 'ProfilePage',
    component: ProfilePage
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    const user = sessionStorage.getItem('user')
    console.log(JSON.parse(user))
      if (!user) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
/*     firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    })*/
  } else {
    next() // next() を常に呼び出すようにしてください!
  } 
})

export default router
