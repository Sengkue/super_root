<template>
  <div class="max-w-3xl mx-auto p-4 md:p-6 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 class="text-3xl font-bold text-slate-900 dark:text-white">Messages</h1>
      </div>
    </div>

    <!-- Conversations List -->
    <div v-if="loading" class="flex justify-center py-10">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="conversations.length === 0" class="text-center py-10 text-slate-500 dark:text-slate-400">
      No conversations yet. Start a chat from a user's profile!
    </div>

    <div v-else class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <NuxtLink 
        v-for="conv in conversations" 
        :key="conv.user.id" 
        :to="`/chat/${conv.user.id}`"
        class="block p-4 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors last:border-0"
      >
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl shrink-0">
            {{ conv.user.username.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h2 class="font-bold text-slate-900 dark:text-white truncate">{{ conv.user.username }}</h2>
              <span class="text-xs text-slate-500 dark:text-slate-400 shrink-0">{{ formatDate(conv.latestMessage?.createdAt) }}</span>
            </div>
            <div class="flex items-center justify-between gap-2">
              <p class="text-sm text-slate-500 dark:text-slate-400 truncate" :class="{ 'font-bold text-slate-900 dark:text-slate-200': conv.unreadCount > 0 }">
                <span v-if="conv.latestMessage?.senderId === authStore.activeUserId">You: </span>
                {{ conv.latestMessage?.content }}
              </p>
              <div v-if="conv.unreadCount > 0" class="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold shrink-0">
                {{ conv.unreadCount }}
              </div>
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useApi, useHead } from '#imports';

useHead({
  title: 'Messages | Super Root'
});

const router = useRouter();
const authStore = useAuthStore();
const $api = useApi();

const loading = ref(true);
const conversations = ref([]);

const fetchConversations = async () => {
  try {
    const res = await $api('/messages/conversations');
    // Adjust if res is directly the array or wrapped in data
    conversations.value = res.data || res || []; 
  } catch (error) {
    console.error('Error fetching conversations:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchConversations();
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};
</script>
