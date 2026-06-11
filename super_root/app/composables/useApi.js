import { useAuthStore } from '~/stores/auth';

export const useApi = () => {
  const config = useRuntimeConfig();
  
  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      const authStore = useAuthStore();
      const authCookie = useCookie('auth_user_id');
      const userId = authStore.activeUserId || authCookie.value;
      
      if (userId) {
        const headers = new Headers(options.headers || {});
        headers.set('x-user-id', String(userId));
        headers.set('userid', String(userId));
        options.headers = headers;
      }
    }
  });
};

export const useApiFetch = (request, opts) => {
  const config = useRuntimeConfig();
  const authStore = useAuthStore();
  const authCookie = useCookie('auth_user_id');
  const userId = authStore.activeUserId || authCookie.value;
  const headers = userId ? { 'x-user-id': userId, 'userid': userId, ...(opts?.headers || {}) } : opts?.headers;
  return useFetch(request, { baseURL: config.public.apiBase, ...opts, headers });
};
