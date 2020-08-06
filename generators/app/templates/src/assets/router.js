import Vue from 'vue'
import requireAll from './_requireAll'
import VueRouter from 'vue-router'

// 引入所有路由配置
const routerObj = requireAll(require.context("@/pages", true, /router\.js$/));
let routes = [];
for(let i = 0, len = routerObj.length; i < len; i++){
    if (!routerObj[i].default) {
        continue
    }
    if (routerObj[i].default.length>0) {
        // 数组类型的路由
        for(let n = 0, le = routerObj[i].default.length; n < le; n++){
            routes.push(routerObj[i].default[n])
        }
    }else{
        routes.push(routerObj[i].default)
    }
}

routes = [
    {
        path: '/',
        redirect: {
            path:'/imlogin',    
        }, //重定向
    },
    
    ...routes
]

// 路由插件
Vue.use(VueRouter);
// 路由集合
const router= new VueRouter({
  // mode: 'history',
  // base: '/m-web/mobilevue/',
  routes
})

router.beforeEach((to, from, next) => {
  // console.log("路由守卫，测试")
  // let path = to.path;
  window.scrollTo(0, 0)
  next();
});

export default router