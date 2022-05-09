<template>
  <div class="container">
    <h3>数组（含对象）去重</h3>
    <div class="single-util">
      <div class="utilMeta">
        <p>去重前：{{ complexArr }}</p>
        <p>去重后：{{ uniqueArr }}</p>
      </div>
      <ShowUtilHtml :util-html="uniqueHtml" />
    </div>
    <h3>递归</h3>
    <div class="single-util">
      <div class="utilMeta">
        <div>递归目标：{{ recursionObj }}</div>
        <div class="recursionArea">
          <div>
            <p>属性:</p>
            <el-input
              v-model="recursionKey"
              @keyup.enter.native="findRecursion(recursionObj, recursionKey, recursionValue)"
            />
          </div>
          <div style="margin-left: 16px">
            <p>值:</p>
            <el-input
              v-model="recursionValue"
              @keyup.enter.native="findRecursion(recursionObj, recursionKey, recursionValue)"
            />
          </div>
          <el-button @click="findRecursion(recursionObj, recursionKey, recursionValue)">递归</el-button>
        </div>
        <p style="margin-top: 16px">查询结果：{{ recursionResult }}</p>
      </div>
      <ShowUtilHtml :util-html="recursionHtml" />
    </div>
    <h3>监听滚动条是否到底部</h3>
    <div class="single-util">
      <div class="utilMeta">
        <div id="scroll-div">
          <p v-for="(a, index) in 100" :key="index + '100'">{{ a }}</p>
        </div>
        <p id="slipDown">到底啦</p>
      </div>
      <ShowUtilHtml :util-html="scrollHtml" />
    </div>
    <h3>导出文件代码</h3>
    <div class="single-util">
      <ShowUtilHtml :util-html="exportFileHtml" />
    </div>
  </div>
