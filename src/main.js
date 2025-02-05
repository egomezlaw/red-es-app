import './assets/main.css';

import App from './App.vue';
import { createApp } from 'vue';

import Header from './components/Header.vue';

import TextAnimator from './components/TextAnimator.vue';

import FilterHome from './components/FilterHome.vue';
import Schools from './components/Schools.vue';
import Projects from './components/Projects.vue';
import Globe from './components/Globe.vue';

import ListPicker from './components/ListPicker.vue';
import NavButton from './components/NavButton.vue';

const app = createApp(App);
app.component('Globe', Globe);
app.component('Header', Header);
app.component('TextAnimator', TextAnimator);
app.component('FilterHome', FilterHome);
app.component('Schools', Schools);
app.component('Projects', Projects);
app.component('ListPicker', ListPicker);
app.component('NavButton', NavButton);
app.mount('#app');
