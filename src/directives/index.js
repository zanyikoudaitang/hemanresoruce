export default  {
    imageError:{
        inserted(dom,options){
            dom.onerror = function(){
                dom.src = options.value
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

