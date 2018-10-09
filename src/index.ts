import Vue from 'vue'
import * as ElementUI from 'element-ui'
import App from './components/App.vue'

Vue.use(ElementUI);

new Vue({
  el: '#app',
  render(h) {
    return h(App);
  }
});