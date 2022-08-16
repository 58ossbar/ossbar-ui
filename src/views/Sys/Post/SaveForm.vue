<template>
  <el-dialog
    v-dialogDrag
    :title="operation ? $t('action.add') + '岗位' : $t('action.edit') + '岗位'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="30%"
    @close="handleClose"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :size="size"
      class="formInfo dialogFormTop"
      label-width="100px"
      @keyup.enter.native="submitForm()"
    >
      <el-form-item label="岗位类型" prop="postType">
        <el-select v-model="dataForm.postType" class="widthAll" placeholder="请选择" clearable>
          <el-option v-for="item in postTypeList" :key="item.value" :label="item.label" :value="item.value" class="dictQueryOptionPadding"/>
        </el-select>
      </el-form-item>
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="dataForm.postName" maxlength="50" type="text" clearable auto-complete="off"/>
      </el-form-item>
      <el-form-item label="排序编号" prop="sort" >
        <el-input-number v-model="dataForm.sort" :min="1" :max="99999" class="widthAll" placeholder="排序编号" controls-position="right"/>
      </el-form-item>
      <el-form-item label="岗位描述" prop="remark">
        <el-input v-model="dataForm.remark" :rows="1" type="textarea" maxlength="100" clearable auto-complete="off"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :size="size" @click="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
      <el-button :size="size" :loading="loading" type="primary" @click="submitForm(true)" >{{ $t('action.saveContinue') }}</el-button>
      <el-button :size="size" :loading="loading" type="primary" @click="submitForm" >{{ $t('action.preservation') }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import $ from 'jq'
export default {
  data() {
    var validateName = (rule, value, callback) => {
      // value = $.trim(value)
      if (!value) {
        return callback(new Error('岗位名称不能为空'))
      } else {
        callback()
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
      },
      // 表单校验规则
      dataRule: {
        postName: [{ validator: validateName, required: true, message: '岗位名称不能为空', trigger: 'blur' }],
        postType: [{ required: true, message: '岗位类型不能为空', trigger: 'blur' }]
      },
      // 岗位类型
      postTypeList: [
        { value: '0', label: '公司领导' },
        { value: '1', label: '普通员工' }
      ]
    }
  },
  methods: {
    handleAdd() {
      this.operation = true
      this.dialogVisible = true
    },
    handleEdit() {
      this.operation = false
      this.dialogVisible = true
    },
    submitForm(continueFlag) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', { closeOnClickModal: false, type: 'warning' }).then(() => {
            this.loading = true
            const submitData = Object.assign({}, this.dataForm)
            this.$api.post.save(submitData).then((res) => {
              this.loading = false
              if (res.code === 0) {
                this.$message.success(res.msg)
                if (continueFlag) {
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
