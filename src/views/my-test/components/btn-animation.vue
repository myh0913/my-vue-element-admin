<template>
  <div class="test-div" style="--temp" @click="handleClick">
    <div>测试</div>
  </div>
</template>
<script>
export default {
  name: 'Animation',
  data() {
    return {
      color: '#1890ff'
    }
  },
  methods: {
    handleClick() {
      document.documentElement.style.setProperty('--temp', this.color)
    }
  }
}
</script>
<style lang="scss" scoped>
.test-div {
  position: relative;
  padding: 6px;
  width: 100px;
  height: 50px;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  div {
    position: absolute;
    z-index: 2;
    width: calc(100% - 12px);
    height: calc(100% - 12px);
    text-align: center;
    line-height: 38px;
    color: var(--temp, #ffffff);
    background: #333333;
  }
  &::before {
    position: absolute;
    top: 0;
    left: 0;
    content: '';
    width: 200%;
    height: 100%;
    background: linear-gradient(115deg, #44ce7b, #fad648, #a767e5, #12bcfe, #44ce7b, #fad648);
    background-size: 50% 100%;
  }
  &:hover {
    &::before {
      animation: test linear 1s infinite;
    }
    @-webkit-keyframes test {
      0% {
        left: 0;
      }
      100% {
        left: -100%;
      }
    }
    @keyframes test {
      0% {
        left: 0;
      }
      100% {
        left: -100%;
      }
    }
  }
}
</style>
