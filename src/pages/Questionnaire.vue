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
          <template v-if="authStore.user">
            <button @click="$router.push('/dashboard')"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <i class="fas fa-th-large mr-1.5"></i> Dashboard
            </button>
          </template>
          <template v-else>
            <button @click="$router.push('/auth/login')"
              class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
              Sign In
            </button>
          </template>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="max-w-2xl mx-auto px-6 py-12">
      <!-- Header -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style="background: linear-gradient(135deg, rgba(225, 29, 72, 0.1), rgba(251, 113, 133, 0.1));">
          <span class="text-3xl">✨</span>
        </div>
        <h1 class="text-3xl font-bold mb-2" style="color: #1F2937;">Find Your Perfect Products</h1>
        <p class="text-gray-500 max-w-lg mx-auto">
          Answer a few questions about your skin and we'll recommend the best products tailored for you.
        </p>
        <div v-if="!authStore.user"
          class="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
          style="background: rgba(245, 158, 11, 0.08); color: #D97706;">
          <i class="fas fa-info-circle"></i>
          <span><strong>Guest mode</strong> — <router-link to="/auth/login" class="underline font-medium">Sign in</router-link> for personalized recommendations based on your purchase history.</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading && questions.length === 0" class="text-center py-20">
        <div class="inline-block w-8 h-8 border-3 border-gluzo-200 border-t-gluzo-600 rounded-full animate-spin"></div>
        <p class="text-gray-400 mt-4 text-sm">Loading questions...</p>
      </div>

      <!-- Questionnaire Form -->
      <form v-else-if="questions.length > 0" @submit.prevent="handleSubmit" class="space-y-8">
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
              <!-- Checkbox/Radio indicator -->
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
        <div class="pt-4">
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
      <div v-else class="text-center py-20">
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
    // Single select: replace
    answers.value[key] = [value];
  } else {
    // Multi select: toggle
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

  // Track active question for focus ring
  activeQuestion.value = questions.value.indexOf(question);
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

onMounted(() => {
  loadQuestions();
});
</script>
