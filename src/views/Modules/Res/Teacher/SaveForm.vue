<template>
  <el-dialog
    v-dialogDrag
    :title="operation ? $t('action.add') + '角色' : $t('action.edit') + '角色'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    top="7vh"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :size="size"
      class="formInfo"
      label-width="100px"
      @keyup.enter.native="submitForm()"
    >
      <el-collapse ref="elCollapseForSave" v-model="activeName" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
        <!--基本信息 begin -->
        <el-collapse-item title="" name="1">
          <template slot="title">
            <el-button type="primary" class="collapseItemHr" />基本信息
          </template>
          <div style="width: 49%; float: left;">
            <el-form-item label="教师名称" prop="teacherName">
              <el-input ref="dataFormTeacherName" v-model="dataForm.teacherName" auto-complete="off" maxlength="50" autofocus/>
            </el-form-item>
            <el-form-item label="所属院校" prop="orgId">
              <cb-tree :parent-vue="_self" :data-form="dataForm" url="/api/sys/org/getOrgTree" placeholder="请选择所属院校" name="orgId" prop="{&quot;id&quot;:&quot;orgId&quot;, &quot;name&quot;:&quot;orgName&quot;}"/>
            </el-form-item>
            <el-form-item label="二级部门" prop="orgIdDepartment">
              <cb-tree :parent-vue="_self" :data-form="dataForm" url="/api/sys/org/getOrgTree" placeholder="请选择二级部门" name="orgIdDepartment" prop="{&quot;id&quot;:&quot;orgId&quot;, &quot;name&quot;:&quot;orgName&quot;}"/>
            </el-form-item>
            <el-form-item label="职业路径" prop="majorId">
              <cb-tree :parent-vue="_self" :data-form="dataForm" url="/api/book/tevglbookmajor/queryForTree" is-mult="true" placeholder="请选择所属职业路径" name="majorId" prop="{&quot;id&quot;: &quot;majorId&quot;, &quot;name&quot;: &quot;majorName&quot;}"/>
            </el-form-item>
            <el-form-item label="账号名称" prop="username">
              <el-input v-model="dataForm.username" auto-complete="off" placeholder="此处填写手机号码" maxlength="11"/>
            </el-form-item>
            <el-form-item label="关联粉丝ID" prop="traineeId">
              <cb-autocomplete
                :parent-vue="_self"
                :data-form="dataForm"
                name="traineeId"
                value="traineeName"
                image="traineePic"
                url="/api/trainee/tevgltraineeinfo/listTrainee"
                prop="{&quot;id&quot;:&quot;traineeId&quot;, &quot;value&quot;:&quot;traineeName&quot;}"
                placeholder="请选择关联的粉丝ID"
              />
            </el-form-item>
            <el-form-item label="工号/学号" prop="jobNumber">
              <el-input v-model="dataForm.jobNumber" auto-complete="off" maxlength="50"/>
            </el-form-item>
            <el-form-item label="教师证件号" prop="teacherErtificateNumber">
              <el-input v-model="dataForm.teacherErtificateNumber" auto-complete="off" maxlength="50"/>
            </el-form-item>
          </div>
          <div style="width: 49%; float: left;">
            <el-form-item label="教师头像" prop="teacherPic">
              <div style="float: left">
                <cb-upload :parent-vue="_self" :data-form="dataForm" type="7" name="teacherPic" placeholder="上传教师头像" title="点击上传教师头像,尺寸大小"/>
              </div>
              <div style="float:left; text-align: center; padding-left: 15px;"><el-tag size="mini" type="danger" effect="plain">尺寸大小 600*800 最佳</el-tag></div>
            </el-form-item>
            <el-form-item label="首页显示" prop="showIndex">
              <cb-dict :parent-vue="_self" :data-form="dataForm" placeholder="首页显示" name="showIndex" dict="state1" type="select"/>
            </el-form-item>
            <el-form-item label="教师状态" prop="state">
              <cb-dict :parent-vue="_self" :data-form="dataForm" placeholder="教师状态" name="state" dict="teacher_state" type="select"/>
            </el-form-item>
            <el-form-item label="排序号码" prop="sortNum">
              <el-input-number
                v-model="dataForm.sortNum"
                :min="1"
                :max="99999"
                class="widthAll"
                controls-position="right"/>
            </el-form-item>
            <el-form-item label="教师职位" prop="teacherPost">
              <el-select v-model="dataForm.teacherPost" placeholder="" style="width: 100%;" clearable>
                <el-option
                  v-for="item in teacherPostList"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"/>
              </el-select>
            </el-form-item>
            <el-form-item label="教师性别" prop="sex">
              <cb-dict
                :parent-vue="_self"
                :data-form="dataForm"
                placeholder=""
                name="sex"
                dict="sex"
                type="select"
              />
            </el-form-item>
          </div>
          <div style="width: 98%; float:left">
            <el-form-item label="老师简介" prop="teacherDesc">
              <el-input v-model="dataForm.teacherDesc" class="handle-font" name="teacherDesc" type="textarea" rows="2" style="width: 100%;" auto-complete="off" maxlength="500"/>
            </el-form-item>
          </div>
        </el-collapse-item>
        <!--基本信息 end -->
        <!--更多信息 begin -->
        <el-collapse-item title="" name="2">
          <template slot="title">
            <el-button type="primary" class="collapseItemHr" />更多信息
          </template>
          <div style="width: 99%; float:left;">
            <el-form-item label="教师介绍" prop="teacherRemark">
              <cb-editor id="teacherRemark" :parent-vue="_self" :data-form="dataForm" name="teacherRemark"/>
            </el-form-item>
          </div>
        </el-collapse-item>
        <!--更多信息 end -->
      </el-collapse>
      <!--折叠面板 end -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
      <el-button v-if="operation" :size="size" :loading="loading" type="primary" @click="submitForm(true)" >{{ $t('action.saveContinue') }}</el-button>
      <el-button :size="size" :loading="loading" type="primary" @click="submitForm" >{{ $t('action.preservation') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { convertTreeData } from '@/utils/util'
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
        // 角色id
        teacherId: null,
        // 角色名称
        teacherName: '',
        // 所属院校
        orgId: '',
        // 二级部门
        orgIdDepartment: '',
        // 所属职业路径
        majorId: '',
        // 账号名称/手机号码
        username: '',
        // 关联粉丝id
        traineeId: '',
        // 工号/学号
        jobNumber: '',
        // 教师证件号
        teacherErtificateNumber: '',
        // 教师头像
        teacherPic: '',
        // 首页显示
        showIndex: 'N',
        // 教师状态
        state: 'Y',
        // 排序号码
        sortNum: '',
        // 教师职位
        teacherPost: '',
        // 教师性别
        sex: '',
        // 老师简介
        teacherDesc: '',
        // 详情介绍
        teacherRemark: '1'
      },
      // 表单校验规则
      dataRule: {
        orgId: [{ required: true, message: '所属院校不能为空', trigger: 'blur' }],
        teacherName: [{ required: true, message: '教师名称不能为空', trigger: 'blur' }],
        // teacherPost: [{ required: true, message: "教师职位不能为空", trigger: "blur" }],
        teacherPic: [{ required: true, message: '教师头像不能为空', trigger: 'blur' }],
        teacherDesc: [{ required: true, message: '老师简介不能为空', trigger: 'blur' }],
        username: [{ required: true, message: '账号名称不能为空', trigger: 'blur' }],
        showIndex: [{ required: true, message: '首页显示不能为空', trigger: 'blur' }],
        state: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
        majorId: [{ required: true, message: '职业路径不能为空', trigger: 'blur' }],
        jobNumber: [{ required: true, message: '工号/学号不能为空', trigger: 'blur' }],
        teacherErtificateNumber: [{ required: true, message: '教师证件号不能为空', trigger: 'blur' }]
      },
      // 折叠面板默认显示的值
      activeName: '1',
      // 教师岗位
      teacherPostList: []
    }
  },
  watch: {
  },
  mounted() {
    // 渲染菜单树
    this.findPerms()
    // 渲染机构树
    this.queryAddOrgTree()
  },
  methods: {
    handleAdd() {
      this.operation = true
      this.dialogVisible = true
      // 重置表单数据
      this.resetFormDatas()
      // 清空验证
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      // 光标聚焦
      this.$nextTick(() => {
        this.$refs.dataFormTeacherName.focus()
      })
    },
    handleEdit(row) {
      // 标识为修改
      this.operation = false
      // 打开界面
      this.dialogVisible = true
      // 清空验证
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      // 其它业务操作
      if (row.dataScope === '5') {
        this.queryAddOrgTree()
      } else {
        this.orgTreeData = []
      }
      this.$api.tevgltchteacher.view(row.teacherId).then(res => {
        if (res.code === 0) {
          // 赋值
          this.dataForm = Object.assign({}, res.data)
          // 处理菜单树
          if (res.data.menuIdList != null && res.data.menuIdList.length > 0) {
            // 默认先赋值菜单ID集和机构ID集
            this.dataForm.menuIdList = res.data.menuIdList
            this.dataForm.orgIdList = res.data.orgIdList
            for (var i = 0; i < res.data.menuIdList.length; i++) {
              // 通过setChecked设置节点选中
              this.$refs.menuTree.setChecked(res.data.menuIdList[i], true, false)
            }
          }
          // 回显机构树数据，设置节点选中
          if (res.data.dataScope === '5') {
            this.$refs.orgTree.setCheckedKeys(res.data.orgIdList)
          }
        }
      })
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
      this.$api.tevgltchteacher.save(submitData).then((res) => {
        this.loading = false
        if (res.code === 0) {
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
      this.$api.tevgltchteacher.update(submitData).then((res) => {
        this.loading = false
        if (res.code === 0) {
          this.$message.success(res.msg)
          this.resetFormDatas()
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
    handleClose() {
      this.dialogVisible = false
      this.resetFormDatas()
    },
    resetFormDatas() {
      if (this.$refs.menuTree) {
        this.$refs.menuTree.setCheckedKeys([])
      }
      if (this.$refs.orgTree) {
        this.$refs.orgTree.setCheckedKeys([])
      }
      this.dataForm = {
        // 角色id
        teacherId: null,
        // 角色名称
        teacherName: '',
        // 所属院校
        orgId: '',
        // 二级部门
        orgIdDepartment: '',
        // 所属职业路径
        majorId: '',
        // 账号名称/手机号码
        username: '',
        // 关联粉丝id
        traineeId: '',
        // 工号/学号
        jobNumber: '',
        // 教师证件号
        teacherErtificateNumber: '',
        // 教师头像
        teacherPic: '',
        // 首页显示
        showIndex: 'N',
        // 教师状态
        state: 'Y',
        // 排序号码
        sortNum: '',
        // 教师职位
        teacherPost: '',
        // 教师性别
        sex: '',
        // 老师简介
        teacherDesc: '',
        // 详情介绍
        teacherRemark: '1'
      }
    },
    toValidateField(fieldName) {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].validateField(fieldName)
      }
    },
    findPerms() {
      this.$api.menu.queryPerms().then((res) => {
        const treeData = convertTreeData(res.data, 'menuId')
        this.menuIdListData = treeData
      })
    },
    // 左侧菜单树的过滤
    filterNodeForMenuTree(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    getCheckedKeysForMenuTree(data, isChecked) {
      // 返回当前选中节点得key(包含子节点的)
      var a = this.$refs.menuTree.getCheckedKeys()
      // 返回目前半选中的节点的 key 所组成的数组（即父节点的key）
      var b = this.$refs.menuTree.getHalfCheckedKeys()
      var c = a.concat(b)
      this.dataForm.menuIdList = c
    },
    // 数据范围的事件，当选中【按明细设置】出现机构树
    queryScope: function() {
      if (this.dataForm.dataScope === '5') {
        this.queryAddOrgTree()
      } else {
        this.orgTreeData = []
        this.$refs.orgTree.setCheckedKeys([])
        // 新增的时候，清空下
        if (this.operation) {
          this.dataForm.orgIdList = []
        }
      }
      // 清除验证
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate('dataScope')
      }
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
    // 新增或修改界面中左侧机构树，当复选框被点击的时候触发 args返回四个参数
    checkForSaveOrgTree: function(data, args) {
      this.dataForm.orgIdList = args.checkedKeys // 赋值机构ID集
    }
  }
}
</script>

<style>

</style>
