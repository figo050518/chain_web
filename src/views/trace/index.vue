<template>
    <div>
        <a-alert 
            v-if="showTip" 
            type="info" 
            message="注：同一批次下商品的溯源信息是一样的，如果溯源信息不一样请分不同批次。" 
            show-icon 
            closable
            style="margin-bottom:16px;"
            class="animate__animated animate__zoomIn"
        ></a-alert>
        <a-card style="width: 100%" :bordered="false" class="animate__animated animate__zoomIn">
            <a-form-model layout="inline" :model="queryData" ref="queryData">
                <a-form-model-item label="商品名称：">
                    <a-input v-model="queryData.product_name" placeholder="请输入" style="width:250px"></a-input>
                </a-form-model-item>
                <a-form-model-item label="批次号：" style="margin-left: 20px">
                    <a-input v-model="queryData.batch_number" placeholder="请输入" style="width:250px"></a-input>
                </a-form-model-item>
            </a-form-model>
            <div class="btn-group">
                <a-button @click="handleReset"> 重置 </a-button>
                <a-button type="primary" @click="handleSearch"> 查询 </a-button>
            </div>
        </a-card>
        <div class="def-card animate__animated animate__zoomIn" style="margin-top:16px;">
            <div class="def-card-header">
                <p class="def-card-title">溯源管理列表</p>
                <a-button slot="extra" type="primary" @click="$refs.addModal.add();">新建批次</a-button>
            </div>
            <a-table 
                :row-key="record => record.batch_id"
                :loading="loading" 
                :columns="columns" 
                :data-source="allList" 
                :pagination="pagination"
                :scroll="{ x: 1570 }"
                @change="handlePagechange"
            >
                <!-- 批次编号 -->
                <div slot="batch-no" slot-scope="text,record,index" class="td-flex" style="width:110px;">
                    <span style="width:110px;" class="def-ellipsis" :title="text">{{text}}</span>
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>{{record.no_isCopy?'复制成功':'复制'}}</span>
                        </template>
                        <a-icon
                            v-if="record.no_isCopy"
                            title="复制"
                            type="check" 
                            style="cursor:pointer;color:#67C23A;"
                        ></a-icon>
                        <a-icon
                            v-else
                            title="复制"
                            type="copy" 
                            style="cursor:pointer;color:#1890FF;"
                            @click="clickNoCopy(text,index)"
                        />
                    </a-tooltip>
                </div>

                <!-- 商品名称 -->
                <div slot="product-name" slot-scope="text,record,index" class="td-flex" style="width:90px;">
                    <span style="width:90px;" class="def-ellipsis" :title="text">{{text}}</span>
                    <a-tooltip placement="top">
                        <template slot="title">
                            <span>{{record.name_isCopy?'复制成功':'复制'}}</span>
                        </template>
                        <a-icon
                            v-if="record.name_isCopy"
                            title="复制"
                            type="check" 
                            style="cursor:pointer;color:#67C23A;"
                        ></a-icon>
                        <a-icon
                            v-else
                            title="复制"
                            type="copy" 
                            style="cursor:pointer;color:#1890FF;"
                            @click="clickNameCopy(text,index)"
                        />
                    </a-tooltip>
                </div>

                <!-- 店铺导购 -->
                <div slot="guide" slot-scope="text,record" style="display:flex;align-items:center;">
                    <div style="margin-right:5px;">
                        <a-badge :status="text==0?'default':'processing'" />
                        <span :style="text==0?'':'color:#1890FF'">{{text==0?'未启用':'启用中'}}</span>
                    </div>
                    <a @click="handleGuide(text,record)">{{text==0?'启用':'关闭'}}</a>
                </div>

                <!-- 码状态 -->
                <template slot="code-status" slot-scope="text,record">
                    <span :style="text=='0'?'':'color:#1890FF;'">{{text=='0'?'未启用':'启用中'}}</span>
                </template> 

                <!-- 商品配置 -->
                <template slot="product-info" slot-scope="text,record">
                    <a @click="configProductInfo(record)">配置</a>
                </template>

                <!-- 溯源配置 -->
                <template slot="trace-info" slot-scope="text,record">
                    <a @click="configTraceInfo(record)">配置</a>
                </template>

                <!-- 批次状态 -->
                <div slot="batch-status" slot-scope="text,record">
                    <div style="margin-right:5px;">
                        <a-badge :status="text=='0'?'default':'processing'" />
                        <span :style="text=='0'?'':'color:#1890FF'">{{text=='0'?'未激活':'已激活'}}</span>
                    </div>
                </div>

                <!-- 小程序模板 -->
                <template slot="mini-model" slot-scope="text,record">
                    <a @click="$refs.chooseModal.choose(text,record)">{{text}}</a>
                </template>

                <template slot="create-time" slot-scope="text,record">
                    <span>{{text | filterDate}}</span>
                </template>

                <!-- 操作 -->
                <template slot="action" slot-scope="text,record">
                    <!-- <a-button type="link" :disabled="record.code_quantity==record.quantity" @click="$refs.productCode.create(record)">生成二维码</a-button> -->

                    <a @click="handleCreateCode(record)" :style="record.code_quantity>=record.quantity?'cursor:not-allowed;color:#a9a9a9':''">生成二维码</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="$refs.miniReview.review(record)">预览</a>
                    <a-divider type="vertical"></a-divider>
                    <a @click="handleDelete(record)">删除</a>
                </template>
            </a-table>
        </div>

        <!-- 批次新建 -->
        <add-modal ref="addModal" @handleOk="_handleOk"></add-modal>
        <!-- 打开店铺导购 -->
        <open-guide ref="openGuide" @handleOk="_handleOk"></open-guide>
        <!-- 选择小程序模板 -->
        <choose-modal ref="chooseModal" @handleOk="_handleOk"></choose-modal>
        <!-- 生成二维码 -->
        <product-code ref="productCode" @handleOk="_handleOk"></product-code>
        <!-- 小程序预览 -->
        <mini-review ref="miniReview"></mini-review>
    </div>
