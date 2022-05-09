<template>
  <div class="clmax">
    <div ref="header" class="safetyMenu" :class="headerFixed ? 'isFixed' : ''">
      <ul class="content">
        <li
          v-for="(item, index) in menuList"
          :key="'menu' + index"
          :class="{ actived: classActive == index }"
          @click="menu_tab(item, index)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div v-for="(item, index) in 100" :key="index + '100'">
      <p>第 {{ item }} 行</p>
    </div>
    <h3 ref="line100" class="line100">第100行</h3>
    <div v-for="(item, index) in 100" :key="index + '200'">
      <p>第 {{ item }} 行</p>
    </div>
    <h3 ref="line200" class="line200">第200行</h3>
    <div v-for="(item, index) in 100" :key="index + '300'">
      <p>第 {{ item }} 行</p>
    </div>
    <h3 ref="line300" class="line300">第300行</h3>
    <div v-for="(item, index) in 100" :key="index + '400'">
      <p>第 {{ item }} 行</p>
    </div>
    <h3 ref="line400" class="line400">第400行</h3>
    <div v-for="(item, index) in 100" :key="index + '500'">
      <p>第 {{ item }} 行</p>
    </div>
    <h3 ref="line500" class="line500">第500行</h3>
    <div v-for="(item, index) in 100" :key="index + '600'">
      <p>第 {{ item }} 行</p>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      offsetTop: 0,
      offsetHeight: 0,
      headerFixed: 0,
      classActive: 0,
      menuList: ['第100行', '第200行', '第300行', '第400行', '第500行'],
      navObj: {
        第100行: 'line100',
        第200行: 'line200',
        第300行: 'line300',
        第400行: 'line400',
        第500行: 'line500'
      }
    }
  },
  mounted() {
    // 获取吸顶元素的dom
    const header = this.$refs.header
    // 吸顶元素到top的距离
    this.offsetTop = header.offsetTop
    // 元素自身的高度
    this.offsetHeight = header.offsetHeight
    // 监听滚动条
    document.querySelector('.clmax').addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    document.querySelector('.clmax').removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    // 切换小标签
    menu_tab(item, index) {
      this.classActive = index
      // this.navObj是dom树上的元素
      const dom = this.$refs[this.navObj[item]]
      // clmax是页面最外面的元素class名,距离window顶部520px
      document.querySelector('.clmax').scrollTop = parseInt(dom.offsetTop) - 30
    },
    // 滚动页面，小标签位置吸顶
    // 使用lodash的throttle节流或debounce防抖时，注意箭头函数的this为undefine
    handleScroll: _.throttle(function() {
      console.log(this)
      // 得到页面滚动的距离，兼容写法
      const scrollTop = document.querySelector('.clmax').scrollTop
      if (scrollTop < this.$refs[this.navObj['第100行']].offsetTop) {
        this.classActive = 0
      } else if (scrollTop < this.$refs[this.navObj['第200行']].offsetTop) {
        this.classActive = 1
      } else if (scrollTop < this.$refs[this.navObj['第300行']].offsetTop) {
        this.classActive = 2
      } else if (scrollTop < this.$refs[this.navObj['第400行']].offsetTop) {
        this.classActive = 3
      } else if (scrollTop < this.$refs[this.navObj['第500行']].offsetTop) {
        this.classActive = 4
      }
      // 判断页面滚动的距离是否大于吸顶元素的位置
      this.headerFixed = scrollTop > this.offsetTop - this.offsetHeight
    }, 500)
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixin.scss';
.clmax {
  width: 100%;
  height: 800px;
  overflow-y: auto;
  .safetyMenu {
    width: 100%;
    height: 80px;
    background-color: #f0f3f8;
    ul {
      @include flex(space-around, center);
      padding: 0;
      li {
        height: 80px;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        line-height: 80px;
        text-align: center;
        cursor: pointer;
      }
    }
    .actived {
      color: lightblue;
    }
  }
  .isFixed {
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 10000;
  }
}
</style>
