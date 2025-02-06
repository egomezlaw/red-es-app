import './assets/main.css';

import App from './Results.vue';
import { createApp } from 'vue';

import Footer from './components/Footer.vue';
import TextAnimator from './components/TextAnimator.vue';
import Globe from './components/Globe.vue';
import Summary from './components/Summary.vue';

const app = createApp(App);
app.component('Header', Footer);
app.component('TextAnimator', TextAnimator);
app.component('Summary', Summary);
app.component('Globe', Globe);
app.mount('#app');