</template>

<script>
import AddModal from './add-modal.vue';
import OpenGuide from './open-guide.vue';
import ChooseModal from './choose-model.vue';
import ProductCode from './product-code.vue';
import MiniReview from './mini-review.vue';
export default {
    components:{
        AddModal,
        OpenGuide,
        ChooseModal,
        ProductCode,
        MiniReview,
    },
    data(){
        return{
            msgBox:null,
            showTip:true,
            queryData:{
                company_id:Number(this.$store.getters.company_id),
                page:1,
                size:10,
                batch_number:'',
                product_name:'',
            },
            loading:false,
            columns:[
                {
                    title: '批次号',
                    dataIndex: 'batch_number',
                    width:130,
                    scopedSlots:{customRender:'batch-no'}
                },
                {
                    title: '商品名称',
                    dataIndex: 'product_name',
                    width:110,
                    scopedSlots:{customRender:'product-name'}
                },
                {
                    title: '商品数量',
                    dataIndex: 'quantity',
                    align:'center',
                },
                {
                    title: '生码数量',
                    dataIndex: 'code_quantity',
                    align:'center',
                },
                {
                    title: '店铺导购',
                    dataIndex: 'shop_status',
                    width:130,
                    scopedSlots: { customRender: 'guide' },
                },
                {
                    title: '码状态',
                    dataIndex: 'code_status',
                    scopedSlots:{customRender:'code-status'}
                },
                {
                    title: '商品信息',
                    dataIndex: 'productInfo',
                    scopedSlots:{customRender:'product-info'}
                },
                {
                    title: '溯源信息',
                    dataIndex: 'traceInfo',
                    scopedSlots:{customRender:'trace-info'}
                },
                {
                    title: '小程序模板',
                    dataIndex: 'applets_name',
                    scopedSlots:{customRender:'mini-model'}
                },
                {
                    title: '批次状态',
                    dataIndex: 'status',
                    scopedSlots:{customRender:'batch-status'}
                },
                {
                    title:'创建时间',
                    dataIndex:'created_at',
                    width:170,
                    scopedSlots:{customRender:'create-time'}
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    width:200,
                    scopedSlots:{customRender:'action'}
                },
            ],
            allList:[],
            pagination: {
                position:'bottom',
                pageSize: 10,
                current: 1,
                total: 1,
                showTotal: (total,range) => `第 ${range[0]}-${range[1]} 条 / 总共 ${total} 条`,
                showSizeChanger:true,
                pageSizeOptions: ['10', '20', '30', '40'],
                onShowSizeChange:(current, pageSize)=>{
                    this.pagination.pageSize = pageSize;
                    this.queryData.size = pageSize;
                    this.getTraceList();
                }
            }, 
        }
    },
    created(){
        this.getTraceList();
    },
    methods:{
        // 分页
        handlePagechange(pagination){
            this.pagination = {...pagination};
            this.queryData.page = pagination.pageSize;
            this.getTraceList();
        },
        // 检索
        handleSearch(){
            this.getTraceList();
        },
        // 重置
        handleReset(){
            this.queryData = {
                company_id:Number(this.$store.getters.company_id),
                page:1,
                size:10,
                batch_number:'',
                product_name:'',
            }
            this.pagination.current = 1;
            this.getTraceList();
        },
        // 获取溯源列表
        getTraceList(){
            this.loading = true;
            this.msgBox ? this.$message.destroy() : null;
            this.$http(
                '/sass/batch/query',
                'GET',
                this.queryData,
                {},
                res=>{
                    this.loading = false;
                    this.allList = res.payload.data || [];
                    this.allList.map(e=>{
                        e.no_isCopy = false;
                        e.name_isCopy = false;
                    })
                    this.pagination.total = res.payload.counts || 0;
                },
                err=>{
                    this.loading = false;
                    this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '获取溯源列表失败')
                }
            )
        },

        _handleOk(){
            this.getTraceList();
        },

        // 启用店铺导购
        handleGuide(text,record){
            if(text==0){
                this.$refs.openGuide.show(record);
            }else{
                let _this = this;
                _this.$confirm({
                    title: '确定关闭店铺导购？',
                    content: '',
                    okText:'确认',
                    okType:'danger',
                    onOk() {
                        _this.$http(
                            '/sass/shop/close',
                            'GET',
                            {batch_number:record.batch_number},
                            {},
                            res=>{
                                _this.msgBox = _this.$message.success('关闭成功')
                                _this.getTraceList();
                            },
                            err=>{
                                _this.msgBox = _this.$message.error(_this.$errCode[err.rspCode] || '关闭失败')
                            }
                        )
                    },
                    onCancel() {},
                });
            }
        },

        clickNoCopy(val,index){
            let allList = JSON.parse(JSON.stringify(this.allList));
            allList[index].no_isCopy = true;
            this.allList = allList;
            setTimeout(()=>{
                allList[index].no_isCopy = false;
                this.allList = allList;
            },600)
            this.$copyText(val).then(
                function (e) { }, 
                function (e) { }   
            )
        },
        clickNameCopy(val,index){
            let allList = JSON.parse(JSON.stringify(this.allList));
            allList[index].name_isCopy = true;
            this.allList = allList;
            setTimeout(()=>{
                allList[index].name_isCopy = false;
                this.allList = allList;
            },600)
            this.$copyText(val).then(
                function (e) { }, 
                function (e) { }   
            )
        },

        // 配置商品信息
        configProductInfo(record){
            this.$store.dispatch('ToggleCrumb',['溯源管理','配置商品信息']);
            this.$router.push({
                path:'/trace/product-config/'+record.product_info_id,
                query:{
                    product_name:record.product_name,
                    batch_number:record.batch_number,
                }
            })
        },

        // 配置溯源信息
        configTraceInfo(record){
            this.$store.dispatch('ToggleCrumb',['溯源管理','配置溯源信息']);
            this.$router.push({
                path:'/trace/trace-config/'+record.batch_number,
                query:{
                    product_name:record.product_name,
                }
            })
        },

        // 删除批次
        handleDelete(record){
            let _this = this;
            _this.msgBox ? _this.$message.destroy() : null;
            _this.$confirm({
                title: '提示',
                content: '确定删除该批次',
                onOk() {
                    _this.$http(
                        '/sass/batch/delete',
                        'GET',
                        {
                            batch_number:record.batch_number
                        },
                        {},
                        res=>{
                            _this.msgBox = _this.$message.success('删除成功');
                            _this.getTraceList();
                        },
                        err=>{
                            _this.msgBox = _this.$message.error(_this.$errCode[err.rspCode] || '删除失败')
                        }
                    )
                },
                onCancel() {},
            });
        },

        // 生成二维码
        handleCreateCode(record){
            if(record.code_quantity >= record.quantity){
                return;
            }
            this.$refs.productCode.create(record)
        },
    }
}
</script>

<style lang="less" scoped>
    .td-flex{
        display:flex;
        justify-content:space-between;
        align-items:center;
    }
    .def-ellipsis{
        display:inline-block;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
    .btn-group {
        margin-top: -38px;
        float: right;
        .ant-btn {
        margin: 0 5px;
        }
    }
</style>
