import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { title: '首页' }
    },
    {
      path: '/pomodoro',
      name: 'pomodoro',
      component: () => import('../views/PomodoroView.vue'),
      meta: { title: '番茄钟' }
    },
    {
      path: '/todolist',
      name: 'todolist',
      component: () => import('../views/TodoListView.vue'),
      meta: { title: '待办事项' }
    },
    {
      path: '/habits',
      name: 'habits',
      component: () => import('../views/HabitsView.vue'),
      meta: { title: '习惯追踪' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '好习惯养成系统'
  next()
})

export default router