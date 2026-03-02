<template>
  <div class="pomodoro-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>番茄钟</span>
          <el-tag :type="isBreak ? 'success' : 'primary'">
            {{ isBreak ? '休息时间' : '工作时间' }}
          </el-tag>
        </div>
      </template>
      
      <div class="pomodoro-content">
        <div class="pomodoro-timer" :class="{ 'break': isBreak }">
          <div class="pomodoro-time">{{ formattedTime }}</div>
        </div>
        
        <div class="pomodoro-buttons">
          <el-button 
            :type="isRunning ? 'warning' : 'primary'"
            :icon="isRunning ? 'i-ep-pause' : 'i-ep-play'"
            @click="toggleTimer"
            size="large"
          >
            {{ isRunning ? '暂停' : '开始' }}
          </el-button>
          <el-button 
            type="info"
            icon="i-ep-refresh"
            @click="resetTimer"
            size="large"
          >
            重置
          </el-button>
        </div>
        
        <div class="pomodoro-sessions">
          <el-tag type="info" size="large">
            已完成 {{ sessions }} 个番茄
          </el-tag>
        </div>
        
        <div class="pomodoro-settings" style="margin-top: 40px">
          <h3>设置</h3>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="工作时间 (分钟)">
                <el-input-number 
                  v-model="workTime" 
                  :min="5" 
                  :max="60" 
                  :step="5"
                  @change="updateWorkTime"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="短休息 (分钟)">
                <el-input-number 
                  v-model="breakTime" 
                  :min="1" 
                  :max="30" 
                  :step="1"
                  @change="updateBreakTime"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="长休息 (分钟)">
                <el-input-number 
                  v-model="longBreakTime" 
                  :min="5" 
                  :max="60" 
                  :step="5"
                  @change="updateLongBreakTime"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        
        <div class="pomodoro-tips" style="margin-top: 30px">
          <el-card shadow="hover">
            <h4>番茄工作法小贴士</h4>
            <ul>
              <li>选择一个任务</li>
              <li>专注工作25分钟</li>
              <li>短暂休息5分钟</li>
              <li>每4个番茄后休息15分钟</li>
              <li>记录完成的番茄数</li>
            </ul>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { usePomodoroStore } from '../stores'

const pomodoroStore = usePomodoroStore()

const workTime = ref(pomodoroStore.workTime)
const breakTime = ref(pomodoroStore.breakTime)
const longBreakTime = ref(pomodoroStore.longBreakTime)

const currentTime = computed(() => pomodoroStore.currentTime)
const isRunning = computed(() => pomodoroStore.isRunning)
const isBreak = computed(() => pomodoroStore.isBreak)
const sessions = computed(() => pomodoroStore.sessions)
const formattedTime = computed(() => pomodoroStore.formattedTime)

const toggleTimer = () => {
  if (isRunning.value) {
    pomodoroStore.pauseTimer()
  } else {
    pomodoroStore.startTimer()
  }
}

const resetTimer = () => {
  pomodoroStore.resetTimer()
}

const updateWorkTime = (value) => {
  pomodoroStore.updateWorkTime(value)
}

const updateBreakTime = (value) => {
  pomodoroStore.updateBreakTime(value)
}

const updateLongBreakTime = (value) => {
  pomodoroStore.updateLongBreakTime(value)
}

onMounted(() => {
  // 监听背景刷新事件
  window.addEventListener('refresh-background', () => {
    const event = new CustomEvent('refresh-background')
    window.dispatchEvent(event)
  })
})

onUnmounted(() => {
  // 组件卸载时停止计时器
  pomodoroStore.pauseTimer()
})
</script>

<style scoped>
.pomodoro-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pomodoro-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pomodoro-timer {
  width: 300px;
  height: 300px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.pomodoro-timer.break {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  box-shadow: 0 10px 30px rgba(79, 172, 254, 0.3);
}

.pomodoro-timer:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 40px rgba(102, 126, 234, 0.4);
}

.pomodoro-timer.break:hover {
  box-shadow: 0 15px 40px rgba(79, 172, 254, 0.4);
}

.pomodoro-time {
  font-size: 48px;
  font-weight: bold;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.pomodoro-buttons {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.pomodoro-sessions {
  margin-top: 20px;
}

.pomodoro-settings {
  width: 100%;
  max-width: 600px;
  margin-top: 40px;
}

.pomodoro-settings h3 {
  margin-bottom: 20px;
  color: #333;
}

.pomodoro-tips {
  width: 100%;
  max-width: 600px;
  margin-top: 30px;
}

.pomodoro-tips h4 {
  margin-bottom: 15px;
  color: #333;
}

.pomodoro-tips ul {
  padding-left: 20px;
  color: #666;
}

.pomodoro-tips li {
  margin-bottom: 8px;
}

@media screen and (max-width: 768px) {
  .pomodoro-timer {
    width: 250px;
    height: 250px;
  }
  
  .pomodoro-time {
    font-size: 36px;
  }
  
  .pomodoro-buttons {
    flex-direction: column;
    gap: 10px;
    width: 100%;
    max-width: 300px;
  }
  
  .pomodoro-buttons .el-button {
    width: 100%;
  }
}

@media screen and (max-width: 480px) {
  .pomodoro-timer {
    width: 200px;
    height: 200px;
  }
  
  .pomodoro-time {
    font-size: 28px;
  }
  
  .el-col {
    margin-bottom: 15px;
  }
}
</style>