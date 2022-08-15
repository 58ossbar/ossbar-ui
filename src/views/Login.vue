<template>
  <div >
    <div style="display: flex;padding-left: 15%;height: 75px;">
      <div >
        <img src="../assets/my/logo.png" class="loginLogoStyle" alt="logo" style="display: none">
      </div>
      <div class="appNames" style="height:75px;line-height: 75px;color: black;font-size: 20px;margin-left: 1%; display: none">
        {{ appNames }}   <!--创蓝教育实训云平台-->
      </div>
    </div>
    <div class="center">
      <div class="xixi" style="display: table; margin-top: calc(50vh - 225px);">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="fieldRules"
          label-position="left"
          label-width="0px"
          class="demo-ruleForm login-container"
          @load="refreshCaptcha">
          <h2 class="title" style="padding-left: 22px" >系统登录</h2>
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户密码" name="user" >
              <div class="userPass">
                <el-form-item prop="account">
                  <el-input
                    ref="account"
                    v-model="loginForm.account"
                    type="text"
                    style="margin-top: 10px"
                    auto-complete="off"
                    placeholder="请输入账号">
                    <i slot="prefix" class="el-icon-s-custom" style="margin-left: 5px;"/>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password" @keyup.enter.native="login">
                  <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入密码">
                    <i slot="prefix" class="el-icon-lock" style="margin-left: 5px"/>
                  </el-input>
                </el-form-item>
                <el-form-item >
                  <el-col :span="12">
                    <el-form-item prop="captcha">
                      <el-input
                        v-model="loginForm.captcha"
                        type="test"
                        auto-complete="off"
                        placeholder="单击图片刷新"
                        style="width: 100%;"
                        @keyup.enter.native="login">
                        <i slot="prefix" class="el-icon-picture-outline" style="margin-left: 5px"/>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1" class="line">&nbsp;</el-col>
                  <el-col :span="11">
                    <el-form-item>
                      <img :src="loginForm.src" style="width: 100%;" class="pointer" @click="refreshCaptcha">
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item style="width:100%; height: 35px;margin-top: -30px; text-align: center">
                  <el-checkbox class="remember" >记住账号</el-checkbox>
                </el-form-item>
                <el-form-item style="width:100%;">
                  <el-button type="primary" style="width:48%;" @click.native.prevent="reset">重 置</el-button>
                  <el-button
                    :loading="loading"
                    type="primary"
                    style="width:48%;"
                    @click.native.prevent="login">登 录</el-button>
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label="短信验证码" name="code">
              <div class="phonePass">
                <el-form-item prop="phone">
                  <el-input v-model="phoneForm.phone" type="text" style="margin-top: 20px" auto-complete="off" placeholder="请输入手机号">
                    <i slot="prefix" class="fa fa-phone" style="margin-left: 5px;"/>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-col :span="12">
                    <el-form-item prop="captcha">
                      <el-input
                        v-model="loginForm.captcha"
                        type="test"
                        auto-complete="off"
                        placeholder="单击发送短信"
                        style="width: 100%;margin-top: 20px">
                        <i slot="prefix" class="fa fa-commenting-o" style="margin-left: 5px;"/>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="1" class="line">&nbsp;</el-col>
                  <el-col :span="11">
                    <el-form-item>
                      <el-button style="width: 100%;margin-top: 20px;background: #b9b9b9;height: 40px">点击发送短信</el-button>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item style="width:100%;">
                  <el-button
                    :loading="loading"
                    type="primary"
                    style="width:90%;margin-top: 20px"
                    @click.native.prevent="login">登 录</el-button>
                </el-form-item>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </div>
    <div class="footer" style="display: none">
      <p style="margin-top:0">{{ info }}</p>
      <p>联系电话：<a>{{ phoneCom }}</a></p>
    </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'
