<template>
  <div class="min-h-screen flex flex-col items-center relative overflow-hidden"
    style="background: linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 40%, #FECDD3 70%, #FFF1F2 100%);">
    <!-- Background floating orbs -->
    <div class="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl animate-pulse"
      style="background-color: rgba(225, 29, 72, 0.08);"></div>
    <div class="absolute bottom-32 right-16 w-24 h-24 rounded-full blur-3xl animate-pulse"
      style="background-color: rgba(251, 113, 133, 0.12); animation-delay: 1.5s;"></div>
    <div class="absolute top-1/2 left-8 w-20 h-20 rounded-full blur-3xl animate-pulse"
      style="background-color: rgba(253, 164, 175, 0.15); animation-delay: 2.5s;"></div>
    <div class="absolute top-1/3 right-12 w-16 h-16 rounded-full blur-2xl animate-pulse"
      style="background-color: rgba(225, 29, 72, 0.06); animation-delay: 0.8s;"></div>

    <!-- Floating skincare icons -->
    <div class="absolute top-16 right-20 opacity-15 animate-bounce"
      style="animation-delay: 3s; animation-duration: 4s;">
      <div class="text-3xl">🌹</div>
    </div>
    <div class="absolute bottom-40 left-12 opacity-15 animate-bounce"
      style="animation-delay: 1s; animation-duration: 5s;">
      <div class="text-2xl">✨</div>
    </div>
    <div class="absolute top-2/3 right-8 opacity-15 animate-bounce"
      style="animation-delay: 2s; animation-duration: 3s;">
      <div class="text-2xl">🧴</div>
    </div>

    <!-- Logo Area -->
    <div class="mt-14 mb-8 z-10">
      <div class="flex items-center justify-center">
        <div class="text-6xl font-extrabold tracking-tight">
          <span style="color: #E11D48;">Glu</span><span style="color: #881337;">zo</span>
        </div>
      </div>
      <div class="text-center mt-3 text-base font-medium tracking-widest uppercase"
        style="color: #9F1239; letter-spacing: 0.15em;">
        Skin Care E-commerce
      </div>
    </div>

    <!-- Login Form Card -->
    <div class="bg-white/85 backdrop-blur-xl rounded-3xl p-8 w-11/12 max-w-md shadow-2xl border border-white/40 z-10"
      style="box-shadow: 0 25px 50px -12px rgba(225, 29, 72, 0.12);">
      <div class="text-center mb-6">
        <h1 class="text-3xl font-bold mb-2" style="color: #1F2937;">Welcome Back!</h1>
        <p class="text-gray-500 text-sm">Sign in to your Gluzo account</p>
      </div>

      <!-- Login Mode Tabs -->
      <div class="flex rounded-xl overflow-hidden mb-6 border-2" style="border-color: #E5E7EB;">
        <button @click="loginMode = 'password'"
          class="flex-1 py-3 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          :style="{
            background: loginMode === 'password' ? 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)' : 'transparent',
            color: loginMode === 'password' ? '#fff' : '#666'
          }">
          <i class="fas fa-lock text-xs"></i> Password
        </button>
        <button @click="loginMode = 'otp'"
          class="flex-1 py-3 text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
          :style="{
            background: loginMode === 'otp' ? 'linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)' : 'transparent',
            color: loginMode === 'otp' ? '#fff' : '#666'
          }">
          <i class="fas fa-key text-xs"></i> Email OTP
        </button>
      </div>

      <!-- Password Login Form -->
      <form v-if="loginMode === 'password'" @submit.prevent="handleLogin" class="space-y-5">
        <div class="relative">
          <input type="text" placeholder="Email Address"
            class="w-full border-2 py-4 px-5 rounded-xl text-gray-700 transition duration-200 focus:outline-none text-sm"
            style="background-color: #FAFAFA; border-color: #E5E7EB;" :style="{
              'border-color': email ? '#E11D48' : '#E5E7EB',
              'box-shadow': email ? '0 0 0 3px rgba(225, 29, 72, 0.08)' : 'none'
            }" v-model="email" />
        </div>

        <div class="relative">
          <input :type="showPassword ? 'text' : 'password'" placeholder="Password"
            class="w-full border-2 py-4 px-5 pr-12 rounded-xl text-gray-700 transition duration-200 focus:outline-none text-sm"
            style="background-color: #FAFAFA; border-color: #E5E7EB;" :style="{
              'border-color': password ? '#E11D48' : '#E5E7EB',
              'box-shadow': password ? '0 0 0 3px rgba(225, 29, 72, 0.08)' : 'none'
            }" v-model="password" />
          <button type="button" @click="showPassword = !showPassword"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 transition duration-200"
            :style="{ color: showPassword ? '#E11D48' : '#9CA3AF' }">
            <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
          </button>
        </div>

        <div class="flex justify-between items-center">
          <label class="flex items-center cursor-pointer group">
            <input type="checkbox" class="w-4 h-4 rounded transition duration-200"
              style="accent-color: #E11D48;" v-model="stayLoggedIn">
            <span class="ml-2 text-sm text-gray-500 group-hover:text-gray-700">Remember me</span>
          </label>
          <button type="button" @click="navigateTo('/auth/password/forgot')"
            class="text-sm font-medium transition duration-200 hover:underline"
            style="color: #E11D48;">
            Forgot Password?
          </button>
        </div>

        <!-- Submit Button -->
        <button type="submit" :class="[
          'w-full text-white py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 transform relative overflow-hidden group',
          'hover:scale-[1.01] active:scale-[0.99]',
          { 'cursor-not-allowed opacity-80': authStore.loading }
        ]" :style="{
          background: authStore.loading ? '#94A3B8' : 'linear-gradient(135deg, #E11D48 0%, #BE123C 50%, #9F1239 100%)',
          boxShadow: authStore.loading ? '0 4px 12px rgba(148, 163, 184, 0.25)' : '0 4px 20px rgba(225, 29, 72, 0.3)',
          border: 'none'
        }" :disabled="authStore.loading">
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300">
          </div>
          <div class="relative flex items-center justify-center">
            <div v-if="authStore.loading" class="flex items-center space-x-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>Signing In...</span>
            </div>
            <div v-else class="flex items-center space-x-2">
              <span>Sign In</span>
              <i class="fas fa-arrow-right text-sm transform group-hover:translate-x-0.5 transition-transform duration-200"></i>
            </div>
          </div>
        </button>
      </form>

      <!-- OTP Login Form -->
      <form v-else @submit.prevent="handleOtpLogin" class="space-y-5">
        <div class="relative">
          <input type="email" placeholder="Email Address"
            class="w-full border-2 py-4 px-5 rounded-xl text-gray-700 transition duration-200 focus:outline-none text-sm"
            style="background-color: #FAFAFA; border-color: #E5E7EB;" :style="{
              'border-color': otpEmail ? '#FB7185' : '#E5E7EB',
              'box-shadow': otpEmail ? '0 0 0 3px rgba(251, 113, 133, 0.1)' : 'none'
            }" v-model="otpEmail" inputmode="email" />
        </div>

        <!-- Send OTP Button -->
        <button type="submit" :class="[
          'w-full text-white py-4 px-6 rounded-xl font-semibold text-base transition-all duration-300 transform relative overflow-hidden group',
          'hover:scale-[1.01] active:scale-[0.99]',
          { 'cursor-not-allowed opacity-80': authStore.loading }
        ]" :style="{
          background: authStore.loading ? '#94A3B8' : 'linear-gradient(135deg, #FB7185 0%, #E11D48 100%)',
          boxShadow: authStore.loading ? '0 4px 12px rgba(148, 163, 184, 0.25)' : '0 4px 20px rgba(251, 113, 133, 0.3)',
          border: 'none'
        }" :disabled="authStore.loading">
          <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300">
          </div>
          <div class="relative flex items-center justify-center">
            <div v-if="authStore.loading" class="flex items-center space-x-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              <span>Sending OTP...</span>
            </div>
            <div v-else class="flex items-center space-x-2">
              <span>Send OTP</span>
              <i class="fas fa-arrow-right text-sm transform group-hover:translate-x-0.5 transition-transform duration-200"></i>
            </div>
          </div>
        </button>
      </form>
    </div>

    <!-- Register Option -->
    <div class="mt-8 mb-12 text-center z-10">
      <span class="text-gray-600">New to Gluzo? </span>
      <button type="button" @click="navigateTo('/auth/register')"
        class="font-semibold transition duration-200 hover:underline" style="color: #E11D48;">
        Create an Account
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const loginMode = ref('password');
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const stayLoggedIn = ref(false);
const otpEmail = ref('');
const router = useRouter();
const toast = useToast();

const authStore = useAuthStore();
const { verificationLabel } = storeToRefs(authStore);

const handleLogin = async () => {
  if (!email.value || !password.value) {
    toast.error('Please enter your email and password');
    return;
  }
  const result = await authStore.login({ login: email.value, password: password.value });
  if (!result.success) {
    toast.error(result.message);
  } else {
    if (result.isVerified) {
      navigateTo('/dashboard');
    } else {
      verificationLabel.value = 'verify_email';
      navigateTo('/auth/otp/verify');
    }
  }
};

const handleOtpLogin = async () => {
  if (!otpEmail.value) {
    toast.error('Please enter your email address');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(otpEmail.value)) {
    toast.error('Please enter a valid email address');
    return;
  }

  verificationLabel.value = 'login_otp';
  const body = { email: otpEmail.value, label: 'login_otp' };

  const result = await authStore.sendOtp(body);
  if (!result.success) {
    toast.error(result.message);
    return;
  }
  toast.success('OTP sent to your email!');
  navigateTo('/auth/otp/verify');
};

const navigateTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0px);
}
</style>
