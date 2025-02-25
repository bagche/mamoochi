<script lang="ts" setup></script>
<template>
  <div>
    <UCard class="min-h-screen">
      <!-- <template #header>
        <div class="flex justify-between pt-5">
          <Breadcrumb />
          <div class="flex gap-4">
            <UButton
              label="افزودن یادداشت"
              size="md"
              color="primary"
              variant="ghost"
              to="/create"
            />
            <UButton
              label="افزودن محصول"
              size="md"
              color="primary"
              variant="ghost"
              to="/create"
            />
          </div>
        </div>
      </template> -->

      <AdminCreatePost />
    </UCard>
  </div>
</template>
