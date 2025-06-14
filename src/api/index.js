import axios from 'axios'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // 后端 API 的基础 URL
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      console.log('Request headers:', config.headers)
    } else {
      console.warn('No token found in localStorage')
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 检查后端返回的 code
    if (response.data.code === 200) {
      return response.data.data // 返回实际的数据部分
    } else {
      // 如果 code 不为 200，表示有业务错误
      console.error('API Error:', response.data.message)
      // 可以选择抛出错误，让调用者捕获，或者返回一个 Promise.reject
      return Promise.reject(new Error(response.data.message || '未知错误'))
    }
  },
  error => {
    // 对响应错误做点什么
    if (error.response) {
      console.error('Response error:', error.response)
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          break
        case 403:
          // 权限不足
          console.error('权限不足，请检查token是否正确')
          break
        case 404:
          // 资源不存在
          console.error('请求的资源不存在')
          break
        case 500:
          // 服务器错误
          console.error('服务器错误')
          break
        default:
          console.error('发生错误:', error.response.data)
      }
    }
    return Promise.reject(error)
  }
)

// 文章相关 API
export const postApi = {
  // 获取文章列表
  getPosts(params) {
    return api.get('/posts', { params })
  },
  // 获取文章详情
  getPost(id) {
    return api.get(`/posts/${id}`)
  },
  // 创建文章
  createPost(data) {
    return api.post('/posts', data)
  },
  // 更新文章
  updatePost(id, data) {
    return api.put(`/posts/${id}`, data)
  },
  // 删除文章
  deletePost(id) {
    return api.delete(`/posts/${id}`)
  }
}

// 分类相关 API
export const categoryApi = {
  // 获取分类列表
  getCategories() {
    return api.get('/categories')
  },
  // 获取分类详情
  getCategory(id) {
    return api.get(`/categories/${id}`)
  },
  // 创建分类
  createCategory(data) {
    return api.post('/categories', data)
  },
  // 更新分类
  updateCategory(id, data) {
    return api.put(`/categories/${id}`, data)
  },
  // 删除分类
  deleteCategory(id) {
    return api.delete(`/categories/${id}`)
  },
  // 获取分类下的文章
  getCategoryPosts(categoryId, params) {
    return api.get(`/categories/${categoryId}/posts`, { params })
  }
}

// 标签相关 API
export const tagApi = {
  // 获取标签列表
  getTags() {
    return api.get('/tags')
  },
  // 获取标签详情
  getTag(id) {
    return api.get(`/tags/${id}`)
  },
  // 创建标签
  createTag(data) {
    return api.post('/tags', data)
  },
  // 更新标签
  updateTag(id, data) {
    return api.put(`/tags/${id}`, data)
  },
  // 删除标签
  deleteTag(id) {
    return api.delete(`/tags/${id}`)
  },
  // 获取标签下的文章
  getTagPosts(tagId, params) {
    return api.get(`/tags/${tagId}/posts`, { params })
  }
}

// 用户相关 API
export const userApi = {
  // 用户登录
  login(data) {
    return api.post('/auth/login', data)
  },
  // 用户注册
  register(data) {
    return api.post('/auth/register', data)
  },
  // 获取用户信息
  getUserInfo() {
    return api.get('/user/info')
  },
  // 更新用户信息
  updateUserInfo(data) {
    return api.put('/user/info', data)
  }
}

// 评论相关 API
export const commentApi = {
  // 获取文章评论
  getCommentsByPost(postId, params) {
    return api.get(`/comments/post/${postId}`, { params })
  },
  // 创建评论
  createComment(data) {
    return api.post('/comments', data)
  },
  // 更新评论
  updateComment(id, data) {
    return api.put(`/comments/${id}`, data)
  },
  // 删除评论
  deleteComment(id) {
    return api.delete(`/comments/${id}`)
  },
  // 获取评论回复
  getReplies(commentId, params) {
    return api.get(`/comments/${commentId}/replies`, { params })
  }
}

export default api 