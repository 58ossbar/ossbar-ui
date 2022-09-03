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
      <el-row>
        <el-col :span="12">
          <el-form-item label="字典分类编码" prop="dictType">
            <el-input
              v-model="dataForm.dictType"
              :disabled="dataForm.dictSort === '2'"
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
              :disabled="dataForm.dictSort === '2'"
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
          <el-form-item v-if="dataForm.dictSort === '2'" label="字典编码" prop="dictCode">
            <el-input v-model="dataForm.dictCode" auto-complete="off" placeholder="字典编码" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="dataForm.dictSort === '2'" label="字典值" prop="dictValue">
            <el-input v-model="dataForm.dictValue" auto-complete="off" placeholder="字典值" clearable />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item v-if="dataForm.dictSort === '2'" label="排序号" prop="sortNum">
            <el-input-number
              v-model="dataForm.sortNum"
              :min="1"
              :max="99999999999"
              controls-position="right"
              label="排序号"
              class="widthAll"/>
          </el-form-item>

        </el-col>
        <el-col :span="12">
          <el-form-item v-if="dataForm.dictSort === '2'" label="默认值" prop="isdefault">
            <el-radio-group v-model="dataForm.isdefault" class=" textAlign widthAll">
              <el-radio
                v-for="data in dictDefaultList"
                :label="data.value"
                :key="data.value"
                class="elRadioMargin">{{ data.label }}</el-radio>
            </el-radio-group>
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
                  :data-from="dataForm"
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
            shangc
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
    var validateName = (rule, value, callback) => {
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
        dictId: null,
        // 字典描述  1、平台内2、平台外
        remark: null,
        dictClass: null,
        // 单选或多选：主要针对树形控件
        multiType: null,
        // 字典类型
        dictSort: '1',
        // 所属机构name
        orgName: null,
        // 所属机构id
        orgId: null,
        // 字典分类编码
        dictType: null,
        // 字典分类名称
        dictName: null,
        // 字典展现分类  下拉类型(select)树形(tree) 复选型(checkbox)单选radio
        displaySort: '1',
        // 字典编码
        dictCode: null,
        // 字典值
        dictValue: null,
        // 排序号
        sortNum: 1,
        // 是否默认值
        isdefault: '1',
        // 是否显示
        displaying: '1',
        // 字典图标
        dictUrl: null,
        //	父分类
        parentType: '0',
        attachId: null,
        ulStyle: true,
        swithToggle: true,
        iconStyleI: true
      },
      // 表单校验规则
      dataRule: {
        postName: [{ validator: validateName, required: true, message: '岗位名称不能为空', trigger: 'blur' }],
        postType: [{ required: true, message: '岗位类型不能为空', trigger: 'blur' }]
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
