<template>
  <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
    <header class="flex justify-between items-center px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
      <div class="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Super Root</div>
      <nav class="flex gap-6 items-center">
        <div class="relative w-64 ml-2">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery" 
            @keyup.enter="handleSearch" 
            :placeholder="$t('nav.search')" 
            class="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block pl-9 p-1.5 transition-colors"
          >
        </div>
        
        <div class="flex items-center gap-4 ml-4 pl-4 border-l border-slate-300 dark:border-slate-700">
          <template v-if="authStore.isLoggedIn">
            <!-- Invisible overlay to close menus -->
            <div v-if="showUserMenu" @click="closeMenus" class="fixed inset-0 z-40"></div>
            
            <!-- Notifications Bell -->
            <NotificationBell class="mr-2" ref="notifBell" @toggled="onNotifToggled" />

            <div class="relative z-50">
              <button @click="showUserMenu = !showUserMenu" class="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors focus:outline-none bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 px-2 py-1.5 rounded-full border border-transparent hover:border-slate-300 dark:border-slate-700">
                <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-sm text-slate-900 dark:text-white overflow-hidden shrink-0">
                  <img v-if="authStore.activeUserObj?.profile?.profileImage" :src="authStore.activeUserObj.profile.profileImage" class="w-full h-full object-cover" />
                  <span v-else>{{ authStore.activeUser?.username?.charAt(0).toUpperCase() || 'U' }}</span>
                </div>
                <span class="text-sm font-medium">{{ authStore.activeUser?.username || 'User' }}</span>
                <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              
              <div v-if="showUserMenu" class="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden z-50 transform transition-all duration-200 origin-top-right">
                <NuxtLink to="/user/profile" @click="showUserMenu = false" class="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 hover:text-slate-900 dark:text-white transition-colors">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                  {{ $t('nav.profile') }}
                </NuxtLink>
                <div class="border-t border-slate-300 dark:border-slate-700"></div>
                <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  {{ $t('nav.logout') }}
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:text-slate-50">{{ $t('nav.login') }}</NuxtLink>
            <NuxtLink to="/auth/register" class="bg-blue-600 text-slate-900 dark:text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">{{ $t('nav.signup') }}</NuxtLink>
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
              <span class="icon">📰</span> {{ $t('nav.all') }}
            </NuxtLink>
            <NuxtLink to="/feed?tab=following" class="nav-item" :class="{ 'active': $route.path === '/feed' && $route.query.tab === 'following' }">
              <span class="icon">👥</span> {{ $t('nav.following') }}
            </NuxtLink>
            <NuxtLink to="/feed?tab=foryou" class="nav-item" :class="{ 'active': $route.path === '/feed' && $route.query.tab === 'foryou' }">
              <span class="icon">✨</span> {{ $t('nav.foryou') }}
            </NuxtLink>
            <NuxtLink to="/user/friends" class="nav-item" :class="{ 'active': $route.path === '/user/friends' }">
              <span class="icon">👥</span> {{ $t('nav.friends') }}
            </NuxtLink>
            <NuxtLink to="/chat" class="nav-item" :class="{ 'active': $route.path.startsWith('/chat') }">
              <span class="icon">💬</span> Messages
            </NuxtLink>
            <NuxtLink to="/user/saved" class="nav-item" :class="{ 'active': $route.path === '/user/saved' }">
              <span class="icon">🔖</span> {{ $t('nav.saved') }}
            </NuxtLink>
            <NuxtLink to="/settings" class="nav-item" :class="{ 'active': $route.path === '/settings' }">
              <span class="icon">⚙️</span> {{ $t('nav.settings') }}
            </NuxtLink>
            <button v-if="showInstallAppButton" @click="installPWA" class="nav-item text-left w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:from-blue-500 hover:to-purple-500 border-none shadow-md">
              <span class="icon">📱</span> Install App
            </button>
          </nav>
        </aside>

        <!-- Main Content -->
        <div class="main-content">
          <slot />
        </div>

        <!-- Right Sidebar -->
        <aside class="sidebar right-sidebar">
          <div class="widget">
            <h3>{{ $t('nav.sponsored') }}</h3>
            <div class="ad-placeholder">Super Root Ad</div>
          </div>
        </aside>
      </div>
    </main>

    <footer class="p-6 text-center text-slate-900 dark:text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 text-sm mt-8">
      <p>&copy; 2026 Super Root. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useApi } from '#imports';

const authStore = useAuthStore();
const $api = useApi();
const searchQuery = ref('');
const showUserMenu = ref(false);
const notifBell = ref(null);

// PWA Install State
const deferredPrompt = ref(null);
const showInstallAppButton = ref(false);

const closeMenus = () => {
  showUserMenu.value = false;
  if (notifBell.value) notifBell.value.closeMenu();
};

const onNotifToggled = (isOpen) => {
  if (isOpen) showUserMenu.value = false;
};

// Utility functions specific to this layout can go here if needed

onMounted(() => {
  
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt.value = e;
    showInstallAppButton.value = true;
  });
});

onUnmounted(() => {
  // Any cleanup
});

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value.trim())}`);
  }
};

const handleLogout = () => {
  closeMenus();
  authStore.logout();
  navigateTo('/auth/login');
};

const installPWA = async () => {
  if (!deferredPrompt.value) return;
  deferredPrompt.value.prompt();
  const { outcome } = await deferredPrompt.value.userChoice;
  if (outcome === 'accepted') {
    showInstallAppButton.value = false;
  }
  deferredPrompt.value = null;
};
</script>

<style scoped>
@reference "../assets/css/main.css";

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
  @apply bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700;
  padding: 1rem;
  border-radius: 1rem;
  border-width: 1px;
  border-style: solid;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  @apply text-slate-600 dark:text-slate-400;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
}

.nav-item:hover, .nav-item.active {
  @apply bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-slate-50;
}

.nav-item.active {
  @apply bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 font-semibold;
}

.icon {
  font-size: 1.25rem;
}

.main-content {
  width: 100%;
}

.widget {
  @apply bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700;
  padding: 1.5rem;
  border-radius: 1rem;
  border-width: 1px;
  border-style: solid;
}

.widget h3 {
  font-size: 1rem;
  @apply text-slate-600 dark:text-slate-400;
  margin-bottom: 1rem;
}

.ad-placeholder {
  @apply bg-slate-50 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400;
  border-width: 1px;
  border-style: dashed;
  border-radius: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
