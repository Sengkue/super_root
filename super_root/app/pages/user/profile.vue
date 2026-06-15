<template>
  <div class="max-w-3xl mx-auto w-full pb-20 animate-[fadeIn_0.4s_ease-out]">
    
    <!-- File Inputs for ImgBB Uploads -->
    <input type="file" ref="profileImageInput" class="hidden" @change="uploadProfileImageToImgBB" accept="image/*" />
    <input type="file" ref="coverImageInput" class="hidden" @change="uploadCoverImageToImgBB" accept="image/*" />

    <!-- Cover Photo & Avatar Section -->
    <div class="relative bg-white dark:bg-slate-800 rounded-b-2xl border-x border-b border-slate-300 dark:border-slate-700 shadow-sm overflow-hidden mb-4">
      <!-- Cover Photo -->
      <div class="h-48 md:h-64 relative bg-white dark:bg-slate-800" :style="targetUser?.profile?.coverImage ? `background-image: url('${targetUser.profile.coverImage}'); background-size: cover; background-position: center;` : ''" :class="{'bg-gradient-to-r from-slate-600 to-slate-500': !targetUser?.profile?.coverImage}">
        <!-- Floating Back Button -->
        <button @click="$router.back()" class="absolute top-4 left-4 w-10 h-10 bg-black/40 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors z-30 shadow-sm">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        </button>
        <div v-if="isOwnProfile" @click="coverImageInput?.click()" class="absolute bottom-4 right-4 w-9 h-9 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-slate-100 dark:bg-slate-700 transition-colors" :class="{'opacity-50 pointer-events-none': isUploadingCoverImage}">
          <svg v-if="!isUploadingCoverImage" class="w-5 h-5 text-slate-800 dark:text-slate-200" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
          <svg v-else class="animate-spin w-5 h-5 text-slate-800 dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
      </div>
      
      <!-- Profile Content Wrapper -->
      <div class="px-4 pb-4">
        <!-- Avatar overlapping cover -->
        <div class="relative -mt-16 mb-3 inline-block">
          <div class="w-32 h-32 rounded-full border-4 border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-md relative z-10 overflow-hidden bg-white dark:bg-slate-800" :class="{'bg-gradient-to-br from-blue-500 to-pink-500': !targetUser?.profile?.profileImage, 'opacity-75': isUploadingProfileImage}">
            <img v-if="targetUser?.profile?.profileImage" :src="targetUser.profile.profileImage" class="w-full h-full object-cover" />
            <span v-else class="text-6xl font-bold text-slate-900 dark:text-white">{{ targetUser?.username?.charAt(0).toUpperCase() || '?' }}</span>
          </div>
          <div v-if="isOwnProfile" @click="profileImageInput?.click()" class="absolute bottom-1 right-1 w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center cursor-pointer border-2 border-slate-200 dark:border-slate-800 z-20 hover:bg-slate-200 dark:bg-slate-600 transition-colors" :class="{'opacity-50 pointer-events-none': isUploadingProfileImage}">
            <svg v-if="!isUploadingProfileImage" class="w-5 h-5 text-slate-800 dark:text-slate-200" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd"></path></svg>
            <svg v-else class="animate-spin w-5 h-5 text-slate-800 dark:text-slate-200" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        </div>

        <!-- Name & Bio Display / Edit Mode -->
        <div v-if="!isEditingProfile">
          <!-- Name & Bio -->
          <div class="mb-4">
            <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-1 flex items-center gap-2">
              {{ (targetUser?.profile?.firstName || targetUser?.profile?.lastName) ? `${targetUser.profile.firstName || ''} ${targetUser.profile.lastName || ''}`.trim() : targetUser?.username || 'Guest' }}
              <div v-if="targetUser?.isOnline" class="w-3 h-3 rounded-full bg-green-500 border border-green-700" title="Online"></div>
              <svg class="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            </h1>
            <div class="text-sm font-medium text-slate-600 dark:text-slate-400 flex flex-wrap gap-2 mb-2">
              <span><strong class="text-slate-800 dark:text-slate-200">{{ targetUser?.followersCount || 0 }}</strong> Followers</span>
              <span>&bull;</span>
              <span><strong class="text-slate-800 dark:text-slate-200">{{ targetUser?.followingCount || 0 }}</strong> Following</span>
              <span>&bull;</span>
              <span><strong class="text-slate-800 dark:text-slate-200">{{ userPosts.length }}</strong> Posts</span>
            </div>
            <p class="text-slate-700 dark:text-slate-300 text-sm" v-if="targetUser?.profile?.bio">{{ targetUser.profile.bio }}</p>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 mb-4">
            <template v-if="isOwnProfile">
              <button @click="showCreatePost = true" class="stitched-patch-btn flex-1 group flex items-center justify-center !p-3 hover:scale-105 transition-transform !border-[#fcd34d]">
                <div class="flex items-center justify-center gap-2 z-10 relative text-[#fcd34d] font-black group-hover:text-yellow-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M12 4v16m8-8H4"></path></svg>
                  <span class="uppercase">Add Post</span>
                </div>
              </button>
              <button @click="startEditing" class="stitched-patch-btn flex-1 group flex items-center justify-center !p-3 hover:scale-105 transition-transform !border-[#0ea5e9]">
                <div class="flex items-center justify-center gap-2 z-10 relative text-[#0ea5e9] font-black group-hover:text-sky-300">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  <span class="uppercase">Edit</span>
                </div>
              </button>
            </template>
            <template v-else>
              <button @click="toggleFollow" class="stitched-patch-btn flex-1 group flex items-center justify-center !p-3 hover:scale-105 transition-transform" :class="isFollowingTarget ? '!border-[#ec4899]' : '!border-[#fcd34d]'">
                <div class="flex items-center justify-center gap-2 z-10 relative font-black transition-colors" :class="isFollowingTarget ? 'text-[#ec4899] group-hover:text-pink-400' : 'text-[#fcd34d] group-hover:text-yellow-300'">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7h-2v2h-2v2h2v2h2v-2h2V9h-2V7z"></path></svg>
                  <span class="uppercase">{{ isFollowingTarget ? 'Unfollow' : 'Follow' }}</span>
                </div>
              </button>
              <NuxtLink :to="`/chat/${targetUserId}`" class="stitched-patch-btn flex-1 group flex items-center justify-center !p-3 hover:scale-105 transition-transform cursor-pointer !border-[#84cc16]">
                <div class="flex items-center justify-center gap-2 z-10 relative text-[#84cc16] font-black group-hover:text-green-400">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" stroke-dasharray="2 2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                  <span class="uppercase">Message</span>
                </div>
              </NuxtLink>
            </template>
          </div>

          <!-- Details List -->
          <div class="space-y-3 mb-4 text-sm text-slate-700 dark:text-slate-300">
            <div class="flex items-center gap-3" v-if="targetUser?.profile?.livesIn">
              <svg class="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path></svg>
              <span>Lives in <strong>{{ targetUser.profile.livesIn }}</strong></span>
            </div>
            <div class="flex items-center gap-3" v-if="targetUser?.profile?.worksAt">
              <svg class="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path><path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"></path></svg>
              <span>Works at <strong>{{ targetUser.profile.worksAt }}</strong></span>
            </div>
            <div class="flex items-center gap-3" v-if="targetUser?.profile?.email">
              <svg class="w-5 h-5 text-slate-600 dark:text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" clip-rule="evenodd"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
              <a :href="`mailto:${targetUser.profile.email}`" class="text-blue-400 hover:underline break-all">{{ targetUser.profile.email }}</a>
            </div>
          </div>
        </div>

        <!-- Edit Profile Form -->
        <div v-else class="mb-4">
          <h2 class="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">Edit Profile</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">First Name</label>
                <input v-model="editForm.firstName" type="text" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500" placeholder="John" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Last Name</label>
                <input v-model="editForm.lastName" type="text" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
              <input v-model="editForm.email" type="email" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500" placeholder="john@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Bio</label>
              <input v-model="editForm.bio" type="text" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500" placeholder="A short bio" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Lives in</label>
              <input v-model="editForm.livesIn" type="text" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500" placeholder="City, Country" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Works at</label>
              <input v-model="editForm.worksAt" type="text" class="w-full bg-slate-100 dark:bg-slate-700 border border-slate-400 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500" placeholder="Company Name" />
            </div>
            <div class="flex gap-4 pt-4 mt-2">
              <button @click="saveProfile" :disabled="isSaving" class="stitched-patch-btn flex-1 group flex items-center justify-center !p-3 hover:scale-105 transition-transform !border-[#84cc16] disabled:opacity-50 disabled:hover:scale-100">
                <div class="flex items-center justify-center gap-2 z-10 relative text-[#84cc16] font-black group-hover:text-green-400 uppercase tracking-wide">
                  {{ isSaving ? 'Saving...' : 'Save Profile' }}
                </div>
              </button>
              <button @click="isEditingProfile = false" class="stitched-patch-btn flex-1 group flex items-center justify-center !p-3 hover:scale-105 transition-transform !border-[#f87171]">
                <div class="flex items-center justify-center gap-2 z-10 relative text-[#f87171] font-black group-hover:text-red-400 uppercase tracking-wide">
                  Cancel
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs (Restored without bulky cards) -->
    <div class="flex gap-4 mb-6 px-1">
      <button @click="activeTab = 'Posts'" :class="['flex-1 text-center py-3 font-extrabold cursor-pointer transition-all rounded-2xl border-post-edge shadow-md uppercase tracking-wide', activeTab === 'Posts' ? 'bg-[#0d1b2a] text-[#ec4899] scale-105' : 'bg-[#14213d] text-white opacity-80 hover:opacity-100']">Posts</button>
      <button @click="activeTab = 'Photos'" :class="['flex-1 text-center py-3 font-extrabold cursor-pointer transition-all rounded-2xl border-post-edge shadow-md uppercase tracking-wide', activeTab === 'Photos' ? 'bg-[#0d1b2a] text-[#0ea5e9] scale-105' : 'bg-[#14213d] text-white opacity-80 hover:opacity-100']">Photos</button>
    </div>

    <!-- Content Area (No Card Wrapper) -->
    <div class="mb-8 px-1">
      <div v-if="pending" class="text-center py-8 text-[#fcd34d] font-medium">Loading content...</div>
      <div v-else-if="error" class="text-center py-8 text-red-400 font-medium">Failed to load content</div>
      <div v-else-if="!targetUserId" class="text-center py-8 text-[#fcd34d] font-medium">No user selected.</div>
      <div v-else>
        <!-- Posts View -->
        <div v-if="activeTab === 'Posts'" class="flex flex-col gap-6">
          <FeedPostCard 
            v-for="post in filteredPosts" 
            :key="post.id" 
            :post="post"
            @refresh="fetchUserPosts"
          />
          <div v-if="filteredPosts.length === 0" class="text-center py-12 text-[#fcd34d] font-bold border-2 border-dashed border-[#ec4899]/50 rounded-3xl bg-[#0d1b2a] shadow-lg mt-4">
            No posts to show.
          </div>
        </div>

        <!-- Photos View -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div v-for="(photo, index) in allPhotos" :key="photo.id" class="aspect-square rounded-2xl overflow-hidden bg-[#0d1b2a] shadow-md hover:scale-105 transition-transform cursor-pointer relative z-10" @click="openLightbox(index)">
            <img :src="photo.url" class="w-full h-full object-cover z-10 relative" />
          </div>
          <div v-if="allPhotos.length === 0" class="col-span-2 md:col-span-3 text-center py-12 text-[#0ea5e9] font-bold border-2 border-dashed border-[#0ea5e9]/50 rounded-3xl bg-[#0d1b2a] shadow-lg mt-4">
            No photos to show.
          </div>
        </div>
      </div>
    </div>

    <!-- Create Post Modal Dialog -->
    <div v-if="showCreatePost" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-300 dark:border-slate-700">
        <div class="flex justify-between items-center p-4 border-b border-slate-300 dark:border-slate-700">
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-50">Create Post</h3>
          <button @click="showCreatePost = false" class="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:text-slate-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-4">
          <FeedCreatePostBox @post-created="handlePostCreated" />
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Lightbox -->
    <Teleport to="body">
      <div v-if="isLightboxOpen" class="fixed inset-0 z-[100000] flex items-center justify-center bg-white dark:bg-black/95 animate-[fadeIn_0.2s_ease-out]" @click="closeLightbox">
        <button class="absolute top-5 right-8 text-slate-900 dark:text-white text-5xl hover:text-blue-500 transition-colors z-[100001]" @click="closeLightbox">×</button>
        
        <button v-if="activeImageIndex > 0" class="absolute left-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 rounded-full text-slate-900 dark:text-white text-2xl flex items-center justify-center transition-colors z-[100001]" @click.stop="prevImage">❮</button>
        
        <img :src="allPhotos[activeImageIndex].url" class="max-w-[90vw] max-h-[90vh] object-contain shadow-2xl select-none" @click.stop />
        
        <button v-if="activeImageIndex < allPhotos.length - 1" class="absolute right-5 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/30 rounded-full text-slate-900 dark:text-white text-2xl flex items-center justify-center transition-colors z-[100001]" @click.stop="nextImage">❯</button>
        
        <div class="absolute bottom-5 bg-white dark:bg-black/60 text-slate-900 dark:text-white text-lg px-4 py-1 rounded-full z-[100001]">
          {{ activeImageIndex + 1 }} / {{ allPhotos.length }}
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

