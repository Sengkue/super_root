<template>
  <div class="max-w-3xl mx-auto h-[calc(100vh-80px)] md:h-[calc(100vh-40px)] md:my-5 flex flex-col bg-batik animate-[fadeIn_0.3s_ease-out] md:rounded-3xl overflow-hidden relative border-x-0 md:border-x-2 border-t-0 md:border-t-2 border-dashed border-[#84cc16]/30">
    
    <!-- Header -->
    <div class="px-4 py-3 border-b-2 border-dashed border-[#ec4899]/50 flex items-center justify-between bg-[#0d1b2a] z-20 shadow-md">
      <div class="flex items-center gap-4">
        <button @click="router.back()" class="w-10 h-10 flex items-center justify-center text-[#fcd34d] hover:text-white transition-colors group shrink-0">
          <svg class="w-7 h-7 transition-transform group-hover:-translate-x-1 z-10 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <NuxtLink :to="`/user/profile?id=${otherUser?.id}`" class="flex items-center gap-3 group cursor-pointer overflow-hidden">
          <div class="relative shrink-0">
            <div class="hmong-avatar !w-11 !h-11 !p-1 bg-[#0d1b2a] group-hover:scale-105 transition-transform">
              <img v-if="otherUser?.profile?.profileImage" :src="otherUser.profile.profileImage" class="w-full h-full object-cover rounded-full z-10 relative" />
              <span v-else class="text-[#fcd34d] text-lg font-bold z-10 relative">{{ otherUser?.username?.charAt(0).toUpperCase() || '?' }}</span>
            </div>
            <div v-if="otherUser?.isOnline" class="absolute bottom-0 right-0 w-3 h-3 bg-[#84cc16] border-2 border-[#0d1b2a] rounded-full z-20 shadow-[0_0_8px_#84cc16]"></div>
          </div>
          <div class="min-w-0">
            <h2 class="font-bold text-white group-hover:text-[#ec4899] transition-colors drop-shadow-md truncate">{{ otherUser?.username || 'Loading...' }}</h2>
            <p class="text-[11px] font-bold truncate" :class="otherUser?.isOnline ? 'text-[#84cc16]' : 'text-slate-400'">{{ otherUser?.isOnline ? 'Online' : `@${otherUser?.number || '...'}` }}</p>
          </div>
        </NuxtLink>
      </div>
      
      <div class="relative">
        <button @click="showOptionsMenu = !showOptionsMenu" class="w-10 h-10 flex items-center justify-center text-[#fcd34d] hover:text-white transition-colors group shrink-0">
          <svg class="w-7 h-7 z-10 relative transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path></svg>
        </button>
        <!-- Theme Dropdown -->
        <div v-if="showOptionsMenu" class="hmong-dialogue absolute right-0 mt-3 w-56 z-50 py-2 origin-top-right animate-[fadeIn_0.2s_ease-out] overflow-hidden">
           <div class="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-dashed border-[#ec4899]/50 mb-1 relative z-10">Chat Color Theme</div>
           <button v-for="(theme, key) in themes" :key="key" @click="setTheme(key)" class="w-full text-left px-4 py-2.5 hover:bg-[#ec4899] transition-colors flex items-center justify-between group relative z-10">
             <span class="font-medium text-[14px]" :class="currentThemeKey === key ? 'text-[#fcd34d] font-bold group-hover:text-white' : 'text-white group-hover:text-white'">{{ theme.name }}</span>
             <div class="flex items-center gap-1">
               <div class="w-4 h-4 rounded-full border border-white/20" :class="theme.meColor"></div>
               <div class="w-4 h-4 rounded-full border border-white/20" :class="theme.themColor"></div>
             </div>
           </button>
        </div>
      </div>
    </div>

    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-4 space-y-6 z-10 scroll-smooth relative" ref="messagesContainer">
      <div v-if="loading" class="flex justify-center py-10">
        <div class="w-8 h-8 border-4 border-[#ec4899] border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full text-white animate-[fadeIn_0.5s_ease-out] bg-[#0d1b2a] rounded-2xl border-post-edge shadow-lg mx-4 my-8 p-6">
        <div class="w-24 h-24 mb-6 rounded-full flex items-center justify-center">
          <span class="text-6xl">💬</span>
        </div>
        <p class="text-xl font-bold text-white mb-2">Say hello to {{ otherUser?.username }}!</p>
        <p class="text-[#fcd34d] text-center">Start weaving a beautiful conversation.</p>
      </div>

      <div 
        v-for="(msg, index) in messages" 
        :key="msg.id" 
        class="flex flex-col animate-[slideUp_0.3s_ease-out]"
        :class="msg.senderId === authStore.activeUserId ? 'items-end' : 'items-start'"
      >
        <!-- Time Separator -->
        <div v-if="shouldShowTime(index)" class="self-center text-xs font-bold text-[#fcd34d] mb-4 mt-2 bg-[#0d1b2a] border border-dashed border-[#ec4899] px-4 py-1.5 rounded-full shadow-md">
          {{ formatDateSeparator(msg.createdAt) }}
        </div>

        <div class="flex items-end gap-2 max-w-[85%] md:max-w-[75%] group relative">
          <!-- Avatar for received messages -->
          <div v-if="msg.senderId !== authStore.activeUserId" class="hmong-avatar !w-8 !h-8 !p-0.5 shrink-0 mb-1 hidden sm:flex">
             <img v-if="otherUser?.profile?.profileImage" :src="otherUser.profile.profileImage" class="w-full h-full object-cover rounded-full z-10 relative" />
             <span v-else class="text-[#fcd34d] font-bold text-xs z-10 relative">{{ otherUser?.username?.charAt(0).toUpperCase() || '?' }}</span>
          </div>

          <!-- Bubble -->
          <div 
            class="px-5 py-3 relative text-[15px] leading-relaxed font-medium rounded-2xl"
            :class="[
              msg.senderId === authStore.activeUserId 
                ? `${currentTheme.meBubble} rounded-br-sm` 
                : `${currentTheme.themBubble} rounded-bl-sm`
            ]"
          >
            <p class="whitespace-pre-wrap break-words drop-shadow-sm">{{ msg.content }}</p>
            
            <!-- Inline Time & Status -->
            <div 
              class="flex items-center gap-1 mt-1.5 justify-end text-[10px] font-bold select-none"
              :class="msg.senderId === authStore.activeUserId ? currentTheme.meTime : currentTheme.themTime"
            >
              <span>{{ formatTimeOnly(msg.createdAt) }}</span>
              <svg v-if="msg.senderId === authStore.activeUserId" class="w-3.5 h-3.5" :class="msg.read ? currentTheme.readIcon : 'text-white/60'" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Message Input -->
    <div class="p-4 bg-transparent z-20 w-full mb-2">
      <form @submit.prevent="sendMessage" class="flex items-end gap-3 bg-[#0d1b2a] border-post-edge rounded-[28px] p-3 shadow-xl transition-all w-full max-w-3xl mx-auto">
        
        <!-- Attachment Button -->
        <button type="button" class="w-10 h-10 flex items-center justify-center text-[#fcd34d] hover:text-white transition-colors group shrink-0">
          <svg class="w-6 h-6 z-10 relative transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path></svg>
        </button>

        <!-- Textarea -->
        <textarea
          v-model="newMessage"
          rows="1"
          placeholder="Type a message..."
          class="flex-1 bg-transparent border-none focus:ring-0 resize-none px-2 py-2 text-white max-h-32 min-h-[42px] placeholder-slate-400 font-medium text-[15px] relative z-10"
          @keydown.enter.prevent="sendMessage"
        ></textarea>
        
        <!-- Send Button -->
        <button 
          type="submit" 
          :disabled="!newMessage.trim() || sending"
          class="w-10 h-10 flex items-center justify-center text-[#84cc16] hover:text-white disabled:opacity-50 disabled:hover:text-[#84cc16] transition-colors shrink-0 group"
        >
          <svg v-if="!sending" class="w-7 h-7 translate-x-[2px] z-10 relative transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
          <div v-else class="w-6 h-6 border-2 border-dashed border-[#84cc16] border-t-transparent rounded-full animate-spin z-10 relative"></div>
        </button>
      </form>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
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

