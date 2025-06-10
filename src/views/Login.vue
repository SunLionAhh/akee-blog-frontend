<template>
  <div class="login-container">
    <el-card class="login-card">
      <div slot="header" class="card-header">
        <h2>登录</h2>
      </div>
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            @keyup.enter.native="handleLogin">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input 
            type="password" 
            v-model="loginForm.password" 
            placeholder="请输入密码"
            show-password
            @keyup.enter.native="handleLogin">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
          <el-button @click="$router.push('/register')">注册账号</el-button>
          <router-link to="/forgot-password" class="forgot-password-link">忘记密码？</router-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { authService } from '@/api/auth'

export default {
  name: 'LoginPage',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async handleLogin() {
      this.$refs.loginForm.validate(async (valid) => {
        if (valid) {
          try {
            const response = await authService.login(
              this.loginForm.username,
              this.loginForm.password
            )
            // 存储用户信息
            const userInfo = {
              username: response.username,
              roles: response.roles
            }
            localStorage.setItem('user', JSON.stringify(userInfo))
            this.$message.success('登录成功')
            this.$router.push('/')
          } catch (error) {
            this.$message.error(error.response?.data?.message || '登录失败')
          }
        }
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.forgot-password-link {
  margin-left: 10px;
  color: #409EFF;
  text-decoration: none;
}

.forgot-password-link:hover {
  text-decoration: underline;
}
</style> 