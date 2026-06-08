import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    activeUserId: null,
    activeUserObj: null,
    users: []
  }),
  
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
      if (userObj) {
        this.activeUserObj = userObj;
      } else {
        this.fetchCurrentUser();
      }
    },
    
    logout() {
      this.activeUserId = null;
      this.activeUserObj = null;
    },
    
    requireAuth() {
      if (!this.isLoggedIn) {
        navigateTo('/login');
      }
      return this.isLoggedIn;
    }
  }
});
