<template>
  <div class="ai-chat-container">
    <!-- 主聊天区域 -->
    <div class="chat-main">
      <!-- 头部 -->
      <div class="chat-header">
        <div class="header-left">
          <el-avatar :size="40" :src="aiAvatar" class="ai-avatar">
            <i class="el-icon-ai" v-if="!aiAvatar">AI</i>
          </el-avatar>
          <div class="ai-info">
            <h3 class="ai-name">{{ aiName }}</h3>
            <div class="ai-status">
              <span class="status-dot" :class="{ 'online': aiOnline }"></span>
              <span class="status-text">{{ aiOnline ? '在线' : '离线' }}</span>
              <span class="ai-tags">
                <el-tag
                  v-for="tag in aiTags"
                  :key="tag"
                  size="mini"
                  type="info"
                >
                  {{ tag }}
                </el-tag>
              </span>
            </div>
          </div>
        </div>
        <div class="header-right">
          <el-button-group>
            <el-tooltip content="新对话" placement="bottom">
              <el-button type="text" icon="el-icon-refresh" @click="startNewChat"></el-button>
            </el-tooltip>
            <el-tooltip content="清空记录" placement="bottom">
              <el-button type="text" icon="el-icon-delete" @click="clearChat"></el-button>
            </el-tooltip>
            <el-tooltip content="设置" placement="bottom">
              <el-button type="text" icon="el-icon-setting" @click="showSettings"></el-button>
            </el-tooltip>
          </el-button-group>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="message-list" ref="messageList">
        <!-- 欢迎消息 -->
        <div class="welcome-message" v-if="messages.length === 0">
          <div class="welcome-content">
            <el-avatar :size="60" :src="aiAvatar" class="welcome-avatar">
              <i class="el-icon-ai">AI</i>
            </el-avatar>
            <h3>您好！我是{{ aiName }}</h3>
            <p class="welcome-text">我是您的AI助手，可以帮您解答问题、提供建议和处理各种任务。</p>
            
            <!-- 快捷提问 -->
            <div class="quick-questions">
              <h4>快速提问：</h4>
              <div class="question-grid">
                <el-button
                  v-for="question in quickQuestions"
                  :key="question"
                  size="small"
                  @click="sendQuickQuestion(question)"
                >
                  {{ question }}
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 消息项 -->
        <div
          v-for="(message, index) in messages"
          :key="message.id"
          :class="['message-item', {
            'ai-message': message.role === 'assistant',
            'user-message': message.role === 'user',
            'system-message': message.role === 'system'
          }]"
        >
          <!-- AI 消息 -->
          <div v-if="message.role === 'assistant'" class="message-left">
            <el-avatar :size="36" :src="aiAvatar" class="message-avatar">
              <i class="el-icon-ai">AI</i>
            </el-avatar>
            <div class="message-content-wrapper">
              <!-- 消息内容 -->
              <div class="message-content">
                <!-- 文本消息 -->
                <div v-if="message.type === 'text'" class="message-text" v-html="formatMessage(message.content)"></div>
                
                <!-- 代码消息 -->
                <div v-else-if="message.type === 'code'" class="message-code">
                  <div class="code-header">
                    <span>{{ message.language || '代码' }}</span>
                    <el-button
                      type="text"
                      size="mini"
                      icon="el-icon-document-copy"
                      @click="copyCode(message.content)"
                    >
                      复制
                    </el-button>
                  </div>
                  <pre><code>{{ message.content }}</code></pre>
                </div>
                
                <!-- 表格消息 -->
                <div v-else-if="message.type === 'table'" class="message-table">
                  <el-table :data="message.data" border size="small">
                    <el-table-column
                      v-for="col in message.columns"
                      :key="col.prop"
                      :prop="col.prop"
                      :label="col.label"
                      :width="col.width"
                    ></el-table-column>
                  </el-table>
                </div>
                
                <!-- 列表消息 -->
                <div v-else-if="message.type === 'list'" class="message-list">
                  <ul>
                    <li v-for="(item, idx) in message.items" :key="idx">{{ item }}</li>
                  </ul>
                </div>
                
                <!-- 思考中 -->
                <div v-else-if="message.type === 'thinking'" class="message-thinking">
                  <div class="thinking-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span>正在思考...</span>
                </div>
              </div>
              
              <!-- 消息操作 -->
              <div class="message-actions">
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                <el-button-group class="action-buttons">
                  <el-tooltip content="复制" placement="top">
                    <el-button type="text" size="mini" icon="el-icon-copy-document" @click="copyText(message.content)"></el-button>
                  </el-tooltip>
                  <el-tooltip content="重新生成" placement="top">
                    <el-button type="text" size="mini" icon="el-icon-refresh" @click="regenerateMessage(index)"></el-button>
                  </el-tooltip>
                  <el-tooltip content="反馈" placement="top">
                    <el-button type="text" size="mini" icon="el-icon-chat-line-round" @click="feedbackMessage(message)"></el-button>
                  </el-tooltip>
                </el-button-group>
              </div>
            </div>
          </div>

          <!-- 用户消息 -->
          <div v-else-if="message.role === 'user'" class="message-right">
            <div class="message-content-wrapper">
              <div class="message-content">
                <div class="message-text">{{ message.content }}</div>
                
                <!-- 附件显示 -->
                <div v-if="message.attachments && message.attachments.length" class="message-attachments">
                  <div
                    v-for="(attachment, idx) in message.attachments"
                    :key="idx"
                    class="attachment-item"
                  >
                    <el-tag
                      v-if="attachment.type === 'image'"
                      type="info"
                      size="small"
                      @click="previewImage(attachment.url)"
                    >
                      <i class="el-icon-picture"></i> 图片
                    </el-tag>
                    <el-tag
                      v-else-if="attachment.type === 'file'"
                      type="info"
                      size="small"
                    >
                      <i class="el-icon-document"></i> {{ attachment.name }}
                    </el-tag>
                  </div>
                </div>
              </div>
              
              <div class="message-actions">
                <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                <el-button-group class="action-buttons">
                  <el-tooltip content="重新编辑" placement="top">
                    <el-button type="text" size="mini" icon="el-icon-edit" @click="editMessage(index)"></el-button>
                  </el-tooltip>
                  <el-tooltip content="删除" placement="top">
                    <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteMessage(index)"></el-button>
                  </el-tooltip>
                </el-button-group>
              </div>
            </div>
            <el-avatar :size="36" :src="userAvatar" class="message-avatar">
              {{ userInitial }}
            </el-avatar>
          </div>
        </div>

        <!-- AI 思考中 -->
        <div v-if="isAIThinking" class="thinking-indicator">
          <div class="thinking-avatar">
            <el-avatar :size="36" :src="aiAvatar">
              <i class="el-icon-ai">AI</i>
            </el-avatar>
          </div>
          <div class="thinking-content">
            <div class="thinking-text">AI正在思考中...</div>
            <div class="thinking-animation">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <!-- 工具栏 -->
        <div class="input-toolbar">
          <el-button-group>
            <el-tooltip content="上传图片" placement="top">
              <el-button type="text" icon="el-icon-picture" @click="triggerImageUpload"></el-button>
            </el-tooltip>
            <el-tooltip content="上传文件" placement="top">
              <el-button type="text" icon="el-icon-upload" @click="triggerFileUpload"></el-button>
            </el-tooltip>
            <el-tooltip content="表情" placement="top">
              <el-button type="text" icon="el-icon-chat-line-square" @click="showEmojiPicker"></el-button>
            </el-tooltip>
            <el-tooltip content="语音输入" placement="top">
              <el-button
                type="text"
                :icon="isRecording ? 'el-icon-microphone' : 'el-icon-microphone'"
                :class="{ 'recording': isRecording }"
                @click="toggleVoiceInput"
              ></el-button>
            </el-tooltip>
          </el-button-group>
          
          <!-- 附件预览 -->
          <div v-if="attachments.length" class="attachments-preview">
            <el-tag
              v-for="(attachment, index) in attachments"
              :key="index"
              closable
              @close="removeAttachment(index)"
              size="small"
            >
              <i class="el-icon-picture" v-if="attachment.type === 'image'"></i>
              <i class="el-icon-document" v-else></i>
              {{ attachment.name }}
            </el-tag>
          </div>
        </div>

        <!-- 输入框 -->
        <div class="input-main">
          <el-input
            ref="messageInput"
            v-model="inputMessage"
            type="textarea"
            :rows="3"
            :maxlength="1000"
            placeholder="请输入您的问题..."
            resize="none"
            @keydown.enter.exact.prevent="sendMessage"
            @keydown.enter.shift.exact.prevent="inputMessage += '\n'"
          >
          </el-input>
          
          <!-- 底部操作 -->
          <div class="input-footer">
            <div class="footer-left">
              <el-tooltip content="字数统计" placement="top">
                <span class="char-count">{{ inputMessage.length }}/1000</span>
              </el-tooltip>
            </div>
            <div class="footer-right">
              <el-button
                type="primary"
                :loading="isSending"
                :disabled="!canSend"
                @click="sendMessage"
              >
                <i class="el-icon-send"></i>
                {{ isSending ? '发送中...' : '发送' }}
                <span v-if="!isSending && inputMessage" class="shortcut-hint">(Enter)</span>
              </el-button>
            </div>
          </div>
        </div>

        <!-- 隐藏的文件上传 -->
        <input
          type="file"
          ref="imageInput"
          accept="image/*"
          style="display: none"
          @change="handleImageUpload"
        />
        <input
          type="file"
          ref="fileInput"
          multiple
          style="display: none"
          @change="handleFileUpload"
        />
      </div>
    </div>

    <!-- 侧边栏 -->
    <div class="chat-sidebar">
      <!-- 会话历史 -->
      <div class="history-section">
        <h4>会话历史</h4>
        <el-scrollbar class="history-list">
          <div
            v-for="(history, index) in chatHistory"
            :key="index"
            :class="['history-item', { 'active': history.id === currentChatId }]"
            @click="loadChatHistory(history.id)"
          >
            <div class="history-preview">
              <span class="history-title">{{ history.title }}</span>
              <span class="history-time">{{ formatRelativeTime(history.timestamp) }}</span>
            </div>
            <el-button
              type="text"
              icon="el-icon-delete"
              size="mini"
              @click.stop="deleteHistory(history.id)"
            ></el-button>
          </div>
        </el-scrollbar>
      </div>

      <!-- AI 能力 -->
      <div class="capabilities-section">
        <h4>AI能力</h4>
        <div class="capabilities-grid">
          <div
            v-for="capability in aiCapabilities"
            :key="capability.id"
            class="capability-item"
            @click="sendCapabilityPrompt(capability)"
          >
            <i :class="capability.icon"></i>
            <span>{{ capability.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片预览对话框 -->
    <el-dialog
      :visible.sync="imagePreviewVisible"
      title="图片预览"
      width="60%"
      center
    >
      <img :src="previewImageUrl" style="width: 100%" alt="预览图片">
    </el-dialog>

    <!-- 设置对话框 -->
    <el-dialog
      :visible.sync="settingsVisible"
      title="AI助手设置"
      width="500px"
    >
      <el-form label-width="100px">
        <el-form-item label="AI模型">
          <el-select v-model="settings.model" placeholder="请选择模型">
            <el-option label="通用模型" value="general"></el-option>
            <el-option label="代码模型" value="code"></el-option>
            <el-option label="创意模型" value="creative"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回答温度">
          <el-slider
            v-model="settings.temperature"
            :min="0"
            :max="1"
            :step="0.1"
            show-input
          ></el-slider>
        </el-form-item>
        <el-form-item label="最大长度">
          <el-input-number
            v-model="settings.maxTokens"
            :min="100"
            :max="4000"
            :step="100"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="settingsVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSettings">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AIChat',
  
  data() {
    return {
      // AI 信息
      aiName: '农业助手',
      aiAvatar: '',
      aiOnline: true,
      aiTags: ['智能', '高效', '专业'],
      
      // 用户信息
      userAvatar: '',
      userInitial: 'U',
      
      // 消息列表
      messages: [],
      inputMessage: '',
      isSending: false,
      isAIThinking: false,
      isRecording: false,
      
      // 附件
      attachments: [],
      
      // 设置
      settings: {
        model: 'general',
        temperature: 0.7,
        maxTokens: 1000
      },
      settingsVisible: false,
      
      // 快捷问题
      quickQuestions: [
        '我的水稻叶片有黄斑，可能是什么病虫害？',
        '番茄叶子卷曲皱缩，是什么病？',
        '果树树干流胶，怎么治？',
        '蚜虫不用药，怎么除？'
      ],
      
      // AI 能力
      aiCapabilities: [
        { id: 'code', name: '代码生成', icon: 'el-icon-cpu', prompt: '帮我写一个' },
        { id: 'translate', name: '翻译', icon: 'el-icon-chat-line-round', prompt: '翻译以下内容：' },
        { id: 'summarize', name: '总结', icon: 'el-icon-reading', prompt: '总结以下内容：' },
        { id: 'explain', name: '解释', icon: 'el-icon-question', prompt: '解释一下：' },
        // { id: 'create', name: '创作', icon: 'el-icon-edit-outline', prompt: '创作一篇关于' }
      ],
      
      // 聊天历史
      chatHistory: [
        { id: '1', title: '天气查询', timestamp: new Date(Date.now() - 3600000) },
        { id: '2', title: '小麦病虫害', timestamp: new Date(Date.now() - 86400000) },
        { id: '3', title: '番茄的种植季节', timestamp: new Date(Date.now() - 172800000) }
      ],
      currentChatId: '',
      
      // 预览
      imagePreviewVisible: false,
      previewImageUrl: ''
    }
  },
  
  computed: {
    // 是否可以发送消息
    canSend() {
      return this.inputMessage.trim().length > 0 && !this.isSending
    },
    
    // 显示欢迎消息
    showWelcome() {
      return this.messages.length === 0
    }
  },
  
  mounted() {
    this.loadUserInfo()
    this.scrollToBottom()
  },
  
  watch: {
    messages: {
      handler() {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      },
      deep: true
    },
    
    isAIThinking(val) {
      if (val) {
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }
    }
  },
  
  methods: {
    // 发送消息
    async sendMessage() {
      if (!this.canSend) return
      
      const userMessage = this.inputMessage.trim()
      const attachments = [...this.attachments]
      
      // 添加用户消息
      const userMsg = {
        id: Date.now().toString(),
        role: 'user',
        type: 'text',
        content: userMessage,
        attachments: attachments,
        timestamp: new Date()
      }
      
      this.messages.push(userMsg)
      
      // 清空输入
      this.inputMessage = ''
      this.attachments = []
      
      // 显示AI思考中
      this.isAIThinking = true
      
      // 模拟AI回复
      setTimeout(() => {
        this.receiveAIResponse(userMessage)
      }, 1000 + Math.random() * 1000)
    },
    
    // 接收AI回复
    receiveAIResponse(userMessage) {
      this.isAIThinking = false
      
      // 模拟不同类型的回复
      const responseType = Math.random()
      let aiMessage = {}
      
      if (responseType < 0.3) {
        // 普通文本回复
        aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          type: 'text',
          content: this.generateTextResponse(userMessage),
          timestamp: new Date()
        }
      } else if (responseType < 0.6) {
        // 代码回复
        aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          type: 'code',
          content: this.generateCodeResponse(),
          language: 'python',
          timestamp: new Date()
        }
      } else if (responseType < 0.8) {
        // 表格回复
        aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          type: 'table',
          columns: [
            { prop: 'name', label: '名称', width: 120 },
            { prop: 'value', label: '值', width: 100 },
            { prop: 'description', label: '描述' }
          ],
          data: [
            { name: '温度', value: '25°C', description: '适宜温度' },
            { name: '湿度', value: '60%', description: '适宜湿度' },
            { name: '光照', value: '充足', description: '需要充足光照' }
          ],
          timestamp: new Date()
        }
      } else {
        // 列表回复
        aiMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          type: 'list',
          items: [
            '这是第一条建议',
            '这是第二条建议',
            '这是第三条建议',
            '这是第四条建议'
          ],
          timestamp: new Date()
        }
      }
      
      this.messages.push(aiMessage)
    },
    
    // 生成文本回复
    generateTextResponse(userMessage) {
      const responses = [
        `关于"${userMessage}"，我的理解是：这是一个很好的问题！让我为您详细解答...`,
        `感谢您的提问！"${userMessage}"是一个很有价值的问题，我会尽力为您提供全面的回答。`,
        `针对您提出的"${userMessage}"问题，我有以下几点建议：`,
        `我理解您的问题"${userMessage}"，让我为您分析一下...`,
        `关于"${userMessage}"，这是一个常见的疑问，我将从几个方面为您解释：`
      ]
      return responses[Math.floor(Math.random() * responses.length)]
    },
    
    // 生成代码回复
    generateCodeResponse() {
      return `def hello_world():
    """这是一个示例函数"""
    print("Hello, World!")
    return "Success"

# 使用示例
if __name__ == "__main__":
    result = hello_world()
    print(result)`
    },
    
    // 发送快捷问题
    sendQuickQuestion(question) {
      this.inputMessage = question
      this.sendMessage()
    },
    
    // 发送能力提示
    sendCapabilityPrompt(capability) {
      this.inputMessage = capability.prompt
      this.$refs.messageInput.focus()
    },
    
    // 开始新对话
    startNewChat() {
      this.$confirm('确定要开始新的对话吗？当前对话内容将会保存。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.messages.length > 0) {
          this.saveChatHistory()
        }
        this.messages = []
      })
    },
    
    // 清空聊天
    clearChat() {
      this.$confirm('确定要清空当前对话吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.messages = []
      })
    },
    
    // 显示设置
    showSettings() {
      this.settingsVisible = true
    },
    
    // 保存设置
    saveSettings() {
      this.$message.success('设置已保存')
      this.settingsVisible = false
    },
    
    // 重新生成消息
    regenerateMessage(index) {
      if (index > 0 && this.messages[index - 1].role === 'user') {
        const userMessage = this.messages[index - 1].content
        this.messages.splice(index - 1, 2)
        this.receiveAIResponse(userMessage)
      }
    },
    
    // 编辑消息
    editMessage(index) {
      const message = this.messages[index]
      this.inputMessage = message.content
      this.messages.splice(index, 1)
      this.$refs.messageInput.focus()
    },
    
    // 删除消息
    deleteMessage(index) {
      this.messages.splice(index, 1)
    },
    
    // 反馈消息
    feedbackMessage(message) {
      this.$prompt('请输入您的反馈', '反馈', {
        confirmButtonText: '提交',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message.success('感谢您的反馈！')
      })
    },
    
    // 复制文本
    copyText(text) {
      navigator.clipboard.writeText(text).then(() => {
        this.$message.success('已复制到剪贴板')
      })
    },
    
    // 复制代码
    copyCode(code) {
      this.copyText(code)
    },
    
    // 上传图片
    triggerImageUpload() {
      this.$refs.imageInput.click()
    },
    
    // 上传文件
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },
    
    // 处理图片上传
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.attachments.push({
            type: 'image',
            name: file.name,
            url: e.target.result,
            file: file
          })
        }
        reader.readAsDataURL(file)
      }
      event.target.value = ''
    },
    
    // 处理文件上传
    handleFileUpload(event) {
      const files = Array.from(event.target.files)
      files.forEach(file => {
        this.attachments.push({
          type: 'file',
          name: file.name,
          size: file.size,
          file: file
        })
      })
      event.target.value = ''
    },
    
    // 移除附件
    removeAttachment(index) {
      this.attachments.splice(index, 1)
    },
    
    // 预览图片
    previewImage(url) {
      this.previewImageUrl = url
      this.imagePreviewVisible = true
    },
    
    // 显示表情选择器
    showEmojiPicker() {
      // 这里可以集成表情选择器
      this.$message.info('表情功能开发中')
    },
    
    // 切换语音输入
    toggleVoiceInput() {
      this.isRecording = !this.isRecording
      if (this.isRecording) {
        // 开始录音
        this.$message.info('语音输入开始')
      } else {
        // 停止录音
        this.$message.info('语音输入结束')
      }
    },
    
    // 加载用户信息
    loadUserInfo() {
      // 模拟加载用户信息
      this.userAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
      this.userInitial = '用户'.charAt(0)
    },
    
    // 加载聊天历史
    loadChatHistory(chatId) {
      this.currentChatId = chatId
      this.messages = this.generateMockMessages()
    },
    
    // 删除历史记录
    deleteHistory(chatId) {
      const index = this.chatHistory.findIndex(h => h.id === chatId)
      if (index !== -1) {
        this.chatHistory.splice(index, 1)
      }
    },
    
    // 保存聊天历史
    saveChatHistory() {
      if (this.messages.length > 0) {
        const firstMessage = this.messages[0].content
        const title = firstMessage.length > 20 ? firstMessage.substring(0, 20) + '...' : firstMessage
        
        this.chatHistory.unshift({
          id: Date.now().toString(),
          title: title,
          timestamp: new Date(),
          messages: [...this.messages]
        })
        
        // 限制历史记录数量
        if (this.chatHistory.length > 10) {
          this.chatHistory.pop()
        }
      }
    },
    
    // 滚动到底部
    scrollToBottom() {
      const container = this.$refs.messageList
      if (container) {
        container.scrollTop = container.scrollHeight
      }
    },
    
    // 格式化时间
    formatTime(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    
    // 格式化相对时间
    formatRelativeTime(date) {
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return '刚刚'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
      if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`
      
      return date.toLocaleDateString()
    },
    
    // 格式化消息内容（支持简单Markdown）
    formatMessage(content) {
      if (!content) return ''
      
      // 简单的Markdown转换
      return content
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>')
    },
    
    // 生成模拟消息（用于演示）
    generateMockMessages() {
      return [
        {
          id: '1',
          role: 'user',
          type: 'text',
          content: '你好，请介绍一下你自己',
          timestamp: new Date(Date.now() - 300000)
        },
        {
          id: '2',
          role: 'assistant',
          type: 'text',
          content: '您好！我是AI智能助手，很高兴为您服务。我可以帮您解答问题、提供建议、处理文本、生成代码等。有什么我可以帮助您的吗？',
          timestamp: new Date(Date.now() - 290000)
        },
        {
          id: '3',
          role: 'user',
          type: 'text',
          content: '请帮我写一个Python函数，计算斐波那契数列',
          timestamp: new Date(Date.now() - 280000)
        },
        {
          id: '4',
          role: 'assistant',
          type: 'code',
          content: `def fibonacci(n):
    """计算斐波那契数列的第n项"""
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        a, b = 0, 1
        for _ in range(2, n + 1):
            a, b = b, a + b
        return b

# 使用示例
print(fibonacci(10))  # 输出：55`,
          language: 'python',
          timestamp: new Date(Date.now() - 270000)
        }
      ]
    }
  }
}
</script>

