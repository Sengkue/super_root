<template>
  <div class="layout">
    <header class="header">
      <div class="logo">Super Root</div>
      <nav class="nav">
        <NuxtLink to="/">Home</NuxtLink>
        <NuxtLink to="/feed">Feed</NuxtLink>
        <NuxtLink to="/profile">Profile</NuxtLink>
        <NuxtLink to="/about">About</NuxtLink>
        
        <div class="auth-nav">
          <template v-if="authStore.isLoggedIn">
            <span class="welcome-text">Hi, {{ authStore.activeUser?.username || 'User' }}</span>
            <button class="logout-btn" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="login-link">Log In</NuxtLink>
            <NuxtLink to="/register" class="register-btn">Sign Up</NuxtLink>
          </template>
        </div>
      </nav>
    </header>
    <main class="main-content">
      <slot />
    </main>
    <footer class="footer">
      <p>&copy; 2026 Super Root. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
  navigateTo('/login');
};
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background-color: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 10;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: var(--text-secondary);
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav a:hover,
.nav a.router-link-active {
  color: var(--text-primary);
}

.auth-nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid var(--border-color);
}

.welcome-text {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.logout-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  padding: 0.4rem 0.8rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.login-link {
  color: var(--text-secondary);
}

.register-btn {
  background: var(--accent-color);
  color: white !important;
  padding: 0.4rem 1rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
}

.register-btn:hover {
  background: var(--accent-hover);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.footer {
  padding: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
  border-top: 1px solid var(--border-color);
  font-size: 0.875rem;
}
</style>
