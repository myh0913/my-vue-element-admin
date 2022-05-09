<template>
  <div>
    <el-button @click="jumpTo('here')">跳转到指定页面的，class名为'here'的地方</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    jumpTo(name) {
      this.$router.push({
        path: './unimportantPage',
        query: {
          className: name
        }
      })
    }
  }
}
</script>
