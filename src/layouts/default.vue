<template>
  <n-config-provider :theme="currentTheme">
    <n-layout class="h-screen">
      <n-layout :native-scrollbar="false" class="p-6">
        <n-page-header :title="routerTitle" :subtitle="routerTitle">
          <template #avatar>
            <router-link :to="{ name: 'home' }" class="no-underline text-black dark:text-white">
              <n-icon size="35">
                <i-mdi-home />
              </n-icon>
            </router-link>
          </template>
          <template #title>
            <router-link :to="{ name: 'home' }" class="no-underline text-black dark:text-white">
              Funny Movies
            </router-link>
          </template>
          <template #extra>
            <button @click="showSignUpPopup(true)">
              Sign Up
            </button>
            <PopupSignUp v-model:value="isSignUpPopupVisible" @close="showSignUpPopup(false)" />
            <n-space>
              <n-switch v-model:value="isDarkMode" class="mb-3">
                <template #checked>
                  🌙
                </template>
                <template #unchecked>
                  🌞
                </template>
              </n-switch>
            </n-space>
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
import { computed, ref } from 'vue'
import { darkTheme } from 'naive-ui'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRootStore } from '@/stores/index'

import PopupSignUp from '../views/PopupSignUp.vue'

const route = useRoute()

// data
const isSignUpPopupVisible = ref(false)

// computed
const { isDarkMode } = storeToRefs(useRootStore())
const currentTheme = computed(() => isDarkMode.value ? darkTheme : undefined)

const routerTitle = computed<string>(() => (
  ((route.meta && route.meta.title) || '') as string
))

// methods
const showSignUpPopup = (val: boolean) => {
  isSignUpPopupVisible.value = val
}
</script>
