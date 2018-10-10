import Vue from 'vue'
import * as ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import store from './store'
import router from './router'
import App from './App.vue'

Vue.use(ElementUI);
Vue.use(VueResource);

new Vue({
  el: '#app',
  store,
  router,
  render(h) {
    return h(App);
  }
});
