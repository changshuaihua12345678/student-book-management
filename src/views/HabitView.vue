<template>
  <div class="habit-container">
    <el-card shadow="hover">
      <template #header>
        <div class="card-header">
          <span>习惯追踪</span>
          <el-button type="primary" @click="showAddDialog = true">
            <el-icon><i-ep-plus /></el-icon>
            添加习惯
          </el-button>
        </div>
      </template>
      
      <!-- 统计概览 -->
      <div class="habit-stats" style="margin-bottom: 30px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-number">{{ habits.length }}</div>
              <div class="stat-label">总习惯数</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-number">{{ overallCompletionRate }}%</div>
              <div class="stat-label">本周完成率</div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="stat-card">
              <div class="stat-number">{{ maxStreak }}</div>
              <div class="stat-label">最长连续天数</div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 完成趋势 -->
      <div class="habit-trend" style="margin-bottom: 30px">
        <el-card shadow="hover">
          <template #header>
            <span>7天完成趋势</span>
          </template>
          <div class="trend-chart" style="height: 300px">
            <el-empty v-if="completionData.length === 0" description="暂无数据" />
            <div v-else>
              <div class="chart-container">
                <div 
                  v-for="(item, index) in completionData" 
                  :key="index"
                  class="chart-bar"
                >
                  <div class="bar-wrapper">
                    <div 
                      class="bar"
                      :style="{ height: `${(item.completed / item.total) * 100}%` }"
                    ></div>
                  </div>
                  <div class="bar-label">{{ formatDate(item.date) }}</div>
                </div>
              </div>
              <div class="chart-legend">
                <span class="legend-item">
                  <span class="legend-color"></span>
                  <span>完成数 / 总数</span>
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 习惯列表 -->
      <div class="habit-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="全部习惯" name="all">
            <div class="habit-list">
              <el-empty v-if="habits.length === 0" description="暂无习惯" />
              <el-card 
                v-for="habit in habitsByStreak" 
                :key="habit.id" 
                shadow="hover" 
                class="habit-card"
              >
                <div class="habit-item">
                  <div class="habit-info">
                    <div class="habit-header">
                      <h3 class="habit-name">{{ habit.name }}</h3>
                      <el-tag :type="getFrequencyType(habit.frequency)" size="small">
                        {{ getFrequencyText(habit.frequency) }}
                      </el-tag>
                    </div>
                    <p class="habit-description" v-if="habit.description">{{ habit.description }}</p>
                    <div class="habit-meta">
                      <span class="habit-streak">
                        <el-icon><i-ep-data-line /></el-icon>
                        连续 {{ habit.streak }} 天
                      </span>
                      <span class="habit-completion">
                        <el-icon><i-ep-check /></el-icon>
                        完成率 {{ habitCompletionRate(habit.id) }}%
                      </span>
                    </div>
                  </div>
                  <div class="habit-actions">
                    <el-checkbox 
                      v-model="completedHabits[habit.id]" 
                      @change="toggleHabit(habit.id)"
                    >
                      {{ isHabitCompleted(habit.id) ? '已完成' : '未完成' }}
                    </el-checkbox>
                    <el-button type="primary" size="small" @click="editHabit(habit)">
                      <el-icon><i-ep-edit /></el-icon>
                      编辑
                    </el-button>
                    <el-button type="danger" size="small" @click="deleteHabit(habit.id)">
                      <el-icon><i-ep-delete /></el-icon>
                      删除
                    </el-button>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="每日习惯" name="daily">
            <div class="habit-list">
              <el-empty v-if="dailyHabits.length === 0" description="暂无每日习惯" />
              <el-card 
                v-for="habit in dailyHabits" 
                :key="habit.id" 
                shadow="hover" 
                class="habit-card"
              >
                <div class="habit-item">
                  <div class="habit-info">
                    <h3 class="habit-name">{{ habit.name }}</h3>
                    <p class="habit-description" v-if="habit.description">{{ habit.description }}</p>
                    <div class="habit-meta">
                      <span class="habit-streak">
                        <el-icon><i-ep-data-line /></el-icon>
                        连续 {{ habit.streak }} 天
                      </span>
                    </div>
                  </div>
                  <div class="habit-actions">
                    <el-checkbox 
                      v-model="completedHabits[habit.id]" 
                      @change="toggleHabit(habit.id)"
                    >
                      {{ isHabitCompleted(habit.id) ? '已完成' : '未完成' }}
                    </el-checkbox>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
          <el-tab-pane label="每周习惯" name="weekly">
            <div class="habit-list">
              <el-empty v-if="weeklyHabits.length === 0" description="暂无每周习惯" />
              <el-card 
                v-for="habit in weeklyHabits" 
                :key="habit.id" 
                shadow="hover" 
                class="habit-card"
              >
                <div class="habit-item">
                  <div class="habit-info">
                    <h3 class="habit-name">{{ habit.name }}</h3>
                    <p class="habit-description" v-if="habit.description">{{ habit.description }}</p>
                    <div class="habit-meta">
                      <span class="habit-streak">
                        <el-icon><i-ep-data-line /></el-icon>
                        连续 {{ habit.streak }} 周
                      </span>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 添加/编辑习惯对话框 -->
      <el-dialog
        v-model="showAddDialog"
        :title="editingHabit ? '编辑习惯' : '添加习惯'"
        width="500px"
      >
        <el-form :model="form" label-width="100px">
          <el-form-item label="习惯名称" required>
            <el-input v-model="form.name" placeholder="请输入习惯名称" />
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" v-model="form.description" rows="3" placeholder="请输入习惯描述" />
          </el-form-item>
          <el-form-item label="频率" required>
            <el-select v-model="form.frequency" placeholder="请选择频率">
              <el-option label="每日" value="daily" />
              <el-option label="每周" value="weekly" />
              <el-option label="每月" value="monthly" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="showAddDialog = false">取消</el-button>
            <el-button type="primary" @click="saveHabit">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const habitStore = useHabitStore()

