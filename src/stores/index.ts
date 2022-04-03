import { defineStore } from 'pinia'
import { useOsTheme } from 'naive-ui'

const osThemeRef = useOsTheme()

export const useRootStore = defineStore('rootStore', {
  // arrow function recommended for full type inference
  state: () => ({
    // all these properties will have their type inferred automatically
    isDarkMode: osThemeRef.value === 'dark'
  }),

  getters: {
    getIsDarkMode(): boolean {
      return this.isDarkMode
    }
  },

  actions: {
    setDarkMode(value: boolean) {
      this.isDarkMode = value
    }
  }
})
