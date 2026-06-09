<template>
  <div class="max-w-5xl mx-auto w-full pb-20 pt-8 px-4 animate-[fadeIn_0.4s_ease-out]">
    <h1 class="text-3xl font-bold text-slate-50 mb-8 flex items-center gap-3">
      <span class="text-4xl">👥</span> Friends
    </h1>

    <div v-if="pending" class="text-center py-12 text-slate-400 text-lg">
      <div class="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
      <p>Loading users...</p>
    </div>
    
    <div v-else-if="users.length === 0" class="text-center py-12 text-slate-400 bg-slate-800 rounded-2xl border border-slate-700">
      <span class="text-5xl block mb-4">📭</span>
      <p class="text-xl">No other users found.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="user in users" :key="user.id" class="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden hover:border-slate-600 transition-colors flex flex-col">
        <!-- Cover Photo area -->
        <div class="h-20 bg-slate-700 relative" :style="user.profile?.coverImage ? `background-image: url('${user.profile.coverImage}'); background-size: cover; background-position: center;` : ''" :class="{'bg-gradient-to-r from-slate-600 to-slate-500': !user.profile?.coverImage}"></div>
        
        <div class="px-6 pb-6 flex-1 flex flex-col relative">
          <!-- Avatar -->
          <div class="relative -mt-10 mb-3">
            <div class="w-20 h-20 rounded-full border-4 border-slate-800 bg-slate-700 flex items-center justify-center shadow-md overflow-hidden" :class="{'bg-gradient-to-br from-blue-500 to-pink-500': !user.profile?.profileImage}">
              <img v-if="user.profile?.profileImage" :src="user.profile.profileImage" class="w-full h-full object-cover" />
              <span v-else class="text-3xl font-bold text-white">{{ user.username.charAt(0).toUpperCase() }}</span>
            </div>
          </div>
          
          <!-- User Info -->
          <div class="mb-4 flex-1">
            <NuxtLink :to="`/profile?id=${user.id}`" class="text-xl font-bold text-slate-50 hover:text-blue-400 transition-colors block mb-1">
              {{ user.username }}
            </NuxtLink>
            <p class="text-sm text-slate-400 line-clamp-2" v-if="user.profile?.bio">{{ user.profile.bio }}</p>
          </div>
          
          <!-- Actions -->
          <div class="flex gap-2 mt-auto pt-4 border-t border-slate-700/50">
            <NuxtLink :to="`/profile?id=${user.id}`" class="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-3 rounded-lg font-bold text-center text-sm transition-colors">
              View Profile
            </NuxtLink>
            <button @click="toggleFollow(user)" class="flex-1 text-white py-2 px-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors" :class="user.isFollowing ? 'bg-slate-600 hover:bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-700'">
              {{ user.isFollowing ? 'Unfollow' : 'Follow' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

useHead({
  title: 'Super Root | Friends'
});

const authStore = useAuthStore();
const users = ref([]);
const pending = ref(true);

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
