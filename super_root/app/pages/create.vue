<template>
    <div class="w-full">
      <h1 class="text-2xl font-bold text-slate-50 mb-6 flex items-center gap-2">
        <span>✏️</span> Create Post
      </h1>
      
      <div class="bg-slate-800 rounded-2xl border border-slate-700 p-4">
        <FeedCreatePostBox @post-created="onPostCreated" />
      </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const onPostCreated = () => {
  // Go back to feed after posting
  router.push('/feed');
};

useHead({
  title: 'Super Root | Create Post'
});
</script>
