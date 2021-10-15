<template>
    <a-modal
        title="小程序预览"
        :visible="visible"
        :confirm-loading="confirmLoading"
        :footer="null"
        @cancel="handleCancel"
        width="423px"
    >
        <a-spin :spinning="confirmLoading">
            <div class="mini-modal">
                <div class="modal-top">
                    <img :src="modalInfo.background_picture" class="bg" >
                    <img :src="modalInfo.logo" class="logo">
                    <div class="top-content">
                        <img src="../../assets/images/model/warn.png" class="warn">
                        <p style="color:#fff;font-size:18px;">{{modalInfo.warning_module}}</p>
                    </div>
                </div>
                <!-- 查看记录 -->
                <ul class="modal-record" v-if="hasRecord">
                    <li class="record-item">
                        <img src="../../assets/images/model/time-icon.png" class="item-icon">
                        <p class="item-label">首次查询时间</p>
                        <p class="item-value">{{recordInfo.first_time}}</p>
                    </li>
                    <li class="record-item">
                        <img src="../../assets/images/model/location-icon.png" class="item-icon">
                        <p class="item-label">首次查询地址</p>
                        <p class="item-value">{{recordInfo.first_address}}</p>
                    </li>
                    <li class="record-item">
                        <img src="../../assets/images/model/record-icon.png" class="item-icon">
                        <p class="item-label">查看扫码记录</p>
                        <p class="item-value">查看详情&gt;&gt;</p>
                    </li>
                </ul>

                <!-- 店铺导购 -->
                <div class="modal-card modal-guide" v-if="hasGuide">
                    <img :src="storeInfo.shop_icon" class="store-logo">
                    <div class="right">
                        <p class="name">{{storeInfo.shop_name}}</p>
                        <p class="intro">{{storeInfo.introduction}}</p>
                        <a-button class="guide-btn" icon="shop">前往旗舰店铺</a-button>
                    </div>
                </div>

                <!-- 商品信息 -->
                <div class="modal-card" v-if="showProduct">
                    <p class="flag">产品认证信息</p>
                    <ul class="product">
                        <li class="product-item" v-for="(item,index) in productInfo" :key="index">
                            <p class="val-title" v-if="item.status==1">{{item.title}}</p>
                            <p v-if="item.type=='文本'&&item.status==1" class="val-label">{{item.value}}</p>
                            <img v-if="item.type=='图片'&&item.status==1" :src="item.value" class="val-img">
                            <div v-if="item.type=='视频'&&item.status==1" style="border-radius:5px;margin-left:30px;width:138px;height:78px;background:rgba(0,0,0,.65);display:flex;justify-content:center;align-items:center;">
                                <img src="../../assets/images/mobile/play.png" style="width:38px;height:38px;">
                            </div>
                        </li>
                    </ul>
                    <div class="chain-btn">
                        <img src="../../assets/images/model/logo-icon.png" class="btn-icon">
                        <span class="btn-label">区块链标识：d62ab62a2b57a93493ru3498u5832b80</span>
                    </div>
                </div>

                <!-- 各个环节信息 -->
                <div class="modal-card" v-for="(item,index) in segmentList" :key="index" v-if="showSegment">
                    <p class="flag">{{item.process_name}}</p>
                    <a-timeline div="def-timeline">
                        <a-timeline-item v-for="(info,j) in item.content" :key="j" v-if="info.status==1">
                            <img src="../../assets/images/model/timeline-icon.png" slot="dot" style="width:17px;height:17px;">
                            <div class="timeline-content">
                                <span class="timeline-title">{{info.title}}</span>
                                <span v-if="info.type=='文本'" class="timeline-title">{{info.value}}</span>
                                <img v-if="info.type=='图片'" :src="info.value" style="width:78px;">
                                <div v-if="info.type=='视频'" style="border-radius:5px;display:flex;justify-content:center;align-items:center;width:138px;height:78px;background:rgba(0,0,0,.65);">
                                    <img src="../../assets/images/mobile/play.png" style="width:38px;height:38px;">
                                </div>
                            </div>
                        </a-timeline-item>
                    </a-timeline>
                    <div class="chain-btn">
                        <img src="../../assets/images/model/logo-icon.png" class="btn-icon">
                        <span class="btn-label">区块链标识：d62ab62a2b57a93493ru3498u5832b80</span>
                    </div>
                </div>

                
            </div>
        </a-spin>
    </a-modal>
