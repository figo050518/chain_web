<template>
  <div class="mini-config">
    <div class="config animate__animated animate__zoomIn">
      <a-form-model
        ref="configForm"
        :model="configForm"
        :rules="rules"
        layout="vertical"
      >
        <a-form-model-item label="新建模板名称" prop="applets_name">
          <a-input v-model="configForm.applets_name" />
        </a-form-model-item>
        <a-form-model-item label="头部背景图" prop="background_picture">
          <a-upload
            v-model="configForm.background_picture"
            action="http://139.159.146.109:9530/v1/file/upload"
            accept="image/png,image/jpeg,image/jpg"
            :file-list="bannerList"
            list-type="picture-card"
            name="upload"
            @preview="handlePreview"
            :beforeUpload="handleBefore"
            @change="handleBannerChange"
          >
            <div v-if="bannerList.length < 2">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <div class="help-explain">
            支持文件类型：jpg、png，大小限制：5M建议使用正方形，推荐大小 512*512
          </div>
        </a-form-model-item>
        <a-form-model-item label="品牌LOGO图(居中显示)" prop="logo">
          <a-upload
            v-model="configForm.logo"
            action="http://139.159.146.109:9530/v1/file/upload"
            accept="image/png,image/jpeg,image/jpg"
            list-type="picture-card"
            :file-list="logoList"
            name="upload"
            @preview="handlePreview"
            :beforeUpload="handleBefore"
            @change="handleLogoChange"
          >
            <div v-if="logoList.length < 2">
              <a-icon type="plus" />
              <div class="ant-upload-text">上传</div>
            </div>
          </a-upload>
          <div class="help-explain">
            支持文件类型：jpg、png，大小限制：5M建议使用正方形，推荐大小 64*64
          </div>
        </a-form-model-item>
        <a-form-model-item
          label="多次验证警告模块"
          prop="warn1"
          required
          style="margin-bottom: 0"
        >
          <a-radio-group @change="onChange" v-model="configForm.warn1">
            <a-radio :style="radioStyle" :value="'1'"> 默认文案 </a-radio>
            <a-radio :style="radioStyle" :value="'2'"> 自定义 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label=""
          v-if="configForm.warn1 == '2'"
          style="width: 200px"
          prop="warning_module"
        >
          <a-input palceholder="请输入" v-model="configForm.warning_module" />
        </a-form-model-item>

        <a-form-model-item label="扫码记录" prop="scan_record" required >
          <a-radio-group v-model="configForm.scan_record">
            <a-radio :style="radioStyle" :value="'1'"> 显示 </a-radio>
            <a-radio :style="radioStyle" :value="'2'"> 不显示 </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-button
          type="primary"
          @click="handleSubmit"
          style="margin-right: 8px"
        >
          保存
        </a-button>
        <a-button @click="cancelAdd"> 取消 </a-button>
      </a-form-model>

      <a-modal
        title="预览"
        :visible="previewVisible"
        :footer="null"
        @cancel="handleCancel"
      >
        <img alt="preview" style="width: 100%" :src="previewImage" />
      </a-modal>
    </div>
    <div class="mobile animate__animated animate__zoomIn">
      <div class="mobile-container">
        <mobile-preview :config="configForm"></mobile-preview>
      </div>
      <div class="explain">手机预览效果图</div>
    </div>
  </div>
