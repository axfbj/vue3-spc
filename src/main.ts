import { createApp } from 'vue'
import App from './App.vue'
import LayoutStore from './components/index'
import './styles/index.css'
import router from './router'
import 'vfonts/Lato.css'
import 'vfonts/FiraCode.css'
import 'virtual:svg-icons-register'
import { DeviceType } from './types/store'
import './utils/router'
import '../mock'
import pinia from './store/pinia'
import directives from './directive'
// import axios from 'axios'

function getScreenType() {
  const width = document.body.clientWidth
  if (width <= 768) {
    return DeviceType.MOBILE
  } else if (width < 992 && width > 768) {
    return DeviceType.PAD
  } else if (width < 1200 && width >= 992) {
    return DeviceType.PC
  } else {
    return DeviceType.PC
  }
}

const app = createApp(App)
app.use(directives)
app.use(LayoutStore, {
  state: {
    device: getScreenType(),
  },
  actions: {
    onLogout() {
      router.replace({ path: '/login', query: { redirect: '/' } }).then(() => {
        window.location.reload()
      })
    },
  },
})

// const obj: { [k: string]: any } = {
//   a: 1,
//   b: 2,
//   c: 3,
// }
// for (const k in obj) {
//   const v = obj[k]
// }
// //上面的接口也可以这样写
// axios({
//   url: 'http://123.207.32.32:8000/home/data',
//   //这写的是url的参数，专门针对get请求的参数拼接
//   params: {
//     type: 'pop',
//     page: 3,
//   },
// }).then((res) => {
//   console.log(res)
// })

app.use(pinia)
app.use(router)
router.isReady().then(() => {
  app.mount('#app')
})
