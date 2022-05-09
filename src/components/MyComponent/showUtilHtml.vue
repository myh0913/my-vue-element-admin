<template>
  <div>
    <el-collapse-transition>
      <pre v-show="htmlContent">{{ utilHtml }}</pre>
    </el-collapse-transition>
    <div v-show="!htmlContent" class="bottomArea" @click="isShowHtml">
      <i class="el-icon-caret-bottom" />
      <span>显示代码</span>
    </div>
    <div v-show="htmlContent" class="bottomArea" @click="isShowHtml">
      <i class="el-icon-caret-top" />
      <span>隐藏代码</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    utilHtml: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      htmlContent: false
    }
  },
  methods: {
    isShowHtml() {
      this.htmlContent = !this.htmlContent
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
@import '@/styles/mixin.scss';
.bottomArea {
  @include flex(center);
  width: 100%;
  height: 44px;
  cursor: pointer;
  i {
    color: #d3dce6;
  }
  span {
    color: #d3dce6;
    margin-left: 36px;
    transition: all 0.5s;
    opacity: 0;
  }
  &:hover {
    background: #fafafa;
    i {
      color: $menuActiveText;
    }
    span {
      color: $menuActiveText;
      transform: translateX(-20px);
      opacity: 1;
    }
  }
}
pre {
  border-bottom: 1px solid lightgray;
  padding-bottom: 16px;
  background: #fafafa;
  color: #3182bd;
}
</style>
