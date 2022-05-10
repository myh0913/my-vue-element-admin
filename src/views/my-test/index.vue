<template>
  <div class="my-test-container">
    <div class="component-list">
      <el-dropdown @command="commonComponent">
        <el-button type="primary">
          通用组件列表
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="utils-test">常用方法</el-dropdown-item>
          <el-dropdown-item command="father-sync">组件通信</el-dropdown-item>
          <el-dropdown-item command="topology-demo">AntV G6拓扑图demo</el-dropdown-item>
          <el-dropdown-item command="d3-demo">d3 demo</el-dropdown-item>
          <el-dropdown-item command="g6-demo">g6 demo</el-dropdown-item>
          <el-dropdown-item command="echarts-demo">echarts demo</el-dropdown-item>
          <el-dropdown-item command="prevent-click">vue全局挂载防暴力点击通用方法</el-dropdown-item>
          <el-dropdown-item command="md5">md5加密</el-dropdown-item>
          <el-dropdown-item command="lazy">懒加载</el-dropdown-item>
          <el-dropdown-item command="scroll-top">吸顶菜单</el-dropdown-item>
          <el-dropdown-item command="signed-place">跳转到了一个页面指定位置</el-dropdown-item>
          <el-dropdown-item command="click-outside">点击div以外区域关闭div</el-dropdown-item>
          <el-dropdown-item command="right-menu">右键菜单</el-dropdown-item>
          <el-dropdown-item command="table-detail">table同时只展开一行详情</el-dropdown-item>
          <!-- <el-dropdown-item divided>蚵仔煎</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="sysComponent">
        <el-button type="primary">
          系统组件列表
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="system">系统提示框</el-dropdown-item>
          <el-dropdown-item command="redirect">强制刷新当前页面（redirect）</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="commonComponent">
        <el-button type="primary">
          样式组件列表
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="drag-dialog">可拖拽弹窗</el-dropdown-item>
          <el-dropdown-item command="list-animation">列表加载动画</el-dropdown-item>
          <el-dropdown-item command="btn-animation">按钮动画</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown @command="commonComponent">
        <el-button type="primary">
          系统样式列表
          <i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="font-family">字体文件</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="component-container">
      <keep-alive>
        <component :is="currentComponent" />
      </keep-alive>
    </div>
  </div>
</template>
<script>
import Md5 from './components/md5'
import FatherSync from './components/father-sync'
import PreventClick from './components/prevent-click'
import TopologyDemo from './components/topology-demo'
import D3Demo from './components/d3-demo'
import G6Demo from './components/g6-demo'
import EchartsDemo from './components/echarts-demo'
import Lazy from './components/lazy'
import UtilsTest from './components/utils-test'
import ScrollTop from './components/scroll-top'
import SignedPlace from './components/signed-place'
import ClickOutside from './components/click-outside'
import RightMenu from './components/right-menu'
import TableDetail from './components/table-detail'
import ListAnimation from './components/list-animation'
import FontFamily from './components/font-family'
import DragDialog from './components/drag-dialog'
import BtnAnimation from './components/btn-animation'
export default {
  name: 'MyTest',
  components: {
    Md5,
    FatherSync,
    PreventClick,
    TopologyDemo,
    D3Demo,
    G6Demo,
    EchartsDemo,
    Lazy,
    UtilsTest,
    ScrollTop,
    SignedPlace,
    ClickOutside,
    RightMenu,
    TableDetail,
    ListAnimation,
    FontFamily,
    DragDialog,
    BtnAnimation
  },
  data() {
    return {
      currentComponent: ''
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   if ()
  //   console.log(from)
  //   console.log(to)
  // },
  methods: {
    // 饿了么系统提示框，样式在element-ui.scss
    confirmDel() {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        cancelButtonClass: 'btn-custom-cancel'
      })
        .then(async() => {
          console.log('do something')
        })
        .catch(() => {
          console.log('error')
        })
    },
    // 通用组件
    commonComponent(command) {
      this.currentComponent = command
    },
    // 系统组件
    sysComponent(command) {
      switch (command) {
        case 'system': {
          this.confirmDel()
          break
        }
        case 'redirect': {
          const { fullPath } = this.$route
          this.$router.replace({
            // 也可以push当前路径，但会加一个query，比如以时间作为唯一的标识，保证url不同，达到强制刷新效果
            path: '/redirect' + fullPath
          })
          break
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixin.scss';

.my-test-container {
  @include flex(flex-start, flex-start, row);
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow-y: auto;
  .component-list {
    width: 180px;
    height: 100%;
    border-right: 1px solid lightblue;
    .el-dropdown {
      margin-bottom: 16px;
    }
  }
  .component-container {
    width: calc(100% - 180px);
    height: 100%;
    padding: 16px;
  }
}
</style>
