<template>
  <n-config-provider :theme="currentTheme">
    <n-layout has-sider class="h-screen">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :collapsed="collapsed"
        show-trigger="bar"
        :native-scrollbar="false"
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </n-layout-sider>

      <n-layout :native-scrollbar="false" class="p-6">
        <n-switch v-model:value="isDarkMode" class="mb-3">
          <template #checked>
            🌙
          </template>
          <template #unchecked>
            🌞
          </template>
        </n-switch>

        <n-page-header :title="routerTitle">
          <template #header>
            <n-breadcrumb>
              <n-breadcrumb-item v-for="breadcrumb in breadcrumbs" :key="breadcrumb.to.name">
                <router-link v-if="$route.name !== breadcrumb.to.name" :to="(breadcrumb.to as RouteLocationRaw)">
                  {{ breadcrumb.text }}
                </router-link>
                <span v-else>
                  {{ breadcrumb.text }}
                </span>
              </n-breadcrumb-item>
            </n-breadcrumb>
          </template>
        </n-page-header>

        <n-layout-content :native-scrollbar="false">
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'
import { darkTheme, NIcon } from 'naive-ui'
import { useRoute, RouterLink } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRootStore } from '@/stores/index'

import HomeIcon from '~icons/mdi/home'
import AccountIcon from '~icons/mdi/account'
import PhoneIcon from '~icons/mdi/phone'
import ChartTimelineIcon from '~icons/mdi/chart-timeline'
import DragVerticalVarianticon from '~icons/mdi/drag-vertical-variant'
import InformationIcon from '~icons/mdi/information'

const route = useRoute()
interface RouteBreadcrumb {
  text: string
  to: {
    name: string
    params?: object
  }
}

const { isDarkMode } = storeToRefs(useRootStore())
const currentTheme = computed(() => isDarkMode.value ? darkTheme : undefined)

const menuOptions = [
  {
    label: 'Webapp Backend Starter',
    key: 'title'
  },
  {
    key: 'divider-2',
    type: 'divider'
  },
  {
    label: () => h(
      RouterLink,
      { to: { name: 'home' } },
      { default: () => 'Home' }
    ),
    key: 'home',
    icon: () => h(NIcon, null, { default: () => h(HomeIcon) })
  },
  {
    label: () => h(
      RouterLink,
      { to: { name: 'about' } },
      { default: () => 'About' }
    ),
    key: 'about',
    icon: () => h(NIcon, null, { default: () => h(InformationIcon) })
  }
]
const collapsed = ref(false)
const activeKey = ref('')
activeKey.value = menuOptions.find(mo => mo.key === route.name)?.key || ''

const breadcrumbs = computed<RouteBreadcrumb[]>(() => (
  ((route.meta && route.meta.breadcrumbs) || []) as RouteBreadcrumb[]
))
const routerTitle = computed<string>(() => (
  ((route.meta && route.meta.title) || '') as string
))
</script>
