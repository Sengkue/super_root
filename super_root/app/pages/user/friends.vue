<template>
    <div class="w-full">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div class="flex items-center gap-4">
          <button @click="$router.back()" class="w-10 h-10 flex items-center justify-center text-[#fcd34d] hover:text-white transition-colors group">
            <svg class="w-7 h-7 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
          <h1 class="text-3xl font-bold text-white tracking-wide">
            Friends
          </h1>
        </div>
        
        <div class="relative w-full sm:w-64">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-[#fcd34d]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke-dasharray="2 2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search friends..." 
            class="w-full bg-[#0d1b2a] border-2 border-dashed border-[#84cc16] text-white placeholder-slate-400 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec4899] block pl-10 p-2.5 transition-all shadow-md"
          >
        </div>
      </div>

      <div v-if="pending" class="text-center py-12 text-[#fcd34d] text-lg">
        <div class="inline-block animate-spin w-8 h-8 border-4 border-[#ec4899] border-t-transparent rounded-full mb-4"></div>
        <p>Loading users...</p>
      </div>
      
      <div v-else-if="filteredUsers.length === 0" class="text-center py-12 text-[#fcd34d] bg-[#0d1b2a] rounded-2xl border-post-edge shadow-lg">
        <span class="text-5xl block mb-4">📭</span>
        <p class="text-xl">{{ searchQuery ? 'No users match your search.' : 'No other users found.' }}</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4 pb-20">
        <div v-for="user in filteredUsers" :key="user.id" class="bg-denim border-post-edge rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <!-- Cover Photo area -->
          <div class="h-20 mx-2 mt-2 relative bg-[#0d1b2a] rounded-xl overflow-hidden shadow-[inset_0_0_10px_rgba(0,0,0,0.8)]" :style="user.profile?.coverImage ? `background-image: url('${user.profile.coverImage}'); background-size: cover; background-position: center;` : ''">
          </div>
          
          <div class="px-4 pb-4 flex-1 flex flex-col relative z-10">
            <!-- Avatar -->
            <div class="flex justify-center -mt-10 mb-3 relative z-20">
              <NuxtLink :to="`/user/profile?id=${user.id}`" class="hmong-avatar cursor-pointer transition-transform hover:scale-105">
                <img v-if="user.profile?.profileImage" :src="user.profile.profileImage" class="w-full h-full object-cover rounded-full relative z-10" />
                <span v-else class="text-[#fcd34d] font-bold text-xl relative z-10">{{ user.username.charAt(0).toUpperCase() }}</span>
              </NuxtLink>
            </div>
            
            <!-- User Info -->
            <div class="mb-4 flex-1 text-center mt-2">
              <NuxtLink :to="`/user/profile?id=${user.id}`" class="text-lg font-bold text-white hover:text-[#ec4899] transition-colors block mb-1 truncate drop-shadow-md">
                {{ user.username }}
              </NuxtLink>
              <p class="text-xs text-[#fcd34d] line-clamp-2" v-if="user.profile?.bio">{{ user.profile.bio }}</p>
            </div>
            
            <!-- Actions -->
            <div class="flex flex-col gap-3 mt-auto pt-4 border-t border-dashed border-[#ec4899]/50">
              <NuxtLink :to="`/user/profile?id=${user.id}`" class="stitched-patch-btn hover:scale-105 transition-transform" style="padding: 6px; justify-content: center; width: 100%;">
                <span class="text-xs font-bold text-white relative z-10">View Profile</span>
              </NuxtLink>
              <button @click="toggleFollow(user)" class="stitched-patch-btn hover:scale-105 transition-transform" :style="user.isFollowing ? 'border-color: #84cc16; background-color: #ec4899; padding: 6px; justify-content: center; width: 100%;' : 'padding: 6px; justify-content: center; width: 100%;'">
                <span class="text-xs font-bold relative z-10" :class="user.isFollowing ? 'text-[#0d1b2a]' : 'text-white'">{{ user.isFollowing ? 'Unfollow' : 'Follow' }}</span>
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
