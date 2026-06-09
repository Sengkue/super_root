<template>
  <div class="post-card">
    <!-- Header -->
    <div class="post-header">
      <div class="avatar">{{ post.user?.username?.charAt(0).toUpperCase() || '?' }}</div>
      <div class="meta">
        <div class="author">{{ post.user?.username || 'Unknown User' }}</div>
        <div class="time">{{ new Date(post.createdAt).toLocaleString() }}</div>
      </div>
      <div class="post-options-wrapper">
        <button @click="showOptionsMenu = !showOptionsMenu" class="icon-btn options-btn" title="Options">⋮</button>
        <div v-if="showOptionsMenu" class="options-menu">
          <button @click="handleToggleSave" class="options-item" :class="{ 'text-emerald-500': isSavedByMe }">
            <span class="icon">🔖</span> {{ isSavedByMe ? 'Unsave Post' : 'Save Post' }}
          </button>
          <template v-if="isMyPost">
            <button @click="handleEdit" class="options-item">
              <span class="icon">✏️</span> Edit Post
            </button>
            <button @click="handleDelete" class="options-item delete-item">
              <span class="icon">🗑️</span> Delete Post
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="post-content">
      <div v-if="isEditing" class="edit-mode">
        <textarea v-model="editContent" class="edit-textarea"></textarea>
        <div class="edit-actions">
          <button @click="saveEdit" class="save-btn" :disabled="isSaving">Save</button>
          <button @click="isEditing = false" class="cancel-btn">Cancel</button>
        </div>
      </div>
      <template v-else>
        <template v-for="(token, index) in contentTokens" :key="index">
          <a v-if="token.type === 'link'" :href="token.href" target="_blank" rel="noopener noreferrer" class="post-link">
            {{ token.value }}
          </a>
          <span v-else>{{ token.value }}</span>
        </template>
      </template>
    </div>

    <!-- Uploaded Images -->
    <div v-if="imageUrls.length > 0" class="post-image-gallery" :class="'grid-' + Math.min(imageUrls.length, 4)">
      <div 
        v-for="(url, idx) in imageUrls.slice(0, 4)" 
        :key="idx" 
        class="image-wrapper"
        @click="openLightbox(idx)"
      >
        <img :src="url" class="post-uploaded-image" alt="Post attachment" />
        <div v-if="idx === 3 && imageUrls.length > 4" class="more-images-overlay">
          +{{ imageUrls.length - 4 }}
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Lightbox -->
    <Teleport to="body">
      <div v-if="isLightboxOpen" class="lightbox-overlay" @click="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">×</button>
        
        <button v-if="activeImageIndex > 0" class="lightbox-nav prev" @click.stop="prevImage">❮</button>
        
        <img :src="imageUrls[activeImageIndex]" class="lightbox-image" @click.stop />
        
        <button v-if="activeImageIndex < imageUrls.length - 1" class="lightbox-nav next" @click.stop="nextImage">❯</button>
        
        <div class="lightbox-counter">
          {{ activeImageIndex + 1 }} / {{ imageUrls.length }}
        </div>
      </div>
    </Teleport>

    <!-- YouTube Embed -->
    <div v-if="youtubeId" class="video-container">
      <iframe 
        width="100%" 
        height="315" 
        :src="`https://www.youtube.com/embed/${youtubeId}`" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>

    <!-- TikTok Embed -->
    <div v-if="tiktokId" class="video-container tiktok-container">
      <iframe 
        width="100%" 
        height="700" 
        :src="`https://www.tiktok.com/embed/v2/${tiktokId}`" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowfullscreen>
      </iframe>
    </div>

    <!-- Facebook Embed (Preview Card) -->
    <a v-if="facebookUrlEncoded" :href="decodeURIComponent(facebookUrlEncoded)" target="_blank" rel="noopener noreferrer" class="facebook-preview-card">
      <div class="fb-preview-overlay">
        <div class="fb-icon">
          <svg viewBox="0 0 36 36" fill="currentColor" height="40" width="40"><path d="M20.181 35.87C29.094 34.791 36 27.202 36 18c0-9.941-8.059-18-18-18S0 8.059 0 18c0 8.442 5.811 15.526 13.652 17.471L14 34h5.5l.681 1.87Z" fill="#1877F2"></path><path d="M13.651 35.471v-11.97H9.936V18h3.715v-2.37c0-6.127 2.772-8.964 8.784-8.964 1.138 0 3.103.223 3.91.446v4.983c-.425-.043-1.166-.065-2.081-.065-2.952 0-4.09 1.155-4.09 4.024V18h5.883l-1.008 5.5h-4.867v12.37a18.183 18.183 0 0 1-6.531-.399Z" fill="#fff"></path></svg>
        </div>
        <div class="fb-preview-content">
          <h4>Watch Reel on Facebook</h4>
          <p>Facebook privacy settings prevent embedding this video. Click here to watch it natively.</p>
        </div>
        <div class="fb-play-btn">▶</div>
      </div>
    </a>

    <!-- Stats -->
    <div class="post-stats" v-if="localLikes.length > 0 || post.comments?.length > 0">
      <span v-if="localLikes.length > 0">{{ localLikes.length }} Likes</span>
      <span v-if="post.comments?.length > 0">{{ post.comments.length }} Comments</span>
    </div>

    <!-- Actions -->
    <div class="post-actions">
      <button class="action-btn" :class="{ 'liked-active': isLikedByMe }" @click="toggleLike">
        <span class="icon">👍</span> {{ isLikedByMe ? 'Liked' : 'Like' }}
      </button>
      <button class="action-btn" @click="showComments = !showComments">
        <span class="icon">💬</span> Comment
      </button>
      <div class="share-wrapper">
        <button class="action-btn" @click="handleShareClick">
          <span class="icon">↗️</span> Share
        </button>
        
        <div class="share-menu" v-if="showShareMenu">
          <a :href="`https://www.facebook.com/sharer/sharer.php?u=${postUrl}`" target="_blank" rel="noopener noreferrer" class="share-item">
            <span class="icon">📘</span> Facebook
          </a>
          <a :href="`https://twitter.com/intent/tweet?url=${postUrl}&text=Check out this post!`" target="_blank" rel="noopener noreferrer" class="share-item">
            <span class="icon">🐦</span> X (Twitter)
          </a>
          <a :href="`https://www.linkedin.com/shareArticle?mini=true&url=${postUrl}`" target="_blank" rel="noopener noreferrer" class="share-item">
            <span class="icon">💼</span> LinkedIn
          </a>
          <a :href="`https://api.whatsapp.com/send?text=${postUrl}`" target="_blank" rel="noopener noreferrer" class="share-item">
            <span class="icon">📱</span> WhatsApp
          </a>
          <button @click="copyLink" class="share-item">
            <span class="icon">🔗</span> Copy Link
          </button>
        </div>
      </div>
    </div>

    <!-- Comments Section -->
    <div class="comments-section" v-if="showComments">
      <!-- Comment Tree -->
      <div class="comments-list" v-if="commentTree.length > 0">
        <div v-for="comment in commentTree" :key="comment.id">
          
          <!-- Parent Comment -->
          <div class="comment">
            <div class="comment-bubble">
              <strong>{{ comment.user?.username || 'User' }}</strong>
              <div class="comment-text">{{ comment.content }}</div>
            </div>
            <div class="comment-actions">
              <span class="reply-btn" @click="replyToId = (replyToId === comment.id ? null : comment.id)">Reply</span>
            </div>
          </div>

          <!-- Replies Toggle Button -->
          <div class="replies-toggle" v-if="comment.replies && comment.replies.length > 0">
            <button class="toggle-btn" @click="toggleReplies(comment.id)">
              <span v-if="expandedCommentIds.includes(comment.id)">— Hide replies</span>
              <span v-else>— View {{ comment.replies.length }} replies</span>
            </button>
          </div>

          <!-- Replies Container -->
          <div class="replies" v-if="comment.replies && comment.replies.length > 0 && expandedCommentIds.includes(comment.id)">
            <div class="comment reply" v-for="reply in comment.replies" :key="reply.id">
              <div class="comment-bubble">
                <strong>{{ reply.user?.username || 'User' }}</strong>
                <div class="comment-text">{{ reply.content }}</div>
              </div>
              <div class="comment-actions">
                <span class="reply-btn" @click="prepareSubReply(comment.id, reply.user?.username)">Reply</span>
              </div>
            </div>
          </div>

          <!-- Reply Input for this specific comment -->
          <div class="add-reply" v-if="replyToId === comment.id">
            <input 
              v-model="replyContent" 
              type="text" 
              placeholder="Write a reply..." 
              @keyup.enter="submitComment(comment.id)"
            />
            <button @click="submitComment(comment.id)" :disabled="!replyContent.trim()">Reply</button>
          </div>

        </div>
      </div>
      
      <!-- Top level comment input -->
      <div class="add-comment" v-if="replyToId === null">
        <input 
          v-model="newComment" 
          type="text" 
          placeholder="Write a comment..." 
          @keyup.enter="submitComment(null)"
        />
        <button @click="submitComment(null)" :disabled="!newComment.trim()">Post</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '~/stores/auth';

