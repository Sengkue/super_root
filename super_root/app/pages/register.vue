<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>Create an Account</h2>
      <p class="subtitle">Join Super Root to share and interact</p>
      
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label>Username</label>
          <input 
            type="text" 
            v-model="username" 
            placeholder="johndoe"
            required
          />
        </div>

        <div class="form-group">
          <label>Number</label>
          <input 
            type="tel" 
            v-model="number" 
            placeholder="020xxxxxxxx"
            required
          />
        </div>
        
        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="Create a strong password"
            required
          />
        </div>

        <div class="form-group">
          <label>Repeat Password</label>
          <input 
            type="password" 
            v-model="repeatPassword" 
            placeholder="Repeat your password"
            required
          />
        </div>

        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        <div v-if="successMsg" class="success-msg">{{ successMsg }}</div>

        <button type="submit" class="submit-btn" :disabled="isLoading">
          {{ isLoading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>
      
      <div class="auth-footer">
        <p>Already have an account? <NuxtLink to="/login">Log in</NuxtLink></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  layout: 'blank'
});

const username = ref('');
const number = ref('');
const password = ref('');
const repeatPassword = ref('');
const isLoading = ref(false);
const errorMsg = ref('');
const successMsg = ref('');

const handleRegister = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  
  if (password.value !== repeatPassword.value) {
    errorMsg.value = 'Passwords do not match';
    isLoading.value = false;
    return;
  }
  
  try {
    const $api = useApi();
    const res = await $api('/users', {
      method: 'POST',
      body: {
        username: username.value,
        number: number.value,
        password: password.value
      }
    });
    
    if (res.success) {
      username.value = '';
      number.value = '';
      password.value = '';
      repeatPassword.value = '';
      successMsg.value = 'Account created successfully! Redirecting to login...';
      
      setTimeout(() => {
        navigateTo('/login');
      }, 2000);
    }
  } catch (err) {
    console.error('Registration error', err);
    errorMsg.value = err.response?._data?.message || 'Failed to create account. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.auth-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 3rem;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.5);
}

h2 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-size: 2rem;
  text-align: center;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 500;
}

input {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: rgba(15, 23, 42, 0.6);
  color: white;
  font-size: 1rem;
  transition: all 0.2s ease;
}

input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.error-msg {
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
  background: rgba(239, 68, 68, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.success-msg {
  color: #10b981;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  text-align: center;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.submit-btn {
  width: 100%;
  padding: 0.85rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  margin-top: 0.5rem;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-secondary);
}

.auth-footer a {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.auth-footer a:hover {
  color: #a78bfa;
  text-decoration: underline;
}
</style>
