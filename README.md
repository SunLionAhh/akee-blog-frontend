# Akee Blog 前端项目

## 项目简介
这是一个基于 Vue.js 开发的博客系统前端项目，提供了美观的用户界面和良好的用户体验。

## 技术栈
- Vue.js 2.6.14
- Vue Router 3.6.5
- Element UI 2.15.14
- Axios 1.9.0
- Quill Editor 2.0.3
- Vue Quill Editor 3.0.6

## 环境要求
- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

## 快速开始

### 1. 克隆项目
```bash
git clone [项目地址]
cd akee-blog-frontend
```

### 2. 安装依赖
```bash
npm install
```

### 3. 开发环境运行
```bash
npm run dev
```
项目将在 http://localhost:8080 运行

### 4. 生产环境构建
```bash
npm run build
```
构建后的文件将生成在 `dist` 目录中

## 项目结构
```
src/
├── assets/        # 静态资源
├── components/    # 公共组件
├── views/         # 页面组件
├── router/        # 路由配置
├── api/           # API 接口
├── utils/         # 工具函数
├── store/         # 状态管理
└── App.vue        # 根组件
```

## 主要功能
- 文章浏览
  - 文章列表
  - 文章详情
  - 分类浏览
  - 标签浏览
- 用户功能
  - 用户注册
  - 用户登录
  - 个人中心
- 文章管理
  - 发布文章
  - 编辑文章
  - 删除文章
- 评论系统
  - 发表评论
  - 回复评论
- 其他功能
  - 文章搜索
  - 文章点赞
  - 文章分享

## 开发指南

### 代码规范
- 使用 ESLint 进行代码检查
- 遵循 Vue.js 官方风格指南
- 使用 Prettier 进行代码格式化

### 组件开发
- 组件命名采用 PascalCase
- 组件文件使用单文件组件（.vue）格式
- 组件属性使用 kebab-case

### API 调用
- 使用 Axios 进行 HTTP 请求
- 统一在 api 目录下管理接口
- 使用拦截器处理请求和响应

## 部署说明
1. 构建生产环境代码
```bash
npm run build
```

2. 配置 Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 常见问题
1. 依赖安装失败
   - 检查 Node.js 版本
   - 清除 npm 缓存：`npm cache clean --force`
   - 使用 cnpm 或配置淘宝镜像

2. 开发环境启动失败
   - 检查端口占用
   - 检查环境变量配置
   - 检查依赖完整性

3. 构建失败
   - 检查 Node.js 版本兼容性
   - 检查依赖版本冲突
   - 检查构建配置

## 贡献指南
1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证
MIT License

Copyright (c) 2024 Akee Blog

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 联系方式
- 微信：Glee_18
- 邮箱：mrduanminjie@163.com
