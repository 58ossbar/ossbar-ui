<template>
  <div class="page-container" >
    <el-container class="page-container scrollAllY">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px">
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>角色名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-input
                  v-model="filters.roleName"
                  placeholder="请输入角色名称"
                  name="roleName"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>所属机构</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <cb-tree
                  :parent-vue="_self"
                  :filters="filters"
                  :change="findPage"
                  :prop="{id: 'orgId', name: 'orgName'}"
                  url="/api/sys/org/getOrgTree"
                  placeholder="请选择所属机构"
                  name="orgId"
                  default-expanded-level="1"
                />
                <!-- prop="{&quot;id&quot;:&quot;orgId&quot;, &quot;name&quot;:&quot;orgName&quot;}" -->
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>角色状态</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth ">
                <el-select v-model="filters.status" clearable placeholder="请选择角色状态" style="width: 100%" @clear="findPage()" @change="findPage">
                  <el-option
                    v-for="item in optionsForStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
              </el-form-item>
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
          perms-batch-delete="sys:tsyspost:add"
          row-key="roleId"
          @findPage="findPage"
          @handleBatchDelete="handleBatchDelete"/>
      </el-main>
    </el-container>
  </div>
</template>
<script>
import CbTable from '@/views/Core/CbTable'
import CbButton from '@/views/Core/CbButton'
export default {
  components: {
    CbTable,
    CbButton
  },
  data() {
    return {
      size: 'mini',
      filters: {
        // 角色名称
        roleName: '',
        // 角色状态
        status: ''
      },
      loadingQuery: false,
      loading: false,
      pageRequest: {},
      // 表格数据
      pageResult: {},
      columns: [
        { prop: 'postType', label: '岗位类型', minWidth: 60 },
        { prop: 'postName', label: '岗位名称', minWidth: 60 },
        { prop: 'sort', label: '排序号', minWidth: 60 },
        { prop: 'remark', label: '岗位描述', minWidth: 80 },
        { prop: 'createUserId', label: '创建人', minWidth: 70 },
        { prop: 'createTime', label: '创建时间', minWidth: 90 },
        { prop: 'updateUserId', label: '修改人', minWidth: 70 },
        { prop: 'updateTime', label: '修改时间', minWidth: 90 }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'book:tevglbookmajor:edit', callback: 'handleEdit' },
        { icon: 'fa fa-long-arrow-up', label: '上移', perms: 'book:tevglbookmajor:content', callback: 'handleMoveUp', moveType: 'moveUp', title: '修改排序号' },
        { icon: 'fa fa-long-arrow-down', label: '下移', perms: 'pkg:tevglpkginfo:changePackage', callback: 'handleMoveDown', moveType: 'moveDown', title: '修改排序号' },
        { icon: 'fa fa-trash', label: '删除', perms: 'book:tevglbookmajor:remove', callback: 'handleDelete' }
      ],
      optionsForStatus: [{ value: '1', label: '正常' }, { value: '0', label: '禁用' }]
    }
  },
  methods: {
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
      this.$api.role.findPage(this.filters).then(res => {
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
    }
  }
}
</script>
