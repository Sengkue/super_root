<template>
    <div class="main-feed">
      <div class="hidden md:block">
        <FeedCreatePostBox 
          @post-created="refresh"
        />
      </div>
      
      <div v-if="pending && !posts.length" class="loading">Loading posts...</div>
      <div v-else-if="error && !posts.length" class="error">Failed to load posts</div>
      
      <div v-show="posts.length > 0" class="posts-list">
        <FeedPostCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post"
          @refresh="refresh"
        />
      </div>
      <div v-if="posts.length === 0" class="empty-state">
        No posts yet. Be the first to share something!
      </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

useHead({
  title: 'Super Root | Feed'
});

const route = useRoute();
const authStore = useAuthStore();

const feedType = computed(() => route.query.tab || 'all');

const { data: responseData, pending, error, refresh } = await useApiFetch(() => `/posts?feedType=${feedType.value}&viewerId=${authStore.activeUserId || ''}`, {
  lazy: true,
  watch: [feedType, () => authStore.activeUserId]
});

const posts = computed(() => responseData.value?.data || []);

const onPostCreated = () => {
  refresh();
};
</script>

<style scoped>
@reference "../../assets/css/main.css";

.main-feed {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 3rem;
  @apply text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm;
  border-radius: 1rem;
  border-width: 1px;
  border-style: solid;
}
</style>
