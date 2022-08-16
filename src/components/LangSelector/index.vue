<template>
  <div v-popover:popover :style="istyle" class="lang-selector">
    <li :style="iconStyle" :class="icon"/>
    <el-popover ref="popover" :trigger="trigger" v-model="visible" placement="bottom-start">
      <div class="item" @click="changeLanguage('zh_cn')">简体中文</div>
      <div class="item" @click="changeLanguage('en_us')">English</div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'LangSelector',
  props: {
    istyle: {
      type: String,
      default: 'width:60px;'
    },
    icon: {
      type: String,
      default: 'fa fa-language fa-lg'
    },
    iconStyle: {
      type: String,
      default: 'color:#fff;'
    },
    trigger: {
      type: String,
      default: 'click'
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    // 语言切换
    changeLanguage(lang) {
      lang === '' ? 'zh_cn' : lang
      this.$i18n.locale = lang
      this.visible = false
    }
  }
}
</script>
<style scoped lang="scss">
.item {
  font-size: 16px;
  padding-left: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  cursor: pointer;
}
.lang-selector:hover {
  background: #636b6931;
}
.item:hover {
  font-size: 18px;
  background: #b0d6ce4d;
}
</style>
