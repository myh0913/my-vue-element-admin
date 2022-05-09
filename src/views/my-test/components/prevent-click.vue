<template>
  <div class="container">
    <p>在main.js中全局注册utils里的prevent-click.js。</p>
    <el-button v-preventReClick @click="showContent">防暴力点击</el-button>
    <p v-for="(item, index) in clickList" :key="index + 'clickList'">这是第{{ item }}次点击</p>
  </div>
</template>
<script>
export default {
  data() {
    return {
      clickCount: 0,
      clickList: []
    }
  },
  methods: {
    showContent() {
      this.clickCount += 1
      this.clickList.push(this.clickCount)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixin.scss';
.container {
  @include flex(flex-start, center, column);
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
