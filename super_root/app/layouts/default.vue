<template>
  <div class="flex flex-col min-h-screen bg-slate-900">
    <!-- DESKTOP HEADER -->
    <header class="hidden md:flex justify-between items-center px-8 py-4 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-20">
      <div class="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Super Root</div>
      <nav class="flex gap-6 items-center">
        <NuxtLink to="/feed?tab=all" class="text-slate-400 font-medium hover:text-slate-50 transition-colors" :class="{ 'text-blue-500': $route.path === '/feed' && $route.query.tab === 'all' }">All</NuxtLink>
        <NuxtLink to="/feed?tab=following" class="text-slate-400 font-medium hover:text-slate-50 transition-colors" :class="{ 'text-blue-500': $route.path === '/feed' && $route.query.tab === 'following' }">Following</NuxtLink>
        <NuxtLink to="/feed?tab=foryou" class="text-slate-400 font-medium hover:text-slate-50 transition-colors" :class="{ 'text-blue-500': $route.path === '/feed' && $route.query.tab === 'foryou' }">For You</NuxtLink>
        <NuxtLink to="/profile" class="text-slate-400 font-medium hover:text-slate-50 [&.router-link-active]:text-blue-500">Profile</NuxtLink>
        
        <div class="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
          <template v-if="authStore.isLoggedIn">
            <span class="text-slate-400 text-sm">Hi, {{ authStore.activeUser?.username || 'User' }}</span>
            <button class="bg-transparent border border-slate-700 text-slate-400 px-3 py-1.5 rounded-lg text-sm hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="text-slate-400 font-medium hover:text-slate-50">Log In</NuxtLink>
            <NuxtLink to="/register" class="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">Sign Up</NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <!-- MOBILE HEADER -->
    <header class="md:hidden flex flex-col bg-slate-800 sticky top-0 z-20 border-b border-slate-700">
      <!-- Top Row: Logo -->
      <div class="flex justify-between items-center px-4 py-3">
        <div class="text-2xl font-bold text-blue-500 tracking-tight">superroot</div>
        <div class="flex gap-2">
          <!-- Search Placeholder -->
          <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer">
            <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <NuxtLink to="/menu" class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 [&.router-link-active]:text-blue-500 [&.router-link-active]:bg-blue-500/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </NuxtLink>
        </div>
      </div>
      <!-- Bottom Row: Navigation Tabs -->
      <nav class="flex justify-between items-center px-2 pb-0">
        <NuxtLink to="/feed?tab=all" class="flex-1 py-3 flex justify-center text-slate-400 border-b-2 border-transparent hover:bg-slate-700/50 rounded-lg transition-colors" :class="{ 'text-blue-500 border-blue-500 rounded-none': $route.path === '/feed' && $route.query.tab === 'all' }">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path><path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        </NuxtLink>
        <NuxtLink to="/feed?tab=following" class="flex-1 py-3 flex justify-center text-slate-400 border-b-2 border-transparent hover:bg-slate-700/50 rounded-lg transition-colors" :class="{ 'text-blue-500 border-blue-500 rounded-none': $route.path === '/feed' && $route.query.tab === 'following' }">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
        </NuxtLink>
        <NuxtLink to="/feed?tab=foryou" class="flex-1 py-3 flex justify-center text-slate-400 border-b-2 border-transparent hover:bg-slate-700/50 rounded-lg transition-colors" :class="{ 'text-blue-500 border-blue-500 rounded-none': $route.path === '/feed' && $route.query.tab === 'foryou' }">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
        </NuxtLink>
        <NuxtLink to="/profile" class="flex-1 py-3 flex justify-center text-slate-400 border-b-2 border-transparent hover:bg-slate-700/50 rounded-lg transition-colors" :class="{ 'text-blue-500 border-blue-500 rounded-none': $route.path === '/profile' }">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        </NuxtLink>
      </nav>
    </header>

    <main class="flex-1 md:p-8 p-0 w-full max-w-6xl mx-auto">
      <slot />
    </main>

    <footer class="hidden md:block p-6 text-center text-slate-500 border-t border-slate-800 text-sm mt-8">
      <p>&copy; 2026 Super Root. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>

