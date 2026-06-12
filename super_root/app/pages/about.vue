<template>
  <div class="about-page">
    <h2>About Super Root</h2>
    <div class="content">
      <p>Super Root is designed to be the ultimate starting point for modern web applications utilizing Nuxt 4 structure.</p>
      <p>By opting into the `compatibilityVersion: 4` flag in Nuxt 3, we can start using the new default `app/` directory structure, which cleanly separates application code from configuration and server code.</p>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Super Root | About',
  meta: [
    { name: 'description', content: 'Learn more about the Super Root Nuxt 4 template.' }
  ]
})
</script>

<style scoped>
@reference "../assets/css/main.css";
.about-page {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

h2 {
  font-size: 2.5rem;
  margin-bottom: 2rem;
  @apply text-slate-900 dark:text-white;
}

.content {
  @apply bg-white dark:bg-slate-800;
  padding: 2rem;
  border-radius: 1rem;
  @apply border border-slate-200 dark:border-slate-700;
  line-height: 1.8;
  @apply text-slate-600 dark:text-slate-300;
}

.content p {
  margin-bottom: 1rem;
}

.content p:last-child {
  margin-bottom: 0;
}
</style>
