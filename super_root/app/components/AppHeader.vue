<template>
  <div>
    <!-- DESKTOP HEADER -->
    <header class="hidden md:flex justify-between items-center px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20">
      <div class="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Super Root</div>
      <nav class="flex gap-6 items-center">
        <NuxtLink to="/feed?tab=all" class="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:text-slate-50 transition-colors" :class="{ 'text-blue-500': $route.path === '/feed' && $route.query.tab === 'all' }">All</NuxtLink>
        <NuxtLink to="/feed?tab=following" class="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:text-slate-50 transition-colors" :class="{ 'text-blue-500': $route.path === '/feed' && $route.query.tab === 'following' }">Following</NuxtLink>
        <NuxtLink to="/feed?tab=foryou" class="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:text-slate-50 transition-colors" :class="{ 'text-blue-500': $route.path === '/feed' && $route.query.tab === 'foryou' }">For You</NuxtLink>
        <NuxtLink to="/user/profile" class="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:text-slate-50 [&.router-link-active]:text-blue-500">Profile</NuxtLink>
        
        <div class="relative w-48 lg:w-64 ml-2">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery" 
            @keyup.enter="handleSearch" 
            placeholder="Search..." 
            class="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block pl-9 p-1.5 transition-colors"
          >
        </div>
        
        <div class="flex items-center gap-4 ml-4 pl-4 border-l border-slate-300 dark:border-slate-700">
          <template v-if="authStore.isLoggedIn">
            <!-- Invisible overlay to close menu -->
            <div v-if="showUserMenu" @click="showUserMenu = false" class="fixed inset-0 z-40"></div>
            
            <div class="relative z-50">
              <button @click="showUserMenu = !showUserMenu" class="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:text-white transition-colors focus:outline-none bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 px-2 py-1.5 rounded-full border border-transparent hover:border-slate-300 dark:hover:border-slate-700">
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
                  Profile
                </NuxtLink>
                <div class="border-t border-slate-300 dark:border-slate-700"></div>
                <button @click="handleLogout" class="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                  Logout
                </button>
              </div>
            </div>
          </template>
          <template v-else>
            <NuxtLink to="/auth/login" class="text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:text-slate-50">Log In</NuxtLink>
            <NuxtLink to="/auth/register" class="bg-blue-600 text-slate-900 dark:text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">Sign Up</NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <!-- MOBILE TOP HEADER -->
    <header class="md:hidden flex flex-col bg-white dark:bg-slate-800 sticky top-0 z-40 border-b border-slate-300 dark:border-slate-700">
      <!-- Top Row: Logo & Search -->
      <div class="flex justify-between items-center px-4 py-3 gap-3">
        <div class="text-2xl font-bold text-blue-500 tracking-tight hidden sm:block">superroot</div>
        
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-4 h-4 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery" 
            @keyup.enter="handleSearch" 
            placeholder="Search..." 
            class="w-full bg-slate-100 dark:bg-slate-700 border-none text-slate-800 dark:text-slate-200 text-sm rounded-full focus:ring-2 focus:ring-blue-500 block pl-9 p-2 transition-colors"
          >
        </div>

        <NuxtLink to="/menu" class="w-10 h-10 shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 [&.router-link-active]:text-blue-500 [&.router-link-active]:bg-blue-500/20">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </NuxtLink>
      </div>
    </header>

    <!-- MOBILE BOTTOM NAVIGATION -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 flex justify-between items-center px-2 pb-2 pt-1">
      <NuxtLink to="/feed?tab=all" class="flex-1 py-3 flex justify-center text-slate-600 dark:text-slate-400 rounded-lg transition-colors" :class="{ 'text-blue-500': $route.path === '/feed' && $route.query.tab === 'all' }">
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path><path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
      </NuxtLink>
      <NuxtLink to="/feed?tab=following" class="flex-1 py-3 flex justify-center text-slate-600 dark:text-slate-400 rounded-lg transition-colors" :class="{ 'text-blue-500': $route.path === '/feed' && $route.query.tab === 'following' }">
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
      </NuxtLink>
      <NuxtLink to="/feed?tab=foryou" class="flex-1 py-3 flex justify-center text-slate-600 dark:text-slate-400 rounded-lg transition-colors" :class="{ 'text-blue-500': $route.path === '/feed' && $route.query.tab === 'foryou' }">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
      </NuxtLink>
      <NuxtLink to="/user/profile" class="flex-1 py-3 flex justify-center text-slate-600 dark:text-slate-400 rounded-lg transition-colors" :class="{ 'text-blue-500': $route.path === '/user/profile' }">
        <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
      </NuxtLink>
    </nav>
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
  navigateTo('/auth/login');
};
</script>
