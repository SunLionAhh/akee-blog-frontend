<template>
  <div class="category-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>文章分类</h1>
      <p>探索不同主题的文章</p>
    </div>

    <!-- 主体内容 -->
    <el-container class="main-content">
      <el-main>
        <el-row :gutter="30">
          <!-- 左侧分类列表 -->
          <el-col :span="6">
            <el-card class="category-list">
              <div slot="header" class="card-header">
                <div class="header-left">
                  <span>分类</span>
                  <el-input
                    v-model="searchQuery"
                    placeholder="搜索分类"
                    prefix-icon="el-icon-search"
                    clearable
                    size="small"
                    class="search-input"
                  ></el-input>
                </div>
              </div>
              <div class="category-items">
                <div
                  v-for="category in filteredCategories"
                  :key="category.name"
                  class="category-item"
                  :class="{ active: currentCategory === category.name }"
                  @click="selectCategory(category.name)"
                >
                  <span class="category-name">{{ category.name }}</span>
                  <el-tag size="small" type="info">{{ category.count }}</el-tag>
                </div>
              </div>
            </el-card>

            <!-- 标签云 -->
            <el-card class="tag-cloud">
              <div slot="header" class="card-header">
                <span>热门标签</span>
              </div>
              <div class="tags">
                <el-tag
                  v-for="tag in tags"
                  :key="tag.name"
                  :type="getRandomTagType()"
                  effect="light"
                  class="tag-item"
                  @click="selectTag(tag.name)"
                >
                  {{ tag.name }}
                  <span class="tag-count">({{ tag.count }})</span>
                </el-tag>
              </div>
            </el-card>
          </el-col>

          <!-- 右侧文章列表 -->
          <el-col :span="18">
            <el-card class="post-list">
              <div slot="header" class="card-header">
                <span>{{ currentCategory ? currentCategory : '全部文章' }}</span>
                <el-radio-group v-model="sortBy" size="small">
                  <el-radio-button label="latest">最新</el-radio-button>
                  <el-radio-button label="popular">最热</el-radio-button>
                </el-radio-group>
              </div>

              <!-- 文章列表 -->
              <div class="posts">
                <div v-for="post in filteredPosts" :key="post.id" class="post-item" @click="goToPost(post.id)">
                  <div class="post-cover" v-if="post.cover">
                    <img :src="post.cover" :alt="post.title" />
                  </div>
                  <div class="post-content">
                    <h3 class="post-title">{{ post.title }}</h3>
                    <p class="post-desc">{{ post.desc }}</p>
                    <div class="post-meta">
                      <span class="author">
                        <el-avatar :size="20" :src="post.avatar"></el-avatar>
                        {{ post.author }}
                      </span>
                      <span class="date"><i class="el-icon-date"></i> {{ post.date }}</span>
                      <span class="views"><i class="el-icon-view"></i> {{ post.views }} 阅读</span>
                      <span class="category">
                        <el-tag size="small" effect="plain">{{ post.category }}</el-tag>
                      </span>
                    </div>
                    <div class="post-tags">
                      <el-tag v-for="tag in post.tags" :key="tag" size="small" effect="light">{{ tag }}</el-tag>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 分页 -->
              <div class="pagination">
                <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="totalPosts"
                  :page-size="pageSize"
                  :current-page.sync="currentPage"
                  @current-change="handlePageChange"
                ></el-pagination>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'CategoryPage',
  data() {
    return {
      searchQuery: '',
      currentCategory: '',
      currentTag: '',
      sortBy: 'latest',
      currentPage: 1,
      pageSize: 10,
      totalPosts: 100,
      categories: [
        { name: '前端', count: 25 },
        { name: '后端', count: 20 },
        { name: '生活', count: 15 },
        { name: '随笔', count: 18 },
        { name: '教程', count: 22 },
        { name: '项目', count: 12 }
      ],
      tags: [
        { name: 'Vue', count: 15 },
        { name: 'Java', count: 12 },
        { name: '随笔', count: 8 },
        { name: '成长', count: 10 },
        { name: '技术', count: 20 },
        { name: 'Spring Boot', count: 9 },
        { name: 'JavaScript', count: 18 },
        { name: 'CSS', count: 14 },
        { name: 'HTML', count: 12 }
      ],
      posts: [
        {
          id: 1,
          title: 'Vue.js 3.0 新特性详解',
          desc: '深入探讨 Vue.js 3.0 的新特性和改进，包括 Composition API、性能优化等。',
          author: 'Akee',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          date: '2024-05-18',
          views: 1234,
          category: '前端',
          tags: ['Vue', 'JavaScript'],
          cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80'
        },
        {
          id: 2,
          title: 'Spring Boot 实战教程',
          desc: '从零开始学习 Spring Boot，掌握后端开发的核心技能。',
          author: 'Akee',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          date: '2024-05-17',
          views: 2345,
          category: '后端',
          tags: ['Java', 'Spring Boot'],
          cover: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80'
        }
      ]
    }
  },
  computed: {
    filteredCategories() {
      if (!this.searchQuery) return this.categories
      return this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    filteredPosts() {
      let posts = this.posts
      if (this.currentCategory) {
        posts = posts.filter(post => post.category === this.currentCategory)
      }
      if (this.currentTag) {
        posts = posts.filter(post => post.tags.includes(this.currentTag))
      }
      if (this.sortBy === 'latest') {
        posts.sort((a, b) => new Date(b.date) - new Date(a.date))
      } else {
        posts.sort((a, b) => b.views - a.views)
      }
      return posts
    }
  },
  methods: {
    selectCategory(category) {
      this.currentCategory = category
      this.currentPage = 1
    },
    selectTag(tag) {
      this.currentTag = this.currentTag === tag ? '' : tag
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
      // 实现分页加载逻辑
    },
    goToPost(id) {
      this.$router.push(`/post/${id}`)
    },
    getRandomTagType() {
      const types = ['', 'success', 'info', 'warning', 'danger']
      return types[Math.floor(Math.random() * types.length)]
    }
  }
}
</script>

