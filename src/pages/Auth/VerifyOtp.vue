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

    <!-- Logo Area -->
    <div class="mt-14 mb-6 z-10">
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

    <!-- OTP Verification Form -->
    <div class="bg-white/85 backdrop-blur-xl rounded-3xl p-8 w-11/12 max-w-md shadow-2xl border border-white/40 z-10"
      style="box-shadow: 0 25px 50px -12px rgba(225, 29, 72, 0.12);">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold mb-2" style="color: #1F2937;">Verify OTP</h1>
        <p class="text-gray-500 text-sm">Please enter the OTP sent to your email. Check your spam folder too.</p>
      </div>

      <form @submit.prevent="verifyOTP" class="space-y-6">
        <div class="mb-6">
          <div class="flex justify-center gap-2">
            <input v-for="(digit, index) in otpDigits" :key="index" v-model="otpDigits[index]" type="text"
              maxlength="1" @input="handleDigitInput(index)" @keydown="handleKeydown($event, index)"
              @paste="handlePaste($event)" ref="otpInputs"
              class="w-12 h-16 text-center text-2xl font-bold border-2 rounded-xl text-gray-700 transition duration-200 focus:outline-none"
              style="background-color: #FAFAFA; border-color: #E5E7EB;" :style="{
                'border-color': otpDigits[index] ? '#E11D48' : '#E5E7EB',
                'box-shadow': otpDigits[index] ? '0 0 0 3px rgba(225, 29, 72, 0.08)' : 'none'
              }" :disabled="authStore.loading" />
          </div>
          <p v-if="error" class="text-red-500 text-sm mt-4 text-center">{{ error }}</p>
        </div>

        <!-- Verify Button -->
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
              <span>Verifying...</span>
            </div>
            <div v-else class="flex items-center space-x-2">
              <span>Verify OTP</span>
              <i class="fas fa-arrow-right text-sm transform group-hover:translate-x-0.5 transition-transform duration-200"></i>
            </div>
          </div>
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-gray-500 text-sm">Didn't receive the code?</p>
        <button @click="resendOTP" :class="['mt-2 font-semibold transition duration-200 hover:underline text-sm',
          { 'opacity-50 cursor-not-allowed': resendLoading || countdown > 0 }]"
          :disabled="resendLoading || countdown > 0" style="color: #E11D48;">
          <div v-if="resendLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            Sending...
          </div>
          <span v-else-if="countdown > 0">Resend in {{ countdown }}s</span>
          <span v-else>Resend OTP</span>
        </button>
      </div>
    </div>

    <!-- Back to Login -->
    <div class="mt-8 mb-12 text-center z-10">
      <button @click="goBack" class="font-semibold transition duration-200 hover:underline" style="color: #E11D48;">
        ← Back to Login
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const { verifyEmail, verificationLabel } = storeToRefs(authStore);

// OTP inputs
const otpLength = 6;
const otpDigits = ref(Array(otpLength).fill(''));
const otpInputs = ref([]);
const resendLoading = ref(false);
const countdown = ref(0);
const error = ref('');
let countdownTimer = null;

// Start countdown timer
const startCountdown = () => {
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value -= 1;
    } else {
      clearInterval(countdownTimer);
    }
  }, 1000);
};

// Handle input for each digit
const handleDigitInput = (index) => {
  error.value = '';
  otpDigits.value[index] = otpDigits.value[index].replace(/[^0-9]/g, '');

  if (otpDigits.value[index] && index < otpLength - 1) {
    nextTick(() => {
      otpInputs.value[index + 1].focus();
    });
  }
};

// Handle keydown events
const handleKeydown = (event, index) => {
  if (event.key === 'Backspace') {
    if (!otpDigits.value[index] && index > 0) {
      otpDigits.value[index - 1] = '';
      nextTick(() => {
        otpInputs.value[index - 1].focus();
      });
    }
  }

  if (event.key === 'ArrowLeft' && index > 0) {
    nextTick(() => {
      otpInputs.value[index - 1].focus();
    });
  }

  if (event.key === 'ArrowRight' && index < otpLength - 1) {
    nextTick(() => {
      otpInputs.value[index + 1].focus();
    });
  }
};

// Handle paste event
const handlePaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text').trim();

  if (/^\d+$/.test(pastedData)) {
    const digits = pastedData.split('').slice(0, otpLength);
    digits.forEach((digit, index) => {
      if (index < otpLength) {
        otpDigits.value[index] = digit;
      }
    });

    const nextEmptyIndex = otpDigits.value.findIndex(digit => !digit);
    if (nextEmptyIndex !== -1) {
      nextTick(() => {
        otpInputs.value[nextEmptyIndex].focus();
      });
    } else {
      nextTick(() => {
        otpInputs.value[otpLength - 1].focus();
      });
    }
  } else {
    toast.error('Please paste a numeric OTP only');
  }
};

// Verify OTP
const verifyOTP = async () => {
  const otp = otpDigits.value.join('');

  if (otp.length !== otpLength) {
    toast.error('Please enter all digits of the OTP');
    return;
  }

  if (!verifyEmail.value) {
    toast.error('Email is missing. Please go back.');
    router.push('/auth/login');
    return;
  }

  const body = { otp, label: verificationLabel.value, email: verifyEmail.value };

  const result = await authStore.verifyOtp(body);
  if (!result.success) {
    toast.error(result.message);
    return;
  }
  if (result.is_new) {
    toast.success('OTP verified! Complete your registration.');
    router.push({ name: 'CompleteRegistration' });
  } else if (verificationLabel.value === 'reset_password') {
    router.push({ name: 'ResetPassword' });
  } else {
    toast.success('Login successful!');
    router.push({ name: 'Home' });
  }
};

// Resend OTP
const resendOTP = async () => {
  if (!verifyEmail.value) {
    toast.error('Email is missing. Please go back.');
    router.push('/auth/login');
    return;
  }
  const body = { label: verificationLabel.value, email: verifyEmail.value };
  const result = await authStore.sendOtp(body);
  if (!result.success) {
    toast.error(result.message);
    return;
  }
  toast.success('OTP resent successfully!');
  startCountdown();
};

// Go back to login
const goBack = () => {
  router.push({ name: 'Login' });
};

// Focus first input on mount
onMounted(() => {
  nextTick(() => {
    if (otpInputs.value[0]) {
      otpInputs.value[0].focus();
    }
    startCountdown();
  });
});

// Clear timer on unmount
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
});
</script>

<style scoped>
button:hover {
  transform: translateY(-1px);
}

button:active {
  transform: translateY(0px);
}
</style>
