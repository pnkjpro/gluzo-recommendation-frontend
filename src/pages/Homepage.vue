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

    <!-- Hero Section -->
    <section class="relative overflow-hidden">
      <div class="absolute inset-0"
        style="background: linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 30%, #FECDD3 60%, #FFF1F2 100%);">
      </div>

      <!-- Floating orbs -->
      <div class="absolute top-20 left-[10%] w-72 h-72 rounded-full blur-3xl animate-pulse"
        style="background: radial-gradient(circle, rgba(225, 29, 72, 0.08) 0%, transparent 70%);"></div>
      <div class="absolute bottom-10 right-[15%] w-96 h-96 rounded-full blur-3xl animate-pulse"
        style="background: radial-gradient(circle, rgba(251, 113, 133, 0.1) 0%, transparent 70%); animation-delay: 2s;">
      </div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl animate-pulse"
        style="background: radial-gradient(circle, rgba(253, 164, 175, 0.08) 0%, transparent 70%); animation-delay: 1s;">
      </div>

      <div class="relative max-w-7xl mx-auto px-6 py-24 lg:py-36 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
          style="background: rgba(225, 29, 72, 0.08); color: #E11D48;">
          <i class="fas fa-sparkles text-xs"></i>
          Premium Skin Care Collection
        </div>

        <h1 class="text-5xl lg:text-7xl font-extrabold tracking-tight mb-6" style="color: #1F2937;">
          Radiant Skin
          <br>
          <span style="background: linear-gradient(135deg, #E11D48, #FB7185); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Starts Here
          </span>
        </h1>

        <p class="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Discover curated skincare products designed to nourish, protect, and transform your skin. 
          Science-backed formulas for every skin type.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button @click="$router.push('/auth/register')"
            class="px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
            style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 50%, #9F1239 100%); box-shadow: 0 8px 30px rgba(225, 29, 72, 0.3);">
            <span class="flex items-center gap-2">
              Shop Now
              <i class="fas fa-arrow-right text-sm transform group-hover:translate-x-1 transition-transform duration-200"></i>
            </span>
          </button>
          <button
            class="px-8 py-4 rounded-2xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2"
            style="border-color: #FECDD3; color: #E11D48; background: white;">
            <span class="flex items-center gap-2">
              <i class="fas fa-play-circle text-sm"></i>
              Watch Demo
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
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

    <!-- CTA Section -->
    <section class="py-20"
      style="background: linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 50%, #FECDD3 100%);">
      <div class="max-w-4xl mx-auto px-6 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold mb-4" style="color: #1F2937;">
          Ready for Your Glow Up?
        </h2>
        <p class="text-gray-500 text-lg mb-8 max-w-xl mx-auto">
          Join thousands of happy customers who trust Gluzo for their skincare journey.
        </p>
        <button @click="$router.push('/auth/register')"
          class="px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 50%, #9F1239 100%); box-shadow: 0 8px 30px rgba(225, 29, 72, 0.3);">
          Get Started — It's Free
        </button>
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
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const features = [
  {
    icon: '🧬',
    title: 'Science-Backed',
    description: 'Every product is formulated with clinically proven ingredients that deliver real, visible results.',
    bg: 'rgba(225, 29, 72, 0.08)',
  },
  {
    icon: '🌿',
    title: 'Clean & Natural',
    description: 'Free from harmful chemicals. We prioritize clean, sustainable ingredients for your skin\'s health.',
    bg: 'rgba(16, 185, 129, 0.08)',
  },
  {
    icon: '🚀',
    title: 'Fast Delivery',
    description: 'Get your skincare essentials delivered right to your doorstep within 24-48 hours.',
    bg: 'rgba(251, 113, 133, 0.08)',
  },
];
</script>