useHead({
  title: 'Super Root | Profile'
});

const authStore = useAuthStore();
const route = useRoute();

const targetUserId = computed(() => route.query.id || authStore.activeUserId);
const isOwnProfile = computed(() => targetUserId.value === authStore.activeUserId);
const targetUser = ref(null);
const isFollowingTarget = ref(false);

const userPosts = ref([]);
const pending = ref(false);
const error = ref(null);

// Tabs Logic
const activeTab = ref('Posts');
const filteredPosts = computed(() => {
  if (activeTab.value === 'Photos') {
    return userPosts.value.filter(p => !!p.imageUrl);
  }
  return userPosts.value;
});

// Extract all images from posts (since post.imageUrl can be comma-separated)
const allPhotos = computed(() => {
  const photos = [];
  userPosts.value.forEach(post => {
    if (post.imageUrl) {
      const urls = post.imageUrl.split(',').map(u => u.trim()).filter(Boolean);
      urls.forEach((url, index) => {
        photos.push({
          id: `${post.id}-${index}`,
          postId: post.id,
          url: url
        });
      });
    }
  });
  return photos;
});

// Profile Editing State
const isEditingProfile = ref(false);
const isSaving = ref(false);
const editForm = ref({ bio: '', livesIn: '', worksAt: '', profileImage: '', coverImage: '', email: '', firstName: '', lastName: '' });

