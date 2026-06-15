<template>
  <div class="mobile-app-layout flex flex-col min-h-screen bg-batik relative">
    <svg width="0" height="0" class="absolute hidden"><defs><linearGradient id="silverGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#f1f5f9"/><stop offset="50%" stop-color="#94a3b8"/><stop offset="100%" stop-color="#475569"/></linearGradient></defs></svg>
    <!-- Top Header -->
    <header v-if="$route.path === '/feed'" class="sticky top-0 z-40 bg-denim clothes-edge-bottom shadow-md pb-1">
      <div class="flex justify-between items-center px-4 py-3 relative">
        <ClientOnly>
          <div v-if="authStore.isLoggedIn" class="relative">
            <NotificationBell alignLeft />
          </div>
          <div v-else class="w-8"></div>
        </ClientOnly>
        
        <div class="border-post-edge px-5 py-2.5 rounded-2xl bg-[#14213d] shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
          <nav class="flex gap-4 font-bold text-sm tracking-wide relative z-10">
            <NuxtLink to="/feed?tab=all" class="text-slate-400 transition-colors" :class="{ 'text-white border-b-2 border-dashed border-[#fcd34d] pb-1': $route.path === '/feed' && ($route.query.tab === 'all' || !$route.query.tab) }">All</NuxtLink>
            <NuxtLink to="/feed?tab=following" class="text-slate-400 transition-colors" :class="{ 'text-white border-b-2 border-dashed border-[#fcd34d] pb-1': $route.path === '/feed' && $route.query.tab === 'following' }">Following</NuxtLink>
            <NuxtLink to="/feed?tab=foryou" class="text-slate-400 transition-colors" :class="{ 'text-white border-b-2 border-dashed border-[#fcd34d] pb-1': $route.path === '/feed' && $route.query.tab === 'foryou' }">For You</NuxtLink>
          </nav>
        </div>

        <NuxtLink to="/search" class="stitched-patch-btn group">
          <svg class="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </NuxtLink>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 w-full relative pb-24 px-3 sm:px-4 pt-4">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-batik clothes-edge-top shadow-[0_-4px_15px_rgba(0,0,0,0.5)] flex justify-between items-center px-4 sm:px-6 py-2 pb-safe pt-3">
      <NuxtLink to="/feed" class="flex flex-col items-center gap-1 relative group">
        <div class="absolute -top-3 w-2 h-2 rounded-full border border-slate-400 bg-transparent shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></div>
        <img src="/img/home-icon.png" class="w-10 h-10 object-cover mix-blend-screen transition-transform group-hover:scale-110 drop-shadow-md rounded-full" alt="Home" />
      </NuxtLink>
      
      <NuxtLink to="/user/friends" class="flex flex-col items-center gap-1 relative group">
        <div class="absolute -top-3 w-2 h-2 rounded-full border border-slate-400 bg-transparent shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></div>
        <img src="/img/friends-icon.png" class="w-10 h-10 object-cover mix-blend-screen transition-transform group-hover:scale-110 drop-shadow-md rounded-full" alt="Friends" />
      </NuxtLink>
      
      <!-- Hmong Art Inspired Create Button -->
      <button @click="showCreatePostModal = true" class="relative flex items-center justify-center w-[80px] h-[80px] -mt-[36px] transition-transform hover:scale-105 group rounded-full z-10">
        <img src="/img/create-icon.png" class="w-full h-full object-cover mix-blend-screen" alt="Create Post" />
      </button>

      <NuxtLink to="/chat" class="flex flex-col items-center gap-1 relative group">
        <div class="absolute -top-3 w-2 h-2 rounded-full border border-slate-400 bg-transparent shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></div>
        <img src="/img/chat-icon.png" class="w-10 h-10 object-cover mix-blend-screen transition-transform group-hover:scale-110 drop-shadow-md rounded-full" alt="Chat" />
      </NuxtLink>

      <NuxtLink to="/menu" class="flex flex-col items-center gap-1 relative group">
        <div class="absolute -top-3 w-2 h-2 rounded-full border border-slate-400 bg-transparent shadow-[0_1px_2px_rgba(0,0,0,0.5)]"></div>
        <img src="/img/menu-icon.png" class="w-10 h-10 object-cover mix-blend-screen transition-transform group-hover:scale-110 drop-shadow-md rounded-full" alt="Menu" />
      </NuxtLink>
    </nav>

    <!-- Global Create Post Modal Dialog -->
    <FeedCreatePostBox 
      v-if="showCreatePostModal" 
      hide-trigger 
      start-open 
      @post-created="handlePostCreated" 
      @closed="showCreatePostModal = false" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const showCreatePostModal = ref(false);

const handlePostCreated = () => {
  showCreatePostModal.value = false;
  // If we are already on the feed page, refresh data
  if (route.path === '/feed') {
    refreshNuxtData();
  } else {
    // Otherwise, navigate back to feed
    router.push('/feed');
  }
};
</script>
