<template>
  <el-submenu v-if="menu.list && menu.list.length>= 1" :index="'' + menu.menuId">
    <template slot="title" >
      <i :class="menu.icon" />
      <span slot="title" >{{ menu.name }}</span>
    </template>
    <MenuTree v-for="item in menu.list" :key="item.menuId" :menu="item" />
  </el-submenu>
  <el-menu-item v-else :index="'' + menu.menuId" @click="handleRoute(menu)">
    <i :class="menu.icon"/>
    <span slot="title">{{ menu.name }}</span>
  </el-menu-item>
</template>

<script>
import { getIFramePath } from '@/utils/iframe'
export default {
  name: 'MenuTree',
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleRoute(menu) {
      // 如果是嵌套页面，转换成iframe的path
      let path = getIFramePath(menu.url)
      if (!path) {
        path = menu.url
      }
      // 通过菜单URL跳转至指定路由
      this.$router.push('/' + path)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
