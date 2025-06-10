import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

export const authService = {
  // 登录
  async login(username, password) {
    const response = await axios.post(`${API_URL}/auth/login`, {
      username,
      password
    })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('userInfo', JSON.stringify({
        id: response.data.id,
        username: response.data.username,
        roles: response.data.roles
      }))
    }
    return response.data
  },

  // 注册
  async register(username, email, password, verificationCode) {
    const response = await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password,
      verificationCode
    })
    return response.data
  },

  // 发送验证码
  async sendVerificationCode(email) {
    const response = await axios.post(`${API_URL}/auth/send-verification-code?email=${email}`)
    return response.data
  },

  // 忘记密码
  async forgotPassword(data) {
    const response = await axios.post(`${API_URL}/auth/forgot-password`, data)
    return response
  },

  // 重置密码
  async resetPassword(data) {
    const response = await axios.post(`${API_URL}/auth/reset-password`, data)
    return response
  },

  // 登出
  logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    // 清除 axios 默认请求头中的 token
    delete axios.defaults.headers.common['Authorization']
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

// 添加请求拦截器
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      authService.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
) 