<template>
  <div style="display: flex;">
    <div class="page-container" style="width:19%;box-shadow: 0px 0px 5px rgba(0,0,0,.5);border-radius: 6px;margin-right: 1%">
      <el-input
        placeholder="输入关键字进行过滤"
        style="width: 90%;margin-top: 10px"
        v-model="filterText">
      </el-input>
      <el-tree
        style="margin-top: 10px"
        class="filter-tree"
        :data="data"
        show-checkbox
        :props="defaultProps"
        default-expand-all
        node-key="id"
        :filter-node-method="filterNode"
        ref="tree2">

      </el-tree>
    </div>
    <div class="page-container" style="width: 80%;">
      <!--工具栏-->
      <div class="toolbar" style="padding-top:10px;box-shadow: 0px 0px 5px rgba(0,0,0,.5);border-radius: 6px;">
        <el-form class="toolbarinput" :inline="true" :model="filters" style="margin-top: 5px" :size="size">
          <el-form-item style="width: 20%;margin: 0;background: #f4f4f4">
            <el-span>用户状态</el-span>
          </el-form-item>
          <el-form-item style="margin: 0;">
            <el-input v-model="filters.name" style="width: 250px" ></el-input>
          </el-form-item>
          <el-form-item style="width: 20%;margin: 0;background: #f4f4f4">
            <el-span>用户名称</el-span>
          </el-form-item>
          <el-form-item style="margin: 0;">
            <el-input v-model="filters.mechanism" style="width: 250px" ></el-input>
          </el-form-item>
        </el-form>
        <el-form class="toolbarinput" :inline="true" :model="filters" style="margin-top: 10px" :size="size">
          <el-form-item style="width: 20%;margin: 0;background: #f4f4f4">
            <el-span>手机号</el-span>
          </el-form-item>
          <el-form-item style="margin: 0;">
            <el-input v-model="filters.name" style="width: 250px" ></el-input>
          </el-form-item>
          <el-form-item style="width: 20%;margin: 0;background: #f4f4f4">
            <el-span>查询方式</el-span>
          </el-form-item>
          <el-form-item style="margin: 0;">
            <el-input v-model="filters.mechanism" style="width: 250px" ></el-input>
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
          <kt-button icon="fa fa-wheelchair"   :label="$t('action.assignRoles')" perms="sys:role:edit" type="primary" @click="handleAssignRoles" />
        </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-handshake-o" :label="$t('action.clearanceAuthority')" perms="sys:role:edit" type="primary" @click="handleClearanceAuthority" />
          </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-bell-o" :label="$t('action.resetPassword')" perms="sys:role:edit" type="primary" @click="handleResetPassword" />
          </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-diamond" :label="$t('action.distributivePrivilege')" perms="sys:role:edit" type="primary" @click="handleDistributivePrivilege" />
          </el-form-item>
        </el-form>
      </div>
      <!--表格内容栏-->
      <kt-table permsEdit="sys:user:edit" permsDelete="sys:user:delete"
                style="margin-top:10px;box-shadow: 0px 0px 5px rgba(0,0,0,.5);border-radius: 6px;height: 400px;padding: 20px"
                :data="pageResult" :columns="filterColumns"
                @findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" >
      </kt-table>
      <!--新增编辑界面-->
      <el-dialog :title="operation?'新增':'编辑'" width="48%" :visible.sync="dialogVisible"
                 style="height:700px;" :close-on-click-modal="false">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基本信息" name="first">
            <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size"
                     label-position="right" style="display: flex">
              <div style="width: 50%;">
                <el-form-item label="ID" prop="id" v-if="false">
                  <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="loginName">
                  <el-input v-model="dataForm.loginName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="name">
                  <el-input v-model="dataForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                  <el-input v-model="dataForm.password" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属机构" prop="deptName">
                  <el-input v-model="dataForm.deptName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属副机构" prop="VicedeptName">
                  <el-input v-model="dataForm.VicedeptName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                  <el-radio-group v-model="dataForm.sex">
                    <el-radio v-for="(type, index) in sex" :label="index" :key="index">{{ type }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
              <div  style="width: 50%;">
               <!--文件上传-->
               <el-form-item style="display: flex" prop="userImg">
                   <el-upload style="border: 1px silver solid;height: 178px"
                     class="avatar-uploader"
                     action="https://jsonplaceholder.typicode.com/posts/"
                     :show-file-list="false"
                     :on-success="handleAvatarSuccess"
                     :before-upload="beforeAvatarUpload">
                     <img v-if="imageUrl" :src="imageUrl" class="avatar">
                     <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                   </el-upload>
               </el-form-item>
               <el-form-item label="用户类型" prop="type">
                 <el-radio-group v-model="dataForm.usertype">
                   <el-radio v-for="(type, index) in usertype" :label="index" :key="index">{{ type }}</el-radio>
                 </el-radio-group>
               </el-form-item>
               <el-form-item label="状态" prop="userRoles">
                 <el-radio-group v-model="dataForm.status">
                   <el-radio v-for="(type, index) in status" :label="index" :key="index">{{ type }}</el-radio>
                 </el-radio-group>
               </el-form-item>
             </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="second">
            <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size"
                     label-position="right" style="display: flex">
              <div style="width: 50%;">
                <el-form-item label="ID" prop="id" v-if="false">
                  <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="系统皮肤" prop="skin">
                  <el-input v-model="dataForm.skin" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="省份证号码" prop="number">
                  <el-input v-model="dataForm.number" type="password" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="家庭住址" prop="address">
                  <el-input v-model="dataForm.address" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="dataForm.email" auto-complete="off"></el-input>
                </el-form-item>
              </div>
              <div  style="width: 50%;">
                <el-form-item label="邮政编码" prop="code">
                  <el-input v-model="dataForm.code" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="出生日期" prop="birth">
                    <el-date-picker style="width: 100%"
                      v-model="value1"
                      type="date"
                      placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="民族" prop="nation">
                  <el-input v-model="dataForm.nation" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="dataForm.phone" auto-complete="off"></el-input>
                </el-form-item>
              </div>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="权限" name="third">
            <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size"
                     label-position="right" style="display: flex">
              <div style="width: 15%;height:300px;line-height: 300px;">角色</div>
              <div style="width: 35%;border: 1px silver solid;height:300px">
                <el-tree
                  :props="props"
                  :load="loadNode"
                  lazy
                  show-checkbox
                  @check-change="handleCheckChange">
                </el-tree>
              </div>
              <div style="width: 15%;height:300px;line-height: 300px;">所属岗位</div>
              <div style="width: 35%;border: 1px silver solid;height:300px">
                <el-tree
                  :props="props"
                  :load="loadNode"
                  lazy
                  show-checkbox
                  @check-change="handleCheckChange">
                </el-tree></div>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <div slot="footer" class="dialog-footer" >
          <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
        </div>
      </el-dialog>
      <!--分配角色特权界面-->
      <el-dialog :title="operation?'分配角色':'分配特权'" width="48%" :visible.sync="dialogRoleJur"
                 style="height:700px;" :close-on-click-modal="false">
        <el-form :model="dataForm" label-width="100px" :rules="dataFormRules" ref="dataForm" :size="size"
                 label-position="right" style="display: flex">
          <div style="width: 33%;border: 1px silver solid;"> <el-input
            placeholder="输入关键字进行过滤"
            style="width: 90%;margin-top: 10px"
            v-model="filterText">
          </el-input><el-tree
            style="margin-top: 10px;overflow:scroll; height:300px;overflow-x:hidden"
            class="filter-tree"
            :data="data"
            show-checkbox
            :props="defaultProps"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2">

          </el-tree></div>
          <div style="width: 33%;border: 1px silver solid;margin-left: 2px;margin-right: 2px"> <el-input
            placeholder="输入关键字进行过滤"
            style="width: 90%;margin-top: 10px"
            v-model="filterText">
          </el-input><el-tree
            style="margin-top: 10px;overflow:scroll; height:300px;overflow-x:hidden"
            class="filter-tree"
            :data="data"
            show-checkbox
            :props="defaultProps"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2">

          </el-tree></div>
          <div style="width: 33%;border: 1px silver solid;"> <el-input
            placeholder="输入关键字进行过滤"
            style="width: 90%;margin-top: 10px"
            v-model="filterText">
          </el-input><el-tree
            style="margin-top: 10px;overflow:scroll; height:300px;overflow-x:hidden"
            class="filter-tree"
            :data="data"
            show-checkbox
            :props="defaultProps"
            default-expand-all
            node-key="id"
            :filter-node-method="filterNode"
            ref="tree2">

          </el-tree></div>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
          <el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PopupTreeInput from "@/components/PopupTreeInput"
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableColumnFilterDialog from "@/views/Core/TableColumnFilterDialog"
import { format } from "@/utils/datetime"
export default {
	components:{
		PopupTreeInput,
		KtTable,
		KtButton,
		TableColumnFilterDialog
	},
	data() {
		return {
      value1: '',
      imageUrl: '',
			size: 'small',
      menuData: [],
      activeName: 'first',
			filters: {
				name: ''
			},
			columns: [],
			filterColumns: [],
			pageRequest: { pageNum: 1, pageSize: 10 },
			pageResult: {},
      sex: ["男", "女"],
      usertype: ["内部用户", "外部用户"],
      status: ["禁用", "正常"],
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
      dialogRoleJur: false, // 新增编辑界面是否显示
			editLoading: false,
      menuLoading: false,
			dataFormRules: {
				name: [
					{ required: true, message: '请输入用户名', trigger: 'blur' }
				]
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
        loginName:'',
				name: '',
        usertype:'1',
				password: '',
				deptId: 1,
				deptName: '',
        VicedeptName:'',
        sex:'1',
				mobile: '',
        skin: '',
        number: '',
        address: '',
        nation: '',
        phone: '',
        email: '',
        code: '',
				status: 1,
				userRoles: []
			},
			deptData: [],
      props: {
        label: 'name',
        children: 'zones'
      },
      count: 1,
			roles: [],
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
      }
		}
	},
	methods: {
	  //头像上传
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
		// 获取分页数据
		findPage: function (data) {
			if(data !== null) {
				this.pageRequest = data.pageRequest
			}
			this.pageRequest.columnFilters = {name: {name:'name', value:this.filters.name}}
			this.$api.user.findPage(this.pageRequest).then((res) => {
				this.pageResult = res.data
				this.findUserRoles()
			}).then(data!=null?data.callback:'')
		},
		// 加载用户角色信息
		findUserRoles: function () {
			this.$api.role.findAll().then((res) => {
				// 加载角色集合
				this.roles = res.data
			})
		},
		// 批量删除
		handleDelete: function (data) {
			this.$api.user.batchDelete(data.params).then(data!=null?data.callback:'')
		},
		// 显示新增界面
		handleAdd: function () {
			this.dialogVisible = true
			this.operation = true
			this.dataForm = {
				id: 0,
				name: '',
				password: '',
				deptId: 1,
				deptName: '',
				email: '',
				mobile: '',
				status: 1,
				userRoles: []
			}
		},
		// 显示编辑界面
		handleEdit: function (params) {
			this.dialogVisible = true
			this.operation = false
			this.dataForm = Object.assign({}, params.row)
			let userRoles = []
			for(let i=0,len=params.row.userRoles.length; i<len; i++) {
				userRoles.push(params.row.userRoles[i].roleId)
			}
			this.dataForm.userRoles = userRoles
		},
		// 编辑
		submitForm: function () {
			this.$refs.dataForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.editLoading = true
						let params = Object.assign({}, this.dataForm)
						let userRoles = []
						for(let i=0,len=params.userRoles.length; i<len; i++) {
							let userRole = {
								userId: params.id,
								roleId: params.userRoles[i]
							}
							userRoles.push(userRole)
						}
						params.userRoles = userRoles
						this.$api.user.save(params).then((res) => {
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
		// 获取部门列表
		findDeptTree: function () {
			this.$api.dept.findDeptTree().then((res) => {
				this.deptData = res.data
			})
		},
		// 时间格式化
  dateFormat: function (row, column, cellValue, index){
          	return format(row[column.property])
      	},
		// 处理表格列过滤显示
  handleFilterColumns: function (data) {
			this.filterColumns = data.filterColumns
			this.$refs.tableColumnFilterDialog.setDialogVisible(false)
      	},
		// 处理表格列过滤显示
  initColumns: function () {
			this.columns = [
				{prop:"id", label:"ID", minWidth:70},
				{prop:"name", label:"真实姓名", minWidth:120},
				{prop:"deptName", label:"机构", minWidth:120},
				/*{prop:"roleNames", label:"登录名", minWidth:100},*/
				{prop:"email", label:"邮箱", minWidth:120},
				{prop:"mobile", label:"手机号", minWidth:100},
        /*{prop:"type", label:"用户类型", minWidth:100},*/
				{prop:"status", label:"状态", minWidth:70}
			]
			this.filterColumns = JSON.parse(JSON.stringify(this.columns));
      	},
    //带搜索框的数
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    loadNode(node, resolve) {
      if (node.level === 0) {
        return resolve([{ name: '系统管理' },{ name: '开发管理' }]);
      }
      if (node.level > 3) return resolve([]);

      var hasChild;
      if (node.data.name === '系统管理') {
        hasChild = true;
      } else if (node.data.name === '开发管理') {
        hasChild = true;
      }else {
        hasChild = Math.random() > 0.5;
      }

      setTimeout(() => {
        var data;
        if (hasChild) {
          data = [{
            name: '子系统' + this.count++
          }, {
            name: '子系统' + this.count++
          }];
        } else {
          data = [];
        }

        resolve(data);
      }, 500);
    },

    handleAssignRoles:function () {
      this.dialogRoleJur = true
      this.operation = true
      this.dataForm = Object.assign({}, params.row)
      let userRoles = []
      for(let i=0,len=params.row.userRoles.length; i<len; i++) {
        userRoles.push(params.row.userRoles[i].roleId)
      }
      this.dataForm.userRoles = userRoles
    },
    handleDistributivePrivilege:function(){
      this.dialogRoleJur = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
      let userRoles = []
      for(let i=0,len=params.row.userRoles.length; i<len; i++) {
        userRoles.push(params.row.userRoles[i].roleId)
      }
      this.dataForm.userRoles = userRoles
    }



	},
	mounted() {
		this.findDeptTree()
		this.initColumns()
	},
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
