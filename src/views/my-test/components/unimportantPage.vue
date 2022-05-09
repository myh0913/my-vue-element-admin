<template>
  <div class="container">
    <p v-for="(item, index) in 80" :key="index + '80'">{{ item }}</p>
    <div ref="here">
      hello！ 就是要跳转这里
      <el-button @click="$router.go(-1)">返回</el-button>
    </div>
    <p v-for="(item, index) in 60" :key="index + '60'">{{ item }}</p>
  </div>
</template>
<script>
export default {
  mounted() {
    if (this.$route.query.className) {
      const className = this.$route.query.className
      const targetOffsetTop = this.$refs[className].offsetTop
      // 外层容器必须要有固定高度，且要有overflow是自动
      document.querySelector('.container').scrollTop = targetOffsetTop
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 600px;
  padding: 20px;
  overflow-y: auto;
}
</style>
