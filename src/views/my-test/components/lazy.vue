<template>
  <div class="container">
    <el-table class="expandTable" :data="expandedList" max-height="300px" fit>
      <el-table-column width="300" label="num" prop="num" align="center">
        <template #default="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- <ul v-infinite-scroll="load" class="infinite-list">
      <li v-for="(item, index) in count" :key="index + 'count'" class="infinite-list-item">{{ item }}</li>
    </ul> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      expandedList: []
      // count: 0
    }
  },
  mounted() {
    this.getList(20)
  },
  methods: {
    // url详情接口
    getList(item) {
      const temp = []
      for (let i = 0; i < item; i++) {
        temp.push({ num: i + 1 })
      }
      this.expandedList = this.expandedList.concat(temp)
      // 懒加载关键语句
      this.$nextTick(() => {
        var dom = document.querySelectorAll('.el-table')[0].querySelector('.el-table__body-wrapper')
        window.addEventListener(
          'scroll',
          () => {
            const scrollDistance = dom.scrollHeight - dom.scrollTop - dom.clientHeight
            if (scrollDistance <= 0) {
              this.getList(10)
            }
          },
          true
        )
      })
    }
    // 饿了么自带懒加载
    // load() {
    //   this.count += 3
    // }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  .expandTable {
    width: 300px;
  }
  .infinite-list {
    overflow: auto;
    height: 300px;
    .infinite-list-item {
      width: 100%;
      height: 40px;
      line-height: 40px;
      margin-top: 10px;
      text-align: center;
      color: #7dbcfc;
      background: #e8f3fe;
    }
  }
}
</style>
