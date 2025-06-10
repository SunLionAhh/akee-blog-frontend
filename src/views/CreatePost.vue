<template>
  <div class="create-post">
    <el-container>
      <el-main>
        <el-card class="editor-card">
          <div slot="header" class="card-header">
            <h2>写文章</h2>
          </div>
          <el-form :model="postForm" :rules="rules" ref="postForm" label-width="80px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="postForm.title" placeholder="请输入文章标题"></el-input>
            </el-form-item>

            <el-form-item label="分类" prop="categoryId">
              <div class="category-select">
                <el-select v-model="postForm.categoryId" placeholder="请选择分类" style="width: 200px">
                  <el-option
                    v-for="category in categories"
                    :key="category.id"
                    :label="category.name"
                    :value="category.id">
                  </el-option>
                </el-select>
                <el-button type="text" @click="showAddCategoryDialog">
                  <i class="el-icon-plus"></i> 新增分类
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="标签" prop="tagIds">
              <div class="tag-select">
                <el-select
                  v-model="postForm.tagIds"
                  multiple
                  placeholder="请选择标签"
                  style="width: 100%">
                  <el-option
                    v-for="tag in tags"
                    :key="tag.id"
                    :label="tag.name"
                    :value="tag.id">
                  </el-option>
                </el-select>
                <el-button type="text" @click="showAddTagDialog">
                  <i class="el-icon-plus"></i> 新增标签
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="封面图">
              <el-upload
                class="cover-uploader"
                action="http://localhost:8080/api/upload"
                :show-file-list="false"
                :on-success="handleCoverSuccess"
                :before-upload="beforeCoverUpload"
                :headers="uploadHeaders">
                <img v-if="postForm.coverImage" :src="getImageUrl(postForm.coverImage)" class="cover">
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
                <quill-editor
                  v-model="postForm.content"
                  ref="myQuillEditor"
                  :options="editorOption"
                  @change="onEditorChange">
                </quill-editor>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitForm('postForm')">发布文章</el-button>
              <el-button @click="saveAsDraft">保存草稿</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-main>
    </el-container>

    <!-- 新增分类对话框 -->
    <el-dialog
      title="新增分类"
      :visible.sync="addCategoryDialogVisible"
      width="30%">
      <el-form :model="newCategory" :rules="categoryRules" ref="categoryForm" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="newCategory.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input type="textarea" v-model="newCategory.description" placeholder="请输入分类描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddCategory">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增标签对话框 -->
    <el-dialog
      title="新增标签"
      :visible.sync="addTagDialogVisible"
      width="30%">
      <el-form :model="newTag" :rules="tagRules" ref="tagForm" label-width="80px">
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="newTag.name" placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item label="标签描述" prop="description">
          <el-input type="textarea" v-model="newTag.description" placeholder="请输入标签描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTagDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAddTag">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { postApi, categoryApi, tagApi } from '@/api'