const showAddDialog = ref(false)
const editingHabit = ref(null)
const activeTab = ref('all')
const form = ref({
  name: '',
  description: '',
  frequency: 'daily'
})
const completedHabits = ref({})

const habits = computed(() => habitStore.habits)
const dailyHabits = computed(() => habitStore.dailyHabits)
const weeklyHabits = computed(() => habitStore.weeklyHabits)
const habitsByStreak = computed(() => habitStore.habitsByStreak)
const overallCompletionRate = computed(() => habitStore.overallCompletionRate())
const completionData = computed(() => habitStore.completionData())
const maxStreak = computed(() => {
  return Math.max(...habits.value.map(h => h.streak), 0)
})

const habitCompletionRate = (habitId) => {
  return habitStore.habitCompletionRate(habitId)
}

const isHabitCompleted = (habitId) => {
  return habitStore.isHabitCompleted(habitId)
}

const toggleHabit = (habitId) => {
  if (isHabitCompleted(habitId)) {
    habitStore.uncompleteHabit(habitId)
  } else {
    habitStore.completeHabit(habitId)
  }
  // 更新本地状态
  completedHabits.value[habitId] = isHabitCompleted(habitId)
}

const openAddDialog = () => {
  editingHabit.value = null
  form.value = {
    name: '',
    description: '',
    frequency: 'daily'
  }
  showAddDialog.value = true
}

const editHabit = (habit) => {
  editingHabit.value = habit
  form.value = { ...habit }
  showAddDialog.value = true
}

const saveHabit = () => {
  if (!form.value.name) {
    ElMessage.warning('请填写习惯名称')
    return
  }
  
  if (editingHabit.value) {
    habitStore.updateHabit(form.value)
    ElMessage.success('习惯更新成功')
  } else {
    habitStore.addHabit(form.value)
    ElMessage.success('习惯添加成功')
  }
  showAddDialog.value = false
}

const deleteHabit = (id) => {
  ElMessageBox.confirm('确定要删除这个习惯吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    habitStore.deleteHabit(id)
    ElMessage.success('习惯删除成功')
  }).catch(() => {
    // 取消删除
  })
}

const getFrequencyType = (frequency) => {
  switch (frequency) {
    case 'daily': return 'primary'
    case 'weekly': return 'success'
    case 'monthly': return 'warning'
    default: return 'info'
  }
}

const getFrequencyText = (frequency) => {
  switch (frequency) {
    case 'daily': return '每日'
    case 'weekly': return '每周'
    case 'monthly': return '每月'
    default: return '自定义'
  }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.getMonth() + 1 + '/' + date.getDate()
}

onMounted(() => {
  // 初始化完成状态
  habits.value.forEach(habit => {
    completedHabits.value[habit.id] = isHabitCompleted(habit.id)
  })
  
  // 监听背景刷新事件
  window.addEventListener('refresh-background', () => {
    const event = new CustomEvent('refresh-background')
    window.dispatchEvent(event)
  })
})
</script>

<style scoped>
.habit-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.habit-stats {
  margin-bottom: 30px;
}

.stat-card {
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.habit-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}

.habit-card {
  transition: all 0.3s ease;
}

.habit-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateX(5px);
}

.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.habit-info {
  flex: 1;
}

.habit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.habit-name {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.habit-description {
  font-size: 14px;
  color: #666;
  margin: 10px 0;
}

.habit-meta {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}

.habit-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-end;
}

.chart-container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 250px;
  margin: 20px 0;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.bar-wrapper {
  width: 40px;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 10px;
  position: relative;
}

.bar {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  transition: height 0.5s ease;
  border-radius: 4px;
}

.bar-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.chart-legend {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
}

@media screen and (max-width: 768px) {
  .habit-stats .el-col {
    margin-bottom: 15px;
  }
  
  .habit-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .habit-actions {
    align-self: flex-end;
    flex-direction: row;
  }
  
  .chart-container {
    height: 200px;
  }
  
  .bar-wrapper {
    width: 30px;
    height: 150px;
  }
}
</style>