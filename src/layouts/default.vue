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
            <n-space v-if="user && user.email">
              <div class="flex items-center h-full">Welcome, {{ user.email }}</div>
              <n-button @click="shareMovie">
                Share
              </n-button>
              <n-button @click="logout">
                Logout
              </n-button>
            </n-space>
            <n-space v-else>
              <n-form
                ref="formRef"
                inline
                :model="formValue"
                :rules="rules"
                size="small"
              >
                <n-form-item label="Email" path="email">
                  <n-input v-model:value="formValue.email" placeholder="Input Email" />
                </n-form-item>
                <n-form-item label="Password" path="password">
                  <n-input
                    v-model:value="formValue.password"
                    type="password"
                    @keydown.enter.prevent
                  />
                </n-form-item>
                <n-form-item>
                  <n-space>
                    <n-button @click="doSignIn">
                      Sign In
                    </n-button>
                    <n-button @click="$event.preventDefault();showSignUpPopup(true)">
                      Sign Up
                    </n-button>
                  </n-space>
                </n-form-item>
              </n-form>
              <PopupSignUp v-model:value="isSignUpPopupVisible" @close="showSignUpPopup(false)" />
            </n-space>
            <!-- <n-space>
              <n-switch v-model:value="isDarkMode" class="mb-3">
                <template #checked>
                  🌙
                </template>
                <template #unchecked>
                  🌞
                </template>
              </n-switch>
            </n-space> -->
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
import { darkTheme, FormInst, useMessage } from 'naive-ui'
import { useRoute, RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'

import { useRootStore } from '@/stores/index'
import { setCookie } from '@/utils/index'

import { signin } from '@/services/authen'
import { rules } from '@/utils/input-validation'
import PopupSignUp from '../views/PopupSignUp.vue'

const message = useMessage()
const route = useRoute()
const formRef = ref<FormInst | null>(null)

// data
const isSignUpPopupVisible = ref(false)
const formValue = ref({
  email: '',
  password: ''
})

// computed
const { isDarkMode, user } = storeToRefs(useRootStore())
const { updateAuthUser, logout } = useRootStore()
const currentTheme = computed(() => isDarkMode.value ? darkTheme : undefined)

const routerTitle = computed<string>(() => (
  ((route.meta && route.meta.title) || '') as string
))

// methods
const showSignUpPopup = (val: boolean) => {
  isSignUpPopupVisible.value = val
}

const tokenKey = String(import.meta.env.VITE_TOKEN_KEY) || 'funnymovies-token'
const doSignIn = (e: MouseEvent) => {
  e.preventDefault()
  if (formRef.value) {
    formRef.value?.validate(async (errors) => {
      if (!errors) {
        const { email, password } = formValue.value
        try {
          const { data } = await signin({ email, password })
          if (data.success) {
            message.success('Sign in successfuly')
            setCookie(tokenKey, data.access_token)
            updateAuthUser({ email })
            formValue.value = { email: '', password: '' }
          } else {
            message.error(data.message)
          }
        } catch (err: any) {
          if (err.response) {
            if (err.response.status === 401) {
              message.error('The email or password is incorrect!')
              // message.error(err.response.data.message)
            } else {
              message.error(err.message)
            }
          } else if (err.request) {
            message.error(err.request)
          } else {
            // message.error('Something went wrong')
            message.error(err.message)
          }
        }
      }
    })
  }
}

const shareMovie = (e: MouseEvent) => {
  e.preventDefault()
}
</script>
