<template>
  <div class="relative z-50" ref="bellContainer">
    <button @click="toggleNotifications" class="stitched-patch-btn group">
      <svg class="w-6 h-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
      <span v-if="unreadCount > 0" class="absolute -top-2 -right-2 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-[#14213d] z-10">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
    </button>
    
    <!-- Notifications Dropdown -->
    <div v-if="showNotifications" class="hmong-dialogue absolute mt-3 w-80 max-w-[calc(100vw-2rem)] overflow-hidden z-50 transform transition-all duration-200 before:content-[''] before:absolute before:-top-3 before:left-0 before:w-full before:h-3" :class="[alignLeft ? '-left-2 origin-top-left' : 'right-0 origin-top-right', dropdownClass]">
      <div class="p-4 border-b border-[#ec4899]/50 flex items-center justify-between relative z-10">
        <h3 class="font-bold text-white">{{ $t('notifications_ui.title') }}</h3>
        <button v-if="unreadCount > 0" @click="markAllAsRead" class="text-xs font-bold text-[#fcd34d] hover:text-white hover:underline focus:outline-none">
          {{ $t('notifications_ui.markAllRead') }}
        </button>
      </div>
      <div class="max-h-96 overflow-y-auto relative z-10">
        <div v-if="notifications.length === 0" class="p-8 text-center text-slate-400 text-sm">
          {{ $t('notifications_ui.empty') }}
        </div>
        <template v-else>
          <div v-for="notif in notifications" :key="notif.id" @click="handleNotificationClick(notif)" class="hmong-dialogue-item p-4 border-b border-[#ec4899]/30 cursor-pointer flex gap-3" :class="{'hmong-dialogue-item-unread': !notif.isRead}">
            <div class="hmong-notif-icon shadow-[0_2px_4px_rgba(0,0,0,0.5)]" :style="{ borderColor: getNotificationColor(notif.type), color: getNotificationColor(notif.type) }">
              <span class="w-6 h-6 flex items-center justify-center" style="filter: drop-shadow(0 1px 2px rgba(0,0,0,0.8));" v-html="getNotificationSvg(notif.type)"></span>
            </div>
            <div class="flex-1">
              <p class="text-sm" :class="{'font-bold text-white': !notif.isRead, 'text-slate-200': notif.isRead}">{{ notif.message }}</p>
              <p class="text-xs text-[#fcd34d] mt-1">{{ formatTime(notif.createdAt) }}</p>
            </div>
            <div v-if="!notif.isRead" class="w-3 h-3 rounded-full bg-[#84cc16] flex-shrink-0 mt-1.5 shadow-[0_0_8px_#84cc16]"></div>
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
const bellContainer = ref(null);
let pollInterval = null;

const handleClickOutside = (event) => {
  if (showNotifications.value && bellContainer.value && !bellContainer.value.contains(event.target)) {
    showNotifications.value = false;
  }
};

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
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
};

const markAllAsRead = async () => {
  if (!authStore.activeUserId) return;
  try {
    await $api(`/notifications/${authStore.activeUserId}/read-all`, { method: 'PUT' });
    notifications.value.forEach(n => n.isRead = true);
  } catch (error) {
    console.error('Failed to mark notifications as read:', error);
  }
};

const handleNotificationClick = async (notif) => {
  if (!notif.isRead) {
    try {
      await $api(`/notifications/${notif.id}/read`, { method: 'PUT' });
      notif.isRead = true;
    } catch (error) {
      console.error('Failed to mark notification as read on click:', error);
    }
  }
  showNotifications.value = false;
  if (notif.link) {
    navigateTo(notif.link);
  }
};

const getNotificationSvg = (type) => {
  const stitchedStyle = 'stroke-width="2.5" stroke-dasharray="2 2" fill="none" stroke="currentColor"';
  switch (type) {
    case 'like': 
      return `<svg viewBox="0 0 24 24" ${stitchedStyle}><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>`;
    case 'comment': 
      return `<svg viewBox="0 0 24 24" ${stitchedStyle}><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>`;
    case 'follow': 
      return `<svg viewBox="0 0 24 24" ${stitchedStyle}><path stroke-linecap="round" stroke-linejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>`;
    case 'message': 
      return `<svg viewBox="0 0 24 24" ${stitchedStyle}><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>`;
    default: 
      return `<svg viewBox="0 0 24 24" ${stitchedStyle}><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>`;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'like': return '#ec4899'; // Neon Pink
    case 'comment': return '#3b82f6'; // Blue
    case 'follow': return '#a855f7'; // Purple
    case 'message': return '#10b981'; // Green
    case 'system': return '#fcd34d'; // Yellow
    default: return '#cbd5e1'; // Silver
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
  document.addEventListener('click', handleClickOutside);
  if (authStore.isLoggedIn) {
    fetchNotifications();
    setupPushNotifications();
    pollInterval = setInterval(fetchNotifications, 30000);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (pollInterval) clearInterval(pollInterval);
});
</script>
