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
            <el-card v-loading="loading" class="post-card" :body-style="{ padding: '0', borderRadius: '8px' }" v-for="(post, idx) in posts" :key="idx">
              <div class="post-content-wrapper">
                <!-- 封面图片区域 -->
                <div class="post-cover" @click="goToPost(post.id)">
                  <img :src="post.coverImage || '/default-cover.jpg'" alt="cover" />
                  <div class="post-category">
                    <el-tag size="small" effect="dark" :color="post.categoryColor">{{ post.categoryName }}</el-tag>
                  </div>
                </div>
                
                <!-- 内容区域 -->
                <div class="post-content">
                  <h2 class="post-title" @click="goToPost(post.id)">{{ post.title }}</h2>
                  
                  <div class="post-meta">
                    <span class="post-author">
                      <i class="el-icon-user"></i>
                      {{ post.authorName }}
                    </span>
                    <span class="post-date">
                      <i class="el-icon-date"></i>
                      {{ formatDate(post.createdAt) }}
                    </span>
                    <span class="post-views">
                      <i class="el-icon-view"></i>
                      {{ post.viewCount }}
                    </span>
                    <span class="post-likes">
                      <i class="el-icon-star-on"></i>
                      {{ post.likeCount }}
                    </span>
                  </div>
                  
                  <div class="post-summary">{{ post.summary }}</div>
                  
                  <div class="post-tags">
                    <el-tag
                      v-for="tag in post.tagNames"
                      :key="tag"
                      size="small"
                      @click="filterByTag(tag)"
                      class="post-tag">
                      {{ tag }}
                    </el-tag>
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
                  @current-change="handleCurrentChange"
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
                <el-button type="text" @click="goToCategories">查看全部</el-button>
              </div>
              <div class="category-list">
                <div v-for="cat in categories" :key="cat.id" 
                     class="category-item" 
                     :class="{ active: selectedCategory === cat.name }"
                     @click="filterByCategory(cat.name)">
                  <span class="category-name">{{ cat.name }}</span>
                  <el-tag size="small" type="info">{{ cat.postCount }}</el-tag>
                </div>
              </div>
            </el-card>

            <el-card class="sidebar-card">
              <div slot="header" class="card-header">
                <span>热门标签</span>
                <el-button type="text" @click="goToTags">查看全部</el-button>
              </div>
              <div class="tag-cloud">
                <el-tag v-for="tag in tags" 
                        :key="tag.id"
                        :type="selectedTag === tag.name ? 'primary' : 'info'"
                        effect="light"
                        class="tag-item"
                        @click="filterByTag(tag.name)">
                  {{ tag.name }}
                  <span class="tag-count">({{ tag.postCount }})</span>
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
      baseUploadUrl: 'http://localhost:8080/uploads/', // 图片上传的基础URL
      selectedCategory: '',
      selectedTag: '',
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
        const params = {
          page: this.currentPage - 1,
          size: this.pageSize
        };
        
        if (this.selectedCategory) {
          params.category = this.selectedCategory;
        }
        if (this.selectedTag) {
          params.tag = this.selectedTag;
        }

        const response = await postApi.getPosts(params);
        this.posts = response.records.map(post => ({
          ...post,
          categoryName: post.category?.name || '未分类',
          authorName: post.author?.username || '未知作者',
          tagNames: post.tag?.map(tag => tag.name) || []
        }));
        this.total = response.total;
      } catch (error) {
        console.error('获取文章列表失败:', error);
        this.$message.error('获取文章列表失败');
      }
    },
    async fetchCategories() {
      try {
        const response = await categoryApi.getCategories()
        this.categories = response
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
        this.tags = response.records
      } catch (error) {
        console.error('获取标签列表失败:', error)
        this.$message.error('获取标签列表失败')
      }
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.fetchPosts();
    },
    goToPost(id) {
      this.$router.push(`/post/${id}`);
    },
    filterByCategory(categoryName) {
      this.selectedCategory = this.selectedCategory === categoryName ? '' : categoryName;
      this.currentPage = 1; // 过滤时重置页码
      this.fetchPosts();
    },
    filterByTag(tagName) {
      this.selectedTag = this.selectedTag === tagName ? '' : tagName;
      this.currentPage = 1; // 过滤时重置页码
      this.fetchPosts();
    },
    goToCategories() {
      this.$router.push('/categories');
    },
    goToTags() {
      this.$router.push('/tags');
    }
  },
  created() {
    this.fetchPosts();
    this.fetchCategories();
    this.fetchTags();
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
  margin-bottom: 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.post-content-wrapper {
  display: flex;
  flex-direction: column;
}

.post-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
  cursor: pointer;
}

.post-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.post-cover:hover img {
  transform: scale(1.05);
}

.post-category {
  position: absolute;
  top: 15px;
  right: 15px;
}

.post-content {
  padding: 20px;
}

.post-title {
  margin: 0 0 12px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  cursor: pointer;
  transition: color 0.3s;
}

.post-title:hover {
  color: #409EFF;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin: 0 0 15px 0;
  color: #909399;
  font-size: 0.9rem;
}

.post-meta span {
  display: flex;
  align-items: center;
}

.post-meta i {
  margin-right: 5px;
}

.post-summary {
  color: #666;
  line-height: 1.6;
  margin: 0 0 15px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-tag {
  transition: all 0.3s;
}

.post-tag:hover {
  transform: translateY(-2px);
}

.read-more-btn {
  padding: 8px 15px;
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

.category-name {
  color: #666;
}

.tag-cloud {
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
    height: 180px;
  }
  
  .post-title {
    font-size: 1.3rem;
  }
  
  .post-meta {
    gap: 10px;
  }
  
  .post-footer {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }
  
  .read-more-btn {
    width: 100%;
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