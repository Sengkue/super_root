<template>
  <div class="max-w-3xl mx-auto p-4 md:p-6 animate-[fadeIn_0.3s_ease-out]">
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 relative">
      <div class="flex items-center gap-4 z-10">
        <button @click="router.back()" class="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <h1 class="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 tracking-tight">Messages</h1>
      </div>
      
      <button class="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors z-10" title="New Message">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
      </button>

      <!-- Decorative Blur -->
      <div class="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>

    <!-- Conversations List -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-500/20"></div>
    </div>
    
    <div v-else-if="conversations.length === 0" class="flex flex-col items-center justify-center py-20 text-center animate-[slideUp_0.4s_ease-out]">
      <div class="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 flex items-center justify-center shadow-inner">
        <span class="text-5xl">💬</span>
      </div>
      <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">No messages yet</h2>
      <p class="text-slate-500 dark:text-slate-400 max-w-sm mb-6">Start connecting with your friends and followers. Your active conversations will appear here.</p>
      <NuxtLink to="/search" class="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all">
        Find People to Chat
      </NuxtLink>
    </div>

    <div v-else class="space-y-3 relative z-10">
      <NuxtLink 
        v-for="conv in conversations" 
        :key="conv.user.id" 
        :to="`/chat/${conv.user.id}`"
        class="group block p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden"
      >
        <!-- Unread Glow -->
        <div v-if="conv.unreadCount > 0" class="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl shadow-[0_0_10px_rgba(99,102,241,0.8)]"></div>

        <div class="flex items-center gap-4">
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div class="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:shadow-indigo-500/40 transition-shadow overflow-hidden">
               <img v-if="conv.user?.profile?.profileImage" :src="conv.user.profile.profileImage" class="w-full h-full object-cover" />
               <span v-else>{{ conv.user.username.charAt(0).toUpperCase() }}</span>
            </div>
            <div v-if="conv.user.isOnline" class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
          </div>
          
          <div class="flex-1 min-w-0 py-1">
            <div class="flex items-center justify-between mb-1">
              <h2 class="font-bold text-slate-900 dark:text-white truncate text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {{ conv.user.username }}
              </h2>
              <span class="text-xs font-medium text-slate-400 dark:text-slate-500 shrink-0 ml-2" :class="{'text-indigo-600 dark:text-indigo-400': conv.unreadCount > 0}">
                {{ formatDate(conv.latestMessage?.createdAt) }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <p class="text-[15px] truncate" :class="conv.unreadCount > 0 ? 'font-semibold text-slate-800 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'">
                <span v-if="conv.latestMessage?.senderId === authStore.activeUserId" class="text-slate-400">You: </span>
                {{ conv.latestMessage?.content }}
              </p>
              
              <div v-if="conv.unreadCount > 0" class="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-[11px] flex items-center justify-center font-bold shrink-0 shadow-lg shadow-indigo-500/30 animate-pulse">
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
  
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'short' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};
</script>

<style scoped>
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
