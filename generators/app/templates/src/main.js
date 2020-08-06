
import Vue from 'vue'
import App from './App'
import router from './assets/router'
// js兼容性处理
import './assets/compatibility'
import './assets/iconfont/iconfont.js'
import './assets/iconfont/iconfont.css'
// 公共方法
import globalMethod from './assets/globalMethods'
Vue.use(globalMethod)


// http 模块npm
import axios from './assets/axios';
Vue.use(axios, {
    timeout: 20000,
    /** 跨域代理
     *  @填写代理地址 在ip.js中配置需要代理的域名, 比如 http://8.8.8.8
     *  @绑定代理 在vue.config.js中配置proxy选项, 比如 /api 开头的进行代理
     *  @页面中的请求 this.$http.post('/backstage/pieces/find')
     *  @实际代理路径 http://8.8.8.8/api/backstage/pieces/find http://168.168.168.10:8088 http://47.111.158.177:8088
     */
    withCredentials: true,//启用跨域支持
    baseURL: "/m-web"
});

import global_ from '@/pages/Global.vue';
Vue.prototype.GLOBAL = global_

//钉钉前端jsapi引入
import * as dd from 'dingtalk-jsapi';  // 此方式为整体加载，也可按需进行加载
Vue.use(dd);
Vue.prototype.dd=dd;
window.dd = dd;

import VueSignaturePad from 'vue-signature-pad';
Vue.use(VueSignaturePad);

// 公共事件监听器
import eventHub from './assets/eventHub';
Vue.use(eventHub);

// 手势
import VueTouch from 'vue-touch'
Vue.use(VueTouch, {name: 'v-touch'})

// 组件库
import vantUI from 'vant-ui'; //npm库
Vue.use(vantUI);


// 框架样式
import '@/scss/index.scss';


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
