<template>
  <div class="about-page">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>关于我</h1>
      <p>记录、分享、成长</p>
    </div>

    <!-- 主体内容 -->
    <el-container class="main-content">
      <el-main>
        <el-row :gutter="30">
          <!-- 左侧个人信息 -->
          <el-col :span="8">
            <el-card class="profile-card">
              <div class="profile-header">
                <div class="avatar-wrapper">
                  <el-avatar :size="120" :src="profile.avatar"></el-avatar>
                  <img class="theme-decoration" :src="currentTheme.logo" alt="theme decoration" />
                </div>
                <h2>{{ profile.name }}</h2>
                <p class="bio">{{ profile.bio }}</p>
              </div>
              <div class="profile-stats">
                <div class="stat-item">
                  <strong>{{ profile.stats.posts }}</strong>
                  <span>文章</span>
                </div>
                <div class="stat-item">
                  <strong>{{ profile.stats.views }}</strong>
                  <span>访问</span>
                </div>
                <div class="stat-item">
                  <strong>{{ profile.stats.likes }}</strong>
                  <span>点赞</span>
                </div>
              </div>
              <div class="profile-contact">
                <a v-for="(link, index) in profile.links" 
                   :key="index" 
                   :href="link.url" 
                   target="_blank"
                   class="contact-link">
                  <i :class="link.icon"></i>
                  {{ link.name }}
                </a>
              </div>
            </el-card>

            <!-- 技能卡片 -->
            <el-card class="skills-card">
              <div slot="header">
                <span>技能树</span>
              </div>
              <div class="skills-list">
                <div v-for="skill in profile.skills" :key="skill.name" class="skill-item">
                  <span class="skill-name">{{ skill.name }}</span>
                  <el-progress 
                    :percentage="skill.level" 
                    :color="getProgressColor(skill.level)"
                    :show-text="false">
                  </el-progress>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 右侧博客介绍 -->
          <el-col :span="16">
            <el-card class="about-card">
              <div class="about-section">
                <h3>关于博客</h3>
                <p>{{ profile.about }}</p>
              </div>
              <div class="about-section">
                <h3>技术栈</h3>
                <div class="tech-stack">
                  <el-tag v-for="tech in profile.techStack" 
                         :key="tech" 
                         effect="light" 
                         class="tech-tag">
                    {{ tech }}
                  </el-tag>
                </div>
              </div>
              <div class="about-section">
                <h3>时间线</h3>
                <el-timeline>
                  <el-timeline-item
                    v-for="(activity, index) in profile.timeline"
                    :key="index"
                    :timestamp="activity.time"
                    :color="getTimelineColor(index)">
                    {{ activity.content }}
                  </el-timeline-item>
                </el-timeline>
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
  name: 'AboutPage',
  inject: ['currentTheme'],
  data() {
    return {
      profile: {
        name: 'Akee',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        bio: '热爱编程和分享的开发者',
        stats: {
          posts: 128,
          views: '10k+',
          likes: 256
        },
        links: [
          { name: 'GitHub', icon: 'el-icon-s-platform', url: 'https://github.com' },
          { name: '掘金', icon: 'el-icon-s-promotion', url: 'https://juejin.cn' },
          { name: '知乎', icon: 'el-icon-s-custom', url: 'https://zhihu.com' }
        ],
        skills: [
          { name: 'Vue.js', level: 90 },
          { name: 'JavaScript', level: 85 },
          { name: 'CSS/SCSS', level: 80 },
          { name: 'Node.js', level: 75 },
          { name: 'Java', level: 70 }
        ],
        about: '这是一个记录个人成长和技术分享的博客。在这里，我会分享我的编程经验、学习心得以及一些有趣的项目。希望通过这个平台，能够帮助到更多的人，同时也促进自己的进步。',
        techStack: [
          'Vue.js', 'React', 'TypeScript', 'Node.js', 'Java', 
          'Spring Boot', 'MySQL', 'MongoDB', 'Docker', 'Git'
        ],
        timeline: [
          { time: '2024-05', content: '博客系统上线' },
          { time: '2024-04', content: '开始学习 Spring Boot' },
          { time: '2024-03', content: '完成个人项目开发' },
          { time: '2024-02', content: '开始写技术博客' },
          { time: '2024-01', content: '学习 Vue.js 3.0' }
        ]
      }
    }
  },
  methods: {
    getProgressColor(level) {
      if (level >= 90) return '#67C23A'
      if (level >= 70) return '#409EFF'
      if (level >= 50) return '#E6A23C'
      return '#F56C6C'
    },
    getTimelineColor(index) {
      const colors = [
        'var(--primary-color)',
        'var(--secondary-color)',
        'var(--accent-color)'
      ]
      return colors[index % colors.length]
    }
  }
}
</script>

<style scoped>
.about-page {
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

.profile-card {
  margin-bottom: 24px;
  border-radius: 8px;
  overflow: hidden;
}

.profile-header {
  text-align: center;
  padding: 24px 0;
}

.avatar-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
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

.profile-header h2 {
  margin: 0 0 8px;
  color: var(--primary-color);
  font-size: 24px;
}

.bio {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.profile-stats {
  display: flex;
  justify-content: space-around;
  padding: 16px 0;
  border-top: 1px dashed var(--secondary-color);
  border-bottom: 1px dashed var(--secondary-color);
}

.stat-item {
  text-align: center;
}

.stat-item strong {
  display: block;
  font-size: 20px;
  color: var(--primary-color);
  margin-bottom: 4px;
}

.stat-item span {
  font-size: 13px;
  color: #666;
}

.profile-contact {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.contact-link {
  color: #666;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.contact-link:hover {
  color: var(--primary-color);
}

.skills-card {
  border-radius: 8px;
  overflow: hidden;
}

.skills-list {
  padding: 16px;
}

.skill-item {
  margin-bottom: 16px;
}

.skill-item:last-child {
  margin-bottom: 0;
}

.skill-name {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.about-card {
  border-radius: 8px;
  overflow: hidden;
}

.about-section {
  padding: 24px;
  border-bottom: 1px solid #ebeef5;
}

.about-section:last-child {
  border-bottom: none;
}

.about-section h3 {
  margin: 0 0 16px;
  color: var(--primary-color);
  font-size: 18px;
}

.about-section p {
  margin: 0;
  line-height: 1.6;
  color: #666;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  margin-bottom: 8px;
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
  
  .profile-stats {
    flex-wrap: wrap;
    gap: 16px;
  }
  
  .stat-item {
    flex: 1;
    min-width: 80px;
  }
}
</style> 