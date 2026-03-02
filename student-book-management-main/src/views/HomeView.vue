<template>
  <div>
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>欢迎使用学生图书管理系统</span>
        </div>
      </template>
      <div class="welcome-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="stats-card">
              <div class="stats-icon book-icon"></div>
              <h3>图书总数</h3>
              <p class="stats-number">{{ bookStore.totalBooks }}</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="stats-card">
              <div class="stats-icon student-icon"></div>
              <h3>学生总数</h3>
              <p class="stats-number">{{ studentStore.totalStudents }}</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="stats-card">
              <div class="stats-icon borrow-icon"></div>
              <h3>当前借阅</h3>
              <p class="stats-number">{{ borrowStore.activeBorrows.length }}</p>
            </el-card>
          </el-col>
        </el-row>
        <div class="quick-links">
          <h3>快速操作</h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-button type="primary" @click="navigateTo('/books')" class="link-button">
                <el-icon><i-ep-book /></el-icon>
                图书管理
              </el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="success" @click="navigateTo('/students')" class="link-button">
                <el-icon><i-ep-user /></el-icon>
                学生管理
              </el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="warning" @click="navigateTo('/borrow')" class="link-button">
                <el-icon><i-ep-swap /></el-icon>
                借阅管理
              </el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="info" @click="navigateTo('/statistics')" class="link-button">
                <el-icon><i-ep-data-analysis /></el-icon>
                数据统计
              </el-button>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useBookStore, useStudentStore, useBorrowStore } from '../stores'
import { useRouter } from 'vue-router'

const bookStore = useBookStore()
const studentStore = useStudentStore()
const borrowStore = useBorrowStore()
const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>

.welcome-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.welcome-content {
  margin-top: 30px;
}

.stats-card {
  text-align: center;
  padding: 20px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.stats-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 15px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.book-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.student-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.borrow-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.stats-number {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin: 10px 0;
}

.quick-links {
  margin-top: 40px;
}

.quick-links h3 {
  margin-bottom: 20px;
  color: #333;
}

.link-button {
  width: 100%;
  height: 80px;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.link-button .el-icon {
  font-size: 24px;
  margin-bottom: 8px;
}
</style>