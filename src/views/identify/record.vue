<template>
  <div class="record">
    <a-card style="width: 100%" :bordered="false" class="animate__animated animate__zoomIn">
      <a-form-model layout="inline" :model="queryData" ref="queryData">
        <a-form-model-item label="商品名称：" prop="product_name">
          <a-input
            v-model="queryData.product_name"
            placeholder="请输入"
            style="width: 250px"
          ></a-input>
        </a-form-model-item>
        <a-form-model-item
          label="批次号："
          style="margin-left: 20px"
          prop="batch_number"
        >
        <a-input
            v-model="queryData.batch_number"
            placeholder="请输入"
            style="width: 250px"
          ></a-input>
        </a-form-model-item>
      </a-form-model>
      <div class="btn-group">
        <a-button @click="handleReset"> 重置 </a-button>
        <a-button type="primary" @click="handleSearch"> 查询 </a-button>
      </div>
    </a-card>
    <div class="def-card animate__animated animate__zoomIn" style="margin-top:16px;">
      <div class="def-card-header">
        <p class="def-card-title">已生成码列表</p>
      </div>
      <a-table
        :row-key="(record) => record.id"
        :columns="columns"
        :loading="loading"
        :data-source="tableData"
        :pagination="false"
      >
        <template #created-at="created_at">
          {{ created_at | filterDate }}
        </template>
        <div
          slot="name"
          slot-scope="text, record, index"
          class="td-flex"
          style="width: 100px"
        >
          <span style="width: 100px" class="def-ellipsis" :title="text"
            >{{ text }}
          </span>
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ record.name_isCopy ? "复制成功" : "复制" }}</span>
            </template>
            <a-icon
              title="复制"
              :type="!record.name_isCopy ? 'copy' : 'check'"
              :style="
                !record.name_isCopy
                  ? 'cursor:pointer;color:#1890FF;'
                  : 'cursor:pointer;color:#67C23A;'
              "
              @click="clickNameCopy(text, index)"
            />
          </a-tooltip>
        </div>
        <div
          slot="batch"
          slot-scope="text, record, index"
          class="td-flex"
          style="width: 100px"
        >
          <span style="width: 100px" class="def-ellipsis" :title="text"
            >{{ text }}
          </span>
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ record.no_isCopy ? "复制成功" : "复制" }}</span>
            </template>
            <a-icon
              title="复制"
              :type="!record.no_isCopy ? 'copy' : 'check'"
              :style="
                !record.no_isCopy
                  ? 'cursor:pointer;color:#1890FF;'
                  : 'cursor:pointer;color:#67C23A;'
              "
              @click="clickNameCopy(text, index)"
            />
          </a-tooltip>
        </div>
        <span slot="status" slot-scope="status">
          {{ status == 0 ? "未启用" : "已启用" }}
        </span>

        <template slot="operation" slot-scope="record">
          <!-- <a-popconfirm
          title="确定导出吗?"
          @confirm="() => exportQRCode(record)"
        >
          <a href="javascript:;">导出码包</a>
        </a-popconfirm> -->
          <a href="javascript:;" @click="exportQRCode(record)">导出码包</a
          >&nbsp;
          <a href="javascript:;" @click="changeStatus(record)">{{
            record.status === 0 ? "启用" : "关闭"
          }}</a>
        </template>
      </a-table>
      <a-pagination
        :total="total"
        :show-total="
          (total, range) => `第 ${range[0]}-${range[1]} 条 / 总共 ${total} 条`
        "
        :pageSizeOptions="pageSizeOptions"
        :defaultCurrent="pageNumber"
        :defaultPageSize="pageSize"
        show-size-changer
        @change="handleCurrentChange"
        @showSizeChange="handleSizeChange"
      />
    </div>
  </div>
