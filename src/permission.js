import router from "@/router";
import store from "@/store";
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404']
router.beforeEach(async (to, from, next) => {
    NProgress.start()
  if (store.getters.token) {
    if (to.path === "/login") {
        next('/')
    }else{
        if(!store.getters.userId){
          const ret = await store.dispatch('user/getUserInfo')

          const userAsyncRoutes = await store.dispatch('permission/filterRoutes',ret.roles.menus)

          router.addRoutes([...userAsyncRoutes,{ path: '*', redirect: '/404', hidden: true }])

          console.log(1,userAsyncRoutes)

          next(to.path)
        }

        next()
    }
  }else{
    if (whiteList.indexOf(to.path) > -1) {
        next()
    }else{
        next('/login')
        
    }
  }
  NProgress.done()
});

router.afterEach(()=>{
    NProgress.done()
});
