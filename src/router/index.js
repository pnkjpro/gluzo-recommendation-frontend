import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore';

import NProgress from 'nprogress'

// Configure NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.08
})

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Homepage.vue'),
  },
  // =============== Authentication Routes ================
  {
    path: '/auth/',
    redirect: '/auth/login',
    children: [
      {
        path: '',
        redirect: '/auth/login'
      },
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/Auth/Login.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/pages/Auth/Register.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'password/forgot',
        name: 'ForgotPassword',
        component: () => import('@/pages/Auth/ForgotPassword.vue'),
      },
      {
        path: 'password/reset',
        name: 'ResetPassword',
        component: () => import('@/pages/Auth/ResetPassword.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'otp/verify',
        name: 'OtpVerify',
        component: () => import('@/pages/Auth/VerifyOtp.vue'),
        meta: { guestOnly: true }
      },
      {
        path: 'complete-registration',
        name: 'CompleteRegistration',
        component: () => import('@/pages/Auth/CompleteRegistration.vue'),
        meta: { guestOnly: true }
      }
    ]
  },
  // =============== Dashboard ================
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  // =============== Recommendation System ================
  {
    path: '/questionnaire',
    name: 'Questionnaire',
    component: () => import('@/pages/Questionnaire.vue'),
  },
  {
    path: '/recommendations',
    name: 'Recommendations',
    component: () => import('@/pages/Recommendations.vue'),
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/pages/Products.vue'),
  },
  // 404 Not Found - must be last route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Start NProgress on route change
router.beforeEach((to, from, next) => {
  NProgress.start()
  next()
})

// Complete NProgress after navigation
router.afterEach(() => {
  setTimeout(() => {
    NProgress.done()
  }, 100)
})

// Authentication guard
router.beforeResolve(async (to, from, next) => {
  const authStore = useAuthStore();

  // Fetch user if not already loaded
  if (!authStore.user) {
    try {
      await authStore.fetchUser();
    } catch {
      console.log('User not authenticated');
    }
  }

  const isAuthenticated = !!authStore.user;

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ path: '/auth/login' });
  } else if (to.meta.guestOnly && isAuthenticated) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router
