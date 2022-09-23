<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!--工具栏-->
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px">
          <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
            <el-row class="elCollapseDict">
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>所属院校</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <cb-tree :parent-vue="_self" :change="findPage" :filters="filters" url="/api/sys/org/getOrgTree" placeholder="请选择所属院校" name="orgId" prop="{&quot;id&quot;:&quot;orgId&quot;, &quot;name&quot;:&quot;orgName&quot;}"/>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>职业路径</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <cb-tree :parent-vue="_self" :filters="filters" :change="findPage" url="/api/book/tevglbookmajor/queryForTree" placeholder="请选择所属职业路径" name="majorId" prop="{&quot;id&quot;: &quot;majorId&quot;, &quot;name&quot;: &quot;majorName&quot;}"/>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>班级名称</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input v-model="filters.className" placeholder="班级名称" clearable @clear="findPage"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>班级助教</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-autocomplete
                      :parent-vue="_self"
                      :filters="filters"
                      :change="findPage"
                      name="teachingAssistant"
                      value="teachingAssistant"
                      url="/api/tch/tevgltchteacher/query"
                      prop="{&quot;id&quot;:&quot;teacherId&quot;, &quot;value&quot;:&quot;teacherName&quot;}"
                      placeholder="请选择班级助教"/>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>班级状态</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict :filters="filters" :change="findPage" placeholder="班级状态" name="classState" dict="class_state" type="select" empty-label="全部"/>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>班级类型</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict :filters="filters" :change="findPage" placeholder="班级类型" name="type" dict="class_type" type="select" empty-label="全部"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :label="$t('action.search')" icon="fa fa-search" perms="tch:tevgltchclass:query" type="primary" @click="findPage(null)"/>
              <cb-button :label="$t('action.add')" icon="fa fa-plus" perms="tch:tevgltchclass:add" type="primary" @click="handleAdd" />
            </el-col>
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
          perms-batch-delete="tch:tevgltchclass:remove"/>
      </el-main>
    </el-container>
    <!--新增修改界面-->
    <el-dialog v-dialogDrag :title="operation?'新增':'修改'" :visible.sync="dialogVisible" :close-on-click-modal="false" top="5vh" width="60%" @close="dialogCloseForSave">
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataTevglTchClass"
        :size="size"
        label-width="120px"
        style="margin-top: 10px">
        <!--折叠面板 begin -->
        <el-collapse ref="elCollapseForSave" v-model="activeName" accordion style="width:98%;overflow:hidden;padding-right: 18px;">
          <!--基本信息 begin -->
          <el-collapse-item title="" name="1">
            <template slot="title">
              <el-button type="primary" class="collapseItemHr" />基本信息
            </template>
            <div style="width: 49%; float:left;">
              <el-form-item label="所属院校" prop="orgId">
                <cb-tree :parent-vue="_self" :data-form="dataForm" url="/api/sys/org/getOrgTree" placeholder="请选择所属院校" name="orgId" prop="{&quot;id&quot;:&quot;orgId&quot;, &quot;name&quot;:&quot;orgName&quot;}"/>
              </el-form-item>
              <el-form-item label="班级名称" prop="className">
                <el-input v-model="dataForm.className" auto-complete="off" placeholder="请输入班级名称" maxlength="100"/>
              </el-form-item>
              <el-form-item label="班级教师" prop="teacherId">
                <el-select v-model="dataForm.teacherId" class="widthAll" placeholder="请选择班级教师">
                  <el-option
                    v-for="item in teacherList"
                    :key="item.traineeId"
                    :label="item.teacherName"
                    :value="item.traineeId">
                    <div style="float: left"><el-image :src="item.teacherPic" style="width: 30px; height: 30px;border-radius: 50%;" fit="fill"/></div>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.teacherName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级助教" prop="teachingAssistant">
                <el-select v-model="dataForm.teachingAssistant" class="widthAll" placeholder="请选择班级助教">
                  <el-option
                    v-for="item in teacherList"
                    :key="item.teacherId + 'ta'"
                    :label="item.teacherName"
                    :value="item.traineeId">
                    <div style="float: left"><el-image :src="item.teacherPic" style="width: 30px; height: 30px;border-radius: 50%;" fit="fill"/></div>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.teacherName }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="班级状态" prop="classState">
                <cb-dict :data-form="dataForm" placeholder="班级状态" name="classState" dict="class_state" type="select"/>
              </el-form-item>
              <el-form-item label="班级类型" prop="classTime">
                <cb-dict :parent-vue="_self" :data-form="dataForm" placeholder="班级类型" name="type" dict="class_type" type="select" clearable/>
              </el-form-item>
            </div>
            <div style="float:left; width: 49%;">
              <el-form-item label="职业路径" prop="majorId">
                <cb-tree :parent-vue="_self" :data-form="dataForm" url="/api/book/tevglbookmajor/queryForTree" placeholder="请选择职业路径" name="majorId" prop="{&quot;id&quot;: &quot;majorId&quot;, &quot;name&quot;: &quot;majorName&quot;}"/>
              </el-form-item>
              <el-form-item v-if="dataForm.type" label="报名开始时间" prop="registrationStartTime">
                <el-date-picker v-model="dataForm.registrationStartTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="" style="width: 100%;" placeholder=""/>
              </el-form-item>
              <el-form-item v-if="dataForm.type" label="预计开班时间" prop="expectTime">
                <el-date-picker v-model="dataForm.expectTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="" style="width: 100%;" placeholder="预计开班时间 / 报名结束时间"/>
              </el-form-item>
              <el-form-item label="实际开班时间" prop="acceptTime">
                <el-date-picker v-model="dataForm.acceptTime" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="" style="width: 100%;"/>
              </el-form-item>
              <el-form-item label="开班人数" prop="acceptSum">
                <el-input-number v-model="dataForm.acceptSum" :min="1" :max="99999" class="widthAll" controls-position="right"/>
              </el-form-item>
              <el-form-item label="班级编号" prop="classNo">
                <el-input v-model="dataForm.classNo" auto-complete="off" maxlength="20"/>
              </el-form-item>
              <el-form-item label="时长" prop="classTime">
                <el-input v-model="dataForm.classTime" auto-complete="off" maxlength="30"/>
              </el-form-item>
            </div>
            <div style="float: left; width:98%;">
              <el-form-item label="班级封面" prop="classPic">
                <div style="display: flex; width: 100%;">
                  <div v-for="itemLogo in classPicList" :key="itemLogo.dictId" class="subjectLogo" style="margin: 0 10px;cursor: pointer;">
                    <img :id="itemLogo.dictId" :url="itemLogo.shortUrl" :iid="itemLogo.dictCode" :src="itemLogo.dictUrl" class="cb-class-img" @click="imgClick(itemLogo.dictId)" >
                  </div>
                </div>
              </el-form-item>
              <el-form-item label="自定义封面" prop="teacherPic">
                <div style="float: left">
                  <cb-upload :parent-vue="_self" :data-form="dataForm" type="13" name="classImg" placeholder="上传封面图" title="点击上传班级封面图"/>
                </div>
              </el-form-item>
            </div>
            <div class="floating-all temp-remark">
              <el-form-item label="备注" prop="remark">
                <cb-editor id="remark" ref="remark" :parent-vue="_self" :data-form="dataForm" name="remark"/>
              </el-form-item>
            </div>
          </el-collapse-item>
        </el-collapse>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="dialogVisible = false">{{ $t('action.cancel') }}</el-button>
        <el-button v-if="operation == true" :size="size" :loading="editLoading" type="primary" @click.native="submitForm('saveContinue')">{{ $t('action.saveContinue') }}</el-button>
        <el-button :size="size" :loading="editLoading" type="primary" @click.native="submitForm">{{ $t('action.preservation') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CbButton from '@/views/Core/CbButton'
import { baseUrl } from '@/utils/global'
import CbSelect from '@/components/cbselect/index'
import { getYearMonthDay } from '@/utils/datetime'
export default {
  components: {
    CbSelect,
    CbButton
  },
  data() {
    return {
      teacherList: [],
      teachingAssistantList: [],
      classPicList: [],
      activeName: '1', // 默认展开的折叠面板
      teacherPostList: [], // 职位

      dataTevglTchClass: {
        majorId: [{ required: true, message: '职业路径不能为空', trigger: 'blur' }],
        orgId: [{ required: true, message: '所属院校不能为空', trigger: 'blur' }],
        className: [{ required: true, message: '班级名称不能为空', trigger: 'blur' }],
        teacherId: [{ required: true, message: '班级教师不能为空', trigger: 'blur' }],
        teachingAssistant: [{ required: true, message: '班级助教不能为空', trigger: 'blur' }],
        classState: [{ required: true, message: '班级状态不能为空', trigger: 'blur' }],
        acceptSum: [{ required: true, message: '开班人数不能为空', trigger: 'blur' }],
        registrationStartTime: [{ required: true, message: '报名开始时间不能为空', trigger: 'blur' }],
        acceptTime: [{ required: true, message: '实际开班时间不能为空', trigger: 'blur' }],
        expectTime: [{ required: true, message: '预计开班时间不能为空', trigger: 'blur' }]
      },
      size: 'small',
      filters: {
      },
      dataForm: {
        classId: '', // 班级标识ID
        majorId: '', // 专业标识ID
        orgId: '', // 机构ID
        classNo: '', // 班级编号
        className: '', // 班级名称
        classPic: '', // 班级缩略图
        yprice: '', // 原价格
        yhPrice: '', // 优惠价格
        tgPrice: '', // 团购价格
        classTime: '', // 时长
        classState: '1', // 班级状态：开放、授课、完成
        registrationStartTime: '', // 报名开始时间
        expectTime: '', // 预计开班时间
        acceptTime: '', // 实际开班时间
        curSum: '', // 当前报名人数
        expectSum: '', // 计划开班人数
        acceptSum: '', // 实际开班人数
        remark: '', // 备注
        teachingAssistant: '', // 助教
        teacherId: '',
        type: '',
        classImg: ''
      },
      columns: [
        { prop: 'classPic', label: '班级封面', minWidth: 70, dataType: 'image' },
        { prop: 'className', label: '班级名称', minWidth: 70 },
        { prop: 'majorName', label: '职业路径', minWidth: 70 },
        { prop: 'orgId', label: '所属院校', minWidth: 70 },
        { prop: 'teacherName', label: '班级教师', minWidth: 70 },
        { prop: 'teachingAssistantName', label: '班级助教', minWidth: 70 },
        { prop: 'acceptTime', label: '开班时间', minWidth: 70 },
        { prop: 'acceptSum', label: '开班人数', minWidth: 70 },
        { prop: 'classState', label: '班级状态', minWidth: 70, dataType: 'tag', type: 'success', id: 'classId', mapper: '[{"key":"爆满", "value":"danger"},{"key":"授课", "value":"warning"},{"key":"已完成", "value":""}]' },
        { prop: 'type', label: '班级类型', minWidth: 100 }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'tch:tevgltchclass:edit', callback: 'handleEdit' },
        { icon: 'fa fa-trash', label: '删除', perms: 'tch:tevgltchclass:remove', callback: 'handleDelete' }
      ],
      pageResult: {},
      value: '',
      dialogVisible: false,
      operation: false, // true:新增, false:修改
      editDialogVisible: false, // 新增修改界面是否显示
      editLoading: false
    }
  },
  mounted() {
    this.getClassPic()
    this.queryTeacherList()
    // this.getTeachingAssistant()
  },
  methods: {
    queryTeacherList() {
      const params = {
        hasTraineeId: 'Y'
      }
      this.$api.tevgltchteacher.queryTeacherList(params).then(res => {
        res.data.forEach(item => {
          item.teacherPic = baseUrl + item.teacherPic
        })
        this.teacherList = res.data
      })
    },
    // 图片点击
    imgClick: function(data) {
      if (!$('#' + data).hasClass('subjectLogoSelectedImg')) {
        $('.subjectLogoSelectedImgI').remove()
        $('.subjectLogoSelectedImg').removeClass('subjectLogoSelectedImg')
        $('#' + data).addClass('subjectLogoSelectedImg')
        const kk = '<i class="fa fa-check-circle subjectLogoSelectedImgI" aria-hidden="true"></i>'
        $('#' + data).after($(kk))
        this.dataForm.classPic = $('#' + data).attr('url')
      } else {
        this.dataForm.classPic = $('#' + data).attr('url')
      }
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
      this.$api.tevgltchclass.findPage(jj).then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.code == 0) {
          if (res.data.list.length > 0) {
            res.data.list.forEach(a => {
              a.classPic = baseUrl + a.classPic
            })
          }
        }
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    },
    // 删除
    handleDelete: function(data) {
      const arr = []
      arr.push(data.row.classId)
      this.delete(arr, data)
    },
    // 批量删除
    handleBatchDelete: function(data) {
      const arr = []
      for (let i = 0; i < data.params.length; i++) {
        arr.push(data.params[i].classId)
      }
      this.delete(arr, data)
    },
    // 执行删除
    delete: function(jj, darass) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.tevgltchclass.doDelete(jj).then(res => {
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
    // 显示新增界面
    handleAdd: function() {
		    if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.dialogVisible = true
      this.operation = true
      setTimeout(() => {
        this.imgClick(this.classPicList[0].dictId)
      }, 300)
      this.dataForm.acceptTime = getYearMonthDay()
      if (this.$refs.remark) {
        this.$refs.remark.setContent('')
      }
      // 清空富文本
      // eslint-disable-next-line no-undef
      if (tinyMCE.editors['remark']) {
        // eslint-disable-next-line no-undef
        tinyMCE.editors['remark'].setContent('')
      }
    },
    // 显示修改界面
    handleEdit: function(params) {
      if (this.$refs['dataForm']) {
        this.$refs['dataForm'].clearValidate()
      }
      this.dialogVisible = true
      this.operation = false // 标识为修改
      this.$api.tevgltchclass.view(params.row.classId).then((res) => {
        // eslint-disable-next-line eqeqeq
        if (res.code == 0) {
          this.dataForm = Object.assign({}, res.data)
          this.classPicList.forEach(logo => {
            // eslint-disable-next-line eqeqeq
            if (logo.shortUrl == res.data.classPic) {
              this.dataForm.classPic = res.data.classPic
              setTimeout(() => {
                this.imgClick(logo.dictId)
              }, 300)
            }
          })
          // 如果实际开班时间为空，则默认为当天
          if (!this.dataForm.acceptTime) {
            this.dataForm.acceptTime = getYearMonthDay()
          }
          // eslint-disable-next-line no-undef
          if (tinyMCE.editors['remark']) {
            // eslint-disable-next-line no-undef
            tinyMCE.editors['remark'].setContent(this.dataForm.remark)
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
            // 图片若使用封装的控件，处理一下
            if (this.dataForm.classPic) {
              const arr = this.dataForm.classPic.split('/')
              if (arr.length > 0) {
                this.dataForm.classPic = arr[arr.length - 1]
              }
            }
            const params = Object.assign({}, this.dataForm)
            this.$api.tevgltchclass.save(params).then((res) => {
              // eslint-disable-next-line eqeqeq
              if (res.code == 0) {
                this.$message({ message: '操作成功', type: 'success' })
                // eslint-disable-next-line eqeqeq
                if (type == 'saveContinue') {
                  // this.$refs['dataForm'].resetFields()
                  // 重置数据，undefined会导致element-ui表单校验不通过
                  const pic = this.dataForm.classPic
                  this.dataForm = {
                    classId: '', // 班级标识ID
                    majorId: params.majorId, // 专业标识ID
                    orgId: params.orgId, // 机构ID
                    classNo: '', // 班级编号
                    className: '', // 班级名称
                    classPic: pic, // 班级缩略图
                    yprice: '', // 原价格
                    yhPrice: '', // 优惠价格
                    tgPrice: '', // 团购价格
                    classTime: '', // 时长
                    classState: '1', // 班级状态：开放、授课、完成
                    registrationStartTime: '', // 报名开始时间
                    expectTime: '', // 预计开班时间
                    acceptTime: '', // 实际开班时间
                    curSum: '', // 当前报名人数
                    expectSum: '', // 计划开班人数
                    acceptSum: '', // 实际开班人数
                    remark: '', // 备注
                    teachingAssistant: '', // 助教
                    teacherId: '',
                    type: this.dataForm.type,
                    classImg: ''
                  }
                  if (this.$refs.remark) {
                    this.$refs.remark.setContent('')
                  }
                }
                // this.clearFormData()
              } else {
                this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
              }
              this.editLoading = false
              this.editDialogVisible = false
              this.findPage()
            })
          })
        }
      })
    },
    dialogCloseForSave: function() {
      this.clearFormData()
    },
    clearFormData: function() {
      this.dataForm = {
        classId: '', // 班级标识ID
        majorId: '', // 专业标识ID
        orgId: '', // 机构ID
        classNo: '', // 班级编号
        className: '', // 班级名称
        classPic: '', // 班级缩略图
        yprice: '', // 原价格
        yhPrice: '', // 优惠价格
        tgPrice: '', // 团购价格
        classTime: '', // 时长
        classState: '1', // 班级状态：开放、授课、完成
        registrationStartTime: '', // 报名开始时间
        expectTime: '', // 预计开班时间
        acceptTime: '', // 实际开班时间
        curSum: '', // 当前报名人数
        expectSum: '', // 计划开班人数
        acceptSum: '', // 实际开班人数
        remark: '', // 备注
        teachingAssistant: '', // 助教
        teacherId: '',
        type: '',
        classImg: ''
      }
    },
    getClassPic: function() {
      this.$api.tevgltchclass.getClassPic().then((res) => {
        if (res.code == 0) {
          this.classPicList = res.data
          this.classPicList.map(logo => {
            // logo.shortUrl = logo.dictUrl.substring(logo.dictUrl.lastIndexOf("/") + 1)
            logo.shortUrl = logo.dictUrl
            logo.dictUrl = baseUrl + logo.dictUrl
          })
        }
      })
    },

    getTeachingAssistant: function() {
      this.$api.tevgltchclass.getTeachingAssistant().then((res) => {
        if (res.code === 0) {
          this.teachingAssistantList = res.data
        }
      })
    }

  }
}
</script>

<style scoped>
  .subjectLogoSelectedImg {
    border: 4px solid #28a745;
    position: relative;
  }
  .cb-class-img {
    width: 130px;
  }
</style>
