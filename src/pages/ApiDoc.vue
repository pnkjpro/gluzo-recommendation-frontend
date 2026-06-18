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
          <button @click="$router.push('/documentation')"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <i class="fas fa-book mr-1.5"></i> Documentation
          </button>
          <button @click="$router.push('/products')"
            class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all">
            <i class="fas fa-shopping-bag mr-1.5"></i> Products
          </button>
          <button @click="$router.push('/')"
            class="px-4 py-2 rounded-lg text-sm font-medium text-white"
            style="background: linear-gradient(135deg, #E11D48, #BE123C);">
            <i class="fas fa-home mr-1.5"></i> Home
          </button>
        </div>
      </div>
    </nav>

    <!-- Content -->
    <div class="w-full h-[calc(100vh-73px)]">
      <iframe
        src="/gluzo_api_doc.html"
        class="w-full h-full border-0"
        title="Gluzo API Documentation"
      ></iframe>
    </div>
  </div>
</template>

<script setup>
</script>
