<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();

// Load dummy users for the switcher on boot
authStore.fetchUsers();

// Restore user session if a cookie exists
if (authStore.activeUserId && !authStore.activeUserObj) {
  authStore.fetchCurrentUser();
}
</script>