<style scoped>
.category-page {
  background: var(--background-color);
  min-height: 100vh;
}

.page-header {
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--accent-color) 100%);
  color: #fff;
  text-align: center;
  padding: 32px 0;
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 32px;
  margin-bottom: 12px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.page-header p {
  font-size: 16px;
  opacity: 0.9;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-header span {
  font-size: 15px;
  font-weight: 500;
  color: var(--primary-color);
  white-space: nowrap;
}

.search-input {
  width: 160px;
}

.category-list {
  margin-bottom: 16px;
}

.category-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.category-item:hover {
  background: var(--secondary-color);
  color: var(--primary-color);
}

.category-item.active {
  background: var(--primary-color);
  color: #fff;
}

.category-item.active .el-tag {
  background: rgba(255, 255, 255, 0.2);
  border-color: transparent;
  color: #fff;
}

.tag-cloud {
  margin-bottom: 16px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px 16px;
}

.tag-item {
  cursor: pointer;
  transition: all 0.3s ease;
}

.tag-item:hover {
  transform: scale(1.05);
}

.tag-count {
  font-size: 12px;
  margin-left: 4px;
  opacity: 0.8;
}

.post-list {
  min-height: 600px;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 16px;
}

.post-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.post-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.post-cover {
  width: 180px;
  height: 108px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-title {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: var(--primary-color);
}

.post-desc {
  color: #666;
  margin-bottom: 12px;
  line-height: 1.5;
  font-size: 14px;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 13px;
  color: #888;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.post-tags {
  display: flex;
  gap: 8px;
}

.pagination {
  margin-top: 24px;
  padding: 16px;
  text-align: center;
  border-top: 1px solid #ebeef5;
}

@media (max-width: 768px) {
  .page-header {
    padding: 24px 0;
  }
  
  .page-header h1 {
    font-size: 24px;
  }
  
  .main-content {
    padding: 0 16px;
  }
  
  .post-item {
    flex-direction: column;
  }
  
  .post-cover {
    width: 100%;
    height: 180px;
  }
}
</style> 