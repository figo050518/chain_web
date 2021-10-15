<template>
  <div class="certificate">
    <div class="config animate__animated animate__zoomIn">
      <a-form-model
        :model="certForm"
        :rules="rules"
        ref="certForm"
        layout="vertical"
      >
        <div class="info-wrap">
          <p class="title">链信息</p>
          <div class="content">
            <a-form-model-item label="所在链" style="margin-bottom: 0">
              <a-radio-group v-model="inChain" @change="inChainChange">
                <a-radio :style="radioStyle" :value="1"> 默认 {{user}}</a-radio>
                <a-radio :style="radioStyle" :value="2"> 自定义 </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="" style="width: 200px" ref="chainName" prop="chain_name">
              <a-input
                palceholder="请输入"
                :disabled="inChain !== 2"
                v-model="certForm.chain_name"
              />
            </a-form-model-item>

            <a-form-model-item label="所在区块">
              扫码展示 &nbsp;
              <a-switch v-model="certForm.block_height" />
            </a-form-model-item>
            <a-form-model-item label="成块时间">
              扫码展示 &nbsp;
              <a-switch v-model="certForm.block_time" />
            </a-form-model-item>
            <a-form-model-item label="唯一编码">
              扫码展示 &nbsp;
              <a-switch v-model="certForm.txid" />
            </a-form-model-item>
          </div>
        </div>
        <div class="info-wrap">
          <p class="title">身份信息</p>
          <div class="content">
            <a-form-model-item label="上传者身份" style="margin-bottom: 0">
              <a-radio-group v-model="identity" @change="identityChange">
                <a-radio :style="radioStyle" :value="1"> 默认 {{user}}</a-radio>
                <a-radio :style="radioStyle" :value="2"> 自定义 </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="" style="width: 200px" prop="upload_name">
              <a-input
                palceholder="请输入"
                :disabled="identity !== 2"
                v-model="certForm.upload_name"
              />
            </a-form-model-item>

            <a-form-model-item label="上传主体证明">
              扫码展示 &nbsp;
              <a-switch v-model="certForm.upload_prove" />
            </a-form-model-item>
            <a-form-model-item label="上传时间">
              扫码展示 &nbsp;
              <a-switch v-model="certForm.upload_time" />
            </a-form-model-item>
          </div>
        </div>

        <a-button
          type="primary"
          html-type="submit"
          @click="handleSubmit"
          style="margin-right: 8px"
        >
          保存
        </a-button>
        <a-button @click="cancelEdit"> 取消 </a-button>
      </a-form-model>
    </div>
    <div class="cert animate__animated animate__zoomIn">
      <div class="cert-container">
        <img class="logo" src="@/assets/images/mobile/cert/logo.png" alt="" />
        <br />
        <span class="title">众享溯源链证书</span> <br />
        <img
          class="division"
          src="@/assets/images/mobile/cert/division.png"
          alt=""
        />
        <div class="cert-item">
          <div class="label">所在链</div>
          <div class="value">{{ certForm.chain_name || user }}</div>
        </div>
        <div class="cert-item" v-show="certForm.block_height">
          <div class="label">所在区块</div>
          <div class="value">{{ certInfo.block_height }}</div>
        </div>
        <div class="cert-item" v-show="certForm.block_time">
          <div class="label">成块时间</div>
          <div class="value">{{ certInfo.block_time }}</div>
        </div>
        <div class="cert-item" v-show="certForm.txid">
          <div class="label">唯一编码</div>
          <div class="value">
            {{ certInfo.txid }}
          </div>
        </div>

        <div class="cert-item-info" style="margin-top: 30px">
          <div class="label">上传者身份：</div>
          <div class="value">{{ certForm.upload_name || user }}</div>
        </div>
        <div class="cert-item-info" v-show="certForm.upload_time">
          <div class="label">上传时间：</div>
          <div class="value">{{ certInfo.upload_time }}</div>
        </div>
        <div class="cert-item-info" v-show="certForm.upload_prove">
          <div class="label">主体证明：</div>
          <div class="value">{{ certInfo.upload_prove }}</div>
        </div>
        <div class="seal"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    var chainName = (rule, value, callback) => {
      if (this.inChain == 2 && value == "") {
        callback(new Error("此项为必填项"));
      } else {
        callback();
      }
    };
    var uploadName = (rule, value, callback) => {
      if (this.identity == 2 && value == "") {
        callback(new Error("此项为必填项"));
      } else {
        callback();
      }
    };
    return {
      certForm: {},
      inChain: 1,
      identity: 1,
      rules: {
        chain_name: [{ required: true, validator: chainName, trigger: "blur" }],
        upload_name: [
          { required: true, validator: uploadName, trigger: "blur" },
        ],
      },
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      user:this.$store.getters.company_name || "无" //证书默认
    };
  },
  computed: {
    ...mapGetters({
      initialCert: "config/initialCert",
      certInfo: "config/certInfo",
    }),
  },
  mounted() {
    //获取模板初始配置
    this.fetchInitalCert({ company_id: this.$store.getters.company_id }).then(
      (res) => {
        this.certForm = this.initialCert;
        this.inChain = this.certForm.chain_name == "" ? 1 : 2;
        this.identity = this.certForm.upload_name == "" ? 1 : 2;
      }
    );
    this.fetchCertContent({
      company_id: this.$store.getters.company_id,
      txid: "123",
    }); //获取证书具体内容
  },
  methods: {
    ...mapActions({
      fetchInitalCert: "config/fetchInitalCert",
      fetchCertContent: "config/fetchCertContent",
    }),
    handleSubmit(e) {
      e.preventDefault();
      console.log("---提交表单", this.certForm);
      this.$refs.certForm.validate((valid) => {
        if (valid) {
          console.log("success submit!");
          let obj = {};
          for (const key in this.certForm) {
            if (Object.hasOwnProperty.call(this.certForm, key)) {
              const element = this.certForm[key];
              if(key !== "company_id"){
                obj[key] = element + "";
              }else{
                obj[key]= element
              }
            }
          }
          this.addCertConfig(obj);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    inChainChange(e) {
      console.log("radio checked", e.target.value);
      let flag = e.target.value;
      if(flag == 1){
        this.$refs.certForm.clearValidate("chain_name");
      }
      // if(flag==1){//默认
      //   this.certForm.chain_name='鲍念雯'
      // }else if(flag==2){//自定义
      //   this.certForm.chain_name=''
      // }
      this.certForm.chain_name = "";
    },
    identityChange(e) {
      console.log("radio checked", e.target.value);
      let flag = e.target.value;
      if(flag == 1){
        this.$refs.certForm.clearValidate("upload_name");
      }
      this.certForm.upload_name = "";
    },
    //添加证书配置
    addCertConfig(form) {
      console.log("最终提交数据", form);
      this.$http(
        "/sass/cert/input",
        "POST",
        form,
        {},
        (res) => {
          this.$message.success('证书配置成功');
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    },
    cancelEdit(){
        this.$confirm({
          title: "提示",
          content: "确定取消编辑吗？取消后将不保存数据",
          okText: "确定",
          cancelText: "取消",
          onOk: () => {
            console.log("ok");
          },
          onCancel() {
            console.log("Cancel");
          },
        });
    }
  },
};
</script>
<style lang="less" scoped>
.certificate {
  display: flex;
  .config {
    flex: 1 1;
    padding: 24px;
    background-color: #fff;
    .ant-form {
      .ant-form-item {
        margin: 0 0 24px;
        .ant-form-item-label {
          color: rgba(0, 0, 0, 0.85);
        }
        .ant-input {
          max-width: 420px;
        }
      }
      .info-wrap {
        margin-bottom: 16px;
        border: 1px solid #e9e9e9;
        .title {
          font-weight: bold;
          margin-bottom: 16px;
          padding: 12px 24px;
          font-size: 16px;
          background-color: #fafafa;
          border-bottom: 1px solid #e9e9e9;
        }
        .content {
          padding: 0 24px;
        }
      }
    }
  }
  .cert {
    flex-shrink: 0; /*防止被压缩*/
    width: 375px;
    margin-left: 40px;
    .cert-container {
      position: relative;
      box-sizing: border-box;
      width: 375px;
      height: 667px;
      padding: 37px 37px 0;
      overflow-y: auto;
      color: rgba(0, 0, 0, 0.45);
      background: url("../../assets/images/mobile/cert/certBg.png") no-repeat 0
        0 / contain;
      text-align: center;
      .logo {
        width: 38px;
        height: 38px;
      }
      .title {
        font-size: 24px;
        display: inline-block;
        margin-top: 25px;
        color: #3379d8;
      }
      .division {
        width: 291px;
        height: 8px;
        margin-bottom: 30px;
      }

      .cert-item {
        margin-bottom: 8px;
        text-align: left;
        .label {
          margin-bottom: 2px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          color: #3379d8;
        }
        .value {
          padding: 8px 16px;
          color: #333;
          text-align: center;
          word-break: break-all;
          background-color: #fff;
          font-family: -apple-system, BlinkMacSystemFont;
          border: 1px solid #0083ff;
          border-radius: 5px;
        }
      }
      .cert-item-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 16px;
        color: #022648;
        .label{
          width:100px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
        }
        .value{
          width:calc(100% - 105px);
          text-align: right;
        }
      }
      .seal {
        position: absolute;
        right: 50px;
        bottom: 80px;
        width: 139px;
        height: 139px;
        background: url("../../assets/images/mobile/cert/seal.png") no-repeat 0
          0 / contain;
      }
    }
  }
}
</style>