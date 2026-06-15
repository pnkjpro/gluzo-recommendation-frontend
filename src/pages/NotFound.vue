<template>
  <div class="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
    style="background: linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 40%, #FECDD3 70%, #FFF1F2 100%);">

    <!-- Background floating orbs -->
    <div class="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl animate-pulse"
      style="background-color: rgba(225, 29, 72, 0.08);"></div>
    <div class="absolute bottom-32 right-16 w-24 h-24 rounded-full blur-3xl animate-pulse"
      style="background-color: rgba(251, 113, 133, 0.12); animation-delay: 1.5s;"></div>

    <div class="text-center z-10 px-6">
      <!-- 404 Number -->
      <div class="text-9xl font-extrabold mb-4" style="background: linear-gradient(135deg, #E11D48, #FB7185); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        404
      </div>

      <h1 class="text-3xl font-bold mb-4" style="color: #1F2937;">Page Not Found</h1>
      <p class="text-gray-500 text-lg mb-8 max-w-md mx-auto">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
        <button @click="$router.push('/')"
          class="px-8 py-3.5 rounded-xl text-base font-semibold text-white transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
          style="background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%); box-shadow: 0 4px 14px rgba(225, 29, 72, 0.25);">
          <span class="flex items-center gap-2">
            <i class="fas fa-home text-sm"></i>
            Go Home
          </span>
        </button>
        <button @click="$router.back()"
          class="px-8 py-3.5 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] border-2"
          style="border-color: #FECDD3; color: #E11D48; background: white;">
          <span class="flex items-center gap-2">
            <i class="fas fa-arrow-left text-sm"></i>
            Go Back
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