const props = defineProps(['post']);
const emit = defineEmits(['refresh']);
const authStore = useAuthStore();

const showComments = ref(false);
const newComment = ref('');
const replyContent = ref('');
const replyToId = ref(null);
const isLiking = ref(false);
const expandedCommentIds = ref([]);
const isEditing = ref(false);
const editContent = ref(props.post.content);
const isSaving = ref(false);
const showOptionsMenu = ref(false);

const isMyPost = computed(() => {
  return authStore.activeUserId && String(props.post.userId) === String(authStore.activeUserId);
});

const deletePost = async () => {
  if (!confirm('Are you sure you want to delete this post?')) return;
  try {
    const $api = useApi();
    await $api(`/posts/${props.post.id}`, {
      method: 'DELETE',
      headers: { 'userid': authStore.activeUserId }
    });
    emit('refresh');
  } catch (error) {
    console.error('Failed to delete post', error);
    alert('Failed to delete post');
  }
};

const handleEdit = () => {
  showOptionsMenu.value = false;
  isEditing.value = !isEditing.value;
};

const handleDelete = () => {
  showOptionsMenu.value = false;
  deletePost();
};

const handleToggleSave = () => {
  showOptionsMenu.value = false;
  toggleSave();
};

const saveEdit = async () => {
  if (!editContent.value.trim()) return;
  isSaving.value = true;
  try {
    const $api = useApi();
    await $api(`/posts/${props.post.id}`, {
      method: 'PUT',
      headers: { 'userid': authStore.activeUserId },
      body: { content: editContent.value }
    });
    isEditing.value = false;
    emit('refresh');
  } catch (error) {
    console.error('Failed to update post', error);
    alert('Failed to update post');
  } finally {
    isSaving.value = false;
  }
};

