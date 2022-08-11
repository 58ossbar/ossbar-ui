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
                 lazy :load="load"  row-key="menuId"
                 v-loading="loading" element-loading-text="$t('action.loading')">
        <el-table-column prop="menuId"  header-align="center" align="center"  width="45" label="" type="index">
          <template slot-scope="scope">
            <input type="radio" name="radio" :value="scope.row.menuId"  @click="handleRadioSelect(scope.row)"></input>
            <input style="display:none;" type="text" name="display" :value="scope.row.display"  @click="handleRadioSelect(scope.row)"></input>
          </template>
        </el-table-column>
        <el-table-column  prop="name" class="tree_table_name"  width="150"  label="菜单名称" style="margin-left: 29px;">
        </el-table-column>
        <el-table-column
          prop="parentName" header-align="center" align="center" width="120" label="上级菜单">
        </el-table-column>
        <el-table-column header-align="center" align="center" label="图标">
          <template slot-scope="scope">
            <i :class="scope.row.icon || ''"></i>
          </template>
        </el-table-column>
        <el-table-column prop="type" header-align="center" align="center" label="类型">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
            <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
            <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNum" header-align="center" align="center" label="排序号">
        </el-table-column>
         <el-table-column
           prop="url" header-align="center" align="center" width="150"
           :show-overflow-tooltip="true" label="菜单URL">
         </el-table-column>
         <el-table-column
           prop="perms" header-align="center" align="center" width="150"
           :show-overflow-tooltip="true" label="授权标识">
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
    <el-dialog :title="!dataForm.menuId ? '新增' : '修改'" width="50%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form  :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()"
        label-width="80px" :size="size" style="text-align:left;">
        <el-row :gutter="10">
        <el-col  :span="12">
          <el-form-item label="资源类型" prop="type" >
            <el-radio-group v-model="dataForm.type">
              <el-radio style="margin-right: 15px;" v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col  :span="12">
          <el-form-item :label="menuTypeList[dataForm.type] + '名称'" prop="name" >
            <el-input v-model="dataForm.name" :placeholder="menuTypeList[dataForm.type] + '名称'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
        <el-row >
          <el-col  :span="12">
            <el-form-item label="上级菜单" prop="parentName">
              <!--<el-tree :data="tableTreeDdata" :props="popupTreeProps"
                       :load="loadNodeParentName"
                       lazy>
              </el-tree>-->
              <el-cascader
                style="width: 100%;"
                :options="popupTreeData"
                :props="popupTreeProps"
                :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName"
                filterable
                clearable
                change-on-select>
              </el-cascader>
             <!-- <popup-tree-input
                :data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName"
                :nodeKey="''+dataForm.parentId" :currentChangeHandle="handleTreeSelectChange">
              </popup-tree-input>-->
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="所属机构" prop="orgId" >
              <el-input v-model="dataForm.perms" placeholder=""></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col  :span="12">
            <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
              <el-row>
                <el-col :span="22">
                  <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="false" class="icon-list__input"
                            placeholder="如：fa fa-home fa-lg"></el-input>
               </el-col>
                <el-col :span="2" class="icon-list__tips">
                  <fa-icon-tooltip />
              </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <el-col  :span="12">
            <el-form-item  label="排序编号" prop="orderNum" >
              <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序编号" style="width:100%;">
              </el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url" >
              <el-row>
                <el-col :span="22">
                  <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
                </el-col>
                <el-col :span="2" class="icon-list__tips">
                  <el-tooltip placement="top" effect="light" style="padding: 10px;">
                    <div slot="content">
                      <p>URL格式：</p>
                      <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                      <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                      <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p></div>
                    <i class="el-icon-warning"></i>
                  </el-tooltip>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item  label="授权标识" prop="perms" >
              <el-input v-model="dataForm.perms" placeholder="如: sys:user:add, sys:user:edit, sys:user:delete"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item  label="是否显示" prop="perms" >
              <el-switch  v-model="switch_toggle" on-value="启用" off-value="禁用">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button :size="size"  type="primary" @click="submitForm()">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
    <!--文件上传-->
 <div style="margin-top: 10px;">
    <p>文件上传</p>
   <el-upload
     action="https://jsonplaceholder.typicode.com/posts/"
     list-type="picture-card"
     :on-preview="handlePictureCardPreview"
     :on-remove="handleRemove">
     <i class="el-icon-plus"></i>
   </el-upload>
   <el-dialog :visible.sync="dialogVisibleFile" v-model="dialogVisibleFile" size="tiny">
     <img width="100%" :src="dialogImageUrl" alt="">
   </el-dialog>

  </div>
    <!--文件编辑器-->
    <div style="margin-top: 10px;">
      <p>文件编辑器</p>
      <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
      <el-button class="editor-btn" type="primary" @click="submit">提交</el-button>
    </div>

  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";

import 'quill/dist/quill.core.css';//文件编辑器
import 'quill/dist/quill.snow.css';//文件编辑器
import 'quill/dist/quill.bubble.css';//文件编辑器
import { quillEditor } from 'vue-quill-editor';//文件编辑器

export default {
  components: {
    quillEditor,//文件编辑器
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      switch_toggle:true,
      dialogImageUrl: '',
      dialogVisibleFile: false,
      size: "small",
      loading: false,
      filters: {
        name: ""
      },
      tableTreeDdata: [],
      tableTreeDdataChildren: [],
      dialogVisible: false,
      menuTypeList: ["目录", "菜单", "按钮"],
      dataForm: {
        delFlag:null,
        display:null,
        icon:"",
        menuId:0,
        name: "",
        open:null,
        orderNum: 0,
        orgId: "",
        orgName:"",
        parentId: 0,
        parentName: "",
        perms: "",
        remark:null,
        resourceClass:0,
        sqlMap:{},
        type: 0,
        url: "",
        list:[],
        display:1,
        iconList: []
      },
      dataRule: {
        name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
        url: [{ required: true, message: '菜单路由不能为空', trigger: 'blur' }]
      },
      popupTreeData: [],
      popupTreeProps: {
        value:"parentId",
        label: "name",
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
    onEditorChange({ editor, html, text }) {//文件编辑器
      this.content = html
    },
    submit() {//文件编辑器
      this.$message.success('提交成功！')
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisibleFile = true;
    },

    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        parentId: 0,
        name: "顶级菜单",
        list: tableTreeDdata,
        /*leaf:tableTreeDdata.leaf*/
      };
      return [parent];
    },
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parentId = data.menuId;
      this.dataForm.parentName = data.name;
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    loadNodeParentName(node, resolve){
      this.$api.menu.findMenuTreeByMenuId().then(res => {
        this.tableTreeDdataChildren= res.data;
      });
      resolve(this.tableTreeDdataChildren);
    },
    //加载子菜单
    load(tree, treeNode, resolve) {
      this.$api.menu.findMenuTreeByMenuId().then(res => {
       this.tableTreeDdataChildren= res.data;
      });
      resolve(this.tableTreeDdataChildren);
    },
    // 获取数据
    findTreeData: function() {
      this.loading = true;
      this.$api.menu.findMenuTree().then(res => {
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
        delFlag:null,
        display:null,
        icon:"",
        menuId:0,
        name: "",
        open:null,
        orderNum: 0,
        orgId: "",
        orgName:"",
        parentId: 0,
        parentName: "",
        perms: "",
        remark:null,
        resourceClass:0,
        sqlMap:{},
        type: 1,
        url: "",
        list:[],
        display:1,
        iconList: [],
        typeList: ["目录", "菜单", "按钮"]
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
      if(row.display.equals("1")){
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
      ids.push({ menuId: row.menuId });
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
