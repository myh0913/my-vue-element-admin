import setting from '@/settings'
import storage from 'good-storage'
import { loadAccessToke } from '@/utils/cache'
export const webSokectInit = {
  data() {
    return {
      times: 0,
      socketPath: '',
      path: '',
      socket: ''
    }
  },
  destroyed() {
    if (this.socket) this.socket.close()
  },
  methods: {
    getUrl() {
      this.userToken = loadAccessToke().accesstoken
      this.distributePrefix = setting.wsBaseUrl + storage.get('distributeAPI')
      this.apiPrefix = setting.apiPrefix
      this.socketPath = 'risk-man/vul/verify/socket'
      this.path = location.protocol === 'http:' ? 'ws' : 'wss'
    },
    async init() {
      await this.getUrl()
      if (typeof (WebSocket) === 'undefined') {
        this.$message.error('您的浏览器不支持')
      } else {
        // 实例化socket
        this.socket = new WebSocket(`${this.path}://${location.host}${this.distributePrefix}/${this.apiPrefix}${this.socketPath}`)
        // 监听socket连接
        this.socket.onopen = this.open
        // 监听socket错误信息
        this.socket.onerror = this.error
        // 关闭
        this.socket.onclose = this.close
        // 监听socket消息
        this.socket.onmessage = this.getSocket
      }
    },
    open: function() {
      this.send(this.userToken)
    },
    error: function() {
      if (this.socket.readyState === 3 && this.$route.path !== '/login') {
        this.socket = null
        if (this.times < 2) {
          setTimeout(() => {
            this.times += 1
            this.init()
          }, 30000)
        }
      }
    },
    send: function(params) {
      this.socket.send(params)
    },
    close: function() {
      this.socket.close()
      if (this.socket.readyState === 3 && this.$route.path !== '/login') {
        this.socket = null
        if (this.times < 2) {
          setTimeout(() => {
            this.times += 1
            this.init()
          }, 30000)
        }
      }
    }
  }
}
