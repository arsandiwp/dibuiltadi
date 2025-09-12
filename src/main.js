import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

import { createPinia } from 'pinia';
import router from "./router";
import "./plugins/axios";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.use(router);
app.mount("#app");

// createApp(App).use(router).mount('#app')
