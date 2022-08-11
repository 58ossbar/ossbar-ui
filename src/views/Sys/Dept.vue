<template >
  <div class="page-container" style="width: 95%;">
    <!--工具查询栏-->
    <div class="toolbar box_shadows bgcolor" style="float:left;width: 100%;margin-bottom: 10px;padding: 10px">
      <el-form style="height: 32px;" :inline="true" :model="filters" :size="size">
        <el-form-item>
          <el-input v-model="filters.name" placeholder="名称"></el-input>
        </el-form-item>
        <el-form-item>
          <kt-button icon="fa fa-search" :label="$t('action.search')"
                     perms="sys:menu:view" type="primary" @click="findTreeData(null)"/>
        </el-form-item>
      </el-form>
    </div>
    <!--表格-->
    <div class="box_shadows bgcolor" style="float: left;width: 100%;padding: 10px;padding-bottom: 40px;">
      <!--表格操作栏-->
      <div style="width: 100%;border-bottom: 1px dotted #ebeef5;padding-bottom: 16px;">
        <el-form style="text-align: left;height: 28px;" :inline="true" :model="filters" :size="size">
          <el-form-item> <!--新增-->
            <kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:menu:add" type="primary" @click="handleAdd"/>
          </el-form-item>
          <el-form-item> <!--编辑-->
            <kt-button  icon="fa fa-edit" :label="$t('action.edit')" type="primary"
                        perms="sys:menu:edit" @click="handleEdit(null)"
                        :disabled="this.selections.select.length===0"/>
          </el-form-item>
          <el-form-item>
            <kt-button icon="fa fa-trash-o" :label="$t('action.delete')" perms="sys:menu:delete"
                       type="danger"   @click="handleDelete(null)"
                       :disabled="this.selections.select.length===0"/>
          </el-form-item>
        </el-form>
      </div>
      <!--表格树内容栏-->
      <el-table  :data="tableTreeDdata" stripe size="mini" style="width: 100%;"
                 lazy :load="load"  row-key="orgId"
                 v-loading="loading" element-loading-text="$t('action.loading')">
        <el-table-column prop="orgId"  header-align="center" align="center"  width="45" label="" type="index">
          <template slot-scope="scope">
            <input type="radio" name="radio" :value="scope.row.orgId"  @click="handleRadioSelect(scope.row)"></input>
            <input style="display:none;" type="text" name="display" :value="scope.row.state"  @click="handleRadioSelect(scope.row)"></input>
          </template>
        </el-table-column>
        <el-table-column  prop="orgName" class="tree_table_name"  width="150"  label="机构名称" style="margin-left: 29px;">
        </el-table-column>
        <el-table-column
          prop="parentName" header-align="center" align="center" width="120" label="父机构">
        </el-table-column>
        <el-table-column  prop="orgShowName" header-align="center" align="center"  label="机构显示名称">
        </el-table-column>
        <el-table-column prop="orgType" header-align="center" align="center" label="机构类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 1" size="small" type="success">公司</el-tag>
            <el-tag v-else-if="scope.row.type === 2" size="small" type="info">部门</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="orgSN" header-align="center" align="center" label="排序号">
        </el-table-column>
        <el-table-column
          prop="orgXZQM" header-align="center" align="center" width="150"
          :show-overflow-tooltip="true" label="行政区码">
        </el-table-column>
        <el-table-column
          fixed="right" header-align="center" align="center" width="185" :label="$t('action.operation')">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <kt-button class="no_kt_button_style" icon="fa fa-edit" :label="$t('action.edit')"
                         perms="sys:menu:edit" @click="handleEdit(scope.row)"/>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <kt-button class="no_kt_button_style" icon="fa fa-trash-o" :label="$t('action.delete')"
                         perms="sys:menu:delete" @click="handleDelete(scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 新增修改界面 -->
    <el-dialog :title="!dataForm.orgId ? '新增' : '修改'" width="70%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()"
                label-width="80px" :size="size" style="text-align:left;">
        <el-row>
          <el-col  :span="24">
            <el-form-item label="机构名称" prop="orgName" >
              <el-input v-model="dataForm.orgName" :placeholder="机构名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col  :span="12">
            <el-form-item label="机构显示名称" prop="orgShowName" >
              <el-input v-model="dataForm.orgShowName" :placeholder="机构名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="行政区码" prop="orgXZQM" >
              <el-input v-model="dataForm.orgXZQM" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">

          <el-col  :span="12">
            <el-form-item label="父机构" prop="parentName">
              <el-cascader
                style="width: 100%;"
                :options="popupTreeData"
                :props="popupTreeProps"
                :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级机构':dataForm.parentName"
                filterable
                clearable
                change-on-select>
              </el-cascader>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item label="机构类型" prop="orgType" >
              <el-radio-group v-model="dataForm.orgType">
                <el-radio style="margin-right: 15px;" v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col  :span="12">
            <el-form-item  label="通讯地址" prop="addr" >
              <el-input v-model="dataForm.addr" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="邮政编码" prop="zip" >
              <el-input v-model="dataForm.zip" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col  :span="12">
              <el-form-item  label="机构负责人" prop="leader" >
                <el-input v-model="dataForm.leader" placeholder=""></el-input>
              </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="负责人手机号码" prop="mobile" >
              <el-input v-model="dataForm.mobile" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col  :span="12">
            <el-form-item  label="办公电话" prop="phone" >
              <el-input v-model="dataForm.phone" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="电子邮箱" prop="email" >
              <el-input v-model="dataForm.email" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col  :span="12">
            <el-form-item  label="简拼" prop="JP" >
              <el-input v-model="dataForm.JP" placeholder=""></el-input>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="全拼" prop="QP" >
              <el-input v-model="dataForm.QP" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col  :span="12">
            <el-form-item  label="排序编号" prop="orgSN" >
              <el-input-number v-model="dataForm.orgSN" controls-position="right" :min="0" label="排序编号" style="width:100%;">
              </el-input-number>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="状态" prop="state" >
              <el-input v-model="dataForm.state" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import KtButton from "@/views/Core/KtButton";
  import TableTreeColumn from "@/views/Core/TableTreeColumn";
  import PopupTreeInput from "@/components/PopupTreeInput";
  import FaIconTooltip from "@/components/FaIconTooltip";

  export default {
    components: {
      PopupTreeInput,
      KtButton,
      TableTreeColumn,
      FaIconTooltip
    },
    data() {
      return {
        switch_toggle:true,
        size: "small",
        loading: false,
        filters: {
          name: ""
        },
        tableTreeDdata: [],
        tableTreeDdataChildren: [],
        dialogVisible: false,
        menuTypeList: [ "公司", "部门"],
        dataForm: {
          orgId:0,//机构ID
          orgSN:0,//	机构排序ID
          orgName:"",//机构名称
          orgCode:"",//机构编号
          orgXZQM:"",//行政区码
          orgShowName:"",//机构显示名称
          parentId:0,//父机构ID
          parentName:"",//父机构名称
          layer:1,//层（阶次）
          remark:"",//单位简介
          orgType:1,//机构类型:1、部门 2、公司
          addr:"",//通讯地址
          zip:"",//邮政编码
          email:"",//电子邮箱
          leader:"",//机构负责人
          phone:"",//办公电话
          fax:"",//传真号码
          state:1,//	状态:1有效 2、停用
          mobile:"",//负责人手机号码
          JP:"",//简拼
          QP:"",//全拼
          ancestry:"",//排序
          coverPic:"",//封面图
          description:"",//机构描述
          collegeCode:"",//学院代码
          majorCode:"",//专业代码
        },
        dataRule: {
          orgName: [{ required: true, message: "机构名称不能为空", trigger: "blur" }],
          orgXZQM: [{ required: true, message: '行政区码不能为空', trigger: 'blur' }],
          JP: [{ required: true, message: "简拼不能为空", trigger: "blur" }],
          QP: [{ required: true, message: '全拼不能为空', trigger: 'blur' }]
        },
        popupTreeData: [],
        popupTreeProps: {
          value:"parentId",
          label: "orgName",
          children: "list",
          /*isLeaf: 'leaf'*/
        },
        selections:{ // 列表选中列
          select:[],
          dataForm:{},
        }
      };
    },
    methods: {
      // 获取上级菜单树
      getParentMenuTree: function(tableTreeDdata) {
        let parent = {
          parentId: 0,
          orgName: "顶级菜单",
          list: tableTreeDdata,
          /*leaf:tableTreeDdata.leaf*/
        };
        return [parent];
      },
      // 菜单树选中
      handleTreeSelectChange(data, node) {
        this.dataForm.parentId = data.orgId;
        this.dataForm.parentName = data.orgName;
      },
      loadNodeParentName(node, resolve){
        this.$api.dept.findDeptChildrenTree().then(res => {
          this.tableTreeDdataChildren= res.data;
        });
        resolve(this.tableTreeDdataChildren);
      },
      //加载子菜单
      load(tree, treeNode, resolve) {
        this.$api.dept.findDeptChildrenTree().then(res => {
          this.tableTreeDdataChildren= res.data;
        });
        resolve(this.tableTreeDdataChildren);
      },
      // 获取数据
      findTreeData: function() {
        this.loading = true;
        this.$api.dept.findDeptTree().then(res => {
          this.tableTreeDdata = res.data;
          this.popupTreeData = this.getParentMenuTree(res.data);
          this.loading = false;
        });
      },
      // 显示新增界面
      handleAdd: function() {
        this.dialogVisible = true;
        this.switch_toggle=true;
        this.dataForm = {
          orgId:0,//机构ID
          orgSN:0,//	机构排序ID
          orgName:"",//机构名称
          orgCode:"",//机构编号
          orgXZQM:"",//行政区码
          orgShowName:"",//机构显示名称
          parentId:0,//父机构ID
          parentName:"",//父机构名称
          layer:1,//层（阶次）
          remark:"",//单位简介
          orgType:1,//机构类型:1、部门 2、公司
          addr:"",//通讯地址
          zip:"",//邮政编码
          email:"",//电子邮箱
          leader:"",//机构负责人
          phone:"",//办公电话
          fax:"",//传真号码
          state:1,//	状态:1有效 2、停用
          mobile:"",//负责人手机号码
          JP:"",//简拼
          QP:"",//全拼
          ancestry:"",//排序
          coverPic:"",//封面图
          description:"",//机构描述
          collegeCode:"",//学院代码
          majorCode:"",//专业代码
          typeList: ["公司", "部门"]
        };
      },
      // 显示编辑界面
      handleEdit: function(row) {
        this.dialogVisible = true;
        this.switch_toggle=false;
        if(row==null){
          if(this.selections.select.length==0){
            this.$confirm("请先选择一条记录", "提示", {
              type: "warning"
            });
            return;
          }else{
            row={};
            Object.assign( row,this.selections.dataForm);
          }
        }
        console.log(row.display);
        Object.assign(this.dataForm, row);
        if(row.state.equals("1")){
          this.switch_toggle=true;
        }else{
          this.switch_toggle=false;
        }
        console.log( this.switch_toggle);
      },
      //被选中的列
      handleRadioSelect(row) {
        this.selections.select=[];
        this.selections.select.push(row.menuId);
        this.selections.dataForm={};
        Object.assign(this.selections.dataForm, row);
      },
      // 删除
      handleDelete(row) {
        if(row==null){
          if(this.selections.select.length==0){
            this.$confirm("请先选择一条记录", "提示", {
              type: "warning"
            });
            return;
          }else{
            row={};
            Object.assign( row,this.selections.dataForm);
          }
        }
        console.log(row);
        this.$confirm("确认删除选中记录吗？", "提示", {
          type: "warning"
        }).then(() => {
          let params = this.getDeleteIds([], row);
          this.$api.menu.batchDelete(params).then(res => {
            this.findTreeData();
            this.$message({ message: "删除成功", type: "success" });
          });

        });
      },
      // 获取删除的包含子菜单的id列表
      getDeleteIds(ids, row) {
        ids.push({ orgId: row.orgId });
        if (row.list != null) {
          for (let i = 0, len = row.list.length; i < len; i++) {
            this.getDeleteIds(ids, row.list[i]);
          }
        }
        return ids;
      },
      // 表单提交
      submitForm() {
        this.$refs["dataForm"].validate(valid => {
          if (valid) {
            console.log( this.dataForm);
            this.$confirm("确认提交吗？", "提示", {}).then(() => {
              this.editLoading = true;
              let params = Object.assign({}, this.dataForm);
              this.$api.menu.save(params).then(res => {
                this.editLoading = false;
                if (res.code == 200) {
                  this.$message({ message: "操作成功", type: "success" });
                  this.$refs["dataForm"].resetFields();
                  this.dialogVisible = false;
                } else {
                  this.$message({
                    message: "操作失败, " + res.msg,
                    type: "error"
                  });
                }
                this.findTreeData();
              });
            });
          }
        });
      }
    },
    mounted() {//页面初始化
      this.findTreeData();
    }
  };
</script>

<style scoped>
  .box_shadows{
    box-shadow: 0px 0px 5px rgba(0,0,0,.2);
    border-radius: 6px;
  }
  .no_kt_button_style{
    width: 12px;
    /* padding: 5px 12px 5px 5px;*/
    padding: 0px;
    overflow: hidden;
    border: none;
    height: 12px;
    margin-left: 0px;
  }
  .tree_table_name .cell{
    margin-left: 29px;
  }
  .bgcolor{
    background-color: #fff;
  }
  .margin_right_no{
    margin-right: 0px;
  }
</style>