</template>

<script>
export default {
    data(){
        return{
            applets_id:null,            //当前选中小程序模板ID
            batch_number:null,          //当前批次号
            product_info_id:null,

            visible:false,
            confirmLoading:false,
            hasGuide:false,         //控制店铺导购展示
            hasRecord:false,        //控制扫码记录展示
            showProduct:false,      //控制商品信息获取进度以便显示
            showSegment:false,      //控制环节流程展示

            modalInfo:{},
            recordInfo:{
                first_time:'2021-07-08 10:16:13',
                first_address:'江苏省南京市',
            },
            storeInfo:{},
            productInfo:[],
            segmentList:[],

            msgBox:null,
        }
    },
    methods:{
        review(record){
            this.visible = true;
            this.confirmLoading = true;
            this.msgBox ? this.$message.destroy() : null;
            this.applets_id = record.applets_id;
            this.batch_number = record.batch_number;
            this.product_info_id = record.product_info_id;
            this.getAppletInfo().then(res=>{
                this.confirmLoading = false;
                this.modalInfo = res;
                this.hasRecord = res.scan_record == 1 ? true : false;
                this.hasGuide = record.shop_status ? true : false;
                if(record.shop_status!=0){
                    this.getStoreInfo();
                }
                this.getProductInfo();
                this.getSegmentInfo();
            });
        },
        // 小程序模板数据
        getAppletInfo(){
            return new Promise((resolve)=>{
                this.$http(
                    '/sass/applets/getSingle',
                    'GET',
                    {applets_id:this.applets_id},
                    {},
                    res=>{
                        resolve(res.payload)
                    },
                    err=>{
                        this.msgBox = this.$message.error('获取小程序模板信息失败')
                    }
                )
            })
        },
        // 店铺数据
        getStoreInfo(){
            this.$http(
                '/sass/shop/query',
                'GET',
                {batch_number:this.batch_number},
                {},
                res=>{
                    this.storeInfo = res.payload;
                },
                err=>{
                    this.msgBox = this.$message.error('店铺信息获取失败');
                }
            )
        },
        // 获取商品信息
        getProductInfo(){
            this.msgBox ? this.$message.destroy() : null;
            this.$http(
                '/sass/product/infoQuery',
                'GET',
                {
                    product_info_id:this.product_info_id,
                },
                {},
                res=>{
                    if(res.payload && res.payload.content){
                        this.showProduct = true;
                        res.payload.content.map((e,i)=>{
                            this.productInfo.push(e);
                            if(e.type=='文本'){
                                this.productInfo[i].value = e.detail;
                            }else{
                                let detail = e.detail ? 
                                e.detail.indexOf(',')>-1 ? 
                                    e.detail.split('[')[1].split(']')[0].split(',') : 
                                    e.detail.split('[')[1].split(']') : 
                                [];
                                this.productInfo[i].value = detail[0];
                            }
                        })
                    }
                },
                err=>{
                    this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '获取数据失败');
                }
            )
        },
        // 获取环节信息
        getSegmentInfo(){
            this.$http(
                '/sass/process/query',
                'GET',
                {
                    company_id:Number(this.$store.getters.company_id),
                    batch_number:this.batch_number,
                },
                {},
                res=>{
                    if(res.payload){
                        this.showSegment = true;
                        res.payload.map((e,i)=>{
                            this.segmentList.push(e);
                            if(e.content){
                                e.content.map((c,j)=>{
                                    if(c.type!='文本'){
                                        let detail = c.detail ? 
                                        c.detail.indexOf(',')>-1 ? 
                                            c.detail.split('[')[1].split(']')[0].split(',') : 
                                            c.detail.split('[')[1].split(']') : 
                                        [];
                                        this.segmentList[i].content[j].value = detail[0];
                                    }else{
                                        this.segmentList[i].content[j].value = c.detail;
                                    }
                                })
                            }else{
                                this.segmentList[i].content = [];
                            }
                        })
                    }
                },
                err=>{
                    this.msgBox = this.$message.error('获取数据出错')
                }
            )
        },
        handleCancel:function(){
            this.modalInfo = {};
            this.storeInfo = {};
            this.productInfo = [];
            this.segmentList = [];
            this.hasRecord = false;
            this.hasGuide = false;
            this.showProduct = false;
            this.showSegment = false;
            this.confirmLoading = false;
            this.visible = false;
        }
    }
}
</script>

