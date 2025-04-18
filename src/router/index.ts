import { createRouter, createWebHistory } from 'vue-router';
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(),
  routes
});
console.log(router);
console.log('Routes:', routes);
export default router;