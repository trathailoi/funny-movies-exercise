import { defineStore } from 'pinia'
import { useOsTheme } from 'naive-ui'

const osThemeRef = useOsTheme()
interface IUser {
  email?: string
}

const user: IUser = {}

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
    login(user: { email: string }) {
      this.user = user
    }
  }
})