<style lang="less" scoped>
    .mini-modal{
        width:100%;
        max-height:80vh;
        overflow: auto;
        background:#f5f5f5;
        .modal-top{
            width:100%;
            position:relative;
            .bg{
                width:100%;
            }
            .logo{
                position:absolute;
                width:170px;
                height:170px;
                top:40%;
                left:50%;
                transform: translate(-50%,-50%);
            }
            .top-content{
                position:absolute;
                bottom:10%;
                left:50%;
                transform: translateX(-50%);
                text-align:center;
                .warn{
                    width:70px;
                    height:74px;
                }
            }
        }
        .modal-record{
            margin-top:20px;
            display:flex;
            justify-content: space-between;
            .record-item{
                width:33%;
                text-align:center;
                .item-icon{
                    width:24px;
                    height:24px;
                }
                p{
                    margin:5px 0;
                }
                .item-label{
                    font-size:13px;
                    color:#022648;
                }
                .item-value{
                    font-size:12px;
                    color:#0067BF;
                }
            }
        }
        .modal-card{
            background: #fff;
            box-shadow: 0 0.9px 9px 0 rgba(61, 87, 120,  .16);
            border-radius: 7.2px;
            margin: 10.8px;
            padding-bottom:16px;
            .flag{
                margin-left:10px;
                width:134px;
                height:34px;
                background-image: url('../../assets/images/model/title-bg.png');
                background-size:100% 100%;
                font-size:13px;
                color:#022648;
                text-align:center;
                line-height: 30px;
            }
            /deep/.ant-timeline{
                padding:15px !important;
                .ant-timeline-item-tail{
                    border:1px dotted #0083FF !important;
                }
            }
            .timeline-content{
                display:flex;
                justify-content: space-between;
                .timeline-title{
                    margin-left:10px;
                    color:#022648;
                    font-size:14px;
                }
            }
            .chain-btn{
                margin:0 15px;
                color:#0083FF;
                background:#ECF6FF;
                font-size:13px;
                height:36px;
                line-height:36px;
                padding:0 20px;
                border:1px solid #0083FF;
                border-radius: 5px;
                display:flex;
                justify-content: space-between;
                align-items: center;
                .btn-icon{
                    width:18px;
                    height:18px;
                }
                .btn-label{
                    width:calc(100% - 30px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        .modal-guide{
            padding:13px 25px;
            display:flex;
            justify-content: space-between;
            .store-logo{
                width:70px;
                height:70px;
            }
            .right{
                width:calc(100% - 90px);
                .name{
                    font-size:13px;
                    margin-bottom:4px;
                    color:#000;
                }
                .intro{
                    font-size:12px;
                    color:rgba(0,0,0,.65);
                    margin-bottom:4px;
                }
                .guide-btn{
                    background-image: linear-gradient(180deg,#46bbff,#186dff);
                    border-radius: 15px;
                    border:0;
                    font-size: 12px;
                    height:27px;
                    line-height: 27px;
                    color: #fff;
                    padding: 0px 20px;
                }
            }
        }
        .product{
            padding:0 20px;
            .product-item{
                display:flex;
                font-size:13px;
                color:#022648;
                padding:3px 0;
                .val-title{
                    width:130px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .val-label{
                    margin-left:30px;
                    width:calc(100% - 180px);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .val-img{
                    margin-left:30px;
                    height:68px;
                }
            }
        }
    }
</style>