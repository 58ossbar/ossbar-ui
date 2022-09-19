<template>
  <div class="chapter-area-content">
    <el-dialog
      v-dialogDrag
      :title="title + str"
      :visible.sync="dialogVisibleActual"
      width="80%"
      top="5vh"
      @close="handleClose"
    >

      <div class="form-inline-div">
        <el-row>
          <el-col :span="24">
            <el-form :inline="true" :model="filters" :size="size" class="demo-form-inline">
              <el-form-item label="姓名/昵称">
                <el-input v-model="filters.traineeName" placeholder="姓名/昵称" clearable @clear="findPage"/>
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input v-model="filters.mobile" placeholder="手机号码" clearable @clear="findPage"/>
              </el-form-item>
              <el-form-item label="性别">
                <cb-dict :filters="filters" :change="findPage" placeholder="学员性别" name="traineeSex" dict="sex" type="select" empty-label="全部" clearable @clear="findPage"/>
              </el-form-item>
              <el-form-item>
                <el-button :size="size" type="primary" @click="findPage">查询</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>

      <el-table
        ref="traineeListTable"
        :data="tableData"
        row-key="traineeId"
        style="width: 100%"
        border
        highlight-current-row
        @selection-change="handleSelectionChange"
        @row-click="rowClick"
      >
        <el-table-column :reserve-selection="true" type="selection" width="55" align="center"/>
        <el-table-column prop="traineePic" label="头像" width="65" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.traineePic" class="trainee-pic">
          </template>
        </el-table-column>
        <el-table-column prop="traineeName" label="姓名/昵称" width="180" align="center"/>
        <el-table-column prop="mobile" label="手机号码" width="180" align="center"/>
        <el-table-column prop="traineeSex" label="性别" width="80" align="center"/>
        <el-table-column prop="jobNumber" label="学号/工号" align="center"/>
        <el-table-column prop="traineeSchool" label="所在学校" align="center"/>
        <el-table-column prop="email" label="邮箱地址" align="center"/>
      </el-table>

      <!-- 分页栏 begin -->
      <div class="toolbar" style="padding:10px;margin-bottom: 20px;margin-top: 10px">
        <el-pagination
          :current-page="pageRequest.pageNum"
          :page-size="pageRequest.pageSize"
          :page-sizes="pageRequest.pageSizes"
          :pager-count="pageRequest.pagerCount"
          :total="totalCount"
          layout="total, sizes, prev, pager, next, jumper"
          style="float:right;"
          @current-change="refreshPageRequest"
          @size-change="handleSizeChange"/>
      </div>
      <!-- 分页栏 end -->

      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="handleClose">{{ $t('action.cancel') }}</el-button>
        <el-button :size="size" :loading="editLoading" type="primary" @click.native="saveContent">{{ $t('action.preservation') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { baseUrl } from '@/utils/global'
export default {
  name: 'SaveChapter',
  components: {},
  props: {
    // 用于控制是否显示弹出层
    dialogVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    // 课程id
    title: {
      type: String,
      default: '学员列表',
      required: false
    },
    size: {
      type: '',
      default: 'small',
      required: false
    }
  },
  data() {
    return {
      str: '',
      // 查询条件
      filters: {
        pageNum: 1,
        pageSize: 10
      },
      // 分页
      editLoading: false,
      // 控制页面显示/隐藏
      dialogVisibleActual: this.dialogVisible,
      // 表格数据
      tableData: [],
      // 表格选中列
      multipleSelection: [],
      // 分页信息
      totalCount: 0,
      pageRequest: {
        // 一页显示几条  limit
        pageSize: 10,
        // 当前页码  page
        pageNum: 1,
        // 提供选择
        pageSizes: [10, 30, 50, 100],
        // 显示几个页数按钮
        pagerCount: 5
      }
    }
  },
  watch: {
    'dialogVisible': {
      handler(newVal) {
        this.dialogVisibleActual = newVal
        if (this.dialogVisibleActual) {
          this.findPage()
        }
      }
    }
  },
  mounted() {
  },
  methods: {
    convertSexName(key) {
      if (!key) {
        return ''
      }
      const map = {
        0: '保密',
        1: '男',
        2: '女'
      }
      return map[Number(key)]
    },
    // 选择分页栏中页数
    handleSizeChange: function(val) {
      this.pageRequest.pageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageRequest.pageNum = 1
      this.findPage()
    },
    // 换页刷新
    refreshPageRequest(pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
    /**
       * 查询未加入班级的学员
       */
    findPage() {
      this.filters.pageNum = this.pageRequest.pageNum
      this.filters.pageSize = this.pageRequest.pageSize
      this.$api.tevgltchclasstrainee.findTraineeListNotInClassWithPage(this.filters).then(res => {
        if (res.code === 0) {
          res.data.list.forEach(item => {
            if (item.traineePic) {
              // eslint-disable-next-line eqeqeq
              const flag = item.traineePic.indexOf('http') != -1 || item.traineePic.indexOf('https') != -1
              if (!flag) {
                item.traineePic = baseUrl + item.traineePic
              }
            }
            item.traineeSex = this.convertSexName(item.traineeSex)
          })
          this.tableData = res.data.list
          this.totalCount = res.data.totalCount
          if (this.title) {
            this.str = '（共' + this.totalCount + '人）'
          }
        }
      })
    },
    rowClick(row) {
      this.$refs.traineeListTable.toggleRowSelection(row)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleClose(evt) {
      this.$emit('close', evt)
    },
    saveContent() {
      this.$emit('save', this.multipleSelection)
    },
    // 清空选项
    clearMultipleSelection() {
      this.multipleSelection = []
    }
  }
}
</script>

<style scoped>
.form-inline-div {
  margin: 10px 5px;
  text-align: center;
}
.trainee-pic {
  max-width: 40px;
  max-height: 40px
}
</style>
