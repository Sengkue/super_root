<template>
  <div class="replies-page min-h-screen bg-white dark:bg-slate-900 pb-20">
    <!-- Top Header -->
    <header class="flex items-center gap-3 mb-6 px-2">
      <button @click="$router.back()" class="p-1 -ml-1 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <h1 class="text-lg font-semibold text-slate-900 dark:text-white">Replies</h1>
    </header>

    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
    
    <div v-else-if="error || !commentData" class="p-8 text-center text-slate-500">
      Failed to load comment thread.
    </div>

    <div v-else class="content px-4 py-4">
      <!-- Context Subtitle -->
      <div class="text-sm text-slate-600 dark:text-slate-400 mb-6 italic">
        Replies to {{ isMyComment ? 'your' : (commentData.user?.username + "'s") }} comment on 
        <NuxtLink :to="`/post/${commentData.postId}`" class="text-blue-500 hover:underline font-medium">
          {{ commentData.post?.user?.username }}'s post
        </NuxtLink>
      </div>

      <!-- Thread Container -->
      <div class="thread-container relative">
        <!-- Parent Comment -->
        <div class="flex gap-3 mb-4 relative z-10" :id="'comment-' + commentData.id">
          <div class="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 overflow-hidden">
            <img v-if="commentData.user?.profile?.profileImage" :src="commentData.user.profile.profileImage" class="w-full h-full object-cover" />
            <span v-else>{{ commentData.user?.username?.charAt(0).toUpperCase() || '?' }}</span>
          </div>
          <div class="flex-1">
            <div class="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2 inline-block max-w-full">
              <div class="font-bold text-sm text-slate-900 dark:text-white">{{ commentData.user?.username || 'User' }}</div>
              <div class="text-slate-800 dark:text-slate-200 text-[15px] break-words whitespace-pre-wrap">{{ commentData.content }}</div>
            </div>
            <div class="flex gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 ml-2">
              <span>{{ formatTime(commentData.createdAt) }}</span>
              <button class="hover:text-slate-800 dark:hover:text-slate-200">Like</button>
              <button class="hover:text-slate-800 dark:hover:text-slate-200">Reply</button>
            </div>
          </div>
        </div>

        <!-- Replies Connection Line -->
        <div v-if="commentData.replies && commentData.replies.length > 0" class="absolute top-10 left-5 w-0.5 bg-slate-200 dark:bg-slate-700 z-0 bottom-12 rounded-full"></div>

        <!-- Replies List -->
        <div class="replies pl-12 mt-2 space-y-4 relative z-10">
          <div 
            v-for="reply in commentData.replies" 
            :key="reply.id" 
            class="flex gap-2 relative transition-colors duration-500 rounded-lg p-1 -ml-1" 
            :id="'reply-' + reply.id"
          >
            <!-- Connector elbow -->
            <div class="absolute -left-7 top-4 w-6 h-0.5 bg-slate-200 dark:bg-slate-700"></div>
            
            <div class="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-300 overflow-hidden">
              <img v-if="reply.user?.profile?.profileImage" :src="reply.user.profile.profileImage" class="w-full h-full object-cover" />
              <span v-else>{{ reply.user?.username?.charAt(0).toUpperCase() || '?' }}</span>
            </div>
            <div class="flex-1">
              <div class="bg-slate-100 dark:bg-slate-800 rounded-2xl px-3 py-2 inline-block max-w-full">
                <div class="font-bold text-sm text-slate-900 dark:text-white">{{ reply.user?.username || 'User' }}</div>
                <div class="text-slate-800 dark:text-slate-200 text-sm break-words whitespace-pre-wrap">{{ reply.content }}</div>
              </div>
              <div class="flex gap-3 text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 ml-2">
                <span>{{ formatTime(reply.createdAt) }}</span>
                <button class="hover:text-slate-800 dark:hover:text-slate-200">Like</button>
                <button @click="prepareReply(reply.user?.username)" class="hover:text-slate-800 dark:hover:text-slate-200">Reply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky Reply Input -->
    <div class="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-3 flex gap-2 items-end z-40 pb-safe mt-4 rounded-t-2xl shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center font-bold mt-1 overflow-hidden">
        <img v-if="authStore.activeUserObj?.profile?.profileImage" :src="authStore.activeUserObj.profile.profileImage" class="w-full h-full object-cover" />
        <span v-else>{{ authStore.activeUserObj?.username?.charAt(0).toUpperCase() || 'U' }}</span>
      </div>
      <div class="flex-1 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center px-4 py-1.5 border border-slate-200 dark:border-slate-700 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all shadow-sm">
        <textarea 
          ref="replyInput"
          v-model="newReply" 
          rows="1"
          placeholder="Write a reply..." 
          class="w-full bg-transparent border-0 p-0 focus:ring-0 focus:border-transparent focus:outline-none text-sm py-1 resize-none max-h-24 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          @input="autoGrow"
          @keydown.enter.prevent="submitReply"
        ></textarea>
        <button 
          @click="submitReply" 
          :disabled="!newReply.trim() || isSubmitting"
          class="ml-2 text-white bg-blue-500 p-2 rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-blue-500 transition-all flex-shrink-0 shadow-md transform hover:scale-105 active:scale-95"
        >
          <svg class="w-4 h-4 transform rotate-45 ml-[-2px] mt-[-2px]" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useApiFetch, useApi } from '#imports';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const authStore = useAuthStore();
