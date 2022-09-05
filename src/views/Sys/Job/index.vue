<template>
  <div>
    <el-container class="page-container scrollAllY ">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!-- 工具栏 -->
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px" label-position="right">
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>Bean名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input v-model="filters.beanName" placeholder="Bean名称" clearable/>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span> 方法名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input v-model="filters.methodName" placeholder="方法名称" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :loading="loadingQuery" :label="$t('action.search')" icon="fa fa-search" perms="sys:tsyspost:query" type="primary" @click="findPage()"/>
              <cb-button :label="$t('action.add')" icon="fa fa-search" perms="sys:tsysserialno:query" type="primary" @click="handleAdd()"/>
              <cb-button :label="$t('action.stop')" icon="fa fa-lemon-o" perms="sys:job:pause" type="primary" @click="handleStop" />
              <cb-button :label="$t('action.recovery')" icon="fa fa-shower" perms="sys:job:resume" type="primary" @click="handleRecovery" />
              <cb-button :label="$t('action.execute')" icon="fa fa-flag-o" perms="sys:job:run" type="primary" @click="handleExecute" />
              <cb-button :label="$t('action.loglist')" icon="fa fa-flag-o" perms="sys:job:query" type="primary" @click="handleLogList" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <!--表格内容栏-->
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <cb-table
          :parent-vue="_self"
          :data="pageResult"
          :columns="columns"
          :btn-columns="btnColumns"
          perms-batch-delete="sys:tsyspost:remove"
          row-key="postId"
          @findPage="findPage"
          @toggleRowSelection="toggleRowSelection"
          @selectionChange="selectionChange"
          @handleEdit="handleEdit"
          @handleBatchDelete="handleBatchDelete"/>
      </el-main>
    </el-container>
    <save-form ref="saveForm" @ok="handleOk" />
  </div>
</template>

<script>
import CbTable from '@/views/Core/CbTable'
import CbButton from '@/views/Core/CbButton'
import SaveForm from './SaveForm.vue'
export default {
  components: {
    CbTable,
    CbButton,
    SaveForm
  },
  data() {
    return {
      size: 'small',
      filters: {
        postType: '',
        postName: ''
      },
      loadingQuery: false,
      pageRequest: {},
      pageResult: {},
      columns: [
        { prop: 'beanName', label: 'Bean名称', minWidth: 100 },
        { prop: 'methodName', label: '方法名称', minWidth: 100 },
        { prop: 'cronExpression', label: 'cron表达式', minWidth: 120 },
        { prop: 'params', label: '参数', minWidth: 100 },
        { prop: 'remark', label: '备注', minWidth: 100 }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'sys:tsyspost:edit', callback: 'handleEdit' },
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:tsyspost:remove', callback: 'handleDelete' }
      ]
    }
  },
  methods: {
    findPage(data) {
      this.loadingQuery = true
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      this.filters.page = this.pageRequest.pageNum
      this.filters.limit = this.pageRequest.pageSize
      this.$api.job.findPage(this.filters).then(res => {
        this.pageResult = res.data
        this.loadingQuery = false
      }).then(data != null ? data.callback : '')
    },
    handleAdd() {
      this.$refs.saveForm.handleAdd()
    },
    handleEdit(row) {
      this.$refs.saveForm.handleEdit(row)
    },
    handleOk(data) {
      this.findPage()
    },
    selectionChange() {},
    toggleRowSelection() {},
    handleDelete(row) {
      this.handleBatchDelete([row.postId])
    },
    handleBatchDelete(ids) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.post.batchDelete(ids).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message({ message: '操作成功', type: 'success' })
            this.findPage()
          }
        }).catch(() => {
          this.$message({ type: 'error', message: '删除失败,接口异常' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '删除未成功' })
      })
    },
    // 暂停
    handleStop() {},
    // 恢复
    handleRecovery() {},
    // 立即执行
    handleExecute() {},
    // 日志列表
    handleLogList() {}
  }
}
</script>

<style>

</style>
