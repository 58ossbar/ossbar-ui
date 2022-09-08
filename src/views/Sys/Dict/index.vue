<template>
  <div>
    <el-container class="page-container scrollAllY">
      <el-aside width="240px" class="box_shadows bgcolor LeftPadding marginBottom">
        <div class="displayFlex marginBottom">
          <el-input
            v-model="filterText"
            class="buttomMargin"
            size="small"
            placeholder="输入字典名称查询"
            suffix-icon="el-icon-search"
            clearable
            maxlength="30"
            type="text" />
          <cb-button
            class="queryButtonPlus"
            icon="el-icon-plus"
            perms="sys:tsysdict:add"
            type="primary"
            @click="handleAddType({dictSort:'1'})"/>
        </div>
        <el-tree
          v-loading="loadingTree"
          ref="dictTree"
          :data="listData"
          :highlight-current="true"
          :props="{label: 'dictName', children: 'list'}"
          :element-loading-text="$t('action.loading')"
          :filter-node-method="filterNode"
          node-key="dictId"
          current-node-key="" >
          <div
            slot-scope="{ node, data }"
            :class="{displayColor:!data.swithToggle}"
            class="fontSizeComm widthAll dictDivSlot"
            @click="() => handleSelectDeptTree(data)"
            @mouseleave="() => mouseleaves(data)"
            @mouseenter="() => mouseenters(data)">
            <div >
              <span>
                <img v-if="data.dictUrl" :src="data.dictUrl" class="dictIconTreeStyle" >
                <img v-else class="dictIconTreeStyle" src="../../../assets/user1.png" >
                {{ node.label }}
              </span>
              <span
                :style="data.iconStyleI ?'display:none' : 'display:inline-block'"
                class="treeIconHover"
                @mouseleave="() => mouseleave(data)"
                @mouseenter="() => mouseenter(data)">
                <i class="el-icon-more buttomMargin "/>
              </span>
              <ul
                :style="data.ulStyle ?'display:none' : 'display:inline-block'"
                class="treeHoverUl"
                @mouseenter="() => mouseenter(data)"
                @mouseleave="() => mouseleave(data)" >
                <li><cb-button
                  :label="$t('action.add')"
                  icon="fa fa-plus"
                  perms="sys:menu:add"
                  class="treeHoverUlButtom "
                  @click="() => handleAdd(data)" />
                </li>
                <li><cb-button
                  :label="$t('action.edit')"
                  icon="fa fa-edit"
                  perms="sys:tsysdict:edit"
                  class="treeHoverUlButtom "
                  @click="() => handleEditType(data)" />
                </li>
                <li>
                  <cb-button
                    :label="$t('action.delete')"
                    icon="fa fa-trash-o"
                    perms="sys:tsysdict:remove"
                    class="treeHoverUlButtom"
                    @click="() => handleDelete(data)" />
                </li>
              </ul>
            </div>
          </div>
        </el-tree>
      </el-aside>
      <el-container>
        <el-header class="box_shadows bgcolor  scrollRightYDictMenu " style="height: auto;">
          <!--工具栏-->
          <el-form ref="queryForm" :inline="true" :model="filters" :size="size" class="queryForm textAlign" label-width="100px" label-position="right">
            <el-collapse class="elCollapseItemNoBoeder elCollapseDict">
              <el-row>
                <el-col :span="3">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>字典分类名称</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item class="dictInputQueryWidth textAlign">
                    <el-input v-model="filters.dictName" maxlength="30" type="text" placeholder="字典分类名称" clearable/>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>字典展示分类</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item class="dictInputQueryWidth">
                    <cb-param
                      :parent-vue="_self"
                      :change="findPage"
                      :filters="filters"
                      placeholder="请选择"
                      name="displaySort"
                      param="displaySort"
                      type="select"
                      empty-label="全部"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-form-item class="dictInputQueryLabelWidth">
                    <span>是否默认值</span>
                  </el-form-item>
                </el-col>
                <el-col :span="5">
                  <el-form-item class="dictInputQueryWidth textAlign">
                    <cb-param
                      :parent-vue="_self"
                      :change="findPage"
                      :filters="filters"
                      placeholder="请选择"
                      name="isdefault"
                      param="isdefault"
                      type="select"
                      empty-label="全部"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-collapse-item class="elCollapseItemNoBoeder elCollapseItemMarginBottom">
                <el-row>
                  <el-col :span="3">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>字典值</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item class="dictInputQueryWidth ">
                      <el-input v-model="filters.dictValue" maxlength="100" type="text" placeholder="字典值" clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>字典编码</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item class="dictInputQueryWidth ">
                      <el-input v-model="filters.dictCode" maxlength="60" type="text" placeholder="字典编码" clearable/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="3">
                    <el-form-item class="dictInputQueryLabelWidth">
                      <span>是否显示</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="5">
                    <el-form-item class="dictInputQueryWidth" >
                      <cb-param
                        :parent-vue="_self"
                        :change="findPage"
                        :filters="filters"
                        placeholder="请选择"
                        name="displaying"
                        param="displaying"
                        type="select"
                        empty-label="全部"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-collapse-item>
            </el-collapse>
            <el-row class="elDeptFormButton dictQueryCenterButton">
              <el-col :span="24">
                <cb-button :loading="loadingQuery" :label="$t('action.search')" icon="fa fa-search" perms="sys:tsysdict:query" type="primary" @click="findPage(null)"/>
                <cb-button :label="$t('action.add')" icon="fa fa-plus" type="primary" perms="sys:tsysdict:add" @click="handleAdd" />
              </el-col>
            </el-row>
          </el-form>
        </el-header>
        <el-main class="box_shadows bgcolor  scrollRightYDictMenu tableDict marginBottom">
          <cb-table
            ref="table"
            :parent-vue="_self"
            :data="pageResult"
            :columns="columns"
            :btn-columns="btnColumns"
            perms-batch-delete="sys:tsyspost:add"
            row-key="dictId"
            @findPage="findPage"
            @selectionChange="handleSelectionChange"
            @handleBatchDelete="handleBatchDelete"/>
        </el-main>
      </el-container>
    </el-container>
    <!-- 新增修改字典界面 -->
    <SaveForm ref="saveForm" @ok="handleOk" />
    <!-- 新增修改字典分类界面 -->
    <SaveTypeForm ref="saveTypeForm" @ok="handleOkType" />
  </div>
