<template>
  <div class="max-w-2xl mx-auto p-4 animate-[fadeIn_0.3s_ease-out]">
    
    <div class="flex items-center justify-between mb-5 px-1">
      <h1 class="text-2xl font-extrabold text-[#ec4899] drop-shadow-md tracking-wide uppercase">{{ $t('nav.menu') }}</h1>
      <button class="w-8 h-8 flex items-center justify-center text-[#fcd34d] hover:text-white transition-colors group">
        <svg class="w-6 h-6 transition-transform group-hover:-rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </button>
    </div>

    <!-- Profile Link Card -->
    <NuxtLink to="/user/profile" class="group relative flex items-center justify-between p-3.5 bg-[#0d1b2a] border-post-edge rounded-2xl mb-4 overflow-hidden shadow-lg hover:-translate-y-0.5 transition-transform duration-300">
      <div class="flex items-center gap-3 relative z-10">
        <div class="hmong-avatar !w-12 !h-12 !p-0.5 group-hover:scale-105 transition-transform">
          <img v-if="authStore.activeUser?.profile?.profileImage" :src="authStore.activeUser.profile.profileImage" class="w-full h-full object-cover rounded-full z-10 relative" />
          <span v-else class="z-10 relative text-lg font-black">{{ authStore.activeUser?.username?.charAt(0).toUpperCase() || '?' }}</span>
        </div>
        <div>
          <div class="text-lg font-extrabold text-white tracking-wide group-hover:text-[#ec4899] transition-colors">{{ authStore.activeUser?.username || 'Guest' }}</div>
          <div class="text-xs text-[#84cc16] font-bold mt-0.5">View your profile</div>
        </div>
      </div>
      <div class="w-8 h-8 flex items-center justify-center text-[#fcd34d] group-hover:translate-x-1 transition-transform relative z-10">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M9 5l7 7-7 7"></path></svg>
      </div>
    </NuxtLink>

    <!-- Shortcuts Grid -->
    <div class="grid grid-cols-2 gap-3 mb-4">
      <!-- Feed -->
      <NuxtLink to="/feed" class="group bg-[#0d1b2a] border-post-edge p-4 rounded-2xl shadow-md hover:-translate-y-0.5 transition-transform flex flex-col gap-2 relative z-10">
        <div class="w-10 h-10 flex items-center justify-center text-[#fcd34d] group-hover:scale-110 transition-transform z-10 relative">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
        </div>
        <span class="font-extrabold text-white tracking-wide text-base z-10 relative group-hover:text-[#ec4899] transition-colors">Feed</span>
      </NuxtLink>
      <!-- Messages -->
      <NuxtLink to="/chat" class="group bg-[#0d1b2a] border-post-edge p-4 rounded-2xl shadow-md hover:-translate-y-0.5 transition-transform flex flex-col gap-2 relative z-10 cursor-pointer">
        <div class="w-10 h-10 flex items-center justify-center text-[#84cc16] group-hover:scale-110 transition-transform z-10 relative">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        </div>
        <span class="font-extrabold text-white tracking-wide text-base z-10 relative group-hover:text-[#ec4899] transition-colors">Messages</span>
      </NuxtLink>
      <!-- Friends -->
      <NuxtLink to="/user/friends" class="group bg-[#0d1b2a] border-post-edge p-4 rounded-2xl shadow-md hover:-translate-y-0.5 transition-transform flex flex-col gap-2 relative z-10 cursor-pointer">
        <div class="w-10 h-10 flex items-center justify-center text-[#ec4899] group-hover:scale-110 transition-transform z-10 relative">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
        </div>
        <span class="font-extrabold text-white tracking-wide text-base z-10 relative group-hover:text-[#ec4899] transition-colors">{{ $t('nav.friends') }}</span>
      </NuxtLink>
      <!-- Saved -->
      <div class="group bg-[#0d1b2a] border-post-edge p-4 rounded-2xl shadow-md hover:-translate-y-0.5 transition-transform flex flex-col gap-2 relative z-10 cursor-pointer">
        <div class="w-10 h-10 flex items-center justify-center text-[#0ea5e9] group-hover:scale-110 transition-transform z-10 relative">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
        </div>
        <span class="font-extrabold text-white tracking-wide text-base z-10 relative group-hover:text-[#ec4899] transition-colors">{{ $t('nav.saved') }}</span>
      </div>
    </div>

    <!-- Settings & About -->
    <div class="bg-[#0d1b2a] rounded-2xl border-post-edge mb-4 shadow-lg overflow-hidden">
      <NuxtLink to="/settings" class="group p-4 flex items-center justify-between cursor-pointer hover:bg-[#14213d] transition-colors relative z-10">
        <div class="flex items-center gap-3 z-10 relative">
          <div class="w-8 h-8 flex items-center justify-center text-[#84cc16] group-hover:rotate-45 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          </div>
          <span class="font-extrabold text-white text-base tracking-wide group-hover:text-[#fcd34d] transition-colors">{{ $t('nav.settings') }}</span>
        </div>
        <svg class="w-5 h-5 text-[#ec4899] group-hover:translate-x-1 transition-transform z-10 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M9 5l7 7-7 7"></path></svg>
      </NuxtLink>
      
      <div class="border-b border-dashed border-[#ec4899]/30 relative z-10"></div>
      
      <NuxtLink to="/about" class="group p-4 flex items-center justify-between cursor-pointer hover:bg-[#14213d] transition-colors relative z-10">
        <div class="flex items-center gap-3 z-10 relative">
          <div class="w-8 h-8 flex items-center justify-center text-[#fcd34d] group-hover:scale-110 transition-transform">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <span class="font-extrabold text-white text-base tracking-wide group-hover:text-[#fcd34d] transition-colors">{{ $t('nav.about') }}</span>
        </div>
        <svg class="w-5 h-5 text-[#ec4899] group-hover:translate-x-1 transition-transform z-10 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M9 5l7 7-7 7"></path></svg>
      </NuxtLink>
    </div>

    <!-- Logout -->
    <div v-if="authStore.isLoggedIn" class="bg-[#0d1b2a] rounded-2xl border-post-edge mb-6 shadow-lg overflow-hidden">
      <button @click="handleLogout" class="w-full group p-4 flex items-center justify-center cursor-pointer hover:bg-[#14213d] transition-colors relative z-10">
        <div class="flex items-center gap-2 z-10 relative text-[#f87171] font-black text-base tracking-wider group-hover:text-red-400 group-hover:scale-105 transition-transform">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          <span class="uppercase">{{ $t('nav.logout') }}</span>
        </div>
      </button>
    </div>
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
