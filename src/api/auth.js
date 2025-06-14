import api from './index'

export const authService = {
  // 登录
  async login(username, password) {
    const response = await api.post(`/auth/login`, {
      username,
      password
    })
    if (response.token) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('userInfo', JSON.stringify({
        id: response.id,
        username: response.username,
        roles: response.roles
      }))
    }
    return response
  },

  // 注册
  async register(username, email, password, verificationCode) {
    const response = await api.post(`/auth/register`, {
      username,
      email,
      password,
      verificationCode
    })
    return response
  },

  // 发送验证码
  async sendVerificationCode(email) {
    const response = await api.post(`/auth/send-verification-code?email=${email}`)
    return response
  },

  // 忘记密码
  async forgotPassword(data) {
    const response = await api.post(`/auth/forgot-password`, data)
    return response
  },

  // 重置密码
  async resetPassword(data) {
    const response = await api.post(`/auth/reset-password`, data)
    return response
  },

  // 登出
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  },

  // 获取当前用户信息
  getCurrentUser() {
    const userStr = localStorage.getItem('userInfo')
    if (userStr) {
      return JSON.parse(userStr)
    }
    return null
  },

  // 检查用户是否已登录
  isLoggedIn() {
    return !!localStorage.getItem('token')
  },

  // 检查用户是否有特定角色
  hasRole(role) {
    const user = this.getCurrentUser()
    return user && user.roles && user.roles.includes(role)
  }
} 