// Post Creation State
const showCreatePost = ref(false);

// Lightbox state
const activeImageIndex = ref(null);
const isLightboxOpen = computed(() => activeImageIndex.value !== null);

const openLightbox = (index) => {
  activeImageIndex.value = index;
};

const closeLightbox = () => {
  activeImageIndex.value = null;
};

const nextImage = (e) => {
  if (e) e.stopPropagation();
  if (activeImageIndex.value < allPhotos.value.length - 1) {
    activeImageIndex.value++;
  }
};

const prevImage = (e) => {
  if (e) e.stopPropagation();
  if (activeImageIndex.value > 0) {
    activeImageIndex.value--;
  }
};

// --- ImgBB Image Upload Logic ---
const profileImageInput = ref(null);
const coverImageInput = ref(null);
const isUploadingProfileImage = ref(false);
const isUploadingCoverImage = ref(false);

const uploadImageToImgBB = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('key', '7d2c2ae7d5b133f548c7748f4bd95936');
  
  const response = await fetch('https://api.imgbb.com/1/upload', {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  if (data.success) {
    return data.data.url;
  } else {
    throw new Error(data.error?.message || 'Failed to upload image');
  }
};

const updateProfileWithImageUrl = async (field, url) => {
  if (!authStore.activeUserId) return;
  
  const payload = {
    bio: targetUser.value?.profile?.bio || '',
    livesIn: targetUser.value?.profile?.livesIn || '',
    worksAt: targetUser.value?.profile?.worksAt || '',
    profileImage: targetUser.value?.profile?.profileImage || '',
    coverImage: targetUser.value?.profile?.coverImage || ''
  };
  
  payload[field] = url;
  
  try {
    const $api = useApi();
    const res = await $api(`/users/${authStore.activeUserId}/profile`, {
      method: 'PUT',
      body: payload
    });
    if (res.success) {
      await authStore.fetchCurrentUser();
      await fetchTargetUser();
    }
  } catch (err) {
    console.error('Failed to update profile image url', err);
    throw err;
  }
};

const uploadProfileImageToImgBB = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isUploadingProfileImage.value = true;
  try {
    const url = await uploadImageToImgBB(file);
    await updateProfileWithImageUrl('profileImage', url);
  } catch (error) {
    console.error(error);
    alert('Failed to upload profile image.');
  } finally {
    isUploadingProfileImage.value = false;
    event.target.value = '';
  }
};

