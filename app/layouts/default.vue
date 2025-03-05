<template>
  <div class="flex flex-col justify-start">
    <Header />
    <Websocket />
    <div class="min-h-screen pb-10">
      <slot />
    </div>
    <Footer />
  </div>
</template>
