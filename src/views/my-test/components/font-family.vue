<template>
  <div>
    <div class="font-test1">这是字体文件1</div>
    <div class="font-test2">这是字体文件2</div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
@font-face {
  font-family: 'test1';
  src: url('../../../assets/font/test1.ttf');
}
@font-face {
  font-family: 'test2';
  src: url('../../../assets/font/test2.otf');
}
.font-test1 {
  font-family: 'test1';
  font-size: 50px;
}
.font-test2 {
  font-family: 'test2';
  font-size: 50px;
}
</style>
