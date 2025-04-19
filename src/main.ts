import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/styles/styles.scss'

//  Plugins
import vuetify from "./plugins/vuetify"
import store from './store/index'

const app = createApp(App)


app.use(router).use(vuetify).use(store)

app.mount('#app')


