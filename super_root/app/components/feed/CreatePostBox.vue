<template>
  <div class="create-post-container" :class="{ 'hidden': hideTrigger && !isModalOpen }">
    <!-- Trigger Box (Inline) -->
    <div v-if="!hideTrigger" class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 shadow-sm rounded-2xl p-4 mb-6 transition-all hover:shadow-md">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-inner overflow-hidden">
          <img v-if="authStore.activeUserObj?.profile?.profileImage" :src="authStore.activeUserObj.profile.profileImage" class="w-full h-full object-cover" />
          <span v-else>{{ authStore.activeUserObj?.username?.charAt(0).toUpperCase() || '?' }}</span>
        </div>
        <button class="flex-1 text-left bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 py-2.5 px-4 rounded-full font-medium cursor-pointer transition-colors hover:bg-slate-200 dark:hover:bg-slate-900/80" @click="openModal">
          What's on your mind, {{ authStore.activeUserObj?.username || 'User' }}?
        </button>
      </div>
    </div>

    <!-- Create Post Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" @click="closeModal">
        <div class="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 w-full max-w-lg rounded-2xl shadow-2xl flex flex-col m-4 overflow-hidden transform transition-all" @click.stop>
          
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-slate-700/50 relative bg-slate-50/50 dark:bg-slate-800/30">
            <h2 class="w-full text-center text-xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight">Create Post</h2>
            <button class="absolute right-4 w-8 h-8 rounded-full bg-slate-200/50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-300 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors" @click="closeModal">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <!-- User Info -->
          <div class="flex items-center gap-3 p-4">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-inner overflow-hidden">
              <img v-if="authStore.activeUserObj?.profile?.profileImage" :src="authStore.activeUserObj.profile.profileImage" class="w-full h-full object-cover" />
              <span v-else>{{ authStore.activeUserObj?.username?.charAt(0).toUpperCase() || '?' }}</span>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-slate-900 dark:text-slate-50 text-base">{{ authStore.activeUserObj?.username || 'User' }}</span>
              <button class="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded text-xs px-2 py-0.5 mt-0.5 flex items-center gap-1 font-semibold w-fit">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                Friends <span class="text-[8px]">▼</span>
              </button>
            </div>
          </div>
          
          <!-- Body -->
          <div class="px-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
            <textarea 
              v-model="content" 
              :placeholder="`What's on your mind, ${authStore.activeUserObj?.username || 'User'}?`"
              class="w-full min-h-[100px] bg-transparent border-none resize-none text-xl md:text-2xl text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 mb-2"
            ></textarea>
            
            <!-- Image Previews -->
            <div v-if="selectedImagePreviews.length > 0" class="flex flex-wrap gap-2 pb-4">
              <div v-for="(preview, idx) in selectedImagePreviews" :key="idx" class="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 w-32 h-32 md:w-40 md:h-40 group shadow-sm">
                <img :src="preview" class="w-full h-full object-cover transition-transform group-hover:scale-105" />
                <button v-if="!isSubmitting" class="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-sm text-white border border-white/20 flex items-center justify-center hover:bg-red-500/80 transition-colors z-10" @click="removeImage(idx)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
                
                <div v-if="uploadingImage && idx === currentUploadIndex" class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-20">
                  <div v-if="uploadProgress === 100" class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <div v-else class="w-3/4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full transition-all duration-200" :style="{ width: uploadProgress + '%' }"></div>
                  </div>
                  <span class="text-white text-xs font-bold">{{ uploadProgress === 100 ? 'Processing...' : uploadProgress + '%' }}</span>
                </div>
                
                <div v-if="uploadingImage && idx < currentUploadIndex" class="absolute inset-0 bg-emerald-500/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <svg class="w-8 h-8 text-white drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Add to Post -->
          <div class="mx-4 mb-4 mt-2 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl flex items-center justify-between shadow-inner relative">
            <span class="font-semibold text-slate-700 dark:text-slate-300 text-sm pl-2">Add to your post</span>
            <div class="flex items-center gap-1 relative">
              <button class="p-2.5 rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all group" @click="$refs.fileInput.click()" title="Attach Images">
                <span class="text-2xl leading-none drop-shadow-sm group-hover:scale-110 inline-block transition-transform">📷</span>
              </button>
              <button class="p-2.5 rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all group" @click.stop="toggleTagInput" title="Tag People">
                <span class="text-2xl leading-none drop-shadow-sm group-hover:scale-110 inline-block transition-transform">👤</span>
              </button>
              <button class="p-2.5 rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all group" @click.stop="toggleEmojiPicker" title="Feelings/Activity">
                <span class="text-2xl leading-none drop-shadow-sm group-hover:scale-110 inline-block transition-transform">😊</span>
              </button>
              <button class="p-2.5 rounded-full hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-all group" @click.stop="toggleLocationInput" title="Add Location">
                <span class="text-2xl leading-none drop-shadow-sm group-hover:scale-110 inline-block transition-transform">📍</span>
              </button>
            </div>
            <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" multiple class="hidden" />

            <!-- Quick Emoji Picker -->
            <div v-if="showEmojiPicker" class="absolute right-0 bottom-full mb-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl p-2 flex gap-1 flex-wrap w-56 z-50 animate-[fadeIn_0.15s_ease-out]" @click.stop>
              <button v-for="emoji in commonEmojis" :key="emoji" @click.stop="insertEmoji(emoji)" class="text-2xl hover:bg-slate-100 dark:hover:bg-slate-700 w-10 h-10 rounded-lg flex items-center justify-center transition-transform hover:scale-110">{{ emoji }}</button>
            </div>

            <!-- Tag Input Popover -->
            <div v-if="showTagInput" class="absolute right-0 bottom-full mb-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl p-3 w-64 z-50 animate-[fadeIn_0.15s_ease-out]" @click.stop>
              <div class="flex gap-2">
                <input id="tag-input" v-model="tagInputText" @keyup.enter="addTag" type="text" placeholder="Enter username..." class="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                <button @click.stop="addTag" class="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 text-sm font-bold transition-colors">Add</button>
              </div>
            </div>

            <!-- Location Input Popover -->
            <div v-if="showLocationInput" class="absolute right-0 bottom-full mb-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl p-3 w-64 z-50 animate-[fadeIn_0.15s_ease-out]" @click.stop>
              <div class="flex gap-2">
                <input id="location-input" v-model="locationInputText" @keyup.enter="addLocation" type="text" placeholder="Where are you?" class="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-slate-50 focus:ring-2 focus:ring-red-500 outline-none" />
                <button @click.stop="addLocation" class="bg-red-500 hover:bg-red-600 text-white rounded-lg px-3 py-2 text-sm font-bold transition-colors">Add</button>
              </div>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="p-4 pt-0">
            <button 
              class="w-full py-3 rounded-xl font-extrabold text-white transition-all duration-300 shadow-md relative overflow-hidden group"
              :class="(!content.trim() && !selectedImageFiles.length) || isSubmitting ? 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5'"
              @click="submitPost" 
              :disabled="(!content.trim() && !selectedImageFiles.length) || isSubmitting"
            >
              <div v-if="!((!content.trim() && !selectedImageFiles.length) || isSubmitting)" class="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span class="relative z-10">{{ isSubmitting ? 'Posting...' : 'Post' }}</span>
            </button>
          </div>
          
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const props = defineProps({
  startOpen: {
    type: Boolean,
    default: false
  },
  hideTrigger: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['post-created', 'closed']);
const authStore = useAuthStore();

const isModalOpen = ref(false);
const content = ref('');
const isSubmitting = ref(false);

const fileInput = ref(null);
const selectedImageFiles = ref([]);
const selectedImagePreviews = ref([]);
const uploadingImage = ref(false);
const uploadProgress = ref(0);
const currentUploadIndex = ref(-1);

onMounted(() => {
  if (props.startOpen) {
    isModalOpen.value = true;
  }
});

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  showEmojiPicker.value = false;
  emit('closed');
};

