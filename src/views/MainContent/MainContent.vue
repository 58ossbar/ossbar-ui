<template>
  <div
    id="main-container"
    :class="$store.state.app.collapse?'position-collapse-left':'position-left'"
    class="main-container active_tab">
    <!-- 标签页 -->
    <div class="tab-container active_tab ">
      <el-tabs
        :class="$store.state.app.collapse?'position-collapse-left ':'position-left '"
        v-model="mainTabsActiveName"
        :closable="true"
        class="tabs"
        type="card"
        @tab-click="selectedTabHandle"
        @tab-remove="removeTabHandle">
        <el-dropdown :show-timeout="0" class="tabs-tools" trigger="click" style="height: 35px">
          <div style="font-size:20px;width:50px;" > <i class="el-icon-arrow-down"/></div>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前标签</el-dropdown-item>
            <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签</el-dropdown-item>
            <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签</el-dropdown-item>
            <el-dropdown-item @click.native="tabsRefreshCurrentHandle">刷新当前标签</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tab-pane
          v-for="item in mainTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name">
          <span slot="label" ><i :class="item.icon"/> {{ item.title }} </span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 主内容区域 -->
    <div class="main-content active_tab" >
      <keep-alive>
        <transition name="fade" mode="out-in">
          <router-view/>
        </transition>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    mainTabs: {
      get() { return this.$store.state.tab.mainTabs },
      set(val) { this.$store.commit('updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get() { return this.$store.state.tab.mainTabsActiveName },
      set(val) { this.$store.commit('updateMainTabsActiveName', val) }
    }
  },
  methods: {
    // tabs, 选中tab
    selectedTabHandle(tab) {
      tab = this.mainTabs.filter(item => item.name === tab.name)
      if (tab.length >= 1) {
        this.$router.push({ name: tab[0].name })
      }
    },
    // tabs, 删除tab
    removeTabHandle(tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          this.$router.push({ name: this.mainTabs[this.mainTabs.length - 1].name }, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.$router.push('/')
      }
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle() {
      this.removeTabHandle(this.mainTabsActiveName)
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle() {
      this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
    },
    // tabs, 关闭全部
    tabsCloseAllHandle() {
      this.mainTabs = []
      this.$router.push('/')
    },
    // tabs, 刷新当前
    tabsRefreshCurrentHandle() {
      var tempTabName = this.mainTabsActiveName
      this.removeTabHandle(tempTabName)
      this.$nextTick(() => {
        this.$router.push({ name: tempTabName })
      })
    }
  }
}
</script>

<style scoped lang="scss">

  .active_tab{
    background-color: #f3f3f4;
  }
.main-container {
  padding: 0 5px 5px;
  position: absolute;
  top: 60px;
  left: 1px;
  right: 1px;
  bottom: 0px;
  // background: rgba(56, 5, 114, 0.5);
  .tabs {
    position: fixed;
    top: 55px;
    right: 50px;
    padding-left: 0px;
    padding-right: 2px;
    z-index: 1020;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    background: rgb(255, 253, 255);
    border-color: rgba(200, 206, 206, 0.5);
    // border-left-width: 1px;
    // border-left-style: solid;
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
 .tabs-tools {
    position: fixed;
    top: 60px;
    right: 0;
    z-index: 1020;
    height: 40px;
    // padding: 0 10px;
    font-size: 14px;
    line-height: 40px;
    cursor: pointer;
    border-color: rgba(200, 206, 206, 0.5);
    border-left-width: 1px;
    border-left-style: solid;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    background: rgba(255, 255, 255, 1);
  }
  .tabs-tools:hover {
    background: rgba(200, 206, 206, 1);
  }
  .main-content {
    position: absolute;
    top: 45px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    padding: 5px;
    overflow-y: auto;
    // background: rgba(209, 212, 212, 0.5);
  }
}
.position-left {
  left: 200px;
}
.position-collapse-left {
  left: 65px;
}

</style>
