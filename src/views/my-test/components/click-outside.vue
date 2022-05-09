<template>
  <div class="container">
    <el-button @click.stop="isAnswer = true">打开div</el-button>
    <div v-if="isAnswer" class="msgDialog target">
      <h3 class="target">提示!</h3>
      <h4 class="target">将回到登录页面，是否继续？</h4>
      <div class="msgDialog-buttons target">
        <el-button class="target">确认</el-button>
        <el-button class="target">取消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isAnswer: false
    }
  },
  mounted() {
    // addEventListener的第三个参数是判断冒泡型事件流还是捕获型事件流
    // 第三个参数：false为阻止冒泡(DOM树的叶子到根), true为事件捕获(DOM树的根到叶子)
    // 在冒泡型事件流中，是li > ul > div > body > html > document
    // 在捕获型事件流中，是document > html > body> div > ul > li
    // 如：window.addEventListener('click', this.clickOutside, false)
    window.addEventListener('click', this.clickOutside)
  },
  destroyed() {
    window.removeEventListener('click', this.clickOutside)
  },
  methods: {
    clickOutside(e) {
      // 阻止冒泡,与上面addEventListener第三个参数为false时作用相同
      e.stopPropagation()
      // 为dialog中所有可点到的标签元素加上相同的class，阻止冒泡后，点击的必然是叶子最上层
      // 此时，如果点击的元素不包含这个class，则说明点到了目标外部的元素
      if (this.isAnswer && !e.target.className.includes('target')) {
        this.isAnswer = false // 点击其他区域关闭
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixin.scss';
.container {
  @include flex(flex-start, center, column);
  width: 300px;
  height: 202px;
  background: #fafafa;
  .msgDialog {
    width: 100%;
    height: 150px;
    padding: 12px;
    margin-top: 16px;
    border: 1px solid lightgray;
    border-radius: 4px;
    .msgDialog-buttons {
      @include flex(center);
      margin-top: 50px;
    }
  }
}
</style>
