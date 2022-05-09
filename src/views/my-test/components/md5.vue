<template>
  <div class="container">
    <p>加密前：{{ beforeTranslate }}</p>
    <p>加密后：{{ afterTranslate }}</p>
  </div>
</template>
<script>
import md5 from 'js-md5' // md5加密
export default {
  data() {
    return {
      beforeTranslate: 'qwert12345'
    }
  },
  computed: {
    afterTranslate() {
      return md5(this.beforeTranslate)
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}
</style>
