<template>
  <div class="max-w-3xl mx-auto h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] md:my-5 flex flex-col bg-slate-50 dark:bg-slate-900 animate-[fadeIn_0.3s_ease-out] md:rounded-3xl md:shadow-2xl md:border border-slate-200 dark:border-slate-800 overflow-hidden relative">
    
    <!-- Background Decor (Optional ambient glows) -->
    <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
    <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

    <!-- Header (Glassmorphism) -->
    <div class="px-4 py-3 border-b border-white/20 dark:border-slate-800/50 flex items-center justify-between bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl sticky top-0 z-20 shadow-sm">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <NuxtLink :to="`/user/profile?id=${otherUser?.id}`" class="flex items-center gap-3 group cursor-pointer">
          <div class="relative">
            <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform overflow-hidden">
              <img v-if="otherUser?.profile?.profileImage" :src="otherUser.profile.profileImage" class="w-full h-full object-cover" />
              <span v-else>{{ otherUser?.username?.charAt(0).toUpperCase() || '?' }}</span>
            </div>
            <div v-if="otherUser?.isOnline" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
          </div>
          <div>
            <h2 class="font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">{{ otherUser?.username || 'Loading...' }}</h2>
            <p class="text-[11px] font-medium" :class="otherUser?.isOnline ? 'text-green-500' : 'text-slate-500 dark:text-slate-400'">{{ otherUser?.isOnline ? 'Online' : `@${otherUser?.number || '...'}` }}</p>
          </div>
        </NuxtLink>
      </div>
      
      <button class="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
      </button>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6 z-10 scroll-smooth relative" ref="messagesContainer">
      <div v-if="loading" class="flex justify-center py-10">
        <div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-indigo-500/20"></div>
      </div>
      
      <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 animate-[fadeIn_0.5s_ease-out]">
        <div class="w-24 h-24 mb-6 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
          <svg class="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
        </div>
        <p class="text-lg font-medium text-slate-800 dark:text-slate-200 mb-1">Say hello to {{ otherUser?.username }}!</p>
        <p class="text-sm">This is the start of your beautiful conversation.</p>
      </div>

      <div 
        v-for="(msg, index) in messages" 
        :key="msg.id" 
        class="flex flex-col animate-[slideUp_0.3s_ease-out]"
        :class="msg.senderId === authStore.activeUserId ? 'items-end' : 'items-start'"
      >
        <!-- Time Separator (optional, just for demo showing time) -->
        <div v-if="shouldShowTime(index)" class="self-center text-[11px] font-medium text-slate-400 dark:text-slate-500 mb-4 mt-2 bg-slate-200/50 dark:bg-slate-800/50 px-3 py-1 rounded-full">
          {{ formatDateSeparator(msg.createdAt) }}
        </div>

        <div class="flex items-end gap-2 max-w-[85%] md:max-w-[70%] group relative">
          <!-- Avatar for received messages -->
          <div v-if="msg.senderId !== authStore.activeUserId" class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0 mb-1 overflow-hidden hidden sm:flex">
             <img v-if="otherUser?.profile?.profileImage" :src="otherUser.profile.profileImage" class="w-full h-full object-cover" />
             <span v-else>{{ otherUser?.username?.charAt(0).toUpperCase() || '?' }}</span>
          </div>

          <!-- Bubble -->
          <div 
            class="px-5 py-3 shadow-sm relative text-[15px] leading-relaxed"
            :class="[
              msg.senderId === authStore.activeUserId 
                ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl rounded-br-sm shadow-indigo-500/20' 
                : 'bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 rounded-2xl rounded-bl-sm shadow-black/5'
            ]"
          >
            <p class="whitespace-pre-wrap break-words">{{ msg.content }}</p>
            
            <!-- Inline Time & Status -->
            <div 
              class="flex items-center gap-1 mt-1.5 justify-end text-[10px] font-medium select-none"
              :class="msg.senderId === authStore.activeUserId ? 'text-indigo-200' : 'text-slate-400 dark:text-slate-500'"
            >
              <span>{{ formatTimeOnly(msg.createdAt) }}</span>
              <svg v-if="msg.senderId === authStore.activeUserId" class="w-3.5 h-3.5" :class="msg.read ? 'text-blue-300' : 'text-indigo-200/60'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Message Input -->
    <div class="p-4 bg-transparent z-20 w-full mb-2">
      <form @submit.prevent="sendMessage" class="flex items-end gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-700/80 rounded-[28px] p-2 shadow-lg shadow-black/5 focus-within:shadow-indigo-500/10 focus-within:border-indigo-500/50 transition-all w-full max-w-3xl mx-auto">
        
        <!-- Attachment Button -->
        <button type="button" class="p-3 rounded-full text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
        </button>

        <!-- Textarea -->
        <textarea
          v-model="newMessage"
          rows="1"
          placeholder="Type a message..."
          class="flex-1 bg-transparent border-none focus:ring-0 resize-none px-2 py-3 text-slate-900 dark:text-white max-h-32 min-h-[48px] placeholder-slate-400 dark:placeholder-slate-500 text-[15px]"
          @keydown.enter.prevent="sendMessage"
        ></textarea>
        
        <!-- Send Button -->
        <button 
          type="submit" 
          :disabled="!newMessage.trim() || sending"
          class="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center disabled:opacity-50 disabled:grayscale transition-all shrink-0 mb-0.5 hover:scale-105 active:scale-95 shadow-md shadow-indigo-500/30"
        >
          <svg v-if="!sending" class="w-5 h-5 translate-x-[2px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          <svg v-else class="w-5 h-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useApi, useHead } from '#imports';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const $api = useApi();

