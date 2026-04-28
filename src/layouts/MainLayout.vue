<template>
  <v-app class="app-wrapper">
    <!-- Modern HIS Sidebar -->
    <v-navigation-drawer
      v-model="drawer"
      class="his-sidebar"
      color="primary"
      elevation="0"
      :permanent="$vuetify.display.mdAndUp"
      :rail="rail && $vuetify.display.mdAndUp"
      width="280"
    >
      <div class="sidebar-header d-flex align-center pa-4" :class="{ 'justify-center': rail && $vuetify.display.mdAndUp }">
        <v-icon class="mr-2" color="white" icon="mdi-account-heart" :size="rail && $vuetify.display.mdAndUp ? 32 : 40" />
        <span v-if="!rail || !$vuetify.display.mdAndUp" class="text-h5 font-weight-black text-white">e-PET</span>
      </div>

      <v-divider class="opacity-20 mx-4" />

      <v-list class="mt-4 px-2" density="comfortable" nav>
        <v-list-item
          v-for="(item, i) in menuItems"
          :key="i"
          active-class="active-menu-item"
          class="menu-item mb-2"
          exact
          rounded="lg"
          :to="item.to"
          :value="item.value"
        >
          <template #prepend>
            <v-icon class="mr-2" :icon="item.icon" size="22" />
          </template>
          <v-list-item-title v-if="!rail || !$vuetify.display.mdAndUp" class="font-weight-bold text-uppercase letter-spacing-1">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <template #append>
        <div class="pa-4">
          <v-btn
            v-if="$vuetify.display.mdAndUp"
            block
            class="justify-start text-white opacity-70 hover-opacity-100"
            variant="text"
            @click="rail = !rail"
          >
            <v-icon :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" size="24" />
            <span v-if="!rail" class="ml-4 font-weight-bold">Recolher</span>
          </v-btn>
          <v-btn
            block
            class="justify-start mt-2"
            color="red-lighten-3"
            prepend-icon="mdi-logout-variant"
            variant="text"
            @click="handleLogout"
          >
            <span v-if="!rail || !$vuetify.display.mdAndUp" class="ml-2 font-weight-bold">Sair do Portal</span>
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- Professional Top Bar -->
    <v-app-bar border="bottom" class="his-topbar px-4" color="white" elevation="0">
      <v-app-bar-nav-icon
        class="d-md-none mr-2"
        @click="drawer = !drawer"
      />

      <div class="d-flex align-center">
        <v-breadcrumbs class="pa-0 breadcrumbs-custom" :items="breadcrumbs">
          <template #divider>
            <v-icon color="grey" icon="mdi-chevron-right" size="14" />
          </template>
        </v-breadcrumbs>
      </div>

      <v-spacer />

      <!-- Actions Bar -->
      <div class="d-flex align-center gap-4">
        <v-menu min-width="200px" rounded="xl">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              class="user-profile-btn rounded-xl px-2"
              variant="text"
            >
              <div class="text-right mr-3 d-none d-sm-block">
                <div class="text-caption font-weight-black text-grey-darken-3 line-height-1">
                  {{ userName }}
                </div>
                <div class="text-overline text-primary font-weight-bold line-height-1">
                  Enfermeiro(a) • Equipe 04
                </div>
              </div>
              <v-avatar class="elevation-2" color="primary" size="32">
                <v-icon color="white" icon="mdi-account-circle" />
              </v-avatar>
            </v-btn>
          </template>
          <v-list class="pa-2">
            <v-list-item
              color="red"
              prepend-icon="mdi-logout"
              rounded="lg"
              title="Sair do Sistema"
              @click="handleLogout"
            />
          </v-list>
        </v-menu>
      </div>
    </v-app-bar>

    <v-main class="bg-background content-area">
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/authStore'

  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  const drawer = ref(true)
  const rail = ref(false)

  const userName = computed(() => authStore.user?.name || 'Profissional')

  const menuItems = [
    { title: 'Dashboard', icon: 'mdi-view-dashboard', value: 'dashboard', to: '/dashboard' },
    { title: 'Cidadãos', icon: 'mdi-account-group', value: 'citizens', to: '/' },
  ]

  const breadcrumbs = computed(() => {
    const items = [{ title: 'Home', disabled: false, href: '/' }]

    if (route.name === 'Home' || route.path === '/') {
      items.push({ title: 'Gestão de Cidadãos', disabled: true, href: '#' })
    } else if (route.name === 'Dashboard') {
      items.push({ title: 'Dashboard Territorial', disabled: true, href: '#' })
    } else if (route.name === 'citizen-summary') {
      items.push({ title: 'Cidadãos', disabled: false, href: '/' }, { title: 'Prontuário Individual', disabled: true, href: '#' })
    }

    return items
  })

  function handleLogout () {
    authStore.logout()
    router.push('/login')
  }
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
