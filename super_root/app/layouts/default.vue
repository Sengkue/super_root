<template>
  <div class="flex flex-col min-h-screen bg-slate-900">
    <!-- DESKTOP HEADER -->
    <header class="hidden md:flex justify-between items-center px-8 py-4 bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-20">
      <div class="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Super Root</div>
      <nav class="flex gap-6 items-center">
        <NuxtLink to="/" class="text-slate-400 font-medium hover:text-slate-50 [&.router-link-active]:text-blue-500">Home</NuxtLink>
        <NuxtLink to="/feed" class="text-slate-400 font-medium hover:text-slate-50 [&.router-link-active]:text-blue-500">Feed</NuxtLink>
        <NuxtLink to="/profile" class="text-slate-400 font-medium hover:text-slate-50 [&.router-link-active]:text-blue-500">Profile</NuxtLink>
        
        <div class="flex items-center gap-4 ml-4 pl-4 border-l border-slate-700">
          <template v-if="authStore.isLoggedIn">
            <span class="text-slate-400 text-sm">Hi, {{ authStore.activeUser?.username || 'User' }}</span>
            <button class="bg-transparent border border-slate-700 text-slate-400 px-3 py-1.5 rounded-lg text-sm hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 transition-colors" @click="handleLogout">Logout</button>
          </template>
          <template v-else>
            <NuxtLink to="/login" class="text-slate-400 font-medium hover:text-slate-50">Log In</NuxtLink>
            <NuxtLink to="/register" class="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-colors">Sign Up</NuxtLink>
          </template>
        </div>
      </nav>
    </header>

    <!-- MOBILE HEADER -->
    <header class="md:hidden flex flex-col bg-slate-800 sticky top-0 z-20 border-b border-slate-700">
      <!-- Top Row: Logo -->
      <div class="flex justify-between items-center px-4 py-3">
        <div class="text-2xl font-bold text-blue-500 tracking-tight">superroot</div>
        <div class="flex gap-2">
          <!-- Search Placeholder -->
          <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center cursor-pointer">
            <svg class="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <NuxtLink to="/menu" class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 [&.router-link-active]:text-blue-500 [&.router-link-active]:bg-blue-500/20">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </NuxtLink>
        </div>
      </div>
      <!-- Bottom Row: Navigation Tabs -->
      <nav class="flex justify-between items-center px-2 pb-0">
        <NuxtLink to="/" class="flex-1 py-3 flex justify-center text-slate-400 border-b-2 border-transparent hover:bg-slate-700/50 rounded-lg [&.router-link-active]:text-blue-500 [&.router-link-active]:border-blue-500 [&.router-link-active]:rounded-none transition-colors" exact-active-class="router-link-active">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
        </NuxtLink>
        <NuxtLink to="/feed" class="flex-1 py-3 flex justify-center text-slate-400 border-b-2 border-transparent hover:bg-slate-700/50 rounded-lg [&.router-link-active]:text-blue-500 [&.router-link-active]:border-blue-500 [&.router-link-active]:rounded-none transition-colors">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z"></path><path fill-rule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
        </NuxtLink>
        <NuxtLink to="/profile" class="flex-1 py-3 flex justify-center text-slate-400 border-b-2 border-transparent hover:bg-slate-700/50 rounded-lg [&.router-link-active]:text-blue-500 [&.router-link-active]:border-blue-500 [&.router-link-active]:rounded-none transition-colors">
          <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        </NuxtLink>
      </nav>
    </header>

    <main class="flex-1 md:p-8 p-0 w-full max-w-6xl mx-auto">
      <slot />
    </main>

    <footer class="hidden md:block p-6 text-center text-slate-500 border-t border-slate-800 text-sm mt-8">
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

