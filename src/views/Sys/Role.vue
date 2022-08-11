<template>
  <div class="page-container">
	<!--工具栏-->
	<div class="toolbar" style="box-shadow: 0px 0px 5px rgba(0,0,0,.5);border-radius: 6px;padding-top: 20px">
		<el-form class="toolbarinput" :inline="true" :model="filters" :size="size">
      <el-form-item style="width: 20%;margin: 0;background: #f4f4f4">
         <el-span>角色名称</el-span>
      </el-form-item>
			<el-form-item style="margin: 0;">
				<el-input v-model="filters.name" style="width: 350px" ></el-input>
			</el-form-item>
      <el-form-item style="width: 20%;margin: 0;background: #f4f4f4">
        <el-span>所属机构</el-span>
      </el-form-item>
      <el-form-item style="margin: 0;">
        <el-input v-model="filters.mechanism" style="width: 350px" ></el-input>
      </el-form-item>
		</el-form>
    <el-form :inline="true" style="margin-top:10px;" :model="filters" :size="size">
      <el-form-item>
        <kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
      </el-form-item>
      <el-form-item>
        <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:role:add" type="primary" @click="handleAdd" />
      </el-form-item>
      <el-form-item>
        <kt-button icon="fa fa-user-o" :label="$t('action.assignUsers')" perms="sys:role:edit" type="primary" @click="handleAssignUsers" />
      </el-form-item>
    </el-form>
	</div>
	<!--表格内容栏-->
	<kt-table permsEdit="sys:role:edit" permsDelete="sys:role:delete"  :highlightCurrentRow="true"
            style="margin-top: 20px;box-shadow: 0px 0px 5px rgba(0,0,0,.5);border-radius: 6px;height: 420px;padding: 20px" :stripe="false"
		:data="pageResult" :columns="columns"   @handleCurrentChange="handleRoleSelectChange"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" >
	</kt-table>
	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size" style="display: flex">
      <div style="width: 45%;">
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="所属机构" prop="affiliate">
          <el-select v-model="dataForm.affiliate" auto-complete="off" style="width: 100%">
          </el-select>
        </el-form-item>
        <el-form-item label="数据范围" prop="range">
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色描述" prop="describe">
          <el-input v-model="dataForm.describe" auto-complete="off"></el-input>
        </el-form-item>
      </div>
      <div style="width: 55%;">
        <el-form-item prop="jurisdiction" style="overflow:scroll; height:200px;overflow-x:hidden">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
          <el-tree
            class="filter-tree"
            :data="data"
            show-checkbox
            :props="defaultProps"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2">
          </el-tree>
        </el-form-item>
      </div>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableTreeColumn from '@/views/Core/TableTreeColumn'
export default {
	components:{
		KtTable,
		KtButton,
		TableTreeColumn
	},
	data() {
		return {
			size: 'small',
			filters: {
				name: ''
			},
			columns: [
				{prop:"id", label:"ID", minWidth:50},
				{prop:"name", label:"角色名", minWidth:120},
				{prop:"affiliate", label:"所属机构", minWidth:120},
        {prop:"state", label:"状态", minWidth:120},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat},
        {prop:"describe", label:"角色描述", minWidth:120},
			],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入角色名', trigger: 'blur' }
				],
        affiliate: [
          { required: true, message: '请选择所属机构', trigger: 'blur' }
        ]
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
				name: '',
        describe:'',
        affiliate:'',
        range:''
			},
			selectRole: {},
			menuData: [],
			menuSelections: [],
			menuLoading: false,
			authLoading: false,
			checkAll: false,
			currentRoleMenus: [],
      filterText: '',
      data: [{
        id: 1,
        label: '一级 1',
        children: [{
          id: 4,
          label: '二级 1-1',
          children: [{
            id: 9,
            label: '三级 1-1-1'
          }, {
            id: 10,
            label: '三级 1-1-2'
          }]
        }]
      }, {
        id: 2,
        label: '一级 2',
        children: [{
          id: 5,
          label: '二级 2-1'
        }, {
          id: 6,
          label: '二级 2-2'
        }]
      }, {
        id: 3,
        label: '一级 3',
        children: [{
          id: 7,
          label: '二级 3-1'
        }, {
          id: 8,
          label: '二级 3-2'
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      options: [{
        value: '选项1',
        label: '所有数据'
      }, {
        value: '选项2',
        label: '所有部门及以下数据'
      }, {
        value: '选项3',
        label: '所有部门数据'
      }, {
        value: '选项4',
        label: '仅本人数据'
      }, {
        value: '选项5',
        label: '按明细设置'
      }],
      value: ''
		}
	},
	methods: {
    //带搜索框的数
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}}
			this.$api.role.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
				this.findTreeData()
			}).then(data!=null?data.callback:'')
		},
		// 批量删除
		handleDelete: function (data) {
		  alert("23");
			this.$api.role.batchDelete(data.params).then(data.callback)
		},
    //分配用户
    handleAssignUsers:function(data){
		  alert("分配用户");
      this.$api.role.batchDelete(data.params).then(data.callback)
    },
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				name: '',
				remark: ''
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						this.$api.role.save(params).then((res) => {
							this.editLoading = false
							if(res.code == 200) {
								this.$message({ message: '操作成功', type: 'success' })
								this.dialogVisible = false
								this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '操作失败, ' + res.msg, type: 'error'})
							}
							this.findPage(null)
						})
					})
				}
			})
		},
		// 获取数据
		findTreeData: function () {
			this.menuLoading = true
			this.$api.menu.findMenuTree().then((res) => {
				this.menuData = res.data
				this.menuLoading = false
			})
		}
	},
	mounted() {
	},
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  }
}
</script>
<style scoped>

</style>