const showOptionsMenu = ref(false);
const currentThemeKey = ref('default');

const themes = {
  default: {
    name: 'Default',
    meBubble: 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md border-none',
    themBubble: 'bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-800 dark:text-slate-100 shadow-sm',
    meTime: 'text-indigo-200',
    themTime: 'text-slate-400 dark:text-slate-500',
    readIcon: 'text-blue-300',
    meColor: 'bg-indigo-600',
    themColor: 'bg-slate-800'
  },
  hmong: {
    name: 'Neon Hmong',
    meBubble: 'bg-[#ec4899] text-white border-2 border-dashed border-[#fcd34d] shadow-[0_4px_10px_rgba(236,72,153,0.3)]',
    themBubble: 'bg-denim border-2 border-dashed border-[#84cc16] text-white shadow-[0_4px_10px_rgba(0,0,0,0.4)]',
    meTime: 'text-[#fcd34d]',
    themTime: 'text-[#84cc16]',
    readIcon: 'text-[#84cc16]',
    meColor: 'bg-[#ec4899]',
    themColor: 'bg-[#84cc16]'
  },
  ocean: {
    name: 'Ocean Waves',
    meBubble: 'bg-[#0ea5e9] text-white border-2 border-dashed border-[#fcd34d] shadow-[0_4px_10px_rgba(14,165,233,0.3)]',
    themBubble: 'bg-denim border-2 border-dashed border-[#38bdf8] text-white shadow-[0_4px_10px_rgba(0,0,0,0.4)]',
    meTime: 'text-[#fcd34d]',
    themTime: 'text-[#38bdf8]',
    readIcon: 'text-[#38bdf8]',
    meColor: 'bg-[#0ea5e9]',
    themColor: 'bg-[#38bdf8]'
  },
  sunset: {
    name: 'Golden Sunset',
    meBubble: 'bg-[#f97316] text-white border-2 border-dashed border-white shadow-[0_4px_10px_rgba(249,115,22,0.3)]',
    themBubble: 'bg-denim border-2 border-dashed border-[#fcd34d] text-white shadow-[0_4px_10px_rgba(0,0,0,0.4)]',
    meTime: 'text-white',
    themTime: 'text-[#fcd34d]',
    readIcon: 'text-[#fcd34d]',
    meColor: 'bg-[#f97316]',
    themColor: 'bg-[#fcd34d]'
  },
  royal: {
    name: 'Royal Purple',
    meBubble: 'bg-[#a855f7] text-white border-2 border-dashed border-[#fcd34d] shadow-[0_4px_10px_rgba(168,85,247,0.3)]',
    themBubble: 'bg-denim border-2 border-dashed border-[#e879f9] text-white shadow-[0_4px_10px_rgba(0,0,0,0.4)]',
    meTime: 'text-[#fcd34d]',
    themTime: 'text-[#e879f9]',
    readIcon: 'text-[#e879f9]',
    meColor: 'bg-[#a855f7]',
    themColor: 'bg-[#e879f9]'
  }
};

const currentTheme = computed(() => themes[currentThemeKey.value] || themes.default);

const setTheme = (key) => {
  currentThemeKey.value = key;
  showOptionsMenu.value = false;
  if (typeof window !== 'undefined') {
    localStorage.setItem(`chatTheme_${otherUserId}`, key);
  }
};

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
  
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem(`chatTheme_${otherUserId}`);
    if (savedTheme && themes[savedTheme]) {
      currentThemeKey.value = savedTheme;
    }
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
