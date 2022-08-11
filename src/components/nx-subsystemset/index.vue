<template>
  <el-dropdown trigger="click" class='international'>
    <div>
      <i class="fa fa-snowflake-o fa-lg" @click="dialogFormVisible = true"></i>
    </div>
    <el-dialog title="子系统" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
      <el-form :model="dataForm">
        <div style="white-space:normal;">

          <el-checkbox v-for="(type, index) in allset"   style="width:28%;"  :label="index" :key="index">
            <i class="fa fa-wpexplorer fa-lg">&nbsp;&nbsp;</i>{{ type }}
          </el-checkbox>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-dropdown>

</template>

<script>
  export default {
    name: "index",
    data: function() {
      return {
        dataForm: {
          id: 0,
          type: 1,
          name: "",
          parentId: 0,
          parentName: "",
          url: "",
          perms: "",
          orderNum: 0,
          icon: "",
          iconList: []
        },
        allset:["业务核心系统","实训资源库","软件实训系统","智能客服系统","智能分析","评价系统"],
        dialogTableVisible: false,
        dialogFormVisible: false,
        formLabelWidth: '120px'
      }
    },
    methods:{

    }
  }
</script>

<style scoped>

</style>
