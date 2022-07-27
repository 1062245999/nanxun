import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Index from "@/views/Index/Index.vue";
import ScenicDetail from "@/views/ScenicDetail/ScenicDetail.vue";
Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '*',
    redirect: '/',
  },
  {
    path: '/',
    name: 'index',
    component: Index,
    meta: {
      keepalive: true
    }
  },
  {
    path: '/scenic-detail',
    name: 'scenic-detail',
    component: ScenicDetail,
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