<style scoped>
.ai-chat-container {
  display: flex;
  height: 100vh;
  background: #f5f7fa;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.chat-sidebar {
  width: 280px;
  background: #fafafa;
  border-left: 1px solid #e4e7ed;
  padding: 20px;
  overflow-y: auto;
}

/* 头部样式 */
.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: white;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-avatar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-weight: bold;
}

.ai-info {
  display: flex;
  flex-direction: column;
}

.ai-name {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #67c23a;
}

.status-dot.online {
  background: #67c23a;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.status-text {
  font-size: 12px;
  color: #909399;
}

.ai-tags {
  margin-left: 8px;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
}

.welcome-content {
  max-width: 600px;
  margin: 0 auto;
}

.welcome-avatar {
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 24px;
}

.welcome-text {
  color: #606266;
  margin: 20px 0;
  line-height: 1.6;
}

.quick-questions {
  margin-top: 40px;
}

.question-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 15px;
}

/* 消息项 */
.message-item {
  margin-bottom: 20px;
}

.message-left,
.message-right {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.message-right {
  flex-direction: row-reverse;
}

.message-avatar {
  flex-shrink: 0;
}

.message-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.message-content-wrapper {
  max-width: 70%;
}

.message-content {
  padding: 12px 16px;
  border-radius: 12px;
  position: relative;
}

.message-left .message-content {
  background: white;
  border: 1px solid #e4e7ed;
  border-top-left-radius: 4px;
}

.message-right .message-content {
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-top-right-radius: 4px;
}

.message-text {
  line-height: 1.5;
  word-wrap: break-word;
}

.message-code {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  margin: 8px 0;
  overflow: hidden;
}

.code-header {
  background: #f6f8fa;
  border-bottom: 1px solid #e1e4e8;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #586069;
}

.message-code pre {
  margin: 0;
  padding: 12px;
  overflow-x: auto;
}

.message-code code {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #24292e;
}

.message-table {
  margin: 8px 0;
}

.message-list ul {
  margin: 8px 0;
  padding-left: 20px;
}

.message-list li {
  margin: 4px 0;
  color: #606266;
}

.message-thinking {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 14px;
}

.thinking-dots {
  display: flex;
  gap: 4px;
}

.thinking-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #909399;
  animation: bounce 1.4s infinite ease-in-out both;
}

