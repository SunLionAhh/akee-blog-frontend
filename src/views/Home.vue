<template>
  <div class="home">
    <!-- Banner -->
    <div class="banner">
      <div class="banner-content">
        <h1 class="hello-title">欢迎来到 Akee 的博客</h1>
        <p>记录、分享、成长</p>
        <div class="banner-stats">
          <div class="stat-item">
            <i class="el-icon-document"></i>
            <span>文章</span>
            <strong>128</strong>
          </div>
          <div class="stat-item">
            <i class="el-icon-view"></i>
            <span>访问</span>
            <strong>10k+</strong>
          </div>
          <div class="stat-item">
            <i class="el-icon-star-on"></i>
            <span>收藏</span>
            <strong>256</strong>
          </div>
        </div>
      </div>
      <div class="mascot">
        <img :src="currentTheme.logo" alt="mascot" />
      </div>
    </div>

    <!-- 主体内容 -->
    <el-container class="main-content">
      <el-main>
        <el-row :gutter="30">
          <el-col :span="16">
            <!-- 文章列表 -->
            <div class="section-title">
              <h2>最新文章</h2>
              <el-button type="text">查看全部 <i class="el-icon-arrow-right"></i></el-button>
            </div>
            <el-card v-loading="loading" class="post-card" :body-style="{ padding: '0' }" v-for="(post, idx) in posts" :key="idx">
              <div class="post-content-wrapper">
                
                <div class="post-content">
                  <h2>{{ post.title }}</h2>
                  <p class="post-meta">
                    <span><i class="el-icon-user"></i> {{ post.authorName }}</span>
                    <span><i class="el-icon-date"></i> {{ formatDate(post.createdAt) }}</span>
                    <span><i class="el-icon-view"></i> {{ post.viewCount }} 阅读</span>
                  </p>
                  <div class="post-cover">
                  <img :src="getArticleCoverUrl(post.coverImage)" alt="cover" />
                  <div class="post-category">
                    <el-tag size="small">{{ post.categoryName }}</el-tag>
                  </div>
                  <p class="post-desc">{{ post.summary }}</p>
                </div>
                  
                  <div class="post-footer">
                    <div class="post-tags">
                      <el-tag v-for="tag in post.tagNames" :key="tag" size="small" effect="plain">{{ tag }}</el-tag>
                    </div>
                    <el-button type="text" @click="goToPost(post.id)">阅读全文 <i class="el-icon-arrow-right"></i></el-button>
                  </div>
                </div>
              </div>
            </el-card>
            <!-- 分页 -->
            <div class="pagination" v-if="total > 0">
              <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="total"
                  :page-size="pageSize"
                  :current-page.sync="currentPage"
                  @current-change="handlePageChange"
              ></el-pagination>
            </div>
          </el-col>
          <el-col :span="8">
            <!-- 侧边栏 -->
            <el-card class="sidebar-card author-card">
              <div class="author-info">
                <div class="avatar-section">
                  <el-avatar :size="80" :src="avatarSrc"></el-avatar>
                  <h3 class="author-name">Akee</h3>
                  <p class="author-bio">一个热爱编程和生活的程序员</p>
                </div>
                <div class="author-stats">
                  <div class="stat">
                    <strong>128</strong>
                    <span>文章</span>
                  </div>
                  <div class="stat">
                    <strong>256</strong>
                    <span>收藏</span>
                  </div>
                  <div class="stat">
                    <strong>512</strong>
                    <span>点赞</span>
                  </div>
                </div>
              </div>
            </el-card>

            <el-card class="sidebar-card">
              <div slot="header" class="card-header">
                <span>文章分类</span>
                <el-button type="text">查看全部</el-button>
              </div>
              <div class="category-list">
                <div v-for="cat in categories" :key="cat.id" class="category-item">
                  <span class="category-name">{{ cat.name }}</span>
                  <el-tag size="small" type="info">{{ cat.postCount }}</el-tag>
                </div>
              </div>
            </el-card>

            <el-card class="sidebar-card">
              <div slot="header" class="card-header">
                <span>热门标签</span>
                <el-button type="text">查看全部</el-button>
              </div>
              <div class="tag-cloud">
                <el-tag v-for="tag in tags" :key="tag.id"
                        :type="getRandomTagType()"
                        effect="light"
                        class="tag-item">
                  {{ tag.name }}
                </el-tag>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { postApi, categoryApi, tagApi } from '@/api'
import avatarImg from '@/assets/images/avatar.png'
import defaultArticleCover from '@/assets/images/article_cover.png' // 导入默认文章封面图

