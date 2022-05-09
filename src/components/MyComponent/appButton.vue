<template>
  <el-button
    class="magi-button"
    :disabled="disabled"
    :class="btnStyle"
    :style="{ width: width, height: height }"
    @click="click"
  >
    <svg-icon v-if="icon" class="btnicon" :icon-class="icon" />
    {{ content }}
  </el-button>
</template>

<script>
// icon 文字前的标签
// btnStyle - gray 边框字体灰色/ blue 边框字体蓝色/ primary 白色字体蓝色背景
// 按钮的高度默认40px
export default {
  name: 'AppBtn',
  props: {
    content: {
      type: String,
      default: '请输入标题'
    },
    btnStyle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    width: {
      type: [String, Number],
      default: 'auto'
    },
    height: {
      type: [String, Number],
      default: '40px'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // widthVar: '',
      // heightVar: ''
    }
  },
  // mounted() {
  //   this.handleWinFocus()
  //   window.addEventListener('resize', this.handleWinFocus)
  // },
  methods: {
    click() {
      this.$emit('click')
    }
    // handleWinFocus() {
    //   this.widthVar = (this.width * window.innerWidth) / 1920 + 'px'
    //   this.heightVar = (this.height * window.innerWidth) / 1920 + 'px'
    // }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variable.scss';
.magi-button::v-deep {
  @include flex(center, center, row);
  border-radius: 4px;
  padding: 0;
  margin-left: 20px;
  .btnicon {
    height: 20px;
    width: 20px;
  }
}
.gray {
  border: 1px solid #e4e7ed;
  color: #999999;
  background: $white;
  &:hover {
    border: 1px solid #51b4ff;
  }
  &:active {
    border: 1px solid #116fdb;
  }
  &:disabled {
    color: $white;
    background: #c0c4cc;
    border: 1px solid #c0c4cc;
  }
}
.primary {
  border: 1px solid $antBlue;
  color: $white;
  background: $antBlue;
  &:hover {
    background: #116fdb;
    border: 1px solid #116fdb;
  }
  &:active {
    background: #51b4ff;
    border: 1px solid #51b4ff;
  }
  &:disabled {
    color: $white;
    background: #c0c4cc;
    border: 1px solid #c0c4cc;
  }
}
.blue {
  border: 1px solid $antBlue;
  color: $antBlue;
  background: $white;
  &:hover {
    color: #51b4ff;
    border: 1px solid #51b4ff;
  }
  &:active {
    color: #116fdb;
    border: 1px solid #116fdb;
  }
  &:disabled {
    color: $white;
    background: #c0c4cc;
    border: 1px solid #c0c4cc;
  }
}
</style>