const toggleReplies = (commentId) => {
  if (expandedCommentIds.value.includes(commentId)) {
    expandedCommentIds.value = expandedCommentIds.value.filter(id => id !== commentId);
  } else {
    expandedCommentIds.value.push(commentId);
  }
};

const prepareSubReply = (parentId, username) => {
  if (!expandedCommentIds.value.includes(parentId)) {
    expandedCommentIds.value.push(parentId);
  }
  
  if (replyToId.value !== parentId) {
    replyContent.value = '';
  }
  replyToId.value = parentId;
  const usernamePrefix = `@${username || 'User'} `;
  if (!replyContent.value.startsWith(usernamePrefix)) {
    replyContent.value = usernamePrefix + replyContent.value;
  }
};

// Local optimistic state for likes and saves
const localLikes = ref([...(props.post.likes || [])]);
const localSaves = ref([...(props.post.saves || [])]);

watch(() => props.post.likes, (newLikes) => {
  localLikes.value = [...(newLikes || [])];
}, { deep: true });

watch(() => props.post.saves, (newSaves) => {
  localSaves.value = [...(newSaves || [])];
}, { deep: true });

const isLikedByMe = computed(() => {
  if (!authStore.activeUserId) return false;
  return localLikes.value.some(like => String(like.userId) === String(authStore.activeUserId));
});

