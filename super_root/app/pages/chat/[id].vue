<template>
  <div class="max-w-3xl mx-auto h-[calc(100vh-80px)] flex flex-col bg-white dark:bg-slate-900 animate-[fadeIn_0.3s_ease-out]">
    
    <!-- Header -->
    <div class="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-10">
      <button @click="router.back()" class="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </button>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
          {{ otherUser?.username?.charAt(0).toUpperCase() || '?' }}
        </div>
        <div>
          <h2 class="font-bold text-slate-900 dark:text-white">{{ otherUser?.username || 'Loading...' }}</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400">@{{ otherUser?.number || '...' }}</p>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4" ref="messagesContainer">
      <div v-if="loading" class="flex justify-center py-4">
        <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-else-if="messages.length === 0" class="text-center py-10 text-slate-500 dark:text-slate-400">
        No messages yet. Say hello!
      </div>

      <div 
        v-for="msg in messages" 
        :key="msg.id" 
        class="flex"
        :class="msg.senderId === authStore.activeUserId ? 'justify-end' : 'justify-start'"
      >
        <div 
          class="max-w-[75%] px-4 py-2 rounded-2xl"
          :class="msg.senderId === authStore.activeUserId ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-sm'"
        >
          <p class="whitespace-pre-wrap break-words text-[15px]">{{ msg.content }}</p>
          <div 
            class="text-[10px] mt-1 text-right"
            :class="msg.senderId === authStore.activeUserId ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500'"
          >
            {{ formatTime(msg.createdAt) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Message Input -->
    <div class="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <form @submit.prevent="sendMessage" class="flex items-end gap-2 bg-slate-100 dark:bg-slate-800 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
        <textarea
          v-model="newMessage"
          rows="1"
          placeholder="Message..."
          class="flex-1 bg-transparent border-none focus:ring-0 resize-none px-3 py-2 text-slate-900 dark:text-white max-h-32 min-h-[40px]"
          @keydown.enter.prevent="sendMessage"
        ></textarea>
        <button 
          type="submit" 
          :disabled="!newMessage.trim() || sending"
          class="p-2 rounded-full bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors shrink-0 mb-0.5"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
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
    // Adjust depending on actual API response wrapper
    otherUser.value = res.data || res;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};

const fetchMessages = async (isInitial = false) => {
  try {
    const res = await $api(`/messages/${otherUserId}`);
    const fetchedMessages = res.data || res || [];
    
    // Check if there are new messages
    if (fetchedMessages.length > messages.value.length) {
      messages.value = fetchedMessages;
      if (isInitial || Math.abs((messagesContainer.value?.scrollHeight || 0) - (messagesContainer.value?.scrollTop || 0) - (messagesContainer.value?.clientHeight || 0)) < 150) {
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
  
  // Optimistic update
  const tempId = 'temp-' + Date.now();
  messages.value.push({
    id: tempId,
    senderId: authStore.activeUserId,
    receiverId: otherUserId,
    content,
    createdAt: new Date().toISOString()
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
    
    // Replace temp message with real one
    const realMessage = res.data || res;
    const idx = messages.value.findIndex(m => m.id === tempId);
    if (idx !== -1) {
      messages.value[idx] = realMessage;
    }
  } catch (error) {
    console.error('Error sending message:', error);
    // Remove temp message if failed
    messages.value = messages.value.filter(m => m.id !== tempId);
  } finally {
    sending.value = false;
  }
};

const formatTime = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(async () => {
  if (!authStore.activeUserId) {
    router.push('/auth/login');
    return;
  }
  
  await fetchUser();
  await fetchMessages(true);
  
  // Start polling
  pollingInterval = setInterval(() => {
    fetchMessages(false);
  }, 3000);
});

onUnmounted(() => {
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
});
</script>
