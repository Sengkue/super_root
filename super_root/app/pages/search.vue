<template>
  <div class="search-page">
    <div class="mb-6">
      <div class="relative w-full">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <span class="text-xl opacity-50">🔍</span>
        </div>
        <input 
          type="text" 
          v-model="searchInput" 
          @keyup.enter="handleSearchSubmit" 
          placeholder="Search for users or posts..." 
          class="w-full bg-slate-800 border border-slate-700 text-slate-200 text-lg rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block pl-12 p-4 transition-colors shadow-sm"
        >
      </div>
      
      <h1 v-if="query" class="text-xl font-bold text-slate-300 mt-6 px-1">
        Results for "{{ query }}"
      </h1>
    </div>

    <div v-if="pending" class="text-center py-12 text-slate-400 text-lg">
      <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
      <p>Searching...</p>
    </div>
    
    <div v-else-if="error" class="error">
      Failed to perform search.
    </div>

    <div v-else>
      <div v-if="users.length === 0 && posts.length === 0" class="empty-state">
        <span class="text-5xl block mb-4">📭</span>
        <p class="text-xl" v-if="query">No matching users or posts found.</p>
        <p class="text-xl" v-else>Type something to search.</p>
      </div>

      <!-- Users Results -->
      <div v-if="users.length > 0" class="mb-10">
        <h2 class="text-xl font-bold text-slate-300 mb-4 px-2 border-l-4 border-blue-500">Users</h2>
        <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="user in users" :key="user.id" class="bg-slate-800 rounded-xl border border-slate-700 shadow-sm overflow-hidden hover:border-slate-600 transition-colors flex flex-col">
            <div class="h-16 bg-slate-700 relative" :style="user.profile?.coverImage ? `background-image: url('${user.profile.coverImage}'); background-size: cover; background-position: center;` : ''" :class="{'bg-gradient-to-r from-slate-600 to-slate-500': !user.profile?.coverImage}"></div>
            <div class="px-4 pb-4 flex-1 flex flex-col relative">
              <div class="relative -mt-8 mb-2">
                <div class="w-16 h-16 rounded-full border-4 border-slate-800 bg-slate-700 flex items-center justify-center shadow-md overflow-hidden" :class="{'bg-gradient-to-br from-blue-500 to-pink-500': !user.profile?.profileImage}">
                  <img v-if="user.profile?.profileImage" :src="user.profile.profileImage" class="w-full h-full object-cover" />
                  <span v-else class="text-2xl font-bold text-white">{{ user.username.charAt(0).toUpperCase() }}</span>
                </div>
              </div>
              <div class="mb-3 flex-1 text-center">
                <NuxtLink :to="`/profile?id=${user.id}`" class="text-lg font-bold text-slate-50 hover:text-blue-400 transition-colors block mb-0.5 truncate">
                  {{ user.username }}
                </NuxtLink>
                <p class="text-xs text-slate-400 line-clamp-1" v-if="user.profile?.bio">{{ user.profile.bio }}</p>
              </div>
              <div class="flex flex-col gap-2 mt-auto pt-3 border-t border-slate-700/50">
                <NuxtLink :to="`/profile?id=${user.id}`" class="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 py-1.5 px-2 rounded-lg font-bold text-center text-xs transition-colors">
                  View Profile
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Posts Results -->
      <div v-if="posts.length > 0">
        <h2 class="text-xl font-bold text-slate-300 mb-4 px-2 border-l-4 border-purple-500">Posts</h2>
        <div class="posts-list">
          <FeedPostCard 
            v-for="post in posts" 
            :key="post.id" 
            :post="post"
            @refresh="performSearch"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const query = ref('');
const searchInput = ref(route.query.q || '');
const users = ref([]);
const posts = ref([]);
const pending = ref(true);
const error = ref(null);

const performSearch = async () => {
  query.value = route.query.q || '';
  searchInput.value = query.value;
  if (!query.value.trim()) {
    users.value = [];
    posts.value = [];
    pending.value = false;
    return;
  }

  pending.value = true;
  error.value = null;

  try {
    const $api = useApi();
    const res = await $api(`/search?q=${encodeURIComponent(query.value)}`, {
      headers: authStore.activeUserId ? { 'userid': authStore.activeUserId } : {}
    });

    if (res.success) {
      users.value = res.data.users.filter(u => u.id !== authStore.activeUserId); // Optional: don't show self
      posts.value = res.data.posts;
    } else {
      error.value = true;
    }
  } catch (err) {
    console.error('Search failed', err);
    error.value = true;
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  performSearch();
});

const handleSearchSubmit = () => {
  if (searchInput.value.trim()) {
    router.push({ path: '/search', query: { q: searchInput.value.trim() } });
  } else {
    router.push({ path: '/search' });
  }
};

watch(() => route.query.q, () => {
  performSearch();
});

useHead({
  title: computed(() => `Search: ${query.value || ''} | Super Root`)
});
</script>

<style scoped>
.search-page {
  animation: fadeIn 0.4s ease-out;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