</template>
<script>
import { unique } from '@/utils/myUtils'
import ShowUtilHtml from '@/components/MyComponent/showUtilHtml'
export default {
  components: {
    ShowUtilHtml
  },
  data() {
    return {
      complexArr: [
        { name: 'john' },
        { name: 'red' },
        { name: 'john' },
        { name: 'hand' },
        { name: 'kim' },
        { name: 'john' },
        { name: 'red' }
      ],
      recursionObj: {
        id: '1',
        name: '第1层',
        children: [
          {
            id: '1-1',
            name: '第1-1层',
            children: [
              {
                id: '1-1-1',
                name: '第1-1-1层'
              },
              {
                id: '1-1-2',
                name: '第1-1-2层',
                children: [
                  {
                    id: '1-1-2-1',
                    name: '第1-1-2-1层'
                  }
                ]
              }
            ]
          },
          {
            id: '1-2',
            name: '第1-2层'
          }
        ]
      },
      recursionKey: '',
      recursionValue: '',
      recursionResult: '',
      recursionTimes: '',
      uniqueHtml: `
      methods: {
        unique() {
          var result = []
          var obj = {}
          for (var i = 0; i < arr.length; i++) {
            if (!obj[arr[i][key]]) {
              result.push(arr[i])
              obj[arr[i][key]] = true
            }
          }
          return result
        }
      }`,
      scrollHtml: `
      mounted() {
        const isShowBottom = document.getElementById('slipDown')
        isShowBottom.style.display = 'none'
        // 监听某个dom片段的滚动条使用dom.onscroll；监听整个窗口则使用window.addEventListener('scroll', () => {})
        document.getElementById('scroll-div').onscroll = function() {
          const tempNode = document.getElementById('scroll-div')
          if (tempNode.scrollHeight === tempNode.scrollTop + tempNode.clientHeight) {
            // 这里无法通过v-if或者通过改变变量来切换显示或影藏，冒泡事件被阻断。必须直接改变dom树内容
            isShowBottom.style.display = 'block'
          } else {
            // 这里无法通过v-if或者通过改变变量来切换显示或影藏，冒泡事件被阻断。必须直接改变dom树内容
            isShowBottom.style.display = 'none'
          }
        }
      }`,
      exportFileHtml: `
      //
      downloadAsseetList(self) {
        if (this.partition_id) {
          const option = {
            partition_id: this.partition_id,
            asset_type: this.assetType,
            is_self: self ? 1 : 0,
            time: Math.random(1)
          }
          exportAsset(this.$operate(this.pagePermission, this.apiPermission), storage.get('distributeAPI'), option)
            .then((res) => {
              const that = this // 闭包
              this.sameParams = res // 闭包
              const reader = new FileReader()
              reader.readAsText(res.data) // 将数据读成正常的json
              reader.onload = function(res) {
                if (res.target.result.indexOf('code') !== -1) {
                  // 文件数据中未找到code这个词，则这个数据是二进制流
                  if (JSON.parse(res.target.result).code === 427) {
                    that.$message.error(JSON.parse(res.target.result).msg)
                  }
                } else {
                  // 处理二进制流数据
                  const blob = new Blob([that.sameParams.data], { type: 'application/octet-stream' })
                  const fileName = that.sameParams.headers['content-disposition'].split(';')[1].split('filename=')[1]
                  if ('download' in document.createElement('a')) {
                    const link = document.createElement('a')
                    link.download = fileName
                    link.style.display = 'none'
                    link.href = URL.createObjectURL(blob)
                    document.body.appendChild(link)
                    link.click()
                    URL.revokeObjectURL(link.href)
                    document.body.removeChild(link)
                  } else {
                    navigator.msSaveBlob(blob, fileName)
                  }
                }
              }
            })
            .catch((err) => {
              this.$message.error(err)
            })
        } else {
          this.$message.error('请点击资产组!')
        }
      },
      // 处理文件名
      async downloadRp(row) {
        reportDownload(
          this.$operate(this.pagePermission, this.apiPermission),
          storage.get('distributeAPI'),
          row.report_id
        ).then((res) => {
          const that = this // 闭包
          this.sameParams = res // 闭包
          const fileType = res.data.type.slice(12)
          const reader = new FileReader()
          reader.readAsText(res.data) // 将数据读成正常的json
          if (fileType === 'json') {
            reader.onload = function(res) {
              that.$message.error(decodeURI(JSON.parse(res.target.result).msg))
            }
          } else {
            const blob = new Blob([res.data], { type: 'application/octet-stream' })
            var len = res.headers['content-disposition'].split(';').length
            var fileName =
              len === 3
                ? decodeURI(escape(res.headers['content-disposition'].split(';')[len - 1].split("filename*=UTF-8''")[1]))
                : decodeURI(escape(res.headers['content-disposition'].split(';')[len - 1].split("filename=")[1]))
            // 去掉双引号和id
            fileName = fileName.replace(/(")/g, '')
            const last = fileName.lastIndexOf('_')
            const comfirmName = fileName.slice(0, last) + '.' + fileType
            if ('download' in document.createElement('a')) {
              const link = document.createElement('a')
              link.download = comfirmName
              link.style.display = 'none'
              link.href = URL.createObjectURL(blob)
              document.body.appendChild(link)
              link.click()
              URL.revokeObjectURL(link.href)
              document.body.removeChild(link)
            } else {
              navigator.msSaveBlob(blob, fileName)
            }
          }
        })
      },
      `,
      recursionHtml: `
      findRecursion(obj, key, value) {
        if (!(key && value)) {
          this.$message.warning('请输入属性和值！')
        } else {
          this.recursion([obj], key, value)
        }
      },
      recursion(arr, key, value) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][key] === value) {
            this.recursionResult = arr[i]
          } else if (arr[i]['children'] && arr[i]['children'].length) {
            this.recursion(arr[i]['children'], key, value)
          }
        }
      }`
    }
  },
  computed: {
    // 引用含对象的数组的去重方法
    uniqueArr() {
      return unique(this.complexArr, 'name')
    }
  },
  mounted() {
    this.scrollListener()
  },
  methods: {
    // 监听滚动条方法
    scrollListener() {
      const isShowBottom = document.getElementById('slipDown')
      isShowBottom.style.display = 'none'
      // 监听某个dom片段的滚动条使用dom.onscroll；监听整个窗口则使用window.addEventListener('scroll', () => {})
      document.getElementById('scroll-div').onscroll = function() {
        const tempNode = document.getElementById('scroll-div')
        if (tempNode.scrollHeight === tempNode.scrollTop + tempNode.clientHeight) {
          // 这里无法通过v-if或者通过改变变量来切换显示或影藏，冒泡事件被阻断。必须直接改变dom树内容
          isShowBottom.style.display = 'block'
        } else {
          // 这里无法通过v-if或者通过改变变量来切换显示或影藏，冒泡事件被阻断。必须直接改变dom树内容
          isShowBottom.style.display = 'none'
        }
      }
    },
    // 递归方法
    findRecursion(obj, key, value) {
      if (!(key && value)) {
        this.$message.warning('请输入属性和值！')
      } else {
        this.recursion([obj], key, value)
      }
    },
    recursion(arr, key, value) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) {
          this.recursionResult = arr[i]
        } else if (arr[i]['children'] && arr[i]['children'].length) {
          this.recursion(arr[i]['children'], key, value)
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixin.scss';
.container {
  @include flex(flex-start, flex-start, column);
  .single-util {
    width: 100%;
    height: auto;
    border: 1px solid lightgray;
    border-radius: 4px;
    .utilMeta {
      width: 100%;
      height: auto;
      padding: 20px;
      border-bottom: 1px solid lightgray;
      #scroll-div {
        width: 200px;
        height: 200px;
        overflow-y: auto;
      }
    }
  }
}
.recursionArea {
  @include flex(flex-start);
  width: 800px;
  margin-top: 16px;
  > div {
    @include flex(flex-start);
    width: 350px;
    p {
      width: 40px;
    }
    .el-input {
      width: 270px;
    }
  }
  .el-button {
    margin-left: 16px;
  }
}
h3 {
  margin: 16px 0 8px 0;
}
</style>
