<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout :name="currentLayout">
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useRequestHeaders } from '#app';

const route = useRoute();
const authStore = useAuthStore();

// Server-side user-agent detection to prevent hydration flicker!
const headers = useRequestHeaders(['user-agent']);
const userAgent = headers['user-agent'] || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
const isMobileServer = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

// Initialize windowWidth based on server prediction
const windowWidth = ref(isMobileServer ? 400 : 1024);

onMounted(() => {
  windowWidth.value = window.innerWidth;
  window.addEventListener('resize', () => {
    windowWidth.value = window.innerWidth;
  });
});

const currentLayout = computed(() => {
  if (route.path === '/login' || route.path === '/register') return 'default';
  return windowWidth.value < 768 ? 'app' : 'web';
});

// Load dummy users for the switcher on boot
authStore.fetchUsers();

// Restore user session if a cookie exists
if (authStore.activeUserId && !authStore.activeUserObj) {
  authStore.fetchCurrentUser();
}
</script>
