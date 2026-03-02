<template>
  <div class="layout-container">
    <el-container>
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>好习惯养成</h2>
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
          <el-menu-item index="/pomodoro">
            <el-icon><i-ep-timer /></el-icon>
            <span>番茄钟</span>
          </el-menu-item>
          <el-menu-item index="/todolist">
            <el-icon><i-ep-check /></el-icon>
            <span>待办事项</span>
          </el-menu-item>
          <el-menu-item index="/habits">
            <el-icon><i-ep-data-line /></el-icon>
            <span>习惯追踪</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="header-right">
            <el-button type="primary" @click="refreshBackground" plain>
              <el-icon><i-ep-refresh /></el-icon>
              换背景
            </el-button>
            <el-dropdown style="margin-left: 10px">
              <span class="user">
                <el-avatar size="small">用</el-avatar>
                <span style="margin-left: 8px">用户</span>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>个人中心</el-dropdown-item>
                  <el-dropdown-item>设置</el-dropdown-item>
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
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  return route.path
})

const handleMenuSelect = (key) => {
  router.push(key)
}

const refreshBackground = () => {
  // 触发父组件的背景刷新
  const event = new CustomEvent('refresh-background')
  window.dispatchEvent(event)
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
  background-color: transparent;
}

.sidebar {
  background: rgba(44, 62, 80, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
  color: white;
}

.el-menu-vertical-demo {
  background: transparent;
  border-right: none;
}

.el-menu-item {
  color: #ecf0f1;
  margin: 10px 0;
  border-radius: 0 20px 20px 0;
  transition: all 0.3s ease;
}

.el-menu-item:hover {
  background: rgba(52, 73, 94, 0.8);
}

.el-menu-item.is-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.header-right {
  display: flex;
  align-items: center;
}

.user {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #333;
}

.main {
  padding: 20px;
  background: transparent;
}

@media screen and (max-width: 768px) {
  .el-aside {
    width: 180px !important;
  }
  
  .logo h2 {
    font-size: 16px;
  }
  
  .el-menu-item {
    font-size: 13px;
  }
}

@media screen and (max-width: 480px) {
  .el-aside {
    width: 160px !important;
  }
  
  .logo h2 {
    font-size: 14px;
  }
  
  .el-menu-item {
    font-size: 12px;
  }
  
  .header {
    padding: 0 10px;
  }
  
  .main {
    padding: 10px;
  }
}
</style>