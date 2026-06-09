<template>
    <div class="main-feed">
      <h1 class="text-2xl font-bold text-slate-50 mb-6 flex items-center gap-2">
        <span class="text-3xl">🔖</span> Saved Posts
      </h1>

      <div v-if="pending && !posts.length" class="loading">Loading saved posts...</div>
      <div v-else-if="error && !posts.length" class="error">Failed to load saved posts</div>
      
      <div v-show="posts.length > 0" class="posts-list">
        <FeedPostCard 
          v-for="post in posts" 
          :key="post.id" 
          :post="post"
          @refresh="refresh"
        />
      </div>
      <div v-if="!pending && posts.length === 0" class="empty-state">
        You haven't saved any posts yet.
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

useHead({
  title: 'Super Root | Saved Posts'
});

const authStore = useAuthStore();
const posts = ref([]);
const pending = ref(true);
const error = ref(null);

const fetchSavedPosts = async () => {
  if (!authStore.activeUserId) {
    posts.value = [];
    pending.value = false;
    return;
  }
  
  pending.value = true;
  error.value = null;
  try {
    const $api = useApi();
    const response = await $api(`/posts/saved?viewerId=${authStore.activeUserId}`, {
      headers: { 'userid': authStore.activeUserId }
    });
    if (response.success) {
      posts.value = response.data;
    } else {
      error.value = new Error(response.message || 'Failed to fetch saved posts');
    }
  } catch (err) {
    console.error('Failed to fetch saved posts', err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  fetchSavedPosts();
});

watch(() => authStore.activeUserId, () => {
  fetchSavedPosts();
});

const refresh = () => {
  fetchSavedPosts();
};
</script>

<style scoped>
/* Main Feed */
.main-feed {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
}

.error {
  text-align: center;
  padding: 2rem;
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 1rem;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--text-secondary);
  background: var(--surface-color);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}
</style>
