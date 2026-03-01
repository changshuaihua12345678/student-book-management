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
      path: '/books',
      name: 'books',
      component: () => import('../views/BookManage.vue'),
      meta: { title: '图书管理' }
    },
    {
      path: '/students',
      name: 'students',
      component: () => import('../views/StudentManage.vue'),
      meta: { title: '学生管理' }
    },
    {
      path: '/borrow',
      name: 'borrow',
      component: () => import('../views/BorrowManage.vue'),
      meta: { title: '借阅管理' }
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: () => import('../views/StatisticsView.vue'),
      meta: { title: '数据统计' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '学生图书管理系统'
  next()
})

export default router