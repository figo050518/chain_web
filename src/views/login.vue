<template>
    <div class="login">
        <div class="logo">
            <img src="../assets/images/login-logo.png" style="height:100%;">
        </div>
        <a-form-model class="box" ref="loginForm" :model="loginForm" >
            <div class="left">
                <img src="../assets/images/login-box-bg.png" style="height:100%;">
            </div>
            <div class="right">
                <div class="top">
                    <p style="padding:50px 0;width:100%;text-align:center;font-size:20px;color:#333;font-weight:bold;">欢迎您登录</p>
                    <a-form-model-item prop="user_name" required :rules="[{required:true,message:'请输入账号',trigger:['blur','change']}]">
                        <a-input placeholder="请输入账号" v-model="loginForm.user_name">
                            <a-icon slot="prefix" type="user" style="color:#C7C7C9;" />
                        </a-input>
                    </a-form-model-item>
                </div>
                <div class="bottom">
                    <a-form-model-item prop="password" required :rules="[{required:true,message:'请输入密码',trigger:['blur','change']}]">
                        <a-input placeholder="请输入密码" type="password" v-model="loginForm.password">
                            <a-icon slot="prefix" type="lock" style="color:#C7C7C9;" />
                        </a-input>
                    </a-form-model-item>
                    <a-button class="btn" @click="handleSubmit" :loading="canLogin" :disabled="canLogin">登 录</a-button>
                    <a class="apply" @click="$router.push('/user/register')">申请企业账号 &gt;&gt;</a>
                </div>
            </div>
        </a-form-model>
        <div class="under-mask"></div>
        <div style="position: absolute;bottom:0;left:0;width:100%;text-align:center;color:#fff"> Accelerated & hosted by 4EVERLAND </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            canLogin:false,
            loginForm: {
                user_name: '',
                password: '',
            },
            msgBox:null,
        }
    },
    methods:{
        handleSubmit(e) {
            this.msgBox ? this.$message.destroy() : null;
            this.$refs.loginForm.validate(valid=>{
                if(valid){
                    this.canLogin = true;
                    this.$store.dispatch('Login', this.loginForm).then((res) => {
                        this.canLogin = false;
                        this.msgBox = this.$message.success('登录成功');
                        sessionStorage.setItem('user',this.loginForm.user_name)
                        setTimeout(()=>{
                            this.$store.dispatch('ToggleCrumb',["总览页"]);
                            this.$router.push('/overview/index');
                        },1300)
                    }).catch((err) => {
                        this.canLogin = false;
                        this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '登录失败')
                    })
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
    .login{
        width:100vw;
        min-width: 1280px;
        height:100vh;
        position:relative;
        background:#f5f5f5;
        .logo{
            position:absolute;
            left:4%;
            top:6%;
            height:5vh;
        }
        .box{
            position: absolute;
            top:50%;
            left:50%;
            transform:translate(-50%,-50%);
            z-index:2;
            height:50.4vh;
            min-width:690px;
            min-height:340px;
            display:flex;
            .left{
                height:100%;
            }
            .right{
                background:#fff;
                height:100%;
                width:41.5%;
                border-bottom-right-radius: 15px;
                border-top-right-radius: 15px;
                .top{
                    height:50%;
                    box-shadow:2px -3px 4px #f1f1f1;
                    border-top-right-radius: 15px;
                    position: relative;
                    /deep/ .ant-form-item{
                        position:absolute;
                        bottom:0;
                        width:100%;
                        padding:0 25px;
                        .ant-form-explain{
                            font-size:12px !important; 
                        }
                    }
                }
                .bottom{
                    height:50%;
                    border-bottom-right-radius: 15px;
                    position: relative;
                    /deep/ .ant-form-item{
                        position:absolute;
                        top:0;
                        width:100%;
                        padding:0 25px;
                        .ant-form-explain{
                            font-size:12px !important; 
                        }
                    }
                    .btn{
                        width:calc(100% - 50px);
                        margin:0 25px;
                        margin-top:64px;
                        height: 36px;
                        background: #2B5FD6;
                        border-radius: 20px;
                        color:#fff;
                        font-size:14px;
                    }
                    .apply{
                        margin-top:15px;
                        display:inline-block;
                        width:100%;
                        padding:0 25px;
                        text-align: right;
                        font-size:12px;
                        color:#1E349B;
                    }
                }
            }
        }
        .under-mask{
            position:absolute;
            left:0;
            bottom:0;
            width:100vw;
            min-width:1280px;
            height:50vh;
            background-image:url('../assets/images/logo-footer-bg.png');
            background-size:100% 100%;
        }
    }
    /deep/ .ant-input::-webkit-input-placeholder{
        font-size:12px;
        color:#C7C7C9;
    }
</style>