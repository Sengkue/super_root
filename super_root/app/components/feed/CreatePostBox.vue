<template>
  <div class="create-post-box">
    <div class="input-area">
      <div class="avatar">?</div>
      <textarea 
        v-model="content" 
      ></textarea>
    </div>
    <div class="actions">
      <!-- Hidden file input -->
      <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" multiple style="display: none;" />
      
      <!-- Upload Button -->
      <div class="left-actions">
        <button class="icon-btn" @click="$refs.fileInput.click()" title="Attach Images">
          <span class="icon">📷</span>
        </button>
      </div>

      <button class="post-btn" @click="submitPost" :disabled="(!content.trim() && !selectedImageFiles.length) || isSubmitting">
        {{ isSubmitting ? 'Posting...' : 'Post' }}
      </button>
    </div>
    
    <!-- Image Previews -->
    <div v-if="selectedImagePreviews.length > 0" class="image-previews-container">
      <div v-for="(preview, idx) in selectedImagePreviews" :key="idx" class="image-preview">
        <img :src="preview" />
        <button v-if="!isSubmitting" class="remove-btn" @click="removeImage(idx)">×</button>
        
        <!-- Progress Overlay -->
        <div v-if="uploadingImage && idx === currentUploadIndex" class="progress-overlay">
          <div v-if="uploadProgress === 100" class="spinner"></div>
          <div v-else class="progress-bar-container">
            <div class="progress-bar-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
          <span class="progress-text">{{ uploadProgress === 100 ? 'Processing...' : uploadProgress + '%' }}</span>
        </div>
        
        <!-- Success Overlay -->
        <div v-if="uploadingImage && idx < currentUploadIndex" class="progress-overlay success-overlay">
          <span class="success-icon">✓</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const emit = defineEmits(['post-created']);
const authStore = useAuthStore();

const content = ref('');
const isSubmitting = ref(false);

const fileInput = ref(null);
const selectedImageFiles = ref([]);
const selectedImagePreviews = ref([]);
const uploadingImage = ref(false);
const uploadProgress = ref(0);
const currentUploadIndex = ref(-1);

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
        
        const uploadRes = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/upload');
          
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
          uploadedUrls.push(uploadRes.url);
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
.create-post-box {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.input-area {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar {
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

textarea {
  flex: 1;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.75rem;
  color: var(--text-primary);
  font-family: inherit;
  resize: none;
  transition: border-color 0.2s;
}

textarea:focus {
  outline: none;
  border-color: var(--accent-color);
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.left-actions {
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--border-color);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  font-size: 1.2rem;
}

.icon-btn:hover {
  background: var(--surface-color);
  color: var(--accent-color);
  border-color: var(--accent-color);
}

.image-previews-container {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.image-preview {
  position: relative;
  display: inline-block;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
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

.post-btn {
  background: var(--accent-color);
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.post-btn:hover:not(:disabled) {
  background: var(--accent-hover);
}

.post-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  background: var(--accent-color);
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
</style>
