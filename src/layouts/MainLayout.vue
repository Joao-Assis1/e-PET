<template>
  <v-app class="app-wrapper">
    <!-- Modern HIS Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      elevation="0"
      width="280"
      color="primary"
      class="his-sidebar"
    >
      <div class="sidebar-header d-flex align-center pa-4" :class="{ 'justify-center': rail }">
        <v-icon icon="mdi-account-heart" color="white" :size="rail ? 32 : 40" class="mr-2"></v-icon>
        <span v-if="!rail" class="text-h5 font-weight-black text-white">e-PET</span>
      </div>

      <v-divider class="opacity-20 mx-4"></v-divider>

      <v-list density="comfortable" nav class="mt-4 px-2">
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          :to="item.to"
          :value="item.value"
          active-class="active-menu-item"
          class="menu-item mb-2"
          rounded="lg"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" size="22" class="mr-2"></v-icon>
          </template>
          <v-list-item-title class="font-weight-bold text-uppercase letter-spacing-1" v-if="!rail">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <div class="pa-4">
          <v-btn
            variant="text"
            block
            class="justify-start text-white opacity-70 hover-opacity-100"
            @click="rail = !rail"
          >
            <v-icon :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" size="24"></v-icon>
            <span v-if="!rail" class="ml-4 font-weight-bold">Recolher</span>
          </v-btn>
          <v-btn
            variant="text"
            block
            color="red-lighten-3"
            class="justify-start mt-2"
            prepend-icon="mdi-logout-variant"
            @click="handleLogout"
          >
            <span v-if="!rail" class="ml-2 font-weight-bold">Sair do Portal</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Professional Top Bar -->
    <v-app-bar elevation="0" color="white" border="bottom" class="his-topbar px-4">
      <div class="d-flex align-center">
        <v-breadcrumbs :items="breadcrumbs" class="pa-0 breadcrumbs-custom">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right" size="14" color="grey"></v-icon>
          </template>
        </v-breadcrumbs>
      </div>
      
      <v-spacer></v-spacer>
      
      <!-- Actions Bar -->
      <div class="d-flex align-center gap-4">
        <v-menu min-width="200px" rounded="xl">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              variant="text"
              class="user-profile-btn rounded-xl px-2"
            >
              <div class="text-right mr-3 d-none d-sm-block">
                <div class="text-caption font-weight-black text-grey-darken-3 line-height-1">
                  {{ userName }}
                </div>
                <div class="text-overline text-primary font-weight-bold line-height-1">
                  Enfermeiro(a) • Equipe 04
                </div>
              </div>
              <v-avatar color="primary" size="32" class="elevation-2">
                <v-icon icon="mdi-account-circle" color="white"></v-icon>
              </v-avatar>
            </v-btn>
          </template>
          <v-list class="pa-2">
            <v-list-item prepend-icon="mdi-logout" title="Sair do Sistema" color="red" @click="handleLogout" rounded="lg"></v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main class="bg-background content-area">
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter, useRoute } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const drawer = ref(true);
const rail = ref(false);

const userName = computed(() => authStore.user?.name || 'Profissional');

const menuItems = [
  { title: 'Cidadãos', icon: 'mdi-account-group', value: 'citizens', to: '/' },
];

const breadcrumbs = computed(() => {
  const items = [{ title: 'Home', disabled: false, href: '/' }];
  
  if (route.name === 'Home' || route.path === '/') {
    items.push({ title: 'Gestão de Cidadãos', disabled: true, href: '#' });
  } else if (route.name === 'citizen-summary') {
    items.push({ title: 'Cidadãos', disabled: false, href: '/' });
    items.push({ title: 'Prontuário Individual', disabled: true, href: '#' });
  }
  
  return items;
});

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<style scoped>
.app-wrapper {
  font-family: 'Inter', 'Rawline', sans-serif;
}

.his-sidebar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-logo {
  transition: all 0.3s ease;
}

.white-filter {
  filter: brightness(0) invert(1);
}

.menu-item {
  color: rgba(255, 255, 255, 0.7) !important;
  transition: all 0.2s ease;
}

.active-menu-item {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.menu-item:hover:not(.active-menu-item) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  color: white !important;
}

.letter-spacing-1 {
  letter-spacing: 0.8px;
}

.breadcrumbs-custom :deep(.v-breadcrumbs-item) {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #888;
}

.breadcrumbs-custom :deep(.v-breadcrumbs-item--disabled) {
  color: #004092;
  opacity: 1;
}

.user-profile-btn {
  text-transform: none;
}

.line-height-1 {
  line-height: 1.1;
}

.gap-4 {
  gap: 16px;
}

.opacity-20 {
  opacity: 0.2;
}

.opacity-70 {
  opacity: 0.7;
}

.hover-opacity-100:hover {
  opacity: 1;
}

.content-area {
  min-height: 100vh;
}
</style>
