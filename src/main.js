import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Sunflower from 'vue-sunflower'
// import ElementUI from 'element-ui'

// import 'element-ui/lib/theme-chalk/index.css'

// import 'form-making/dist/FormMaking.css'
// import FormMaking from 'form-making'
import FormMaking from './index'
Vue.use(FormMaking)

Vue.config.productionTip = false

// Vue.use(ElementUI, { size: 'small' })
Vue.use(Sunflower)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
