<template>
  <div class="single-post-page max-w-2xl mx-auto py-4">
    <div class="mb-6">
      <NuxtLink to="/feed" class="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors font-medium">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Feed
      </NuxtLink>
    </div>
    
    <div v-if="pending" class="text-center p-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
      <p>Loading post...</p>
    </div>
    
    <div v-else-if="error || !post" class="text-center p-12 text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
      <div class="text-4xl mb-4">🔍</div>
      <h2 class="text-xl font-bold mb-2">Post not found</h2>
      <p class="text-sm opacity-80 mb-6">This post may have been deleted or the link is broken.</p>
      <NuxtLink to="/feed" class="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors">
        Return to Feed
      </NuxtLink>
    </div>
    
    <FeedPostCard 
      v-else 
      :post="post" 
      @refresh="refresh" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useApiFetch } from '#imports';

const route = useRoute();
const postId = route.params.id;

const { data: responseData, pending, error, refresh } = await useApiFetch(`/posts/${postId}`, {
  lazy: true
});

const post = computed(() => responseData.value?.data || null);

useHead({
  title: computed(() => post.value ? `Post by ${post.value.user?.username || 'User'}` : 'Post')
});
</script>
