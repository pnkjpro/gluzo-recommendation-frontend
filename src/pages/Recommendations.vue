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
            <i class="fas fa-redo mr-1.5"></i> Retake Quiz
          </button>
          <button @click="$router.push('/products')"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <i class="fas fa-shopping-bag mr-1.5"></i> Products
          </button>
          <template v-if="authStore.user">
            <button @click="$router.push('/dashboard')"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              Dashboard
            </button>
          </template>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-4xl mx-auto px-6 py-10">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2" style="color: #1F2937;">
          Your Recommendations
          <span v-if="recStore.isPersonalized" class="text-lg font-normal text-gluzo-500 ml-2">✨ Personalized</span>
        </h1>
        <div class="flex items-center gap-4">
          <p class="text-gray-500 text-sm">
            Top {{ recStore.recommendations.length }} products matched to your skin profile.
          </p>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
            :style="scoringBadgeStyle">
            <i :class="recStore.scoringMode === 'authenticated' ? 'fas fa-lock' : 'fas fa-globe'"></i>
            {{ recStore.scoringMode === 'authenticated' ? 'Personalized' : 'Guest Mode' }}
          </span>
        </div>
        <p v-if="recStore.scoringMode === 'guest'" class="text-xs text-amber-600 mt-2">
          <i class="fas fa-info-circle mr-1"></i>
          <router-link to="/auth/login" class="underline font-medium">Sign in</router-link> to unlock purchase-history-based recommendations for higher accuracy.
        </p>
      </div>

      <!-- Loading -->
      <div v-if="recStore.loading && recStore.recommendations.length === 0" class="text-center py-20">
        <div class="inline-block w-10 h-10 border-4 border-gluzo-200 border-t-gluzo-600 rounded-full animate-spin"></div>
        <p class="text-gray-400 mt-4 text-sm">Analyzing your skin profile...</p>
      </div>

      <!-- No Recommendations -->
      <div v-else-if="!recStore.loading && recStore.recommendations.length === 0 && hasLoaded" class="text-center py-20">
        <div class="text-5xl mb-4">🤔</div>
        <h3 class="text-xl font-bold mb-2 text-gray-800">No recommendations yet</h3>
        <p class="text-gray-400 text-sm mb-6">Complete the questionnaire first to get personalized recommendations.</p>
        <button @click="$router.push('/questionnaire')"
          class="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg"
          style="background: linear-gradient(135deg, #E11D48, #BE123C);">
          <i class="fas fa-magic mr-2"></i> Take the Quiz
        </button>
      </div>

      <!-- Recommendation Cards -->
      <div v-else class="space-y-4">
        <div v-for="(rec, idx) in recStore.recommendations" :key="rec.product.id"
          class="bg-white rounded-2xl border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
          <div class="flex items-start gap-5">
            <!-- Rank Badge -->
            <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
              :style="rankStyle(idx)">
              #{{ idx + 1 }}
            </div>

            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h3 class="text-lg font-bold text-gray-800">{{ rec.product.name }}</h3>
                  <p class="text-sm text-gray-400 mt-0.5">
                    {{ rec.product.brand }} · {{ rec.product.category }}
                  </p>
                </div>

                <!-- Confidence Score -->
                <div class="flex-shrink-0 text-center">
                  <div class="relative w-16 h-16">
                    <svg class="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="#F3F4F6" stroke-width="4" />
                      <circle cx="32" cy="32" r="28" fill="none"
                        :stroke="scoreColor(rec.confidence_score)"
                        stroke-width="4"
                        stroke-linecap="round"
                        :stroke-dasharray="`${(rec.confidence_score / 100) * 175.9} 175.9`" />
                    </svg>
                    <span class="absolute inset-0 flex items-center justify-center text-sm font-bold"
                      :style="{ color: scoreColor(rec.confidence_score) }">
                      {{ rec.confidence_score }}
                    </span>
                  </div>
                  <p class="text-[10px] text-gray-400 mt-0.5 font-medium">MATCH</p>
                </div>
              </div>

              <!-- Price -->
              <p class="text-base font-semibold mt-2" style="color: #E11D48;">
                ₹{{ rec.product.price.toLocaleString() }}
              </p>

              <!-- Reasons -->
              <div v-if="rec.reasons.length > 0" class="mt-3 flex flex-wrap gap-2">
                <span v-for="reason in rec.reasons" :key="reason"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style="background: rgba(225, 29, 72, 0.06); color: #BE123C;">
                  <i class="fas fa-check text-[10px]"></i>
                  {{ reason }}
                </span>
              </div>
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

const authStore = useAuthStore();
const recStore = useRecommendationStore();
const hasLoaded = ref(false);

const scoringBadgeStyle = computed(() => {
  if (recStore.scoringMode === 'authenticated') {
    return { background: 'rgba(16, 185, 129, 0.08)', color: '#059669' };
  }
  return { background: 'rgba(245, 158, 11, 0.08)', color: '#D97706' };
});

function rankStyle(idx) {
  const styles = [
    { background: 'linear-gradient(135deg, rgba(225, 29, 72, 0.12), rgba(251, 113, 133, 0.12))', color: '#E11D48' },
    { background: 'rgba(251, 113, 133, 0.08)', color: '#FB7185' },
    { background: 'rgba(251, 146, 60, 0.08)', color: '#F97316' },
  ];
  return idx < 3 ? styles[idx] : { background: 'rgba(156, 163, 175, 0.08)', color: '#9CA3AF' };
}

function scoreColor(score) {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#F59E0B';
  if (score >= 40) return '#F97316';
  return '#EF4444';
}

onMounted(async () => {
  // Ensure auth state is hydrated so the backend returns 'authenticated' scoring mode
  if (authStore.token && !authStore.user) {
    await authStore.fetchUser();
  }
  await recStore.fetchRecommendations();
  hasLoaded.value = true;
});
</script>
