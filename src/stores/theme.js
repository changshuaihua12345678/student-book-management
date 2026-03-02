import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: localStorage.getItem('theme') || 'light'
  }),
  getters: {
    isDarkTheme: (state) => state.currentTheme === 'dark'
  },
  actions: {
    toggleTheme() {
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light'
      this.saveTheme()
      this.applyTheme()
    },
    setTheme(theme) {
      this.currentTheme = theme
      this.saveTheme()
      this.applyTheme()
    },
    saveTheme() {
      localStorage.setItem('theme', this.currentTheme)
    },
    applyTheme() {
      if (this.currentTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }
})