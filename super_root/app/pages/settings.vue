<template>
  <div class="max-w-3xl mx-auto p-4 md:p-6 animate-[fadeIn_0.3s_ease-out]">
    
    <!-- Header -->
    <div class="mb-8 flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
      <button @click="handleBack" class="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
      </button>
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white">
        {{ currentView === 'main' ? $t('settings.title') : viewTitles[currentView] }}
      </h1>
    </div>

    <!-- MAIN VIEW -->
    <div v-if="currentView === 'main'" class="animate-[fadeIn_0.2s_ease-out]">
      <!-- Appearance Settings -->
      <section class="mb-8">
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 px-1">{{ $t('settings.appearance.title') }}</h2>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          
          <div class="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 class="font-bold text-slate-900 dark:text-white text-lg">{{ $t('settings.appearance.themeTitle') }}</h3>
              <p class="text-slate-500 dark:text-slate-400 text-sm">{{ $t('settings.appearance.themeDesc') }}</p>
            </div>
            
            <div class="flex items-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 w-full sm:w-auto">
              <button 
                @click="$colorMode.preference = 'system'" 
                class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="$colorMode.preference === 'system' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                {{ $t('settings.appearance.auto') }}
              </button>
              <button 
                @click="$colorMode.preference = 'light'" 
                class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="$colorMode.preference === 'light' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                {{ $t('settings.appearance.light') }}
              </button>
              <button 
                @click="$colorMode.preference = 'dark'" 
                class="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                :class="$colorMode.preference === 'dark' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                {{ $t('settings.appearance.dark') }}
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- Account Settings -->
      <section class="mb-8">
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 px-1">{{ $t('settings.account.title') }}</h2>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          
          <div @click="currentView = 'security'" class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <div>
                <div class="font-bold text-slate-900 dark:text-slate-100">{{ $t('settings.account.passwordTitle') }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ $t('settings.account.passwordDesc') }}</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>

          <div @click="currentView = 'notifications'" class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              </div>
              <div>
                <div class="font-bold text-slate-900 dark:text-slate-100">{{ $t('settings.account.notificationsTitle') }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ $t('settings.account.notificationsDesc') }}</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>

          <div @click="currentView = 'privacy'" class="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path></svg>
              </div>
              <div>
                <div class="font-bold text-slate-900 dark:text-slate-100">{{ $t('settings.account.privacyTitle') }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ $t('settings.account.privacyDesc') }}</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>

        </div>
      </section>

      <!-- Preferences -->
      <section class="mb-10">
        <h2 class="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4 px-1">{{ $t('settings.preferences.title') }}</h2>
        <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          
          <div @click="currentView = 'language'" class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
              </div>
              <div>
                <div class="font-bold text-slate-900 dark:text-slate-100">{{ $t('settings.preferences.languageTitle') }}</div>
                <div class="text-sm text-slate-500 dark:text-slate-400">{{ languageNames[profileForm.language] || 'English' }}</div>
              </div>
            </div>
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </div>

        </div>
      </section>
    </div>

    <!-- SECURITY VIEW -->
    <div v-else-if="currentView === 'security'" class="animate-[fadeIn_0.2s_ease-out]">
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
        <form @submit.prevent="updatePassword">
          <div class="mb-4">
            <label class="block text-slate-700 dark:text-slate-300 font-bold mb-2">{{ $t('settings.security.currentPassword') }}</label>
            <input v-model="pwdForm.currentPassword" type="password" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
          <div class="mb-4">
            <label class="block text-slate-700 dark:text-slate-300 font-bold mb-2">{{ $t('settings.security.newPassword') }}</label>
            <input v-model="pwdForm.newPassword" type="password" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
          <div class="mb-6">
            <label class="block text-slate-700 dark:text-slate-300 font-bold mb-2">{{ $t('settings.security.confirmPassword') }}</label>
            <input v-model="pwdForm.confirmPassword" type="password" required class="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500">
          </div>
          <div v-if="pwdMsg" :class="pwdSuccess ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'" class="p-3 rounded-lg mb-4 text-sm">{{ pwdMsg }}</div>
          <button type="submit" :disabled="pwdLoading" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            {{ pwdLoading ? $t('settings.security.savingBtn') : $t('settings.security.updateBtn') }}
          </button>
        </form>
      </div>
    </div>

    <!-- NOTIFICATIONS VIEW -->
    <div v-else-if="currentView === 'notifications'" class="animate-[fadeIn_0.2s_ease-out]">
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div>
            <div class="font-bold text-slate-900 dark:text-slate-100">{{ $t('settings.notifications.emailTitle') }}</div>
            <div class="text-sm text-slate-500 dark:text-slate-400">{{ $t('settings.notifications.emailDesc') }}</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="profileForm.emailNotifications" @change="saveProfile" class="sr-only peer">
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
        <div class="p-4 flex items-center justify-between">
          <div>
            <div class="font-bold text-slate-900 dark:text-slate-100">{{ $t('settings.notifications.pushTitle') }}</div>
            <div class="text-sm text-slate-500 dark:text-slate-400">{{ $t('settings.notifications.pushDesc') }}</div>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="profileForm.pushNotifications" @change="saveProfile" class="sr-only peer">
            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <div v-if="saveMsg" class="mt-4 text-green-500 text-sm text-center">{{ saveMsg }}</div>
    </div>

    <!-- PRIVACY VIEW -->
    <div v-else-if="currentView === 'privacy'" class="animate-[fadeIn_0.2s_ease-out]">
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-4 flex items-center justify-between">
        <div>
          <div class="font-bold text-slate-900 dark:text-slate-100">{{ $t('settings.privacy.privateAccount') }}</div>
          <div class="text-sm text-slate-500 dark:text-slate-400">{{ $t('settings.privacy.privateDesc') }}</div>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" v-model="profileForm.isPrivate" @change="saveProfile" class="sr-only peer">
          <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>
      <div v-if="saveMsg" class="mt-4 text-green-500 text-sm text-center">{{ saveMsg }}</div>
    </div>

    <!-- LANGUAGE VIEW -->
    <div v-else-if="currentView === 'language'" class="animate-[fadeIn_0.2s_ease-out]">
      <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div v-for="(name, code) in languageNames" :key="code" @click="setLanguage(code)" class="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors">
          <div class="font-bold text-slate-900 dark:text-slate-100">{{ name }}</div>
          <div v-if="profileForm.language === code" class="text-blue-600 dark:text-blue-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </div>
        </div>
      </div>
      <div v-if="saveMsg" class="mt-4 text-green-500 text-sm text-center">{{ saveMsg }}</div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import { useHead, useApi, useNuxtApp, useI18n } from '#imports';

