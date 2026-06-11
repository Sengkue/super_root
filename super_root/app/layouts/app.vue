<template>
  <div class="mobile-app-layout flex flex-col min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-50">
    <!-- Top Header (TikTok Style) -->
    <header class="sticky top-0 z-40 bg-white dark:bg-black/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div class="flex justify-between items-center px-4 py-3 relative">
        <ClientOnly>
          <NotificationBell v-if="authStore.isLoggedIn" alignLeft />
          <div v-else class="w-8"></div>
        </ClientOnly>
        
        <nav class="flex gap-4 font-bold text-sm tracking-wide">
          <NuxtLink to="/feed?tab=all" class="text-slate-600 dark:text-slate-400 transition-colors" :class="{ 'text-slate-900 dark:text-white border-b-2 border-white pb-1': $route.path === '/feed' && ($route.query.tab === 'all' || !$route.query.tab) }">All</NuxtLink>
          <NuxtLink to="/feed?tab=following" class="text-slate-600 dark:text-slate-400 transition-colors" :class="{ 'text-slate-900 dark:text-white border-b-2 border-white pb-1': $route.path === '/feed' && $route.query.tab === 'following' }">Following</NuxtLink>
          <NuxtLink to="/feed?tab=foryou" class="text-slate-600 dark:text-slate-400 transition-colors" :class="{ 'text-slate-900 dark:text-white border-b-2 border-white pb-1': $route.path === '/feed' && $route.query.tab === 'foryou' }">For You</NuxtLink>
        </nav>

        <NuxtLink to="/search" class="w-8 h-8 flex items-center justify-center text-slate-100 hover:text-blue-400 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </NuxtLink>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 w-full relative pb-20 px-3 sm:px-4 pt-4">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-slate-200 dark:border-slate-800 flex justify-between items-center px-6 py-2 pb-safe">
      <NuxtLink to="/feed" class="flex flex-col items-center gap-1 text-slate-900 dark:text-slate-500 dark:text-slate-400 transition-colors" :class="{ 'text-slate-900 dark:text-white': $route.path === '/feed' }">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
        <span class="text-[10px] font-bold">Home</span>
      </NuxtLink>
      
      <NuxtLink to="/user/friends" class="flex flex-col items-center gap-1 text-slate-900 dark:text-slate-500 dark:text-slate-400 transition-colors" :class="{ 'text-slate-900 dark:text-white': $route.path === '/user/friends' }">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
        <span class="text-[10px] font-bold">Friends</span>
      </NuxtLink>
      
      <!-- Hmong Art Inspired Create Button -->
      <NuxtLink to="/feed/create" class="relative flex items-center justify-center w-12 h-10 -mt-5 transition-transform hover:scale-105 group">
        <div class="absolute inset-0 bg-gradient-to-br from-pink-500 via-yellow-400 to-emerald-500 rounded-xl rotate-45 scale-75 opacity-70 blur-sm group-hover:opacity-100 transition-opacity"></div>
        <div class="absolute inset-0 bg-gradient-to-tr from-pink-600 via-yellow-400 to-emerald-500 rounded-xl transform shadow-lg"></div>
        <div class="absolute inset-[3px] bg-slate-900 rounded-[9px] flex items-center justify-center overflow-hidden">
          <!-- Geometric Hmong motif accent -->
          <div class="absolute w-full h-full opacity-30" style="background-image: repeating-linear-gradient(45deg, #ec4899 0, #ec4899 2px, transparent 2px, transparent 6px, #10b981 6px, #10b981 8px, transparent 8px, transparent 12px);"></div>
          <!-- Diamond center -->
          <div class="absolute w-4 h-4 border-2 border-yellow-400 rotate-45"></div>
          <svg class="w-6 h-6 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
        </div>
      </NuxtLink>

      <NuxtLink to="/chat" class="flex flex-col items-center gap-1 text-slate-900 dark:text-slate-500 dark:text-slate-400 transition-colors" :class="{ 'text-slate-900 dark:text-white': $route.path.startsWith('/chat') }">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"></path></svg>
        <span class="text-[10px] font-bold">Messages</span>
      </NuxtLink>

      <NuxtLink to="/user/profile" class="flex flex-col items-center gap-1 text-slate-900 dark:text-slate-500 dark:text-slate-400 transition-colors" :class="{ 'text-slate-900 dark:text-white': $route.path === '/user/profile' }">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        <span class="text-[10px] font-bold">Profile</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
</script>
