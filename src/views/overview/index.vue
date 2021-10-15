<template>
  <div class="overview" ref="overview">
    <div class="overview-left animate__animated animate__zoomIn">
      <div class="left-top chain-info">
        <div class="company-info">
          <p class="ellipsis">
            <span class="key" v-if="curStatus == 2">企业名称：</span>
            <!-- <span >江苏众享金联科技有限公司</span> -->
            <a-tooltip v-if="curStatus == 2">
              <template slot="title"> {{ curCompanyName }} </template>
              {{ curCompanyName }}
            </a-tooltip>
            <span v-else
              >{{ statusTxt }}
              <span
                v-if="curStatus == 0 || curStatus == 3"
                style="color: #1890ff; cursor: pointer"
                @click="toAuthen"
              >
                | 去认证</span
              ></span
            >
          </p>
          <p class="key" v-if="curStatus == 2">
            开通时间：{{ open_time | filterDate }}
          </p>
        </div>
        <div class="overview-info">
          <div>
            <p class="key">区块高度</p>
            <p class="value">{{ blockInfo.block_height }}</p>
          </div>
          <div>
            <p class="key">节点数</p>
            <p class="value">{{ blockInfo.node }}</p>
          </div>
          <div>
            <p class="key">商品数量</p>
            <p class="value">{{ productTotal }}</p>
          </div>
          <div>
            <p class="key">上链标识数量</p>
            <p class="value">{{ identifyInfo }}</p>
          </div>
        </div>
      </div>
      <div class="left-bottom">
        <div class="china-map">
          <p class="title">客群分布</p>
          <div class="query-select">
            <a-select
              default-value="安化黑茶"
              class="select-one"
              @change="selectBatch"
              v-model="queryData.product_name"
              placeholder="请选择商品"
              allowClear
            >
              <a-select-option
                v-for="(item, index) in productList"
                :key="index"
                :value="item.product_name"
                >{{ item.product_name }}</a-select-option
              >
            </a-select>
            <a-range-picker
              class="select-two"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD 00:00:00"
              @change="onTimeChange"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
            <!-- <a-range-picker class="select-two" @change="onTimeChange">
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker> -->
          </div>
          <div
            ref="map"
            style="width: 100%; height: 80%; margin-top: 10px"
          ></div>
        </div>
        <div class="scan-statistic">
          <p class="title">扫码统计</p>
          <div class="query-select">
            <a-select
              default-value="安化黑茶"
              class="select-one"
              @change="selectBatch1"
              v-model="queryData1.product_name"
              placeholder="请选择商品"
              allowClear
            >
              <a-select-option
                v-for="(item, index) in productList"
                :key="index"
                :value="item.product_name"
                >{{ item.product_name }}</a-select-option
              >
            </a-select>
            <a-range-picker
              class="select-two"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD 00:00:00"
              @change="onTimeChange1"
            >
              <a-icon slot="suffixIcon" type="calendar" />
            </a-range-picker>
            <!-- <a-range-picker class="select-two"
                            @change="onTimeChange1">
              <a-icon slot="suffixIcon"
                      type="calendar" />
            </a-range-picker> -->
          </div>
          <div
            ref="query"
            style="width: 100%; height: 80%; margin-top: 10px"
          ></div>
        </div>
      </div>
    </div>
    <div class="overview-right animate__animated animate__zoomIn">
      <div class="right-top">
        <p class="title">商品数量占比</p>
        <div
          ref="soldTotal"
          style="width: 100%; height: 250px; margin-top: 10px"
        ></div>
      </div>
      <div class="right-bottom">
        <p class="title">商品数量统计(TOP5)</p>
        <div
          ref="company"
          style="width: 100%; height: 250px; margin-top: 10px"
        ></div>
      </div>
    </div>
    <a-modal
      v-model="visible"
      width="520px"
      title="企业认证"
      @ok="handleOk"
      @cancel="handleCancel"
      :maskClosable="false"
    >
      <a-form-model
        :model="companyForm"
        ref="companyForm"
        :rules="rules"
        layout="vertical"
      >
        <a-form-model-item label="企业名称" prop="company_name">
          <a-input v-model="companyForm.company_name" />
        </a-form-model-item>
        <a-form-model-item label="统一社会信用代码" prop="credit_code">
          <a-input v-model="companyForm.credit_code" />
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="phone_num">
          <a-input v-model="companyForm.phone_num" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts/map/js/china";
