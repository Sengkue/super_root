<template>
    <div class="w-full">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 class="text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
          <span class="text-4xl">👥</span> Friends
        </h1>
        
        <div class="relative w-full sm:w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search friends..." 
            class="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 transition-colors"
          >
        </div>
      </div>

      <div v-if="pending" class="text-center py-12 text-slate-600 dark:text-slate-400 text-lg">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p>Loading users...</p>
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="text-center py-12 text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700">
        <span class="text-5xl block mb-4">📭</span>
        <p class="text-xl">{{ searchQuery ? 'No users match your search.' : 'No other users found.' }}</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="user in filteredUsers" :key="user.id" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden hover:border-slate-400 dark:border-slate-600 transition-colors flex flex-col">
          <!-- Cover Photo area -->
          <div class="h-16 bg-slate-100 dark:bg-slate-700 relative" :style="user.profile?.coverImage ? `background-image: url('${user.profile.coverImage}'); background-size: cover; background-position: center;` : ''" :class="{'bg-gradient-to-r from-slate-600 to-slate-500': !user.profile?.coverImage}"></div>
          
          <div class="px-4 pb-4 flex-1 flex flex-col relative">
            <!-- Avatar -->
            <div class="relative -mt-8 mb-2">
              <div class="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-700 flex items-center justify-center shadow-md overflow-hidden" :class="{'bg-gradient-to-br from-blue-500 to-pink-500': !user.profile?.profileImage}">
                <img v-if="user.profile?.profileImage" :src="user.profile.profileImage" class="w-full h-full object-cover" />
                <span v-else class="text-2xl font-bold text-slate-900 dark:text-white">{{ user.username.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            
            <!-- User Info -->
            <div class="mb-3 flex-1 text-center">
              <NuxtLink :to="`/user/profile?id=${user.id}`" class="text-lg font-bold text-slate-900 dark:text-slate-50 hover:text-blue-400 transition-colors block mb-0.5 truncate">
                {{ user.username }}
              </NuxtLink>
              <p class="text-xs text-slate-600 dark:text-slate-400 line-clamp-1" v-if="user.profile?.bio">{{ user.profile.bio }}</p>
            </div>
            
            <!-- Actions -->
            <div class="flex flex-col gap-2 mt-auto pt-3 border-t border-slate-700/50">
              <NuxtLink :to="`/user/profile?id=${user.id}`" class="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 py-1.5 px-2 rounded-lg font-bold text-center text-xs transition-colors">
                View Profile
              </NuxtLink>
              <button @click="toggleFollow(user)" class="w-full text-slate-900 dark:text-white py-1.5 px-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors" :class="user.isFollowing ? 'bg-slate-200 dark:bg-slate-600 hover:bg-slate-100 dark:bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-700'">
                {{ user.isFollowing ? 'Unfollow' : 'Follow' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';

useHead({
  title: 'Super Root | Friends'
});

const authStore = useAuthStore();
const users = ref([]);
const pending = ref(true);
const searchQuery = ref('');

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  const q = searchQuery.value.toLowerCase();
  return users.value.filter(u => {
    const matchUsername = u.username && u.username.toLowerCase().includes(q);
    const matchNumber = u.number && u.number.includes(q);
    const matchBio = u.profile?.bio && u.profile.bio.toLowerCase().includes(q);
    return matchUsername || matchNumber || matchBio;
  });
});

const fetchUsers = async () => {
  pending.value = true;
  try {
    const $api = useApi();
    const res = await $api(`/users?viewerId=${authStore.activeUserId || ''}`);
    if (res.success) {
      // Filter out the active user
      users.value = res.data.filter(u => u.id !== authStore.activeUserId);
    }
  } catch (err) {
    console.error('Failed to fetch users', err);
  } finally {
    pending.value = false;
  }
};

const toggleFollow = async (user) => {
  if (!authStore.activeUserId) return;
  try {
    const endpoint = user.isFollowing ? '/follows/unfollow' : '/follows/follow';
    const $api = useApi();
    const res = await $api(endpoint, {
      method: 'POST',
      body: { followerId: authStore.activeUserId, followingId: user.id }
    });
    if (res.success) {
      user.isFollowing = !user.isFollowing;
    }
  } catch (err) {
    console.error('Failed to toggle follow', err);
  }
};

onMounted(() => {
  fetchUsers();
});

watch(() => authStore.activeUserId, () => {
  fetchUsers();
});
</script>
