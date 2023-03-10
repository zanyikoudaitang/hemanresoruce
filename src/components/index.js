import Vue from "vue";
import PageTools from './PageTools'
import UploadExcel from "./UploadExcel"
import UploadImage from "./UploadImage"

// Vue.component()


Vue.use({
    install(){
        Vue.component('pageTools',PageTools)
        Vue.component('UploadExcel', UploadExcel)
        Vue.component('UploadImage', UploadImage)
    }
})