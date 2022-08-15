<template>
  <el-button
    v-if="hasPerms(perms)"
    :size="size"
    :type="type"
    :icon="icon"
    :loading="loading"
    @click.stop="stopClick"> <!-- @click="handleClick"  :disabled="!hasPerms(perms)"-->
    {{ label }}
  </el-button>
</template>
<!--:disabled="!hasPerms(perms)"-->
<script>
import { hasPermission } from '@/permission/index.js'
export default {
  name: 'CbButton',
  props: {
    label: { // 按钮显示文本
      type: String,
      default: '' /* Button*/
    },
    icon: { // 按钮显示图标
      type: String,
      default: ''
    },
    size: { // 按钮尺寸
      type: String,
      default: 'mini'
    },
    type: { // 按钮类型
      type: String,
      default: null
    },
    loading: { // 按钮加载标识
      type: Boolean,
      default: false
    },
    disabled: { // 按钮是否禁用
      type: Boolean,
      default: false
    },
    perms: { // 按钮权限标识，外部使用者传入
      type: String,
      default: null
    }
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
    handleClick: function() {
      // 按钮操作处理函数
      this.$emit('click', {})
    },
    stopClick: function(event) {
      // 按钮操作处理函数
      this.$emit('click', event)
    },
    hasPerms: function(perms) {
      // 根据权限标识和外部指示状态进行权限判断
      return hasPermission(perms) & !this.disabled
    }
  }
}
</script>

<style scoped>

</style>
