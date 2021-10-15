<template>
  <div class="trace-template">
    <div class="def-card animate__animated animate__zoomIn" style="margin-top: 16px; padding: 0">
      <div v-if="configForm.process.length == 0">
        <a-list :data-source="[]" />
      </div>
      <div v-else>
        <a-collapse v-model="activeKey" :bordered="false">
          <a-collapse-panel
            v-for="(item, order) in configForm.process"
            :key="order.toString()"
            :style="order == 0 ? 'border-top:1px solid #d9d9d9;' : ''"
          >
            <div slot="header">
              <span style="color: rgba(0, 0, 0, 0.85); margin-right: 10px">{{
                item.process_name
              }}</span>
            </div>
            <div slot="extra" style="display: flex; align-items: center">
              <a-popconfirm
                title="确定删除该环节?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="DeleteSegment(order)"
                @cancel="return true;"
              >
                <a-button type="link" size="small">删除</a-button>
              </a-popconfirm>
              <span
                style="
                  display: inline-flex;
                  flex-direction: column;
                  margin-left: 10px;
                "
              >
                <a-icon
                  type="caret-up"
                  :style="
                    order == 0
                      ? 'cursor:not-allowed;color:rgba(0,0,0,.2);'
                      : 'cursor:pointer;'
                  "
                />
                <a-icon
                  type="caret-down"
                  :style="
                    order == Number(configForm.process.length - 1)
                      ? 'cursor:not-allowed;color:rgba(0,0,0,.2);'
                      : 'cursor:pointer;'
                  "
                />
              </span>
            </div>
            <a-form-model ref="configForm" :model="item">
              <a-form-model-item
                label="名称编辑"
                prop="process_name"
                required
                :rules="[
                  {
                    required: true,
                    message: '请填写环节名称',
                    trigger: ['blur', 'change'],
                  },
                ]"
                style="display: flex"
              >
                <a-input
                  v-model="item.process_name"
                  style="width: 200px"
                ></a-input>
              </a-form-model-item>
              <a-table
                :row-key="(record) => record.id"
                :columns="columns"
                :data-source="item.content"
                :pagination="false"
              >
                <template slot="slot-title" slot-scope="text, record, index">
                  <span v-if="item.hasCancel">{{ text }}</span>
                  <a-form-model-item
                    v-else
                    :prop="'content.' + index + '.title'"
                    required
                    :rules="[
                      {
                        required: true,
                        message: '请填写标题',
                        trigger: ['blur', 'change'],
                      },
                      {
                        min: 1,
                        max: 12,
                        message: '最大支持12位字符',
                        trigger: ['blur', 'change'],
                      },
                    ]"
                  >
                    <a-input
                      v-model="record.title"
                      placeholder="请输入标题"
                    ></a-input>
                  </a-form-model-item>
                </template>
                <template slot="type" slot-scope="text, record, index">
                  <a-form-model-item
                    :prop="'content.' + index + '.type'"
                    required
                  >
                    <a-select
                      v-model="record.type"
                      style="width: 120px"
                      @change="handleSelect(order, record.type, index)"
                    >
                      <a-select-option value="文本"> 文本 </a-select-option>
                      <a-select-option value="图片"> 图片 </a-select-option>
                      <a-select-option value="视频"> 视频 </a-select-option>
                    </a-select>
                  </a-form-model-item>
                </template>
                <template slot="value" slot-scope="text, record, index">
                  <span style="display: flex; align-items: center">
                    <a-form-model-item
                      v-if="record.type == '文本'"
                      :prop="'content.' + index + '.detail'"
                      required
                      :rules="[
                        {
                          required: true,
                          message: '请填写内容',
                          trigger: ['blur', 'change'],
                        },
                        {
                          min: 1,
                          max: 100,
                          message: '最大支持100个字符',
                          trigger: ['blur', 'change'],
                        },
                      ]"
                    >
                      <!-- :style="!record.link ? 'width:77%' : ''" -->
                      <a-input
                        v-model="record.detail"
                        placeholder="请输入内容"
                      ></a-input>
                    </a-form-model-item>
                    <!-- <a-icon
                      v-if="record.type == 'text'"
                      type="link"
                      style="
                        margin: 0 3px;
                        margin-top: -27px;
                        cursor: pointer;
                        color: #1890ff;
                      "
                      @click="handleLink(order, record, index)"
                    ></a-icon> -->
                    <!-- <a-form-model-item
                      v-if="record.type == 'text' && record.link"
                      :prop="'content.' + index + '.url'"
                      required
                      :rules="[
                        {
                          required: true,
                          message: '请填写链接',
                          trigger: ['blur', 'change'],
                        },
                        {
                          min: 1,
                          max: 100,
                          message: '最大支持100个字符',
                          trigger: ['blur', 'change'],
                        },
                      ]"
                    >
                      <a-input
                        v-model="record.url"
                        placeholder="请填写链接"
                      ></a-input>
                    </a-form-model-item> -->

                    <a-form-model-item
                      v-if="record.type == '图片'"
                      :prop="'content.' + index + '.detail'"
                      required
                      :rules="[
                        {
                          required: true,
                          message: '请上传图片',
                          trigger: ['blur', 'change'],
                        },
                      ]"
                      style="display: flex; align-items: center"
                    >
                      <a-upload
                        v-model="record.detail"
                        accept="image/png,image/jpeg"
                        list-type="picture-card"
                        :file-list="record.detail"
                        name="upload"
                        @preview="handlePreview"
                        :remove="handleRemove"
                        :customRequest="customIRequest"
                        :data="{ order: order, current: index, record: record }"
                      >
                        <a-icon type="plus" />
                      </a-upload>
                    </a-form-model-item>
                    <!-- 视频 -->
                    <a-form-model-item
                      v-if="record.type == '视频'"
                      :prop="'content.' + index + '.detail'"
                      required
                      :rules="[
                        {
                          required: true,
                          message: '请上传视频文件',
                          trigger: ['blur', 'change'],
                        },
                      ]"
                      style="display: flex; align-items: center"
                    >
                      <a-upload
                      v-if="record.value.length==0 || record.value[0].status=='uploading'"
                        v-model="record.detail"
                        accept=".mp4"
                        list-type="picture-card"
                        :file-list="record.detail"
                        name="upload"
                        @preview="handlePreviewVideo"
                        :remove="handleRemove"
                        :customRequest="customVRequest"
                        :data="{ order: order, current: index, record: record }"
                      >
                        <a-icon type="plus" />
                      </a-upload>

                        <div v-if="record.value.length==1&&record.value[0].status=='done'"
                             style="margin-right:5px;width:78px;height:78px;padding:5px;border-radius:4px;border:1px solid #d9d9d9;position:relative;">
                          <video class="el-upload-list__item-thumbnail"
                                 style="width:100%;height:100%;">
                            <source :src="record.value[0].url">
                          </video>
                          <div style="width:63px;height:63px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1;display:flex;justify-content:center;align-items:center;">
                            <a-icon type="eye"
                                    style="cursor:pointer;font-size:16px;color:#fff;"
                                    @click="handlePreviewVideo(record.value[0],'video/mp4')" />
                            <a-icon type="delete"
                                    style="cursor:pointer;font-size:16px;margin-left:6px;color:#fff;"
                                    @click="handleRemove(record.value[0])" />
                          </div>
                        </div>
                    </a-form-model-item>
                  </span>
                </template>
                <template slot="action" slot-scope="text, record, index">
                  <a-popconfirm
                    title="确定删除该条信息?"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleDelete(order, index)"
                    @cancel="return true;"
                  >
                    <a>删除</a>
                  </a-popconfirm>
                </template>
              </a-table>
              <a-button
                type="dashed"
                icon="plus"
                size="large"
                style="
                  font-size: 14px;
                  margin: 16px 24px 24px;
                  width: calc(100% - 48px);
                  text-align: center;
                "
                @click="handleAddInfo(order)"
                >添加新的一行信息</a-button
              >
            </a-form-model>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <a-button
        type="dashed"
        icon="plus"
        size="large"
        style="
          font-weight: bold;
          margin: 24px;
          width: calc(100% - 48px);
          text-align: center;
        "
        @click="handleAddSegment"
        >添加溯源环节</a-button
      >
    </div>

    <div class="def-card animate__animated animate__zoomIn" style="margin-top: 16px">
      <div
        style="display: flex; align-items: center; justify-content: flex-end"
      >
        <a-button
          style="margin-right: 10px"
          @click="$router.push('/config/track')"
          >取消</a-button
        >
        <a-button type="primary" @click="handleSave">保存</a-button>
      </div>
    </div>

    <a-modal
      title="预览"
      :visible="previewVisible"
      :footer="null"
      @cancel="previewVisible = false"
    >
      <img
        alt="example"
        style="width: 100%"
        :src="previewSrc"
      />
    </a-modal>

    <a-modal title="预览"
             :visible="videoVisible"
             :footer="null"
             @cancel="videoVisible=false;">
      <!-- <video class="el-upload-list__item-thumbnail"
             controls="true"
             autoplay="false"
             loop="false"
             muted="muted"
             style="width:100%;">
        <source :src="videoSrc">
      </video> -->
      <video
        class="el-upload-list__item-thumbnail"
        controls="true"
        autoplay="false"
        loop="false"
        muted="muted"
        style="width: 100%"
      >
        <source :src="videoSrc" />
      </video>
    </a-modal>
  </div>
