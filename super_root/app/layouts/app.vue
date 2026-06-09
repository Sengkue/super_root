<template>
  <div class="mobile-app-layout flex flex-col min-h-screen bg-black text-slate-50">
    <!-- Top Header (TikTok Style) -->
    <header class="sticky top-0 z-40 bg-black/80 backdrop-blur-md border-b border-slate-800">
      <div class="flex justify-between items-center px-4 py-3 relative">
        <div class="w-8"></div> <!-- Spacer for center alignment -->
        
        <nav class="flex gap-4 font-bold text-sm tracking-wide">
          <NuxtLink to="/feed?tab=all" class="text-slate-400 transition-colors" :class="{ 'text-white border-b-2 border-white pb-1': $route.path === '/feed' && ($route.query.tab === 'all' || !$route.query.tab) }">All</NuxtLink>
          <NuxtLink to="/feed?tab=following" class="text-slate-400 transition-colors" :class="{ 'text-white border-b-2 border-white pb-1': $route.path === '/feed' && $route.query.tab === 'following' }">Following</NuxtLink>
          <NuxtLink to="/feed?tab=foryou" class="text-slate-400 transition-colors" :class="{ 'text-white border-b-2 border-white pb-1': $route.path === '/feed' && $route.query.tab === 'foryou' }">For You</NuxtLink>
        </nav>

        <NuxtLink to="/search" class="w-8 h-8 flex items-center justify-center text-slate-100 hover:text-blue-400 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </NuxtLink>
      </div>
    </header>

    <!-- Content -->
    <main class="flex-1 w-full relative pb-20 px-3 sm:px-4 pt-4">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-slate-800 flex justify-between items-center px-6 py-2 pb-safe">
      <NuxtLink to="/feed" class="flex flex-col items-center gap-1 text-slate-500 transition-colors" :class="{ 'text-white': $route.path === '/feed' }">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
        <span class="text-[10px] font-bold">Home</span>
      </NuxtLink>
      
      <NuxtLink to="/friends" class="flex flex-col items-center gap-1 text-slate-500 transition-colors" :class="{ 'text-white': $route.path === '/friends' }">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
        <span class="text-[10px] font-bold">Friends</span>
      </NuxtLink>
      
      <NuxtLink to="/create" class="flex items-center justify-center w-11 h-8 rounded-lg bg-gradient-to-r from-cyan-400 via-white to-pink-500 p-[2px]">
        <div class="bg-white w-full h-full rounded-[6px] flex items-center justify-center text-black">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
        </div>
      </NuxtLink>

      <NuxtLink to="/saved" class="flex flex-col items-center gap-1 text-slate-500 transition-colors" :class="{ 'text-white': $route.path === '/saved' }">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"></path></svg>
        <span class="text-[10px] font-bold">Saved</span>
      </NuxtLink>

      <NuxtLink to="/profile" class="flex flex-col items-center gap-1 text-slate-500 transition-colors" :class="{ 'text-white': $route.path === '/profile' }">
        <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
        <span class="text-[10px] font-bold">Profile</span>
      </NuxtLink>
    </nav>
  </div>
</template>
