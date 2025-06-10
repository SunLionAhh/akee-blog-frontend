<template>
  <div class="reset-password-container">
    <el-card class="reset-password-card">
      <div slot="header" class="clearfix">
        <span>重置密码</span>
      </div>
      <el-form @submit.native.prevent="handleSubmit">
        <el-form-item label="新密码">
          <el-input type="password" v-model="newPassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input type="password" v-model="confirmPassword" placeholder="请再次输入新密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">重置密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { authService } from '@/api/auth'

export default {
  name: 'ResetPassword',
  data() {
    return {
      token: '',
      newPassword: '',
      confirmPassword: '',
    }
  },
  created() {
    this.token = this.$route.query.token || ''
    if (!this.token) {
      this.$message.error('缺少密码重置令牌')
      this.$router.push('/') // 或者跳转到忘记密码页面
    }
  },
  methods: {
    async handleSubmit() {
      if (this.newPassword !== this.confirmPassword) {
        this.$message.error('两次输入的密码不一致')
        return
      }
      if (!this.newPassword) {
        this.$message.error('新密码不能为空')
        return
      }

      try {
        const response = await authService.resetPassword({
          token: this.token,
          newPassword: this.newPassword,
        })
        this.$message.success(response.data)
        this.$router.push('/login') // 重置成功后跳转到登录页
      } catch (error) {
        this.$message.error(error.response.data.message || '重置密码失败')
      }
    },
  },
}
</script>

<style scoped>
.reset-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px); /* 假设导航栏高度为60px */
  background-color: #f0f2f5;
}

.reset-password-card {
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