const uploadCoverImageToImgBB = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  isUploadingCoverImage.value = true;
  try {
    const url = await uploadImageToImgBB(file);
    await updateProfileWithImageUrl('coverImage', url);
  } catch (error) {
    console.error(error);
    alert('Failed to upload cover image.');
  } finally {
    isUploadingCoverImage.value = false;
    event.target.value = '';
  }
};
// --------------------------------

const startEditing = () => {
  editForm.value = {
    bio: targetUser.value?.profile?.bio || '',
    livesIn: targetUser.value?.profile?.livesIn || '',
    worksAt: targetUser.value?.profile?.worksAt || '',
    profileImage: targetUser.value?.profile?.profileImage || '',
    coverImage: targetUser.value?.profile?.coverImage || '',
    email: targetUser.value?.profile?.email || '',
    firstName: targetUser.value?.profile?.firstName || '',
    lastName: targetUser.value?.profile?.lastName || ''
  };
  isEditingProfile.value = true;
};

const saveProfile = async () => {
  if (!authStore.activeUserId) return;
  isSaving.value = true;
  try {
    const $api = useApi();
    const res = await $api(`/users/${authStore.activeUserId}/profile`, {
      method: 'PUT',
      body: editForm.value
    });
    if (res.success) {
      // Refresh the user object in the store
      await authStore.fetchCurrentUser();
      await fetchTargetUser();
      isEditingProfile.value = false;
    }
  } catch (err) {
    console.error('Failed to save profile', err);
    alert('Failed to save profile: ' + (err.message || 'Unknown error'));
  } finally {
    isSaving.value = false;
  }
};

