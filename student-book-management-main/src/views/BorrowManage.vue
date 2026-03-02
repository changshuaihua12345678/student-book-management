<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>借阅管理</span>
          <el-button type="primary" @click="openBorrowDialog">
            <el-icon><i-ep-plus /></el-icon>
            借书
          </el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="请输入学号或书名"
          prefix-icon="i-ep-search"
          style="width: 300px"
        />
        <el-select v-model="statusFilter" placeholder="状态" style="margin-left: 10px; width: 120px">
          <el-option label="全部" value="" />
          <el-option label="已借出" value="borrowed" />
          <el-option label="已归还" value="returned" />
        </el-select>
      </div>
      <el-table :data="filteredBorrows" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column label="书名">
          <template #default="scope">
            {{ getBookTitle(scope.row.bookId) }}
          </template>
        </el-table-column>
        <el-table-column label="学生">
          <template #default="scope">
            {{ getStudentName(scope.row.studentId) }}
          </template>
        </el-table-column>
        <el-table-column prop="borrowDate" label="借书日期" />
        <el-table-column prop="returnDate" label="还书日期" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'borrowed' ? 'warning' : 'success'">
              {{ scope.row.status === 'borrowed' ? '已借出' : '已归还' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button 
              v-if="scope.row.status === 'borrowed'" 
              type="success" 
              size="small" 
              @click="returnBook(scope.row.id)"
            >
              还书
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
          :total="filteredBorrows.length"
        />
      </div>
    </el-card>

    <!-- 借书对话框 -->
    <el-dialog
      v-model="borrowDialogVisible"
      title="借书"
      width="500px"
    >
      <el-form :model="borrowForm" label-width="100px">
        <el-form-item label="图书">
          <el-select v-model="borrowForm.bookId" placeholder="请选择图书">
            <el-option 
              v-for="book in availableBooks" 
              :key="book.id" 
              :label="book.title" 
              :value="book.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学生">
          <el-select v-model="borrowForm.studentId" placeholder="请选择学生">
            <el-option 
              v-for="student in students" 
              :key="student.studentId" 
              :label="student.name" 
              :value="student.studentId" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="借书日期">
          <el-date-picker
            v-model="borrowForm.borrowDate"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="borrowDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBorrow">确认借书</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBorrowStore, useBookStore, useStudentStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const borrowStore = useBorrowStore()
const bookStore = useBookStore()
const studentStore = useStudentStore()

const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const borrowDialogVisible = ref(false)

const borrowForm = ref({
  bookId: '',
  studentId: '',
  borrowDate: new Date().toISOString().split('T')[0]
})

const availableBooks = computed(() => {
  return bookStore.books.filter(book => book.stock > 0)
})

const students = computed(() => {
  return studentStore.students
})

const filteredBorrows = computed(() => {
  let result = borrowStore.borrows
  
  if (statusFilter.value) {
    result = result.filter(borrow => borrow.status === statusFilter.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(borrow => {
      const bookTitle = getBookTitle(borrow.bookId).toLowerCase()
      const studentName = getStudentName(borrow.studentId).toLowerCase()
      return bookTitle.includes(query) || studentName.includes(query) || borrow.studentId.includes(query)
    })
  }
  
  return result
})

const getBookTitle = (bookId) => {
  const book = bookStore.books.find(b => b.id === bookId)
  return book ? book.title : '未知图书'
}

const getStudentName = (studentId) => {
  const student = studentStore.students.find(s => s.studentId === studentId)
  return student ? student.name : '未知学生'
}

const openBorrowDialog = () => {
  borrowForm.value = {
    bookId: '',
    studentId: '',
    borrowDate: new Date().toISOString().split('T')[0]
  }
  borrowDialogVisible.value = true
}

const saveBorrow = () => {
  if (!borrowForm.value.bookId || !borrowForm.value.studentId) {
    ElMessage.warning('请选择图书和学生')
    return
  }
  
  // 检查图书库存
  const book = bookStore.books.find(b => b.id === borrowForm.value.bookId)
  if (!book || book.stock <= 0) {
    ElMessage.warning('图书库存不足')
    return
  }
  
  // 执行借书操作
  borrowStore.addBorrow(borrowForm.value)
  bookStore.borrowBook(borrowForm.value.bookId)
  studentStore.incrementBorrowedBooks(borrowForm.value.studentId)
  
  ElMessage.success('借书成功')
  borrowDialogVisible.value = false
}

const returnBook = (id) => {
  ElMessageBox.confirm('确定要归还这本书吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const borrow = borrowStore.borrows.find(b => b.id === id)
    if (borrow) {
      borrowStore.returnBook(id)
      bookStore.returnBook(borrow.bookId)
      studentStore.decrementBorrowedBooks(borrow.studentId)
      ElMessage.success('还书成功')
    }
  }).catch(() => {
    // 取消还书
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
  display: flex;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>