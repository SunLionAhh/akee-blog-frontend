<template>
  <div class="create-post">
    <el-card class="post-form">
      <div slot="header">
        <span>{{ isEdit ? '编辑文章' : '创建文章' }}</span>
      </div>
      <el-form :model="postForm" :rules="rules" ref="postForm" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="postForm.title" placeholder="请输入文章标题"></el-input>
        </el-form-item>
        
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="postForm.categoryId" placeholder="请选择分类">
            <el-option
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              :value="category.id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="标签" prop="tagIds">
          <el-select
            v-model="postForm.tagIds"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择标签">
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <el-form-item label="封面图">
          <el-upload
            class="cover-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleCoverSuccess"
            :before-upload="beforeCoverUpload">
            <img v-if="postForm.coverImage" :src="postForm.coverImage" class="cover">
            <i v-else class="el-icon-plus cover-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="摘要" prop="summary">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入文章摘要"
            v-model="postForm.summary">
          </el-input>
        </el-form-item>
        
        <el-form-item label="内容" prop="content">
          <div class="editor-container">
            <mavon-editor
              v-model="postForm.content"
              :toolbars="toolbars"
              @save="handleSave"
              ref="md">
            </mavon-editor>
          </div>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="postForm.status">
            <el-radio label="DRAFT">草稿</el-radio>
            <el-radio label="PUBLISHED">发布</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="submitForm('postForm')">保存</el-button>
          <el-button @click="resetForm('postForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { postApi, categoryApi, tagApi } from '@/api'

export default {
  name: 'CreatePost',
  components: {
    mavonEditor
  },
  data() {
    return {
      isEdit: false,
      postId: null,
      categories: [],
      tags: [],
      postForm: {
        title: '',
        content: '',
        summary: '',
        coverImage: '',
        status: 'DRAFT',
        categoryId: '',
        tagIds: []
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        summary: [
          { required: true, message: '请输入文章摘要', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        tagIds: [
          { required: true, message: '请选择标签', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      toolbars: {
        bold: true,
        italic: true,
        header: true,
        underline: true,
        strikethrough: true,
        mark: true,
        superscript: true,
        subscript: true,
        quote: true,
        ol: true,
        ul: true,
        link: true,
        imagelink: true,
        code: true,
        table: true,
        help: true
      }
    }
  },
  created() {
    this.fetchCategories()
    this.fetchTags()
    if (this.$route.params.id) {
      this.isEdit = true
      this.postId = this.$route.params.id
      this.fetchPost()
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await categoryApi.getCategories()
        this.categories = response
      } catch (error) {
        this.$message.error('获取分类列表失败')
      }
    },
    async fetchTags() {
      try {
        const response = await tagApi.getTags()
        this.tags = response.records
      } catch (error) {
        this.$message.error('获取标签列表失败')
      }
    },
    async fetchPost() {
      try {
        const response = await postApi.getPost(this.postId)
        const post = response
        this.postForm = {
          title: post.title,
          content: post.content,
          summary: post.summary,
          coverImage: post.coverImage,
          status: post.status,
          categoryId: post.categoryId,
          tagIds: post.tagIds
        }
      } catch (error) {
        this.$message.error('获取文章详情失败')
      }
    },
    handleCoverSuccess(res) {
      this.postForm.coverImage = res.url
    },
    beforeCoverUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        this.$message.error('上传封面图片只能是图片格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!')
      }
      return isImage && isLt2M
    },
    handleSave(value, render) {
      console.log('保存内容：', value)
      console.log('渲染内容：', render)
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            if (this.isEdit) {
              await postApi.updatePost(this.postId, this.postForm)
              this.$message.success('文章更新成功')
            } else {
              await postApi.createPost(this.postForm)
              this.$message.success('文章创建成功')
            }
            this.$router.push('/')
          } catch (error) {
            this.$message.error(this.isEdit ? '文章更新失败' : '文章创建失败')
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style scoped>
.create-post {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.post-form {
  margin-bottom: 20px;
}

.editor-container {
  height: 500px;
}

.cover-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
}

.cover-uploader:hover {
  border-color: #409EFF;
}

.cover-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.cover {
  width: 178px;
  height: 178px;
  display: block;
}
</style> 