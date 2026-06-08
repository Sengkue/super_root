<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="avatar-large">{{ authStore.activeUser?.username?.charAt(0).toUpperCase() || '?' }}</div>
      <div class="user-info">
        <h1>{{ authStore.activeUser?.username || 'Guest' }}</h1>
        <p class="email">{{ authStore.activeUser?.email || 'Please login to view profile' }}</p>
      </div>
    </div>

    <div class="content-section">
      <h2>My Posts</h2>
      <div v-if="pending" class="loading">Loading posts...</div>
      <div v-else-if="error" class="error">Failed to load posts</div>
      <div v-else-if="!authStore.activeUserId" class="empty-state">No user selected.</div>
      <div v-else class="posts-container">
        <FeedPostCard 
          v-for="post in userPosts" 
          :key="post.id" 
          :post="post"
          @refresh="fetchUserPosts"
        />
        <div v-if="userPosts.length === 0" class="empty-state">
          You haven't made any posts yet.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

useHead({
  title: 'Super Root | Profile'
});

const authStore = useAuthStore();
const userPosts = ref([]);
const pending = ref(false);
const error = ref(null);

const fetchUserPosts = async () => {
  if (!authStore.activeUserId) {
    userPosts.value = [];
    return;
  }
  pending.value = true;
  error.value = null;
  try {
    const $api = useApi();
    const res = await $api(`/posts/user/${authStore.activeUserId}`);
    if (res.success) {
      userPosts.value = res.data;
    }
  } catch (err) {
    console.error('Failed to fetch user posts', err);
    error.value = err;
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  fetchUserPosts();
});

watch(() => authStore.activeUserId, () => {
  fetchUserPosts();
});
</script>

<style scoped>
.profile-page {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  background: var(--surface-color);
  padding: 3rem 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #ec4899);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  color: white;
}

.user-info h1 {
  margin: 0 0 0.5rem 0;
  color: var(--text-primary);
}

.email {
  color: var(--text-secondary);
}


.content-section h2 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  background: var(--surface-color);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}
</style>
