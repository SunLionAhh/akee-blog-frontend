<template>
  <div id="app">
    <el-container>
      <el-header>
        <navbar @theme-change="handleThemeChange"/>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>
        <p>© 2024 Akee 的博客. All rights reserved.</p>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {themes} from '@/assets/themes'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  data() {
    return {
      themes,
      currentTheme: themes.cool
    }
  },
  provide() {
    return {
      currentTheme: this.currentTheme
    }
  },
  created() {
    // 从本地存储加载主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      this.currentTheme = JSON.parse(savedTheme)
    }
    // 设置 CSS 变量
    this.updateTheme()
  },
  methods: {
    handleThemeChange(themeKey) {
      this.currentTheme = this.themes[themeKey]
      // 保存主题设置到本地存储
      localStorage.setItem('theme', JSON.stringify(this.currentTheme))
      // 更新 CSS 变量
      this.updateTheme()
      // 更新 provide 的值
      this.$provide.currentTheme = this.currentTheme
    },
    updateTheme() {
      document.documentElement.style.setProperty('--primary-color', this.currentTheme.primaryColor)
      document.documentElement.style.setProperty('--secondary-color', this.currentTheme.secondaryColor)
      document.documentElement.style.setProperty('--accent-color', this.currentTheme.accentColor)
      document.documentElement.style.setProperty('--background-color', this.currentTheme.backgroundColor)
      document.documentElement.style.setProperty('--text-color', this.currentTheme.textColor)
    }
  }
}
</script>

<style>
:root {
  --primary-color: #ff6b9c;
  --secondary-color: #ffd6e7;
  --accent-color: #c8e6ff;
  --background-color: #faf6ff;
  --text-color: #333333;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: var(--text-color);
  background: var(--background-color);
  min-height: 100vh;
}
.banner{
  padding: 0 !important;
}
body {
  margin: 0
}
.el-main{
  padding: 0 !important;
}
.el-header {
  padding: 0 !important;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: #000;
}

.el-footer {
  text-align: center;
  color: #666;
  padding: 20px;
  background: #fff;
  border-top: 1px solid #eee;
}

/* 主题相关样式 */
.el-button--primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

.el-button--primary:hover,
.el-button--primary:focus {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
}

.el-menu-item.is-active {
  color: var(--primary-color);
}

.el-menu-item:hover {
  color: var(--accent-color);
}
</style>