const { t, setLocale } = useI18n();

useHead({
  title: 'Settings | Super Root'
});

const router = useRouter();
const authStore = useAuthStore();
const $api = useApi();

const currentView = ref('main');

const viewTitles = computed(() => ({
  security: t('settings.account.passwordTitle'),
  notifications: t('settings.account.notificationsTitle'),
  privacy: t('settings.account.privacyTitle'),
  language: t('settings.preferences.languageTitle')
}));

const languageNames = {
  'en': 'English',
  'lo': 'ລາວ',
  'hmn': 'Hmong'
};

const handleBack = () => {
  if (currentView.value !== 'main') {
    currentView.value = 'main';
    pwdMsg.value = '';
    saveMsg.value = '';
  } else {
    router.back();
  }
};

const profileForm = ref({
  language: 'en',
  emailNotifications: true,
  pushNotifications: true,
  isPrivate: false
});

onMounted(() => {
  if (authStore.activeUserObj?.profile) {
    const p = authStore.activeUserObj.profile;
    profileForm.value.language = p.language || 'en';
    // Sync Nuxt i18n locale
    setLocale(profileForm.value.language);
    // Handle booleans safely since they might be undefined
    profileForm.value.emailNotifications = p.emailNotifications !== false;
    profileForm.value.pushNotifications = p.pushNotifications !== false;
    profileForm.value.isPrivate = !!p.isPrivate;
  }
});

const saveMsg = ref('');

const saveProfile = async () => {
  saveMsg.value = '';
  try {
    const res = await $api(`/users/${authStore.activeUserId}/profile`, {
      method: 'PUT',
      body: profileForm.value
    });
    if (res.success) {
      // Update local store
      authStore.setAuth(authStore.activeUserId, res.data);
      saveMsg.value = t('settings.messages.saved');
      setTimeout(() => { saveMsg.value = ''; }, 3000);
    }
  } catch (error) {
    console.error('Failed to save profile settings:', error);
  }
};

const setLanguage = (code) => {
  profileForm.value.language = code;
  setLocale(code);
  saveProfile();
};

// Password Logic
const pwdForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const pwdLoading = ref(false);
const pwdMsg = ref('');
const pwdSuccess = ref(false);

const updatePassword = async () => {
  pwdMsg.value = '';
  pwdSuccess.value = false;

  if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    pwdMsg.value = t('settings.security.mismatchMsg');
    return;
  }

  pwdLoading.value = true;
  try {
    const res = await $api(`/users/${authStore.activeUserId}/password`, {
      method: 'PUT',
      body: {
        currentPassword: pwdForm.value.currentPassword,
        newPassword: pwdForm.value.newPassword
      }
    });

    if (res.success) {
      pwdSuccess.value = true;
      pwdMsg.value = t('settings.security.successMsg');
      pwdForm.value.currentPassword = '';
      pwdForm.value.newPassword = '';
      pwdForm.value.confirmPassword = '';
      setTimeout(() => { pwdMsg.value = ''; }, 3000);
    }
  } catch (error) {
    pwdMsg.value = error.response?._data?.message || 'Failed to update password';
  } finally {
    pwdLoading.value = false;
  }
};
</script>
