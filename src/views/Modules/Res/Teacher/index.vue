<template>
  <div class="page-container">
    <el-container class="page-container scrollAllY">
      <!-- 工具栏 -->
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
                  <cb-tree
                    :filters="filters"
                    :parent-vue="_self"
                    :change="findPage"
                    url="/api/sys/org/getOrgTree"
                    placeholder="请选择所属院校"
                    name="orgId"
                    prop="{&quot;id&quot;:&quot;orgId&quot;, &quot;name&quot;:&quot;orgName&quot;}"
                    default-expanded-level="1"/>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>教师名称</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <el-input
                    v-model="filters.teacherName"
                    placeholder="教师名称"
                    clearable
                    @clear="findPage()"
                    @keyup.enter.native="findPage()"/>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-form-item class="dictInputQueryLabelWidth">
                  <span>首页显示</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item class="dictInputQueryWidth ">
                  <cb-dict :filters="filters" :change="findPage" placeholder="首页显示" name="showIndex" dict="state1" type="select" empty-label="全部"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
              <el-row>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>账号</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-input v-model="filters.username" placeholder="账号/手机号码" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>职位</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <el-select v-model="filters.teacherPost" placeholder="请选择职位" style="width: 100%;" clearable>
                      <el-option
                        v-for="item in teacherPostList"
                        :key="item.postId"
                        :label="item.postName"
                        :value="item.postId"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>教师状态</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item class="dictInputQueryWidth ">
                    <cb-dict :filters="filters" :change="findPage" placeholder="教师状态" name="state" dict="teacher_state" type="select" empty-label="全部"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :loading="loadingQuery" :label="$t('action.search')" icon="fa fa-search" perms="tch:tevgltchteacher:query" type="primary" @click="findPage(null)"/>
              <cb-button :label="$t('action.add')" icon="fa fa-plus" perms="tch:tevgltchteacher:add" type="primary" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <!--表格内容栏-->
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <cb-table
          :parent-vue="_self"
          :data="pageResult"
          :columns="columns"
          :btn-columns="btnColumns"
          perms-batch-delete="sys:tsyspost:remove"
          row-key="teacherId"
          @findPage="findPage"
          @selectionChange="handleSelectionChange"
          @handleEdit="handleEdit"
          @handleBatchDelete="handleBatchDelete"/>
      </el-main>
    </el-container>
    <!-- 新增/修改页面 -->
    <save-form ref="saveForm" @ok="handleOk" />
  </div>
</template>

<script>
import CbTable from '@/views/Core/CbTable'
import CbButton from '@/views/Core/CbButton'
import SaveForm from './SaveForm.vue'
import { handleImagePath } from '@/utils/util'
export default {
  components: {
    CbTable,
    CbButton,
    SaveForm
  },
  data() {
    return {
      size: 'small',
      filters: {
        // 所属院校
        orgId: '',
        // 教师名称
        teacherName: '',
        // 首页显示
        showIndex: '',
        // 账号/手机号码
        username: '',
        // 教师岗位
        teacherPost: '',
        // 教师状态
        state: ''
      },
      loadingQuery: false,
      pageRequest: {},
      pageResult: {},
      columns: [
        { prop: 'teacherPic', label: '教师头像', minWidth: 80, dataType: 'image', callback: 'imageClick', title: 'teacherName' },
        { prop: 'teacherName', label: '教师名称', minWidth: 100, dataType: 'link', callback: 'linkClick' },
        { prop: 'orgId', label: '所属院校', minWidth: 100 },
        { prop: 'postName', label: '教师职位', minWidth: 100 },
        { prop: 'username', label: '账号', minWidth: 100 },
        { prop: 'majorName', label: '职业路径', minWidth: 100 },
        { prop: 'state', label: '教师状态', minWidth: 100, dataType: 'tag', type: 'success', mapper: '{"key":"离职","value":"danger"}' },
        { prop: 'showIndex', label: '首页显示', minWidth: 100, dataType: 'switch', callback: 'switchClick',
          formatter: function(row, column, cellValue) {
            return cellValue === '是'
          }
        }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'tch:tevgltchteacher:edit', callback: 'handleEdit' },
        { icon: 'fa fa-trash', label: '删除', perms: 'tch:tevgltchteacher:remove', callback: 'handleDelete' }
      ],
      // 表格中被选中的列数据
      selections: [],
      // TODO
      // 岗位列表
      teacherPostList: []
    }
  },
  mounted() {
    this.getTeacherPost()
  },
  methods: {
    findPage(data) {
      this.loadingQuery = true
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      this.filters.page = this.pageRequest.pageNum
      this.filters.limit = this.pageRequest.pageSize
      this.$api.tevgltchteacher.findPage(this.filters).then(res => {
        res.data.list.forEach(item => {
          item.teacherPic = handleImagePath(item.teacherPic)
        })
        this.pageResult = res.data
        this.loadingQuery = false
      }).then(data != null ? data.callback : '')
    },
    handleAdd() {
      this.$refs.saveForm.handleAdd()
    },
    handleEdit(row) {
      this.$refs.saveForm.handleEdit(row)
    },
    handleOk(data) {
      this.findPage()
    },
    handleSelectionChange(rows) {
      this.selections = rows
    },
    handleDelete(row) {
      this.handleBatchDelete([row.teacherId])
    },
    handleBatchDelete(ids) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.tevgltchteacher.batchDelete(ids).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message({ message: '操作成功', type: 'success' })
            this.findPage()
          }
        }).catch(() => {
          this.$message({ type: 'error', message: '删除失败' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '删除未成功' })
      })
    },
    // 职位
    getTeacherPost() {
      this.$api.tevgltchteacher.getTeacherPost().then((res) => {
        if (res.code === 0) {
          this.teacherPostList = res.data
        }
      })
    }
  }
}
</script>

<style>

</style>