const isSavedByMe = computed(() => {
  if (!authStore.activeUserId) return false;
  return localSaves.value.some(save => String(save.userId) === String(authStore.activeUserId));
});

// Parse content into text and link tokens safely
const contentTokens = computed(() => {
  if (!props.post.content) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const tokens = [];
  let lastIndex = 0;
  
  props.post.content.replace(urlRegex, (match, p1, offset) => {
    if (offset > lastIndex) {
      tokens.push({ type: 'text', value: props.post.content.slice(lastIndex, offset) });
    }
    tokens.push({ type: 'link', value: match, href: match });
    lastIndex = offset + match.length;
    return match;
  });
  
  if (lastIndex < props.post.content.length) {
    tokens.push({ type: 'text', value: props.post.content.slice(lastIndex) });
  }
  
  return tokens;
});

// Extract YouTube ID from content text
const youtubeId = computed(() => {
  if (!props.post.content) return null;
  const regExp = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = props.post.content.match(regExp);
  return match ? match[1] : null;
});

// Extract TikTok ID from content text
const tiktokId = computed(() => {
  if (!props.post.content) return null;
  const regExp = /tiktok\.com\/.*?video\/(\d+)/;
  const match = props.post.content.match(regExp);
  return match ? match[1] : null;
});

const imageUrls = computed(() => {
  if (!props.post.imageUrl) return [];
  return props.post.imageUrl.split(',').filter(url => url.trim());
});

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
  if (activeImageIndex.value < imageUrls.value.length - 1) {
    activeImageIndex.value++;
  }
};

const prevImage = (e) => {
  if (e) e.stopPropagation();
  if (activeImageIndex.value > 0) {
    activeImageIndex.value--;
  }
};

// Extract Facebook URL from content text
const facebookUrlEncoded = computed(() => {
  if (!props.post.content) return null;
  const regExp = /((?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:share\/v\/[a-zA-Z0-9_-]+\/?|reel\/\d+\/?|video\.php\?v=\d+|[^\/\s]+\/videos\/\d+\/?))/;
  const match = props.post.content.match(regExp);
  if (match) {
    let url = match[1];
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }
    return encodeURIComponent(url);
  }
  return null;
});

// Build comment tree (1 level deep) from flat list
const commentTree = computed(() => {
  const allComments = props.post.comments || [];
  const topLevel = allComments
    .filter(c => !c.parentId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  
  return topLevel.map(c => {
    return {
      ...c,
      replies: allComments
        .filter(reply => reply.parentId === c.id)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    };
  });
});

const toggleLike = async () => {
  if (!authStore.requireAuth()) {
    return;
  }
  
  if (isLiking.value) return;
  isLiking.value = true;
  
  // Optimistic UI update
  const currentlyLiked = isLikedByMe.value;
  if (currentlyLiked) {
    localLikes.value = localLikes.value.filter(like => String(like.userId) !== String(authStore.activeUserId));
  } else {
    localLikes.value.push({ userId: authStore.activeUserId });
  }

  try {
    const $api = useApi();
    await $api(`/posts/${props.post.id}/like`, {
      method: 'POST',
      headers: { 'userid': authStore.activeUserId }
    });
    // No refresh needed because we optimistically updated!
  } catch (e) {
    console.error('Like failed', e);
    // Revert optimistic update
    if (currentlyLiked) {
      localLikes.value.push({ userId: authStore.activeUserId });
    } else {
      localLikes.value = localLikes.value.filter(like => String(like.userId) !== String(authStore.activeUserId));
    }
  } finally {
    isLiking.value = false;
  }
};

const isSavingPost = ref(false);

const toggleSave = async () => {
  if (!authStore.requireAuth()) {
    return;
  }
  
  if (isSavingPost.value) return;
  isSavingPost.value = true;
  
  // Optimistic UI update
  const currentlySaved = isSavedByMe.value;
  if (currentlySaved) {
    localSaves.value = localSaves.value.filter(save => String(save.userId) !== String(authStore.activeUserId));
  } else {
    localSaves.value.push({ userId: authStore.activeUserId });
  }

  try {
    const $api = useApi();
    await $api(`/posts/${props.post.id}/save`, {
      method: 'POST',
      headers: { 'userid': authStore.activeUserId }
    });
    emit('refresh'); // Useful to refresh saved page list
  } catch (e) {
    console.error('Save failed', e);
    // Revert optimistic update
    if (currentlySaved) {
      localSaves.value.push({ userId: authStore.activeUserId });
    } else {
      localSaves.value = localSaves.value.filter(save => String(save.userId) !== String(authStore.activeUserId));
    }
  } finally {
    isSavingPost.value = false;
  }
};

const showShareMenu = ref(false);

const postUrl = computed(() => {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  return encodeURIComponent(`${origin}/feed?postId=${props.post.id}`);
});

const handleShareClick = async () => {
  const url = typeof window !== 'undefined' ? window.location.origin + '/feed?postId=' + props.post.id : 'http://localhost:3000';
  
  // Best Practice: Advanced Native OS Sharing (Web Share API)
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Super Root Post',
        text: `Check out this post from ${props.post.user?.username || 'a user'}!`,
        url: url
      });
      return; // Stop here if native share succeeds
    } catch (err) {
      console.log('Native share failed or was cancelled by user', err);
    }
  }
  
  // Fallback to custom menu for unsupported browsers (like desktop Chrome)
  showShareMenu.value = !showShareMenu.value;
};