</template>
<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      list: [
        {
          Name: "",
          Value: [{ title: "", type: "", content: "", flag: true }],
        },
      ],

      configForm: {
        process: [],
      },
      activeKey: "0",
      columns: [
        {
          title: "标题",
          dataIndex: "title",
          width: 200,
          scopedSlots: { customRender: "slot-title" },
        },
        {
          title: "类型",
          dataIndex: "type",
          width: 200,
          scopedSlots: { customRender: "type" },
        },
        {
          title: "内容",
          dataIndex: "detail",
          scopedSlots: { customRender: "value" },
        },
        {
          title: "操作",
          dataIndex: "action",
          width: 100,
          scopedSlots: { customRender: "action" },
        },
      ],
      // 预览相关
      previewVisible: false,
      previewType: "图片",
      previewSrc: "",
      record: {},

      videoVisible:false,
      videoSrc:""
    };
  },
  computed: {
    ...mapGetters({
      traceDetailInfo: "config/traceDetailInfo",
    }),
  },
  created() {
    console.log("this.$route.query", this.$route.query);
    this.record = this.$route.query;
    this.getTraceDetail({
      company_id: this.$store.getters.company_id,
      board_name: this.record.board_name,
      product_name: this.record.product_name,
    }).then((res) => {
      console.log("detail success", this.traceDetailInfo);
      this.configForm.process = this.traceDetailInfo;
    });
  },
  methods: {
    ...mapActions({
      getTraceDetail: "config/getTraceDetail",
    }),
    // 新增环节
    handleAddSegment() {
      let obj = {
        process_name: "新增环节",
        // preName: "新增环节",
        content: [
          {
            id: 1,
            title: "",
            type: "文本",
            detail: "",
            new: true,
            // link: false,
            // url: ""
          },
        ],
      };
      this.configForm.process.push(obj);
      this.activeKey = (this.configForm.process.length - 1).toString();
    },
    // 保存环节
    handleSave() {
      // this.activeKey = (index+1).toString();
      let list = this.$refs.configForm; //验证列表
      let count = 0;
      list.forEach((item) => {
        item.validate((valid) => {
          if (valid) {
            count++;
          }
        });
      });
      console.log("configForm", this.configForm);
      if (count == list.length) {
        //验证通过，掉接口
        console.log("success submit!");
        // let list=this.configForm.process;
        let listStr = JSON.stringify(this.configForm);
        let list = JSON.parse(listStr);
        console.log(list);
        this.formatData(list).then((list) => {
          if (!list) {
                return;
              }
          this.addTemplateApi({
            company_id: this.$store.getters.company_id,
            board_name: this.record.board_name,
            product_name: this.record.product_name,
            ...list,
          });
        });
      } else {
        console.log("error submit!");
      }
    },
    formatData(list) {
      return new Promise((resolve, reject) => {
        list.process.forEach((item) => {
          if (item.content && item.content.length != 0) {
            item.content.map((e, i) => {
              if (e.type != "文本") {
                if (Array.isArray(e.detail)) {
                  let a = "";
                  let len = e.detail.length;
                  e.detail.map((item, index)=> {
                    if (item.status == "uploading") {
                      this.$message.warning("文件正在上传中，请稍后");
                      return resolve(false);
                    }
                    if (index == 0) {
                      a = a + "[";
                    }
                    a = a + item.url;
                    if (index >= 0 && index < len - 1) {
                      a = a + ",";
                    }
                    if (index == len - 1) {
                      a = a + "]";
                    }
                  });
                  e.detail = a;
                } else {
                  e.detail = "";
                }

                //e.detail=JSON.parse(e.detail);
                // e.detail = eval(e.detail);
              }
              if (e.new) {
                delete e.id;
                delete e.new;
              }
            });
          }
        });
        resolve(list);
      });
    },
    // 删除环节
    DeleteSegment(order) {
      this.configForm.process.splice(order, 1);
    },
    // 新增一行新的信息
    handleAddInfo(order) {
      let len = this.configForm.process[order].content.length;
      this.configForm.process[order].content.push({
        id: len + 1,
        title: "",
        type: "文本",
        detail: "",
        new: true,
        // link: false,
        // url: "",
      });
    },
    handleDelete(order, index) {
      this.configForm.process[order].content.splice(index, 1);
    },

    // 控制类型选择器
    handleSelect(order, text, index) {
      console.log(this.configForm.process[order].content[index].type);
      this.configForm.process[order].content[index].type = text;
      if (text != "文本") {
        this.configForm.process[order].content[index].detail = [];
      } else {
        this.configForm.process[order].content[index].detail = "";
      }
    },
    // 控制链接展示与否
    // handleLink(order, record, index) {
    //   this.configForm.process[order].content.forEach((e, i) => {
    //     if (i == index) {
    //       this.configForm.process[order].content[i].link = !record.link;
    //     }
    //   });
    // },
    // 图片上传拦截
    customIRequest(data) {
      let file = data.file;
      if (
        file.type != "image/png" &&
        file.type != "image/jpeg" &&
        file.type != "image/jpg"
      ) {
        this.$message.error("文件格式不支持");
        return;
      } else if (file.size / 1048576 > 5) {
        this.$message.error("文件不能大于5MB");
        return;
      } else {
        this.uploadFile(data.data, file);
      }
    },
    // 视频上传拦截
    customVRequest(data) {
      let file = data.file;
      console.log("--视频类型", file.type);
      if (
        file.type != "video/mp4"
        // && file.type != "image/jpeg" &&
        // file.type != "image/jpg"
      ) {
        this.$message.error("文件格式不支持");
        return;
      } else if (file.size / 1048576 > 8) {
        this.$message.error("文件不能大于8MB");
        return;
      } else {
        this.uploadFile(data.data, file);
      }
    },
    // 文件上传参数处理
    uploadFile(params, file) {
      console.log("file", file);
      const formData = new FormData();
      let currentSegment = this.configForm.process[params.order];
      formData.append("upload", file);
      let col = currentSegment.content[params.current].detail.length;
      let obj = {
        uid: file.uid,
        name: file.name,
        status: "uploading",
        order: params.order,
        row: params.current,
        col: col,
        type: file.type,
      };
      currentSegment.content[params.current].detail.push(obj);
      let len = currentSegment.content[params.current].detail.length;
      this.saveData(formData)
        .then((res) => {
          currentSegment.content[params.current].detail[len - 1].status =
            "done";
          currentSegment.content[params.current].detail[len - 1].uid = len;
          currentSegment.content[params.current].detail[len - 1].url = res.data;
        })
        .catch((err) => {
          currentSegment.content[params.current].detail.splice(len - 1, 1);
        });
    },
    // 文件上传请求
    saveData(data) {
      return new Promise((resolve, reject) => {
        axios
          .post("http://139.159.146.109:9530/v1/file/upload", data)
          .then((res) => {
            if (res.status == 200 && res.data.errCode == 0) {
              resolve(res.data);
            } else {
              this.$message.error("文件上传失败");
              reject(false);
            }
          })
          .catch((err) => {
            this.$message.error("文件上传失败");
            reject(false);
          });
      });
    },
    // 文件预览
    async handlePreview(file) {
      console.log("file", file);
      this.previewSrc = file.url;
      this.previewType = file.type;
      this.previewVisible = true;
    },
    async handlePreviewVideo (file) {
      this.videoSrc = file.url;
      this.videoVisible = true;
    },
    // 移除文件
    handleRemove(file) {
      return new Promise((resolve) => {
        this.configForm.process[file.order].content[file.row].detail.splice(
          file.col,
          1
        );
        return resolve(true);
      });
    },

    //添加模板api
    addTemplateApi(data) {
      this.$http(
        "/sass/template/update",
        "POST",
        data,
        {},
        (res) => {
          this.$message.success("模板编辑成功");
          this.$router.push("/config/track");
        },
        (err) => {
          this.$message.error("模板编辑失败");
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.trace-template {
  /deep/ .ant-upload-list-picture-card-container {
    width: 78px !important;
    height: 78px !important;
    .ant-upload-list-item {
      width: 78px !important;
      height: 78px !important;
    }
  }
  /deep/ .ant-upload-picture-card-wrapper {
    display: flex;
  }
  /deep/ .ant-upload-select {
    width: 78px !important;
    height: 78px !important;
  }
  /deep/ .ant-collapse {
    .ant-collapse-item-active {
      .ant-collapse-header {
        border-bottom: 1px solid #d9d9d9;
      }
    }
    .ant-collapse-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ant-collapse-content {
      background: #fff !important;
    }
  }
}
</style>