import { watchSizeChange, unwatchSizeChange } from "@/utils/dom.js";
import { mapActions, mapGetters } from "vuex";
import { geoCoordMap } from "./china";
import moment from "moment";
export default {
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写联系电话"));
      } else {
        let regPhone = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
        // let regPhone = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
        if (!regPhone.test(value)) {
          callback(new Error("号码格式不正确!"));
        } else {
          callback();
        }
      }
    };
    return {
      open_time: "", //开通时间
      queryData: {
        product_name: undefined,
        time: [],
      },
      queryData1: {
        product_name: undefined,
        time: [],
      },

      companyForm: {
        company_name: "",
        credit_code: "",
        phone_num: "",
      },
      rules: {
        company_name: [
          { required: true, message: "企业名称必填", trigger: "blur" },
        ],
        credit_code: [
          { required: true, message: "统一社会信用代码必填", trigger: "blur" },
        ],
        phone_num: [{ required: true, validator: checkPhone, trigger: "blur" }],
      },
      mapChart: null,
      scanChart: null,
      rateChart: null,
      topChart: null,
      mapData: [],
      topMapData: [],

      scanLegend: [],
      scanData: [],

      rateLegend: [],
      rateData: [],

      totalTopLegend: [],
      totalTopData: [],
      // authentication: false, //认证状态
      visible: false,
      statusTxt: "",
      productTotal: 0,
      curStatus: 0,
      curCompanyName: "",
      baseNum: 1,
    };
  },
  computed: {
    ...mapGetters({
      status: "status",
      user_id: "user_id",
      scanDataQuery: "overview/scanDataQuery",
      spreadDataQuery: "overview/spreadDataQuery",
      productList: "config/productList",
      productNum: "overview/productNum",
      blockInfo: "overview/blockInfo",
      identifyInfo: "overview/identifyInfo",
    }),
    spreadQuery() {
      let q = {};
      if (this.queryData.product_name != "") {
        q.product_name = this.queryData.product_name;
      }
      if (this.queryData.time.length !== 0) {
        q.start_date = new Date(this.queryData.time[0]).valueOf();
        q.stop_date =
          // new Date(this.queryData.time[1]).valueOf()
          new Date(this.queryData.time[1]).valueOf() + 24 * 60 * 60 * 1000 - 1;
      }
      return q;
    },
    scanQuery() {
      let q = {};
      if (this.queryData1.product_name != "") {
        q.product_name = this.queryData1.product_name;
      }
      if (this.queryData1.time.length !== 0) {
        q.start_date = new Date(this.queryData1.time[0]).valueOf();
        q.stop_date =
          // new Date(this.queryData1.time[1]).valueOf()
          new Date(this.queryData1.time[1]).valueOf() + 24 * 60 * 60 * 1000 - 1;
      }
      return q;
    },
  },

  mounted() {
    this.curStatus = this.status;
    this.ToggleCrumbShow(false); //显示蓝色banner
    this.fetchCompanySatus(); //企业状态
    this.formatStatus(this.curStatus); //状态名

    this.getProductList({ company_id: this.$store.getters.company_id }).then(
      (res) => {
        if(this.productList.length!=0){
          this.queryData.product_name = this.productList[0].product_name;
          this.queryData1.product_name = this.productList[0].product_name;
        }
        this.selectBatch(this.queryData.product_name); //默认选中商品,并渲染图表
        this.selectBatch1(this.queryData1.product_name); //默认选中商品,并渲染图表
      }
    ); //商品下拉框

    // this.getScanChartsDataFun(); //扫码统计
    // this.getSpreadChartsDataFun(); //扫码分布
    this.getProducChartsDataFun(); //商品统计

    this.getBlockData(); //节点数、区块高度
    this.getIdentifyData({
      company_id: this.$store.getters.company_id,
    }); //标识数

    this.resizeEcharts();
  },
  methods: {
    moment,
    disabledDate(current) {
      return current && current >= moment().endOf("day");
    },

    ...mapActions({
      ToggleCrumbShow: "ToggleCrumbShow",
      getScanChartsData: "overview/getScanChartsData",
      getSpreadChartsData: "overview/getSpreadChartsData",
      getProductList: "config/getProductList",
      getProductNum: "overview/getProductNum",

      getBlockData: "overview/getBlockData",
      getIdentifyData: "overview/getIdentifyData",
    }),
    resizeEcharts() {
      watchSizeChange(this.$refs["overview"], () => {
        this.$nextTick(() => {
          this.scanChart && this.scanChart.resize();
          this.scanChart && this.rateChart.resize();
          this.topChart && this.topChart.resize();
          this.mapChart && this.mapChart.resize();
        });
      });
    },
    getMapCharts(data) {
      var convertData = function (data) {
        var res = [];
        for (var i = 0; i < data.length; i++) {
          let name = data[i].name; //江苏南京
          let value = data[i].value;
          for (const key in geoCoordMap) {
            if (Object.hasOwnProperty.call(geoCoordMap, key)) {
              const element = geoCoordMap[key];
              if (name.includes(key)) {
                var geoCoord = element;
                if (geoCoord) {
                  res.push({
                    name: key,
                    value: geoCoord.concat(value),
                  });
                }
              }
            }
          }

          // var geoCoord = geoCoordMap[name];
          // if (geoCoord) {
          //   res.push({
          //     name: data[i].name,
          //     value: geoCoord.concat(data[i].value),
          //   });
          // }
        }
        return res;
      };
      this.mapChart = echarts.init(this.$refs.map);
      this.mapChart.setOption({
        backgroundColor: "transparent",
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return params.name + " : " + params.value[2];
          },
        },
        color: "rgba(74, 224, 154, 0.3)",
        geo: {
          map: "china",
          zoom: 1.3,
          itemStyle: {
            areaColor: "#5C6679",
            borderColor: "#3C4355",
          },
          emphasis: {
            itemStyle: {
              areaColor: "#323c48",
            },
            label: {
              show: false,
            },
          },
        },
        series: [
          {
            name: "scan",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(this.mapData),
            symbolSize: 12,
            emphasis: {
              itemStyle: {
                borderColor: "#fff",
                borderWidth: 1,
              },
            },
          },
          {
            name: "scan",
            type: "effectScatter",
            coordinateSystem: "geo",
            data: convertData(this.topMapData),
            symbolSize: (val) => {
              return val[2] / this.baseNum;
            },
            showEffectOn: "render",
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: true,
              },
            },
            itemStyle: {
              normal: {
                color: "rgba(74, 224, 154, 0.3)",
                shadowBlur: 10,
                shadowColor: "rgba(74, 224, 154, 0.3)",
              },
            },
            zlevel: 1,
          },
        ],
      });
    },
    getScanCharts() {
      this.scanChart = echarts.init(this.$refs.query);
      this.scanChart.setOption({
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: this.scanLegend,
          axisLine: {
            show: true,
            lineStyle: {
              color: "#999",
              width: 1,
              type: "solid",
            },
          },
          axisLabel: {
            show: true,
            interval: "auto",
            textStyle: {
              color: "#999",
            },
          },
        },
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#999"],
              width: 1,
              type: "dotted",
            },
          },
        },
        series: [
          {
            data: this.scanData,
            type: "line",
            itemStyle: {
              normal: {
                color: "#4AE09A",
              },
            },
            symbolSize: 8,
          },
        ],
      });
    },
    getTotalRateCharts() {
      this.rateChart = echarts.init(this.$refs.soldTotal);
      let saleTotal = 0;
      this.rateData.forEach((e) => {
        saleTotal += e.value;
      });
      this.rateChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: function (params) {
            return params.name + " : " + params.value;
          },
        },

        legend: {
          orient: "horizontal",
          itemWidth: 10,
          itemHeight: 10,
          bottom: "5%",
          textStyle: {
            color: "#aaa",
          },
          data: this.rateLegend,
        },
        color: [
          "#1890FF",
          // "#4098FF",
          "#66C2FF",
          "#4AE09A",
        ],
        series: [
          {
            name: "商品数量(个)",
            type: "pie",
            radius: ["32%", "55%"],
            center: ["50%", "45%"],
            data: this.rateData,
            emphasis: {
              label: {
                show: true,
                // formatter: function (a) {
                //   let value = a.value
                //     .toString()
                //     .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
                //   let precent = ((a.value / saleTotal) * 100) + "%";
                //   return precent ;
                // },
              },
            },
            label: {
              normal: {
                show: true,
                formatter: function (a) {
                  console.log("饼图数a",a);
                  let value = a.value
                    .toString()
                    .replace(/(\d)(?=(?:\d{3})+$)/g, "$1,");
                  // let precent = (value / saleTotal) * 100 + "%";
                  let percent = a.percent + "%";
                  return percent;
                },
              },
            },
            labelLine: {
              normal: {
                length: 15,
                length2: 10,
              },
            },
            itemStyle: {
              emphasis: {
                shadowBlur: 8,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      });
    },
    getTotalTopCharts() {
      this.topChart = echarts.init(this.$refs.company);
      this.topChart.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        grid: {
          left: "2%",
          right: "4%",
          bottom: "1%",
          top: "8%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: this.totalTopLegend,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#999",
                width: 1,
                type: "solid",
              },
            },
            axisLabel: {
              show: true,
              interval: 0,
              textStyle: {
                color: "#999",
              },
              // formatter:function(value,index) {
              //   if (index % 2 != 0) {
              //     return '\n\n' + value;
              //   }else {
              //     return value;
              //   }
              // },

              formatter: function (value) {
                var ret = ""; //拼接加\n返回的类目项
                var maxLength = 3; //每项显示文字个数
                var valLength = value.length; //X轴类目项的文字个数
                var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数
                if (rowN > 1) {
                  //如果类目项的文字大于3,
                  for (var i = 0; i < rowN; i++) {
                    var temp = ""; //每次截取的字符串
                    var start = i * maxLength; //开始截取的位置
                    var end = start + maxLength; //结束截取的位置
                    //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                    temp = value.substring(start, end) + "\n";
                    ret += temp; //凭借最终的字符串
                  }
                  return ret;
                } else {
                  return value;
                }
              },
            },
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: true,
              lineStyle: {
                color: ["#999"],
                width: 1,
                type: "dotted",
              },
            },
            axisLabel: {
              show: true,
              interval: "auto",
              textStyle: {
                color: "#999",
              },
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: "#999",
                width: 1,
                type: "solid",
              },
            },
          },
        ],
        series: [
          {
            name: "数量",
            type: "bar",
            barWidth: "40%",
            data: this.totalTopData,
            itemStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "#1890FE",
                  },
                  {
                    offset: 1,
                    color: "#1890FF",
                  },
                ]),
              },
            },
            textStyle: {
              color: "#fff",
            },
          },
        ],
      });
    },
    onTimeChange(value, dateString) {
      if (!dateString[0] || !dateString[1]) {
        this.queryData.time = [];
      } else {
        this.queryData.time = dateString;
      }
      this.getSpreadChartsDataFun(); //扫码分布
    },
    onTimeChange1(value, dateString) {
      if (!dateString[0] || !dateString[1]) {
        this.queryData1.time = [];
      } else {
        this.queryData1.time = dateString;
      }
      this.getScanChartsDataFun();
    },
    selectBatch(value) {
      this.getSpreadChartsDataFun(); //扫码分布
    },
    selectBatch1(value) {
      this.getScanChartsDataFun();
    },
    toAuthen() {
      this.visible = true;
    },
    //认证企业信息
    handleOk(e) {
      this.$refs.companyForm.validate((valid) => {
        if (valid) {
          console.log("success submit!");
          //企业认证
          this.companyAuth(this.companyForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleCancel(e) {
      this.$refs.companyForm.resetFields();
      this.visible = false;
    },
    //企业认证
    companyAuth(data) {
      this.$http(
        "/sass/company/certification?user_id=" + this.user_id,
        "POST",
        data,
        {},
        (res) => {
          this.$store.dispatch("toggleCompanyId", res.payload);
          this.$message.success("认证发送成功");
          this.fetchCompanySatus(); //获取企业状态status
          this.visible = false;
        },
        (err) => {
          this.$message.error("认证失败");
        }
      );
    },
    formatStatus(val) {
      switch (val) {
        case 0:
          this.statusTxt = "未认证";
          break;
        case 1:
          this.statusTxt = "审核中";
          break;
        case 2:
          this.statusTxt = "已认证";
          break;
        case 3:
          this.statusTxt = "审核未通过";
          break;
        default:
          this.statusTxt = "无";
          break;
      }
    },
    //扫码统计数据获取
    getScanChartsDataFun() {
      this.scanLegend = [];
      this.scanData = [];
      this.getScanChartsData({
        company_id: this.$store.getters.company_id,
        ...this.scanQuery,
      }).then((res) => {
        if (this.scanDataQuery.length != 0) {
          this.scanDataQuery.forEach((item) => {
            this.scanLegend.push(item.date);
            this.scanData.push(item.num);
          });
        }
        this.getScanCharts(); //扫码统计
      });
    },
    //扫码分布数据获取
    getSpreadChartsDataFun() {
      this.topMapData = [];
      this.getSpreadChartsData({
        company_id: this.$store.getters.company_id,
        ...this.spreadQuery,
      }).then((res) => {
        this.baseNum = res / 48;
        if (this.spreadDataQuery.length != 0) {
          this.spreadDataQuery.forEach((item) => {
            this.topMapData.push({
              name: item.city,
              value: item.num,
            });
            // this.mapData.push
          });
        }
        this.getMapCharts();
      });
    },
    getProducChartsDataFun() {
      this.getProductNum({
        company_id: this.$store.getters.company_id,
      }).then((res) => {
        this.productTotal = res.payload.product_count;

        if (this.productNum.length != 0) {
          this.productNum.forEach((item, index) => {
            if (index < 5) {
              this.totalTopLegend.push(item.product_name);
              this.totalTopData.push(item.quantity);
            }
            this.rateLegend.push(item.product_name);
            this.rateData.push({
              name: item.product_name,
              value: item.quantity,
            });
          });
        }

        this.getTotalRateCharts(); //商品数量占比
        this.getTotalTopCharts(); //商品数量统计
      });
    },

    //查询企业状态
    fetchCompanySatus() {
      this.$http(
        "/sass/user/statusQuery?user_id=" + this.user_id,
        "GET",
        {},
        {},
        (res) => {
          this.curStatus = res.payload.status;
          //重新获取当前最新txt
          this.formatStatus(this.curStatus);
          //存储status
          //sessionStorage.setItem('status', res.payload);
          this.curCompanyName = res.payload.company_name;
          this.$store.dispatch("SetStatus", this.curStatus);
          this.$store.dispatch("SetCompanyName", this.curCompanyName);

          this.open_time = res.payload;
          this.$store.dispatch("SetCertification", JSON.stringify(res.payload));
          if (this.curStatus == 2) {
            this.open_time = this.$store.getters.cer.updated_at;
          }
        },
        (err) => {
          console.log("err", err);
        }
      );
    }

  },
};
</script>
<style lang="less" scoped>
.overview {
  display: flex;
  //   min-height: 496px;
  min-height: calc(100vh - 150px);
  margin-top: 0px;

  .overview-left {
    display: flex;
    flex: 70%;
    // width: 0;
    flex-direction: column;
    .left-top {
      background-color: #fff;
      // padding: 16px;
      height: 140px;
      padding: 16px 24px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      &.chain-info {
        .company-info {
          min-width: 200px;
          flex: 30%;
          height: 64px;
          border-right: 1px solid rgba(0, 0, 0, 0.09);
          padding-right: 16px;
          .key.ellipsis {
            display: inline-block;
            width: 100%;
          }
        }
        .overview-info {
          // flex: 1 1;
          flex: 70%;
          display: flex;
          justify-content: space-around;
          text-align: center;
          & > div:not(:last-child) {
            border-right: 1px solid rgba(0, 0, 0, 0.09);
          }
        }
        .key {
          margin-bottom: 8px;
          color: #000;
          font-size: 14px;
          font-family: HelveticaNeue;
          line-height: 22px;
          opacity: 0.45;
        }
        .value {
          // width: 155px;
          min-width: 120px;
          color: #000;
          font-size: 28px;
          font-family: PingFangSC-Medium;
          line-height: 34px;
          opacity: 0.85;
          margin-bottom: 0;
        }
      }
    }
    .left-bottom {
      flex: 1;
      display: flex;
      //   justify-content: space-between;
      .china-map {
        flex: 50%;
        background-color: #fff;
        padding: 16px;
      }
      .scan-statistic {
        flex: 50%;
        background-color: #fff;
        padding: 16px;
        margin-left: 16px;
      }
      .query-select {
        min-width: 360px;
        display: flex;
        .select-one {
          width: 140px;
        }
        .select-two {
          flex: 1;
          margin-left: 10px;
        }
      }
    }
  }
  .overview-right {
    // width: 300px;
    flex: 30%;
    min-width: 300px;
    margin-left: 16px;
    display: flex;
    flex-direction: column;

    .right-top {
      flex: 50%;
      background-color: #fff;
      padding: 16px;
      margin-bottom: 16px;
    }
    .right-bottom {
      flex: 50%;
      background-color: #fff;
      padding: 16px;
    }
  }
}
</style>