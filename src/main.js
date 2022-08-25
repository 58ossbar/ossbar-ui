import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import i18n from './i18n'
import store from './store'
import global from '@/utils/global'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'
import '@/assets/iconfont/iconfont.css'
// element拖拽js插件
import '../static/creatorblue/directives.js'
// 自定义公共样式
import '../static/creatorblue/comm.css'

Vue.use(ElementUI)
Vue.use(api)

Vue.prototype.global = global

/* 加载创蓝全局组件start */
import CbDict from '@/components/CbDict'
import CbParam from '@/components/CbParam'
import CbUpload from '@/components/CbUpload'
// import CbEditor from '@/components/cb-editor'
import CbTree from '@/components/CbTree'
import CbTreePanel from '@/components/CbTreePanel'
import CbTabels from '@/components/CbTables'
import CbAutoComplete from '@/components/CbAutoComplete'
const components = [
  CbDict,
  CbParam,
  CbUpload,
  // CbEditor,
  CbTreePanel,
  CbTree,
  CbTabels,
  CbAutoComplete
]
components.forEach(component => {
  Vue.component(component.name, component)
})
/* 加载创蓝全局组件end */

new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App)
})
