<template>
  <div class="page-container" >
    <el-container class="page-container scrollAllY">
      <!-- 左侧区域 begin -->
      <el-aside width="200px" class="box_shadows bgcolor LeftPadding marginBottom">
        <div class="displayFlex marginBottom">
          <el-input
            v-model="filterLeftTree"
            placeholder="输入关键字进行过滤"
            size="small"
            suffix-icon="el-icon-search"
            clearable/>
        </div>
        <el-tree
          ref="leftTree"
          :data="dataLeftTree"
          :props="{id: 'orgId', label: 'orgName'}"
          :default-expanded-keys="defaultExpandedKeysForLeftOrgTree"
          :filter-node-method="filterNodeLeft"
          style="margin-top: 10px"
          class="filter-tree"
          highlight-current
          accordion
          node-key="id"
          @node-click="handleSelectMenuTree"
        />
      </el-aside>
      <!-- 左侧区域 end -->
      <!-- 右侧区域 begin -->
      <el-container>
        <!-- 工具栏 begin -->
        <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
          <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px">
            <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
              <el-row class="elCollapseDict">
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>真实姓名</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input v-model="filters.userRealname" placeholder="" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>手机号码</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input v-model="filters.mobile" placeholder="" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>所属状态</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-select v-model="filters.status" clearable placeholder="" style="width: 100%" @clear="findPage()" @change="findPage()">
                      <el-option
                        v-for="item in optionsForStatus"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
                <el-row>
                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>身份证号</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth ">
                      <el-input v-model="filters.userCard" placeholder="身份证号码" clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>用户性别</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth" >
                      <cb-dict
                        :parent-vue="_self"
                        :change="findPage"
                        :filters="filters"
                        placeholder="请选择性别"
                        name="set"
                        dict="sex"
                        type="select"
                        empty-label="全部"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>查询方式</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth">
                      <el-select v-model="filters.displayType" placeholder="请选择" clearable style="width: 100%">
                        <el-option
                          v-for="item in displayType"
                          :key="item.type"
                          :label="item.name"
                          :value="item.type"/>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
            <!-- 按钮区 -->
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button :label="$t('action.search')" :loading="loadingQuery" icon="fa fa-search" perms="sys:role:query" type="primary" @click="findPage()"/>
                <cb-button :label="$t('action.add')" icon="fa fa-plus" perms="sys:role:add" type="primary" @click="handleAdd" />
                <cb-button :label="$t('action.assignUsers')" icon="fa fa-user-o" perms="sys:role:setUser" type="primary" @click="handleAssignUsers" />
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <!-- 工具栏 end -->
        <!-- 表格内容栏 begin-->
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <cb-table
            ref="table"
            :parent-vue="_self"
            :data="pageResult"
            :columns="columns"
            :btn-columns="btnColumns"
            perms-batch-delete="sys:tsyspost:add"
            row-key="roleId"
            @findPage="findPage"
            @selectionChange="handleSelectionChange"
            @handleBatchDelete="handleBatchDelete"/>
        </el-main>
        <!-- 表格内容栏 end-->
      </el-container>
      <!-- 右侧区域 end -->
    </el-container>
    <!-- 新增/修改用户界面 -->
    <SaveForm ref="saveForm" @ok="handleOk" />
  </div>
</template>
<script>
import { convertTreeData, handleImagePath } from '@/utils/util'
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
        { prop: 'userimg', label: '头像', minWidth: 100, dataType: 'el-image' },
        { prop: 'username', label: '登录账号', minWidth: 100 },
        { prop: 'sex', label: '性别', minWidth: 90 },
        { prop: 'orgnames', label: '所属机构', minWidth: 90 },
        { prop: 'userType', label: '类型', minWidth: 80 },
        { prop: 'mobile', label: '手机号码', minWidth: 100 }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'sys:role:edit', callback: 'handleEdit' },
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:role:remove', callback: 'handleDelete' }
      ],
      // 表格中被选中的列数据
      selections: [],
      optionsForStatus: [{ value: '1', label: '正常' }, { value: '0', label: '禁用' }],
      displayType: [{ type: '1', name: '只查询本级机构用户' }, { type: '2', name: '查询本级机构及下级机构用户' }],
      filterLeftTree: '',
      dataLeftTree: [],
      defaultExpandedKeysForLeftOrgTree: []
    }
  },
  watch: {
    filterLeftTree(val) {
      this.$refs.leftTree.filter(val)
    }
  },
  mounted() {
    this.queryOrgTree()
  },
  methods: {
    filterNodeLeft(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    handleSelectMenuTree(data) {
      this.filters.orgId = data.orgId
      this.findPage()
    },
    queryOrgTree() {
      this.$api.dept.getOrgTree().then(res => {
        if (res.code === 0) {
          const treeData = convertTreeData(res.data, 'orgId')
          this.dataLeftTree = treeData
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
      this.$api.user.findPage(this.filters).then(res => {
        res.data.list.forEach(item => {
          // 处理头像
          item.userimg = handleImagePath(item.userimg, true)
          // 处理姓名，如果没有真实姓名，则用账号代替显示
          item.userRealname = item.userRealname ? item.userRealname : item.username
        })
        this.pageResult = res.data
        this.loadingQuery = false
      }).then(data != null ? data.callback : '')
    },
    handleAdd() {
      this.$refs.saveForm.handleAdd(this.dataLeftTree)
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
      if (!ids || !ids.length) {
        return false
      }
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.role.batchDelete(ids).then(res => {
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
    handleSelectionChange(rows) {
      this.selections = rows
    },
    /**
     * 分配用户
     */
    handleAssignUsers() {
      if (!this.selections || !this.selections.length) {
        this.$message({ message: '请先在表格中，至少选择一个角色', type: 'warning' })
        return false
      }
      if (this.selections.length > 8) {
        this.$message({ message: '至多同时选择八条记录', type: 'warning' })
        return false
      }
      // 去打开界面
      this.$refs.assignUser.handleAssignUser(this.selections, this.$refs.table)
    }
  }
}
</script>
