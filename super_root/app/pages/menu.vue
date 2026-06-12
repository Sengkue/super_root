<template>
  <div class="max-w-2xl mx-auto p-4 md:p-0 animate-[fadeIn_0.3s_ease-out]">
    
    <div class="flex items-center justify-between mb-6 px-1">
      <h1 class="text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{{ $t('nav.menu') }}</h1>
      <button class="w-9 h-9 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center text-slate-300 hover:bg-slate-700 transition-colors backdrop-blur-sm shadow-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
    </div>

    <!-- Profile Link Card -->
    <NuxtLink to="/user/profile" class="group relative flex items-center justify-between p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 mb-6 overflow-hidden hover:shadow-lg hover:shadow-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
      <!-- Background subtle glow -->
      <div class="absolute -inset-24 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div class="flex items-center gap-3 relative z-10">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-inner">
          {{ authStore.activeUser?.username?.charAt(0).toUpperCase() || '?' }}
        </div>
        <div>
          <div class="text-lg font-extrabold text-white tracking-wide">{{ authStore.activeUser?.username || 'Guest' }}</div>
          <div class="text-xs text-slate-400 font-medium mt-0.5">View your profile</div>
        </div>
      </div>
      <div class="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center text-slate-300 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 relative z-10 shadow-sm">
        <svg class="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
      </div>
    </NuxtLink>

    <!-- Shortcuts Grid -->
    <div class="grid grid-cols-2 gap-3 mb-6">
      <!-- Feed -->
      <NuxtLink to="/feed" class="group bg-gradient-to-br from-slate-800 to-slate-800/80 p-4 rounded-2xl border border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-300 flex flex-col gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
          <svg class="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path><path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        </div>
        <span class="font-bold text-slate-200 tracking-wide text-base">Feed</span>
      </NuxtLink>
      <!-- Messages -->
      <NuxtLink to="/chat" class="group bg-gradient-to-br from-slate-800 to-slate-800/80 p-4 rounded-2xl border border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 hover:border-emerald-500/30 transition-all duration-300 flex flex-col gap-3 cursor-pointer">
        <div class="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        </div>
        <span class="font-bold text-slate-200 tracking-wide text-base">Messages</span>
      </NuxtLink>
      <!-- Friends -->
      <NuxtLink to="/user/friends" class="group bg-gradient-to-br from-slate-800 to-slate-800/80 p-4 rounded-2xl border border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 hover:border-purple-500/30 transition-all duration-300 flex flex-col gap-3 cursor-pointer">
        <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
          <svg class="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
        </div>
        <span class="font-bold text-slate-200 tracking-wide text-base">{{ $t('nav.friends') }}</span>
      </NuxtLink>
      <!-- Saved -->
      <div class="group bg-gradient-to-br from-slate-800 to-slate-800/80 p-4 rounded-2xl border border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-yellow-500/10 hover:-translate-y-1 hover:border-yellow-500/30 transition-all duration-300 flex flex-col gap-3 cursor-pointer">
        <div class="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
          <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
        </div>
        <span class="font-bold text-slate-200 tracking-wide text-base">{{ $t('nav.saved') }}</span>
      </div>
    </div>

    <!-- Settings & About -->
    <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 mb-6 overflow-hidden shadow-sm">
      <NuxtLink to="/settings" class="group p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/30 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-slate-600/50 transition-colors shadow-inner">
            <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <span class="font-bold text-slate-200 text-base tracking-wide">{{ $t('nav.settings') }}</span>
        </div>
        <svg class="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
      </NuxtLink>
      
      <div class="h-[1px] bg-gradient-to-r from-transparent via-slate-600/50 to-transparent opacity-50 mx-4"></div>
      
      <NuxtLink to="/about" class="group p-4 flex items-center justify-between cursor-pointer hover:bg-slate-700/30 transition-colors">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center group-hover:bg-slate-600/50 transition-colors shadow-inner">
            <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <span class="font-bold text-slate-200 text-base tracking-wide">{{ $t('nav.about') }}</span>
        </div>
        <svg class="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path></svg>
      </NuxtLink>
    </div>

    <!-- Logout -->
    <button v-if="authStore.isLoggedIn" @click="handleLogout" class="group relative w-full p-4 rounded-2xl flex items-center justify-center font-extrabold text-base transition-all duration-300 overflow-hidden bg-slate-800/80 border border-slate-700/50 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/20">
      <div class="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span class="text-slate-300 group-hover:text-red-400 relative z-10 transition-colors tracking-wide">{{ $t('nav.logout') }}</span>
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
