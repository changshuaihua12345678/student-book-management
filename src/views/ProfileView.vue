<template>
  <div class="profile-container">
    <el-card>
      <template #header>
        <span>个人资料</span>
      </template>
      <div class="profile-content">
        <div class="profile-avatar">
          <el-avatar :size="120" :src="user.avatar">{{ user.username.charAt(0).toUpperCase() }}</el-avatar>
          <el-button type="primary" plain style="margin-top: 15px">
            <el-icon><i-ep-camera /></el-icon>
            更换头像
          </el-button>
        </div>
        <el-form :model="form" label-width="120px">
          <el-form-item label="用户名">
            <el-input v-model="form.username" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" disabled />
          </el-form-item>
          <el-form-item label="注册时间">
            <el-input v-model="form.createdAt" disabled />
          </el-form-item>
          <el-form-item label="密码">
            <el-button type="info" plain @click="openChangePasswordDialog">
              修改密码
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveProfile">保存修改</el-button>
            <el-button type="danger" @click="handleLogout" style="margin-left: 10px">退出登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    
    <el-card style="margin-top: 20px">
      <template #header>
        <span>账户安全</span>
      </template>
      <div class="security-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="两因素认证">
            <el-switch v-model="twoFactorEnabled" />
          </el-descriptions-item>
          <el-descriptions-item label="登录设备">
            <el-button type="text">查看</el-button>
          </el-descriptions-item>
          <el-descriptions-item label="登录历史">
            <el-button type="text">查看</el-button>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="changePasswordDialogVisible"
      title="修改密码"
      width="400px"
    >
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input type="password" v-model="passwordForm.currentPassword" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="passwordForm.newPassword" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input type="password" v-model="passwordForm.confirmPassword" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changePasswordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="changePassword">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const user = computed(() => userStore.currentUser)

const form = reactive({
  username: user.value?.username || '',
  email: user.value?.email || '',
  createdAt: user.value?.createdAt ? new Date(user.value.createdAt).toLocaleString() : ''
})

const twoFactorEnabled = ref(false)
const changePasswordDialogVisible = ref(false)
const passwordFormRef = ref(null)

const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const saveProfile = () => {
  userStore.updateUserInfo({ username: form.username })
  ElMessage.success('个人资料更新成功')
}

const handleLogout = () => {
  userStore.logout()
  ElMessage.success('已退出登录')
  router.push('/login')
}

const openChangePasswordDialog = () => {
  changePasswordDialogVisible.value = true
}

const changePassword = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    // 模拟密码修改
    setTimeout(() => {
      ElMessage.success('密码修改成功')
      changePasswordDialogVisible.value = false
      passwordForm.currentPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    }, 1000)
  } catch (error) {
    console.error('密码验证失败:', error)
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
.profile-container {
  padding: 20px;
}

.profile-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.security-content {
  padding: 20px 0;
}

@media screen and (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }
  
  .profile-avatar {
    margin-bottom: 20px;
  }
  
  .el-form {
    width: 100%;
  }
}
</style>