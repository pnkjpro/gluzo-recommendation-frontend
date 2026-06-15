<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Dashboard Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.push('/')" class="flex items-center gap-1">
          <span class="text-2xl font-extrabold tracking-tight" style="color: #E11D48;">Glu</span>
          <span class="text-2xl font-extrabold tracking-tight" style="color: #881337;">zo</span>
        </button>
        <div class="flex items-center gap-4">
          <div v-if="authStore.user" class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style="background: linear-gradient(135deg, #E11D48, #FB7185);">
              {{ authStore.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <span class="text-sm font-medium text-gray-700 hidden sm:block">{{ authStore.user?.name || 'User' }}</span>
          </div>
          <button @click="handleLogout"
            class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:border-gray-300">
            <i class="fas fa-sign-out-alt mr-1.5"></i> Logout
          </button>
        </div>
      </div>
    </nav>

    <!-- Dashboard Content -->
    <div class="max-w-7xl mx-auto px-6 py-10">
      <!-- Welcome Header -->
      <div class="mb-10">
        <h1 class="text-3xl font-bold mb-2" style="color: #1F2937;">
          Welcome back, <span style="color: #E11D48;">{{ authStore.user?.name || 'User' }}</span> 👋
        </h1>
        <p class="text-gray-500">Here's your Gluzo dashboard overview.</p>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div v-for="stat in stats" :key="stat.label"
          class="bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl" :style="{ background: stat.bg }">
              {{ stat.icon }}
            </div>
            <span class="text-xs font-medium px-2.5 py-1 rounded-full"
              :style="{ background: stat.badgeBg, color: stat.badgeColor }">
              {{ stat.badge }}
            </span>
          </div>
          <h3 class="text-2xl font-bold mb-1" style="color: #1F2937;">{{ stat.value }}</h3>
          <p class="text-sm text-gray-400">{{ stat.label }}</p>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <button @click="$router.push('/questionnaire')"
          class="bg-white rounded-2xl p-6 border border-gray-100 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
            style="background: linear-gradient(135deg, rgba(225, 29, 72, 0.1), rgba(251, 113, 133, 0.1));">
            ✨
          </div>
          <h3 class="text-base font-bold text-gray-800 mb-1 group-hover:text-gluzo-600 transition-colors">Take Skin Quiz</h3>
          <p class="text-sm text-gray-400">Get personalized product recommendations.</p>
        </button>

        <button @click="$router.push('/recommendations')"
          class="bg-white rounded-2xl p-6 border border-gray-100 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
            style="background: rgba(16, 185, 129, 0.08);">
            🎯
          </div>
          <h3 class="text-base font-bold text-gray-800 mb-1 group-hover:text-gluzo-600 transition-colors">View Recommendations</h3>
          <p class="text-sm text-gray-400">See your matched products with scores.</p>
        </button>

        <button @click="$router.push('/products')"
          class="bg-white rounded-2xl p-6 border border-gray-100 text-left transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
            style="background: rgba(59, 130, 246, 0.08);">
            🛍️
          </div>
          <h3 class="text-base font-bold text-gray-800 mb-1 group-hover:text-gluzo-600 transition-colors">Browse Products</h3>
          <p class="text-sm text-gray-400">Explore catalog and mock-purchase products.</p>
        </button>
      </div>

      <!-- User Info Card -->
      <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-10">
        <h2 class="text-xl font-bold mb-6" style="color: #1F2937;">
          <i class="fas fa-user-circle mr-2" style="color: #E11D48;"></i> Profile Information
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Name</label>
              <p class="text-base font-medium text-gray-700 mt-1">{{ authStore.user?.name || '—' }}</p>
            </div>
            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</label>
              <p class="text-base font-medium text-gray-700 mt-1">{{ authStore.user?.email || '—' }}</p>
            </div>
          </div>
          <div class="space-y-4">
            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Email Verified</label>
              <p class="mt-1">
                <span v-if="authStore.user?.email_verified_at"
                  class="inline-flex items-center gap-1.5 text-sm font-medium text-green-600">
                  <i class="fas fa-check-circle"></i> Verified
                </span>
                <span v-else class="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500">
                  <i class="fas fa-exclamation-circle"></i> Pending
                </span>
              </p>
            </div>
            <div>
              <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Member Since</label>
              <p class="text-base font-medium text-gray-700 mt-1">{{ formatDate(authStore.user?.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Purchases -->
      <div class="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
        <h2 class="text-xl font-bold mb-6" style="color: #1F2937;">
          <i class="fas fa-shopping-bag mr-2" style="color: #E11D48;"></i> Recent Mock Purchases
        </h2>

        <div v-if="ordersLoading" class="text-center py-8">
          <div class="inline-block w-6 h-6 border-2 border-gluzo-200 border-t-gluzo-600 rounded-full animate-spin"></div>
        </div>

        <div v-else-if="orders.length === 0"
          class="text-center py-8 border border-dashed border-gray-200 rounded-xl">
          <div class="text-3xl mb-2">📦</div>
          <p class="text-gray-400 text-sm">No purchases yet.</p>
          <button @click="$router.push('/products')"
            class="mt-3 text-sm font-medium text-gluzo-600 hover:text-gluzo-700">
            Browse products →
          </button>
        </div>

        <div v-else class="space-y-3">
          <div v-for="order in orders.slice(0, 5)" :key="order.id"
            class="flex items-center justify-between p-4 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-all">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                style="background: rgba(225, 29, 72, 0.06);">
                🛒
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-800">{{ order.product?.name || 'Product' }}</p>
                <p class="text-xs text-gray-400">{{ order.product?.brand }} · Qty: {{ order.quantity }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-semibold" style="color: #E11D48;">₹{{ Number(order.product?.price || 0).toLocaleString() }}</p>
              <p class="text-xs text-gray-400">{{ formatDate(order.purchased_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRecommendationStore } from '@/stores/recommendationStore';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const recStore = useRecommendationStore();
const router = useRouter();
const toast = useToast();

const orders = ref([]);
const ordersLoading = ref(false);

const stats = computed(() => [
  {
    icon: '🛒',
    value: String(orders.value.length),
    label: 'Mock Purchases',
    badge: 'Active',
    bg: 'rgba(225, 29, 72, 0.08)',
    badgeBg: 'rgba(16, 185, 129, 0.08)',
    badgeColor: '#059669',
  },
  {
    icon: '✨',
    value: String(recStore.recommendations.length),
    label: 'Recommendations',
    badge: recStore.scoringMode === 'authenticated' ? 'Personalized' : 'Take Quiz',
    bg: 'rgba(251, 113, 133, 0.08)',
    badgeBg: 'rgba(225, 29, 72, 0.08)',
    badgeColor: '#E11D48',
  },
  {
    icon: '📦',
    value: String(recStore.products.length),
    label: 'Products Available',
    badge: 'Browse',
    bg: 'rgba(59, 130, 246, 0.08)',
    badgeBg: 'rgba(59, 130, 246, 0.08)',
    badgeColor: '#3B82F6',
  },
  {
    icon: '🎯',
    value: recStore.recommendations.length > 0
      ? `${recStore.recommendations[0]?.confidence_score || 0}%`
      : '—',
    label: 'Top Match Score',
    badge: 'Best Match',
    bg: 'rgba(245, 158, 11, 0.08)',
    badgeBg: 'rgba(245, 158, 11, 0.08)',
    badgeColor: '#F59E0B',
  },
]);

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const handleLogout = async () => {
  const result = await authStore.logout();
  if (result.success) {
    toast.success('Logged out successfully');
    router.push('/');
  }
};

onMounted(async () => {
  // Load order history
  ordersLoading.value = true;
  await recStore.fetchOrders();
  orders.value = recStore.orders;
  ordersLoading.value = false;

  // Try loading products count and recommendations
  if (recStore.products.length === 0) {
    recStore.fetchProducts();
  }
});
</script>
