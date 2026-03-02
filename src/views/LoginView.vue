<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>好习惯养成系统</h2>
        <p>登录以开始您的习惯养成之旅</p>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" label-position="top">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" prefix-icon="i-ep-user" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" prefix-icon="i-ep-lock" show-password />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="form.remember">记住我</el-checkbox>
          <el-link type="primary" :underline="false" style="float: right">忘记密码？</el-link>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin" :loading="loading">
            登录
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="info" class="register-button" @click="handleRegister">
            注册新账号
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟登录请求
    setTimeout(() => {
      // 验证成功，设置用户信息
      userStore.login({
        username: form.username,
        avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait%2C%20minimalist%20style&image_size=square'
      })
      
      // 记住密码
      if (form.remember) {
        localStorage.setItem('username', form.username)
      } else {
        localStorage.removeItem('username')
      }
      
      ElMessage.success('登录成功')
      router.push('/')
      loading.value = false
    }, 1000)
  } catch (error) {
    console.error('登录验证失败:', error)
  }
}

const handleRegister = () => {
  // 这里可以跳转到注册页面，暂时使用登录页面
  ElMessage.info('注册功能开发中')
}

// 从本地存储加载用户名
const savedUsername = localStorage.getItem('username')
if (savedUsername) {
  form.username = savedUsername
  form.remember = true
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  padding: 30px;
  transition: all 0.3s ease;
}

.login-card:hover {
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
  transform: translateY(-5px);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
}

.register-button {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  margin-top: 15px;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  height: 48px;
  border-radius: 8px;
}

.el-input__prefix {
  font-size: 18px;
}

@media screen and (max-width: 480px) {
  .login-card {
    padding: 20px;
  }
  
  .login-header h2 {
    font-size: 20px;
  }
  
  .login-button,
  .register-button {
    height: 44px;
    font-size: 14px;
  }
}
</style>