</template>
<script>
import FileSaver from "file-saver";
import XLSX from "xlsx";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      queryData: {
        product_name: "",
        batch_number: "",
      },
      columns: [
        // {
        // title: '序号',
        // render:(text,record,index)=>`${index+1}`
        // },
        {
          title: "序号",
          dataIndex: "index",
          key: "index",
          align: "center",
          width: 90,
          customRender: (text, record, index) => `${index + 1}`,
        },
        {
          title: "商品名称",
          dataIndex: "product_name",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "批次号",
          dataIndex: "batch_number",
          // ellipsis: true,
          scopedSlots: { customRender: "batch" },
        },

        {
          title: "商品数量",
          dataIndex: "quantity",
        },
        {
          title: "生码数量",
          dataIndex: "code_quantity",
        },
        {
          title: "码状态",
          dataIndex: "status",
          scopedSlots: { customRender: "status" },
        },
        {
          title: "生成时间",
          dataIndex: "created_at",
          ellipsis: true,
          width:200,
          scopedSlots: { customRender: "created-at" },
          // render: filterDate,
        },
        {
          title: "操作",
          // dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
      tableData: [],
      loading: false,
      pageNumber: 1,
      pageSize: 10,
      total: 0,
      pageSizeOptions: ["10", "20", "50", "100"],
    };
  },
  computed: {
    ...mapGetters({
      QRRecordInfo: "record/QRRecordInfo",
      batchList: "record/batchList",
    }),
    query() {
      let q = {
        count: this.pageSize,
        page: this.pageNumber,
      };
      if (this.queryData.product_name != "") {
        q.product_name = this.queryData.product_name;
      }
      if (this.queryData.batch_number != "") {
        q.batch_number = this.queryData.batch_number;
      }
      return q;
    },
  },
  created() {
    this.getrecordList(); //获取记录列表
    // this.getBatchList({
    //   company_id:this.$store.getters.company_id
    // }); //获取批次列表
  },
  methods: {
    ...mapActions({
      getQRRecordList: "record/getQRRecordList",
      getBatchList: "record/getBatchList",
    }),
    handleSearch() {
      console.log("查询");
      this.getrecordList();
    },
    handleReset() {
      this.$refs.queryData.resetFields();
      console.log("this.queryData", this.queryData);
      // this.queryData = {
      //   batch_number: "",
      //   product_name: "",
      // };
      this.getrecordList();
    },
    handleSizeChange(current, pageSize) {
      console.log("current, pageSize", current, pageSize);
      this.pageNumber = 1;
      this.pageSize = pageSize;
      this.getrecordList();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getrecordList();
    },
    clickNameCopy(val, index) {
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
    //导出码包
    exportQRCode(record) {
      let obj = {
        batch_number: record.batch_number,
        company_id: this.$store.getters.company_id,
      };
      this.exportQRCodeApi(obj);
    },
    changeStatus(item) {
      if (item.status == 0) {
        let obj = {
          batch_number: item.batch_number,
          company_id: this.$store.getters.company_id,
          status: 1,
        };
        this.switchStatus(obj);
      } else if (item.status == 1) {
        //弹框
        this.$confirm({
          title: "提示",
          content: "关闭该批次码包后，该批次所有码信息将失效！您是否确认关闭？",
          okText: "确定",
          okType: "danger",
          cancelText: "取消",
          onOk: () => {
            let obj = {
              batch_number: item.batch_number,
              company_id: this.$store.getters.company_id,
              status: 0,
            };
            this.switchStatus(obj);
          },
          onCancel() {
            console.log("Cancel");
          },
        });
      }
    },

    // 获取生码记录列表
    getrecordList() {
      this.loading = true;
      this.getQRRecordList({
        company_id: this.$store.getters.company_id,
        ...this.query,
      }).then((res) => {
        this.loading = false;
        this.tableData = this.QRRecordInfo.list;
        this.total = this.QRRecordInfo.total;
      });
    },
    // 导出码包
    exportQRCodeApi(data) {
      this.$http(
        "/sass/qrcode/export",
        "GET",
        data,
        {},
        (res) => {
          this.exportQRExcel(res.payload || [],data.batch_number);
        },
        (err) => {
          this.$message.error("操作失败");
        }
      );
    },
    //启用与停用
    switchStatus(data) {
      this.$http(
        "/sass/qrcode/enable",
        "GET",
        data,
        {},
        (res) => {
          this.$message.success("操作成功");
          this.getrecordList();
        },
        (err) => {
          this.$message.error("操作失败");
        }
      );
    },
    exportQRExcel(resList,batch_number) {
      let data = [["商品名称", "生产批次", "二维码", "验证码"]];
      resList.forEach((item, index) => {
        let perArray = [];
        for (const key in item) {
          if (Object.hasOwnProperty.call(item, key)) {
            const element = item[key];
            if (key == "product_name") {
              perArray[0] = element;
            } else if (key == "batch_number") {
              perArray[1] = element;
            } else if (key == "qr_code") {
              // perArray[2] = element;
              perArray[2] ="http://saas.peerfintech.cn?code="+element+"&batch="+item["batch_number"];

            } else if (key == "v_code") {
              perArray[3] = element;
            }
          }
        }
        data.push(perArray);
      });

      var worksheet = XLSX.utils.aoa_to_sheet(data);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, worksheet, "Sheet1");

      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array",
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          batch_number+"码包.xlsx"
        );
      } catch (e) {
        console.log(e, wbout);
      }
      return wbout;
    },
  },
};
</script>
<style lang="less" scoped>
.record {
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
</style>