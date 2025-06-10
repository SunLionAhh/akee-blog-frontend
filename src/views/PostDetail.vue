<template>
  <div class="post-detail">
    <!-- 文章头部 -->
    <div class="post-header">
      <div class="header-content">
        <h1>{{ post.title }}</h1>
        <div class="post-meta">
          <span class="author">
            <el-avatar :size="24" :src="post.avatar"></el-avatar>
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
      <div class="decoration left">
        <img :src="currentTheme.decoration" alt="decoration" />
      </div>
      <div class="decoration right">
        <img :src="currentTheme.decoration" alt="decoration" />
      </div>
    </div>

    <!-- 文章内容 -->
    <el-container class="main-content">
      <el-main>
        <el-row :gutter="30">
          <el-col :span="18">
            <!-- 文章主体 -->
            <el-card class="post-content">
              <div class="content-wrapper" v-html="post.content"></div>
              
              <!-- 文章底部 -->
              <div class="post-footer">
                <div class="post-actions">
                  <el-button type="text" @click="handleLike">
                    <i class="el-icon-star-off"></i> 收藏
                  </el-button>
                  <el-button type="text" @click="handleShare">
                    <i class="el-icon-share"></i> 分享
                  </el-button>
                </div>
                <div class="post-nav">
                  <el-button v-if="post.prev" type="text" @click="goToPost(post.prev.id)">
                    <i class="el-icon-arrow-left"></i> {{ post.prev.title }}
                  </el-button>
                  <el-button v-if="post.next" type="text" @click="goToPost(post.next.id)">
                    {{ post.next.title }} <i class="el-icon-arrow-right"></i>
                  </el-button>
                </div>
              </div>
            </el-card>

            <!-- 评论区 -->
            <el-card class="comment-section">
              <div slot="header" class="comment-header">
                <span>评论 ({{ comments.length }})</span>
                <el-button type="text" @click="showCommentForm = true">
                  <i class="el-icon-edit"></i> 写评论
                </el-button>
              </div>
              
              <!-- 评论表单 -->
              <div v-if="showCommentForm" class="comment-form">
                <el-input
                  type="textarea"
                  :rows="3"
                  placeholder="写下你的评论..."
                  v-model="newComment"
                ></el-input>
                <div class="form-actions">
                  <el-button type="primary" @click="submitComment">发表评论</el-button>
                  <el-button @click="showCommentForm = false">取消</el-button>
                </div>
              </div>

              <!-- 评论列表 -->
              <div class="comment-list">
                <div v-for="comment in comments" :key="comment.id" class="comment-item">
                  <div class="comment-avatar">
                    <el-avatar :size="40" :src="comment.avatar"></el-avatar>
                  </div>
                  <div class="comment-content">
                    <div class="comment-header">
                      <span class="comment-author">{{ comment.author }}</span>
                      <span class="comment-date">{{ comment.date }}</span>
                    </div>
                    <p class="comment-text">{{ comment.content }}</p>
                    <div class="comment-actions">
                      <el-button type="text" size="mini" @click="handleReply(comment)">
                        <i class="el-icon-chat-dot-round"></i> 回复
                      </el-button>
                      <el-button type="text" size="mini" @click="handleLikeComment(comment)">
                        <i class="el-icon-star-off"></i> 点赞
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="6">
            <!-- 作者信息 -->
            <el-card class="author-card">
              <div class="author-info">
                <div class="avatar-wrapper">
                  <el-avatar :size="80" :src="post.avatar"></el-avatar>
                  <img class="theme-decoration" :src="currentTheme.logo" alt="theme decoration" />
                </div>
                <h3>{{ post.author }}</h3>
                <p>{{ post.authorDesc }}</p>
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

            <!-- 相关文章 -->
            <el-card class="related-posts">
              <div slot="header">
                <span>相关文章</span>
              </div>
              <div class="related-list">
                <div v-for="related in relatedPosts" :key="related.id" class="related-item" @click="goToPost(related.id)">
                  <div class="related-cover" v-if="related.cover">
                    <img :src="related.cover" :alt="related.title" />
                  </div>
                  <div class="related-info">
                    <h4>{{ related.title }}</h4>
                    <p class="related-meta">
                      <span><i class="el-icon-view"></i> {{ related.views }}</span>
                      <span><i class="el-icon-date"></i> {{ related.date }}</span>
                    </p>
                  </div>
                </div>
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
  name: 'PostDetail',
  inject: ['currentTheme'],
  data() {
    return {
      post: {
        id: 1,
        title: '第一篇博客文章',
        author: 'Akee',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        authorDesc: '热爱编程和分享的开发者',
        date: '2024-05-18',
        views: 1234,
        category: '前端',
        tags: ['Vue', 'JavaScript'],
        content: `
          <h2>引言</h2>
          <p>这是我的第一篇博客文章，欢迎大家阅读和交流！在这里，我将分享我的编程经验和学习心得。</p>
          
          <h2>正文</h2>
          <p>在开始之前，我想先介绍一下我自己。我是一名热爱编程的开发者，主要专注于前端开发领域。</p>
          
          <h3>为什么写博客？</h3>
          <p>写博客不仅可以帮助我整理和总结知识，还能与更多的开发者交流学习。通过分享，我们可以共同进步。</p>
          
          <h3>技术栈</h3>
          <ul>
            <li>前端：Vue.js, React, TypeScript</li>
            <li>后端：Node.js, Java</li>
            <li>数据库：MySQL, MongoDB</li>
          </ul>
          
          <h2>结语</h2>
          <p>希望这篇文章对你有帮助，也欢迎大家在评论区留言交流！</p>
        `,
        prev: null,
        next: {
          id: 2,
          title: '前端开发入门指南'
        }
      },
      comments: [
        {
          id: 1,
          author: '张三',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          date: '2024-05-18 14:30',
          content: '写得很好，期待更多分享！'
        },
        {
          id: 2,
          author: '李四',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
          date: '2024-05-18 15:45',
          content: '学习了，感谢分享！'
        }
      ],
      relatedPosts: [
        {
          id: 2,
          title: '前端开发入门指南',
          cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
          views: 2345,
          date: '2024-05-17'
        },
        {
          id: 3,
          title: 'Java 后端实战',
          cover: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
          views: 3456,
          date: '2024-05-16'
        }
      ],
      showCommentForm: false,
      newComment: ''
    }
  },
  methods: {
    goToPost(id) {
      this.$router.push(`/post/${id}`);
    },
    handleLike() {
      // 处理收藏
    },
    handleShare() {
      // 处理分享
    },
    handleReply(comment) {
      // 处理回复
      this.showCommentForm = true;
      this.newComment = `@${comment.author} `;
    },
    handleLikeComment(comment) {
      // 处理评论点赞
      this.$message.success(`点赞了 ${comment.author} 的评论`);
    },
    submitComment() {
      // 提交评论
      this.showCommentForm = false;
      this.newComment = '';
    }
  },
  created() {
    // 从本地存储加载主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      this.currentTheme = JSON.parse(savedTheme)
    }
  },
  watch: {
    // 监听主题变化
    '$root.$data.currentTheme': {
      handler(newTheme) {
        this.currentTheme = newTheme
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.post-detail {
  background: var(--background-color);
  min-height: 100vh;
}

.post-header {
  background: linear-gradient(135deg, var(--secondary-color) 0%, var(--accent-color) 100%);
  color: #fff;
  padding: 40px 0;
  position: relative;
  overflow: hidden;
  margin-bottom: 24px;
}

.header-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  z-index: 1;
}

.post-header h1 {
  font-size: 32px;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 13px;
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

.decoration {
  position: absolute;
  width: 200px;
  height: 200px;
  opacity: 0.1;
}

.decoration.left {
  left: 40px;
  top: 50%;
  transform: translateY(-50%);
}

.decoration.right {
  right: 40px;
  top: 50%;
  transform: translateY(-50%) scaleX(-1);
}

.decoration img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.post-content {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.content-wrapper {
  padding: 24px;
  line-height: 1.6;
  color: #333;
}

.content-wrapper h2 {
  color: var(--primary-color);
  margin: 24px 0 16px;
  font-size: 24px;
}

.content-wrapper h3 {
  color: var(--primary-color);
  margin: 20px 0 12px;
  font-size: 20px;
}

.content-wrapper p {
  margin-bottom: 12px;
}

.content-wrapper ul {
  margin-bottom: 12px;
  padding-left: 16px;
}

.content-wrapper li {
  margin-bottom: 6px;
}

.post-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px dashed var(--secondary-color);
}

.post-actions {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.post-nav {
  display: flex;
  justify-content: space-between;
}

.comment-section {
  border-radius: 8px;
  overflow: hidden;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.comment-form {
  margin-bottom: 20px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 8px;
}

.comment-list {
  margin-top: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px dashed var(--secondary-color);
}

.comment-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.comment-author {
  font-weight: bold;
  color: var(--primary-color);
}

.comment-date {
  font-size: 12px;
  color: #888;
}

.comment-text {
  margin-bottom: 6px;
  line-height: 1.5;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.author-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.author-info {
  text-align: center;
  padding: 20px;
}

.author-info h3 {
  margin: 12px 0 6px;
  color: var(--primary-color);
}

.author-info p {
  color: #666;
  margin-bottom: 16px;
}

.author-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px dashed var(--secondary-color);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat strong {
  font-size: 18px;
  color: var(--primary-color);
}

.stat span {
  font-size: 13px;
  color: #666;
  margin-top: 2px;
}

.related-posts {
  border-radius: 8px;
  overflow: hidden;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.related-item {
  display: flex;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.related-item:hover {
  transform: translateX(5px);
}

.related-cover {
  width: 70px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
}

.related-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info {
  flex: 1;
}

.related-info h4 {
  margin: 0 0 6px 0;
  font-size: 14px;
  color: var(--primary-color);
}

.related-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #888;
}

.related-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .post-header {
    padding: 32px 0;
  }
  
  .post-header h1 {
    font-size: 24px;
  }
  
  .post-meta {
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .decoration {
    display: none;
  }
  
  .content-wrapper {
    padding: 16px;
  }
  
  .content-wrapper h2 {
    font-size: 20px;
  }
  
  .content-wrapper h3 {
    font-size: 18px;
  }
}

.avatar-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto;
}

.theme-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  opacity: 0.2;
  pointer-events: none;
}

.avatar-wrapper .el-avatar {
  position: relative;
  z-index: 1;
  border: 2px solid var(--primary-color);
  transition: all 0.3s ease;
}

.avatar-wrapper:hover .el-avatar {
  transform: scale(1.05);
  border-color: var(--accent-color);
}
</style> 