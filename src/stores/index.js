import { defineStore } from 'pinia'

export const usePomodoroStore = defineStore('pomodoro', {
  state: () => ({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    sessions: 0,
    currentTime: 25 * 60,
    isRunning: false,
    isBreak: false,
    timer: null,
    history: JSON.parse(localStorage.getItem('pomodoroHistory')) || []
  }),
  getters: {
    formattedTime: (state) => {
      const minutes = Math.floor(state.currentTime / 60)
      const seconds = state.currentTime % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },
    todaySessions: (state) => {
      const today = new Date().toISOString().split('T')[0]
      return state.history.filter(item => item.date === today)
    },
    totalSessions: (state) => {
      return state.history.length
    },
    weeklySessions: (state) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return state.history.filter(item => new Date(item.timestamp) >= weekAgo)
    }
  },
  actions: {
    startTimer() {
      if (!this.isRunning) {
        this.isRunning = true
        this.timer = setInterval(() => {
          if (this.currentTime > 0) {
            this.currentTime--
          } else {
            this.completeSession()
          }
        }, 1000)
      }
    },
    pauseTimer() {
      this.isRunning = false
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    resetTimer() {
      this.pauseTimer()
      this.currentTime = this.isBreak ? this.breakTime * 60 : this.workTime * 60
    },
    completeSession() {
      this.pauseTimer()
      if (this.isBreak) {
        this.sessions++
        // 记录完成的番茄钟会话
        this.addToHistory()
        this.isBreak = false
        this.currentTime = this.workTime * 60
      } else {
        if (this.sessions % 4 === 3) {
          this.currentTime = this.longBreakTime * 60
        } else {
          this.currentTime = this.breakTime * 60
        }
        this.isBreak = true
      }
    },
    addToHistory() {
      const session = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        duration: this.workTime,
        type: 'work'
      }
      this.history.push(session)
      this.saveHistory()
    },
    saveHistory() {
      // 只保留最近30天的记录
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      this.history = this.history.filter(item => new Date(item.timestamp) >= thirtyDaysAgo)
      localStorage.setItem('pomodoroHistory', JSON.stringify(this.history))
    },
    clearHistory() {
      this.history = []
      localStorage.removeItem('pomodoroHistory')
    },
    updateWorkTime(time) {
      this.workTime = time
      if (!this.isRunning && !this.isBreak) {
        this.currentTime = time * 60
      }
    },
    updateBreakTime(time) {
      this.breakTime = time
    },
    updateLongBreakTime(time) {
      this.longBreakTime = time
    }
  }
})

export const useTodoStore = defineStore('todo', {
  state: () => ({
    todos: JSON.parse(localStorage.getItem('todos')) || [
      {
        id: 1,
        title: '完成Vue3项目',
        description: '创建好习惯养成系统',
        completed: false,
        priority: 'high',
        dueDate: '2026-03-10',
        category: '工作',
        tags: ['Vue3', '项目']
      },
      {
        id: 2,
        title: '学习Pinia',
        description: '掌握状态管理',
        completed: false,
        priority: 'medium',
        dueDate: '2026-03-05',
        category: '学习',
        tags: ['Pinia', '状态管理']
      }
    ],
    categories: JSON.parse(localStorage.getItem('todoCategories')) || ['工作', '学习', '生活', '其他'],
    tags: JSON.parse(localStorage.getItem('todoTags')) || ['Vue3', 'Pinia', '项目', '学习', '生活']
  }),
  getters: {
    pendingTodos: (state) => state.todos.filter(todo => !todo.completed),
    completedTodos: (state) => state.todos.filter(todo => todo.completed),
    highPriorityTodos: (state) => state.todos.filter(todo => todo.priority === 'high' && !todo.completed),
    todosByCategory: (state) => (category) => {
      return state.todos.filter(todo => todo.category === category)
    },
    todosByTag: (state) => (tag) => {
      return state.todos.filter(todo => todo.tags && todo.tags.includes(tag))
    }
  },
  actions: {
    addTodo(todo) {
      const newId = Math.max(...this.todos.map(t => t.id), 0) + 1
      this.todos.push({ 
        ...todo, 
        id: newId, 
        completed: false,
        category: todo.category || '其他',
        tags: todo.tags || []
      })
      // 更新标签列表
      if (todo.tags) {
        todo.tags.forEach(tag => {
          if (!this.tags.includes(tag)) {
            this.tags.push(tag)
          }
        })
      }
      this.saveData()
    },
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        this.saveData()
      }
    },
    deleteTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id)
      this.saveData()
    },
    updateTodo(updatedTodo) {
      const index = this.todos.findIndex(t => t.id === updatedTodo.id)
      if (index !== -1) {
        this.todos[index] = { ...this.todos[index], ...updatedTodo }
        // 更新标签列表
        if (updatedTodo.tags) {
          updatedTodo.tags.forEach(tag => {
            if (!this.tags.includes(tag)) {
              this.tags.push(tag)
            }
          })
        }
        this.saveData()
      }
    },
    addCategory(category) {
      if (!this.categories.includes(category)) {
        this.categories.push(category)
        this.saveData()
      }
    },
    removeCategory(category) {
      if (this.categories.includes(category)) {
        this.categories = this.categories.filter(c => c !== category)
        // 将使用该分类的待办事项移到默认分类
        this.todos.forEach(todo => {
          if (todo.category === category) {
            todo.category = '其他'
          }
        })
        this.saveData()
      }
    },
    addTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag)
        this.saveData()
      }
    },
    removeTag(tag) {
      if (this.tags.includes(tag)) {
        this.tags = this.tags.filter(t => t !== tag)
        // 从所有待办事项中移除该标签
        this.todos.forEach(todo => {
          if (todo.tags) {
            todo.tags = todo.tags.filter(t => t !== tag)
          }
        })
        this.saveData()
      }
    },
    saveData() {
      localStorage.setItem('todos', JSON.stringify(this.todos))
      localStorage.setItem('todoCategories', JSON.stringify(this.categories))
      localStorage.setItem('todoTags', JSON.stringify(this.tags))
    }
  }
})

