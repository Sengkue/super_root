<template>
  <div class="max-w-3xl mx-auto p-4 md:p-6 animate-[fadeIn_0.3s_ease-out]">
    <div class="mb-8 flex items-center justify-between border-b border-dashed border-[#ec4899]/50 pb-6 relative">
      <div class="flex items-center gap-4 z-10">
        <button @click="router.back()" class="w-10 h-10 flex items-center justify-center text-[#fcd34d] hover:text-white transition-colors group">
          <svg class="w-7 h-7 transition-transform group-hover:-translate-x-1 z-10 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <h1 class="text-3xl font-extrabold text-white tracking-wide drop-shadow-md">Messages</h1>
      </div>
      
      <button class="w-10 h-10 flex items-center justify-center text-[#fcd34d] hover:text-white transition-colors group" title="New Message">
        <svg class="w-7 h-7 z-10 relative transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M12 4v16m8-8H4"></path></svg>
      </button>
    </div>

    <!-- Conversations List -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="w-10 h-10 border-4 border-[#ec4899] border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <div v-else-if="conversations.length === 0" class="flex flex-col items-center justify-center py-20 text-center animate-[slideUp_0.4s_ease-out] bg-[#0d1b2a] rounded-2xl border-post-edge shadow-lg mx-2">
      <div class="w-24 h-24 mb-6 rounded-full flex items-center justify-center">
        <span class="text-5xl">💬</span>
      </div>
      <h2 class="text-2xl font-bold text-white mb-2">No messages yet</h2>
      <p class="text-[#fcd34d] max-w-sm mb-6">Start connecting with your friends and followers.</p>
      <NuxtLink to="/search" class="stitched-patch-btn hover:scale-105 transition-transform" style="padding: 12px 24px;">
        <span class="relative z-10 font-bold text-white">Find People to Chat</span>
      </NuxtLink>
    </div>

    <div v-else class="space-y-4 relative z-10 pb-20">
      <NuxtLink 
        v-for="conv in conversations" 
        :key="conv.user.id" 
        :to="`/chat/${conv.user.id}`"
        class="group block p-4 bg-denim rounded-2xl border-post-edge shadow-md hover:scale-[1.02] transition-transform relative mx-2"
      >
        <div class="flex items-center gap-4 relative z-10">
          <!-- Avatar -->
          <div class="relative shrink-0">
            <div class="hmong-avatar bg-[#0d1b2a]">
               <img v-if="conv.user?.profile?.profileImage" :src="conv.user.profile.profileImage" class="w-full h-full object-cover rounded-full z-10 relative" />
               <span v-else class="text-[#fcd34d] font-bold text-xl relative z-10">{{ conv.user.username.charAt(0).toUpperCase() }}</span>
            </div>
            <div v-if="conv.user.isOnline" class="absolute bottom-0 right-0 w-4 h-4 bg-[#84cc16] border-2 border-[#0d1b2a] rounded-full z-20 shadow-[0_0_8px_#84cc16]"></div>
          </div>
          
          <div class="flex-1 min-w-0 py-1">
            <div class="flex items-center justify-between mb-1">
              <h2 class="font-bold text-white truncate text-lg group-hover:text-[#ec4899] transition-colors drop-shadow-md">
                {{ conv.user.username }}
              </h2>
              <span class="text-xs font-bold shrink-0 ml-2" :class="conv.unreadCount > 0 ? 'text-[#84cc16]' : 'text-slate-400'">
                {{ formatDate(conv.latestMessage?.createdAt) }}
              </span>
            </div>
            <div class="flex items-center justify-between gap-3">
              <p class="text-[14px] truncate drop-shadow-sm font-medium" :class="conv.unreadCount > 0 ? 'text-white' : 'text-[#fcd34d]'">
                <span v-if="conv.latestMessage?.senderId === authStore.activeUserId" class="opacity-70">You: </span>
                {{ conv.latestMessage?.content }}
              </p>
              
              <div v-if="conv.unreadCount > 0" class="w-6 h-6 rounded-full bg-[#ec4899] text-[#0d1b2a] text-xs flex items-center justify-center font-black shrink-0 shadow-[0_0_10px_#ec4899] border border-dashed border-white">
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
