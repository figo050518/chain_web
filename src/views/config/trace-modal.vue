<template>
  <div class="trace-modal">
    <a-card class="animate__animated animate__zoomIn" style="width: 100%"
            :bordered="false">
      <a-form-model layout="inline"
                    :model="queryData"
                    ref="queryData">
        <a-form-model-item label="模板名称：">
          <a-input v-model="queryData.board_name"
                   placeholder="请输入"
                   style="width: 250px"></a-input>
        </a-form-model-item>
        <a-form-model-item label="创建时间："
                           style="margin-left: 20px">
          <a-range-picker @change="onTimeChange">
            <a-icon slot="suffixIcon"
                    type="calendar" />
          </a-range-picker>
        </a-form-model-item>
      </a-form-model>
      <div class="btn-group">
        <a-button @click="handleReset"> 重置 </a-button>
        <a-button type="primary"
                  @click="handleSearch"> 查询 </a-button>
      </div>
    </a-card>

    <div class="def-card animate__animated animate__zoomIn"
         style="margin-top: 16px">
      <div class="def-card-header">
        <p class="def-card-title">模板列表</p>
        <a-button slot="extra"
                  type="primary"
                  @click="addTemplate">新建模板</a-button>
      </div>
      <a-table :row-key="(record, index) => index"
               :columns="columns"
               :loading="loading"
               :data-source="tableData"
               :pagination="false">
        <template #created-at="created_at">
          {{ created_at | filterDate }}
        </template>
        <div slot="productName"
             slot-scope="text, record, index"
             class="td-flex"
             style="width: 90px">
          <span style="width: 90px"
                class="def-ellipsis"
                :title="text">{{ text }}
          </span>
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ record.name_isCopy ? "复制成功" : "复制" }}</span>
            </template>
            <a-icon title="复制"
                    :type="!record.name_isCopy ? 'copy' : 'check'"
                    :style="
                !record.name_isCopy
                  ? 'cursor:pointer;color:#1890FF;'
                  : 'cursor:pointer;color:#67C23A;'
              "
                    @click="clickNameCopy(text, index)" />
          </a-tooltip>
        </div>

        <template slot="operation"
                  slot-scope="record">
          <a href="javascript:;"
             @click="detail(record)">详情</a>&nbsp;
          <a href="javascript:;"
             @click="edit(record)">编辑</a>&nbsp;
          <a href="javascript:;"
             @click="deleteTemp(record)">删除</a>
        </template>
      </a-table>
      <a-pagination :total="total"
                    :show-total="
          (total, range) => `第 ${range[0]}-${range[1]} 条 / 总共 ${total} 条`
        "
                    :pageSizeOptions="pageSizeOptions"
                    :defaultCurrent="pageNumber"
                    :defaultPageSize="pageSize"
                    show-size-changer
                    @change="handleCurrentChange"
                    @showSizeChange="handleSizeChange" />
    </div>
    <a-modal v-model="visible"
             width="520px"
             title="新建溯源模板"
             @ok="handleOk"
             @cancel="handleCancel"
             :maskClosable="false">
      <a-form-model :model="templateForm"
                    ref="templateForm"
                    :rules="rules"
                    layout="vertical">
        <a-form-model-item label="模板名称"
                           prop="board_name">
          <a-input v-model="templateForm.board_name" />
        </a-form-model-item>
        <a-form-model-item label="选择商品"
                           prop="product_name">
          <a-select v-model="templateForm.product_name">
            <a-select-option v-for="(item, index) in productList"
                             :key="index"
                             :value="item.product_name">{{ item.product_name }}</a-select-option>
            <!-- <a-select-option value=""> 商品1 </a-select-option>
            <a-select-option value="lucy"> 商品2 </a-select-option> -->
          </a-select>
        </a-form-model-item>
      </a-form-model>
    </a-modal>

    <a-drawer title="溯源信息详情"
              placement="right"
              class="trace-detail"
              :closable="true"
              width="540"
              :visible="drawerVisible"
              @close="onClose">
      <div v-if="configForm.segmentList.length == 0">
        <a-list :data-source="[]" />
      </div>
      <div v-else>
        <a-timeline>
          <a-timeline-item v-for="(item, order) in configForm.segmentList"
                           :key="order">
            <p class="big-title">{{ item.process_name }}</p>
            <div v-for="(it, index) in item.content"
                 :key="index">
              <p class="title">{{ it.title }}：</p>
              <p v-if="it.type == '文本'"
                 style="color: rgba(0, 0, 0, 0.65)">
                {{ it.detail }}
              </p>
              <p v-else-if="it.type == '图片'">
                <img v-for="(image, i) in it.detail"
                     class="per-image"
                     :key="i"
                     :src="image.url"
                     alt="" />
              </p>
              <p v-else-if="it.type == '视频'">
                <video v-for="(video, i) in it.detail"
                       :key="i"
                       :src="video.url"
                       width="200"
                       height="100"
                       autoplay="true"
                       controls="controls">
                  您的浏览器不支持 video 标签。
                </video>

              </p>
            </div>
          </a-timeline-item>
        </a-timeline>
      </div>
    </a-drawer>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data () {
    return {
      queryData: {
        board_name: "",
        time: [],
      },
      columns: [
        {
          title: "模板名称",
          dataIndex: "board_name",
        },
        {
          title: "创建时间",
          dataIndex: "created_at",
          scopedSlots: { customRender: "created-at" },
        },
        {
          title: "商品名称",
          dataIndex: "product_name",
          scopedSlots: { customRender: "productName" },
        },
        {
          title: "创建人",
          dataIndex: "createPerson",
        },
        {
          title: "操作",
          // dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      tableData: [],
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ["10", "20", "50", "100"],
      loading: false,
      visible: false,
      templateForm: {
        board_name: "",
        product_name: "",
      },
      rules: {
        board_name: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
        ],
        product_name: [
          {
            required: true,
            message: "请选择商品",
            trigger: ["blur", "change"],
          },
        ],
      },
      drawerVisible: false,
      configForm: {
        segmentList: [],
      },
    };
  },
  created () {
    this.getModelList();
    this.getProductList({
      company_id: this.$store.getters.company_id,
    }); //商品下拉框
  },
  computed: {
    ...mapGetters({
      traceTempInfo: "config/traceTempInfo",
      traceDetailInfo: "config/traceDetailInfo",
      productList: "config/productList",
    }),
    query () {
      let q = {
        count: this.pageSize,
        page: this.pageNumber,
      };
      if (this.queryData.board_name != "") {
        q.board_name = this.queryData.board_name;
      }
      if (this.queryData.time.length !== 0 && this.queryData.time[0]!="" && this.queryData.time[1]!="") {
        console.log("time", this.queryData.time);
        q.start_time = new Date(this.queryData.time[0]).valueOf();
        q.stop_time =
          new Date(this.queryData.time[1]).valueOf() + 24 * 60 * 60 * 1000 - 1;
      }
      return q;
    },
  },
  methods: {
    ...mapActions({
      getTraceTempList: "config/getTraceTempList",
      getTraceDetail: "config/getTraceDetail",
      getProductList: "config/getProductList",
    }),
    handleSearch () {
      this.getModelList();
    },
    handleReset () {
      // this.$refs.queryData.resetFields();
      this.queryData = {
        board_name: "",
        time: [],
      };
      this.getModelList();
    },
    handleSizeChange (current, pageSize) {
      console.log("current, pageSize", current, pageSize);
      this.pageNumber = 1;
      this.pageSize = pageSize;
      this.getModelList();
    },
    handleCurrentChange (val) {
      this.pageNumber = val;
      this.getModelList();
    },
    onTimeChange (value, dateString) {
      console.log("选中时间", value, dateString, this.queryData.time);
      this.queryData.time = dateString;
    },

    clickNameCopy (val, index) {
      let _this = this;
      this.$copyText(val).then(
        function (e) {
          _this.$message.success("复制成功");
        },
        function (e) {
          _this.$message.error("复制失败");
        }
      );
    },
    addTemplate () {
      this.visible = true;
    },
    handleOk (e) {
      //新建溯源模板
      console.log(e);
      console.log("this.templateForm", this.templateForm);
      this.$refs.templateForm.validate((valid) => {
        if (valid) {
          console.log("success submit!");
          console.log(
            "this.$store.getters.company_id",
            typeof this.$store.getters.company_id
          );
          this.addTemplateApi({
            company_id: this.$store.getters.company_id,
            process: [],
            ...this.templateForm,
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel (e) {
      this.$refs.templateForm.resetFields();
      this.visible = false;
    },
    detail (record) {
      this.getTraceDetail({
        company_id: this.$store.getters.company_id,
        board_name: record.board_name,
        product_name: record.product_name,
      }).then((res) => {
        console.log("detail success")
        this.configForm.segmentList = this.traceDetailInfo;
        this.drawerVisible = true;
      });
    },
    edit (record) {
      // 配置溯源模板
      this.$store.dispatch("ToggleCrumb", ["溯源模板管理", "配置溯源模板"]);
      this.$router.push({
        path: "/trace-template",
        query: record,
      });
    },
    //删除溯源模板
    deleteTemp (record) {
      console.log("删除", record);
      this.$confirm({
        title: "提示",
        content: "确定删除该溯源模板吗？",
        okText: "确定",
        okType: "danger",
        cancelText: "取消",
        onOk: () => {
          this.deleteTempApi({
            board_name: record.board_name,
            product_name: record.product_name,
            company_id: this.$store.getters.company_id,
          });
        },
        onCancel () { },
      });
    },
    onClose: function () {
      this.drawerVisible = false;
    },

    // 获取模板列表
    getModelList () {
      this.loading = true;
      this.getTraceTempList({
        company_id: this.$store.getters.company_id,
        ...this.query,
      }).then((res) => {
        this.loading = false;
        this.tableData = this.traceTempInfo.list;
        this.total = this.traceTempInfo.total;
      });
    },
    //添加模板api
    addTemplateApi (data) {
      this.$http(
        "/sass/template/input",
        "POST",
        data,
        {},
        (res) => {
          this.$message.success("模板添加成功");
          //更新列表
          this.getModelList();
          this.visible = false;
        },
        (err) => {
          this.$message.error("模板添加失败");
        }
      );
    },
    //删除模板api
    deleteTempApi (data) {
      this.$http(
        "/sass/template/delete",
        "GET",
        data,
        {},
        (res) => {
          this.$message.success("模板删除成功！");
          this.getModelList();
        },
        (err) => {
          this.$message.error("模板删除失败！");
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.trace-modal {
  .btn-group {
    margin-top: -38px;
    float: right;
    .ant-btn {
      margin: 0 5px;
    }
  }
  .ant-pagination {
    text-align: right;
    margin: 16px auto;
  }
  .td-flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .def-ellipsis {
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.trace-detail {
  .big-title {
    height: 22px;
    margin-bottom: 12px;
    color: #000;
    font-size: 18px;
    line-height: 22px;
  }
  .title {
    margin-bottom: 8px;
    color: #000;
    font-size: 16px;
    font-family: PingFangSC-Regular;
    line-height: 24px;
    opacity: 0.9;
  }

  .per-image {
    display: inline-block;
    width: 100px;
    height: 100px;
    margin: 8px 8px 0 0;
    background-color: #f5f5f5;
  }
}
</style>
