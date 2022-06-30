import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { Swipe, SwipeItem } from 'vant';
import "vant/es/swipe/style";
import "vant/es/swipe-item/style";
import { Loading } from 'element-ui';
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Loading)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')


