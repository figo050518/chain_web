<template>
  <div class="login">
    <div class="logo">
      <img src="../assets/images/login-logo.png"
           style="height:100%;">
    </div>
    <a-form-model class="box"
                  ref="regForm"
                  :model="regForm"
                  :rules="rules">
      <div class="left">
        <img src="../assets/images/login-box-bg.png"
             style="height:100%;">
      </div>
      <div class="right">
        <p style="margin:0;padding:15px 0;width:100%;text-align:center;font-size:18px;color:#333;font-weight:bold;">注 册</p>
        <a-form-model-item prop="user_name"
                           required>
          <a-input placeholder="请设置登录账号"
                   v-model="regForm.user_name">
            <a-icon slot="prefix"
                    type="user"
                    style="color:#C7C7C9;" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="e_mail"
                           required>
          <a-input placeholder="请输入邮箱地址"
                   v-model="regForm.e_mail">
            <a-icon slot="prefix"
                    type="mail"
                    style="color:#C7C7C9;" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="verification_code"
                           required>
          <a-input placeholder="请输入6位验证码"
                   v-model="regForm.verification_code">
            <a-icon slot="prefix"
                    type="safety-certificate"
                    style="color:#C7C7C9;" />
            <a slot="addonAfter"
               type="primary"
               @click="getVerifyCode"
               :class="geting?'disabled':''">{{getText}}</a>
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="password"
                           required>
          <a-input placeholder="请设置登录密码"
                   type="password"
                   v-model="regForm.password">
            <a-icon slot="prefix"
                    type="lock"
                    style="color:#C7C7C9;" />
          </a-input>
        </a-form-model-item>
        <a-form-model-item prop="confirmPwd"
                           required>
          <a-input placeholder="请确认密码"
                   type="password"
                   v-model="regForm.confirmPwd">
            <a-icon slot="prefix"
                    type="lock"
                    style="color:#C7C7C9;" />
          </a-input>
        </a-form-model-item>
        <a-button class="btn"
                  @click="handleSubmit"
                  :loading="canLogin"
                  :disabled="canLogin">注 册</a-button>
        <span class="apply">已有账号？去<a style="color:#1E349B;"
             @click="$router.push('/login')">登录&gt;&gt;</a></span>
      </div>
    </a-form-model>
    <div class="under-mask"></div>
  </div>
</template>

