<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>图书管理</span>
          <el-button type="primary" @click="openAddDialog">
            <el-icon><i-ep-plus /></el-icon>
            添加图书
          </el-button>
        </div>
      </template>
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="请输入图书名称或作者"
          prefix-icon="i-ep-search"
          style="width: 300px"
        />
      </div>
      <el-table :data="filteredBooks" style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="书名" />
        <el-table-column prop="author" label="作者" />
        <el-table-column prop="isbn" label="ISBN" />
        <el-table-column prop="category" label="分类" />
        <el-table-column prop="stock" label="库存" />
        <el-table-column prop="borrowed" label="已借出" />
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="openEditDialog(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteBook(scope.row.id)">
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
          :total="filteredBooks.length"
        />
      </div>
    </el-card>

    <!-- 添加/编辑图书对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
    >
      <el-form :model="form" label-width="100px">
        <el-form-item label="书名">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="作者">
          <el-input v-model="form.author" />
        </el-form-item>
        <el-form-item label="ISBN">
          <el-input v-model="form.isbn" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="请选择分类">
            <el-option label="前端开发" value="前端开发" />
            <el-option label="后端开发" value="后端开发" />
            <el-option label="移动开发" value="移动开发" />
            <el-option label="人工智能" value="人工智能" />
            <el-option label="数据科学" value="数据科学" />
          </el-select>
        </el-form-item>
        <el-form-item label="库存">
          <el-input-number v-model="form.stock" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveBook">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBookStore } from '../stores'
import { ElMessage, ElMessageBox } from 'element-plus'

const bookStore = useBookStore()
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const dialogVisible = ref(false)
const dialogTitle = ref('添加图书')
const form = ref({
  title: '',
  author: '',
  isbn: '',
  category: '',
  stock: 0
})
const editingBookId = ref(null)

const filteredBooks = computed(() => {
  let result = bookStore.books
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(book => 
      book.title.toLowerCase().includes(query) || 
      book.author.toLowerCase().includes(query)
    )
  }
  return result
})

const openAddDialog = () => {
  dialogTitle.value = '添加图书'
  editingBookId.value = null
  form.value = {
    title: '',
    author: '',
    isbn: '',
    category: '',
    stock: 0
  }
  dialogVisible.value = true
}

const openEditDialog = (book) => {
  dialogTitle.value = '编辑图书'
  editingBookId.value = book.id
  form.value = { ...book }
  dialogVisible.value = true
}

const saveBook = () => {
  if (!form.value.title || !form.value.author || !form.value.isbn) {
    ElMessage.warning('请填写必填字段')
    return
  }
  
  if (editingBookId.value) {
    bookStore.updateBook(form.value)
    ElMessage.success('图书更新成功')
  } else {
    bookStore.addBook(form.value)
    ElMessage.success('图书添加成功')
  }
  dialogVisible.value = false
}

const deleteBook = (id) => {
  ElMessageBox.confirm('确定要删除这本书吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    bookStore.deleteBook(id)
    ElMessage.success('图书删除成功')
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