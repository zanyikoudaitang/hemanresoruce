import store from '@/store'
export default  {
    imageError:{
        inserted(dom,options){
            dom.onerror = function(){
                dom.src = options.value
            }
        }
    },
    checkPermission:{
        inserted(dom,options){
            const has = store.state.user.userInfo.roles.points.includes(value)
              if (!has) {
                dom.style.display = 'none'
              }
        }
    }
}

// import Vue from 'vue';

// Vue.directive('imageError',{
//     inserted(el, options){
//         el.onerror = function(){
//             el.src = options.value
//             console.log(options);
//         }
//     }
// })

