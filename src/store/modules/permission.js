import { constantRoutes, asyncRoutes } from "@/router";

export default {
  namespaced: true,
  state:{
    routes:[...constantRoutes]

  },
  mutations:{
    setRoutes(state,currentAsyncRoutes) {
        state.routes = [...constantRoutes, ...currentAsyncRoutes];
    }
  },
  actions:{
    filterRoutes(context,menus){
        const routes = asyncRoutes.filter(it => {
           return menus.includes(it.meat.rule)
        })
        context.commit('setRoutes',routes)

        // 把当前用户的所有的动态路由routes返回
        return routes
    }
  },
};
