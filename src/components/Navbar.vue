<template>
  <el-menu
    :default-active="activeIndex"
    class="navbar"
    mode="horizontal"
    router
    background-color="#fff"
    text-color="#333"
    active-text-color="#409EFF">
    <div class="logo">
      <router-link to="/">
        <img :src="currentTheme.logo" alt="Logo">
        <span>我的博客</span>
      </router-link>
    </div>
    <el-menu-item index="/">首页</el-menu-item>
    <el-menu-item index="/categories">分类</el-menu-item>
    <el-menu-item index="/tags">标签</el-menu-item>
    <el-menu-item index="/about">关于</el-menu-item>
    <el-menu-item index="/debugging_summary.html">技术总结</el-menu-item>
    <div class="right-menu">
      <el-dropdown @command="handleThemeChange" class="theme-switch">
        <span class="el-dropdown-link">
          {{ currentTheme.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(theme, key) in themes" :key="key" :command="key">
            {{ theme.name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <template v-if="isLoggedIn">
        <el-dropdown trigger="click" @command="handleCommand">
          <div class="avatar-container">
            <el-avatar :size="40" :src="displayAvatar"></el-avatar>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="createPost">
              <i class="el-icon-edit"></i> 写文章
            </el-dropdown-item>
            <el-dropdown-item command="profile">
              <i class="el-icon-user"></i> 个人中心
            </el-dropdown-item>
            <el-dropdown-item divided command="logout">
              <i class="el-icon-switch-button"></i> 退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
    </div>
  </el-menu>
</template>

<script>
import { authService } from '@/api/auth'
import { themes } from '@/assets/themes'
import defaultAvatar from '@/assets/images/avatar.png' // 导入默认头像图片

export default {
  name: 'NavBar',
  inject: ['currentTheme'],
  data() {
    return {
      activeIndex: '/',
      isLoggedIn: false,
      username: '',
      themes,
      userAvatar: defaultAvatar, // 默认头像
    }
  },
  computed: {
    displayAvatar() {
      const userInfo = authService.getCurrentUser()
      if (userInfo && userInfo.avatar) {
        // 假设用户头像是一个完整的URL或者可以直接拼接的路径
        return userInfo.avatar.startsWith('http') ? userInfo.avatar : `http://localhost:8080/uploads/${userInfo.avatar}`;
      } else {
        return this.userAvatar // 返回默认头像
      }
    }
  },
  methods: {
    goToProfile() {
      this.$router.push('/profile')
    },
    goToCreatePost() {
      this.$router.push('/create-post')
    },
    async logout() {
      try {
        authService.logout()
        this.isLoggedIn = false
        this.username = ''
        this.userAvatar = defaultAvatar // 退出登录时重置头像
        this.$router.push('/login')
        this.$message.success('退出登录成功')
      } catch (error) {
        console.error('退出登录失败:', error)
        this.$message.error('退出登录失败')
      }
    },
    checkLoginStatus() {
      const token = localStorage.getItem('token')
      const userInfo = authService.getCurrentUser()
      this.isLoggedIn = !!token
      this.username = userInfo ? userInfo.username : ''
      this.userAvatar = (userInfo && userInfo.avatar) ? 
                        (userInfo.avatar.startsWith('http') ? userInfo.avatar : `http://localhost:8080/uploads/${userInfo.avatar}`) : 
                        defaultAvatar;
    },
    handleCommand(command) {
      switch (command) {
        case 'createPost':
          this.goToCreatePost()
          break
        case 'profile':
          this.goToProfile()
          break
        case 'logout':
          this.logout()
          break
      }
    },
    handleThemeChange(themeKey) {
      this.$emit('theme-change', themeKey)
    }
  },
  created() {
    this.checkLoginStatus()
  },
  watch: {
    $route(to) {
      this.activeIndex = to.path
      this.checkLoginStatus()
    }
  },
  mounted() {
    window.addEventListener('storage', this.checkLoginStatus)
  },
  beforeDestroy() {
    window.removeEventListener('storage', this.checkLoginStatus)
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: none !important;
  border-right: none !important;
}

.logo {
  margin-right: 40px;
}

.logo a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.logo img {
  height: 40px;
  margin-right: 10px;
}

.logo span {
  font-size: 20px;
  font-weight: bold;
}

.right-menu {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.theme-switch {
  margin-right: 20px;
}

.el-dropdown-link {
  cursor: pointer;
  color: var(--primary-color);
  display: flex;
  align-items: center;
}

.el-dropdown-link:hover {
  color: var(--accent-color);
}

.avatar-container {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.el-dropdown-menu__item i {
  margin-right: 8px;
}

.el-button--text {
  margin-right: 10px;
}
</style> 