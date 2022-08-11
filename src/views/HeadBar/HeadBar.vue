<template>
  <div class="headbar" :style="{'background':themeColor}"
    :class="$store.state.app.collapse?'position-collapse-left':'position-left'">
    <!-- 导航收缩 -->
    <span class="hamburg">
      <el-menu class="el-menu-demo" :background-color="themeColor" text-color="#fff" :active-text-color="themeColor" mode="horizontal">
        <el-menu-item index="1" @click="onCollapse"><hamburger :isActive="collapse"></hamburger></el-menu-item>
      </el-menu>
    </span>
    <!-- 导航菜单 -->
    <span class="navbar">
      <el-menu :default-active="activeIndex" class="el-menu-demo"
               :background-color="themeColor" text-color="#fff" active-text-color="#ffd04b" mode="horizontal" @select="selectNavBar()">
       <!-- <el-menu-item index="1" @click="$router.push('/')"><i class="fa fa-home fa-lg"></i>  </el-menu-item>-->
        <el-menu-item index="1" @click="$router.push('/')">
          <div style="height: 40%;margin-top: -10px">
            <i class="fa fa-wpexplorer fa-lg"></i>
          </div>
          <div style="height: 30%;font-size: 12px">实训资源库</div>
        </el-menu-item>
        <el-menu-item index="3">
          <div style="height: 40%;margin-top: -10px">
             <i class="fa fa-free-code-camp fa-lg"></i>
          </div>
          <div style="height: 30%;font-size: 12px">实训核心系统</div>
        </el-menu-item>
        <el-menu-item index="4">
          <div style="height: 40%;margin-top: -10px">
            <i class="fa fa-shower fa-lg"></i>
          </div>
          <div style="height: 30%;font-size: 12px">智能客服系统</div>
        </el-menu-item>
        <el-menu-item index="5">
          <div style="height: 40%;margin-top: -10px">
             <i class="fa fa-ravelry fa-lg"></i>
          </div>
          <div style="height: 30%;font-size: 12px">智能分析与评价</div>
        </el-menu-item>
        <el-menu-item index="8">
          <nx-subsystemset></nx-subsystemset>
        </el-menu-item>
      </el-menu>
    </span>
    <!-- 工具栏 -->
    <span class="toolbar">
      <el-menu class="el-menu-demo" :background-color="themeColor" :text-color="themeColor" :active-text-color="themeColor" mode="horizontal">
        <el-menu-item index="1">
          <!-- 主题切换 -->
          <theme-picker class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
        </el-menu-item>
        <el-menu-item index="2" v-popover:popover-lang>
          <!-- 语言切换 -->
          <li style="color:#fff;" class="fa fa-language fa-lg"></li>
          <el-popover ref="popover-lang" placement="bottom-start" trigger="click" v-model="langVisible">
            <div class="lang-item" @click="changeLanguage('zh_cn')">简体中文</div>
            <div class="lang-item" @click="changeLanguage('en_us')">English</div>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="3" v-popover:popover-message>
            <nx-asize></nx-asize>
        </el-menu-item>
        <el-menu-item index="4" v-popover:popover-message>
        <nx-full-screen></nx-full-screen>
        </el-menu-item>
        <el-menu-item index="5" v-popover:popover-message>
            <nx-controlset></nx-controlset>
        </el-menu-item>
        <el-menu-item index="6" v-popover:popover-personal>
          <!-- 用户信息 -->
          <span class="user-info"><img :src="user.avatar" />{{user.name}}</span>
          <el-popover ref="popover-personal" placement="bottom-end" trigger="click" :visible-arrow="false">
            <personal-panel :user="user"></personal-panel>
          </el-popover>
        </el-menu-item>
      </el-menu>
    </span>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Hamburger from "@/components/Hamburger"
import ThemePicker from "@/components/ThemePicker"
import LangSelector from "@/components/LangSelector"
import nxAsize from '@/components/nx-asize/index'
import nxFullScreen from '@/components/nx-full-screen/index'
import nxControlset from '@/components/nx-controlset/index'
import nxSubsystemset from '@/components/nx-subsystemset/index'
import NoticePanel from "@/views/Core/NoticePanel"
import MessagePanel from "@/views/Core/MessagePanel"
import PersonalPanel from "@/views/Core/PersonalPanel"
export default {
  components:{
        Hamburger,
        ThemePicker,
        LangSelector,
        nxAsize,
        nxFullScreen,
        nxSubsystemset,
        nxControlset,
        NoticePanel,
        MessagePanel,
        PersonalPanel
  },
  data() {
    return {
      user: {
        name: "Louis",
        avatar: "",
        role: "超级管理员",
        registeInfo: "注册时间：2018-12-20 "
      },
      activeIndex: '1',
      langVisible: false
    }
  },
  methods: {
    openWindow(url) {
      window.open(url)
    },
    selectNavBar(key, keyPath) {
      console.log(key, keyPath)
    },
    // 折叠导航栏
    onCollapse: function() {
      this.$store.commit('onCollapse')
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    },
    // 语言切换
    changeLanguage(lang) {
      lang === '' ? 'zh_cn' : lang
      this.$i18n.locale = lang
      this.langVisible = false
    }
  },
  mounted() {
    this.sysName = "Kitty Platform"
    var user = sessionStorage.getItem("user")
    if (user) {
      this.user.name = user
      this.user.avatar = require("@/assets/user.png")
    }
  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor,
      collapse: state=>state.app.collapse
    })
  }
}
</script>

<style scoped lang="scss">
.headbar {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 1030;
  height: 60px;
  line-height: 60px;
  border-color: rgba(180, 190, 190, 0.8);
  border-left-width: 1px;
  border-left-style: solid;
}
.hamburg, .navbar {
  float: left;
}
.toolbar {
  float: right;

}
.lang-item {
  font-size: 16px;
  padding-left: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: pointer;
}
.lang-item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
}
.user-info {
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  img {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin: 10px 0px 10px 10px;
    float: right;
  }
}
.badge {
  line-height: 18px;
}
.position-left {
  left: 200px;
}
.position-collapse-left {
  left: 65px;
}
</style>