import { authService } from '@/api/auth'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'CreatePost',
  components: {
    quillEditor
  },
  data() {
    return {
      postForm: {
        title: '',
        categoryId: '',
        tagIds: [],
        coverImage: '',
        summary: '',
        content: '',
        status: 'PUBLISHED',
        userId: null
      },
      categories: [],
      tags: [],
      uploadHeaders: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      rules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 2, max: 100, message: '长度在 2 到 100 个字符', trigger: 'blur' }
        ],
        categoryId: [
          { required: true, message: '请选择文章分类', trigger: 'change' }
        ],
        tagIds: [
          { required: true, message: '请选择文章标签', trigger: 'change' }
        ],
        summary: [
          { required: true, message: '请输入文章摘要', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ]
      },
      editorOption: {
        placeholder: '请输入文章内容...',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        }
      },
      addCategoryDialogVisible: false,
      newCategory: {
        name: '',
        description: ''
      },
      categoryRules: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        description: [
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }
        ]
      },
      addTagDialogVisible: false,
      newTag: {
        name: '',
        description: ''
      },
      tagRules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        description: [
          { max: 100, message: '长度不能超过 100 个字符', trigger: 'blur' }
        ]
      },
      baseImageUrl: 'http://localhost:8080/uploads/'
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await categoryApi.getCategories()
        this.categories = Array.isArray(response.data) ? response.data : response.data.content || []
      } catch (error) {
        console.error('获取分类列表失败:', error)
        this.$message.error('获取分类列表失败')
        this.categories = []
      }
    },
    async fetchTags() {
      try {
        const response = await tagApi.getTags()
        this.tags = Array.isArray(response.data) ? response.data : response.data.content || []
      } catch (error) {
        console.error('获取标签列表失败:', error)
        this.$message.error('获取标签列表失败')
        this.tags = []
      }
    },
    getImageUrl(path) {
      if (!path) return ''
      if (path.startsWith('http')) return path
      if (path.startsWith('/uploads/')) return 'http://localhost:8080' + path
      return this.baseImageUrl + path
    },
    handleCoverSuccess(res) {
      if (res && res.data && res.data.url) {
        this.postForm.coverImage = res.data.url
      } else if (res && res.url) {
        this.postForm.coverImage = res.url
      } else {
        console.error('上传封面图片失败：返回数据格式错误', res)
        this.$message.error('上传封面图片失败')
      }
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
    onEditorChange({ html }) {
      this.postForm.content = html
    },
    async submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            const token = localStorage.getItem('token')
            console.log('Submitting with token:', token)
            await postApi.createPost(this.postForm)
            this.$message.success('文章发布成功')
            this.$router.push('/')
          } catch (error) {
            console.error('发布文章失败:', error)
            if (error.response) {
              console.error('Error response:', error.response.data)
              console.error('Error status:', error.response.status)
              console.error('Error headers:', error.response.headers)
            }
            this.$message.error('发布文章失败')
          }
        } else {
          return false
        }
      })
    },
    async saveAsDraft() {
      this.postForm.status = 'DRAFT'
      try {
        await postApi.createPost(this.postForm)
        this.$message.success('草稿保存成功')
        this.$router.push('/')
      } catch (error) {
        console.error('保存草稿失败:', error)
        this.$message.error('保存草稿失败')
      }
    },
    showAddCategoryDialog() {
      this.addCategoryDialogVisible = true
      this.newCategory = {
        name: '',
        description: ''
      }
    },
    async handleAddCategory() {
      this.$refs.categoryForm.validate(async (valid) => {
        if (valid) {
          try {
            if (!Array.isArray(this.categories)) {
              this.categories = []
            }
            
            const existingCategory = this.categories.find(c => c.name === this.newCategory.name)
            if (existingCategory) {
              this.$message.error('分类名称已存在')
              return
            }

            const response = await categoryApi.createCategory(this.newCategory)
            if (response.data) {
              this.categories.push(response.data)
              this.postForm.categoryId = response.data.id
              this.addCategoryDialogVisible = false
              this.$message.success('分类创建成功')
            } else {
              throw new Error('创建分类失败：服务器返回数据格式错误')
            }
          } catch (error) {
            console.error('创建分类失败:', error)
            if (error.response && error.response.status === 409) {
              this.$message.error('分类名称已存在')
            } else {
              this.$message.error('创建分类失败，请稍后重试')
            }
          }
        }
      })
    },
    showAddTagDialog() {
      this.addTagDialogVisible = true
      this.newTag = {
        name: '',
        description: ''
      }
    },
    async handleAddTag() {
      this.$refs.tagForm.validate(async (valid) => {
        if (valid) {
          try {
            if (!Array.isArray(this.tags)) {
              this.tags = []
            }
            
            const existingTag = this.tags.find(t => t.name === this.newTag.name)
            if (existingTag) {
              this.$message.error('标签名称已存在')
              return
            }

            const response = await tagApi.createTag(this.newTag)
            if (response.data) {
              this.tags.push(response.data)
              this.postForm.tagIds.push(response.data.id)
              this.addTagDialogVisible = false
              this.$message.success('标签创建成功')
            } else {
              throw new Error('创建标签失败：服务器返回数据格式错误')
            }
          } catch (error) {
            console.error('创建标签失败:', error)
            if (error.response && error.response.status === 409) {
              this.$message.error('标签名称已存在')
            } else {
              this.$message.error('创建标签失败，请稍后重试')
            }
          }
        }
      })
    }
  },
  created() {
    const currentUser = authService.getCurrentUser()
    if (currentUser && currentUser.id) {
      this.postForm.userId = currentUser.id
    } else {
      this.$message.error('获取用户信息失败，请重新登录')
      this.$router.push('/login')
    }
    this.fetchCategories()
    this.fetchTags()
  }
}
</script>

<style scoped>
.create-post {
  background: var(--background-color);
  min-height: 100vh;
  padding: 20px;
}

.editor-card {
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  color: var(--primary-color);
}

.editor-container {
  height: 400px;
  margin-bottom: 20px;
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
  border-color: var(--primary-color);
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
  object-fit: cover;
}

:deep(.ql-container) {
  height: 300px;
}

.category-select {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tag-select {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style> 