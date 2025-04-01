<template>
  <div :class="$colorMode.value === 'dark' ? 'bg-slate-700' : 'bg-white'">
    <Header />
    <div>
      <slot />
    </div>
    <Footer />
  </div>
</template>
