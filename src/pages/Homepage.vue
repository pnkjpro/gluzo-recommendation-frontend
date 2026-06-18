<template>
  <div class="min-h-screen bg-white">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button @click="$router.push('/')" class="flex items-center gap-1">
          <span class="text-2xl font-extrabold tracking-tight" style="color: #E11D48;">Glu</span>
          <span class="text-2xl font-extrabold tracking-tight" style="color: #881337;">zo</span>
        </button>
        <div class="flex items-center gap-4">
          <button @click="$router.push('/products')"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all hidden sm:block">
            <i class="fas fa-shopping-bag mr-1.5"></i> Products
          </button>
          <button @click="$router.push('/documentation')"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all hidden sm:block">
            <i class="fas fa-book mr-1.5"></i> Documentation
          </button>
          <button @click="$router.push('/api-doc')"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all hidden sm:block">
            <i class="fas fa-code mr-1.5"></i> API Doc
          </button>
          <button v-if="!authStore.user" @click="$router.push('/auth/login')"
            class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%); box-shadow: 0 4px 14px rgba(225, 29, 72, 0.25);">
            Sign In
          </button>
          <button v-else @click="$router.push('/dashboard')"
            class="px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%); box-shadow: 0 4px 14px rgba(225, 29, 72, 0.25);">
            Dashboard
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section (Compact) -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0"
        style="background: linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 30%, #FECDD3 60%, #FFF1F2 100%);">
      </div>

      <!-- Floating orbs -->
      <div class="absolute top-10 left-[10%] w-72 h-72 rounded-full blur-3xl animate-pulse"
        style="background: radial-gradient(circle, rgba(225, 29, 72, 0.08) 0%, transparent 70%);"></div>
      <div class="absolute bottom-10 right-[15%] w-64 h-64 rounded-full blur-3xl animate-pulse"
        style="background: radial-gradient(circle, rgba(251, 113, 133, 0.1) 0%, transparent 70%); animation-delay: 2s;">
      </div>

      <div class="relative max-w-7xl mx-auto px-6 py-16 lg:py-20 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium"
          style="background: rgba(225, 29, 72, 0.08); color: #E11D48;">
          <i class="fas fa-sparkles text-xs"></i>
          Smart Skin Analysis
        </div>

        <h1 class="text-4xl lg:text-6xl font-extrabold tracking-tight mb-4" style="color: #1F2937;">
          Find Your
          <span style="background: linear-gradient(135deg, #E11D48, #FB7185); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Perfect Skincare
          </span>
        </h1>

        <p class="text-lg text-gray-500 max-w-xl mx-auto mb-6 leading-relaxed">
          Answer a few quick questions and get personalized product recommendations with confidence scores.
        </p>

        <button @click="scrollToQuiz"
          class="px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 50%, #9F1239 100%); box-shadow: 0 8px 30px rgba(225, 29, 72, 0.3);">
          <span class="flex items-center gap-2">
            <i class="fas fa-magic"></i>
            Start Skin Quiz
            <i class="fas fa-arrow-down text-sm transform group-hover:translate-y-0.5 transition-transform duration-200"></i>
          </span>
        </button>
      </div>
    </section>

    <!-- Login Prompt for Guests -->
    <div v-if="!authStore.user" class="bg-gradient-to-r from-amber-50 to-orange-50 border-y border-amber-100">
      <div class="max-w-3xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style="background: rgba(245, 158, 11, 0.12);">
            🔒
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-800">Want more accurate recommendations?</p>
            <p class="text-xs text-gray-500">Sign in to unlock purchase-history-based personalization and higher confidence scores.</p>
          </div>
        </div>
        <button @click="$router.push('/auth/login')"
          class="flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold text-amber-700 border border-amber-200 bg-white hover:bg-amber-50 transition-all duration-200">
          <i class="fas fa-sign-in-alt mr-1.5"></i> Sign In
        </button>
      </div>
    </div>

    <!-- Logged-In User Greeting -->
    <div v-else class="bg-gradient-to-r from-emerald-50 to-teal-50 border-y border-emerald-100">
      <div class="max-w-3xl mx-auto px-6 py-4 flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
          style="background: rgba(16, 185, 129, 0.12);">
          ✅
        </div>
        <div>
          <p class="text-sm font-semibold text-gray-800">
            Welcome, <span class="text-emerald-600">{{ authStore.user.name }}</span>!
          </p>
          <p class="text-xs text-gray-500">Your recommendations will include purchase-history-based personalization for higher accuracy.</p>
        </div>
      </div>
    </div>

    <!-- Questionnaire Section -->
    <section id="skin-quiz" ref="quizSection" class="py-16 bg-gray-50">
      <div class="max-w-2xl mx-auto px-6">
        <!-- Section Header -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style="background: linear-gradient(135deg, rgba(225, 29, 72, 0.1), rgba(251, 113, 133, 0.1));">
            <span class="text-2xl">✨</span>
          </div>
          <h2 class="text-2xl lg:text-3xl font-bold mb-2" style="color: #1F2937;">Your Skin Profile Quiz</h2>
          <p class="text-gray-500 text-sm max-w-lg mx-auto">
            Tell us about your skin and preferences. We'll match you with the best products from our catalog.
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading && questions.length === 0" class="text-center py-16">
          <div class="inline-block w-8 h-8 border-[3px] border-gluzo-200 border-t-gluzo-600 rounded-full animate-spin"></div>
          <p class="text-gray-400 mt-4 text-sm">Loading questions...</p>
        </div>

        <!-- Questionnaire Form -->
        <form v-else-if="questions.length > 0" @submit.prevent="handleSubmit" class="space-y-6">
          <div v-for="(question, idx) in questions" :key="question.key"
            class="bg-white rounded-2xl p-6 border border-gray-100 transition-all duration-300"
            :class="{ 'ring-2 ring-gluzo-200': activeQuestion === idx }">

            <!-- Question Header -->
            <div class="flex items-start gap-3 mb-5">
              <span class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                style="background: linear-gradient(135deg, #E11D48, #FB7185);">
                {{ idx + 1 }}
              </span>
              <div>
                <h3 class="text-base font-semibold text-gray-800">{{ question.label }}</h3>
                <p class="text-xs text-gray-400 mt-0.5">
                  {{ question.type === 'multi_select' ? 'Select all that apply' : 'Select one' }}
                  <span v-if="question.required" class="text-gluzo-500 ml-1">*</span>
                </p>
              </div>
            </div>

            <!-- Options -->
            <div class="grid gap-2" :class="question.options.length > 4 ? 'grid-cols-2' : 'grid-cols-1'">
              <button v-for="option in question.options" :key="option.value"
                type="button"
                @click="toggleOption(question, option.value)"
                class="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left"
                :class="isSelected(question.key, option.value)
                  ? 'border-gluzo-300 bg-gluzo-50 text-gluzo-700'
                  : 'border-gray-150 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'">
                <span class="flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
                  :class="isSelected(question.key, option.value)
                    ? 'border-gluzo-500 bg-gluzo-500'
                    : 'border-gray-300'">
                  <i v-if="isSelected(question.key, option.value)" class="fas fa-check text-white text-[10px]"></i>
                </span>
                {{ option.label }}
              </button>
            </div>
          </div>

          <!-- Submit -->
          <div class="pt-2">
            <button type="submit" :disabled="submitting || !isFormValid"
              class="w-full py-4 rounded-xl text-white font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style="background: linear-gradient(135deg, #E11D48, #BE123C);"
              :class="{ 'hover:shadow-lg hover:shadow-gluzo-200 hover:-translate-y-0.5': !submitting && isFormValid }">
              <span v-if="submitting" class="flex items-center justify-center gap-2">
                <div class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing your skin profile...
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <i class="fas fa-magic"></i> Get My Recommendations
              </span>
            </button>
          </div>
        </form>

        <!-- Error State -->
        <div v-else class="text-center py-16">
          <div class="text-5xl mb-4">😔</div>
          <h3 class="text-xl font-bold mb-2 text-gray-800">Couldn't load questions</h3>
          <p class="text-gray-400 text-sm mb-4">Please try again.</p>
          <button @click="loadQuestions"
            class="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
            style="background: linear-gradient(135deg, #E11D48, #BE123C);">
            Retry
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-14">
          <h2 class="text-3xl lg:text-4xl font-bold mb-4" style="color: #1F2937;">
            Why Choose <span style="color: #E11D48;">Gluzo</span>
          </h2>
          <p class="text-gray-500 text-lg max-w-xl mx-auto">
            We deliver premium skincare with care, science, and transparency.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title"
            class="group p-8 rounded-3xl border border-gray-100 transition-all duration-300 hover:shadow-xl hover:border-gluzo-200 hover:-translate-y-1"
            style="background: linear-gradient(180deg, #FFFFFF 0%, #FFF1F2 100%);">
            <div class="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl transition-transform duration-300 group-hover:scale-110"
              :style="{ background: feature.bg }">
              {{ feature.icon }}
            </div>
            <h3 class="text-xl font-bold mb-3" style="color: #1F2937;">{{ feature.title }}</h3>
            <p class="text-gray-500 leading-relaxed text-sm">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-8 border-t border-gray-100">
      <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-1">
          <span class="text-lg font-extrabold" style="color: #E11D48;">Glu</span>
          <span class="text-lg font-extrabold" style="color: #881337;">zo</span>
        </div>
        <p class="text-sm text-gray-400">© {{ new Date().getFullYear() }} Gluzo. All rights reserved.</p>
      </div>
    </footer>
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

const quizSection = ref(null);
const questions = ref([]);
const answers = ref({});
const loading = ref(false);
const submitting = ref(false);
const activeQuestion = ref(null);

const isFormValid = computed(() => {
  return questions.value
    .filter(q => q.required)
    .every(q => {
      const selected = answers.value[q.key];
      return selected && selected.length > 0;
    });
});

function isSelected(questionKey, value) {
  return (answers.value[questionKey] || []).includes(value);
}

function toggleOption(question, value) {
  const key = question.key;
  if (!answers.value[key]) {
    answers.value[key] = [];
  }

  if (question.type === 'single_select') {
    answers.value[key] = [value];
  } else {
    // Handle "none" specially for allergies
    if (value === 'none') {
      answers.value[key] = ['none'];
      return;
    }

    // Remove "none" if selecting something else
    answers.value[key] = answers.value[key].filter(v => v !== 'none');

    const idx = answers.value[key].indexOf(value);
    if (idx >= 0) {
      answers.value[key].splice(idx, 1);
    } else {
      answers.value[key].push(value);
    }
  }

  activeQuestion.value = questions.value.indexOf(question);
}

function scrollToQuiz() {
  quizSection.value?.scrollIntoView({ behavior: 'smooth' });
}

async function loadQuestions() {
  loading.value = true;
  const result = await recStore.fetchQuestions();
  if (result.success) {
    questions.value = recStore.questions;
  } else {
    toast.error(result.message);
  }
  loading.value = false;
}

async function handleSubmit() {
  if (!isFormValid.value) return;

  submitting.value = true;
  const result = await recStore.submitQuestionnaire(answers.value);

  if (result.success) {
    toast.success('Profile saved! Generating recommendations...');
    router.push('/recommendations');
  } else {
    toast.error(result.message);
  }
  submitting.value = false;
}

const features = [
  {
    icon: '🎯',
    title: 'Smart Matching',
    description: 'Our algorithm analyzes your skin type, concerns, and purchase history to recommend products with confidence scores.',
    bg: 'rgba(225, 29, 72, 0.08)',
  },
  {
    icon: '🧬',
    title: 'Science-Backed',
    description: 'Every product is formulated with clinically proven ingredients that deliver real, visible results.',
    bg: 'rgba(16, 185, 129, 0.08)',
  },
  {
    icon: '🔒',
    title: 'Personalized for You',
    description: 'Sign in to unlock purchase-history-based recommendations — the more you buy, the smarter it gets.',
    bg: 'rgba(251, 113, 133, 0.08)',
  },
];

onMounted(() => {
  loadQuestions();
});
</script>
