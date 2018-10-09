import Vue from 'vue'
import * as ElementUI from 'element-ui'
import VueResource from 'vue-resource'
import App from './components/App.vue'

Vue.use(ElementUI);
Vue.use(VueResource);

new Vue({
  el: '#app',
  render(h) {
    return h(App);
  }
});