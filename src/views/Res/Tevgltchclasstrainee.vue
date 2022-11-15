<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-aside width="250px" class="box_shadows bgcolor LeftPadding marginBottom">
        <div class="displayFlex marginBottom">
          <!--过滤输入框-->
          <el-input
            v-model="filterText"
            class="buttomMargin"
            size="small"
            placeholder="输入名称查询"
            suffix-icon="el-icon-search"
            clearable
            maxlength="30"
            type="text" />
        </div>
        <el-tree
          ref="tree"
          :data="treeData"
          :props="defaultProps"
          ::default-expanded-keys="defaultExpandedKeys"
          :filter-node-method="filterNode"
          class="filter-tree"
          @node-click="nodeClick"/>
      </el-aside>
      <el-container>
        <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
          <!--工具栏-->
          <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px">
            <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
              <el-row class="elCollapseDict">
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>姓名</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input v-model="filters.traineeName" placeholder="姓名" clearable @clear="findPage"/>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>手机号码</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input v-model="filters.mobile" placeholder="手机号码" clearable @clear="findPage"/>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>性别</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict :filters="filters" :change="findPage" placeholder="学员性别" name="traineeSex" dict="sex" type="select" empty-label="全部"/>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
                <el-row>
                  <el-col :span="2">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>学号/工号</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item class="dictInputQueryWidth ">
                      <el-input v-model="filters.jobNumber" placeholder="学号/工号" clearable @clear="findPage"/>
                    </el-form-item>
                  </el-col>

                </el-row>
              </el-collapse-item>
            </el-collapse>
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button :label="$t('action.search')" icon="fa fa-search" perms="tch:tevgltchclasstrainee:query" type="primary" @click="findPage(null)"/>
                <cb-button :label="$t('action.add')" icon="fa fa-plus" perms="tch:tevgltchclasstrainee:add" type="primary" @click="handleAdd" />
                <cb-button :label="$t('action.importRoster')" icon="fa fa-upload" perms="tch:tevgltchclasstrainee:add" type="primary" @click="importRoster" />
                <cb-button :label="$t('action.exportRoster')" :loading="exportLoading" icon="fa fa-download" perms="tch:tevgltchclasstrainee:add" type="primary" @click="exportRoster" />
              </el-col>
              <input
                id="importRoster"
                type="file"
                name="importRoster"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                style="display: none;"
                @change="selectExcel">
            </el-row>
          </el-form>
        </el-header>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <!--表格内容栏-->
          <cb-tables
            :parent-vue="_self"
            :table-data="pageResult"
            :columns="columns"
            :btn-columns="btnColumns"
            perms-batch-delete="tch:tevgltchclasstrainee:remove"/>
        </el-main>
      </el-container>

    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="view ? '查看' : (operation?'新增':'修改')" :visible.sync="dialogVisible" :close-on-click-modal="false" top="5vh" width="60%" @close="closePage">
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataTevglTchClasstrainee"
        :disabled="view"
        :size="size"
        label-width="100px"
        style="margin-top: 10px">
        <div style="width: 49%; float:left;">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="dataForm.mobile" auto-complete="off" disabled/>
          </el-form-item>
          <el-form-item label="学员昵称" prop="nickName">
            <el-input v-model="dataForm.nickName" auto-complete="off" disabled/>
          </el-form-item>
          <el-form-item label="学员姓名" prop="traineeName">
            <el-input v-model="dataForm.traineeName" :disabled="view" auto-complete="off"/>
          </el-form-item>
          <el-form-item label="所属班级" prop="classId">
            <cb-tree :parent-vue="_self" :data-form="dataForm" :disabled="view" url="/api/tch/tevgltchclass/findClassList" is-mult="true" placeholder="请选择所属职业路径" name="classId" prop="{&quot;id&quot;: &quot;classId&quot;, &quot;name&quot;: &quot;className&quot;}"/>
          </el-form-item>
          <el-form-item label="所属性别" prop="traineeSex">
            <cb-dict :parent-vue="_self" :data-form="dataForm" :disabled="view" placeholder="" name="traineeSex" dict="sex" type="select"/>
          </el-form-item>
          <el-form-item label="学号" prop="jobNumber">
            <el-input v-model="dataForm.jobNumber" :disabled="view" auto-complete="off" maxlength="50"/>
          </el-form-item>
          <el-form-item label="所在学校" prop="traineeSchool">
            <el-input v-model="dataForm.traineeSchool" :disabled="view" auto-complete="off" maxlength="50"/>
          </el-form-item>
          <el-form-item label="邮箱地址" prop="email">
            <el-input v-model="dataForm.email" :disabled="view" auto-complete="off" maxlength="50"/>
          </el-form-item>
        </div>
        <div style="width: 49%; float:left;">
          <el-form-item label="学员证件照" prop="teacherPic">
            <div style="float: left">
              <cb-upload :parent-vue="_self" :data-form="dataForm" :disabled="view" type="16" name="traineePic" placeholder="上传证件照" title="点击证件照"/>
            </div>
          </el-form-item>
          <el-form-item v-if="!operation" label="网络头像" prop="teacherPic">
            <div style="float: left">
              <!--<cb-upload :parent-vue="_self" type="7" name="traineeHead" width="600" height="800" errorRange="20" :dataForm="dataForm" disabled placeholder="" title="不允许修改用户网络头像"></cb-upload>-->
              <div style="height: 135px;width:130px;">
                <img :src="dataForm.traineeHead" class="avatar" style="height: 135px;width:130px;">
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button v-if="operation == true" :size="size" :loading="editLoading" type="primary" @click.native="submitForm('saveContinue')">{{ $t('action.saveContinue') }}</el-button>
        <el-button v-if="!view" :size="size" :loading="editLoading" type="primary" @click.native="submitForm">{{ $t('action.preservation') }}</el-button>
      </div>
    </el-dialog>

    <!--导入界面-->
    <el-dialog v-dialogDrag :visible.sync="isShowPage" :close-on-click-modal="false" title="导入Excel" top="5vh" width="30%">
      <el-form :size="size" label-width="100px" style="margin-top: 10px">
        <div class="floating-all textAlignLeft">
          <el-form-item label="选择班级" prop="nickName">
            <template>
              <el-select v-model="classId" placeholder="请选择要导入的班级" class="widthAll">
                <el-option
                  v-for="item in classList"
                  :key="item.classId"
                  :label="item.className"
                  :value="item.classId">
                  <el-image
                    :src="item.classPic"
                    style="width: 35px; height: 35px;float: left; margin: 3px 0;"
                    fit="fill"/>
                  <span style="float: right">{{ item.className }}</span>
                </el-option>
              </el-select>
            </template>
          </el-form-item>
        </div>
        <div class="floating-all textAlignLeft">
          <el-form-item label="选择文件" prop="traineeName">
            <!--<el-button size="small" type="primary" @click="clickBtn">点击选择</el-button>-->
            <el-upload
              ref="upload"
              :action="action"
              :headers="uploadHeaders"
              :data="uploadData"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :file-list="fileList"
              :limit="1"
              :auto-upload="false"
              class="upload-demo"
              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel">
              <el-button slot="trigger" size="mini" type="primary">选取文件</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div class="floating-all textAlignLeft">
          <el-form-item label="" prop="traineeName">
            上传前不知道excel模板的，请点击 <el-link type="primary" @click="downloadClassTraineeTemplate">点我下载模板</el-link>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="isShowPage = false">{{ $t('action.cancel') }}</el-button>
        <el-button :size="size" type="primary" @click.native="submitUpload">{{ $t('action.upload') }}</el-button>
      </div>
    </el-dialog>

    <!--新增班级成员界面 begin-->
    <trainee-list
      ref="traineeList"
      :dialog-visible="dialogVisibleClassTrainee"
      title="未加入任何班级的学员"
      @close="handleCloseClassTraineePage"
      @save="saveClassTraineeId"
    />

  </div>
