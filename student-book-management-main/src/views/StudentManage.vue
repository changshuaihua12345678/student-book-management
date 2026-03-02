<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>学生管理</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><i-ep-plus /></el-icon>
            添加学生
          </el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="请输入学生姓名或学号"
          prefix-icon="i-ep-search"
          style="width: 300px"
        />
      </div>
      <el-table :data="filteredStudents" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="studentId" label="学号" />
        <el-table-column prop="major" label="专业" />
        <el-table-column prop="grade" label="年级" />
        <el-table-column prop="borrowedBooks" label="已借图书" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteStudent(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredStudents.length"
        />
      </div>
    </el-card>

    <!-- 添加/编辑学生对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="form.studentId" />
        </el-form-item>
        <el-form-item label="专业">
          <el-input v-model="form.major" />
        </el-form-item>
        <el-form-item label="年级">
          <el-select v-model="form.grade" placeholder="请选择年级">
            <el-option label="大一" value="大一" />
            <el-option label="大二" value="大二" />
            <el-option label="大三" value="大三" />
            <el-option label="大四" value="大四" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveStudent">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useStudentStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const studentStore = useStudentStore()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogTitle = ref('添加学生')
const form = ref({
  name: '',
  studentId: '',
  major: '',
  grade: ''
})
const editingStudentId = ref(null)

const filteredStudents = computed(() => {
  let result = studentStore.students
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(student => 
      student.name.toLowerCase().includes(query) || 
      student.studentId.includes(query)
    )
  }
  return result
})

const openAddDialog = () => {
  dialogTitle.value = '添加学生'
  editingStudentId.value = null
  form.value = {
    name: '',
    studentId: '',
    major: '',
    grade: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (student) => {
  dialogTitle.value = '编辑学生'
  editingStudentId.value = student.id
  form.value = { ...student }
  dialogVisible.value = true
}

const saveStudent = () => {
  if (!form.value.name || !form.value.studentId || !form.value.major) {
    ElMessage.warning('请填写必填字段')
    return
  }
  
  if (editingStudentId.value) {
    studentStore.updateStudent(form.value)
    ElMessage.success('学生信息更新成功')
  } else {
    studentStore.addStudent(form.value)
    ElMessage.success('学生添加成功')
  }
  dialogVisible.value = false
}

const deleteStudent = (id) => {
  ElMessageBox.confirm('确定要删除这个学生吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    studentStore.deleteStudent(id)
    ElMessage.success('学生删除成功')
  }).catch(() => {
    // 取消删除
  })
}
</script>

<style scoped>

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>