<template>
  <div class="hero">
    <h1 class="title">Welcome to Super Root</h1>
    <p class="subtitle">A Nuxt 4 Best Practice Boilerplate</p>
    <div class="cta-container">
      <button class="primary-btn">Get Started</button>
      <button class="secondary-btn">Documentation</button>
    </div>
    
    <div class="features">
      <div class="feature-card">
        <div class="icon">🚀</div>
        <h3>Nuxt 4 Ready</h3>
        <p>Built using the upcoming standard Nuxt 4 directory structure.</p>
      </div>
      <div class="feature-card">
        <div class="icon">✨</div>
        <h3>Premium Design</h3>
        <p>Sleek, modern UI with dark mode by default and glassmorphism.</p>
      </div>
      <div class="feature-card">
        <div class="icon">⚡</div>
        <h3>Fast Performance</h3>
        <p>Optimized for speed and minimal setup out of the box.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: 'Super Root | Home',
  meta: [
    { name: 'description', content: 'Super Root is a premium Nuxt 4 template showcasing best practices.' }
  ]
})
</script>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 0;
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.5rem;
  color: var(--text-secondary);
  max-width: 600px;
  margin-bottom: 2.5rem;
}

.cta-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 4rem;
}

button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.primary-btn {
  background-color: var(--accent-color);
  color: white;
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.39);
}

.primary-btn:hover {
  background-color: var(--accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.secondary-btn {
  background-color: var(--surface-color);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.secondary-btn:hover {
  background-color: #2e3d52;
  transform: translateY(-2px);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
}

.feature-card {
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  text-align: left;
  backdrop-filter: blur(10px);
  transition: transform 0.3s ease, border-color 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: var(--accent-color);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

p {
  color: var(--text-secondary);
  line-height: 1.6;
}
</style>
