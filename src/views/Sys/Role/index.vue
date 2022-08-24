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
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :label="$t('action.search')" :loading="loadingQuery" icon="fa fa-search" perms="sys:role:query" type="primary" @click="findPage()"/>
              <cb-button :label="$t('action.add')" icon="fa fa-plus" perms="sys:role:add" type="primary" @click="handleAdd" />
              <cb-button :label="$t('action.assignUsers')" icon="fa fa-user-o" perms="sys:role:setUser" type="primary" @click="handleAssignUsers" />
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
    <!-- 新增/修改页面 -->
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
      size: 'mini',
      filters: {
        // 角色名称
        roleName: '',
        // 角色状态
        status: ''
      },
      loadingQuery: false,
      pageRequest: {},
      // 表格数据
      pageResult: {},
      columns: [
        { prop: 'roleName', label: '角色名称', minWidth: 120 },
        { prop: 'orgId', label: '所属机构', minWidth: 120 },
        { prop: 'createTime', label: '创建时间', minWidth: 90 },
        { prop: 'remark', label: '描述', minWidth: 80 }
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
    handleDelete(row) {
      this.handleBatchDelete([row.roleId])
    },
    handleBatchDelete(ids) {
      console.log(ids)
      if (!ids || !ids.length) {
        return false
      }
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
    /**
     * 分配用户
     */
    handleAssignUsers() {}
  }
}
</script>