const showEmojiPicker = ref(false);
const showTagInput = ref(false);
const showLocationInput = ref(false);
const tagInputText = ref('');
const locationInputText = ref('');
const commonEmojis = ['😊', '😂', '😍', '👍', '🔥', '🎉', '🙌', '🤔', '😎', '❤️'];

const insertEmoji = (emoji) => {
  content.value += emoji;
  showEmojiPicker.value = false;
};

const toggleTagInput = () => {
  showTagInput.value = !showTagInput.value;
  showEmojiPicker.value = false;
  showLocationInput.value = false;
  if (showTagInput.value) setTimeout(() => document.getElementById('tag-input')?.focus(), 50);
};

const toggleLocationInput = () => {
  showLocationInput.value = !showLocationInput.value;
  showEmojiPicker.value = false;
  showTagInput.value = false;
  if (showLocationInput.value) setTimeout(() => document.getElementById('location-input')?.focus(), 50);
};

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
  showTagInput.value = false;
  showLocationInput.value = false;
};

const addTag = () => {
  if (tagInputText.value.trim()) {
    content.value += ` @${tagInputText.value.trim()} `;
    tagInputText.value = '';
    showTagInput.value = false;
  }
};

const addLocation = () => {
  if (locationInputText.value.trim()) {
    content.value += `\n📍 at ${locationInputText.value.trim()}`;
    locationInputText.value = '';
    showLocationInput.value = false;
  }
};

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files);
  if (!files.length) return;
  
  files.forEach(file => {
    selectedImageFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      selectedImagePreviews.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  });
};

