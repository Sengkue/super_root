<template>
  <div class="relative z-50">
    <!-- Invisible overlay to close menu -->
    <div v-if="showNotifications" @click="showNotifications = false" class="fixed inset-0 z-40"></div>
    
    <button @click="toggleNotifications" class="relative p-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors focus:outline-none bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
      <span v-if="unreadCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-slate-50 dark:border-slate-900 transform translate-x-1/3 -translate-y-1/3">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </button>
    
    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="absolute mt-3 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden z-50 transform transition-all duration-200" :class="[alignLeft ? '-left-2 origin-top-left' : 'right-0 origin-top-right', dropdownClass]">
      <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
        <h3 class="font-bold text-slate-900 dark:text-white">{{ $t('notifications_ui.title') }}</h3>
        <button v-if="unreadCount > 0" @click="markAllAsRead" class="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline focus:outline-none">
          {{ $t('notifications_ui.markAllRead') }}
        </button>
      </div>
      <div class="max-h-96 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          {{ $t('notifications_ui.empty') }}
        </div>
        <template v-else>
          <div v-for="notif in notifications" :key="notif.id" @click="handleNotificationClick(notif)" class="p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors flex gap-3" :class="{'bg-blue-50/50 dark:bg-blue-900/10': !notif.isRead}">
            <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white" :class="getNotificationIconBg(notif.type)">
              <span class="text-lg">{{ getNotificationEmoji(notif.type) }}</span>
            </div>
            <div class="flex-1">
              <p class="text-sm text-slate-800 dark:text-slate-200" :class="{'font-semibold': !notif.isRead}">{{ notif.message }}</p>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">{{ formatTime(notif.createdAt) }}</p>
            </div>
            <div v-if="!notif.isRead" class="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5"></div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { useApi } from '#imports';

const props = defineProps({
  dropdownClass: {
    type: String,
    default: ''
  },
  alignLeft: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['toggled']);

const authStore = useAuthStore();
const $api = useApi();
const showNotifications = ref(false);
const notifications = ref([]);
let pollInterval = null;

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.isRead).length;
});

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  emit('toggled', showNotifications.value);
};

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const setupPushNotifications = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return;

    const keyRes = await $api('/push/vapid-public-key');
    if (!keyRes.success) return;

    const applicationServerKey = urlBase64ToUint8Array(keyRes.publicKey);
    let subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });
    }

    await $api('/push/subscribe', {
      method: 'POST',
      body: {
        userId: authStore.activeUserId,
        subscription
      }
    });

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'PUSH_NOTIFICATION_RECEIVED') {
        fetchNotifications();
      }
    });
  } catch (error) {
    console.error('Push notification setup failed:', error);
  }
};

const fetchNotifications = async () => {
  if (!authStore.activeUserId) return;
  try {
    const res = await $api(`/notifications/${authStore.activeUserId}`);
    if (res.success) {
      notifications.value = res.data;
    }
  } catch (error) {}
};

const markAllAsRead = async () => {
  if (!authStore.activeUserId) return;
  try {
    await $api(`/notifications/${authStore.activeUserId}/read-all`, { method: 'PUT' });
    notifications.value.forEach(n => n.isRead = true);
  } catch (error) {}
};

const handleNotificationClick = async (notif) => {
  if (!notif.isRead) {
    try {
      await $api(`/notifications/${notif.id}/read`, { method: 'PUT' });
      notif.isRead = true;
    } catch (error) {}
  }
  showNotifications.value = false;
  if (notif.link) {
    navigateTo(notif.link);
  }
};

const getNotificationEmoji = (type) => {
  switch (type) {
    case 'like': return '❤️';
    case 'comment': return '💬';
    case 'follow': return '👤';
    case 'system': return '⚙️';
    default: return '🔔';
  }
};

const getNotificationIconBg = (type) => {
  switch (type) {
    case 'like': return 'bg-pink-500';
    case 'comment': return 'bg-blue-500';
    case 'follow': return 'bg-purple-500';
    case 'system': return 'bg-slate-500';
    default: return 'bg-emerald-500';
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

// Expose close menu so parent can close it
defineExpose({
  closeMenu: () => { showNotifications.value = false; }
});

onMounted(() => {
  if (authStore.isLoggedIn) {
    fetchNotifications();
    setupPushNotifications();
    pollInterval = setInterval(fetchNotifications, 30000);
  }
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});
</script>
