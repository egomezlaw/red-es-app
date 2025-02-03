import './assets/main.css';

import App from './App.vue';
import { createApp } from 'vue';

import Header from './components/Header.vue';
import TextAnimator from './components/TextAnimator.vue';
import FilterHome from './components/FilterHome.vue';
import Schools from './components/Schools.vue';

import Globe from './components/Globe.vue';

const app = createApp(App);
app.component('Globe', Globe);
app.component('Header', Header);
app.component('TextAnimator', TextAnimator);
app.component('FilterHome', FilterHome);
app.component('Schools', Schools);
app.mount('#app');
