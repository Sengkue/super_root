export const useApi = () => {
  const config = useRuntimeConfig();
  const authCookie = useCookie('auth_user_id');
  
  return $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ request, options }) {
      if (authCookie.value) {
        options.headers = options.headers || {};
        options.headers['x-user-id'] = authCookie.value;
      }
    }
  });
};

export const useApiFetch = (request, opts) => {
  const config = useRuntimeConfig();
  const authCookie = useCookie('auth_user_id');
  const headers = authCookie.value ? { 'x-user-id': authCookie.value, ...(opts?.headers || {}) } : opts?.headers;
  return useFetch(request, { baseURL: config.public.apiBase, ...opts, headers });
};
