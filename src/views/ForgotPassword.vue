<template>
  <div class="forgot-password-container">
    <el-card class="forgot-password-card">
      <div slot="header" class="clearfix">
        <span>忘记密码</span>
      </div>
      <el-form @submit.native.prevent="handleSubmit">
        <el-form-item label="邮箱">
          <el-input v-model="email" placeholder="请输入您的注册邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">发送重置链接</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { authService } from '@/api/auth'

export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
    }
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await authService.forgotPassword({ email: this.email })
        this.$message.success(response)
        this.email = '' // 清空邮箱
      } catch (error) {
        this.$message.error(error.message || '发送重置链接失败')
      }
    },
  },
}
</script>

<style scoped>
.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* 假设导航栏高度为60px */
  background-color: #f0f2f5;
}

.forgot-password-card {
  width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
</style> 