</template>

<script>
import CbButton from '@/views/Core/CbButton'
import Cookies from 'js-cookie'
import { baseUrl } from '@/utils/global'
import TraineeList from '@/views/Res/trainee/trainee-list'
export default {
  components: {
    CbButton,
    'trainee-list': TraineeList
  },
  data() {
    return {
      exportLoading: false,
      view: false,
      dialogVisibleClassTrainee: false,
      uploadData: {
        classId: ''
      },
      id: '',
      type: '',
      filterText: '',
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandedKeys: [],
      action: baseUrl + '/api/tch/tevgltchclasstrainee/importExcel',
      uploadHeaders: {},
      fileList: [],
      classList: [],
      classId: '',
      isShowPage: false,

      dataTevglTchClasstrainee: {
        mobile: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
        nickName: [{ required: true, message: '学员昵称不能为空', trigger: 'blur' }],
        classId: [{ required: true, message: '所属班级不能为空', trigger: 'blur' }],
        traineeName: [{ required: true, message: '学员姓名不能为空', trigger: 'blur' }]
      },
      size: 'small',
      filters: {
      },
      dataForm: {
        mobile: '',
        nickName: '',
        traineeSex: '',
        ctId: '', // 主键ID
        classId: '', // 班级ID
        traineeId: '', // 学员ID
        traineeHead: '',
        traineePic: ''
      },
      columns: [
        { prop: 'traineePic', label: '头像', minWidth: 70, dataType: 'image' },
        { prop: 'traineeName', label: '姓名/昵称', minWidth: 70, dataType: 'link', callback: 'linkClick' },
        { prop: 'jobNumber', label: '学号/工号', minWidth: 70 },
        { prop: 'className', label: '所属班级', minWidth: 70 },
        { prop: 'mobile', label: '手机号码', minWidth: 70 },
        { prop: 'traineeSex', label: '性别', minWidth: 70 }
        // {prop:"traineeState", label:"状态", minWidth:70}
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'tch:tevgltchclasstrainee:edit', callback: 'handleEdit' },
        { icon: 'fa fa-trash', label: '删除', perms: 'tch:tevgltchclasstrainee:remove', callback: 'handleDelete' }
      ],
      pageResult: {},
      value: '',
      dialogVisible: false,
      operation: false, // true:新增, false:修改
      editDialogVisible: false, // 新增修改界面是否显示
      editLoading: false
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getTreeData()
  },
  mounted() {
    this.getUploadHeaders()
  },
  updated() {},
  methods: {
    linkClick(params) {
      this.view = true
      this.dialogVisible = true
      this.$api.tevgltraineeinfo.view(params.row.traineeId).then((res) => {
        if (res.code == 0) {
          this.dataForm = Object.assign({}, res.data)
          if (!this.dataForm.traineeName) {
            this.dataForm.traineeName = this.dataForm.nickName
          }
        }
      })
    },
    closePage() {
      this.view = false
    },
    nodeClick(data, node, commpent) {
      this.classId = ''
      if (data.type == '01') { // 机构节点
        this.filters.orgId = data.id
        this.filters.year = ''
        this.filters.classId = ''
        this.filters.type = 'orgNode'
      }
      if (data.type == '04') { // 年份节点
        this.filters.orgId = data.id.split('#')[0]
        this.filters.year = data.name
        this.filters.classId = ''
        this.filters.type = 'yearNode'
      }
      if (data.type == '02') { // 班级节点
        this.filters.classId = data.id
        this.filters.orgId = ''
        this.filters.year = ''
        this.filters.type = 'classNode'
        this.classId = data.id
        this.className = data.name
      }
      this.findPage(null)
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    submitUpload() {
      if (!this.classId) {
        this.$message({ message: '请先选择一个班级', type: 'warning' })
        return false
      }
      if (this.$refs.upload && !this.$refs.upload.uploadFiles.length) {
        this.$message({ message: '请选择excel文件', type: 'warning' })
        return false
      }
      this.uploadData.classId = this.classId
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handlePreview(file) {
      // console.log(file);
    },
    handleSuccess(response, file, fileList) {
      if (response.code == 0) {
        this.findPage(null)
        this.fileList = []
        this.$message({ message: '导入成功', type: 'success' })
        if (response.data.errorMessage && response.data.errorMessage.length > 0) {
          let message = ''
          response.data.errorMessage.forEach(msg => {
            message += msg + '<br>'
          })
          this.$notify({
            title: '结果',
            message: message,
            dangerouslyUseHTMLString: true
            // position: 'bottom-right'
          })
        }
        this.isShowPage = false
      } else {
        this.$message({ message: response.msg, type: 'error' })
        // this.fileList = []
      }
    },
    /** *
       * 请求头
       */
    getUploadHeaders: function() {
      const token = Cookies.get('token')
      if (token) {
        this.uploadHeaders.authorization = 'Bearer' + token
      }
    },

    // 导入花名册
    importRoster() {
      /* this.$message.warning('暂未开放')
        return false*/
      this.isShowPage = true
      this.fileList = []
      const params = {
        majorId: '',
        orgId: '',
        className: ''
      }
      this.$api.tevgltchclass.listClassTrainee(params).then(res => {
        if (res.code == 0) {
          res.data.forEach(item => {
            item.classPic = this.global.baseUrl + item.classPic
          })
          this.classList = res.data
        }
      })
    },

    clickBtn() {
      if (!this.classId) {
        this.$message({ message: '请先选择一个班级', type: 'warning' })
        return false
      }
      const ele = document.getElementById('importRoster')
      if (ele) {
        ele.click()
      }
    },

    selectExcel(e) {
      const formData = new FormData()
      formData.append('classId', this.classId)
      const ele = document.getElementById('importRoster')
      if (ele.files) {
        if (ele.files[0]) {
          formData.append('file', ele.files[0])
        }
      }
    },

    doUpload() {
      this.$api.tevgltchclasstrainee.importExcel().then(res => {
        if (res.code == 0) {
          this.$message({ message: '导入成功', type: 'success' })
          this.findPage(null)
        } else {
          this.$message({ message: res.msg, type: 'error' })
          this.findPage(null)
        }
      })
    },

    // 导出花名册
    exportRoster() {
      if (!this.pageResult || this.pageResult.totalCount <= 0) {
        this.$message.warning('当前没有数据可以导出')
        return false
      }
      this.$confirm('是否确认导出所有班级成员数据项，共' + this.pageResult.totalCount + '条', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.exportLoading = true
        console.log(this.filters)
        this.$api.tevgltchclasstrainee.exportExcel(this.filters).then(res => {
          this.exportLoading = false
          if (res.code === 0) {
            const fileName = res.data
            this.$api.common.downloadFile(fileName).then(res => {
              if (typeof window.chrome !== 'undefined') {
                // Chrome version
                const link = document.createElement('a')
                // link.href = window.URL.createObjectURL(res);
                link.href = window.URL.createObjectURL(new Blob([res]))
                link.download = fileName
                link.click()
              } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
                // IE version
                const blob = new Blob([res], { type: 'application/force-download' })
                window.navigator.msSaveBlob(blob, fileName)
              } else {
                // Firefox version
                const file = new File([res], fileName, { type: 'application/force-download' })
                window.open(URL.createObjectURL(file))
              }
            })
            // window.location.href = baseUrl + "/api/download/file?fileName=" + encodeURI(fileName) + "&delete=" + true;
          }
        })
      })
    },
    // 获取分页数据
    findPage: function(data) {
      if (data) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      const jj = Object.assign({}, this.filters)
      jj.pageNum = this.pageRequest.pageNum
      jj.pageSize = this.pageRequest.PageSize
      this.$api.tevgltchclasstrainee.findPage(jj).then((res) => {
        res.data.list.forEach(item => {
          const traineePic = item.traineePic
          // 如果不是网络头像,则拼接地址
          const flag = traineePic.indexOf('https') == -1 && traineePic.indexOf('http') == -1
          if (flag) {
            item.traineePic = this.global.baseUrl + traineePic
          }
        })
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    },
    // 删除
    handleDelete: function(data) {
      const arr = []
      arr.push(data.row.ctId)
      this.delete(arr, data)
    },
    // 批量删除
    handleBatchDelete: function(data) {
      const arr = []
      for (let i = 0; i < data.params.length; i++) {
        arr.push(data.params[i].ctId)
      }
      this.delete(arr, data)
    },
    // 执行删除
    delete: function(jj, darass) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.tevgltchclasstrainee.doDelete(jj).then(res => {
          if (res.code !== 0) { // 删除失败
            this.$message.error(res.msg)
            return
          } else {
            this.$message({ message: '操作成功', type: 'success' })
            this.findPage(null)
          }
        }).then(darass != null ? darass.callback : '').catch(res => {
          this.$message.error('删除失败，请联系管理员!')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 显示修改界面
    handleEdit: function(params) {
		    if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.dialogVisible = true
      this.operation = false // 标识为修改
      this.$api.tevgltraineeinfo.view(params.row.traineeId).then((res) => {
        if (res.code == 0) {
          this.dataForm = Object.assign({}, res.data)
          if (!this.dataForm.traineeName) {
            this.dataForm.traineeName = this.dataForm.nickName
          }
        }
      })
    },
    // 修改
    submitForm: function(type) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            this.dialogVisible = type == 'saveContinue'
            const params = Object.assign({}, this.dataForm)
            this.$api.tevgltchclasstrainee.updateTrainee(params).then((res) => {
              if (res.code == 0) {
                this.$message({ message: '操作成功', type: 'success' })
                if (type == 'saveContinue') {
                  this.$refs['dataForm'].resetFields()
                }
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.editLoading = false
              this.$refs['dataForm'].resetFields()
              this.editDialogVisible = false
              this.findPage()
            })
          })
        }
      })
    },
    /**
       * 班级树
       */
    getTreeData() {
      this.$api.tevgltchclass.getClassTree().then(res => {
        if (res.code === 0) {
          this.treeData = res.data
          this.defaultExpandedKeys = res.defaultExpandedKeys
        }
      })
    },
    /**
       * 下载模板
       */
    downloadClassTraineeTemplate() {
      this.$api.tevgltchclasstrainee.downloadClassTraineeTemplate().then(res => {
        if (typeof window.chrome !== 'undefined') {
          // Chrome version
          const link = document.createElement('a')
          // link.href = window.URL.createObjectURL(res);
          link.href = window.URL.createObjectURL(new Blob([res]))
          link.download = '班级成员模板.xlsx'
          link.click()
        } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // IE version
          const blob = new Blob([res], { type: 'application/force-download' })
          window.navigator.msSaveBlob(blob, '班级成员模板.xlsx')
        } else {
          // Firefox version
          const file = new File([res], '班级成员模板.xlsx', { type: 'application/force-download' })
          window.open(URL.createObjectURL(file))
        }
      })
    },
    // 显示选人界面
    handleAdd: function() {
      // this.$message.warning('暂未开放')
      if (this.filters.type != 'classNode' || !this.classId) {
        this.$message.warning('请先在左侧选择要加入到哪个班级')
        return false
      }
      this.dialogVisibleClassTrainee = true
    },
    handleCloseClassTraineePage() {
      this.dialogVisibleClassTrainee = false
    },
    saveClassTraineeId(multipleSelection) {
      if (!multipleSelection || !multipleSelection.length) {
        this.$message.warning('请选择学员')
        return false
      }
      if (!this.classId) {
        this.$message.warning('请先在左侧选择具体的班级')
        return false
      }
      const traineeIds = multipleSelection.map(item => {
        return item.traineeId
      })
      const postData = {
        classId: this.classId,
        traineeIdList: traineeIds
      }
      this.$api.tevgltchclasstrainee.saveClassTraineeBatch(postData).then(res => {
        if (res.code === 0) {
          this.$message.success(res.msg)
          // 清空原先已选择的
          this.$refs.traineeList.clearMultipleSelection()
          // 重新加载列表数据
          this.$refs.traineeList.findPage()
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
