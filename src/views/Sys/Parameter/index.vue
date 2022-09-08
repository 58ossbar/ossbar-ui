<template>
  <div>
    <el-container class="page-container scrollAllY">
      <el-aside width="240px" class="box_shadows bgcolor LeftPadding marginBottom">
        <div class="displayFlex marginBottom">
          <el-input
            v-model="filterText"
            class="buttomMargin"
            size="small"
            placeholder="输入字典名称查询"
            suffix-icon="el-icon-search"
            clearable
            maxlength="30"
            type="text" />
        </div>
        <el-tree
          v-loading="loadingTree"
          ref="dictTree"
          :data="listData"
          :highlight-current="true"
          :props="{label: 'paraname', children: 'list'}"
          :filter-node-method="filterNode"
          :element-loading-text="$t('action.loading')"
          node-key="paraid"
          @node-click="handleSelectDeptTree" />
      </el-aside>
      <el-container>
        <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
          <!--工具栏-->
          <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm textAlign" label-width="100px" label-position="right">
            <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
              <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>参数key</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input v-model="filters.paraKey" maxlength="30" type="text" placeholder="参数key" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>参数值</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input v-model="filters.parano" maxlength="100" type="text" placeholder="参数值" clearable/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse>
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button :loading="loadingQuery" :label="$t('action.search')" icon="fa fa-search" perms="sys:tsysdict:query" type="primary" @click="findPage()"/>
                <cb-button :label="$t('action.add')" icon="fa fa-plus" type="primary" perms="sys:tsysdict:add" @click="handleAdd" />
              </el-col>
            </el-row>

          </el-form>
        </el-header>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <cb-table
            ref="table"
            :parent-vue="_self"
            :data="pageResult"
            :columns="columns"
            :btn-columns="btnColumns"
            perms-batch-delete="sys:tsyspost:add"
            row-key="dictId"
            @findPage="findPage"
            @selectionChange="handleSelectionChange"
            @handleBatchDelete="handleBatchDelete"/>
        </el-main>
      </el-container>
    </el-container>
    <!-- 新增修改字典界面 -->
    <SaveForm ref="saveForm" @ok="handleOk" />
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
        // 参数类型
        paraType: '',
        // 参数key
        paraKey: '',
        // 参数值
        parano: ''
      },
      loadingQuery: false,
      pageRequest: {},
      // 表格数据
      pageResult: {},
      columns: [
        { prop: 'paraname', label: '参数名称', minWidth: 105 },
        { prop: 'paraType', label: '参数标识符', minWidth: 110 },
        { prop: 'paraKey', label: '参数key', minWidth: 105 },
        { prop: 'parano', label: '参数值', minWidth: 85 },
        { prop: 'paraorder', label: '排序号', minWidth: 85 },
        { prop: 'isdefault', label: '是否默认', minWidth: 95 }, // 0是默认
        { prop: 'displaysort', label: '显示方式', minWidth: 95 } // 0是显示
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'sys:role:edit', callback: 'handleEdit' },
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:role:remove', callback: 'handleDelete' }
      ],
      // 表格中被选中的列数据
      selections: [],
      // 左侧搜索
      filterText: '',
      loadingTree: false,
      listData: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.dictTree.filter(val)
    }
  },
  mounted() {
    this.findTreeData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.paraname.indexOf(value) !== -1
    },
    handleSelectDeptTree(data) {
      this.filters.paraType = data.paraType
      this.findPage()
    },
    findTreeData(dictId) {
      this.loadingTree = true
      this.$api.parameter.findTree().then(res => {
        this.loadingTree = false
        if (res.code === 0) {
          this.listData = res.data
          // 选中指定节点
          this.$nextTick(() => {
            if (dictId) {
              this.$refs.dictTree.setCurrentKey(dictId)
            }
          })
        }
      })
    },
    findPage: function(data) {
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      // 当前页
      this.filters.page = this.pageRequest.pageNum
      // 每页显示数
      this.filters.limit = this.pageRequest.pageSize
      this.loadingQuery = true
      this.$api.parameter.findPage(this.filters).then(res => {
        this.pageResult = res.data
        this.loadingQuery = false
      }).then(data != null ? data.callback : '')
    },
    handleAdd() {
      // const currData = this.$refs.dictTree.getCurrentNode()
      // if (currData == null) {
      //   this.$message({ message: '请先在左侧选择一条目录再新增字典!', type: 'warning' })
      //   return false
      // }
      this.$refs.saveForm.handleAdd()
    },
    handleEdit(row) {
      this.$refs.saveForm.handleEdit(row, this.dataLeftTree)
    },
    handleOk(data) {
      this.findPage()
    },
    handleDelete(row) {
      this.handleBatchDelete([row.dictId])
    },
    handleBatchDelete(ids) {
      if (!ids || !ids.length) {
        return false
      }
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.dict.batchDelete(ids).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message({ message: '操作成功', type: 'success' })
            this.findTreeData()
            this.filters.parentType = ''
            this.findPage()
          }
        }).catch(() => {
          this.$message({ type: 'error', message: '删除失败,接口异常' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '删除未成功' })
      })
    },
    handleSelectionChange(rows) {
      this.selections = rows
    },
    handleAddType() {
      this.$refs.saveTypeForm.handleAdd(this.dataLeftTree)
    },
    handleEditType(data) {
      this.$refs.saveTypeForm.handleEdit(data)
    },
    handleOkType(submitData) {
      this.findTreeData(submitData.dictId)
      this.filters.parentType = submitData.dictId
      this.findPage()
    },
    mouseenters: function(data) {
      data.iconStyleI = false
    },
    mouseleaves: function(data) {
      data.iconStyleI = true
    },
    mouseenter: function(data) {
      data.ulStyle = false
    },
    mouseleave: function(data) {
      data.ulStyle = true
    }
  }
}
</script>

<style>

</style>
