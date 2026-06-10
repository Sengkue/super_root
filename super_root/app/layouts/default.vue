<template>
  <div class="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
    <AppHeader />

    <main class="flex-1 md:p-8 p-0 pb-20 md:pb-0 w-full max-w-6xl mx-auto">
      <slot />
    </main>

    <footer class="hidden md:block p-6 text-center text-slate-900 dark:text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 text-sm mt-8">
      <p>&copy; 2026 Super Root. All rights reserved.</p>
    </footer>
  </div>
</template>



