<template>
  <el-dialog
    v-dialogDrag
    :title="$t('action.assignRoles')"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    top="7vh"
    @close="handleClose"
  >
    <div class="tag-group" style="margin:10px;">
      <el-tag
        v-for="item in itemList"
        :key="item.roleId"
        :type="item.type"
        closable
        effect="plain"
        size="small"
        style="margin:0px 5px;"
        @close="tagClose(item.roleId)"> {{ item.roleName }}</el-tag>
    </div>
    <el-form
      ref="dataForm"
      :model="dataForm"
      :size="size"
      class="formInfo"
      label-width="100px"
      style="display: flex"
    >
      TODO
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
      <el-button :size="size" :loading="loading" type="primary" @click="submitForm" >{{ $t('action.preservation') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { convertTreeData, handleImagePath } from '@/utils/util'
export default {
  data() {
    return {
      loading: false,
      // 大小
      size: 'small',
      // true:新增, false:修改
      operation: true,
      // 是否显示弹窗
      dialogVisible: false,
      // 表单数据
      dataForm: {
        // 角色id集
        roleIdList: [],
        // 用户id集
        userIdList: []
      },
      filterTextForSetRoleUser: '',
      // 机构树默认展开的节点
      defaultExpandedKeysForOrgTree: [],
      filterTextForOrg: '',
      orgTreeData: [], // 旧的：orgTreeForSetUser
      // 分配用户中tag标签
      itemList: [],
      // 分配用户中全选标识
      checkAll: false,
      // 设置 indeterminate 状态，只负责样式控制
      isIndeterminate: false,
      // 分配用户中智能搜索存用户
      restaurants: [],
      // 该值存放分配用户中的查询条件
      myParams: {
        status: '1',
        pageNum: 1,
        pageSize: 50
      },
      filtersUser: {},
      // 存放当前被选中的用户ID
      checkboxGroup: [],
      // 存放当前的所有用户ID
      allCheckBoxGroup: [],
      // 用户
      userList: [],
      // 列表中选择角色id
      roleIdList: [],
      // 传递过来的表格组件
      tableComponent: {},
      // 用户总数
      totalCount: 0
    }
  },
  watch: {
    // 新增修改中数据范围按明细设置的机构树
    filterTextForOrg(val) {
      this.$refs.orgTree.filter(val)
    }
  },
  mounted() {
    // 渲染机构树
    this.queryAddOrgTree()
  },
  methods: {
    handleAssignRole(selections, tableComponent) {
      this.operation = true
      this.dialogVisible = true
      this.tableComponent = tableComponent
      this.itemList = selections
      this.roleIdList = this.itemList.map(item => item.roleId)
      this.showUserInfo()
    },
    submitForm() {
      if (!this.roleIdList.length) {
        this.$message({ message: '至少选择一个角色', type: 'warning' })
        return false
      }
      this.dataForm.roleIdList = this.roleIdList
      this.dataForm.userIdList = this.checkboxGroup
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', { closeOnClickModal: false, type: 'warning' }).then(() => {
            this.loading = true
            this.$api.role.saveRoleUser(this.dataForm).then((res) => {
              if (res.code === 0) {
                this.loading = false
                this.$message({ message: '分配用户成功', type: 'success' })
                // 关闭界面
                this.dialogVisible = false
                // 清空按钮组
                this.checkboxGroup = []
              } else {
                this.$message({ message: res.msg, type: 'error' })
              }
            }).catch(() => {
              this.$message({ message: '接口调用失败', type: 'error' })
              this.loading = false
            })
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    handleClose() {
      this.dialogVisible = false
      this.resetFormDatas()
    },
    resetFormDatas() {
      this.dataForm = {
        // 角色id集
        roleIdList: [],
        // 用户id集
        userIdList: []
      }
    },
    handleNodecheckForSetRoleUser() {
      const orgIdList = this.$refs.orgTreeForSetRoleUser.getCheckedKeys()
      const ids = orgIdList.join(',')
      // 机构ID集赋值
      this.myParams.orgIds = ids
      // 当没有任何机构被选中时，显示全部。处理查询条件
      if (orgIdList.length <= 0) {
        this.myParams.orgId = ''
        this.myParams.orgIds = null
        this.checkboxGroup = []
        this.myParams.pageNum = 1
        this.myParams.pageSize = 50
      }
      this.showUserInfo()
    },
    // 分配用户中左侧机构数的过滤
    filterNodeForSetRoleUser(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 数据范围所用到的机构树
    queryAddOrgTree: function() {
      this.$api.dept.getOrgTree().then(res => {
        const treeData = convertTreeData(res.data, 'orgId')
        this.orgTreeData = treeData
        if (this.dataForm.orgIdList != null && this.dataForm.orgIdList.length > 0) {
          this.$refs.orgTree.setCheckedKeys(this.dataForm.orgIdList)
        }
      })
    },
    filterNodeOrg(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    handleCheckedUserListChange() {
      const checkedCount = this.checkboxGroup.length
      this.checkAll = checkedCount === this.userList.length
      // 判断是否全选√
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.userList.length
    },
    // 分配角色智能搜索
    querySearch: function(queryString, cb) {
      // 将已经获得的用户数据赋值
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect() {},
    // 分配用户中的用户列表中的全选按钮
    handleCheckAllChange(val) {
      this.checkboxGroup = val ? this.allCheckBoxGroup : []
      this.isIndeterminate = false
    },
    // 每页显示数改变时
    handleSizeChange(val) {
      this.checkboxGroup = []
      this.myParams.pageSize = val
      this.showUserInfo()
    },
    // 当前页改变时
    handleCurrentChange(val) {
      this.checkboxGroup = []
      this.myParams.pageNum = val
      this.showUserInfo()
    },
    showUserInfo() {
      this.myParams.status = 1
      this.myParams.userRealname = this.filtersUser.userRealname
      this.$api.user.findPage(this.myParams).then((res) => {
        if (res.code !== 0) {
          this.$message.error('用户列表数据失败')
          return false
        }
        // 为分配用户中带输入建议的input赋值
        this.restaurants = []
        // 清空该值
        this.userList = []
        // 每次查询之后不保留上次勾选的
        this.checkboxGroup = []
        this.allCheckBoxGroup = []
        const tempArr = []
        res.data.list.forEach(item => {
          // 处理头像
          item.userimg = handleImagePath(item.userimg, true)
          // 处理姓名，如果没有真实姓名，则用账号代替显示
          item.userRealname = item.userRealname ? item.userRealname : item.username
          tempArr.push(item.userId)
          // 为分配用户中带输入建议的input赋值
          item.value = item.userRealname
          this.restaurants.push(item)
        })
        // 存入
        this.allCheckBoxGroup = Array.from(new Set(tempArr))
        this.userList = res.data.list
        // 总页数
        this.totalCount = res.data.totalCount
        this.myParams.pageNum = res.data.currPage
        this.myParams.pageSize = res.data.pageSize
        // 根据值来设置是否选中用户
        this.handleEchoUser()
      })
    },
    handleEchoUser() {
      // 如果勾选了两个及以上的角色进行分配，就默认选中同时拥有这两个角色的用户
      this.$api.role.setUser(this.roleIdList).then((res) => {
        if (res.code !== 0) {
          return false
        }
        if (!res.intersection) {
          return false
        }
        const dataList = res.intersection
        for (var i = 0; i < dataList.length; i++) {
          if (JSON.stringify(this.checkboxGroup).indexOf(dataList[i]) === -1) {
            // 交集赋值
            this.checkboxGroup.push(dataList[i])
          }
        }
      })
    },
    /**
     * 删除标签
     * @param {*} roleId
     */
    tagClose(roleId) {
      if (this.itemList.length === 1) {
        this.$message({ message: '至少保留一个', type: 'warning' })
        return false
      }
      if (this.tableComponent.selections.length) {
        for (var i = 0; i < this.tableComponent.selections.length; i++) {
          if (this.tableComponent.selections[i].roleId === roleId) {
            this.tableComponent.toggleRowSelection(this.tableComponent.selections[i])
          }
        }
      }
      // 移除当前被x掉的标签
      for (let i = 0; i < this.itemList.length; i++) {
        if (this.itemList[i].roleId === roleId) {
          this.itemList.splice(i, 1)
        }
      }
      this.roleIdList = this.itemList.map(item => item.roleId)
      // this.showUserInfo()
    }
  }
}
</script>

<style>

</style>
