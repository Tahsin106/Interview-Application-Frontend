import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from "axios"
import {hostname} from '../assets/variables'

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'FrontPage',
    component: () => import('../views/FrontPage.vue'),
    beforeEnter(to, from, next) {

      const username = localStorage.getItem('username');
      const joinCode =  localStorage.getItem('joinCode');
      const role = localStorage.getItem('role');

      axios.get(hostname+"/validate?username="+username+"&code=" + joinCode + "&role=" + role )
        .then((res) => {
          console.log(res.data);
          router.push('/home');
        })
        .catch(err => {
          console.log(err);
          next();
        });
    }
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    beforeEnter(to, from, next) {
      const username = localStorage.getItem('username');
      const joinCode =  localStorage.getItem('joinCode');
      const role = localStorage.getItem('role');
      
      axios.get(hostname+"/validate?username="+username+"&code=" + joinCode + "&role=" + role )
        .then((res) => {
          console.log(res.data);
          next();
        })
        .catch(err => {
          //if(from.name) this.$swal("Join Failed", "", "error");
          

          console.log(err);
          router.push('/');
        });
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router