.thinking-dots span:nth-child(1) { animation-delay: -0.32s; }
.thinking-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
}

/* 消息操作 */
.message-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding: 0 4px;
}

.message-time {
  font-size: 12px;
  color: #909399;
}

.action-buttons {
  opacity: 0;
  transition: opacity 0.2s;
}

.message-item:hover .action-buttons {
  opacity: 1;
}

/* 思考指示器 */
.thinking-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  margin-top: 20px;
}

.thinking-content {
  flex: 1;
}

.thinking-text {
  font-size: 14px;
  color: #606266;
  margin-bottom: 4px;
}

.thinking-animation {
  display: flex;
  gap: 4px;
}

.thinking-animation span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #409eff;
  animation: bounce 1.4s infinite ease-in-out both;
}

.thinking-animation span:nth-child(1) { animation-delay: -0.32s; }
.thinking-animation span:nth-child(2) { animation-delay: -0.16s; }

/* 输入区域 */
.input-area {
  border-top: 1px solid #e4e7ed;
  background: white;
  padding: 16px 24px;
}

.input-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.attachments-preview {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.input-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
}

.char-count {
  font-size: 12px;
  color: #909399;
}

.shortcut-hint {
  font-size: 12px;
  opacity: 0.6;
  margin-left: 4px;
}

/* 侧边栏样式 */
.history-section,
.capabilities-section {
  margin-bottom: 24px;
}

.history-section h4,
.capabilities-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.history-list {
  max-height: 300px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 4px;
}

.history-item:hover {
  background: #f0f2f5;
}

.history-item.active {
  background: #e6f7ff;
  border-left: 3px solid #1890ff;
}

.history-preview {
  flex: 1;
}

.history-title {
  display: block;
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-time {
  font-size: 12px;
  color: #909399;
}

.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.capability-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.capability-item:hover {
  background: #f5f7fa;
  border-color: #409eff;
  transform: translateY(-2px);
}

.capability-item i {
  font-size: 24px;
  color: #409eff;
  margin-bottom: 8px;
}

.capability-item span {
  font-size: 12px;
  color: #606266;
}

/* 附件样式 */
.message-attachments {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.attachment-item {
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .chat-sidebar {
    display: none;
  }
  
  .message-content-wrapper {
    max-width: 85%;
  }
  
  .question-grid {
    grid-template-columns: 1fr;
  }
}
</style>