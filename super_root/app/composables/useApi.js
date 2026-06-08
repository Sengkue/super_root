export const useApi = () => {
  const config = useRuntimeConfig();
  
  return $fetch.create({
    baseURL: config.public.apiBase
  });
};

export const useApiFetch = (request, opts) => {
  const config = useRuntimeConfig();
  return useFetch(request, { baseURL: config.public.apiBase, ...opts });
};