const copyLink = async () => {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    await navigator.clipboard.writeText(`${origin}/feed?postId=${props.post.id}`);
    alert('Link copied to clipboard!');
    showShareMenu.value = false;
  } catch (err) {
    console.error('Failed to copy', err);
  }
};

const submitComment = async (parentId) => {
  const content = parentId ? replyContent.value : newComment.value;
  if (!content.trim()) return;
  if (!authStore.requireAuth()) {
    return;
  }
  
  try {
    const $api = useApi();
    await $api(`/posts/${props.post.id}/comments`, {
      method: 'POST',
      headers: { 'userid': authStore.activeUserId },
      body: { content, parentId }
    });
    
    if (parentId) {
      replyContent.value = '';
      replyToId.value = null;
    } else {
      newComment.value = '';
    }
    emit('refresh');
  } catch (error) {
    console.error('Failed to post comment', error);
    alert('Error posting comment');
  }
};

const sharePost = () => {
  alert('Link copied to clipboard! (Simulated Share)');
};
</script>

<style scoped>
.post-card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #475569;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.author {
  font-weight: 600;
  color: var(--text-primary);
}

.time {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.post-owner-actions {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}

.icon-btn {
  background: transparent;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  padding: 0.3rem;
  border-radius: 50%;
  transition: background 0.2s;
  opacity: 0.7;
  color: white;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  opacity: 1;
}

.options-btn {
  font-weight: bold;
  font-size: 1.5rem;
  padding: 0 0.5rem;
}

.post-options-wrapper {
  margin-left: auto;
  position: relative;
}

.options-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
  z-index: 50;
  min-width: 160px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.options-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.9rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.options-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.options-item.delete-item:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-textarea {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: white;
  font-family: inherit;
  resize: vertical;
}

.edit-textarea:focus {
  outline: none;
  border-color: #3b82f6;
}

.edit-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.save-btn, .cancel-btn {
  padding: 0.4rem 1rem;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  cursor: pointer;
  border: none;
}

.save-btn {
  background: #3b82f6;
  color: white;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cancel-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.post-content {
  margin-bottom: 1.5rem;
  line-height: 1.6;
  white-space: pre-wrap;
}

.post-link {
  color: #3b82f6;
  text-decoration: none;
}

.post-link:hover {
  text-decoration: underline;
}

.post-image-gallery {
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  display: grid;
  gap: 2px;
  background: var(--border-color);
  border: 1px solid var(--border-color);
}

.post-image-gallery.grid-1 {
  grid-template-columns: 1fr;
}

.post-image-gallery.grid-2 {
  grid-template-columns: 1fr 1fr;
}

.post-image-gallery.grid-3 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 200px 200px;
}
.post-image-gallery.grid-3 .image-wrapper:first-child {
  grid-column: 1 / -1;
}

.post-image-gallery.grid-4 {
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 200px 200px;
}

.post-uploaded-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  max-height: 500px;
}

