<template>
  <div class="table-detail">
    <el-table
      v-loading="expandLoading"
      height="100%"
      highlight-current-row
      fit
      :data="tableData"
      :row-key="getRowKeys"
      :expand-row-keys="currentExpandRow"
      @expand-change="expandChange"
    >
      <el-table-column type="expand">
        <template #default="props">
          <span>{{ props.row.content.target }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名字" align="center">
        <template #default="props">
          <span>{{ props.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="年龄" align="center">
        <template #default="props">
          <span>{{ props.row.age }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      expandLoading: false,
      currentExpandRow: [],
      tableData: [
        {
          id: 11,
          name: 'qqqq',
          age: 23,
          content: {
            target: 'ffffffdsafasd'
          }
        },
        {
          id: 12,
          name: 'wwww',
          age: 45,
          content: {
            target: 'rwtehytjytj'
          }
        },
        {
          id: 13,
          name: 'eeee',
          age: 12,
          content: {
            target: 'hghhhhhhhhhhhh'
          }
        },
        {
          id: 14,
          name: 'rrrr',
          age: 32,
          content: {
            target: 'kkkkkkkkkk'
          }
        }
      ]
    }
  },
  methods: {
    getRowKeys(row) {
      return row.id
    },
    expandChange(row, rowList) {
      if (rowList.length) {
        this.expandLoading = true
        // 只展开一行//说明展开了
        this.currentExpandRow = []
        if (row) {
          this.currentExpandRow.push(row.id) // 只展开当前行id
        }
        this.expandLoading = false
      } else {
        // 说明收起了
        this.currentExpandRow = []
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.table-detail {
  width: 100%;
  height: 600px;
  .el-table::v-deep {
    &::before {
      //去除el-table底部的线
      left: 0;
      bottom: 0;
      width: 100%;
      height: 0px;
    }
    thead {
      th,
      tr {
        background: #d8d8d8; //更改头部背景颜色
        color: #ffffff;
      }
    }
  }
}
</style>