const $api = useApi();
const parentId = route.params.id;

const { data: responseData, pending, error, refresh } = await useApiFetch(`/posts/comments/${parentId}/thread`, {
  lazy: true
});

const commentData = computed(() => responseData.value?.data || null);

const isMyComment = computed(() => {
  return commentData.value && authStore.activeUserId && String(commentData.value.userId) === String(authStore.activeUserId);
});

const newReply = ref('');
const isSubmitting = ref(false);
const replyInput = ref(null);

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  return `${Math.floor(diffInSeconds / 604800)}w`;
};

const autoGrow = (e) => {
  const el = e.target;
  el.style.height = 'auto';
  el.style.height = (el.scrollHeight) + 'px';
};

const prepareReply = (username) => {
  const prefix = `@${username} `;
  if (!newReply.value.startsWith(prefix)) {
    newReply.value = prefix + newReply.value;
  }
  nextTick(() => {
    if (replyInput.value) {
      replyInput.value.focus();
    }
  });
};

const submitReply = async () => {
  if (!newReply.value.trim() || isSubmitting.value || !commentData.value) return;
  if (!authStore.requireAuth()) return;

  isSubmitting.value = true;
  try {
    await $api(`/posts/${commentData.value.postId}/comments`, {
      method: 'POST',
      headers: { 'userid': authStore.activeUserId },
      body: { 
        content: newReply.value.trim(),
        parentId: commentData.value.id
      }
    });
    
    newReply.value = '';
    if (replyInput.value) {
      replyInput.value.style.height = 'auto';
    }
    await refresh(); // Reload thread
    
    // Scroll to bottom to see new reply
    nextTick(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });
  } catch (error) {
    console.error('Failed to post reply:', error);
    alert('Failed to post reply. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
};

const handleHashScroll = () => {
  if (route.hash && route.hash.startsWith('#reply-')) {
    const checkReady = setInterval(() => {
      if (!pending.value && commentData.value) {
        clearInterval(checkReady);
        nextTick(() => {
          setTimeout(() => {
            const replyId = route.hash.substring(7);
            const targetReply = commentData.value.replies?.find(r => String(r.id) === String(replyId));
            if (targetReply) {
               prepareReply(targetReply.user?.username);
            }
            
            const el = document.getElementById(route.hash.substring(1));
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              el.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
              setTimeout(() => {
                el.style.transition = 'background-color 2s';
                el.style.backgroundColor = 'transparent';
              }, 1000);
            }
          }, 300);
        });
      }
    }, 100);
    
    // Clear interval after 5 seconds just in case
    setTimeout(() => clearInterval(checkReady), 5000);
  }
};

watch(() => route.hash, () => {
  handleHashScroll();
});

onMounted(() => {
  // Check for auto-scroll hash
  handleHashScroll();
});
</script>

<style scoped>
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 1rem);
}
</style>
