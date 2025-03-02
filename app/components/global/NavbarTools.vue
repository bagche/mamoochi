<template>
  <div class="flex items-center gap-4">
    <LanguageSelector class="" />
    <DarkMode class="" />
    <Bouncer :ability="readDashboard">
      <template #can>
        <AdminButton class="" />
        <SearchBox class="" />
      </template>

      <template #cannot>
        <SearchBox class="" />
      </template>
    </Bouncer>
    <UsersAvatarMenu class="" />
  </div>
</template>
