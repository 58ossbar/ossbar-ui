<template>
  <!--备份还原界面-->
  <el-dialog :title="$t('common.backupRestore')" :visible.sync="backupVisible" :close-on-click-modal="false" :modal="false" width="40%">
    <el-table
      v-loading="tableLoading"
      :data="tableData"
      :show-header="showHeader"
      :element-table-loading-text="$t('action.loading')"
      style="width: 100%;font-size:16px;"
      height="330px"
      size="mini">
      <el-table-column :label="$t('common.versionName')" prop="title" header-align="center" align="center"/>
      <el-table-column :label="$t('action.operation')" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleRestore(scope.row)">{{ $t('common.restore') }}</el-button>
          <el-button :disabled="scope.row.name=='backup'?'true':'false'" type="danger" size="mini" @click="handleDelete(scope.row)">{{ $t('action.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="backupVisible = false">{{ $t('action.cancel') }}</el-button>
      <el-button size="small" type="primary" @click="handleBackup">{{ $t('common.backup') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      tableData: [], // 备份记录
      showHeader: false,
      backupVisible: false,
      tableLoading: false,
      baseUrl: this.global.backupBaseUrl
    }
  },
  mounted() {
    this.findRecords()
  },
  methods: {
    // 设置可见性
    setBackupVisible: function(backupVisible) {
      this.backupVisible = backupVisible
    },
    // 查询备份记录
    findRecords: function() {
      this.tableLoading = true
      axios.get(this.baseUrl + '/backup/findRecords').then((res) => {
        res = res.data
        if (res.code === 200) {
          this.tableData = res.data
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
        this.tableLoading = false
      })
    },
    // 数据备份
    handleBackup: function() {
      this.tableLoading = true
      axios.get(this.baseUrl + '/backup/backup').then((res) => {
        res = res.data
        if (res.code === 200) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
        this.tableLoading = false
        this.findRecords()
      })
    },
    // 数据还原
    handleRestore: function(data) {
      this.tableLoading = true
      axios.get(this.baseUrl + '/backup/restore', { params: { name: data.name }}).then((res) => {
        res = res.data
        if (res.code === 200) {
          this.$message({ message: '操作成功', type: 'success' })
          this.$emit('afterRestore', {})
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
        this.tableLoading = false
      })
    },
    // 删除备份
    handleDelete: function(data) {
      this.tableLoading = true
      axios.get(this.baseUrl + '/backup/delete', { params: { name: data.name }}).then((res) => {
        res = res.data
        if (res.code === 200) {
          this.$message({ message: '操作成功', type: 'success' })
        } else {
          this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
        }
        this.findRecords()
        this.tableLoading = false
      })
    }
  }
}
</script>

<style scoped>

</style>
