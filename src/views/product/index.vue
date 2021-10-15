<template>
    <div>
        <a-row type="flex" style="align-items:center;" class="def-card animate__animated animate__zoomIn">
            <a-col :flex="18">
                <a-form-model layout="inline" :model="queryData" @submit.native.prevent>
                    <a-form-model-item label="商品名称：">
                        <a-input v-model="queryData.product_name" placeholder="请输入" style="width:250px"></a-input>
                    </a-form-model-item>
                </a-form-model>
            </a-col>
            <a-col :flex="6" style="text-align:right;">
                <div class="btn-group">
                    <a-button @click="handleReset"> 重置 </a-button>
                    <a-button type="primary" @click="handleSearch"> 查询 </a-button>
                </div>
            </a-col>
        </a-row>

        <div class="def-card animate__animated animate__zoomIn" style="margin-top:16px;">
            <div class="def-card-header">
                <p class="def-card-title">商品列表</p>
                <a-button slot="extra" type="primary" @click="$refs.actionModal.show('add')">添加商品</a-button>
            </div>
            <a-table 
                :row-key="record => record.product_base_id"
                :loading="loading" 
                :columns="columns" 
                :data-source="dataList" 
                :pagination="pagination"
                @change="handlePagechange"
                :scroll="{x:1000}"
            >
                <template slot="product_picture" slot-scope="text,record">
                    <span v-for="(item,index) in text" :key="index" style="margin:0 5px 5px 0;">
                        <img :src="item" style="width:35px;height:35px;">
                    </span>
                </template>
                <div slot="product_base_id" slot-scope="text,record,index" class="td-flex">
                    <span :title='record.product_base_id' class="def-ellipsis">{{record.product_base_id}}</span>
                    <a-tooltip placement="top" v-if="text">
                        <template slot="title">
                            <span>{{record.proCopy?'复制成功':'复制'}}</span>
                        </template>
                        <a-icon
                            v-if="record.proCopy"
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
                <template slot="create-time" slot-scope="text,record">
                    <span>{{text | filterDate}}</span>
                </template>
                <template slot="action" slot-scope="text,record">
                    <a @click="$refs.actionModal.show('edit',record)">编辑</a>
                    <a-divider type="vertical" />
                    <a @click="handleDelete(record)">删除</a>
                </template>
            </a-table>
        </div>

        <action-modal ref="actionModal" @handleOk="_handleOk"></action-modal>
    </div>
</template>

<script>
import ActionModal from './action-modal.vue';
export default {
    components:{
        ActionModal,
    },
    data(){
        return{
            queryData:{
                product_name:'',
            },
            loading:true,
            columns:[
                {
                    title:'商品名称',
                    dataIndex: 'product_name',
                    width:200,
                },
                {
                    title: '商品图片',
                    dataIndex: 'product_picture',
                    width:200,
                    scopedSlots: { customRender: 'product_picture' },
                },
                // {
                //     title: '商品编号',
                //     dataIndex: 'product_base_id',
                //     width:'150',
                //     scopedSlots: { customRender: 'product_base_id' },
                // },
                {
                    title: '商品说明',
                    dataIndex:'introduction'
                },
                {
                    title:'创建时间',
                    dataIndex:'created_at',
                    scopedSlots:{customRender:'create-time'}
                },
                {
                    title: '操作',
                    dataIndex: 'action',
                    width:150,
                    scopedSlots: { customRender: 'action' },
                },
            ],
            allList:[],
            dataList:[],
            searchList:[],
            pagination: {
                position:'bottom',
                pageSize: 10,
                current: 1,
                total: 1,
                showTotal: (total,range) => `第 ${range[0]}-${range[1]} 条 / 总共 ${total} 条`,
                showSizeChanger:true,
                pageSizeOptions: ['10', '20', '30', '40'],
                onShowSizeChange:(current, pageSize)=>{
                    this.pagination.current = 1;
                    this.pagination.pageSize = pageSize;
                    this.getProductList();
                }
            }, 
            
            ProCopy:false,      //编号是否复制成功
        }
    },
    created(){
        this.getProductList();
    },
    methods:{
        _handleOk(){
            this.getProductList();
        },
        getProductList(){
            this.loading = true;
            this.$http(
                '/sass/product/query',
                'GET',
                {
                    company_id:this.$store.getters.company_id,
                },
                {},
                res=>{
                    this.loading = false;
                    this.allList = res.payload || [];
                    this.allList.map(e=>{
                        e.proCopy = false;
                    });
                    this.pagination.total = this.allList.length;
                    this.dataList = this.allList.slice((this.pagination.current-1)*this.pagination.pageSize,this.pagination.pageSize*this.pagination.current);
                },
                err=>{
                    this.loading = false;
                    this.$message.error(this.$errCode[err.rspCode] || '获取商品列表失败');
                }
            )
        },
        // 分页
        handlePagechange(pagination){
            this.pagination = {...pagination}
            this.getProductList();
        },
        handleSearch(){
            this.searchList = [];
            this.pagination.current = 1;
            this.allList.map(e=>{
                if(e.product_name.includes(this.queryData.product_name)){
                    e.proCopy = false;
                    this.searchList.push(e);
                }
            });
            this.pagination.total = this.searchList.length;
            this.dataList = this.searchList.splice((this.pagination.current-1)*this.pagination.pageSize,this.pagination.pageSize*this.pagination.current);
        },
        handleReset(){
            this.pagination.current = 1;
            this.queryData.product_name = '';
            this.searchList = [];
            this.getProductList();
        },
        handleDelete(record){
            let _this = this;
            _this.msgBox ? _this.$message.destroy() : null;
            this.$confirm({
                title: '提示',
                content: '确定删除该商品',
                onOk() {
                    _this.$http(
                        '/sass/product/delete',
                        'GET',
                        {
                            product_base_id:record.product_base_id
                        },
                        {},
                        res=>{
                            _this.msgBox = _this.$message.success('删除成功');
                            _this.getProductList();
                        },
                        err=>{
                             _this.msgBox = _this.$message.error(_this.$errCode[err.rspCode] || '删除失败')
                        }
                    )
                },
                onCancel() {},
            });
        },

        clickNoCopy: function (val,index) {
            let dataList = JSON.parse(JSON.stringify(this.dataList));
            dataList[index].proCopy = true;
            this.dataList = dataList;
            setTimeout(()=>{
                dataList[index].proCopy = false;
                this.dataList = dataList;
            },600)
            this.$copyText(val).then(
                function (e) { }, 
                function (e) { }   
            )
        },
    }
}
</script>

<style lang="less" scoped>
    .td-flex{
        width:150px;
        display:flex;
        justify-content:space-between;
        align-items:center;
    }
    .def-ellipsis{
        display:inline-block;
        width:135px;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }
</style>