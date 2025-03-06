<template>
  <div class="flex items-center gap-4">
    <LanguageSelector class="" />
    <Bouncer :ability="readDashboard">
      <template #can>
        <SearchBox class="" />
        <AdminButton class="" />
      </template>

      <template #cannot>
        <SearchBox class="" />
      </template>
    </Bouncer>
    <AvatarMenu class="" />
  </div>
</template>
