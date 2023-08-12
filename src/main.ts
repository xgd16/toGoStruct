import { createApp } from 'vue'
import "./style.css"
import 'element-plus/dist/index.css'
import App from './App.vue'
import './samples/node-api'
import ElementPlus from 'element-plus'

createApp(App).use(ElementPlus)
    .mount('#app')
    .$nextTick(() => {
        postMessage({payload: 'removeLoading'}, '*')
    }).then(r =>{})