.image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

.more-images-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.more-images-overlay:hover {
  background: rgba(0, 0, 0, 0.5);
}

/* Lightbox Styles */
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 100000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;
}

.lightbox-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  user-select: none;
}

.lightbox-close {
  position: absolute;
  top: 20px;
  right: 30px;
  background: transparent;
  color: white;
  border: none;
  font-size: 3rem;
  cursor: pointer;
  z-index: 100001;
  transition: color 0.2s;
}

.lightbox-close:hover {
  color: var(--accent-color);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 100001;
}

.lightbox-nav:hover {
  background: rgba(255, 255, 255, 0.3);
}

.lightbox-nav.prev {
  left: 20px;
}

.lightbox-nav.next {
  right: 20px;
}

.lightbox-counter {
  position: absolute;
  bottom: 20px;
  color: white;
  font-size: 1.2rem;
  background: rgba(0, 0, 0, 0.6);
  padding: 5px 15px;
  border-radius: 20px;
  z-index: 100001;
}

.video-container {
  margin-bottom: 1.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background: black;
}

.facebook-preview-card {
  display: block;
  margin-bottom: 1.5rem;
  border-radius: 0.75rem;
  overflow: hidden;
  text-decoration: none;
  background: linear-gradient(135deg, #1877F2 0%, #0e5a9c 100%);
  position: relative;
  height: 200px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.facebook-preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

.fb-preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  gap: 1.5rem;
}

.fb-icon {
  flex-shrink: 0;
  background: white;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.fb-preview-content {
  flex: 1;
  color: white;
}

.fb-preview-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.fb-preview-content p {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.9;
  line-height: 1.4;
}

.fb-play-btn {
  background: rgba(255, 255, 255, 0.2);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  border: 2px solid white;
  padding-left: 5px; /* Visual center for play icon */
  transition: background 0.2s;
}

.facebook-preview-card:hover .fb-play-btn {
  background: rgba(255, 255, 255, 0.4);
}

.post-stats {
  display: flex;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.post-actions {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  border-top: 1px solid var(--border-color);
  padding-top: 0.5rem;
}

.share-wrapper {
  position: relative;
  flex: 1;
  display: flex;
}

.share-wrapper .action-btn {
  width: 100%;
}

.share-menu {
  position: absolute;
  bottom: 100%;
  right: 0;
  background: #1e293b;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  min-width: 150px;
  z-index: 50;
  margin-bottom: 0.5rem;
}

.share-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  text-decoration: none;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.share-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.action-btn.active, .action-btn.liked-active {
  color: var(--accent-color);
  background: rgba(59, 130, 246, 0.1);
  font-weight: 700;
}

.comments-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.comments-list {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.comment-bubble {
  background: rgba(15, 23, 42, 0.4);
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  width: max-content;
  max-width: 100%;
}

.comment-bubble strong {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.comment-text {
  font-size: 0.95rem;
}

.comment-actions {
  padding-left: 1rem;
  font-size: 0.8rem;
}

.reply-btn {
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: 600;
}
.reply-btn:hover {
  text-decoration: underline;
}

.replies {
  margin-left: 2rem;
  border-left: 2px solid var(--border-color);
  padding-left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.replies-toggle {
  margin-left: 2rem;
  margin-top: 0.25rem;
}

.toggle-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.toggle-btn:hover {
  color: var(--accent-color);
  text-decoration: underline;
}

.add-comment, .add-reply {
  display: flex;
  gap: 0.5rem;
}

.add-reply {
  margin-left: 2rem;
  margin-top: 0.5rem;
}

.add-comment input, .add-reply input {
  flex: 1;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 2rem;
  padding: 0.5rem 1rem;
  color: white;
}

.add-comment input:focus, .add-reply input:focus {
  outline: none;
  border-color: var(--accent-color);
}

.add-comment button, .add-reply button {
  background: transparent;
  color: var(--accent-color);
  border: none;
  font-weight: bold;
  cursor: pointer;
}

.add-comment button:disabled, .add-reply button:disabled {
  color: var(--text-secondary);
  cursor: not-allowed;
}
.saved-active {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}
</style>
