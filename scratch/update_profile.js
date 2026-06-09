const fs = require('fs');
const file = 'super_root/app/pages/profile.vue';
let content = fs.readFileSync(file, 'utf8');

// Template Replacements
content = content.replace(/authStore\.activeUser\?/g, 'targetUser?');
content = content.replace(/authStore\.activeUser\./g, 'targetUser.');

// Add v-if='isOwnProfile' to camera icons
content = content.replace(/<div @click="coverImageInput\?\.click\(\)"/g, '<div v-if="isOwnProfile" @click="coverImageInput?.click()"');
content = content.replace(/<div @click="profileImageInput\?\.click\(\)"/g, '<div v-if="isOwnProfile" @click="profileImageInput?.click()"');

// Update empty state
content = content.replace(/v-else-if="!authStore\.activeUserId"/g, 'v-else-if="!targetUserId"');

// Replace Action Buttons block
const buttonsRegex = /<!-- Action Buttons -->[\s\S]*?<\/div>/;
const newButtons = `<!-- Action Buttons -->
          <div class="flex gap-2 mb-4">
            <template v-if="isOwnProfile">
              <button @click="showCreatePost = true" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
                Add Post
              </button>
              <button @click="startEditing" class="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                Edit Profile
              </button>
            </template>
            <template v-else>
              <button @click="toggleFollow" class="flex-1 text-white py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors" :class="isFollowingTarget ? 'bg-slate-600 hover:bg-slate-700' : 'bg-indigo-600 hover:bg-indigo-700'">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7h-2v2h-2v2h2v2h2v-2h2V9h-2V7z"></path></svg>
                {{ isFollowingTarget ? 'Unfollow' : 'Follow' }}
              </button>
            </template>
          </div>`;
content = content.replace(buttonsRegex, newButtons);

// Script Replacements
content = content.replace("import { useAuthStore } from '~/stores/auth';", "import { useAuthStore } from '~/stores/auth';\nimport { useRoute } from 'vue-router';");

const scriptVarsRegex = /const authStore = useAuthStore\(\);\s*const userPosts = ref\(\[\]\);\s*const pending = ref\(false\);\s*const error = ref\(null\);/;
const newScriptVars = `const authStore = useAuthStore();
const route = useRoute();

const targetUserId = computed(() => route.query.id || authStore.activeUserId);
const isOwnProfile = computed(() => targetUserId.value === authStore.activeUserId);
const targetUser = ref(null);
const isFollowingTarget = ref(false);

const userPosts = ref([]);
const pending = ref(false);
const error = ref(null);`;
content = content.replace(scriptVarsRegex, newScriptVars);

const apiFetchRegex = /const res = await \$api\(`\/posts\/user\/\${authStore\.activeUserId}`\);/g;
content = content.replace(apiFetchRegex, "const res = await $api(`/posts/user/${targetUserId.value}`);");

content = content.replace(/if \(!authStore\.activeUserId\) {\s*userPosts\.value = \[\];\s*return;\s*}/g, 'if (!targetUserId.value) {\n    userPosts.value = [];\n    return;\n  }');

const mountedRegex = /onMounted\(\(\) => {\s*fetchUserPosts\(\);\s*}\);/;
const newMounted = `
const fetchTargetUser = async () => {
  if (!targetUserId.value) return;
  try {
    const $api = useApi();
    const res = await $api(\`/users/\${targetUserId.value}?viewerId=\${authStore.activeUserId || ''}\`);
    if (res.success) {
      targetUser.value = res.data;
      isFollowingTarget.value = res.data.isFollowing;
    }
  } catch (err) {
    console.error('Failed to fetch user', err);
  }
};

const toggleFollow = async () => {
  if (!authStore.activeUserId || !targetUserId.value) return;
  try {
    const endpoint = isFollowingTarget.value ? '/follows/unfollow' : '/follows/follow';
    const $api = useApi();
    const res = await $api(endpoint, {
      method: 'POST',
      body: { followerId: authStore.activeUserId, followingId: targetUserId.value }
    });
    if (res.success) {
      isFollowingTarget.value = !isFollowingTarget.value;
      if (isFollowingTarget.value) {
        targetUser.value.followersCount++;
      } else {
        targetUser.value.followersCount--;
      }
    }
  } catch (err) {
    console.error('Failed to toggle follow', err);
  }
};

onMounted(() => {
  fetchTargetUser();
  fetchUserPosts();
});`;
content = content.replace(mountedRegex, newMounted);

const watchRegex = /watch\(\(\) => authStore\.activeUserId, \(\) => {\s*fetchUserPosts\(\);\s*}\);/;
const newWatch = `watch(() => targetUserId.value, () => {
  fetchTargetUser();
  fetchUserPosts();
});
watch(() => authStore.activeUserId, () => {
  fetchTargetUser();
  fetchUserPosts();
});`;
content = content.replace(watchRegex, newWatch);

content = content.replace(/await authStore\.fetchCurrentUser\(\);\s*isEditingProfile\.value = false;/g, 'await authStore.fetchCurrentUser();\n      await fetchTargetUser();\n      isEditingProfile.value = false;');

fs.writeFileSync(file, content);
console.log('Successfully updated profile.vue');
