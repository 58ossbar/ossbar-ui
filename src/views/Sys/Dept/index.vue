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
          <cb-button
            class="queryButtonPlus"
            icon="el-icon-plus"
            perms="sys:tsysorg:add"
            type="primary"
            @click="handleAdd"/>
        </div>
        <el-tree
          v-loading="loadingTree"
          v-if="listData.length > 0"
          ref="deptTree"
          :data="listData"
          :highlight-current="true"
          :expand-on-click-node="false"
          :props="{label: 'orgName', children: 'children'}"
          :element-loading-text="$t('action.loading')"
          :filter-node-method="filterNode"
          :current-node-key="listData[0].orgId"
          :default-expanded-keys="defaultExpandedKeys"
          node-key="orgId" >
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
          <el-row>
            <el-collapse v-model="activeName">
              <el-collapse-item name="one">
                <template slot="title">
                  <el-button type="primary" class="collapseItemHr" />基本信息
                </template>
                <el-row class="el_row_width">
                  <el-col :span="24">
                    <el-form-item label="机构类型" prop="orgType" >
                      <el-radio-group v-model="dataForm.orgType">
                        <el-radio
                          v-for="data in menuTypeList"
                          :label="data.value"
                          :key="data.value"
                          class="elRadioMargin" >{{ data.label }}</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>

                </el-row>
                <el-row class="el_row_width" >
                  <el-col :span="12">
                    <el-form-item label="机构名称" prop="orgName" >
                      <el-input
                        v-model="dataForm.orgName"
                        placeholder="机构名称"
                        maxlength="50"
                        type="text"
                        clearable
                        @blur="blurInputName"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item v-show="dataForm.parentId!=='-1' || !dataForm.formState" label="父级机构" prop="parentId">
                      <cb-tree
                        ref="orgTree"
                        :parent-vue="_self"
                        :data-form="dataForm"
                        :prop="{id: 'orgId', name: 'orgName'}"
                        :disabled="dataForm.formState"
                        url="/api/sys/org/getOrgTree"
                        placeholder="请选择所属机构"
                        name="parentId"
                        default-expanded-level="1"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="el_row_width">
                  <el-col :span="12">
                    <el-form-item label="机构简称" prop="orgShowname" >
                      <el-input
                        v-model="dataForm.orgShowname"
                        placeholder="机构简称"
                        maxlength="50"
                        type="text"
                        clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="全拼" prop="qp" >
                      <el-input v-model="dataForm.qp" placeholder="机构名称全拼" readonly clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="el_row_width">
                  <el-col :span="12">
                    <el-form-item label="行政区码" prop="orgXzqm" >
                      <el-input v-model="dataForm.orgXzqm" placeholder="行政区码" maxlength="19" type="text" clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="简拼" prop="jp" >
                      <el-input v-model="dataForm.jp" placeholder="机构名称简拼" readonly clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="是否启用" prop="swithToggle" >
                      <el-switch v-model="dataForm.swithToggle" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
              <el-collapse-item name="two">
                <template slot="title">
                  <el-button type="primary" class="collapseItemHr" />更多信息
                </template>
                <el-row class="el_row_width">
                  <el-col :span="12">
                    <el-form-item label="通讯地址" prop="addr" >
                      <el-input v-model="dataForm.addr" placeholder="通讯地址" maxlength="100" type="text" clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="邮政编码" prop="zip" >
                      <el-input v-model="dataForm.zip" placeholder="邮政编码" maxlength="10" type="text" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="el_row_width">
                  <el-col :span="12">
                    <el-form-item label="机构负责人" prop="leader" >
                      <el-input v-model="dataForm.leader" placeholder="机构负责人" maxlength="16" type="text" clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="负责人手机号码" prop="mobile" >
                      <el-input v-model="dataForm.mobile" placeholder="负责人手机号码" maxlength="14" type="text" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row class="el_row_width">
                  <el-col :span="12">
                    <el-form-item label="办公电话" prop="phone" >
                      <el-input v-model="dataForm.phone" placeholder="办公电话" maxlength="30" type="text" clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="电子邮箱" prop="email" >
                      <el-input v-model="dataForm.email" placeholder="电子邮箱" maxlength="100" type="text" clearable/>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
          </el-row>
          <el-row v-if="!dataForm.formState" class="elDeptFormButton">
            <!-- 操作按钮-->
            <el-col :span="24">
              <el-button size="mini" type="primary" icon="el-icon-circle-close" @click="handleCancel" >
                {{ $t('action.cancel') }}
              </el-button>
              <el-button v-if="!dataForm.orgId" size="mini" type="primary" icon="el-icon-circle-plus-outline" @click="submitForm(true)" >
                {{ $t('action.saveContinue') }}
              </el-button>
              <el-button size="mini" type="primary" icon="el-icon-circle-check" @click="submitForm" >
                {{ $t('action.preservation') }}
              </el-button>
            </el-col>
          </el-row>
        </el-form>
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
      defaultExpandedKeys: [],
      // 表单数据
      dataForm: {
        orgId: null, // 机构ID
        orgSn: null, //	机构排序ID
        orgName: null, // 机构名称
        orgCode: null, // 机构编号
        orgXzqm: null, // 行政区码
        orgShowname: null, // 机构显示名称
        parentId: null, // 父机构ID
        parentName: null, // 父机构名称
        layer: null, // 层（阶次）
        remark: null, // 单位简介
        orgType: '0', // 机构类型:0、部门 1、公司
        addr: null, // 通讯地址
        zip: null, // 邮政编码
        email: null, // 电子邮箱
        leader: null, // 机构负责人
        phone: null, // 办公电话
        fax: null, // 传真号码
        state: '1', //	状态:1有效 2、停用
        mobile: null, // 负责人手机号码
        jp: null, // 简拼
        qp: null, // 全拼
        ancestry: null, // 排序
        coverPic: null, // 封面图
        description: null, // 机构描述
        collegeCode: null, // 学院代码
        majorCode: null, // 专业代码
        swithToggle: true,
        formState: false,
        ulStyle: true,
        iconStyleI: true
      },
      dataRule: {
        orgName: [{ validator: validateOrgName, required: true, message: '机构名称不能为空', trigger: 'blur' }],
        orgShowname: [{ validator: validateOrgShowname, required: true, message: '机构简称不能为空', trigger: 'blur' }],
        orgXzqm: [{ validator: validateOrgXzqm, required: true, trigger: 'blur' }],
        mobile: [{ validator: validateMobile, trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        zip: [{ validator: validateZip, trigger: 'blur' }]
      },
      activeName: ['one'],
      menuTypeList: [
        { value: '0', label: '公司' },
        { value: '1', label: '部门' }
      ]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.deptTree.filter(val)
    }
  },
  mounted() {
    this.findTreeData()
    this.$nextTick(function() {
      if (!this.dataForm.formState) {
        this.activeName = ['one', 'two']
      } else {
        this.activeName = ['one']
      }
    })
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.orgName.indexOf(value) !== -1
    },
    handleSelectDeptTree(data) {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.dataForm = Object.assign({}, data)
    },
    findTreeData(orgId) {
      this.loadingTree = true
      this.$api.dept.findTree().then(res => {
        this.loadingTree = false
        if (res.code === 0) {
          res.data.forEach(item => {
            this.handleItem(item)
          })
          this.listData = res.data
          // 默认回显第一个数据
          Object.assign(this.dataForm, this.listData[0])
          // 选中指定节点
          this.$nextTick(() => {
            if (orgId) {
              this.$refs.deptTree.setCurrentKey(orgId)
            } else {
              if (this.listData.length) {
                this.$refs.deptTree.setCurrentKey(this.listData[0].orgId)
              }
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
    handleAdd(data) {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      if (!this.dataForm.formState) {
        this.activeName = ['one', 'two']
      } else {
        this.activeName = ['one']
      }
      this.operation = true
      this.resetFormDatas()
      if (data && data.orgId) {
        // this.$set(this.dataForm, 'parentId', data.orgId)
        this.dataForm.parentId = data.orgId
      } else {
        const node = this.$refs.deptTree.getCurrentNode()
        if (node !== null) {
          this.dataForm.parentId = node.parentId
        }
      }
    },
    handleEdit(data) {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.operation = false
      this.activeName = ['one', 'two']
      if (data.orgId) {
        this.dataForm = Object.assign({}, data)
        this.dataForm.formState = false
        this.dataFormOlder = Object.assign({}, this.dataForm)
      } else {
        const datas = this.$refs.deptTree.getCurrentNode()
        if (datas === null) {
          this.$message({ message: '请先选择一条记录', type: 'warning' })
          return
        } else {
          this.dataForm = Object.assign({}, datas)
          this.dataForm.formState = false
          this.dataFormOlder = Object.assign({}, this.dataForm)
        }
      }
    },
    handleOk(data) {
      this.findPage()
    },
    handleDelete(row) {
      this.handleBatchDelete([row.orgId], row)
    },
    handleBatchDelete(ids, data) {
      if (!ids || !ids.length) {
        return false
      }
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.dept.batchDelete(ids).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
            return false
          } else {
            this.$message({ message: '操作成功', type: 'success' })
            // this.findTreeData()
            if (data.parentId !== '-1') {
              this.dataForm = Object.assign({}, this.$refs.deptTree.getNode(data.parentId).data)
              this.$refs.deptTree.setCurrentKey(data.parentId)
            } else {
              this.dataForm = Object.assign({}, this.$refs.deptTree.getNode(this.listData[0].orgId).data)
              this.$refs.deptTree.setCurrentKey(this.listData[0].orgId)
            }
            this.$refs.deptTree.remove(this.$refs.deptTree.getNode(data.orgId))
          }
        }).catch((e) => {
          console.log(e)
          // this.$message({ type: 'error', message: '删除失败' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '删除未成功' })
      })
    },
    resetFormDatas() {
      this.dataForm = {
        orgId: null, // 机构ID
        orgSn: null, //	机构排序ID
        orgName: null, // 机构名称
        orgCode: null, // 机构编号
        orgXzqm: null, // 行政区码
        orgShowname: null, // 机构显示名称
        parentId: null, // 父机构ID
        parentName: null, // 父机构名称
        layer: null, // 层（阶次）
        remark: null, // 单位简介
        orgType: '0', // 机构类型:0、部门 1、公司
        addr: null, // 通讯地址
        zip: null, // 邮政编码
        email: null, // 电子邮箱
        leader: null, // 机构负责人
        phone: null, // 办公电话
        fax: null, // 传真号码
        state: '1', //	状态:1有效 2、停用
        mobile: null, // 负责人手机号码
        jp: null, // 简拼
        qp: null, // 全拼
        ancestry: null, // 排序
        createUserId: null,
        createTime: null,
        updateUerId: null,
        updateTime: null,
        coverPic: null, // 封面图
        description: null, // 机构描述
        collegeCode: null, // 学院代码
        majorCode: null, // 专业代码
        swithToggle: true,
        formState: false,
        ulStyle: true,
        iconStyleI: true
      }
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
    },
    submitForm(continueFlag) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', { closeOnClickModal: false, type: 'warning' }).then(() => {
            this.loading = true
            if (this.operation) {
              this.save(continueFlag)
            } else {
              this.update()
            }
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
    save(continueFlag) {
      const submitData = Object.assign({}, this.dataForm)
      this.$api.dept.save(submitData).then((res) => {
        this.loading = false
        if (res.code === 0) {
          // 重新刷新下树组件的数据
          this.$refs.orgTree.queryTree()
          // 处理下
          this.handleItem(res.data)
          if (submitData.orgId) {
            const previousSibling = this.$refs.deptTree.getNode(res.data.orgId).previousSibling
            const nextSibling = this.$refs.deptTree.getNode(res.data.orgId).nextSibling
            this.$refs.deptTree.remove(this.$refs.deptTree.getNode(res.data.orgId))
            if (previousSibling) {
              this.$refs.deptTree.insertAfter(res.data, previousSibling.data)
            } else if (nextSibling) {
              this.$refs.deptTree.insertBefore(res.data, nextSibling.data)
            }
          } else {
            if (res.data.parentId === '-1') {
              this.$refs.deptTree.append(res.data)
            } else {
              this.$refs.deptTree.append(res.data, this.$refs.deptTree.getNode(res.data.parentId).data)
            }
          }
          // 展开节点
          this.defaultExpandedKeys = [res.data.parentId]
          // 选中当前新节点
          this.$nextTick(() => {
            this.$refs.deptTree.setCurrentKey(res.data.orgId)
          })
          this.dataForm = Object.assign({}, res.data)
          this.$message.success(res.msg)
          if (typeof continueFlag === 'boolean') {
            this.resetFormDatas()
          } else {
            this.dialogVisible = false
          }
          this.$emit('ok', submitData)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    update() {
      const submitData = Object.assign({}, this.dataForm)
      this.$api.dept.update(submitData).then((res) => {
        this.loading = false
        if (res.code === 0) {
          this.$message.success(res.msg)
          // this.resetFormDatas()
          this.dialogVisible = false
          this.$emit('ok', submitData)
        } else {
          this.$message.error(res.msg)
        }
      }).catch(() => {
        this.$message.error('接口调用失败')
        this.loading = false
      })
    },
    handleCancel: function() {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      if (this.dataForm.orgId) {
        this.dataForm = Object.assign({}, this.dataFormOlder)
      } else {
        const datas = this.$refs.deptTree.getCurrentNode()
        if (datas === null) {
          this.dataForm = Object.assign({}, this.listData[0])
        } else {
          this.dataForm = Object.assign({}, datas)
        }
      }
      this.prop = this.dataForm.parentName
      this.dataForm.formState = true
      if (this.dataForm.formState) {
        this.activeName = ['one', 'two']
      } else {
        this.activeName = ['one']
      }
    },
    // 输入名称获取全拼和简拼
    blurInputName: function() {
      this.$api.dept.findDeptPingYing({ hz: this.dataForm.orgName }).then(res => {
        if (res.data) {
          this.dataForm.qp = res.data.qp
          this.dataForm.jp = res.data.jp
        }
      })
    }
  }
}
</script>

<style>

</style>
