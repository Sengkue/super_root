<template>
  <div class="feed-page">
    <div class="feed-layout">
      <!-- Left Sidebar -->
      <aside class="sidebar left-sidebar">
        <nav class="side-nav">
          <NuxtLink to="/feed?tab=all" class="nav-item">
            <span class="icon">📰</span> All
          </NuxtLink>
          <NuxtLink to="/feed?tab=following" class="nav-item">
            <span class="icon">👥</span> Following
          </NuxtLink>
          <NuxtLink to="/feed?tab=foryou" class="nav-item">
            <span class="icon">✨</span> For You
          </NuxtLink>
          <NuxtLink to="/friends" class="nav-item">
            <span class="icon">👥</span> Friends
          </NuxtLink>
          <NuxtLink to="/saved" class="nav-item active">
            <span class="icon">🔖</span> Saved
          </NuxtLink>
          <div class="nav-item">
            <span class="icon">⚙️</span> Settings
          </div>
        </nav>
      </aside>

      <!-- Main Feed -->
      <main class="main-feed">
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
      </main>

      <!-- Right Sidebar -->
      <aside class="sidebar right-sidebar">
        <div class="widget">
          <h3>Sponsored</h3>
          <div class="ad-placeholder">Super Root Ad</div>
        </div>
      </aside>
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
.feed-page {
  padding-top: 2rem;
  padding-bottom: 4rem;
  animation: fadeIn 0.4s ease-out;
}

.feed-layout {
  display: grid;
  grid-template-columns: 240px 1fr 300px;
  gap: 2rem;
  align-items: start;
}

/* Sidebars */
.sidebar {
  position: sticky;
  top: 6rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--surface-color);
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.nav-item:hover, .nav-item.active {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-weight: 600;
}

.icon {
  font-size: 1.25rem;
}

/* Widgets */
.widget {
  background: var(--surface-color);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.widget h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.ad-placeholder {
  width: 100%;
  height: 150px;
  border: 1px dashed var(--border-color);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

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

@media (max-width: 1024px) {
  .feed-layout {
    grid-template-columns: 200px 1fr;
  }
  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .feed-layout {
    grid-template-columns: 1fr;
  }
  .left-sidebar {
    display: none;
  }
  .feed-page {
    padding-top: 1rem;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