</template>
<script>
import MobilePreview from "@/components/MobilePreview.vue";
import { mapGetters, mapActions } from "vuex";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default {
  data() {
    return {
      bannerList: [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: "https://image.peerfintech.cn/saas-bg.png",
        },
      ],
      logoList: [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: "https://image.peerfintech.cn/FjQI8VfXnwnBt3LFsx93N_90DLEx",
        },
      ],

      configForm: {},
      rules: {
        applets_name: [
          {
            required: true,
            message: "请填写模板名称",
            trigger: ["blur", "change"],
          },
        ],
        background_picture: [
          {
            required: true,
            message: "请上传头部背景图",
            trigger: ["blur", "change"],
          },
        ],
        logo: [
          {
            required: true,
            message: "请上传品牌LOGO图",
            trigger: ["blur", "change"],
          },
        ],
        warn1: [
          {
            required: true,
            message: "此项为必填项",
            trigger: ["blur", "change"],
          },
        ],
        warning_module: [
          {
            required: true,
            message: "此项为必填项",
            trigger: ["blur", "change"],
          },
        ],
      },
      previewVisible: false,
      previewImage: "",

      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
      warn1: "1",
      optType: this.$route.query.id,
    };
  },
  components: {
    MobilePreview,
  },
  computed: {
    ...mapGetters({
      miniModalConfig: "config/miniModalConfig",
    }),
  },
  mounted() {
    console.log("传参：", this.$route.query);
    if (this.$route.query.id == 2) {
      //编辑
      // this.configForm = this.$route.query.item;
      this.configForm = JSON.parse(this.$route.query.item);
    } else {
      //添加
      //原始模板
      this.fetchInitalMini().then((res) => {
        this.configForm = this.miniModalConfig;
        // this.warn1= warning_module === "" ? "1" : "2"
      });
    }
  },
  methods: {
    ...mapActions({
      fetchInitalMini: "config/fetchInitalMini",
    }),
    handleSubmit(e) {
      e.preventDefault();
      console.log("---提交表单", this.configForm);
      this.$refs.configForm.validate((valid) => {
        if (valid) {
          console.log("success submit!", this.configForm);
          let obj = {
            applets_name: this.configForm.applets_name,
            background_picture: this.configForm.background_picture,
            logo: this.configForm.logo,
            scan_record: this.configForm.scan_record,
            warning_module: this.configForm.warning_module,
            company_id: this.$store.getters.company_id,
          };
          if (this.optType == 2) {
            obj.applets_id = this.configForm.applets_id;
          }
          this.addMiniConfig(obj);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleBefore(file, fileList) {
      return new Promise((resolve, reject) => {
        if (
          fileList[0].type != "image/png" &&
          fileList[0].type != "image/jpeg" &&
          fileList[0].type != "image/jpg"
        ) {
          this.$message.error("请选择正确的文件格式");
          return reject(false);
        }
        if (fileList[0].size / 1048576 > 5) {
          this.$message.error("文件不能大于5MB");
          return reject(false);
        }
        return resolve(true);
      });
    },

    handleBannerChange({ fileList }) {
      this.bannerList = fileList;
      if (this.bannerList.length == 0) {
        return (this.configForm.background_picture = "");
      }
      this.bannerList = this.bannerList.slice(-1);
      if (
        this.bannerList[0].response &&
        this.bannerList[0].response.errCode == 0
      ) {
        this.configForm.background_picture = this.bannerList[0].response.data;
      }
    },
    handleLogoChange({ fileList }) {
      this.logoList = fileList;
      if (this.logoList.length == 0) {
        return (this.configForm.logo = "");
      }
      this.logoList = this.logoList.slice(-1);
      if (this.logoList[0].response && this.logoList[0].response.errCode == 0) {
        this.configForm.logo = this.logoList[0].response.data;
      }
    },
    onChange(e) {
      console.log("radio checked", e.target.value);
      let flag = e.target.value;
      this.configForm.warning_module = "";
    },
    cancelAdd() {
      this.$confirm({
        title: "提示",
        content: "确定取消编辑吗，返回将不保存数据",
        okText: "确定",
        cancelText: "取消",
        onOk: () => {
          this.$router.push("/config/mini");
        },
        onCancel() {
          console.log("Cancel");
        },
      });
    },
    //添加模板配置
    addMiniConfig(form) {
      this.$http(
        "/sass/applets/input",
        "POST",
        form,
        {},
        (res) => {
          this.$message.success("小程序模板配置成功");
          console.log(res);
          this.$router.push("/config/mini");
        },
        (err) => {
          this.$message.error("小程序模板配置失败");
          console.log(err);
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.mini-config {
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
        // /deep/.ant-form-explain {
        //   width: 226px;
        //   color: #000;
        //   font-size: 12px;
        //   line-height: 20px;
        //   opacity: 0.45;
        // }
      }

      .help-explain {
        width: 226px;
        color: #000;
        font-size: 12px;
        line-height: 20px;
        opacity: 0.45;
      }

      /deep/.ant-upload-picture-card-wrapper {
        .ant-upload-list-picture-card-container {
          width: 80px;
          height: 80px;
          .ant-upload-list-item.ant-upload-list-item-list-type-picture-card {
            width: 80px;
            height: 80px;
          }
        }
        .ant-upload.ant-upload-select.ant-upload-select-picture-card {
          width: 80px;
          height: 80px;
          .ant-upload {
            padding: 2px;
            font-size: 12px;
            text-align: center;
          }
        }
      }
    }
  }
  .mobile {
    flex-shrink: 0; /*防止被压缩*/
    width: 375px;
    margin-left: 40px;
    // border: 1px solid #aaa;
    .mobile-container {
      overflow: hidden;
      background: #ebeef5;
      position: relative;
      // max-height: 667px;
      max-height: 720px;
      overflow-y: auto;
    }
    .explain {
      width: 100%;
      height: 22px;
      color: #000;
      font-size: 14px;
      line-height: 22px;
      text-align: center;
      opacity: 0.65;
    }
  }
}
</style>