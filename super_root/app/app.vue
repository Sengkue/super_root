<template>
  <div>
    <!-- Global App Loading Splash Screen -->
    <div 
      v-if="isAppLoading" 
      class="fixed inset-0 z-[99999] bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center transition-opacity duration-500"
      :class="{ 'opacity-0 pointer-events-none': fadeOutSplash }"
    >
      <div class="text-6xl mb-6 animate-bounce" style="animation-duration: 1s;">🌱</div>
      <div class="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent mb-8">Super Root</div>
      <div class="w-48 h-1.5 bg-white dark:bg-slate-800 rounded-full overflow-hidden">
        <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full loading-bar"></div>
      </div>
    </div>

    <!-- Main App Content -->
    <div :class="{ 'opacity-0': isAppLoading && !fadeOutSplash, 'opacity-100 transition-opacity duration-700': !isAppLoading || fadeOutSplash }">
      <NuxtRouteAnnouncer />
      <NuxtLayout :name="currentLayout">
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useRequestHeaders } from '#app';
import { useColorMode, useI18n } from '#imports';

const route = useRoute();
const authStore = useAuthStore();
const colorMode = useColorMode();
const { setLocale, locale } = useI18n();

// Server-side user-agent detection to prevent hydration flicker!
const headers = useRequestHeaders(['user-agent']);
const userAgent = headers['user-agent'] || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
const isMobileServer = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

const windowWidth = ref(isMobileServer ? 400 : 1024);

const isAppLoading = ref(true);
const fadeOutSplash = ref(false);

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
  
  // Keep the splash screen visible for a moment while everything renders
  setTimeout(() => {
    fadeOutSplash.value = true;
    setTimeout(() => {
      isAppLoading.value = false;
    }, 500); // Wait for fade transition to finish
  }, 600); // Show splash for at least 600ms
});

const currentLayout = computed(() => {
  if (route.path === '/auth/login' || route.path === '/auth/register') return 'blank';
  return windowWidth.value < 768 ? 'app' : 'web';
});

// Load dummy users for the switcher on boot
authStore.fetchUsers();

// Restore user session if a cookie exists
if (authStore.activeUserId && !authStore.activeUserObj) {
  authStore.fetchCurrentUser();
}

// Watch user profile to sync theme and language globally from database
watch(() => authStore.activeUserObj, (newUser) => {
  if (newUser?.profile) {
    if (newUser.profile.theme && colorMode.preference !== newUser.profile.theme) {
      colorMode.preference = newUser.profile.theme;
    }
    if (newUser.profile.language && locale.value !== newUser.profile.language) {
      setLocale(newUser.profile.language);
    }
  }
}, { immediate: true, deep: true });
</script>

<style>
.loading-bar {
  width: 50%;
  animation: slide 1s infinite ease-in-out alternate;
}

@keyframes slide {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}
</style>
