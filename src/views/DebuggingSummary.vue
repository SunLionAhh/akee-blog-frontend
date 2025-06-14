<template>
  <div class="debugging-summary-page">
    <div class="page-header">
      <h1>技术总结</h1>
      <p>记录、分享、成长</p>
    </div>

    <el-container class="main-content">
      <el-main>
        <el-row :gutter="30">
          <el-col :span="6">
            <el-card class="sidebar-card">
              <div slot="header" class="clearfix">
                <span>目录</span>
              </div>
              <el-menu :default-active="activeTocItem" class="toc-menu" :router="false">
                <el-menu-item v-for="section in summaryData" :key="section.id" :index="section.id" @click="scrollToSection(section.id)">
                  <span slot="title">{{ section.title }}</span>
                </el-menu-item>
              </el-menu>
            </el-card>
          </el-col>

          <el-col :span="18">
            <el-card class="summary-card main-title-card">
              <h1>{{ summaryData[0].title }}</h1>
              <div class="section-content">
                <p>{{ summaryData[0].content }}</p>
              </div>
            </el-card>

            <el-card v-for="section in summaryData.slice(1)" :key="section.id" class="summary-card">
              <h2 :id="section.id">{{ section.title }}</h2>
              <div class="section-content">
                <p v-if="section.description">{{ section.description }}</p>
                <div v-if="section.issue" class="issue">
                  <h3>错误信息：<code>{{ section.issue.errorMessage }}</code></h3>
                  <p v-if="section.issue.description">{{ section.issue.description }}</p>
                  <h3 v-if="section.issue.reasonHeader">原因：</h3>
                  <ul v-if="section.issue.reasons">
                    <li v-for="(reason, index) in section.issue.reasons" :key="index">{{ reason }}</li>
                  </ul>
                </div>
                <div v-if="section.solution" class="solution">
                  <h3>解决方案：</h3>
                  <p v-if="section.solution.description">{{ section.solution.description }}</p>
                  <ul v-if="section.solution.steps">
                    <li v-for="(step, index) in section.solution.steps" :key="index">
                      <strong v-if="step.strong">{{ step.strong }}</strong> {{ step.text }}
                    </li>
                  </ul>
                  <pre v-if="section.solution.code"><code>{{ section.solution.code }}</code></pre>
                  <ul v-if="section.solution.moreSteps">
                    <li v-for="(step, index) in section.solution.moreSteps" :key="index">
                      <strong v-if="step.strong">{{ step.strong }}</strong> {{ step.text }}
                    </li>
                  </ul>
                </div>
                <ol v-if="section.steps">
                  <li v-for="(step, index) in section.steps" :key="index">
                    <strong v-if="step.strong">{{ step.strong }}</strong> {{ step.text }}
                    <pre v-if="step.code"><code>{{ step.code }}</code></pre>
                  </li>
                </ol>
                <ul v-if="section.reflections">
                    <li v-for="(reflection, index) in section.reflections" :key="index">
                      <strong v-if="reflection.strong">{{ reflection.strong }}</strong> {{ reflection.text }}
                    </li>
                </ul>
                <p v-if="section.content">{{ section.content }}</p>
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
  name: 'DebuggingSummary',
  inject: ['currentTheme'],
  data() {
    return {
      activeTocItem: '',
      summaryData: [
        {
          id: 'report-title',
          title: 'Spring Boot 应用启动问题总结报告',
          content: '本次调试会话旨在解决一个Spring Boot应用的启动失败问题。整个过程伴随着多个错误，涉及依赖管理、Spring Bean生命周期以及配置文件解析。以下是对问题的详细总结和解决方案。'
        },
        {
          id: 'core-issue',
          title: '核心问题：Error starting ApplicationContext',
          description: '应用启动失败的根本原因是Spring的ApplicationContext无法正常初始化。具体表现为：',
          issue: {
            errorMessage: 'java.lang.IllegalArgumentException: Invalid value type for attribute \'factoryBeanObjectType\': java.lang.String',
            description: '这个通用错误通常指示Spring在尝试创建或注入Bean时，某个属性的类型与预期不符。在本例中，它在不同阶段由不同的深层原因触发。'
          }
        },
        {
          id: 'issue-one-redis',
          title: '问题一：redisUtils Bean创建失败（占位符无法解析）',
          issue: {
            errorMessage: 'Could not resolve placeholder \'spring.data.redis.key-prefix\' in value "${spring.data.redis.key-prefix}"',
            description: '该错误表明Spring无法在配置文件中找到`spring.data.redis.key-prefix`这个配置项的值。这发生在`RedisUtils`类尝试通过`@Value`注解注入此属性时。',
            reasonHeader: '原因：',
            reasons: [
              '在之前的调试过程中，为了解决另一个类型不匹配的问题，该配置项曾被从`application.yml`中移除。',
              '`RedisUtils`类需要此配置来为其Redis操作添加前缀。'
            ]
          },
          solution: {
            description: '将`spring.data.redis.key-prefix: "akee_blog:"`配置重新添加回`akee-blog-backend/src/main/resources/application.yml`文件。',
            code: 'spring:\n  # ... 其他配置 ...\n  data:\n    redis:\n      # ... 其他redis配置 ...\n      key-prefix: "akee_blog:" # 确保添加了这一行'
          }
        },
        {
          id: 'issue-two-mybatis-plus',
          title: '问题二：MyBatis-Plus 依赖不兼容（编译错误）',
          issue: {
            errorMessage: '找不到符号 \'PaginationInnerInterceptor\' 和 \'BlockAttackInnerInterceptor\'',
            description: '这些编译错误发生在`MybatisPlusConfig.java`文件中，指示无法找到MyBatis-Plus插件相关的类。',
            reasonHeader: '原因：',
            reasons: [
              '项目使用的是Spring Boot 3.x版本（`3.2.3`），而MyBatis-Plus的依赖`mybatis-plus-boot-starter`及其版本（最初是`3.5.12`，后来尝试改为`3.5.6`）主要兼容Spring Boot 2.x。',
              'Spring Boot 3.x对Jakarta EE的迁移导致了包名和API的变化，旧的MyBatis-Plus Starter无法兼容。',
              '尽管多次尝试通过自动化工具修改`pom.xml`，但更改未能成功应用。'
            ]
          },
          solution: {
            description: '手动修改`akee-blog-backend/pom.xml`文件，将MyBatis-Plus的依赖修改为针对Spring Boot 3.x的兼容版本和Starter：',
            code: '&lt;properties&gt;\n    &lt;java.version&gt;17&lt;/java.version&gt;\n    &lt;mybatis-plus.version&gt;3.5.12&lt;/mybatis-plus.version&gt;\n    &lt;netty.version&gt;4.1.108.Final&lt;/netty.version&gt;\n&lt;/properties&gt;\n&lt;dependencies&gt;\n    &lt;dependency&gt;\n        &lt;groupId&gt;com.baomidou&lt;/groupId&gt;\n        &lt;artifactId&gt;mybatis-plus-spring-boot3-starter&lt;/artifactId&gt;\n        &lt;version&gt;${mybatis-plus.version}&lt;/version&gt;\n    &lt;/dependency&gt;\n&lt;/dependencies&gt;'
          }
        },
        {
          id: 'issue-three-circular-dependency',
          title: '问题三：Spring Bean 循环依赖',
          issue: {
            errorMessage: 'The dependencies of some of the beans in the application context form a cycle:\n┌─────┐\n|  securityConfig (field private com.akee.blog.service.UserService com.akee.blog.config.SecurityConfig.userService)\n↑     ↓\n|  userServiceImpl (field private org.springframework.security.crypto.password.PasswordEncoder com.akee.blog.service.impl.UserServiceImpl.passwordEncoder)\n└─────┘',
            description: '这个错误清晰地指出`securityConfig`依赖`userService`，而`userServiceImpl`（`userService`的实现）又依赖`passwordEncoder`，偏偏`passwordEncoder`又是在`securityConfig`内部定义的，从而形成了一个循环引用。'
          },
          solution: {
            description: '打破循环依赖的最佳方式是重构Bean的职责。我们将`PasswordEncoder`的Bean定义从`SecurityConfig.java`中分离出来，放到一个独立的配置类`CommonBeansConfig.java`中。',
            steps: [
              { strong: '创建新文件：', text: '`akee-blog-backend/src/main/java/com/akee/blog/config/CommonBeansConfig.java`' }
            ],
            code: 'package com.akee.blog.config;\n\nimport org.springframework.context.annotation.Bean;\nimport org.springframework.context.annotation.Configuration;\nimport org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;\nimport org.springframework.security.crypto.password.PasswordEncoder;\n\n@Configuration\npublic class CommonBeansConfig {\n\n    @Bean\n    public PasswordEncoder passwordEncoder() {\n        return new BCryptPasswordEncoder();\n    }\n}',
            moreSteps: [
              { strong: '从`SecurityConfig.java`中移除：', text: ' 删除原先在`SecurityConfig`中定义的`passwordEncoder` Bean。' }
            ]
          }
        },
        {
          id: 'other-issue-netty',
          title: '其他解决的问题：Netty 漏洞',
          issue: {
            description: 'Maven报告存在Netty相关的传递性拒绝服务（DoS）漏洞。',
            reasonHeader: '原因：',
            reasons: [
              '项目的某个依赖间接引入了含有已知漏洞的Netty版本。'
            ]
          },
          solution: {
            description: '在`pom.xml`的`&lt;properties&gt;`标签中明确指定一个已知安全的Netty版本，强制Maven优先使用该版本：',
            code: '&lt;properties&gt;\n    &lt;java.version&gt;17&lt;/java.version&gt;\n    &lt;mybatis-plus.version&gt;3.5.12&lt;/mybatis-plus.version&gt;\n    &lt;netty.version&gt;4.1.108.Final&lt;/netty.version&gt;\n&lt;/properties&gt;'
          }
        },
        {
          id: 'key-steps',
          title: '关键操作步骤',
          description: '在所有代码修改完成后，以下步骤是确保更改生效并成功构建/运行项目的关键：',
          steps: [
            { strong: '手动验证文件内容：', text: '确保`pom.xml`和`application.yml`（以及所有涉及的Java文件）的内容与上述解决方案完全一致。' },
            { strong: '清理并重新安装Maven依赖：', code: 'cd akee-blog-backend\nmvn clean install' },
            { strong: '刷新您的IDE：', text: '在IDE中（如IntelliJ IDEA），执行"刷新Maven项目"或"重新导入Maven项目"操作。' },
            { strong: '重新构建并运行应用程序。' }
          ]
        },
        {
          id: 'summary-reflection',
          title: '总结反思',
          description: '本次调试过程揭示了Spring Boot项目开发中常见的几个挑战：',
          reflections: [
            { strong: '依赖管理：', text: '确保所有第三方库与Spring Boot版本兼容，尤其是在大版本升级时（如Spring Boot 2到3），要注意底层API的变动（如Java EE到Jakarta EE）。' },
            { strong: 'Bean生命周期与依赖注入：', text: '理解Spring容器如何管理Bean的创建和依赖注入，对于解决循环依赖和各种Bean创建错误至关重要。' },
            { strong: '配置文件解析：', text: '`@Value`和`@ConfigurationProperties`等注解依赖于正确且完整的外部配置。' },
            { strong: '工具链的配合：', text: '自动化工具（如本AI）可能在某些复杂场景下（如强制覆盖`pom.xml`）存在局限性，此时需要开发者手动介入并结合Maven命令来确保变更的生效。' }
          ],
          content: '希望这份总结能帮助您更好地理解和避免未来可能遇到的类似问题！'
        }
      ]
    };
  },
  methods: {
    scrollToSection(id) {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        this.activeTocItem = id;
      }
    }
  },
  mounted() {
    // Optional: observe scroll position to update activeTocItem
    // For simplicity, we'll keep it click-driven for now
  }
};
</script>

