<template>
  <div class="min-h-screen flex">
    <div class="hidden md:flex w-1/2 bg-white items-center justify-center">
      <img
        src="/img/background.jpg"
        alt="Promo"
        class="w-full h-full object-cover rounded-r-3xl"
      />
    </div>

    <div class="flex w-full md:w-1/2 items-center justify-center p-8">
      <div class="w-full max-w-md">
        <slot />
      </div>
    </div>
  </div>
</template>
