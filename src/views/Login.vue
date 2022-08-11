<template>
  <div >
    <div style="display: flex;padding-left: 15%">
      <div>
        <img src="../assets/my/logo.png" height="70px" alt="logo" />
      </div>
      <div style="height:75px;line-height: 75px;color: black;font-size: 20px;margin-left: 1%">
        创蓝教育实训云平台
      </div>
    </div>
    <div class="center">
      <div class="xixi">
        <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left"
                 label-width="0px" class="demo-ruleForm login-container">
        <!--<span class="tool-bar">
          <theme-picker style="float:right;" class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
        </span>-->
          <h2 class="title" style="padding-left: 22px" >系统登录</h2>
          <el-tabs v-model="activeName">
            <el-tab-pane label="用户密码" name="user">
              <div class="userPass">
                <el-form-item prop="account">
                  <el-input type="text" style="margin-top: 10px" v-model="loginForm.account" auto-complete="off" placeholder="请输入账号">
                    <i slot="prefix" class="fa fa-user-o" style="margin-left: 5px;"></i>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="请输入密码">
                    <i slot="prefix" class="fa fa-television" style="margin-left: 5px"></i>
                  </el-input>
                </el-form-item>
                <el-form-item >
                  <el-col :span="12">
                    <el-form-item prop="captcha">
                      <el-input type="test" v-model="loginForm.captcha" auto-complete="off" placeholder="单击图片刷新"
                                style="width: 100%;">
                        <i slot="prefix" class="fa fa-paper-plane-o" style="margin-left: 5px"></i>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">&nbsp;</el-col>
                  <el-col :span="11">
                    <el-form-item>
                      <img style="width: 100%;" class="pointer" :src="loginForm.src" @click="refreshCaptcha">
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item style="width:100%; height: 35px;margin-top: -30px;">
                  <el-checkbox class="remember" >记住密码</el-checkbox>
                  <el-checkbox class="remember" >自动登录</el-checkbox>
                </el-form-item>
                <el-form-item style="width:100%;">
                  <el-button type="primary" style="width:48%;" @click.native.prevent="reset">重 置</el-button>
                  <el-button type="primary" style="width:48%;" @click.native.prevent="login" :loading="loading">登 录</el-button>
                </el-form-item>
              </div>
            </el-tab-pane>
            <el-tab-pane label="短信验证码" name="code">
              <div class="phonePass">
                <el-form-item prop="captcha">
                  <el-input type="text" style="margin-top: 20px" v-model="phoneForm.account" auto-complete="off" placeholder="请输入手机号">
                    <i slot="prefix" class="fa fa-phone" style="margin-left: 5px;"></i>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-col :span="12">
                    <el-form-item prop="phone">
                      <el-input type="test" v-model="loginForm.captcha" auto-complete="off" placeholder="单击发送短信"
                                style="width: 100%;margin-top: 20px">
                        <i slot="prefix" class="fa fa-commenting-o" style="margin-left: 5px;"></i>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col class="line" :span="1">&nbsp;</el-col>
                  <el-col :span="11">
                    <el-form-item>
                      <el-button  style="width: 100%;margin-top: 20px;background: #b9b9b9;height: 40px">点击发送短信</el-button>
                    </el-form-item>
                  </el-col>
                </el-form-item>
                <el-form-item style="width:100%;">
                  <el-button type="primary" style="width:90%;margin-top: 20px" @click.native.prevent="login" :loading="loading">登 录</el-button>
                </el-form-item>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </div>
    </div>
    <div class="footer">
      <p>Copyright © 2019-2025 <a>湖南创蓝信息科技有限公司</a> 版权所有</p>
      <p>联系电话：<a>0731-89913439</a></p>
    </div>
  </div>
</template>

<script>

  import { mapState } from 'vuex'
  import Cookies from "js-cookie"
  import ThemePicker from "@/components/ThemePicker"
  import LangSelector from "@/components/LangSelector"
  export default {
    name: 'Login',
    components:{
      ThemePicker,
      LangSelector
    },
    data() {
      return {
        loading: false,
        activeName: 'user',
        loginForm: {
          account: '',
          password: '',
          captcha:'',
          src: ''
        },
        phoneForm: {
          account: '15673144166',
        },
        fieldRules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ] ,
          phone: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ] ,
          captcha: [
            { required: true, message: '请输入手机号', trigger: 'blur' }
          ]
        },
        checked: true
      }
    },
    methods: {
      login() {
        this.loading = true
        let userInfo = {username:this.loginForm.account, password:this.loginForm.password, captcha:this.loginForm.captcha}
        this.$api.login.login(userInfo).then((res) => {
          if(res.msg != null) {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          } else {
            Cookies.set('token', res.token) // 放置token到Cookie
            sessionStorage.setItem('user', userInfo.username) // 保存用户到本地会话
            this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
            this.$router.push('/')  // 登录成功，跳转到主页
          }
          this.loading = false
        }).catch((res) => {
          this.$message({
            message: res.message,
            type: 'error'
          })
        });
      },
      refreshCaptcha: function(){
        this.loginForm.src = this.global.baseUrl + "/user/captcha.jpg?t=" + new Date().getTime();
      },
      reset() {
        this.$refs.loginForm.resetFields()
      },
      // 切换主题
      onThemeChange: function(themeColor) {
        this.$store.commit('setThemeColor', themeColor)
      }
    },
    mounted() {
      this.refreshCaptcha()
    },
    computed:{
      ...mapState({
        themeColor: state=>state.app.themeColor
      })
    }
  }
</script>

<style lang="scss" scoped>
  .center{
    background-image: url("../assets/my/bjt.jpg");
    width: 100%;
    height: 550px;
  }
  .xixi{
    padding-top: 50px;
    padding-left: 60%;
  }
  .footer {
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
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
      margin: 0 40px 25px 40px;
    }
  }
</style>
