<template>
  <div class="habits-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>习惯追踪</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><i-ep-plus /></el-icon>
            添加习惯
          </el-button>
        </div>
      </template>
      
      <div class="habit-filters">
        <el-radio-group v-model="filter" size="large">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="daily">每日</el-radio-button>
          <el-radio-button label="weekly">每周</el-radio-button>
          <el-radio-button label="monthly">每月</el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="habit-list">
        <el-empty v-if="filteredHabits.length === 0" description="暂无习惯" />
        <el-card 
          v-for="habit in filteredHabits" 
          :key="habit.id" 
          class="habit-item"
        >
          <div class="habit-content">
            <div class="habit-header">
              <el-checkbox 
                v-model="habit.completed" 
                @change="handleHabitChange(habit.id, $event)"
              >
                <span class="habit-name">{{ habit.name }}</span>
              </el-checkbox>
              <el-tag :type="getFrequencyType(habit.frequency)" size="small">
                {{ getFrequencyText(habit.frequency) }}
              </el-tag>
            </div>
            <div class="habit-description" v-if="habit.description">
              {{ habit.description }}
            </div>
            <div class="habit-streak">
              <el-icon><i-ep-data-line /></el-icon>
              <span>连续 {{ habit.streak }} 天</span>
            </div>
          </div>
          <div class="habit-actions">
            <el-button type="primary" size="small" @click="openEditDialog(habit)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteHabit(habit.id)">
              删除
            </el-button>
          </div>
        </el-card>
      </div>
      
      <div class="habit-calendar" style="margin-top: 40px">
        <el-card>
          <template #header>
            <span>习惯日历</span>
          </template>
          <el-calendar v-model="currentDate">
            <template #dateCell="{ date, data }">
              <div class="calendar-cell" :class="{ 'has-habits': hasCompletedHabits(date) }">
                {{ data.day }}
              </div>
            </template>
          </el-calendar>
        </el-card>
      </div>
    </el-card>
    
    <!-- 添加/编辑习惯对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="习惯名称" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description" rows="3" />
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
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveHabit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useHabitStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const habitStore = useHabitStore()

const filter = ref('all')
const dialogVisible = ref(false)
const dialogTitle = ref('添加习惯')
const currentDate = ref(new Date())
const form = ref({
  name: '',
  description: '',
  frequency: 'daily'
})
const editingHabitId = ref(null)

const habits = computed(() => habitStore.habits)
const dailyHabits = computed(() => habitStore.dailyHabits)
const weeklyHabits = computed(() => habitStore.weeklyHabits)
const monthlyHabits = computed(() => habitStore.monthlyHabits)

const filteredHabits = computed(() => {
  let result = habits.value
  
  // 按频率筛选
  if (filter.value === 'daily') {
    result = dailyHabits.value
  } else if (filter.value === 'weekly') {
    result = weeklyHabits.value
  } else if (filter.value === 'monthly') {
    result = monthlyHabits.value
  }
  
  // 按连续天数排序
  return result.sort((a, b) => b.streak - a.streak)
})

const openAddDialog = () => {
  dialogTitle.value = '添加习惯'
  editingHabitId.value = null
  form.value = {
    name: '',
    description: '',
    frequency: 'daily'
  }
  dialogVisible.value = true
}

const openEditDialog = (habit) => {
  dialogTitle.value = '编辑习惯'
  editingHabitId.value = habit.id
  form.value = { ...habit }
  dialogVisible.value = true
}

const saveHabit = () => {
  if (!form.value.name) {
    ElMessage.warning('请填写习惯名称')
    return
  }
  
  if (editingHabitId.value) {
    habitStore.updateHabit(form.value)
    ElMessage.success('习惯更新成功')
  } else {
    habitStore.addHabit(form.value)
    ElMessage.success('习惯添加成功')
  }
  dialogVisible.value = false
}

const handleHabitChange = (habitId, completed) => {
  if (completed) {
    habitStore.completeHabit(habitId)
    ElMessage.success('习惯完成！')
  } else {
    habitStore.uncompleteHabit(habitId)
    ElMessage.info('已取消完成')
  }
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
    default: return '其他'
  }
}

const hasCompletedHabits = (date) => {
  const dateStr = date.toISOString().split('T')[0]
  return habitStore.completions[dateStr]?.length > 0
}

onMounted(() => {
  // 监听背景刷新事件
  window.addEventListener('refresh-background', () => {
    const event = new CustomEvent('refresh-background')
    window.dispatchEvent(event)
  })
})
</script>

<style scoped>
.habits-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.habit-filters {
  margin-bottom: 20px;
}

.habit-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.habit-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.habit-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.habit-content {
  flex: 1;
}

.habit-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.habit-name {
  font-size: 16px;
  font-weight: 500;
}

.habit-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
}

.habit-streak {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #67c23a;
  font-weight: 500;
}

.habit-actions {
  display: flex;
  gap: 10px;
}

.calendar-cell {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.calendar-cell.has-habits {
  background-color: #67c23a;
  color: white;
}

.calendar-cell:hover {
  transform: scale(1.1);
}

@media screen and (max-width: 768px) {
  .habit-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .habit-actions {
    align-self: flex-end;
  }
}
</style>