const handlePostCreated = () => {
  showCreatePost.value = false;
  fetchUserPosts();
};

const fetchUserPosts = async () => {
  if (!targetUserId.value) {
    userPosts.value = [];
    return;
  }
  pending.value = true;
  error.value = null;
  try {
    const $api = useApi();
    const res = await $api(`/posts/user/${targetUserId.value}`);
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


const fetchTargetUser = async () => {
  if (!targetUserId.value) return;
  try {
    const $api = useApi();
    const res = await $api(`/users/${targetUserId.value}?viewerId=${authStore.activeUserId || ''}`);
    if (res.success) {
      targetUser.value = res.data;
      isFollowingTarget.value = res.data.isFollowing;
    }
  } catch (err) {
    console.error('Failed to fetch user', err);
  }
};

const toggleFollow = async () => {
  if (!authStore.activeUserId || !targetUserId.value) return;
  try {
    const endpoint = isFollowingTarget.value ? '/follows/unfollow' : '/follows/follow';
    const $api = useApi();
    const res = await $api(endpoint, {
      method: 'POST',
      body: { followerId: authStore.activeUserId, followingId: targetUserId.value }
    });
    if (res.success) {
      isFollowingTarget.value = !isFollowingTarget.value;
      if (isFollowingTarget.value) {
        targetUser.value.followersCount++;
      } else {
        targetUser.value.followersCount--;
      }
    }
  } catch (err) {
    console.error('Failed to toggle follow', err);
    alert('Failed to follow/unfollow user');
  }
};

onMounted(() => {
  fetchTargetUser();
  fetchUserPosts();
});

watch(() => targetUserId.value, () => {
  fetchTargetUser();
  fetchUserPosts();
});
watch(() => authStore.activeUserId, () => {
  fetchTargetUser();
  fetchUserPosts();
});
</script>


