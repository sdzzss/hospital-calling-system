import { createRouter, createWebHashHistory,createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'  //@ 指向src目录的绝对路径
import MainBox from '@/views/MainBox.vue'
import RoutesConfig from './config'
import store from '@/store'

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/mainbox",
    name: "mainbox",
    component: MainBox
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  // history: createWebHistory(),
  routes
})

//路由拦截，每次路由跳转之前
router.beforeEach((to,from,next)=>{
  //登录页面不拦截
  if(to.name === "login"){
    next();
  }else{
    //判断有无token
    if(!localStorage.getItem("token")){
      next({
        path: "/login"
      })
    }else{
      //判断是否为首次登录
      if(!store.state.isGetterRouter){
        ConfigRouter();
        next({
          path: to.fullPath
        });
      }else{
        next()
      }
      
    }
  }
})

const ConfigRouter = ()=>{
  RoutesConfig.forEach(item => {
    checkPermission(item) && router.addRoute("mainbox",item)
  })
  //取消首次登录状态
  store.commit("changeGetterRouter",true)
}

//权限拦截路由
const checkPermission = (item)=>{
    if (item.requireAdmin) {
      return store.state.userInfo.role===1
    }
    return true
}

export default router
