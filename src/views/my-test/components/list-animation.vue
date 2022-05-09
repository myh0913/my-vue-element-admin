<template>
  <div>
    <el-table :data="tableData" height="400">
      <el-table-column label="哦哦哦" prop="time">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="哈哈哈" prop="num">
        <template slot-scope="scope">
          <span>{{ scope.row.num }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="list">
      <p v-for="(item, index) in tableData" :key="index + 'newList'">
        <span>{{ item.time }}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: []
    }
  },
  created() {
    this.tableData = []
    for (let i = 0; i < 100; i++) {
      this.tableData.push({
        time: new Date(),
        num: Math.random() * 100
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.el-table::v-deep {
  @include listAnimation();
  @include hideTableBottomLine();
  thead {
    tr th {
      background: #f4f4f5;
    }
  }
}
.list::v-deep {
  @include listAnimation('p');
  height: 300px;
  line-height: 24px;
  margin-top: 16px;
  overflow-y: auto;
}
</style>
