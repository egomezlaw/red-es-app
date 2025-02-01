import { createRouter, createWebHistory } from 'vue-router';
import DataWindow from '../views/DataWindow.vue';

const routes = [
  { path: '/DataWindow', component: DataWindow },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;