import { createApp } from 'vue'
import App from './App.vue'
import './style.css'

import { createPinia } from 'pinia';
import router from "./router";
import "./plugins/axios";

import BaseDialog from './components/BaseDialog.vue';

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);

app.component("BaseDialog", BaseDialog);

app.use(router);
app.mount("#app");
