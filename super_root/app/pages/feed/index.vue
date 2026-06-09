<template>
  <div class="feed-page">
    <div class="feed-layout">
      <!-- Left Sidebar -->
      <aside class="sidebar left-sidebar">
        <nav class="side-nav">
          <NuxtLink to="/feed?tab=all" class="nav-item" :class="{ 'active': $route.query.tab === 'all' || !$route.query.tab }">
            <span class="icon">📰</span> All
          </NuxtLink>
          <NuxtLink to="/feed?tab=following" class="nav-item" :class="{ 'active': $route.query.tab === 'following' }">
            <span class="icon">👥</span> Following
          </NuxtLink>
          <NuxtLink to="/feed?tab=foryou" class="nav-item" :class="{ 'active': $route.query.tab === 'foryou' }">
            <span class="icon">✨</span> For You
          </NuxtLink>
          <NuxtLink to="/friends" class="nav-item">
            <span class="icon">👥</span> Friends
          </NuxtLink>
          <NuxtLink to="/saved" class="nav-item">
            <span class="icon">🔖</span> Saved
          </NuxtLink>
          <div class="nav-item">
            <span class="icon">⚙️</span> Settings
          </div>
        </nav>
      </aside>

      <!-- Main Feed -->
      <main class="main-feed">
        <!-- User Switcher removed -->

        <FeedCreatePostBox 
          @post-created="refresh"
        />
        
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
.feed-page {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.feed-layout {
  display: grid;
  grid-template-columns: 250px minmax(0, 1fr) 250px;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 900px) {
  .feed-layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
}

.sidebar {
  position: sticky;
  top: 100px;
  height: max-content;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.1);
  color: var(--accent-color);
}

.main-feed {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
}


.widget {
  margin-bottom: 2rem;
}

.widget h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.ad-placeholder {
  background: rgba(15, 23, 42, 0.5);
  border: 1px dashed var(--border-color);
  border-radius: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-secondary);
  background: var(--surface-color);
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}
</style>
