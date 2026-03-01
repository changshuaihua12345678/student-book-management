<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>图书管理系统</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="el-menu-vertical-demo"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/">
            <el-icon><i-ep-home /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/books">
            <el-icon><i-ep-book /></el-icon>
            <span>图书管理</span>
          </el-menu-item>
          <el-menu-item index="/students">
            <el-icon><i-ep-user /></el-icon>
            <span>学生管理</span>
          </el-menu-item>
          <el-menu-item index="/borrow">
            <el-icon><i-ep-swap /></el-icon>
            <span>借阅管理</span>
          </el-menu-item>
          <el-menu-item index="/statistics">
            <el-icon><i-ep-data-analysis /></el-icon>
            <span>数据统计</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-right">
            <el-dropdown>
              <span class="user">
                <el-avatar size="small">管</el-avatar>
                <span style="margin-left: 8px">管理员</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <el-main class="main">
          <slot></slot>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  return route.path
})

const handleMenuSelect = (key) => {
  router.push(key)
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: #f5f7fa;
}

.sidebar {
  background-color: #2c3e50;
  color: white;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid #34495e;
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.el-menu-vertical-demo {
  background-color: #2c3e50;
  border-right: none;
}

.el-menu-item {
  color: #ecf0f1;
  margin: 10px 0;
  border-radius: 0 20px 20px 0;
}

.el-menu-item:hover {
  background-color: #34495e;
}

.el-menu-item.is-active {
  background-color: #3498db;
  color: white;
}

.header {
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
}

.header-right {
  display: flex;
  align-items: center;
}

.user {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>