</template>

<script>
import CbTable from '@/views/Core/CbTable'
import CbButton from '@/views/Core/CbButton'
import SaveForm from './SaveForm.vue'
import SaveTypeForm from './SaveTypeForm.vue'
import { handleImagePath } from '@/utils/util'
export default {
  components: {
    CbTable,
    CbButton,
    SaveForm,
    SaveTypeForm
  },
  data() {
    return {
      size: 'small',
      filters: {
        parentType: '',
        // 字典分类名称
        dictName: '',
        // 字典展示分类
        displaySort: '',
        // 是否默认值
        isdefault: '',
        // 字典值
        dictValue: '',
        // 字典编码
        dictCode: '',
        // 是否显示
        displaying: ''
      },
      loadingQuery: false,
      pageRequest: {},
      // 表格数据
      pageResult: {},
      columns: [
        { prop: 'dictType', label: '分类编码', minWidth: 100 },
        { prop: 'dictName', label: '分类名称', minWidth: 105 },
        { prop: 'dictCode', label: '字典编码', minWidth: 105 },
        { prop: 'dictValue', label: '字典值', minWidth: 85 },
        // 0是默认
        { prop: 'isdefault', label: '是否默认值', minWidth: 95 },
        // 0是显示
        { prop: 'displaying', label: '是否显示', minWidth: 95 }
      ],
      btnColumns: [
        { icon: 'fa fa-edit', label: '修改', perms: 'sys:role:edit', callback: 'handleEdit' },
        { icon: 'fa fa-trash', label: '删除', perms: 'sys:role:remove', callback: 'handleDelete' }
      ],
      // 表格中被选中的列数据
      selections: [],
      // 左侧搜索
      filterText: '',
      loadingTree: false,
      listData: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.dictTree.filter(val)
    }
  },
  mounted() {
    this.findTreeData()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.dictName.indexOf(value) !== -1
    },
    handleSelectDeptTree(data) {
      this.filters.parentType = data.dictId
      this.findPage()
    },
    findTreeData(dictId) {
      this.loadingTree = true
      this.$api.dict.findTree().then(res => {
        this.loadingTree = false
        if (res.code === 0) {
          res.data.forEach(item => {
            item.swithToggle = item.displaying === '1'
            item.ulStyle = true
            item.iconStyleI = true
            item.dictUrl = handleImagePath(item.dictUrl)
          })
          this.listData = res.data
          // 选中指定节点
          this.$nextTick(() => {
            if (dictId) {
              this.$refs.dictTree.setCurrentKey(dictId)
            }
          })
        }
      })
    },
    findPage: function(data) {
      if (data && data !== null) {
        this.pageRequest = data.pageRequest
      } else {
        this.pageRequest.pageNum = 1
      }
      // 当前页
      this.filters.page = this.pageRequest.pageNum
      // 每页显示数
      this.filters.limit = this.pageRequest.pageSize
      this.loadingQuery = true
      this.$api.dict.findPage(this.filters).then(res => {
        this.pageResult = res.data
        this.loadingQuery = false
      }).then(data != null ? data.callback : '')
    },
    handleAdd() {
      const currData = this.$refs.dictTree.getCurrentNode()
      if (currData == null) {
        this.$message({ message: '请先在左侧选择一条目录再新增字典!', type: 'warning' })
        return false
      }
      this.$refs.saveForm.handleAdd(currData)
    },
    handleEdit(row) {
      this.$refs.saveForm.handleEdit(row, this.dataLeftTree)
    },
    handleOk(data) {
      this.findPage()
    },
    handleDelete(row) {
      this.handleBatchDelete([row.dictId])
    },
    handleBatchDelete(ids) {
      if (!ids || !ids.length) {
        return false
      }
      this.$confirm('确认删除选中记录吗？', '提示', {
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.$api.dict.batchDelete(ids).then(res => {
          if (res.code !== 0) {
            this.$message.error(res.msg)
          } else {
            this.$message({ message: '操作成功', type: 'success' })
            this.findTreeData()
            this.filters.parentType = ''
            this.findPage()
          }
        }).catch(() => {
          this.$message({ type: 'error', message: '删除失败,接口异常' })
        })
      }).catch(() => {
        this.$message({ type: 'info', message: '删除未成功' })
      })
    },
    handleSelectionChange(rows) {
      this.selections = rows
    },
    handleAddType() {
      this.$refs.saveTypeForm.handleAdd(this.dataLeftTree)
    },
    handleEditType(data) {
      this.$refs.saveTypeForm.handleEdit(data)
    },
    handleOkType(submitData) {
      this.findTreeData(submitData.dictId)
      this.filters.parentType = submitData.dictId
      this.findPage()
    },
    mouseenters: function(data) {
      data.iconStyleI = false
    },
    mouseleaves: function(data) {
      data.iconStyleI = true
    },
    mouseenter: function(data) {
      data.ulStyle = false
    },
    mouseleave: function(data) {
      data.ulStyle = true
    }
  }
}
</script>

<style>

</style>
