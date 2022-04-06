import { defineStore } from 'pinia'
import { useOsTheme } from 'naive-ui'

import axios from 'axios'

import { setCookie } from '@/utils/index'

const osThemeRef = useOsTheme()

const tokenKey = String(import.meta.env.VITE_TOKEN_KEY) || 'funnymovies-token'
interface IUser {
  email?: string
}
const user: IUser = {}

const authCheckSvc = () => axios.get(`${import.meta.env.VITE_BASE_API}${import.meta.env.VITE_BASE_API_VERSION || '/api/v1.0'}/authen/check`, {
  withCredentials: true,
  validateStatus: status => status >= 200 && status < 500
})

export const useRootStore = defineStore('rootStore', {
  // arrow function recommended for full type inference
  state: () => ({
    // all these properties will have their type inferred automatically
    isDarkMode: osThemeRef.value === 'dark',
    user
  }),

  getters: {
    getIsDarkMode(): boolean {
      return this.isDarkMode
    }
  },

  actions: {
    setDarkMode(value: boolean) {
      this.isDarkMode = value
    },
    updateAuthUser(user: { email: string }) {
      this.user = user
    },
    logout() {
      this.user = {}
      setCookie(tokenKey, null)
    },
    async authCheck() {
      try {
        const result = await authCheckSvc()
        // console.log('result', result)
        if (result.status === 401) {
          // router.push('/auth/login')
        } else if (result && result.data) {
          this.updateAuthUser(result.data)
          return result.data
        }
        // commit('corePermission/SET_ACL_USER', data.permissionPage, { root: true })
        return {}
      } catch (error) {
        this.logout()
        throw error
      }
    }
  }
})
