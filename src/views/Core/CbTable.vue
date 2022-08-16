<template>
  <div>
    <!--表格栏-->
    <el-table
      v-loading="loading"
      v-if="data.list"
      ref="table"
      :data="data.list"
      :highlight-current-row="highlightCurrentRow"
      :is-open="isOpen"
      :cbid="cbid"
      :show-user-name="showUserName"
      :element-loading-text="$t('action.loading')"
      :border="border"
      :stripe="stripe"
      :show-overflow-tooltip="showOverflowTooltip"
      :size="size"
      :align="align"
      style="width:100%;"
      @selection-change="selectionChange"
      @row-click="rowClick"
      @select="select"
      @cell-click="cellClick"
      @current-change="handleCurrentChange" >
      <!-- checkbox列 -->
      <el-table-column v-if="showBatchDelete & showOperation" type="selection" width="45"/>
      <!--数据列-->
      <el-table-column
        v-for="column in columns"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :fixed="column.fixed"
        :key="column.prop"
        :type="column.type"
        :formatter="column.formatter"
        :sortable="column.sortable == null ? true : column.sortable"
        :show-overflow-tooltip="true"
        header-align="center"
        align="center">
        <template slot-scope="scope">
          <!-- 自定义列switch开关 -->
          <el-switch
            v-if="['el-switch', 'switch'].includes(column.dataType)"
            v-model="scope.row[column.prop]"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="dataTypeClick($event, scope.$index, scope.row, column.callback)"/>
          <!-- 自定义列超链接 -->
          <span
            v-else-if="['el-link', 'link'].includes(column.dataType)"
            class="el-menu-item is-active"
            style="margin-left: -10px"
            @click="dataTypeClick($event, scope.$index, scope.row, column.callback)">
            {{ formatterData(scope, column.prop) }}
          </span>
          <!--自定义列头像-->
          <!--自定义列tag标签-->
          <!--默认普通列-->
          <span v-else>
            {{ formatterData(scope, column.prop) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column v-if="showOperation" :label="$t('action.operation')" width="155" fixed="right" header-align="center" align="center">
        <template slot-scope="scope" >
          <div v-if="permsLength<3">
            <cb-button
              :label="$t('action.edit')"
              :perms="permsEdit"
              icon="fa fa-edit"
              type="primary"
              class="editButtonPost"
              @click="handleEdit(scope.row, scope.$index)" />
            <cb-button
              :label="$t('action.delete')"
              :perms="permsDelete"
              icon="fa fa-trash"
              class="editButtonPost"
              type="primary"
              @click="handleDelete(scope.row, scope.$index)" />
          </div>
          <div v-else>
            <cb-button
              :label="$t('action.edit')"
              :perms="permsEdit"
              icon="fa fa-edit"
              type="primary"
              class="editButtonPost"
              @click="handleEdit(scope.row, scope.$index)" />
            <el-dropdown ref="cbDropdown" :show-timeout="0" class="tabs-tools" trigger="click">
              <el-button ref="moreButton" size="mini" icon="fa fa-angle-down" type="primary" class="editButtonPost" @click="moreButton($event, scope.$index, scope.row,{moveUp:'0'})">{{ $t('action.more') }}</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item class="widthAll paddingNone" style="height: auto;line-height: 20px;">
                  <cb-button
                    :label="$t('action.delete')"
                    :perms="permsDelete"
                    icon="fa fa-trash"
                    class="treeHoverUlButtom"
                    @click="handleDelete(scope.row, scope.$index)" />
                </el-dropdown-item>
                <el-dropdown-item class="widthAll paddingNone" style="height: auto;line-height: 20px;">
                  <cb-button
                    v-if="scope.$index!==0"
                    :label="$t('action.moveUp')"
                    :perms="permsMove"
                    icon="fa fa-long-arrow-up"
                    class="treeHoverUlButtom"
                    @click="handleMove(scope.row, scope.$index, {moveUp:'0'}, $event)" />
                </el-dropdown-item>
                <el-dropdown-item class="widthAll paddingNone" style="height: auto;line-height: 20px;">
                  <cb-button
                    v-if="scope.$index+1!==data.list.length"
                    :label="$t('action.moveDown')"
                    :perms="permsMove"
                    icon="fa fa-long-arrow-down"
                    class="treeHoverUlButtom"
                    @click="handleMove(scope.row, scope.$index, {moveDown:'0'}, $event)" />
                </el-dropdown-item>
                <el-dropdown-item class="widthAll paddingNone" style="height: auto;line-height: 20px;">
                  <cb-button
                    :label="$t('action.view')"
                    :perms="permsView"
                    icon="fa fa-low-vision"
                    class="treeHoverUlButtom"
                    @click="handleView(scope.row, scope.$index)" />
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <!--是否开启Switch 开关-->
      <el-table-column v-if="isShow" prop="status" label="状态" width="60">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="activeValue"
            :inactive-value="inactiveValue"
            :active-text="activeText"
            :inactive-text="inactiveText"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="switchChange($event, scope.$index, scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!--分页栏-->
    <div class="toolbar" style="padding:10px;margin-bottom: 20px;margin-top: 10px">
      <cb-button
        v-if="showBatchDelete & showOperation & isShowBatchDelete"
        :label="$t('action.batchDelete')"
        :perms="permsDelete"
        :size="size"
        :disabled="selections.length===0"
        type="primary"
        style="float:left;"
        @click="handleBatchDelete()"/>
      <el-pagination
        :current-page="pageRequest.pageNum"
        :page-size="pageRequest.pageSize"
        :page-sizes="pageRequest.pageSizes"
        :pager-count="pageRequest.pagerCount"
        :total="data.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        style="float:right;"
        @current-change="refreshPageRequest"
        @size-change="handleSizeChange"/>
    </div>
  </div>
</template>

<script>
import CbButton from '@/views/Core/CbButton'
import { hasPermission } from '@/permission/index.js'
export default {
  name: 'CbTable',
  components: {
    CbButton
  },
  props: {
    parentVue: {
      type: Object,
      required: true
    },
    // 表格列配置
    columns: {
      type: Array,
      default: () => { return [] }
    },
    // 表格分页数据
    data: {
      type: Object,
      default: () => { return {} }
    },
    // 修改权限标识
    permsEdit: {
      type: String,
      default: ''
    },
    // 删除权限标识
    permsDelete: {
      type: String,
      default: ''
    },
    permsMove: {
      type: String,
      default: ''
    },
    // 查看明细权限标识
    permsView: {
      type: String,
      default: ''
    },
    // 尺寸样式
    size: {
      type: String,
      default: 'mini',
      required: false
    },
    // 文本对齐方式
    align: {
      type: String,
      default: 'left'
    },
    // 表格最大高度
    maxHeight: {
      type: Number,
      default: 420
    },
    // 是否显示操作组件
    showOperation: {
      type: Boolean,
      default: true
    },
    // 显示图片
    showImg: {
      type: Boolean,
      default: false
    },
    // 显示岗位类型
    postShowType: {
      type: Boolean,
      default: false
    },
    // 是否显示表格边框，布尔值类型时，组件使用那边直接用 border 就行，无需定义布尔类型的变量 :border="flag" flag: true
    border: {
      type: Boolean,
      default: false,
      required: false
    },
    // 是否显示斑马线
    stripe: {
      type: Boolean,
      default: true
    },
    // 是否高亮当前行
    highlightCurrentRow: {
      type: Boolean,
      default: true
    },
    // 是否单行显示
    showOverflowTooltip: {
      type: Boolean,
      default: true
    },
    // 是否显示操作组件
    showBatchDelete: {
      type: Boolean,
      default: true
    },
    isOpen: {
      type: Boolean,
      default: false
    },
    showUserName: {
      type: Boolean,
      default: false
    },
    cbid: {
      type: String,
      default: ''
    },
    // 是否开启switch开关
    isShow: { type: Boolean, default: false },
    // switch 打开时的值
    activeValue: { type: String, default: '1' },
    // switch 关闭时的值
    inactiveValue: { type: String, default: '0' },
    // switch 打开时的文字描述
    activeText: { type: String, default: '' },
    // switch 关闭时的文字描述
    inactiveText: { type: String, default: '' },
    // 文本对齐方式
    rowKey: {
      type: String,
      default: ''
    },
    // 是否显示左下角批量删除按钮
    isShowBatchDelete: { type: Boolean, default: true }
  },
  data() {
    return {
      // 所有权限标识
      perms: {},
      permsLength: 0,
      // 分页信息
      pageRequest: {
        // 当前页码  page
        pageNum: 1,
        // 一页显示几条 limit
        pageSize: 10,
        pageSizes: [10, 20, 30, 40],
        // 显示几个页数按钮
        pagerCount: 5
      },
      // 加载标识
      loading: false,
      // 列表选中列
      selections: []
    }
  },
  mounted() {
    this.refreshPageRequest(1)
    this.$nextTick(function() {
      if (this.permsEdit) {
        this.perms.permsEdit = this.permsEdit
      }
      if (this.permsDelete) {
        this.perms.permsDelete = this.permsDelete
      }
      if (this.permsMove) {
        this.perms.permsMove = this.permsMove
      }
      // 查看明细
      if (this.permsView) {
        this.perms.permsView = this.permsView
      }
      this.permsLength = Object.keys(this.perms).length
    })
  },
  methods: {
    // 自定义列增加formatter格式化函数
    formatterData: function(scope, prop) {
      return scope.column.formatter ? scope.column.formatter(scope.row, scope.column, scope.row[prop]) : scope.row[prop]
    },
    // 分页查询
    findPage: function() {
      this.loading = true
      const callback = res => {
        this.loading = false
      }
      this.$emit('findPage', { pageRequest: this.pageRequest, callback: callback })
    },
    hasPerms: function(perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermission(perms) & !this.disabled
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections
      this.$emit('selectionChange', { selections: selections, vue: this.$refs.table })
    },
    handleSizeChange: function(val) {
      this.pageRequest.pageSize = val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.pageRequest.pageNum = 1
      this.findPage()
    },
    // 换页刷新
    refreshPageRequest: function(pageNum) {
      this.pageRequest.pageNum = pageNum
      this.findPage()
    },
    // 选择切换
    handleCurrentChange: function(val) {
      this.$emit('handleCurrentChange', val)
    },
    // 修改
    handleEdit: function(row, index) {
      this.$emit('handleEdit', row, index, this.$refs.table)
    },
    handleMove: function(row, index, moves, event) {
      this.$emit('handleMove', row, index, moves, event)
    },
    // 删除
    handleDelete: function(row, index) {
      if (row.id) {
        // 先清除所有选中项目
        this.$refs.table.clearSelection()
        // 再重新选中
        this.$refs.table.toggleRowSelection(row)
        this.delete(row.id, row)
      } else {
        this.$emit('handleDeleteOther', row, this.$refs.table)
      }
    },
    // 批量删除
    handleBatchDelete: function() {
      if (this.selections.length < 1) {
        this.$message({ message: '请选择一条记录', type: 'warning' })
      } else {
        if (this.selections[0].id) {
          const ids = this.selections.map(item => item.id).toString()
          this.delete(ids)
        } else {
          this.$emit('handleBatchDelete', { params: this.selections })
          this.$emit('handleDeleteOther', { params: this.selections, vue: this.$refs.table })
          this.$emit('handleBatchDeleteOther', { params: this.selections, vue: this.$refs.table })
        }
      }
    },
    // 删除操作
    delete: function(ids, row) {
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        const params = []
        const idArray = (ids + '').split(',')
        for (var i = 0; i < idArray.length; i++) {
          params.push({ 'id': idArray[i] })
        }
        this.loading = true
        const callback = res => {
          if (res.code === 0) {
            this.$message({ message: '删除成功', type: 'success' })
            this.findPage()
          } else {
            this.$message({ message: '操作失败, ' + res.msg, type: 'error' })
          }
          this.loading = false
        }
        this.$emit('handleDelete', { params: params, callback: callback, obj: row })
      }).catch(() => {
        // 清除表格所有选中项
        this.$refs.table.clearSelection()
      })
    },
    // 点击表格中的行触发该事件
    rowClick: function(row, column, event) {
      if (this.isOpen) {
        // 如果点击的是switch开关之状态一栏，则不让它触发
        if (column.property === 'status') {
          return false
        }
        // 如果点击的是操作一栏
        if (column.label === '操作') {
          if (event.target.innerText === '更多') {
            this.$refs.table.clearSelection()
          }
        }
        // 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        this.$refs.table.toggleRowSelection(row)
        // row,column,obj,list某些地方可能用到
        this.$emit('toggleRowSelection', { row: row, column: column, obj: row, list: this.selections, vue: this.$refs.table })
      }
    },
    cellClick: function(row, column, cell, event) {
      if (this.showUserName && (column.label === '姓名' || column.label === '真实姓名')) {
        this.$emit('ReadName', { row: row })
      }
    },
    select: function(selection, row) {},
    // switch 状态发生变化时的回调函数
    switchChange: function(e, index, data) {
      this.$emit('switchChange', { e: e, index: index, data: data })
    },

    /**
     * 查看明细
     * @param index 下标
     * @param row 当前对象
     */
    handleView(index, row) {
      this.$emit('handleView', index, row)
    },

    /**
     * 表格列中更多按钮触发事件
     * @param event
     * @param index
     * @param row
     * @param data
     */
    moreButton(event, index, row, data) {},

    /**
     *  自定义列的点击事件
     * @param {*} event
     * @param {*} index 下标
     * @param {*} row 当前被点击的行数据
     * @param {*} callbackName 自定义的回调函数名称
     */
    dataTypeClick(event, index, row, callbackName) {
      if (callbackName) {
        this.parentVue[callbackName](row, index, event)
      }
    }
  }
}
</script>

<style scoped>
  .el-button+.el-button {
    margin-left: 0px;
  }
</style>