<script>
export default {
  data () {
    const checkName = (rules, value, callback) => {
      if (value) {
        let reg = /[\u4E00-\u9FA5]/g;
        if (reg.test(value)) {
          callback(new Error('不支持中文字符'));
        } else {
          callback()
        }
      } else {
        callback(new Error('请设置登录账号'))
      }
    }
    const checkEmail = (rules, value, callback) => {
      if (value) {
        let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if (reg.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的邮箱地址'))
        }
      } else {
        callback(new Error('请输入邮箱地址'))
      }
    }
    const checkPwdBefore = (rules, value, callback) => {
      if (value) {
        let reg = /[\u4E00-\u9FA5]/g;
        if (reg.test(value)) {
          callback(new Error('不支持中文字符'));
        } else {
          if (this.regForm.confirmPwd) {
            this.$refs.regForm.validateField('confirmPwd');
            callback();
          } else {
            callback()
          }
        }
      } else {
        callback(new Error('请设置登录密码'))
      }
    }
    const checkPwdAfter = (rules, value, callback) => {
      if (value) {
        let reg = /[\u4E00-\u9FA5]/g;
        if (reg.test(value)) {
          callback(new Error('不支持中文字符'));
        } else {
          if (this.regForm.password && this.regForm.password !== value) {
            callback(new Error('两次密码输入不一致'));
          } else {
            callback()
          }
        }
      } else {
        callback(new Error('请确认密码'))
      }
    }
    return {
      msgBox: null,
      canLogin: false,
      regForm: {
        user_name: '',
        e_mail: '',
        verification_code: '',
        password: '',
        confirmPwd: '',
      },
      geting: false,
      getText: '获取验证码',
      countDown: 120,
      timer: null,
      rules: {
        user_name: [{ validator: checkName, trigger: ['blur', 'change'] }],
        e_mail: [{ validator: checkEmail, trigger: ['blur', 'change'] }],
        verification_code: [{ required: true, message: '请填写验证码', trigger: ['blur', 'change'] }],
        password: [{ validator: checkPwdBefore, trigger: ['blur', 'change'] }],
        confirmPwd: [{ validator: checkPwdAfter, trigger: ['blur', 'change'] }],
      }
    }
  },
  methods: {
    // 获取验证码
    getVerifyCode () {
      this.$refs.regForm.validateField('e_mail', errMsg => {
        if (!errMsg) {
          if (this.geting) {
            return;
          } else {
            this.getCodeApi(this.regForm.e_mail).then(res => {
              this.geting = true;
              this.timer = setInterval(() => {
                this.countDown--;
                this.getText = this.countDown + 'S后重试';
                if (this.countDown == 0) {
                  this.geting = false;
                  clearInterval(this.timer);
                  this.countDown = 120;
                  this.getText = '重新发送';
                }
              }, 1000)
              this.msgBox = this.$message.success('验证码已发送至您的邮箱');
            })
          }
        }
      });
    },
    getCodeApi (e_mail) {
      this.msgBox ? this.$message.destroy() : null;
      return new Promise((resolve) => {
        this.$http(
          '/sass/user/getCode',
          'GET',
          { e_mail: e_mail },
          {},
          res => {
            resolve(res)
          },
          err => {
            this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '获取验证码出错')
          }
        );
      })
    },
    // 注册
    handleSubmit (e) {
      this.msgBox ? this.$message.destroy() : null;
      this.$refs.regForm.validate(valid => {
        if (valid) {
          this.canLogin = true;
          console.log(this.regForm);
          this.$http(
            '/sass/user/register',
            'POST',
            {
              user_name: this.regForm.user_name,
              e_mail: this.regForm.e_mail,
            },
            {
              password: this.regForm.confirmPwd,
              verification_code: this.regForm.verification_code
            },
            res => {
              this.canLogin = false;
              this.msgBox = this.$message.success('注册成功');
              setTimeout(() => {
                this.$router.push('/login');
              }, 1300)
            },
            err => {
              this.canLogin = false;
              this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '注册失败')
            }
          );
        }
      })
    },

  }
}
</script>

<style lang="less" scoped>
.login {
  width: 100vw;
  min-width: 1280px;
  height: 100vh;
  position: relative;
  background: #f5f5f5;
  .logo {
    position: absolute;
    left: 4%;
    top: 6%;
    height: 5vh;
  }
  .box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    height: 64vh;
    min-width: 850px;
    min-height: 432px;
    display: flex;
    .left {
      height: 100%;
      // max-width: 60%;
    }
    .right {
      background: #fff;
      height: 100%;
      // width: 40%;
      border-bottom-right-radius: 15px;
      border-top-right-radius: 15px;
      padding: 0 40px;
      .btn {
        width: 100%;
        height: 36px;
        background: #2b5fd6;
        border-radius: 20px;
        color: #fff;
        font-size: 14px;
      }
      .apply {
        margin-top: 10px;
        display: inline-block;
        width: 100%;
        text-align: right;
        font-size: 12px;
        color: #888888;
      }
      /deep/ .ant-form-item {
        margin-bottom: 19px !important;
        .ant-input-group-addon {
          cursor: pointer;
          padding: 0 !important;
          border: 0;
          a {
            background: #2b5fd6;
            border: 1px solid #2b5fd6;
            display: inline-block;
            height: 32px;
            line-height: 32px;
            color: #fff;
            padding: 0 10px !important;
            font-size: 12px;
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }
          a.disabled {
            cursor: not-allowed !important;
            opacity: 0.7 !important;
          }
        }
      }
      /deep/ .ant-form-item-with-help {
        margin-bottom: 0 !important;
        .ant-form-explain {
          font-size: 12px;
        }
      }
      /deep/ .ant-form-item-with-help.ant-form-item {
        margin-bottom: 0 !important;
      }
    }
  }
  .under-mask {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100vw;
    min-width: 1280px;
    height: 50vh;
    background-image: url('../assets/images/logo-footer-bg.png');
    background-size: 100% 100%;
  }
}
/deep/ .ant-input::-webkit-input-placeholder {
  font-size: 12px;
  color: #c7c7c9;
}
</style>