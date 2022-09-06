<template>
  <el-dialog
    v-dialogDrag
    :title="(operation ? $t('action.add') : $t('action.edit')) + '字典'"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="50%"
    @close="handleClose">
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      :size="size"
      class="formInfo dialogFormTop"
      label-width="120px"
      @keyup.enter.native="submitForm()">
      <div class="displayFlex">
        <div class="parameterDiagoDiv">
          <el-form-item label="参数名称" prop="paraname" >
            <el-input
              v-model="dataForm.paraname"
              :disabled="!operation"
              auto-complete="off"
              maxlength="10"
              type="text"
              placeholder="参数名称"
              clearable />
          </el-form-item>
          <el-form-item label="参数key" prop="paraKey">
            <el-input v-model="dataForm.paraKey" auto-complete="off" maxlength="30" type="text" placeholder="参数key" clearable />
          </el-form-item>
          <el-form-item label="显示方式 " prop="displaysort">
            <el-select v-model="dataForm.displaysort" clearable class="widthAll" placeholder="请选择">
              <el-option
                v-for="item in queryFormDisplaySortOptionsTwo"
                :key="item.value"
                :label="item.label"
                :value="item.value"
                class="dictQueryOptionPadding"/>
            </el-select>
          </el-form-item>
          <el-form-item label="排序号" prop="paraorder">
            <el-input-number
              v-model="dataForm.paraorder"
              :min="1"
              :max="99999999999"
              controls-position="right"
              label="排序号"
              class="widthAll"/>
          </el-form-item>
        </div>
        <div class="parameterDiagoDiv parameterDiagoDivTwo" >
          <el-form-item label="参数标识符" prop="paraType">
            <el-input v-model="dataForm.paraType" :disabled="!operation" maxlength="20" type="text" auto-complete="off" placeholder="参数标识符" clearable />
          </el-form-item>
          <el-form-item label="参数值" prop="parano">
            <el-input v-model="dataForm.parano" maxlength="100" type="text" auto-complete="off" placeholder="参数值" clearable />
          </el-form-item>
          <el-form-item label="默认值" prop="isdefault">
            <el-radio-group v-model="dataForm.isdefault" class=" textAlign widthAll">
              <el-radio
                v-for="data in dictDefaultList"
                :label="data.value"
                :key="data.value"
                class="elRadioMargin">{{ data.label }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述" prop="remark">
            <el-input v-model="dataForm.remark" :rows="1" auto-complete="off" maxlength="50" type="textarea" placeholder="描述" clearable />
          </el-form-item>
        </div>
      </div>
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
    var validateName1 = (rule, value, callback) => {
      // eslint-disable-next-line no-undef
      value = $.trim(value)
      if (!value) {
        return callback(new Error('参数名称不能为空'))
      } else {
        callback()
      }
    }
    var validateName2 = (rule, value, callback) => {
      // eslint-disable-next-line no-undef
      value = $.trim(value)
      if (!value) {
        return callback(new Error('参数标识符不能为空'))
      } else {
        callback()
      }
    }
    var validateName3 = (rule, value, callback) => {
      // eslint-disable-next-line no-undef
      value = $.trim(value)
      if (!value) {
        return callback(new Error('参数key不能为空'))
      } else {
        callback()
      }
    }
    var validateName4 = (rule, value, callback) => {
      // eslint-disable-next-line no-undef
      value = $.trim(value)
      if (!value) {
        return callback(new Error('参数值不能为空'))
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
        // ID
        paraid: null,
        // 参数名称
        paraname: null,
        // 参数标识符
        paraType: null,
        // 参数key
        paraKey: null,
        // 参数值
        parano: null,
        // 默认值1默认，0不默认displaysort
        isdefault: '1',
        // 排序号
        paraorder: 1,
        // 描述
        remark: null,
        // 显示方式：1 下拉(select)、2 复选(checkbox)、3 单选(radio)
        displaysort: '1',
        dictSort: '1'
      },
      // 表单校验规则
      dataRule: {
        paraname: [{ validator: validateName1, required: true, message: '参数名称不能为空', trigger: 'blur' }],
        paraType: [{ validator: validateName2, required: true, message: '参数标识符不能为空', trigger: 'blur' }],
        paraKey: [{ validator: validateName3, required: true, message: '参数key不能为空', trigger: 'blur' }],
        parano: [{ validator: validateName4, required: true, message: '参数值不能为空', trigger: 'blur' }]
      },
      parentData: {}
    }
  },
  methods: {
    handleAdd(data) {
      this.operation = true
      this.dialogVisible = true
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.parentData = Object.assign({}, data)
      this.$api.dict.getMaxSortNum({ parentType: this.parentData.dictId }).then(res => {
        this.dataForm.sortNum = res.data
      })
      this.dataForm.dictType = this.parentData.dictType
      this.dataForm.dictName = this.parentData.dictName
      this.dataForm.parentType = this.parentData.dictId
    },
    handleEdit(row) {
      this.operation = false
      this.dialogVisible = true
      this.$api.parameter.view(row.paraid).then(res => {
        if (res.code === 0) {
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
      this.$api.dict.save(submitData).then((res) => {
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
      this.$api.dict.update(submitData).then((res) => {
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
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.dataForm = {
        // 字典id
        dictId: null,
        // 字典分类编码
        dictType: null,
        // 字典分类名称
        dictName: null,
        // 字典编码
        dictCode: '',
        // 字典值
        dictValue: '',
        // 所属机构id
        orgId: null,
        // 字典展现分类  下拉类型(select)树形(tree) 复选型(checkbox)单选radio
        displaySort: '1',
        // 是否默认值
        isdefault: '1',
        // 是否显示
        displaying: '1',
        // 字典图标
        dictUrl: null,
        // 排序号
        sortNum: 1
      }
      this.$api.dict.getMaxSortNum({ parentType: this.parentData.dictId }).then(res => {
        this.dataForm.sortNum = res.data
      })
      this.dataForm.dictType = this.parentData.dictType
      this.dataForm.dictName = this.parentData.dictName
      this.dataForm.parentType = this.parentData.dictId
    }
  }
}
</script>

<style>

</style>
