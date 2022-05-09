<template>
  <div class="container">
    <Sync :age.sync="myAge" :name="myName" type="danger" @click="clickSon">
      <template v-slot:comAge>
        <p>这是父组件，获取到的子组件的值：{{ myAge }}</p>
      </template>
      <template v-slot:comName>
        <p>这是父组件，父组件获取子组件的值：{{ myName }}</p>
        <el-button @click="changeName">父组件方法，直接点击修改子组件暴露出来的name</el-button>
      </template>
      <template v-slot:comSource>
        <el-button @click="changeSource">这是祖先组件，修改source</el-button>
      </template>
    </Sync>
  </div>
</template>

<script>
import Sync from '@/components/MyComponent/sync'
export default {
  name: 'SonToFather',
  components: {
    Sync
  },
  provide() {
    return {
      source: this.obj
    }
  },
  data() {
    return {
      myAge: '',
      myName: '',
      obj: {
        num: 0
      },
      time: ''
    }
  },
  deactivated() {
    console.log('和keep-alive配合使用')
  },
  created() {
    this.time = setInterval(() => {
      this.obj.num += 1
    }, 1000)
  },
  destroyed() {
    clearInterval(this.time)
  },
  methods: {
    clickSon(value) {
      this.myName = '用子组件暴露的方法点了一下'
    },
    changeName() {
      this.myName = '在父组件修改子组件的值'
    },
    changeSource() {
      this.obj.num = 0
    }
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 8px 0;
}
</style>
