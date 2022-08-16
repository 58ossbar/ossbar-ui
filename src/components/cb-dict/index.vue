<template>
  <div style="text-align: left;">

    <el-radio-group v-if="type == 'radio'" v-model="modelData" class="cb-dict">
      <el-radio v-if="emptyLabel || emptyLabel == ''" key="" label="">{{ emptyLabel }}</el-radio>
      <el-radio v-for="data in dicts" :label="data.dictCode" :key="data.dictCode">{{ data.dictValue }}</el-radio>
    </el-radio-group>

    <el-select v-if="type == 'select'" v-model="modelData" :placeholder="placeholder" :clearable="clearable" :disabled="disabled" style="width: 100%" class="cb-dict">
      <el-option v-if="emptyLabel || emptyLabel == ''" key="" :label="emptyLabel" value=""/>
      <el-option
        v-for="data in dicts"
        :key="data.dictCode"
        :label="data.dictValue"
        :value="data.dictCode"/>
    </el-select>

    <el-switch v-if="type == 'switch'" v-model="modelData" class="cb-dict"/>
  </div>
</template>
<!--
  示例：
      作为查询条件时的使用情况
      <cb-dict
        :parent-vue="_self"
        :change="findPage"
        :filters="filters"
        placeholder="请选择"
        name="对应你的javabean字段"
        dict="对应字典表里的dict_type字段"
        type="select"
        empty-label="全部"
      />
      作为新增修改时的使用情况

      注意
      parentVue：[Object]，传固定值this._self，不能改变，表单校验时会用到，必传固定参数
      name：[String]，属性与JavaBean字段一致，必传
      type：[String]，显示类型：select下拉框，radio单选框,switch开关，必传
      dict：[String]，字典分类编码，必传
      change：[Function]，选值改变时的回调函数，可选参数
      dataForm：[Object]，固定写法，不要改变，新增修改界面中必传
      filters：[Object]，固定写法，不要改变，查询界面中必传
      emptyLabel：[String]，只在type为select时生效，功能为额外增加一个空的的下拉选项，值为显示的label，方便查询时，可以查询全部，可选参数
      placeholder：[String]，提示语，可选参数
  默认支持新增、修改及表单校验，不需要额外做处理
 -->
<script>
import axios from '@/http/axios'

export default {
  name: 'CbDict', // 继承父组件中的id，name属性，拓展功能请在此配置
  components: {
  },
  props: ['placeholder', 'name', 'dataForm', 'filters', 'type', 'dict', 'emptyLabel', 'change', 'parentVue', 'disabled', 'clearable'],
  data() {
    return {
      dicts: [],
      modelData: this.type === 'switch' ? 'false' : ''
    }
  },
  watch: {
    modelData: function(n, o) {
      const temp = this.type === 'switch' ? (n ? 'Y' : 'N') : n
      if (this.filters) {
        this.filters[this.name] = temp
      }
      if (this.dataForm) {
        this.dataForm[this.name] = temp
        // 如果传递了父vue，则重新将表单进行一次校验
        if (this.parentVue) {
          // 当页面存在多个表单时，需要遍历找到各自对应的表单进行校验重置
          for (const ref in this.parentVue.$refs) {
            if (this.parentVue.$refs[ref].model == this.dataForm) {
              this.parentVue.$refs[ref].validateField(this.name)
            }
          }
        }
      }
      if (this.change) {
        this.change()
      }
    },
    dataForm: function(n, o) {
      if (this.type === 'switch') {
        this.modelData = n[this.name] === 'Y'
      } else {
        this.modelData = n[this.name]
      }
    },
    filters: function(n, o) {
      if (this.type === 'switch') {
        this.modelData = n[this.name] === 'Y'
      } else {
        this.modelData = n[this.name]
      }
    }
  },
  mounted() {
    this.getDict()
    if (this.dataForm) {
      this.modelData = this.type === 'switch' ? this.dataForm[this.name] === 'Y' : this.dataForm[this.name]
    }
  },
  methods: {
    getDict: function() {
      const queryData = {}
      queryData.sidx = 'SORT_NUM'
      queryData.order = 'asc'
      queryData.dictType = this.dict
      axios({
        url: '/api/sys/dict/cbdict',
        method: 'get',
        params: queryData
      }).then(res => {
        this.dicts = res.data
        this.$emit('findData', this.dicts)
      })
    }
  }
}
</script>

<style scoped>

</style>
