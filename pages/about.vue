<template>
  <div>
    <UCard class="mb-8">
      <template #header>
        <h1 class="text-2xl font-bold text-purple-900">About Wine Tasting Notes</h1>
      </template>
      
      <div class="prose max-w-none">
        <p class="mb-4">
          Welcome to Wine Tasting Notes, an application designed to help enthusiasts and professionals 
          generate structured wine tasting notes following the prestigious Wine & Spirit Education Trust (WSET) methodology.
        </p>
        
        <h2 class="text-xl font-semibold text-purple-800 mt-6">What is WSET?</h2>
        <p>
          The Wine & Spirit Education Trust (WSET) is globally recognized as one of the leading providers of wine 
          and spirits education. Founded in 1969 in the United Kingdom, WSET offers qualifications to wine 
          professionals and enthusiasts across more than 70 countries.
        </p>
        
        <h2 class="text-xl font-semibold text-purple-800 mt-6">The WSET Systematic Approach to Tasting</h2>
        <p>
          WSET's Systematic Approach to Tasting (SAT) provides a structured method for evaluating wines. 
          This methodical framework helps tasters assess wines objectively and consistently, covering:
        </p>
        
        <h3 class="text-lg font-medium text-purple-700 mt-4">1. Appearance</h3>
        <p>
          Evaluating the visual aspects of the wine including clarity, intensity, color, and other observations 
          like tears/legs or bubbles.
        </p>
        
        <h3 class="text-lg font-medium text-purple-700 mt-4">2. Nose</h3>
        <p>
          Assessing the aromas of the wine including condition, intensity, development, and specific aroma characteristics 
          (fruit, floral, spice, etc.).
        </p>
        
        <h3 class="text-lg font-medium text-purple-700 mt-4">3. Palate</h3>
        <p>
          Analyzing the wine's flavor profile and structure including sweetness, acidity, tannin, alcohol, body, 
          flavor intensity, flavor characteristics, and finish.
        </p>
        
        <h3 class="text-lg font-medium text-purple-700 mt-4">4. Conclusions</h3>
        <p>
          Drawing conclusions about the wine's quality level, quality assessment reasoning, drinking window, 
          and potential aging capability.
        </p>
        
        <h2 class="text-xl font-semibold text-purple-800 mt-6">About This Application</h2>
        <p>
          Our Wine Tasting Notes generator helps you:
        </p>
        <ul class="list-disc pl-5 mt-2">
          <li>Create structured, professional wine tasting notes following WSET's methodology</li>
          <li>Maintain consistency in your tasting practice</li>
          <li>Develop your palate and tasting vocabulary</li>
          <li>Build a personal database of your wine experiences</li>
        </ul>
        
        <p class="mt-4">
          Whether you're studying for WSET qualifications, working in the wine industry, or simply 
          passionate about wine, our application aims to enhance your tasting experience through structure and precision.
        </p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
});
</script>
