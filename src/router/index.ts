import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ShowView from '@/views/ShowView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/shows/:id', name: 'show-details', component: ShowView, props: true },
    { path: '/:pathMatch(.*)*', name: 'not-found', redirect: '/' },
  ],
});

export default router;