const removeImage = (index) => {
  selectedImageFiles.value.splice(index, 1);
  selectedImagePreviews.value.splice(index, 1);
  if (fileInput.value) fileInput.value.value = '';
};

const submitPost = async () => {
  if (!content.value.trim() && !selectedImageFiles.value.length) return;
  
  if (!authStore.requireAuth()) {
    return;
  }
  
  isSubmitting.value = true;
  let imageUrl = null;

  try {
    // Upload images if exists
    if (selectedImageFiles.value.length > 0) {
      uploadingImage.value = true;
      currentUploadIndex.value = 0;
      uploadProgress.value = 0;
      const uploadedUrls = [];
      
      for (let i = 0; i < selectedImageFiles.value.length; i++) {
        currentUploadIndex.value = i;
        uploadProgress.value = 0;
        const file = selectedImageFiles.value[i];
        const formData = new FormData();
        formData.append('image', file);
        formData.append('key', '7d2c2ae7d5b133f548c7748f4bd95936'); // ImgBB API Key
        
        const uploadRes = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://api.imgbb.com/1/upload');
          
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              uploadProgress.value = Math.round((event.loaded / event.total) * 100);
            }
          };
          
          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                resolve(JSON.parse(xhr.responseText));
              } catch (e) {
                reject(new Error('Invalid response'));
              }
            } else {
              reject(new Error('Upload failed'));
            }
          };
          
          xhr.onerror = () => reject(new Error('Network error'));
          xhr.send(formData);
        });
        
        if (uploadRes && uploadRes.success) {
          uploadedUrls.push(uploadRes.data.url);
        } else {
          throw new Error('Upload failed');
        }
      }
      imageUrl = uploadedUrls.join(',');
      uploadingImage.value = false;
      uploadProgress.value = 0;
      currentUploadIndex.value = -1;
    }

    const $api = useApi();
    const response = await $api('/posts', {
      method: 'POST',
      headers: {
        'userid': authStore.activeUserId
      },
      body: { 
        content: content.value,
        imageUrl: imageUrl
      }
    });
    
    if (response.success) {
      content.value = '';
      selectedImageFiles.value = [];
      selectedImagePreviews.value = [];
      if (fileInput.value) fileInput.value.value = '';
      closeModal(); // Close the modal securely!
      emit('post-created');
    }
  } catch (error) {
    console.error('Failed to submit post', error);
    alert('Failed to submit post');
  } finally {
    isSubmitting.value = false;
    uploadingImage.value = false;
    uploadProgress.value = 0;
    currentUploadIndex.value = -1;
  }
};
</script>