const otherUserId = route.params.id;
const otherUser = ref(null);
const messages = ref([]);
const loading = ref(true);
const sending = ref(false);
const newMessage = ref('');
const messagesContainer = ref(null);
let pollingInterval = null;

useHead({
  title: 'Chat | Super Root'
});

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const fetchUser = async () => {
  try {
    const res = await $api(`/users/${otherUserId}`);
    otherUser.value = res.data || res;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

const fetchMessages = async (isInitial = false) => {
  try {
    const res = await $api(`/messages/${otherUserId}`);
    const fetchedMessages = res.data || res || [];
    
    if (fetchedMessages.length > messages.value.length) {
      messages.value = fetchedMessages;
      if (isInitial || Math.abs((messagesContainer.value?.scrollHeight || 0) - (messagesContainer.value?.scrollTop || 0) - (messagesContainer.value?.clientHeight || 0)) < 250) {
        scrollToBottom();
      }
    }
  } catch (error) {
    console.error('Error fetching messages:', error);
  } finally {
    loading.value = false;
  }
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return;
  
  const content = newMessage.value.trim();
  newMessage.value = '';
  sending.value = true;
  
  const tempId = 'temp-' + Date.now();
  messages.value.push({
    id: tempId,
    senderId: authStore.activeUserId,
    receiverId: otherUserId,
    content,
    createdAt: new Date().toISOString(),
    read: false
  });
  scrollToBottom();

  try {
    const res = await $api('/messages', {
      method: 'POST',
      body: {
        receiverId: otherUserId,
        content
      }
    });
    
    const realMessage = res.data || res;
    const idx = messages.value.findIndex(m => m.id === tempId);
    if (idx !== -1) {
      messages.value[idx] = realMessage;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    messages.value = messages.value.filter(m => m.id !== tempId);
  } finally {
    sending.value = false;
  }
};

// Formatting helpers
const formatTimeOnly = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateSeparator = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (date.toDateString() === now.toDateString()) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'long' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
};

const shouldShowTime = (index) => {
  if (index === 0) return true;
  const curr = new Date(messages.value[index].createdAt);
  const prev = new Date(messages.value[index - 1].createdAt);
  return (curr - prev) > 60 * 60 * 1000; // Show separator if > 1 hour difference
};

onMounted(async () => {
  if (!authStore.activeUserId) {
    router.push('/auth/login');
    return;
  }
  
  await fetchUser();
  await fetchMessages(true);
  
  pollingInterval = setInterval(() => {
    fetchMessages(false);
  }, 3000);
});

onUnmounted(() => {
  if (pollingInterval) clearInterval(pollingInterval);
});
</script>

<style scoped>
@reference "../../assets/css/main.css";
@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Custom Scrollbar for messages area */
div::-webkit-scrollbar {
  width: 6px;
}
div::-webkit-scrollbar-track {
  background: transparent;
}
div::-webkit-scrollbar-thumb {
  @apply bg-slate-300 dark:bg-slate-700 rounded-full;
}
div::-webkit-scrollbar-thumb:hover {
  @apply bg-slate-400 dark:bg-slate-600;
}
</style>
