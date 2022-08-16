<template>
  <div>
    <el-container class="page-container scrollAllY ">
      <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
        <!-- 工具栏 -->
        <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm" label-width="100px" label-position="right">
          <el-row class="elCollapseDict">
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>岗位类型</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth textAlign">
                <el-select v-model="filters.postType" class="widthAll" placeholder="请选择" clearable>
                  <el-option
                    v-for="item in queryFormDefaultOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    class="dictQueryOptionPadding"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-form-item class="dictInputQueryLabelWidth">
                <span>岗位名称</span>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item class="dictInputQueryWidth textAlign">
                <el-input v-model="filters.postName" maxlength="50" type="text" placeholder="岗位名称" clearable/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row class="elDeptFormButton dictQueryCenterButton">
            <el-col :span="24">
              <cb-button :label="$t('action.search')" icon="fa fa-search" perms="sys:tsyspost:query" type="primary" @click="findPage(null)"/>
              <cb-button :label="$t('action.add')" icon="fa fa-plus" type="primary" perms="sys:tsyspost:add" @click="handleAdd" />
            </el-col>
          </el-row>
        </el-form>
      </el-header>
      <!--表格内容栏-->
      <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
        <cb-table
          :post-show-type="true"
          :data="pageResult"
          :columns="columns"
          :query-form-default="queryFormDefault"
          :is-open="isOpen"
          perms-edit="sys:tsyspost:edit"
          perms-delete="sys:tsyspost:remove"
          perms-move="sys:tsyspost:query"
          row-key="postId"
          @findPage="findPage"
          @pageSizes="pageSizes"
          @toggleRowSelection="toggleRowSelection"
          @handleMove="handleMove"
          @selectionChange="selectionChange"
          @handleEdit="handleEdit"
          @handleDeleteOther="handleDelete"/>
      </el-main>
    </el-container>
    <SaveForm ref="addForm" @ok="handleOk" />
  </div>
</template>

<script>
import CbTable from '@/views/Core/CbTable'
import CbButton from '@/views/Core/CbButton'
import SaveForm from './SaveForm.vue'
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
        postType: '',
        postName: ''
      },
      loading: false,
      isOpen: true, // 是否开启点击表格行也选中
      columns: [
        { prop: 'postName', label: '岗位名称', minWidth: 60 },
        { prop: 'sort', label: '排序号', minWidth: 60 },
        { prop: 'remark', label: '岗位描述', minWidth: 80 },
        { prop: 'createUserId', label: '创建人', minWidth: 70 },
        { prop: 'createTime', label: '创建时间', minWidth: 90 },
        { prop: 'updateUserId', label: '修改人', minWidth: 70 },
        { prop: 'updateTime', label: '修改时间', minWidth: 90 }
      ],
      pageRequest: {
        totalCount: 188, // 总共多少条数据
        pageSize: 10, // 一页显示几条  limit
        totalPage: 63, // 有多少页
        pageSizes: [10, 20, 30, 40],
        currPage: 1, // 当前页码  page
        pagerCount: 5 // 显示几个页数按钮
      },
      queryFormDefaultOptions: [
        { value: '', label: '全部' },
        { value: '0', label: '公司领导' },
        { value: '1', label: '普通员工' }
      ],
      queryFormDefaultType: ['', 'success', 'info', 'warning', 'danger'],
      queryFormDefault: [
        { value: '0', label: '公司领导', type: '' },
        { value: '1', label: '普通员工', type: 'success' }
      ],
      pageSizes: [10, 20, 30, 40],
      pageResult: {}
    }
  },
  methods: {
    findPage(data) {
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      this.filters.page = this.pageRequest.pageNum
      this.filters.limit = this.pageRequest.pageSize
      this.$api.post.findPage(this.filters).then(res => {
        this.pageResult = res.data
      }).then(data != null ? data.callback : '')
    },
    handleAdd() {
      this.$refs.addForm.handleAdd()
    },
    handleEdit() {},
    handleOk(data) {
      this.findPage()
    },
    selectionChange() {},
    toggleRowSelection() {},
    handleMove() {},
    handleDelete() {},
    handleDeleteOther() {}
  }
}
</script>

<style>

</style>
