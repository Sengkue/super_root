<template>
  <div class="flex flex-col min-h-screen bg-slate-900">
    <AppHeader />

    <main class="flex-1 md:p-8 p-0 w-full max-w-6xl mx-auto">
      <div class="feed-layout animate-[fadeIn_0.4s_ease-out]">
        <!-- Left Sidebar -->
        <aside class="sidebar left-sidebar">
          <nav class="side-nav">
            <NuxtLink to="/feed?tab=all" class="nav-item" :class="{ 'active': $route.path === '/feed' && ($route.query.tab === 'all' || !$route.query.tab) }">
              <span class="icon">📰</span> All
            </NuxtLink>
            <NuxtLink to="/feed?tab=following" class="nav-item" :class="{ 'active': $route.path === '/feed' && $route.query.tab === 'following' }">
              <span class="icon">👥</span> Following
            </NuxtLink>
            <NuxtLink to="/feed?tab=foryou" class="nav-item" :class="{ 'active': $route.path === '/feed' && $route.query.tab === 'foryou' }">
              <span class="icon">✨</span> For You
            </NuxtLink>
            <NuxtLink to="/friends" class="nav-item" :class="{ 'active': $route.path === '/friends' }">
              <span class="icon">👥</span> Friends
            </NuxtLink>
            <NuxtLink to="/saved" class="nav-item" :class="{ 'active': $route.path === '/saved' }">
              <span class="icon">🔖</span> Saved
            </NuxtLink>
            <div class="nav-item">
              <span class="icon">⚙️</span> Settings
            </div>
          </nav>
        </aside>

        <!-- Main Content -->
        <div class="main-content">
          <slot />
        </div>

        <!-- Right Sidebar -->
        <aside class="sidebar right-sidebar">
          <div class="widget">
            <h3>Sponsored</h3>
            <div class="ad-placeholder">Super Root Ad</div>
          </div>
        </aside>
      </div>
    </main>

    <footer class="hidden md:block p-6 text-center text-slate-500 border-t border-slate-800 text-sm mt-8">
      <p>&copy; 2026 Super Root. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
</script>

<style scoped>
.feed-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr) 250px;
  gap: 2rem;
  width: 100%;
}

@media (max-width: 1024px) {
  .feed-layout {
    grid-template-columns: 200px minmax(0, 1fr);
  }
  .right-sidebar {
    display: none;
  }
}

@media (max-width: 768px) {
  .feed-layout {
    grid-template-columns: 1fr;
  }
  .left-sidebar {
    display: none;
  }
}

.sidebar {
  position: sticky;
  top: 100px;
  height: max-content;
}

.side-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--surface-color);
  padding: 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
}

.nav-item:hover, .nav-item.active {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  font-weight: 600;
}

.icon {
  font-size: 1.25rem;
}

.main-content {
  width: 100%;
}

.widget {
  background: var(--surface-color);
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.widget h3 {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.ad-placeholder {
  background: rgba(15, 23, 42, 0.5);
  border: 1px dashed var(--border-color);
  border-radius: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
