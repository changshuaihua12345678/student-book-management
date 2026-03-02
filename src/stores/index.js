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
    timer: null
  }),
  getters: {
    formattedTime: (state) => {
      const minutes = Math.floor(state.currentTime / 60)
      const seconds = state.currentTime % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
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
        dueDate: '2026-03-10'
      },
      {
        id: 2,
        title: '学习Pinia',
        description: '掌握状态管理',
        completed: false,
        priority: 'medium',
        dueDate: '2026-03-05'
      }
    ]
  }),
  getters: {
    pendingTodos: (state) => state.todos.filter(todo => !todo.completed),
    completedTodos: (state) => state.todos.filter(todo => todo.completed),
    highPriorityTodos: (state) => state.todos.filter(todo => todo.priority === 'high' && !todo.completed)
  },
  actions: {
    addTodo(todo) {
      const newId = Math.max(...this.todos.map(t => t.id), 0) + 1
      this.todos.push({ ...todo, id: newId, completed: false })
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },
    toggleTodo(id) {
      const todo = this.todos.find(t => t.id === id)
      if (todo) {
        todo.completed = !todo.completed
        localStorage.setItem('todos', JSON.stringify(this.todos))
      }
    },
    deleteTodo(id) {
      this.todos = this.todos.filter(t => t.id !== id)
      localStorage.setItem('todos', JSON.stringify(this.todos))
    },
    updateTodo(updatedTodo) {
      const index = this.todos.findIndex(t => t.id === updatedTodo.id)
      if (index !== -1) {
        this.todos[index] = { ...this.todos[index], ...updatedTodo }
        localStorage.setItem('todos', JSON.stringify(this.todos))
      }
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
    completions: JSON.parse(localStorage.getItem('completions')) || {
      '2026-03-01': [1, 2],
      '2026-02-29': [1, 2, 3],
      '2026-02-28': [1, 2]
    }
  }),
  getters: {
    dailyHabits: (state) => state.habits.filter(habit => habit.frequency === 'daily'),
    weeklyHabits: (state) => state.habits.filter(habit => habit.frequency === 'weekly'),
    monthlyHabits: (state) => state.habits.filter(habit => habit.frequency === 'monthly')
  },
  actions: {
    addHabit(habit) {
      const newId = Math.max(...this.habits.map(h => h.id), 0) + 1
      this.habits.push({ ...habit, id: newId, streak: 0, lastCompleted: null })
      localStorage.setItem('habits', JSON.stringify(this.habits))
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
        localStorage.setItem('habits', JSON.stringify(this.habits))
        localStorage.setItem('completions', JSON.stringify(this.completions))
      }
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
        localStorage.setItem('habits', JSON.stringify(this.habits))
        localStorage.setItem('completions', JSON.stringify(this.completions))
      }
    },
    deleteHabit(id) {
      this.habits = this.habits.filter(h => h.id !== id)
      // 清理完成记录
      for (const date in this.completions) {
        this.completions[date] = this.completions[date].filter(habitId => habitId !== id)
      }
      localStorage.setItem('habits', JSON.stringify(this.habits))
      localStorage.setItem('completions', JSON.stringify(this.completions))
    },
    updateHabit(updatedHabit) {
      const index = this.habits.findIndex(h => h.id === updatedHabit.id)
      if (index !== -1) {
        this.habits[index] = { ...this.habits[index], ...updatedHabit }
        localStorage.setItem('habits', JSON.stringify(this.habits))
      }
    },
    isHabitCompleted(habitId) {
      const today = new Date().toISOString().split('T')[0]
      return this.completions[today]?.includes(habitId) || false
    }
  }
})