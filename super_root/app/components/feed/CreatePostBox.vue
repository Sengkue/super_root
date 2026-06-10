<template>
  <div class="create-post-container">
    <!-- Trigger Box (Inline) -->
    <div class="trigger-box">
      <div class="trigger-top">
        <div class="avatar-circle">
          <img v-if="authStore.activeUserObj?.profile?.profileImage" :src="authStore.activeUserObj.profile.profileImage" class="w-full h-full object-cover rounded-full" />
          <span v-else>{{ authStore.activeUserObj?.username?.charAt(0).toUpperCase() || '?' }}</span>
        </div>
        <button class="trigger-btn" @click="openModal">
          What's on your mind, {{ authStore.activeUserObj?.username || 'User' }}?
        </button>
      </div>
    </div>

    <!-- Create Post Modal -->
    <Teleport to="body">
      <div v-if="isModalOpen" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          
          <div class="modal-header">
            <h2 class="modal-title">Create post</h2>
            <button class="close-btn" @click="closeModal">
              <span class="text-2xl leading-none">&times;</span>
            </button>
          </div>
          
          <div class="modal-user-info">
            <div class="avatar-circle">
              <img v-if="authStore.activeUserObj?.profile?.profileImage" :src="authStore.activeUserObj.profile.profileImage" class="w-full h-full object-cover rounded-full" />
              <span v-else>{{ authStore.activeUserObj?.username?.charAt(0).toUpperCase() || '?' }}</span>
            </div>
            <div class="user-details">
              <span class="username">{{ authStore.activeUserObj?.username || 'User' }}</span>
              <button class="privacy-badge">
                <span class="mr-1">👥</span> Friends <span class="text-[10px] ml-1">▼</span>
              </button>
            </div>
          </div>
          
          <div class="modal-body">
            <textarea 
              v-model="content" 
              :placeholder="`What's on your mind, ${authStore.activeUserObj?.username || 'User'}?`"
              class="modal-textarea"
            ></textarea>
            
            <!-- Image Previews -->
            <div v-if="selectedImagePreviews.length > 0" class="image-previews-container">
              <div v-for="(preview, idx) in selectedImagePreviews" :key="idx" class="image-preview">
                <img :src="preview" />
                <button v-if="!isSubmitting" class="remove-btn" @click="removeImage(idx)">×</button>
                
                <div v-if="uploadingImage && idx === currentUploadIndex" class="progress-overlay">
                  <div v-if="uploadProgress === 100" class="spinner"></div>
                  <div v-else class="progress-bar-container">
                    <div class="progress-bar-fill" :style="{ width: uploadProgress + '%' }"></div>
                  </div>
                  <span class="progress-text">{{ uploadProgress === 100 ? 'Processing...' : uploadProgress + '%' }}</span>
                </div>
                
                <div v-if="uploadingImage && idx < currentUploadIndex" class="progress-overlay success-overlay">
                  <span class="success-icon">✓</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-add-to-post">
            <span class="add-text font-semibold text-slate-700 dark:text-slate-300">Add to your post</span>
            <div class="add-icons">
              <button class="add-icon-btn hover:bg-slate-100 dark:bg-slate-700 p-2 rounded-full transition-colors" @click="$refs.fileInput.click()" title="Attach Images"><span class="text-2xl leading-none text-green-500">📷</span></button>
              <button class="add-icon-btn hover:bg-slate-100 dark:bg-slate-700 p-2 rounded-full transition-colors"><span class="text-2xl leading-none text-blue-500">👤</span></button>
              <button class="add-icon-btn hover:bg-slate-100 dark:bg-slate-700 p-2 rounded-full transition-colors"><span class="text-2xl leading-none text-yellow-500">😊</span></button>
              <button class="add-icon-btn hover:bg-slate-100 dark:bg-slate-700 p-2 rounded-full transition-colors"><span class="text-2xl leading-none text-red-500">📍</span></button>
              <button class="add-icon-btn hover:bg-slate-100 dark:bg-slate-700 p-2 rounded-full transition-colors"><span class="text-2xl leading-none text-slate-600 dark:text-slate-400">⋯</span></button>
            </div>
            <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" multiple style="display: none;" />
          </div>
          
          <div class="modal-footer">
            <button class="post-btn-full" @click="submitPost" :disabled="(!content.trim() && !selectedImageFiles.length) || isSubmitting">
              {{ isSubmitting ? 'Posting...' : 'Post' }}
            </button>
          </div>
          
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const emit = defineEmits(['post-created']);
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

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
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
/* Inline Trigger Box */
.trigger-box {
  background: var(--surface-color, #1e293b);
  border: 1px solid var(--border-color, #334155);
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
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
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid transparent;
  padding: 0.75rem 1.25rem;
  border-radius: 9999px; /* Pill shape */
  color: var(--text-secondary, #94a3b8);
  font-size: 1.05rem;
  cursor: pointer;
  transition: background 0.2s;
}

.trigger-btn:hover {
  background: rgba(15, 23, 42, 0.8);
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
  background: var(--surface-color, #1e293b);
  border: 1px solid var(--border-color, #334155);
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
  border-bottom: 1px solid var(--border-color, #334155);
  position: relative;
}

.modal-title {
  width: 100%;
  text-align: center;
  font-size: 1.25rem;
  font-weight: bold;
  color: #f8fafc;
  margin: 0;
}

.close-btn {
  position: absolute;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
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
  color: #f8fafc;
  font-size: 0.95rem;
}

.privacy-badge {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 0.25rem;
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  color: #cbd5e1;
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
  color: #f8fafc;
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
  border: 1px solid var(--border-color, #334155);
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
  border: 1px solid var(--border-color, #334155);
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