import { baseUrl, tokenKeyName } from '@/utils/global'
import Cookies from 'js-cookie'
import ThemePicker from '@/components/ThemePicker'
import LangSelector from '@/components/LangSelector'
export default {
  name: 'Login',
  components: {
    ThemePicker,
    LangSelector
  },
  data() {
    return {
      phoneCom: '0731-89913439',
      info: 'Copyright © 2019-2025 湖南创蓝信息科技有限公司版权所有',
      appNames: '创蓝业务基础平台',
      imageUrlBack: '',
      logo: '',
      loading: false,
      activeName: 'user',
      loginForm: {
        account: process.env.NODE_ENV === 'production' ? '' : 'admin',
        password: process.env.NODE_ENV === 'production' ? '' : 'admin',
        captcha: '',
        captchaUser: '',
        src: ''
      },
      phoneForm: {
        account: '15673144166'
      },
      fieldRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captcha: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      checked: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.account.focus()
    })
    this.refreshCaptcha()
    this.findSettingData()
  },
  methods: {
    findSettingData: function() {
      this.$api.settings.findData().then((res) => {
        if (res.data) {
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].settingValue) {
              if (res.data[i].settingCode === 'logoTitle') {
                this.appNames = res.data[i].settingValue
              }
              if (res.data[i].settingCode === 'companyInfo') {
                this.info = res.data[i].settingValue
              }
              if (res.data[i].settingCode === 'cbLogo') {
                $('.loginLogoStyle').attr('src', baseUrl + '/uploads/settings/' + res.data[i].settingValue)
              }
              if (res.data[i].settingCode === 'contactInfo') {
                this.phoneCom = res.data[i].settingValue
              }
              if (res.data[i].settingCode === 'loginBgImg') {
                this.imageUrlBack = baseUrl + '/uploads/settings/' + res.data[i].settingValue
              }
            }
          }
        }
        if (this.imageUrlBack) {
          $('.center').css({ 'background': "url('" + this.imageUrlBack + "') no-repeat", 'background-size': '100% 100%' })
        } else {
          $('.center').css({ 'background-size': '100% 100%' })
        }
        $('.loginLogoStyle, .footer, .appNames').css({ 'display': 'block' })
      })
    },
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          const userInfo = { username: this.loginForm.account, password: this.loginForm.password, captcha: this.loginForm.captcha }
          this.$api.login.login(userInfo).then((res) => {
            this.loading = false
            if (res.code !== 0) {
              this.$message({ message: res.msg, type: 'error' })
              this.refreshCaptcha()
            } else {
              // 放置token到Cookie
              Cookies.set(tokenKeyName, res.data.token)
              // 保存用户到本地会话
              sessionStorage.setItem('user', userInfo.username)
              sessionStorage.setItem('userRealname', res.data.userRealname)
              sessionStorage.setItem('userimg', res.data.userimg)
              sessionStorage.setItem('userId', res.data.userId)
              // 要求重新加载导航菜单
              this.$store.commit('menuRouteLoaded', false)
              // 登录成功，跳转到主页
              this.$router.push('/')
            }
          }).catch((res) => {
            this.loading = false
            this.$message({
              message: res.message,
              type: 'error'
            })
          })
        }
      })
    },
    refreshCaptcha: function() {
      this.loginForm.src = this.global.baseUrl + '/user/captcha.jpg?t=' + new Date().getTime()
    },
    reset() {
      this.$refs.loginForm.resetFields()
    },
    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    }
  },
  computed: {
    ...mapState({
      themeColor: state => state.app.themeColor
    })
  }
}
</script>

<style lang="scss" scoped>
  .center{
    background: url("../assets/my/bjt.jpg") no-repeat;
    width: 100%;
    height: calc(100vh - 150px);
    background-size: 0 0;
  }
  .xixi{
    padding-left: 60%;
    position: fixed;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .footer {
    font-size: 14px;
    text-align: center;
    height: 75px;
  }
  .footer a:hover {
    color: royalblue;
    cursor: pointer;
  }
  .footer p span{
    margin: 0 10px;
  }
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    /* margin: 100px auto;*/
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 15px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      /*margin: 0 40px 25px 40px;*/
    }
  }
</style>
