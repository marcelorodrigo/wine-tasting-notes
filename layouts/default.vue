<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow">
      <nav class="container mx-auto px-4 py-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-xl font-bold text-purple-900">Wine Tasting Notes</NuxtLink>
        <div class="flex space-x-6">
          <NuxtLink to="/" class="text-gray-700 hover:text-purple-700">Home</NuxtLink>
          <NuxtLink to="/about" class="text-gray-700 hover:text-purple-700">About</NuxtLink>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
    <footer class="bg-white mt-auto py-6 shadow-inner">
      <div class="container mx-auto px-4 text-center text-gray-600">
        <p>© {{ new Date().getFullYear() }} - Wine Tasting Notes WSET</p>
      </div>
    </footer>
  </div>
</template>
