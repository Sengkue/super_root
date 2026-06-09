import { useAuthStore } from '~/stores/auth';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  
  if (!authStore.isLoggedIn) {
    // Routes that are always allowed for guests
    const allowedPaths = ['/login', '/register', '/', '/search'];
    
    if (allowedPaths.includes(to.path)) {
      return;
    }
    
    // Allow the "All" feed menu
    if (to.path === '/feed') {
      const tab = to.query.tab;
      if (!tab || tab === 'all') {
        return;
      }
    }
    
    // Redirect to login for all other routes if not logged in
    return navigateTo('/login');
  }
});
