<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.push('/')" class="flex items-center gap-1">
          <span class="text-2xl font-extrabold tracking-tight" style="color: #E11D48;">Glu</span>
          <span class="text-2xl font-extrabold tracking-tight" style="color: #881337;">zo</span>
        </button>
        <div class="flex items-center gap-3">
          <button @click="$router.push('/questionnaire')"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <i class="fas fa-magic mr-1.5"></i> Take Quiz
          </button>
          <template v-if="authStore.user">
            <button @click="$router.push('/dashboard')"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              Dashboard
            </button>
          </template>
          <template v-else>
            <button @click="$router.push('/auth/login')"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white"
              style="background: linear-gradient(135deg, #E11D48, #BE123C);">
              Sign In
            </button>
          </template>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-6xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold" style="color: #1F2937;">All Products</h1>
          <p class="text-gray-500 text-sm mt-1">Browse our skincare catalog. Click "Buy" to mock-purchase and improve your recommendations.</p>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="flex flex-wrap gap-2 mb-8">
        <button v-for="cat in categories" :key="cat"
          @click="selectedCategory = cat"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          :class="selectedCategory === cat
            ? 'text-white shadow-sm'
            : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'"
          :style="selectedCategory === cat ? { background: 'linear-gradient(135deg, #E11D48, #BE123C)' } : {}">
          {{ cat === 'all' ? 'All Categories' : cat }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-20">
        <div class="inline-block w-8 h-8 border-3 border-gluzo-200 border-t-gluzo-600 rounded-full animate-spin"></div>
        <p class="text-gray-400 mt-4 text-sm">Loading products...</p>
      </div>

      <!-- Product Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in filteredProducts" :key="product.id"
          class="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <!-- Product Image Placeholder -->
          <div class="h-40 flex items-center justify-center"
            style="background: linear-gradient(135deg, rgba(225, 29, 72, 0.04), rgba(251, 113, 133, 0.06));">
            <span class="text-4xl">{{ categoryEmoji(product.category) }}</span>
          </div>

          <!-- Product Details -->
          <div class="p-5">
            <span class="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide mb-3"
              style="background: rgba(225, 29, 72, 0.06); color: #BE123C;">
              {{ product.category }}
            </span>
            <h3 class="text-base font-bold text-gray-800 mb-1">{{ product.name }}</h3>
            <p class="text-sm text-gray-400 mb-3">{{ product.brand }}</p>
            <p class="text-xs text-gray-400 line-clamp-2 mb-4">{{ product.description }}</p>

            <div class="flex items-center justify-between">
              <span class="text-lg font-bold" style="color: #E11D48;">₹{{ Number(product.price).toLocaleString() }}</span>
              <button
                @click="handlePurchase(product)"
                :disabled="purchasing === product.id"
                class="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50"
                style="background: linear-gradient(135deg, #E11D48, #BE123C);"
                :class="{ 'hover:shadow-md': purchasing !== product.id }">
                <span v-if="purchasing === product.id" class="flex items-center gap-1.5">
                  <div class="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                </span>
                <span v-else>
                  <i class="fas fa-cart-plus mr-1"></i> Buy
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredProducts.length === 0" class="text-center py-16">
        <div class="text-4xl mb-3">📦</div>
        <p class="text-gray-400 text-sm">No products in this category.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import { useRecommendationStore } from '@/stores/recommendationStore';

const router = useRouter();
const toast = useToast();
const authStore = useAuthStore();
const recStore = useRecommendationStore();

const loading = ref(false);
const purchasing = ref(null);
const selectedCategory = ref('all');

const categories = computed(() => {
  const cats = [...new Set(recStore.products.map(p => p.category))].sort();
  return ['all', ...cats];
});

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') return recStore.products;
  return recStore.products.filter(p => p.category === selectedCategory.value);
});

function categoryEmoji(category) {
  const map = {
    'Cleanser': '🧴',
    'Serum': '💧',
    'Moisturizer': '🧊',
    'Sunscreen': '☀️',
    'Toner': '💦',
    'Face Mask': '🎭',
    'Eye Cream': '👁️',
    'Exfoliator': '✨',
    'Lip Care': '💋',
  };
  return map[category] || '🧴';
}

async function handlePurchase(product) {
  if (!authStore.user) {
    toast.info('Please sign in to purchase products');
    router.push('/auth/login');
    return;
  }

  purchasing.value = product.id;
  await recStore.mockPurchase(product.id);
  purchasing.value = null;
}

onMounted(async () => {
  loading.value = true;
  await recStore.fetchProducts();
  loading.value = false;
});
</script>
