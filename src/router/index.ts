import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import { useRootStore } from '@/stores/index'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/layouts/default.vue'),
    meta: {
      breadcrumbs: [
        { text: 'Home', to: { name: 'home' } }
      ]
    },
    children: [
      { // 404
        path: '/:pathMatch(.*)',
        name: 'not-found',
        component: () => import('@/views/PageNotFound.vue')
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/PageAbout.vue'),
        meta: {
          breadcrumbs: [
            { text: 'Home', to: { name: 'home' } },
            { text: 'About', to: { name: 'about' } }
          ]
        }
      }
    ]
  }
]

// console.log('import.meta.env.DEV', import.meta.env.DEV)
const router = createRouter({
  history: import.meta.env.DEV ? createWebHashHistory() : createWebHistory(),
  routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  }
})

router.beforeEach(() => {
  const { authCheck } = useRootStore()
  authCheck()
})

export default router
