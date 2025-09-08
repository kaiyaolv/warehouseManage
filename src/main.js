import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import i18n from './i18n'
import store from './store'
import global from 'global'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/iconfont/iconfont.css'
import * as echarts from 'echarts'
import { provinceListNew } from '@/utils/initData.js'
import { mixin } from '@/mixins/commonMixins.js';
import md5 from 'js-md5';
import './assets/icons' // icon
import SecretTip from '@/components/SecretTip'
import {
  message
} from '@/utils/resetMessage';

Vue.prototype.$echarts = echarts

Vue.use(ElementUI)
Vue.use(api)
Vue.mixin(mixin)

Vue.prototype.global = global
Vue.prototype.$message = message
Vue.prototype.$provinceList = provinceListNew;
Vue.prototype.$md5 = md5;
Vue.component('SecretTip', SecretTip);

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
});
