<template>
  <div>
    <el-container class="page-container scrollAllY">
      <el-aside width="220px" class="box_shadows bgcolor LeftPadding marginBottom">
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
          <cb-button
            class="queryButtonPlus"
            icon="el-icon-plus"
            perms="sys:tsysdict:add"
            type="primary"
            @click="handleAdd()"/>
        </div>
        <el-tree
          v-loading="loadingTree"
          ref="dictTree"
          :data="listData"
          :highlight-current="true"
          :props="{label: 'orgName', children: 'children'}"
          :element-loading-text="$t('action.loading')"
          :filter-node-method="filterNode"
          node-key="dictId"
          current-node-key="" >
          <div
            slot-scope="{ node, data }"
            :class="{displayColor:!data.swithToggle}"
            class="fontSizeComm widthAll"
            @click="() => handleSelectDeptTree(data)"
            @mouseleave="() => mouseleaves(data)"
            @mouseenter="() => mouseenters(data)">
            <div >
              <span>
                <i :class="data.coverPic" class="buttomMargin" />{{ node.label }}
              </span>
              <span
                :style="data.iconStyleI ?'display:none' : 'display:inline-block'"
                class="treeIconHover"
                @mouseleave="() => mouseleave(data)"
                @mouseenter="() => mouseenter(data)">
                <i class="el-icon-more buttomMargin "/>
              </span>
              <ul
                :style="data.ulStyle ?'display:none' : 'display:inline-block'"
                class="treeHoverUl"
                @mouseenter="() => mouseenter(data)"
                @mouseleave="() => mouseleave(data)" >
                <li><cb-button
                  :label="$t('action.add')"
                  icon="fa fa-plus"
                  perms="sys:tsysorg:add"
                  class="treeHoverUlButtom"
                  @click="() => handleAdd(data)" />
                </li>
                <li><cb-button
                  :label="$t('action.edit')"
                  icon="fa fa-edit"
                  perms="sys:tsysorg:edit"
                  class="treeHoverUlButtom"
                  @click="() => handleEdit(data)" />
                </li>
                <li>
                  <cb-button
                    :label="$t('action.delete')"
                    icon="fa fa-trash-o"
                    perms="sys:tsysorg:remove"
                    class="treeHoverUlButtom"
                    @click="() => handleDelete(data)" />
                </li>
                <li v-if="node.previousSibling">
                  <cb-button
                    :label="$t('action.moveUp')"
                    icon="fa fa-long-arrow-up"
                    perms="sys:tsysorg:move"
                    class="treeHoverUlButtom"
                    @click="() => move(data,node.previousSibling.data,{moveUp:'0'})" />
                </li>
                <li v-if="node.nextSibling">
                  <cb-button
                    :label="$t('action.moveDown')"
                    icon="fa fa-long-arrow-down"
                    perms="sys:tsysorg:move"
                    class="treeHoverUlButtom"
                    @click="() => move(data,node.nextSibling.data,{moveDown:'0'})" />
                </li>
              </ul>
            </div>
          </div>
        </el-tree>
      </el-aside>
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <el-form
          ref="dataForm"
          :model="dataForm"
          :rules="dataRule"
          :size="size"
          :disabled="dataForm.formState"
          label-width="120px"
          class="textAlign"
          @keyup.enter.native="submitForm">
          <el-row>
            <el-col :span="24">
              <span class="deptInfoSpan">
                {{ !dataForm.orgId ? $t('action.add')+'机构' : (!dataForm.formState?$t('action.edit')+'机构':$t('action.readOnly')+'机构') }}</span>
            </el-col>
          </el-row>
        </el-form>
      </el-main>
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
    var validateOrgName = (rule, value, callback) => {
      // eslint-disable-next-line no-undef
      value = $.trim(value)
      if (!value) {
        return callback(new Error('机构名称不能为空'))
      } else {
        callback()
      }
    }
    var validateOrgShowname = (rule, value, callback) => {
      // eslint-disable-next-line no-undef
      value = $.trim(value)
      if (!value) {
        return callback(new Error('机构机构简称不能为空'))
      } else {
        callback()
      }
    }
    var validateOrgXzqm = (rule, value, callback) => {
      // eslint-disable-next-line no-undef
      value = $.trim(value)
      if (!value) {
        return callback(new Error('行政区码不能为空'))
      } else {
        if (isNaN(value)) {
          callback(new Error('请输入数字'))
        } else {
          if (!/^[1-9][0-9](\d){4}$/.test(value)) {
            callback(new Error('行政区码格式不正确'))
          } else {
            callback()
          }
        }
      }
    }
    var validateZip = (rule, value, callback) => {
      if (value) {
        if (!/^[1-9]{1}(\d){5}$/.test(value)) {
          callback(new Error('邮政编码格式不正确'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (value) {
        if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
          callback(new Error('邮箱格式不正确'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validatePhone = (rule, value, callback) => {
      if (value) {
        if (!/^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/.test(value)) {
          callback(new Error('办公电话格式不正确'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (value) {
        if (isNaN(value)) {
          callback(new Error('请输入数字'))
        } else {
          if (!(/^1(3|4|5|7|8|6)\d{9}$/.test(value))) {
            callback(new Error('手机号码格式不正确'))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    return {
      size: 'small',
      loadingQuery: false,
      pageRequest: {},
      // 表格数据
      pageResult: {},
      // 左侧搜索
      filterText: '',
      loadingTree: false,
      // 树数据
      listData: [],
      // 表单数据
      dataForm: {},
      dataRule: {
        orgName: [{ validator: validateOrgName, required: true, message: '机构名称不能为空', trigger: 'blur' }],
        orgShowname: [{ validator: validateOrgShowname, required: true, message: '机构简称不能为空', trigger: 'blur' }],
        orgXzqm: [{ validator: validateOrgXzqm, required: true, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        zip: [{ validator: validateZip, trigger: 'blur' }]
        /*, jp: [{ required: true, message: "简拼不能为空", trigger: "blur" }],
          qp: [{ required: true, message: '全拼不能为空', trigger: 'blur' }]*/
      }// 表单提交规则
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
      return data.orgName.indexOf(value) !== -1
    },
    handleSelectDeptTree(data) {
      this.filters.parentType = data.dictId
      this.findPage()
    },
    findTreeData(dictId) {
      this.loadingTree = true
      this.$api.dept.findTree().then(res => {
        this.loadingTree = false
        if (res.code === 0) {
          res.data.forEach(item => {
            this.handleItem(item)
          })
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
    handleItem(item) {
      item.swithToggle = item.state === '1'
      item.formState = true
      item.ulStyle = true
      item.iconStyleI = true
      if (item.children && item.children.length) {
        item.children.forEach(o => {
          this.handleItem(o)
        })
      }
    },
    handleAdd() {
      const currData = this.$refs.dictTree.getCurrentNode()
      if (currData == null) {
        this.$message({ message: '请先在左侧选择一条目录再新增字典!', type: 'warning' })
        return false
      }
      this.$refs.saveForm.handleAdd(currData)
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
