import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import api from '@/plugins/axios';
import { useToast } from 'vue-toastification';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null);
  const loading = ref(false);
  const toast = useToast();
  const verifyEmail = ref('');
  const verificationLabel = ref('');
  const isNewUser = ref(false);
  const error = ref(null);
  const token = ref(localStorage.getItem('authToken'));

  // Initialize auth state from localStorage
  async function init() {
    loading.value = true;
    const storedToken = localStorage.getItem('authToken');

    if (storedToken) {
      token.value = storedToken;
      try {
        await fetchUser();
      } catch (err) {
        clearAuth();
      }
    }

    loading.value = false;
  }

  function clearAuth() {
    user.value = null;
    token.value = null;
    localStorage.removeItem('authToken');
  }

  // Register with email + password
  async function register(userData) {
    loading.value = true;
    try {
      const response = await api.post('/users/create', userData);
      verifyEmail.value = response.data.data.email;
      verificationLabel.value = 'verify_email';
      loading.value = false;
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (err) {
      loading.value = false;
      console.error("Error registering user:", err);
      const errorMessage = err.response?.data?.message || "An unexpected error occurred";
      return { success: false, message: errorMessage };
    }
  }

  // Login with email + password
  async function login(credentials) {
    loading.value = true;
    try {
      await axios.get(`${import.meta.env.VITE_BASE_API}/sanctum/csrf-cookie`);
      const response = await api.post('/users/login', credentials);
      const userData = response.data.data?.user;
      const isVerified = !!(userData?.email_verified_at);

      if (!isVerified) {
        verificationLabel.value = 'verify_email';
        const result = await sendOtp({ email: userData.email, label: 'verify_email' });
        if (!result.success) { toast.error(result.message); }
      } else {
        user.value = userData;
        token.value = response.data.data.token;
        localStorage.setItem('authToken', response.data.data.token);
      }
      loading.value = false;
      return {
        success: response.data.success,
        message: response.data.message,
        isVerified
      };
    } catch (err) {
      loading.value = false;
      console.error("Error logging in:", err);
      const errorMessage = err.response?.data?.message || "An unexpected error occurred";
      return { success: false, message: errorMessage };
    }
  }

  // Logout
  async function logout() {
    loading.value = true;
    try {
      if (token.value) {
        await api.post('/users/logout');
      }
    } catch (err) {
      console.error('Logout error:', err);
      error.value = err.response?.data?.message || 'Logout failed';
    } finally {
      loading.value = false;
      localStorage.removeItem('authToken');
      token.value = null;
      user.value = null;
      return { success: true, message: 'Logged out successfully' };
    }
  }

  // Fetch authenticated user
  async function fetchUser() {
    loading.value = true;
    try {
      const response = await api.get('/users/user');
      user.value = response.data.user;
      return user.value;
    } catch (err) {
      user.value = null;
      error.value = 'User not authenticated';
    } finally {
      loading.value = false;
    }
  }

  // Send OTP to email
  async function sendOtp(body) {
    try {
      loading.value = true;
      const response = await api.post('/users/otp/send', body);
      verifyEmail.value = body.email;
      loading.value = false;
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (err) {
      loading.value = false;
      console.error("Error sending OTP:", err);
      const errorMessage = err.response?.data?.message || "Error sending OTP";
      return { success: false, message: errorMessage };
    }
  }

  // Verify OTP
  async function verifyOtp(body) {
    try {
      loading.value = true;
      const payload = { ...body };
      if (verifyEmail.value && !payload.email) {
        payload.email = verifyEmail.value;
      }
      const response = await api.post('/users/otp/verify', payload);
      if (response.data.success) {
        if (response.data.data.is_new) {
          isNewUser.value = true;
        } else {
          isNewUser.value = false;
          user.value = response.data.data.user;
          token.value = response.data.data.token;
          localStorage.setItem('authToken', response.data.data.token);
        }
      }
      loading.value = false;
      return {
        success: response.data.success,
        message: response.data.message,
        is_new: response.data.data?.is_new || false
      };
    } catch (err) {
      loading.value = false;
      console.error("Error verifying OTP:", err);
      const errorMessage = err.response?.data?.message || "Error verifying OTP";
      return { success: false, message: errorMessage };
    }
  }

  // Complete registration after OTP verification (for new users)
  async function completeRegistration(body) {
    try {
      loading.value = true;
      const payload = { ...body };
      if (verifyEmail.value && !payload.email) {
        payload.email = verifyEmail.value;
      }
      const response = await api.post('/users/otp-register', payload);
      if (response.data.success) {
        user.value = response.data.data.user;
        token.value = response.data.data.token;
        localStorage.setItem('authToken', response.data.data.token);
        isNewUser.value = false;
      }
      loading.value = false;
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (err) {
      loading.value = false;
      console.error("Error completing registration:", err);
      const errorMessage = err.response?.data?.message || "Error completing registration";
      return { success: false, message: errorMessage };
    }
  }

  // Reset password
  async function resetPassword(body) {
    try {
      loading.value = true;
      const response = await api.post('/users/password/reset', body);
      loading.value = false;
      return {
        success: response.data.success,
        message: response.data.message
      };
    } catch (err) {
      loading.value = false;
      console.error("Error resetting password:", err);
      const errorMessage = err.response?.data?.message || "Error resetting password";
      return { success: false, message: errorMessage };
    }
  }

  return {
    user,
    loading,
    error,
    token,
    verifyEmail,
    verificationLabel,
    isNewUser,
    register,
    sendOtp,
    verifyOtp,
    completeRegistration,
    resetPassword,
    login,
    logout,
    fetchUser,
    init,
    clearAuth
  };
});
