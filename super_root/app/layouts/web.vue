<template>
  <div class="flex flex-col min-h-screen bg-slate-900">
    <header class="flex justify-between items-center px-8 py-4 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-20">
      <div class="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Super Root</div>
      <nav class="flex gap-6 items-center">
        <div class="relative w-64 ml-2">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery" 
            @keyup.enter="handleSearch" 
            placeholder="Search..." 
            class="w-full bg-slate-900/50 border border-slate-700 text-slate-200 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block pl-9 p-1.5 transition-colors"
          >
        </div>
        
        <div class="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
          <template v-if="authStore.isLoggedIn">
            <!-- Invisible overlay to close menu -->
            <div v-if="showUserMenu" @click="showUserMenu = false" class="fixed inset-0 z-40"></div>
            
            <div class="relative z-50">
              <button @click="showUserMenu = !showUserMenu" class="flex items-center gap-2 text-slate-300 hover:text-white transition-colors focus:outline-none bg-slate-800/50 hover:bg-slate-800 px-2 py-1.5 rounded-full border border-transparent hover:border-slate-700">
                <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-sm text-white overflow-hidden shrink-0">
                  <img v-if="authStore.activeUserObj?.profile?.profileImage" :src="authStore.activeUserObj.profile.profileImage" class="w-full h-full object-cover" />
                  <span v-else>{{ authStore.activeUser?.username?.charAt(0).toUpperCase() || 'U' }}</span>
                </div>
                <span class="text-sm font-medium">{{ authStore.activeUser?.username || 'User' }}</span>
                <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div v-if="showUserMenu" class="absolute right-0 mt-3 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 transform transition-all duration-200 origin-top-right">
                <NuxtLink to="/profile" @click="showUserMenu = false" class="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                  Profile
                </NuxtLink>
                <div class="border-t border-slate-700"></div>
                <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Logout
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="text-slate-400 font-medium hover:text-slate-50">Log In</NuxtLink>
            <NuxtLink to="/register" class="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">Sign Up</NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <main class="flex-1 p-8 w-full max-w-6xl mx-auto">
      <div class="feed-layout animate-[fadeIn_0.4s_ease-out]">
        <!-- Left Sidebar -->
        <aside class="sidebar left-sidebar">
          <nav class="side-nav">
            <NuxtLink to="/feed?tab=all" class="nav-item" :class="{ 'active': $route.path === '/feed' && ($route.query.tab === 'all' || !$route.query.tab) }">
              <span class="icon">📰</span> All
            </NuxtLink>
            <NuxtLink to="/feed?tab=following" class="nav-item" :class="{ 'active': $route.path === '/feed' && $route.query.tab === 'following' }">
              <span class="icon">👥</span> Following
            </NuxtLink>
            <NuxtLink to="/feed?tab=foryou" class="nav-item" :class="{ 'active': $route.path === '/feed' && $route.query.tab === 'foryou' }">
              <span class="icon">✨</span> For You
            </NuxtLink>
            <NuxtLink to="/friends" class="nav-item" :class="{ 'active': $route.path === '/friends' }">
              <span class="icon">👥</span> Friends
            </NuxtLink>
            <NuxtLink to="/saved" class="nav-item" :class="{ 'active': $route.path === '/saved' }">
              <span class="icon">🔖</span> Saved
            </NuxtLink>
            <div class="nav-item">
              <span class="icon">⚙️</span> Settings
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <div class="main-content">
          <slot />
        </div>

        <!-- Right Sidebar -->
        <aside class="sidebar right-sidebar">
          <div class="widget">
            <h3>Sponsored</h3>
            <div class="ad-placeholder">Super Root Ad</div>
          </div>
        </aside>
      </div>
    </main>

    <footer class="p-6 text-center text-slate-500 border-t border-slate-800 text-sm mt-8">
      <p>&copy; 2026 Super Root. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const searchQuery = ref('');
const showUserMenu = ref(false);

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
  }
};

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>

<style scoped>
.feed-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 250px;
  gap: 2rem;
  width: 100%;
}

@media (max-width: 1024px) {
  .feed-layout {
    grid-template-columns: 200px minmax(0, 1fr);
  }
  .right-sidebar {
    display: none;
  }
}

.sidebar {
  position: sticky;
  top: 100px;
  height: max-content;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--surface-color);
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
}

.nav-item:hover, .nav-item.active {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-weight: 600;
}

.icon {
  font-size: 1.25rem;
}

.main-content {
  width: 100%;
}

.widget {
  background: var(--surface-color);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.widget h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.ad-placeholder {
  background: rgba(15, 23, 42, 0.5);
  border: 1px dashed var(--border-color);
  border-radius: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
