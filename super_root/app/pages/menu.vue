<template>
  <div class="max-w-2xl mx-auto p-4 md:p-0 animate-[fadeIn_0.3s_ease-out]">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold text-slate-100">{{ $t('nav.menu') }}</h1>
      <button class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
    </div>

    <!-- Profile Link Card -->
    <NuxtLink to="/user/profile" class="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl mb-6 hover:bg-slate-100 dark:bg-slate-700 transition-colors">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold text-slate-900 dark:text-white shrink-0">
          {{ authStore.activeUser?.username?.charAt(0).toUpperCase() || '?' }}
        </div>
        <div>
          <div class="font-bold text-slate-100">{{ authStore.activeUser?.username || 'Guest' }}</div>
          <div class="text-sm text-slate-600 dark:text-slate-400">See your profile</div>
        </div>
      </div>
      <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </div>
    </NuxtLink>

    <!-- Shortcuts Grid -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <NuxtLink to="/feed" class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm hover:bg-slate-100 dark:bg-slate-700 transition-colors flex flex-col gap-2">
        <svg class="w-7 h-7 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path><path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        <span class="font-medium text-slate-800 dark:text-slate-200">Feed</span>
      </NuxtLink>
      <NuxtLink to="/user/friends" class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm hover:bg-slate-100 dark:bg-slate-700 transition-colors flex flex-col gap-2 cursor-pointer">
        <svg class="w-7 h-7 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
        <span class="font-medium text-slate-800 dark:text-slate-200">{{ $t('nav.friends') }}</span>
      </NuxtLink>
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm hover:bg-slate-100 dark:bg-slate-700 transition-colors flex flex-col gap-2 cursor-pointer">
        <svg class="w-7 h-7 text-pink-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path></svg>
        <span class="font-medium text-slate-800 dark:text-slate-200">{{ $t('nav.favorites') }}</span>
      </div>
      <div class="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm hover:bg-slate-100 dark:bg-slate-700 transition-colors flex flex-col gap-2 cursor-pointer">
        <svg class="w-7 h-7 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
        <span class="font-medium text-slate-800 dark:text-slate-200">{{ $t('nav.saved') }}</span>
      </div>
    </div>

    <!-- Settings & About -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl mb-6 overflow-hidden">
      <NuxtLink to="/settings" class="p-4 border-b border-slate-300 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:bg-slate-700 transition-colors block">
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          <span class="font-medium text-slate-800 dark:text-slate-200">{{ $t('nav.settings') }}</span>
        </div>
        <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
      </NuxtLink>
      
      <div class="bg-slate-800/50">
        <NuxtLink to="/about" class="p-4 pl-12 flex items-center gap-3 border-b border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:bg-slate-700 transition-colors">
          <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <span class="text-slate-700 dark:text-slate-300">{{ $t('nav.about') }}</span>
        </NuxtLink>
      </div>
    </div>

    <!-- Logout -->
    <button v-if="authStore.isLoggedIn" @click="handleLogout" class="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center justify-center text-slate-700 dark:text-slate-300 font-bold hover:bg-red-500/10 hover:text-red-500 transition-colors">
      {{ $t('nav.logout') }}
    </button>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = () => {
  authStore.logout();
  router.push('/auth/login');
};
</script>
