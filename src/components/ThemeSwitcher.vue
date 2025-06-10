<template>
  <div class="theme-switcher">
    <el-dropdown @command="handleThemeChange">
      <span class="el-dropdown-link">
        <i class="el-icon-brush"></i>
        切换主题
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="cute">
          <i class="el-icon-star-on" style="color: #ff6b9c"></i>
          可爱风格
        </el-dropdown-item>
        <el-dropdown-item command="cool">
          <i class="el-icon-star-on" style="color: #4a90e2"></i>
          帅气风格
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { themes } from '@/assets/themes'

export default {
  name: 'ThemeSwitcher',
  data() {
    return {
      themes
    }
  },
  methods: {
    handleThemeChange(theme) {
      this.$emit('theme-change', this.themes[theme])
    }
  }
}
</script>

<style scoped>
.theme-switcher {
  margin-left: 20px;
}
.el-dropdown-link {
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
}
.el-dropdown-link:hover {
  color: var(--primary-color);
}
.el-dropdown-menu__item i {
  margin-right: 8px;
}
</style> 