import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import DashboardView from '@/pages/DashboardView.vue'
import Index from '@/pages/index.vue'
import LoginView from '@/pages/LoginView.vue'
import TerritoryListView from '@/pages/TerritoryListView.vue'
import VisualizacaoCidadao from '@/pages/VisualizacaoCidadao.vue'
import { useAuthStore } from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
      meta: { public: true },
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: Index,
        },
        {
          path: 'dashboard',
          name: 'Dashboard',
          component: DashboardView,
        },
        {
          path: 'summary',
          name: 'Summary',
          component: Index,
        },
        {
          path: 'citizen/:id',
          name: 'citizen-summary',
          component: VisualizacaoCidadao,
          props: true,
        },
        {
          path: 'territory',
          name: 'territory-list',
          component: TerritoryListView,
        },
      ],
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isPublic = to.meta.public
  const isAuthenticated = authStore.checkAuth()

  if (!isPublic && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (isPublic && isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
