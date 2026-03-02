<template>
  <div class="todo-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>待办事项</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><i-ep-plus /></el-icon>
            添加待办
          </el-button>
        </div>
      </template>
      
      <div class="todo-filters">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-radio-group v-model="filter" size="large">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="pending">未完成</el-radio-button>
              <el-radio-button label="completed">已完成</el-radio-button>
            </el-radio-group>
          </el-col>
          <el-col :span="8">
            <el-select v-model="selectedCategory" placeholder="按分类筛选" style="width: 100%">
              <el-option label="全部分类" value="" />
              <el-option v-for="category in categories" :key="category" :label="category" :value="category" />
            </el-select>
          </el-col>
          <el-col :span="8">
            <el-input
              v-model="searchQuery"
              placeholder="搜索待办事项"
              prefix-icon="i-ep-search"
              style="width: 100%"
            />
          </el-col>
        </el-row>
        <div class="todo-tags" style="margin-top: 15px">
          <el-tag
            v-for="tag in tags"
            :key="tag"
            :class="['tag-filter', { active: selectedTags.includes(tag) }]"
            @click="toggleTag(tag)"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
      
      <div class="todo-list">
        <el-empty v-if="filteredTodos.length === 0" description="暂无待办事项" />
        <el-card 
          v-for="todo in filteredTodos" 
          :key="todo.id" 
          class="todo-item"
          :class="{ 'completed': todo.completed }"
        >
          <div class="todo-content">
            <el-checkbox v-model="todo.completed" @change="toggleTodo(todo.id)">
              <div class="todo-title">{{ todo.title }}</div>
              <div class="todo-description" v-if="todo.description">{{ todo.description }}</div>
            </el-checkbox>
            <div class="todo-meta">
              <el-tag :type="getPriorityType(todo.priority)" size="small" v-if="todo.priority">
                {{ getPriorityText(todo.priority) }}
              </el-tag>
              <el-tag size="small" type="info" v-if="todo.category">
                <el-icon><i-ep-folder /></el-icon>
                {{ todo.category }}
              </el-tag>
              <el-tag size="small" v-if="todo.dueDate">
                <el-icon><i-ep-calendar /></el-icon>
                {{ todo.dueDate }}
              </el-tag>
            </div>
            <div class="todo-tags" v-if="todo.tags && todo.tags.length > 0">
              <el-tag 
                v-for="tag in todo.tags" 
                :key="tag" 
                size="small" 
                class="todo-tag"
                type="success"
              >
                {{ tag }}
              </el-tag>
            </div>
          </div>
          <div class="todo-actions">
            <el-button type="primary" size="small" @click="openEditDialog(todo)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteTodo(todo.id)">
              删除
            </el-button>
          </div>
        </el-card>
      </div>
      
      <div class="todo-stats" style="margin-top: 20px">
        <el-tag type="info">
          总计: {{ todos.length }} 项
        </el-tag>
        <el-tag type="warning" style="margin-left: 10px">
          未完成: {{ pendingTodos.length }} 项
        </el-tag>
        <el-tag type="success" style="margin-left: 10px">
          已完成: {{ completedTodos.length }} 项
        </el-tag>
      </div>
    </el-card>
    
    <!-- 添加/编辑待办对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="标题" required>
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="form.description" rows="3" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option v-for="category in categories" :key="category" :label="category" :value="category" />
            <el-option label="新建分类" value="new" />
          </el-select>
          <el-input
            v-if="form.category === 'new'"
            v-model="newCategory"
            placeholder="请输入新分类名称"
            style="margin-top: 10px"
          />
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="form.tags"
            multiple
            placeholder="请选择标签"
            style="width: 100%"
          >
            <el-option v-for="tag in tags" :key="tag" :label="tag" :value="tag" />
          </el-select>
          <el-input
            v-model="newTag"
            placeholder="输入新标签并按回车添加"
            @keyup.enter="addNewTag"
            style="margin-top: 10px"
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="form.priority" placeholder="请选择优先级">
            <el-option label="高优先级" value="high" />
            <el-option label="中优先级" value="medium" />
            <el-option label="低优先级" value="low" />
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="form.dueDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveTodo">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useTodoStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const todoStore = useTodoStore()

const filter = ref('all')
const searchQuery = ref('')
const dialogVisible = ref(false)
const dialogTitle = ref('添加待办')
const form = ref({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  category: '其他',
  tags: []
})
const editingTodoId = ref(null)
const selectedCategory = ref('')
const selectedTags = ref([])
const newCategory = ref('')
const newTag = ref('')

