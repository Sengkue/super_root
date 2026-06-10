import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => {
    const authCookie = useCookie('auth_user_id');
    return {
      activeUserId: authCookie.value || null,
      activeUserObj: null,
      users: []
    };
  },
  
  getters: {
    activeUser: (state) => state.activeUserObj || state.users.find(u => u.id === state.activeUserId) || null,
    isLoggedIn: (state) => !!state.activeUserId
  },
  
  actions: {
    async fetchUsers() {
      try {
        const $api = useApi();
        const res = await $api('/posts/users');
        if (res.success && res.data.length > 0) {
          this.users = res.data;
        }
      } catch (err) {
        console.error('Failed to load users for store', err);
      }
    },

    async fetchCurrentUser() {
      if (!this.activeUserId) return;
      try {
        const $api = useApi();
        const res = await $api(`/users/${this.activeUserId}`);
        if (res.success) {
          this.activeUserObj = res.data;
        }
      } catch (err) {
        console.error('Failed to load current user', err);
      }
    },
    
    setAuth(userId, userObj = null) {
      this.activeUserId = userId;
      
      // Persist the user ID in a cookie
      const authCookie = useCookie('auth_user_id');
      authCookie.value = userId;

      if (userObj) {
        this.activeUserObj = userObj;
      } else {
        this.fetchCurrentUser();
      }
    },
    
    logout() {
      this.activeUserId = null;
      this.activeUserObj = null;
      
      // Clear the cookie
      const authCookie = useCookie('auth_user_id');
      authCookie.value = null;
    },
    
    requireAuth() {
      if (!this.isLoggedIn) {
        navigateTo('/auth/login');
      }
      return this.isLoggedIn;
    }
  }
});
