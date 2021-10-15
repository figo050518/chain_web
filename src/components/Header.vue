<template>
  <div class="header">
    <div class="logo">
      <img src="../assets/images/login-logo.png" style="height:28px;">
    </div>
    <div class="helper">
      <p style="padding-right: 20px !important; border-right: 1px solid #000">
        {{ username }}
      </p>
      <a-popover placement="bottom" trigger="hover" overlayClassName="header-popover">
        <template slot="content">
          <p style="min-width:150px;">
            <a-icon type="user" style="margin-right:10px;font-size:16px;" />
            <span>{{ username }}</span>
          </p>
          <p style="min-width:150px;" @click="logout">
            <a-icon type="logout" style="margin-right:10px;font-size:16px;"  />
            <span>退出</span>
          </p>
        </template>
        <div class="icon">
          <img
            src="@/assets/images/help.png"
            style="width: 20px; height: 20px"
          />
        </div>
      </a-popover>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      msgBox:null,
    };
  },
  created(){
    this.username = sessionStorage.getItem('user')
  },
  methods: {
    logout() {
      this.msgBox ? this.$message.destroy() : null;
      this.$store.dispatch('Logout',{}).then((res) => {
        sessionStorage.clear();
        this.$router.push('/login');
      }).catch(err=>{
        this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '退出失败')
      })
    },
  },
};
</script>

<style lang="less" scoped>
  .header{
    width:100vw;
    height: 48px;
    background-color: #252a3d;
    position: fixed;
    z-index: 10;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color:#fff;
    p{
      padding:0;
      margin:0;
    }
    .logo{
      padding-left:20px;
    }
    .helper{
      display:flex;
      align-items: center;
      .icon{
        padding:0 20px;
        height:48px;
        line-height: 48px;
        &:hover{
            cursor: pointer;
            background:#000;
        }
      }
    }
  }
  p {
    margin-bottom: 0;
  }
</style>

<style lang="less">
  .header-popover{
    margin:0 !important;
    padding:0 !important;
    .ant-popover-arrow {
      display: none;
    }
    .ant-popover-inner{
      background:#000 !important;
      font-size:14px !important;
      border-radius: 0 !important;
      .ant-popover-inner-content {
        padding:0 !important;
        color:rgba(255,255,255,0.8) !important;
        p{
          display:flex;
          align-items: center;
          padding:10px 15px !important;
          &:hover{
            cursor: pointer;
            background:#252a3d;
            color:#fff;
          }
        }
      }
    }
  }
</style>