<style scoped>
.debugging-summary-page {
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
  max-width: 1600px; /* Adjusted to a wider max-width for the overall container */
  margin: 0 auto;
  padding: 0 24px;
}

/* Card styles */
.summary-card {
  margin-bottom: 24px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border-radius: 8px;
}

.sidebar-card {
  margin-bottom: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky; /* Make sidebar sticky */
  top: 20px; /* Adjust as needed */
}

/* General typography and element styles */
h1, h2, h3 {
  color: var(--primary-color);
  border-bottom: 2px solid var(--secondary-color);
  padding-bottom: 10px;
  margin-top: 30px;
}

h1 {
  font-size: 2.2em;
  text-align: center;
  border-bottom: 3px solid var(--primary-color);
  padding-bottom: 15px;
}

h2 {
  font-size: 1.8em;
}

h3 {
  font-size: 1.4em;
}

code {
  background-color: var(--accent-color);
  padding: 2px 5px;
  border-radius: 4px;
  font-family: 'Consolas', 'Monaco', monospace;
  color: var(--text-color);
}

pre {
  background-color: #f0f0f0;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
  border: 1px solid var(--secondary-color);
}

pre code {
  display: block;
  background: none;
  padding: 0;
  color: var(--text-color);
}

ul {
  list-style-type: disc;
  margin-left: 20px;
}

ul li {
  margin-bottom: 8px;
}

strong {
  color: var(--primary-color);
}

.section-content { /* New class to wrap content within cards */
    padding: 15px; /* Add padding to content inside cards */
}

.issue {
  background-color: #f8d7da; /* Keeping a distinct red for errors */
  border-left: 5px solid #dc3545;
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
}

.solution {
  background-color: var(--secondary-color);
  border-left: 5px solid var(--primary-color);
  padding: 15px;
  border-radius: 5px;
  margin-top: 15px;
}

.toc-menu {
  border-right: none !important; /* Remove default Element UI menu border */
}

.toc-menu .el-menu-item {
  height: auto;
  line-height: 1.5;
  white-space: normal;
  word-break: break-word;
  padding: 10px 20px;
}

.toc-menu .el-menu-item.is-active {
  background-color: var(--accent-color) !important;
  color: var(--primary-color) !important;
}

.main-title-card h1 {
  border-bottom: none; /* Remove border for the main report title */
  padding-bottom: 0;
  margin-top: 0;
}
</style> 