<template>
  <div>
    <i class="fa fa-plus fa-lg" perms="sys:menu:subsystem" @click="getSubSystem" />
    <el-dialog v-dialogDrag :visible.sync="dialogFormVisible" :modal-append-to-body="false" title="子系统">
      <div style="height: 200px;">

        <el-checkbox-group v-model="checkedAllSet" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="(type, index) in allset" :label="index" :key="index" style="width:20%;margin: 5px;float: left">
            <i :class="type.icon">&nbsp;&nbsp;</i><br>{{ type.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click="dialogFormVisible = false">取 消</el-button>
        <el-button :size="size" type="primary" @click="saveAllSet">确 定</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import CbButton from '@/views/Core/CbButton'
export default {
  name: 'Index',
  components: {
    CbButton
  },
  data: function() {
    return {
      allset: [],
      checkedAllSet: [],
      checkedSet: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      size: 'small'
    }
  },
  mounted() {

  },
  methods: {
    // 所属子系统
    getSubSystem: function() {
      this.dialogFormVisible = true
      this.$api.user.changesubSystem().then((res) => {
        this.allset = []
        for (let i = 0; i < res.data.length; i++) {
          const obj = {}
          obj.icon = res.data[i].icon
          obj.name = res.data[i].name
          obj.url = res.data[i].url
          this.allset.push(obj)
        }
      })
    },
    handleCheckedCitiesChange(value) {
      this.checkedSet = []
      for (let i = 0; i < value.length; i++) {
        const obj = {}
        obj.icon = this.allset[value[i]].icon
        obj.name = this.allset[value[i]].name
        obj.url = this.allset[value[i]].url
        this.checkedSet.push(obj)
      }
    },
    // 保存子系统选项
    saveAllSet: function(data) {
      this.$confirm('确认提交吗？', '提示', {}).then((res) => {
        this.dialogFormVisible = false
        this.$emit('changeAllSet', this.checkedSet)
      }).catch(() => { this.dialogFormVisible = false })
    }
  }
}
</script>

<style scoped>

</style>
