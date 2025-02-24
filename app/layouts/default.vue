<script lang="ts" setup></script>
<template>
  <div class="flex flex-col justify-start">
    <Header />
    <div class="min-h-screen">
      <slot />
    </div>
    <Footer />
  </div>
</template>
