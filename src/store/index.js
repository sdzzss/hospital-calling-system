import axios from 'axios';
import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
    //首次登陆状态
    isGetterRouter:false,
    //侧边栏折叠状态
    isCollapsed:false,
    userInfo:{}
    
  },
  getters: {
  },
  mutations: {
    //控制首次登录状态
    changeGetterRouter(state,value){
      state.isGetterRouter = value;
    },
    //控制侧边栏展开
    changeCollapsed(state){
      state.isCollapsed = !state.isCollapsed
    },

    changeUserInfo(state,value){
      state.userInfo = {
        ...state.userInfo,
        ...value
      }
    },
    clearUserInfo(state,value){
      state.userInfo = {}
    }
  },
  actions: {
  },
  modules: {
    beforeunloadHandler(e) {
      
    }
  },
  plugins: [createPersistedState({
    //paths 控制是否持久化
    paths:["isCollapsed","userInfo"]
  })]
})
