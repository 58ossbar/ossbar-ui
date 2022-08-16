<template>
  <el-dropdown trigger="click" class="international">
    <div>
      <i class="fa fa-free-code-camp" @click="dialogFormVisible = true"/>
    </div>
    <el-dialog v-dialogDrag ref="dialog__wrapper" :visible.sync="dialogFormVisible" :modal-append-to-body="false" title="设置">
      <!--     <div>
       <i class="fa fa-free-code-camp" style="position:absolute;right: 50px;top: 24px;"></i>
     </div>-->
      <el-form :model="form">
        <div>
          <span>字体大小：</span>
          <el-cascader :options="Asize" v-model="form.Asize"/>
          <span style="margin-left: 30px">主题风格：</span>
          <el-cascader :options="Skin" v-model="form.Skin"/>
        </div>
        <div>
          <span style="margin-left: -14%">语种类型：</span>
          <el-radio-group v-model="dataForm.zhch">
            <el-radio v-for="(type, index) in zhch" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
          <span style="margin-left: 14%">是否全屏：</span>
          <el-radio-group v-model="dataForm.full">
            <el-radio v-for="(type, index) in full" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </div>
        <div>
          <span style="margin-left: -7%">控件设置(最多选三个)：</span>
          <el-checkbox v-for="(type, index) in allset" :label="index" :key="index" :name="index" @click="countChoices(this)">{{ type }}</el-checkbox>
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
  name: 'Index',
  data: function() {
    return {
      Asize: [
        {
          value: 'default',
          label: '默认'
        }, {
          value: 'small',
          label: '小'
        }, {
          value: 'center',
          label: '中'
        }, {
          value: 'big',
          label: '大'
        }
      ],
      Skin: [
        {
          value: 'default',
          label: '默认'
        }, {
          value: 'green',
          label: '典雅绿'
        }, {
          value: 'red',
          label: '樱桃红'
        }, {
          value: 'purple',
          label: '贵族紫'
        }, {
          value: 'blue',
          label: '天空蓝'
        }
      ],
      dataForm: {
        id: 0,
        zhch: 1,
        full: 0,
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      },
      zhch: ['中文', 'English'],
      full: ['Yes', 'No'],
      allset: ['字体大小', '界面皮肤', '中英文互译', '是否全屏'],
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: true,
        type: ['中文'],
        resource: '中文',
        desc: '',
        options: []
      },
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px'
    }
  },
  methods: {
    countChoices(obj) {
      alert('123')
    }
  }
}
</script>

<style scoped>

</style>
