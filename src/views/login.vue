<template>
  <div class="login">
    <div class="content">
        <div class="left">
          <img src="@/assets/images/loginIcon.png" alt="" />
        </div>
        <div class="right">
          <div class="loginForm-title"> {{loginTitle}} </div>
          <div class="loginForm-form">
            <el-form label-position="top">
              <el-form ref="loginForm" :model="loginForm" :rules="loginRules">
                <el-form-item label="" prop="username">
                  <el-input
                    v-model="loginForm.username"
                    prefix-icon="el-icon-user"
                    placeholder="请输入账号"
                  ></el-input>
                </el-form-item>
                <el-form-item label="" prop="password">
                  <el-input
                    v-model="loginForm.password"
                    prefix-icon="el-icon-lock"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                  ></el-input>
                </el-form-item>
                <el-form-item label="" prop="code" v-if="captchaOnOff" style="margin-bottom: 15px;">
                  <div class="login-captchaBox">
                      <el-input
                        v-model="loginForm.code"
                        auto-complete="off"
                        placeholder="验证码"
                        prefix-icon="el-icon-circle-check"
                        @keyup.enter.native="handleLogin"
                      >
                      <div slot="append" class="login-code">
                        <img :src="codeUrl" @click="getCode" />
                      </div>
                    </el-input>
                  </div>
                </el-form-item>
                <div class="flex jcsb aib">
                  <el-checkbox v-model="loginForm.rememberMe" 
                  style="margin: 0px 0px 25px 0px; color: #000" >记住密码</el-checkbox>
                  <div class="changeCode" @click="getCode" v-if="captchaOnOff">看不清楚？换一张</div>
                </div>

                <el-form-item style="width: 100%">
                  <el-button
                    v-if="!bindAccount"
                    :loading="loading"
                    type="primary"
                    style="width: 100%"
                    @click.native.prevent="handleLogin"
                  >
                    <span v-if="!loading">立 即 登 录</span>
                    <span v-else>登 录 中...</span>
                  </el-button>
                  <el-button
                    v-else
                    :loading="loading"
                    type="primary"
                    style="width: 100%"
                    @click.native.prevent="handleLogin"
                  >
                    <span v-if="!loading">绑定</span>
                    <span v-else>绑 定 中...</span>
                  </el-button>
                </el-form-item>
              </el-form>
            </el-form>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import "element-ui/lib/theme-chalk/display.css";
import logo from "@/assets/logo/logo.gif";
import { getCodeImg, checkBindId, getErrorMsg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";

export default {
  name: "Login",
  data() {
    return {
      loginTitle:process.env.VUE_APP_TITLE,
      logo,
      codeUrl: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: "",
        bindId: "",
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "请输入您的账号",
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "请输入您的密码",
          },
        ],
        code: [
          {
            required: true,
            trigger: "change",
            message: "请输入验证码",
          },
        ],
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      bindAccount: false,
      // 注册开关
      register: true,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    let loginId = this.$route.query.loginId;
    if (loginId === undefined || loginId === null) {
      this.checkBind();
      this.checkErrorMsg();
      this.getCode();
      this.getCookie();
    } else {
      this.redirectLogin(loginId);
    }
  },
  methods: {
    redirectLogin(loginId) {
      this.loading = true;
      this.$store
        .dispatch("RedirectLogin", loginId)
        .then(() => {
          this.$router
            .push({
              path: this.redirect || "/",
            })
            .catch(() => {});
        })
        .catch(() => {
          this.loading = false;
          if (this.captchaOnOff) {
            this.getCode();
          }
          this.$router.push({
            query: {},
          });
        });
    },
    checkBind() {
      let query = this.$route.query;
      let bindId = query.bindId;
      if (bindId === undefined || bindId === null) {
        this.bindAccount = false;
      } else {
        this.bindAccount = true;
        checkBindId(bindId).then((res) => {
          this.bindAccount =
            res.bindAccount === undefined ? true : res.bindAccount;
          if (this.bindAccount) {
            this.loginForm.bindId = bindId;
          } else {
            this.loginForm.bindId = "";
            this.$router.push({
              query: {},
            });
          }
        });
      }
    },
    checkErrorMsg() {
      let errorId = this.$route.query.errorId;
      if (errorId !== undefined && errorId !== null) {
        getErrorMsg(errorId)
          .then((res) => {})
          .catch((err) => {
            this.$router.push({
              query: {},
            });
          });
      }
    },
    getCode() {
      getCodeImg().then((res) => {
        this.captchaOnOff =
          res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    qqLogin() {
      window.location.href = "http://localhost:8080/auth/render/qq";
    },
    authLogin() {
      this.$alert("第三方登录正在集成中...", "提示消息", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.$message({
            type: "info",
            message: `action: ${action}`,
          });
        },
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, {
              expires: 30,
            });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.$router
                .push({
                  path: this.redirect || "/",
                })
                .catch(() => {});
            })
            .catch(() => {
              this.loading = false;
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login {
  user-select: none;
  background-image: url(~@/assets/images/loginBg.png);
  background-size: cover;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  .content{
    display: flex;
    box-shadow: 0 0 100px #aaa;
    border-radius: 10px;
    overflow: hidden;
    .left{
      width: 610px;
      height: 686px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .right{
      background: #fff;
      width: 620px;
      height: 686px;
      padding: 0 70px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .el-form-item{
        margin-bottom: 35px;
      }
      .loginForm-title{
        font-size: 30px;
        font-weight: 600;
        display: flex;
        justify-content: center;
        margin-bottom: 70px;
        img{
          width: 394px;
          height: 34px;
        }
      }
      .login-captchaBox ::v-deep{
        .el-input-group__append{
          padding: 0;
        }
        .login-code{
          width: 122px;
          img{
            height: 50px;
          }
        }
      }
      .changeCode{
          cursor: pointer;
          text-align: right;
          font-family: Microsoft YaHei;
          font-weight: 400;
          font-size: 14px;
          color: #22BB77;
          line-height: 21px;
        }
    }
  }
    //组件样式修改
  ::v-deep {
    .el-input-group__append{
      border: none;
    }
    .el-input__inner{
        height: 50px;
        background: rgb(245, 245, 245);
        padding-left: 40px;
        font-size: 20px;
        color:#000;
        border:1px solid whitesmoke;
    }
    .el-input__inner:focus{
      border:1px solid #109b5e;
    }
    .el-input__inner:placeholder-shown{
        font-size: 16px;
    }
    .el-input__prefix{
        font-size:20px;
        left:10px;
    }
    .el-button{
      height: 50px;
      font-size: 20px;
    }
  }
}
</style>
