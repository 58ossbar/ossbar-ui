<template>
  <el-dialog
    v-dialogDrag
    :title="(operation ? $t('action.add') : $t('action.edit')) + '字典目录'"
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="字典分类编码" prop="dictType">
            <el-input
              v-model="dataForm.dictType"
              auto-complete="off"
              clearable
              maxlength="30"
              type="text"
              placeholder="字典分类编码"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典分类名称" prop="dictName">
            <el-input
              v-model="dataForm.dictName"
              auto-complete="off"
              clearable
              maxlength="30"
              type="text"
              placeholder="字典分类名称"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="字典展现分类 " prop="displaySort">
                <cb-param
                  :parent-vue="_self"
                  :data-form="dataForm"
                  placeholder="请选择"
                  name="displaySort"
                  param="displaySort"
                  type="select"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="所属机构" prop="orgName">
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
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="是否显示" prop="displaying">
                <cb-param
                  :parent-vue="_self"
                  :data-form="dataForm"
                  placeholder="请选择"
                  name="displaying"
                  param="displaying"
                  type="radio"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典图标" prop="dictUrl">
            <cb-upload
              :parent-vue="_self"
              :data-form="dataForm"
              type="1"
              name="dictUrl"
              placeholder="点击上传"
              title="点击上传"
            />
          </el-form-item>
        </el-col>
      </el-row>
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
        return callback(new Error('字典分类名称不能为空'))
      } else {
        callback()
      }
    }
    var validateName2 = (rule, value, callback) => {
      // eslint-disable-next-line no-undef
      value = $.trim(value)
      if (!value) {
        return callback(new Error('字典分类编码不能为空'))
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
        // 字典id
        dictId: null,
        // 字典分类编码
        dictType: null,
        // 字典分类名称
        dictName: null,
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
        // 字典类型.这里固定传值为1
        dictSort: '1',
        //	父分类，这里固定传值为0
        parentType: '0'
      },
      // 表单校验规则
      dataRule: {
        dictName: [{ validator: validateName1, required: true, message: '字典分类名称不能为空', trigger: 'blur' }],
        dictType: [{ validator: validateName2, required: true, message: '字典分类编码不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    handleAdd() {
      this.operation = true
      this.dialogVisible = true
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
    },
    handleEdit(row) {
      this.operation = false
      this.dialogVisible = true
      this.$api.dict.view(row.dictId).then(res => {
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
      this.$api.dict.saveType(submitData).then((res) => {
        this.loading = false
        if (res.code === 0) {
          this.$message.success(res.msg)
          if (typeof continueFlag === 'boolean') {
            this.resetFormDatas()
          } else {
            this.dialogVisible = false
          }
          submitData.dictId = res.data.dictId
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
      this.$api.dict.updateType(submitData).then((res) => {
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
        // 字典类型.这里固定传值为1
        dictSort: '1',
        //	父分类，这里固定传值为0
        parentType: '0'
      }
    }
  }
}
</script>

<style>

</style>
