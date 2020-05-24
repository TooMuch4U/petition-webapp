import Vue from 'vue';
import Petitions from './Petitions.vue';
import Petition from './Petition.vue';
import Login from './Login.vue';
import Logout from './Logout.vue'
import Register from './Register.vue';
import Profile from './Profile.vue';

import App from './App.vue';
import Home from './Home.vue';
import Users from './Users.vue';



import axios from 'axios';
import VueAxios from 'vue-axios';

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.use(VueAxios, axios);

import VueRouter from 'vue-router';
Vue.use(VueRouter);
const routes =  [
    {
        path: "/petitions",
        name: "petitions",
        component: Petitions
    },
    {
        path: "/petitions/:id",
        name: "petition",
        component: Petition
    },
    {
        path: "/register",
        name: "register",
        component: Register
    },
    {
       path: "/login",
       name: "login",
       component: Login
    },
    {
        path: "/logout",
        name: "logout",
        component: Logout
    },
    {
        path: "/",
        component: Home
    },
    {
        path: "/profile",
        name: "profile",
        component: Profile
    }
];
const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