const todos = computed(() => todoStore.todos)
const pendingTodos = computed(() => todoStore.pendingTodos)
const completedTodos = computed(() => todoStore.completedTodos)
const categories = computed(() => todoStore.categories)
const tags = computed(() => todoStore.tags)

const filteredTodos = computed(() => {
  let result = todos.value
  
  // 按状态筛选
  if (filter.value === 'pending') {
    result = result.filter(todo => !todo.completed)
  } else if (filter.value === 'completed') {
    result = result.filter(todo => todo.completed)
  }
  
  // 按分类筛选
  if (selectedCategory.value) {
    result = result.filter(todo => todo.category === selectedCategory.value)
  }
  
  // 按标签筛选
  if (selectedTags.value.length > 0) {
    result = result.filter(todo => {
      return selectedTags.value.every(tag => todo.tags && todo.tags.includes(tag))
    })
  }
  
  // 按搜索词筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(todo => 
      todo.title.toLowerCase().includes(query) || 
      (todo.description && todo.description.toLowerCase().includes(query)) ||
      (todo.category && todo.category.toLowerCase().includes(query)) ||
      (todo.tags && todo.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }
  
  // 按优先级和截止日期排序
  return result.sort((a, b) => {
    // 先按完成状态排序
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // 再按优先级排序
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    // 最后按截止日期排序
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    return 0
  })
})

const openAddDialog = () => {
  dialogTitle.value = '添加待办'
  editingTodoId.value = null
  form.value = {
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: '其他',
    tags: []
  }
  newCategory.value = ''
  newTag.value = ''
  dialogVisible.value = true
}

const openEditDialog = (todo) => {
  dialogTitle.value = '编辑待办'
  editingTodoId.value = todo.id
  form.value = { ...todo }
  if (!form.value.category) form.value.category = '其他'
  if (!form.value.tags) form.value.tags = []
  newCategory.value = ''
  newTag.value = ''
  dialogVisible.value = true
}

const saveTodo = () => {
  if (!form.value.title) {
    ElMessage.warning('请填写标题')
    return
  }
  
  // 处理新建分类
  if (form.value.category === 'new' && newCategory.value) {
    todoStore.addCategory(newCategory.value)
    form.value.category = newCategory.value
  }
  
  if (editingTodoId.value) {
    todoStore.updateTodo(form.value)
    ElMessage.success('待办更新成功')
  } else {
    todoStore.addTodo(form.value)
    ElMessage.success('待办添加成功')
  }
  dialogVisible.value = false
}

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const addNewTag = () => {
  if (newTag.value && !tags.value.includes(newTag.value)) {
    todoStore.addTag(newTag.value)
    if (form.value.tags) {
      form.value.tags.push(newTag.value)
    } else {
      form.value.tags = [newTag.value]
    }
    newTag.value = ''
  }
}

const toggleTodo = (id) => {
  todoStore.toggleTodo(id)
}

const deleteTodo = (id) => {
  ElMessageBox.confirm('确定要删除这个待办事项吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    todoStore.deleteTodo(id)
    ElMessage.success('待办删除成功')
  }).catch(() => {
    // 取消删除
  })
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

onMounted(() => {
  // 监听背景刷新事件
  window.addEventListener('refresh-background', () => {
    const event = new CustomEvent('refresh-background')
    window.dispatchEvent(event)
  })
})
</script>

<style scoped>
.todo-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.todo-filters {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.todo-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.todo-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateX(5px);
}

.todo-item.completed {
  opacity: 0.7;
  background-color: rgba(240, 249, 235, 0.8);
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 5px;
}

.todo-description {
  font-size: 14px;
  color: #666;
  margin-top: 5px;
}

.todo-meta {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.todo-actions {
  display: flex;
  gap: 10px;
}

.todo-stats {
  display: flex;
  align-items: center;
  justify-content: center;
}

.tag-filter {
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.tag-filter:hover {
  transform: translateY(-2px);
}

.tag-filter.active {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
}

.todo-tags {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.todo-tag {
  font-size: 12px;
  padding: 2px 8px;
}

@media screen and (max-width: 768px) {
  .todo-filters {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .todo-filters .el-col {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .todo-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .todo-actions {
    align-self: flex-end;
  }
}

@media screen and (max-width: 480px) {
  .todo-filters .el-radio-group {
    width: 100%;
  }
  
  .todo-filters .el-radio-button {
    flex: 1;
  }
}
</style>