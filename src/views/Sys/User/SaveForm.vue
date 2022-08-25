<template>
  <el-dialog
    v-dialogDrag
    :title="operation ? $t('action.add') + '用户' : $t('action.edit') + '用户'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="60%"
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
      <el-collapse v-model="activeNames" accordion>
        <el-collapse-item name="1" style="width:99%;">
          <template slot="title">
            <el-button type="primary" class="collapseItemHr" />基本信息
          </template>
          <div style="width: 49%;float:left;">
            <el-form-item label="登录名称" prop="username">
              <el-input v-model="dataForm.username" auto-complete="off" autofocus type="text" maxlength="50"/>
            </el-form-item>
            <el-form-item label="真实姓名" prop="userRealname">
              <el-input v-model="dataForm.userRealname" auto-complete="off" type="text" maxlength="50"/>
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
              <el-input v-model="dataForm.mobile" auto-complete="off" type="text" maxlength="11" oninput="this.value=this.value.match(/^[1-9][0-9]*$/)"/>
            </el-form-item>
            <el-form-item label="所属机构" prop="orgId">
              <cb-tree
                :parent-vue="_self"
                :data-form="dataForm"
                :prop="{id: 'orgId', name: 'orgName'}"
                url="/api/sys/org/getOrgTree"
                placeholder="请选择所属机构"
                name="orgId"
                default-expanded-level="1"
              />
            </el-form-item>
            <el-form-item v-if="!operation" label="排序号码" prop="sortNum">
              <el-input-number
                v-model="dataForm.sortNum"
                :min="1"
                :max="99999"
                controls-position="right"
                label="排序编号"
                class="widthAll"/>
            </el-form-item>
            <el-form-item label="用户类型" prop="userType">
              <cb-param
                :parent-vue="_self"
                :data-form="dataForm"
                placeholder=""
                name="userType"
                param="userType"
                type="radio"
              />
            </el-form-item>
          </div>
          <div style="width: 49%;float:left;">
            <el-form-item style="display: flex" prop="userImg">
              头像上传
            </el-form-item>
            <el-form-item label="性别" prop="sex">
              <cb-dict
                :parent-vue="_self"
                :data-form="dataForm"
                placeholder="请选择"
                name="sex"
                dict="sex"
                type="select"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <cb-param
                :parent-vue="_self"
                :data-form="dataForm"
                placeholder=""
                name="status"
                param="status"
                type="radio"
              />
            </el-form-item>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
      <el-button v-if="operation" :size="size" :loading="loading" type="primary" @click="submitForm(true)" >{{ $t('action.saveContinue') }}</el-button>
      <el-button :size="size" :loading="loading" type="primary" @click="submitForm" >{{ $t('action.preservation') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    var validateUserName = (rule, value, callback) => {
      if (value) {
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
          callback(new Error('必须是字母开头，字母数字下划线组成'))
        } else {
          callback()
        }
      } else {
        callback(new Error('登录名称不能为空'))
      }
    }
    var validateZip = (rule, value, callback) => {
      if (value) {
        if (!/^[1-9][0-9]{5}$/.test(value)) {
          callback(new Error('邮政编码不正确'))
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
    var validateUserCard = (rule, value, callback) => {
      if (value) {
        if (!/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)) {
          callback(new Error('身份证格式不正确'))
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
        callback(new Error('手机号码不能为空'))
      }
    }
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
        userId: '',
        roleName: '',
        showRoleName: [],
        username: '',
        userRealname: '',
        parentId: 0,
        password: '',
        postIdList: [],
        orgId: '',
        orgIdList: [],
        sex: '0',
        userimg: '',
        userType: '0',
        status: '1',
        userTheme: '',
        userCard: '',
        nativePlace: '',
        email: '',
        zip: '',
        birthday: '',
        nation: '',
        mobile: '',
        sortNum: 1
      },
      // 表单校验规则
      dataRule: {
        username: [{ required: true, validator: validateUserName, trigger: 'blur' }],
        userRealname: [{ required: true, message: '真实姓名不能为空', trigger: 'blur' }],
        mobile: [{ required: true, validator: validateMobile, trigger: 'blur' }],
        userCard: [{ validator: validateUserCard, trigger: 'blur' }],
        email: [{ validator: validateEmail, trigger: 'blur' }],
        zip: [{ validator: validateZip, trigger: 'blur' }],
        orgId: [{ required: true, message: '所属机构不能为空', trigger: 'blur' }],
        sortNum: [{ required: true, message: '排序号码不能为空', trigger: 'blur' }]
      },
      // 折叠面板初始化：初识显示哪个面板
      activeNames: ['1']
    }
  },
  methods: {
    handleAdd() {
      this.operation = true
      this.dialogVisible = true
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.$api.post.getMaxSortNum().then(res => {
        this.dataForm.sort = res.data
      })
    },
    handleEdit(row) {
      this.operation = false
      this.dialogVisible = true
      this.$api.post.view(row.postId).then(res => {
        if (res.code === 0) {
          // 赋值
          this.dataForm = Object.assign({}, res.data)
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
      this.$api.post.save(submitData).then((res) => {
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
      this.$api.post.update(submitData).then((res) => {
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
      this.dataForm = {
        // 岗位id
        postId: null,
        // 岗位类型
        postType: '',
        // 岗位名称
        postName: '',
        // 排序号
        sort: '',
        // 备注
        remark: ''
      }
    }
  }
}
</script>

<style>

</style>