<style scoped>
@reference "../../assets/css/main.css";

/* Inline Trigger Box */
.trigger-box {
  @apply bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm;
  border-width: 1px;
  border-style: solid;
  border-radius: 1rem;
  padding: 1rem;
  margin-bottom: 2rem;
}

.trigger-top {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.trigger-btn {
  flex: 1;
  text-align: left;
  @apply bg-slate-100 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400;
  border: 1px solid transparent;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px; /* Pill shape */
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.2s;
}

.trigger-btn:hover {
  @apply bg-slate-200 dark:bg-slate-900/80;
}

/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  @apply bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700;
  border-width: 1px;
  border-style: solid;
  width: 100%;
  max-width: 500px;
  border-radius: 1rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  @apply border-b border-slate-200 dark:border-slate-700;
  position: relative;
}

.modal-title {
  width: 100%;
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  @apply text-slate-900 dark:text-slate-50;
  margin: 0;
}

.close-btn {
  position: absolute;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  @apply bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  @apply bg-slate-200 dark:bg-white/20;
}

/* Modal User Info */
.modal-user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.username {
  font-weight: 600;
  @apply text-slate-900 dark:text-slate-50;
  font-size: 0.95rem;
}

.privacy-badge {
  @apply bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300;
  border: none;
  border-radius: 0.25rem;
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  font-weight: 600;
  cursor: pointer;
}

/* Modal Body */
.modal-body {
  padding: 0 1rem;
  max-height: 400px;
  overflow-y: auto;
}

.modal-textarea {
  width: 100%;
  min-height: 120px;
  background: transparent;
  border: none;
  resize: none;
  @apply text-slate-900 dark:text-slate-50;
  font-size: 1.25rem;
  font-family: inherit;
}

.modal-textarea:focus {
  outline: none;
}

/* Modal Add To Post */
.modal-add-to-post {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem;
  padding: 0.5rem 1rem;
  @apply border-slate-200 dark:border-slate-700;
  border-width: 1px;
  border-style: solid;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.add-icons {
  display: flex;
  gap: 0.25rem;
}

/* Modal Footer */
.modal-footer {
  padding: 1rem;
}

.post-btn-full {
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.post-btn-full:hover:not(:disabled) {
  background: #2563eb;
}

.post-btn-full:disabled {
  background: rgba(59, 130, 246, 0.5);
  cursor: not-allowed;
  color: rgba(255, 255, 255, 0.5);
}

/* Image Previews (Inherited exactly) */
.image-previews-container {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-bottom: 1rem;
}

.image-preview {
  position: relative;
  display: inline-block;
  border-radius: 0.5rem;
  overflow: hidden;
  @apply border-slate-200 dark:border-slate-700;
  border-width: 1px;
  border-style: solid;
  max-width: 150px;
}

.image-preview img {
  display: block;
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
}

.remove-btn:hover {
  background: rgba(239, 68, 68, 0.8);
}

.progress-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 10;
  border-radius: 0.5rem;
}

.success-overlay {
  background: rgba(16, 185, 129, 0.6);
}

.success-icon {
  font-size: 2rem;
  color: white;
  font-weight: bold;
}

.progress-bar-container {
  width: 80%;
  height: 6px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #3b82f6;
  border-radius: 3px;
  transition: width 0.1s linear;
}

.progress-text {
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
