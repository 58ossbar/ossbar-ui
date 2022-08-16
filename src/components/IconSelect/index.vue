<template>
  <div>
    <el-popover
      ref="popover"
      :placement="placement"
      :disabled="disabledSelected"
      popper-class="pupop-select-icon"
      transition="el-zoom-in-top"
      trigger="click">
      <!--<el-scrollbar   class="hide-x" :native="false"
                      style="overflow-x: hidden !important;overflow-y: auto !important;height: 200px !important;width: 500px !important;"
                      :noresize="false">-->
      <el-tabs tab-position="top" style="width: 600px;height: 380px;overflow-y: auto">
        <el-tab-pane v-for="(value,index) in data" :label="value.iconTitle" :key="index" style="width: 100%;height: 320px;overflow-y: auto">
          <!--<el-scrollbar   class="hide-x" :native="false"
                            style="overflow-x: hidden !important;overflow-y: auto !important;width: 400px !important;"
                            :noresize="false">-->
          <div v-for="(item,index) in value.iconName" :key="index" style="margin: 5px;display: inline-block">
            <div
              :key="item"
              :class="{ 'is-active': isActive(item) }"
              class="icon-item"
              @click="currentChangeDiv(item)">
              <i :class="item" />
            </div>
          </div>
          <!-- </el-scrollbar>-->

        </el-tab-pane>
      </el-tabs>
      <!-- </el-scrollbar>-->
    </el-popover>
    <el-input
      v-popover:popover
      v-model="propInput"
      :readonly="readonly"
      :placeholder="placeholder"
      :clearable="clearable"
      style="cursor:pointer;"
      @change.native="filterIcon"
      @clear="clear">
      <el-button slot="prepend" :icon="propInput?''+propInput+'':'el-icon-search'"/>
    </el-input>
  </div>
</template>

<script>
import iconData from './icon.json'
export default {
  name: 'PopupTreeInput',
  props: {
    disabledSelected: {
      type: Boolean,
      default: false
    },
    prop: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '点击选择内容'
    },
    placement: {
      type: String,
      default: 'bottom-start'
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      data: iconData,
      propInput: this.prop,
      props: {
        label: 'iconName',
        children: 'list'
      }
    }
  },
  watch: {
    prop(val) {
      this.propInput = val// ②监听外部对props属性result的变更，并同步到组件内的data属性myResult中
    },
    propInput(val) {
      // xxcanghai 小小沧海 博客园
      this.$emit('changeProp', val)// ③组件内对myResult变更后向外部发送事件通知
    }
  },
  mounted() {
    this.$nextTick(function() {

      /* for(let i=0;i<iconData.length;i++){
          if(iconData[i].iconName){
            for(let k=0;k<iconData[i].iconName.length;k++){
              iconData[i].iconName[k]="fa fa-"+iconData[i].iconName[k];
            }
          }
          console.log("iconData");
          console.log(iconData[i].iconTitle);
          console.log(iconData[i].iconName);
        }*/

    })
  },
  methods: {
    isActive(item) {
      return this.propInput === item
    },
    clear() {
      this.data = iconData
    },
    filterIcon() {
      if (this.propInput) {
        this.data = this.data.filter(item => item.includes(this.propInput))
      } else {
        this.data = iconData
      }
    },
    filterNode(value, data) {
      if (!value) return true
      return data.iconName.indexOf(value) !== -1
    },
    currentChangeDiv: function(data) {
      this.$emit('currentChangeHandle', { data: data })
    }
    /* currentChangeHandle:function (data,node) {
        this.$emit('currentChangeHandle', {data:data.iconName})
      }*/
  }
}
</script>

<style scoped lang="scss">

  .iconDivCom{
    display: inline-block;background-color: bisque;padding: 5px; margin: 5px;
    width:40px;height: 50px;
  }
  .iconICom{
    font-size: 40px;vertical-align: middle;text-align: center;
  }

  // 弹出内容
  @at-root .el-popover.el-popper.pupop-select-icon {
    $size: 40px;    // 图标项大小
    $col-count: 8;  // 多少列
    $row-count: 4;  // 多少行
    $scope: 5px;    // 间隔

    display: block;
    padding: 0;

    width: ($size + $scope * 2) * $col-count + 2px;
    height: ($size + $scope * 2) * $row-count;

    > .el-scrollbar { height: 100%;
    }
    >.el-scrollbar .el-scrollbar__wrap {
      /* overflow: scroll; */
      overflow-y: auto !important;
      overflow-x: hidden !important;
      height: 200px !important;
      width: 500px !important;

    }
    .el-scrollbar__view {
     /* @extend .fn-clear;*/
    }
    .el-tabs__item {
      padding: 0 5px;
    }
    .el-tabs--left .el-tabs__item.is-left{
      text-align: left;
    }
    .icon-item {
      float: left;
      width: $size;
      height: $size;
      line-height: $size;
      /*margin: $scope;*/
      padding: $scope;
      text-align: center;
      cursor: pointer;
      &:hover { background-color: #e8eaec ; }
      &.is-active {
        background-color: #98C8F7 ;
        border: 1px solid #98C8F7 ;
      }
      > i {
        display: block;
        width: 100%;
        height: 100%;
        font-size: 20px;
        line-height: $size;
        color: #000000;
        background-color: #ffffff;
      }
    }
  }

</style>
