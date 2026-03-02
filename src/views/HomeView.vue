<template>
  <div class="home-container">
    <el-card class="welcome-card">
      <template #header>
        <div class="card-header">
          <span>欢迎回来！</span>
          <el-tag type="success">{{ today }}</el-tag>
        </div>
      </template>
      <div class="welcome-content">
        <h2>培养好习惯，成就更好的自己</h2>
        <p>今天是 {{ today }}，让我们一起开始美好的一天！</p>
      </div>
    </el-card>
    
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col :span="6">
        <div class="home-card" @click="navigateTo('/pomodoro')">
          <div class="home-card-icon">
            <el-icon><i-ep-timer /></el-icon>
          </div>
          <h3 class="home-card-title">番茄钟</h3>
          <p class="home-card-desc">专注工作，合理休息</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="home-card" @click="navigateTo('/todolist')">
          <div class="home-card-icon">
            <el-icon><i-ep-check /></el-icon>
          </div>
          <h3 class="home-card-title">待办事项</h3>
          <p class="home-card-desc">规划任务，提高效率</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="home-card" @click="navigateTo('/habits')">
          <div class="home-card-icon">
            <el-icon><i-ep-data-line /></el-icon>
          </div>
          <h3 class="home-card-title">习惯追踪</h3>
          <p class="home-card-desc">养成好习惯，持续进步</p>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="home-card">
          <div class="home-card-icon">
            <el-icon><i-ep-star /></el-icon>
          </div>
          <h3 class="home-card-title">成就系统</h3>
          <p class="home-card-desc">解锁成就，激励自己</p>
        </div>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 30px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>今日待办</span>
          </template>
          <div class="todo-preview">
            <el-empty v-if="pendingTodos.length === 0" description="暂无待办事项" />
            <div v-else class="todo-item-preview" v-for="todo in pendingTodos.slice(0, 3)" :key="todo.id">
              <el-checkbox v-model="todo.completed">{{ todo.title }}</el-checkbox>
              <el-tag :type="getPriorityType(todo.priority)" size="small" style="margin-left: 10px">
                {{ getPriorityText(todo.priority) }}
              </el-tag>
            </div>
            <el-button type="primary" plain @click="navigateTo('/todolist')" style="margin-top: 15px">
              查看全部
            </el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <span>今日习惯</span>
          </template>
          <div class="habit-preview">
            <el-empty v-if="dailyHabits.length === 0" description="暂无习惯" />
            <div v-else class="habit-item-preview" v-for="habit in dailyHabits" :key="habit.id">
              <el-checkbox v-model="habit.completed" @change="handleHabitChange(habit.id, $event)">
                {{ habit.name }}
              </el-checkbox>
              <el-tag type="info" size="small" style="margin-left: 10px">
                连续 {{ habit.streak }} 天
              </el-tag>
            </div>
            <el-button type="primary" plain @click="navigateTo('/habits')" style="margin-top: 15px">
              查看全部
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTodoStore, useHabitStore } from '../stores'

const router = useRouter()
const todoStore = useTodoStore()
const habitStore = useHabitStore()

const today = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

const pendingTodos = computed(() => todoStore.pendingTodos)
const dailyHabits = computed(() => {
  return habitStore.dailyHabits.map(habit => ({
    ...habit,
    completed: habitStore.isHabitCompleted(habit.id)
  }))
})

const navigateTo = (path) => {
  router.push(path)
}

const getPriorityType = (priority) => {
  switch (priority) {
    case 'high': return 'danger'
    case 'medium': return 'warning'
    case 'low': return 'success'
    default: return 'info'
  }
}

const getPriorityText = (priority) => {
  switch (priority) {
    case 'high': return '高优先级'
    case 'medium': return '中优先级'
    case 'low': return '低优先级'
    default: return '普通'
  }
}

const handleHabitChange = (habitId, completed) => {
  if (completed) {
    habitStore.completeHabit(habitId)
  } else {
    habitStore.uncompleteHabit(habitId)
  }
}

onMounted(() => {
  // 监听背景刷新事件
  window.addEventListener('refresh-background', () => {
    // 触发父组件的背景刷新
    const event = new CustomEvent('refresh-background')
    window.dispatchEvent(event)
  })
})
</script>

<style scoped>
.home-container {
  padding: 20px;
}

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
  text-align: center;
  padding: 40px 0;
}

.welcome-content h2 {
  font-size: 28px;
  margin-bottom: 15px;
  color: #333;
}

.welcome-content p {
  font-size: 16px;
  color: #666;
}

.todo-preview,
.habit-preview {
  padding: 10px 0;
}

.todo-item-preview,
.habit-item-preview {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@media screen and (max-width: 768px) {
  .welcome-content h2 {
    font-size: 24px;
  }
  
  .el-col {
    margin-bottom: 20px;
  }
}
</style>