export default {
  name: 'HomePage',
  inject: ['currentTheme'],
  data() {
    return {
      posts: [],
      categories: [],
      tags: [],
      loading: false,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      avatarSrc: avatarImg,
      baseUploadUrl: 'http://localhost:8080/uploads/' // 图片上传的基础URL
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    },
    getArticleCoverUrl(coverImage) {
      if (coverImage) {
        // 检查是否是完整的URL
        if (coverImage.startsWith('http://') || coverImage.startsWith('https://')) {
          return coverImage
        } else {
          // 否则，拼接上传的基础URL
          return `${this.baseUploadUrl}${coverImage}`
        }
      } else {
        return defaultArticleCover // 返回默认封面图
      }
    },
    async fetchPosts() {
      try {
        const response = await postApi.getPosts({
          page: this.currentPage - 1,
          size: this.pageSize
        })
        this.posts = response.data.content.map(post => ({
          ...post,
          categoryName: post.category?.name || '未分类',
          authorName: post.author?.username || '未知作者',
          tagNames: post.tags?.map(tag => tag.name) || []
        }))
        this.total = response.data.totalElements
      } catch (error) {
        console.error('获取文章列表失败:', error)
        this.$message.error('获取文章列表失败')
      }
    },
    async fetchCategories() {
      try {
        const response = await categoryApi.getCategories()
        this.categories = response.data
      } catch (error) {
        console.error('获取分类列表失败:', error)
        this.$message.error('获取分类列表失败')
      }
    },
    async fetchTags() {
      try {
        const response = await tagApi.getTags({
          page: 0,
          size: 20  // 获取前20个标签
        })
        this.tags = response.data.content.map(tag => ({
          id: tag.id,
          name: tag.name
        }))
      } catch (error) {
        console.error('获取标签列表失败:', error)
        this.$message.error('获取标签列表失败')
      }
    },
    async fetchAllData() {
      console.log('开始加载数据，设置 loading = true')
      this.loading = true
      try {
        await Promise.all([
          this.fetchPosts(),
          this.fetchCategories(),
          this.fetchTags()
        ])
        console.log('数据加载完成')
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        console.log('设置 loading = false')
        this.loading = false
      }
    },
    goToPost(id) {
      this.$router.push(`/post/${id}`)
    },
    getRandomTagType() {
      const types = ['', 'success', 'info', 'warning', 'danger']
      return types[Math.floor(Math.random() * types.length)]
    },
    async handlePageChange(page) {
      this.currentPage = page
      console.log('开始加载分页数据，设置 loading = true')
      this.loading = true
      try {
        await this.fetchPosts()
        console.log('分页数据加载完成')
      } finally {
        console.log('设置 loading = false')
        this.loading = false
      }
    }
  },
  created() {
    this.fetchAllData()
  }
}
</script>

<style scoped>
.home {
  background: var(--background-color);
  min-height: 100vh;
}

.banner {
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--accent-color) 100%);
  color: #fff;
  text-align: center;
  padding: 80px 0 40px 0;
  position: relative;
  overflow: hidden;
  margin-bottom: 40px;
}

.banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://api.yimian.xyz/img?type=moe&size=1920x1080') center/cover;
  opacity: 0.1;
  z-index: 0;
}

.banner-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 40px auto;
  padding: 0 20px;
}

.banner h1 {
  font-size: 48px;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.banner p {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 32px;
}

.banner-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.stat-item i {
  font-size: 24px;
  margin-bottom: 4px;
}

.stat-item strong {
  font-size: 24px;
  font-weight: bold;
}

.stat-item span {
  font-size: 14px;
  opacity: 0.8;
}

.mascot {
  position: absolute;
  right: 40px;
  bottom: 20px;
  width: 200px;
  height: 200px;
  z-index: 1;
  transition: all 0.3s ease;
}
.hello-title{
  margin: 0;
}
.mascot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;
  transition: all 0.3s ease;
}

.mascot:hover {
  transform: scale(1.05);
}

.mascot:hover img {
  border-color: var(--primary-color);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-title h2 {
  font-size: 24px;
  color: var(--primary-color);
  margin: 0;
}

.post-card {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.post-content-wrapper {
  display: flex;
  min-height: 200px;
}

.post-cover {
  position: relative;
  width: 300px;
  min-width: 300px;
  height: 0;
  padding-bottom: 56.25%; /* 高:宽=9:16 比例 (9/16 = 0.5625) */
  overflow: hidden;
}

.post-cover img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.post-card:hover .post-cover img {
  transform: scale(1.05);
}

.post-category {
  position: absolute;
  top: 16px;
  right: 16px;
}

.post-content {
  flex: 1;
  padding: 24px;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.post-content h2 {
  margin: 0 0 16px 0;
  font-size: 24px;
  color: var(--primary-color);
}

.post-meta {
  display: flex;
  gap: 16px;
  color: #888;
  font-size: 14px;
  margin-bottom: 16px;
}

.post-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.post-desc {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  flex: 1;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px dashed var(--secondary-color);
}

.post-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.sidebar-card {
  margin-bottom: 30px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-card {
  text-align: center;
  padding: 24px;
}

.author-info {
  padding: 24px 0;
}

.author-info h3 {
  margin: 16px 0 8px;
  color: var(--primary-color);
}

.author-info p {
  color: #666;
  margin-bottom: 24px;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px dashed var(--secondary-color);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat strong {
  font-size: 20px;
  color: var(--primary-color);
}

.stat span {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed var(--secondary-color);
}

.category-item:last-child {
  border-bottom: none;
}

.category-name {
  color: #666;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  margin: 4px;
  transition: all 0.3s ease;
}

.tag-item:hover {
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .banner {
    padding: 60px 0 30px 0;
  }

  .banner h1 {
    font-size: 36px;
  }

  .banner p {
    font-size: 18px;
  }

  .mascot {
    display: none;
  }

  .banner-stats {
    gap: 20px;
  }

  .post-content-wrapper {
    flex-direction: column;
  }
  
  .post-cover {
    width: 100%;
    padding-bottom: 56.25%; /* 保持高:宽=9:16比例 */
  }
}

.pagination {
  margin-top: 30px;
  text-align: center;
}

.pagination .el-pagination {
  padding: 0;
  font-weight: normal;
}

.pagination .el-pagination .el-pager li {
  background: #fff;
  color: var(--text-color);
}

.pagination .el-pagination .el-pager li.active {
  color: var(--primary-color);
  font-weight: bold;
}

.pagination .el-pagination .btn-prev,
.pagination .el-pagination .btn-next {
  background: #fff;
  color: var(--text-color);
}

.pagination .el-pagination .btn-prev:hover,
.pagination .el-pagination .btn-next:hover {
  color: var(--primary-color);
}
</style>