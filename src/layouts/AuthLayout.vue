<template>
  <div class="min-h-screen flex">
    <!-- Left side (image / promo) -->
    <div class="hidden md:flex w-1/2 bg-gray-200 items-center justify-center">
      <img
        src="https://source.unsplash.com/random/800x600?city"
        alt="Promo"
        class="w-full h-full object-cover rounded-r-3xl"
      />
    </div>

    <!-- Right side (form slot) -->
    <div class="flex w-full md:w-1/2 items-center justify-center p-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
