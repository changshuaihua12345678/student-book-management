import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    isLoggedIn: localStorage.getItem('user') !== null
  }),
  getters: {
    currentUser: (state) => state.user,
    isAuthenticated: (state) => state.isLoggedIn
  },
  actions: {
    login(userInfo) {
      const user = {
        id: 1,
        username: userInfo.username,
        avatar: userInfo.avatar,
        email: `${userInfo.username}@example.com`,
        createdAt: new Date().toISOString()
      }
      this.user = user
      this.isLoggedIn = true
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      localStorage.removeItem('user')
      localStorage.removeItem('username')
    },
    updateUserInfo(info) {
      if (this.user) {
        this.user = { ...this.user, ...info }
        localStorage.setItem('user', JSON.stringify(this.user))
      }
    }
  }
})