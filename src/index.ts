import Vue from 'vue'
import * as ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import store from './store'
import App from './components/App.vue'
import '@/interface/store'

Vue.use(ElementUI);
Vue.use(VueResource);

new Vue({
  el: '#app',
  store,
  render(h) {
    return h(App);
  }
});
