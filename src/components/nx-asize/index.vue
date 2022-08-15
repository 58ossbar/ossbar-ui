<template >
  <el-dropdown trigger="click" class="international" @command="handleSetAsize">
    <div>
      <i class="fa fa-font"/>
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item command="1">默认</el-dropdown-item>
      <el-dropdown-item command="2">小</el-dropdown-item>
      <el-dropdown-item command="3">中</el-dropdown-item>
      <el-dropdown-item command="4">大</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'NxAsize',
  methods: {
    handleSetAsize(size) {
      if (size == '1') {
        $('#asizeStyle').attr('href', '../../../static/xixi/Asize/Asize0.css')
        localStorage.setItem('asizeStyle', '../../../static/xixi/Asize/Asize0.css')
      } else if (size == '2') {
        $('#asizeStyle').attr('href', '../../../static/xixi/Asize/Asize1.css')
        localStorage.setItem('asizeStyle', '../../../static/xixi/Asize/Asize1.css')
      } else if (size == '3') {
        $('#asizeStyle').attr('href', '../../../static/xixi/Asize/Asize2.css')
        localStorage.setItem('asizeStyle', '../../../static/xixi/Asize/Asize2.css')
      } else if (size == '4') {
        $('#asizeStyle').attr('href', '../../../static/xixi/Asize/Asize3.css')
        localStorage.setItem('asizeStyle', '../../../static/xixi/Asize/Asize3.css')
      }
    }
  }
}
</script>

<style scoped>
</style>