export const useHabitStore = defineStore('habit', {
  state: () => ({
    habits: JSON.parse(localStorage.getItem('habits')) || [
      {
        id: 1,
        name: '每日阅读',
        description: '每天阅读30分钟',
        frequency: 'daily',
        streak: 5,
        lastCompleted: '2026-03-01'
      },
      {
        id: 2,
        name: '晨跑',
        description: '每天早上跑步10分钟',
        frequency: 'daily',
        streak: 3,
        lastCompleted: '2026-03-01'
      },
      {
        id: 3,
        name: '学习编程',
        description: '每周学习5小时',
        frequency: 'weekly',
        streak: 2,
        lastCompleted: '2026-02-29'
      }
    ],
    completions: JSON.parse(localStorage.getItem('habitCompletions')) || {
      '2026-03-01': [1, 2],
      '2026-02-29': [1, 2, 3],
      '2026-02-28': [1, 2]
    }
  }),
  getters: {
    dailyHabits: (state) => state.habits.filter(habit => habit.frequency === 'daily'),
    weeklyHabits: (state) => state.habits.filter(habit => habit.frequency === 'weekly'),
    monthlyHabits: (state) => state.habits.filter(habit => habit.frequency === 'monthly'),
    habitCompletionRate: (state) => (habitId, days = 7) => {
      let completed = 0
      let total = 0
      const habit = state.habits.find(h => h.id === habitId)
      if (!habit) return 0
      
      const endDate = new Date()
      for (let i = 0; i < days; i++) {
        const date = new Date(endDate)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        total++
        if (state.completions[dateStr] && state.completions[dateStr].includes(habitId)) {
          completed++
        }
      }
      return total > 0 ? Math.round((completed / total) * 100) : 0
    },
    overallCompletionRate: (state) => (days = 7) => {
      let completed = 0
      let total = 0
      
      const endDate = new Date()
      for (let i = 0; i < days; i++) {
        const date = new Date(endDate)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const dayCompleted = state.completions[dateStr] || []
        completed += dayCompleted.length
        total += state.habits.filter(h => h.frequency === 'daily').length
      }
      return total > 0 ? Math.round((completed / total) * 100) : 0
    },
    habitsByStreak: (state) => {
      return [...state.habits].sort((a, b) => b.streak - a.streak)
    },
    completionData: (state) => (days = 7) => {
      const data = []
      const endDate = new Date()
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(endDate)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]
        const dayCompleted = state.completions[dateStr] || []
        data.push({
          date: dateStr,
          completed: dayCompleted.length,
          total: state.habits.filter(h => h.frequency === 'daily').length
        })
      }
      return data
    }
  },
  actions: {
    addHabit(habit) {
      const newId = Math.max(...this.habits.map(h => h.id), 0) + 1
      this.habits.push({ ...habit, id: newId, streak: 0, lastCompleted: null })
      this.saveData()
    },
    completeHabit(habitId) {
      const today = new Date().toISOString().split('T')[0]
      if (!this.completions[today]) {
        this.completions[today] = []
      }
      if (!this.completions[today].includes(habitId)) {
        this.completions[today].push(habitId)
        const habit = this.habits.find(h => h.id === habitId)
        if (habit) {
          habit.streak++
          habit.lastCompleted = today
        }
      }
      this.saveData()
    },
    uncompleteHabit(habitId) {
      const today = new Date().toISOString().split('T')[0]
      if (this.completions[today]) {
        this.completions[today] = this.completions[today].filter(id => id !== habitId)
        const habit = this.habits.find(h => h.id === habitId)
        if (habit && habit.lastCompleted === today) {
          habit.streak = Math.max(0, habit.streak - 1)
          habit.lastCompleted = null
        }
      }
      this.saveData()
    },
    deleteHabit(id) {
      this.habits = this.habits.filter(h => h.id !== id)
      // 清理完成记录
      for (const date in this.completions) {
        this.completions[date] = this.completions[date].filter(habitId => habitId !== id)
      }
      this.saveData()
    },
    updateHabit(updatedHabit) {
      const index = this.habits.findIndex(h => h.id === updatedHabit.id)
      if (index !== -1) {
        this.habits[index] = { ...this.habits[index], ...updatedHabit }
        this.saveData()
      }
    },
    isHabitCompleted(habitId) {
      const today = new Date().toISOString().split('T')[0]
      return this.completions[today]?.includes(habitId) || false
    },
    saveData() {
      localStorage.setItem('habits', JSON.stringify(this.habits))
      localStorage.setItem('habitCompletions', JSON.stringify(this.completions))
    }
  }
})