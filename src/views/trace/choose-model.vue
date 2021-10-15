<template>
    <a-drawer
        title="选择小程序模板"
        placement="right"
        :closable="true"
        :visible="visible"
        width="650"
        @close="handleCancel"
    >
        <a-spin :spinning="loading">
            <p>请选择商品对应的小程序模板，将会在用户扫描溯源码后出现在手机上。</p>
            <p style="color:rgba(0,0,0,.25);">若你想新增或使用更多小程序模板功能，请前往左侧导航中的“小程序模板管理”页面</p>

            <div class="card-flex">
                <div v-for="(item,index) in modelList" :key="index" :class="item.selected?'tech-selected':'tech-un-selected'">
                    <div class="card-model">
                        <div style="width:100%;height:100%;">
                            <img :src="item.background_picture" style="width:100%;height:100%;">
                            <img :src="item.logo" class="logo">
                        </div>
                        <a-checkbox v-model="item.selected" @change="onChange(index,item)"></a-checkbox>
                    </div>
                    <p class="card-name">{{item.applets_name}}</p>
                </div>
            </div>
        </a-spin>
        <div class="drawer-footer btn-group">
            <a-button @click="handleCancel">取 消</a-button>
            <a-button type="primary" @click="handleOk">确 定</a-button>
        </div>
    </a-drawer>
</template>

<script>
export default {
    data(){
        return{
            visible:false,
            loading:false,
            modelList:[],
            msgBox:null,
            chooseData:null,
            batch_id:null,
        }
    },
    methods:{
        choose(text,record){
            this.chooseData = record;
            this.batch_id = record.batch_id;
            this.visible = true;
            this.loading = true;
            this.getModalList().then(list=>{
                this.loading = false;
                this.modelList = list;
                this.modelList.map(e=>{
                    e.selected = e.applets_id == record.applets_id ? true : false;
                });
            })
        },
        getModalList(){
            this.msgBox ? this.$message.destroy() : null;
            return new Promise(resolve=>{
                this.$http(
                    '/sass/applets/queryList',
                    'GET',
                    {company_id:Number(this.$store.getters.company_id)},
                    {},
                    res=>{
                        resolve(res.payload)
                    },
                    err=>{
                        this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '获取模板列表失败')
                    }
                )
            })
        },
        onChange(index,item){
            this.chooseData = item;
            let modelList = JSON.parse(JSON.stringify(this.modelList));
            modelList.forEach((e,i)=>{
                if(i==index){
                    modelList[i].selected = true;
                }else{
                    modelList[i].selected = false;
                }
            })
            this.modelList = modelList;
        },
        handleCancel(){
            this.visible = false;
        },
        handleOk(){
            this.msgBox ? this.$message.destroy() : null;
            this.loading = true;
            this.$http(
                '/sass/batch/appletsChoose',
                'GET',
                {
                    applets_id:this.chooseData.applets_id,
                    template:this.chooseData.applets_name,
                    batch_id:this.batch_id,
                },
                {},
                res=>{
                    this.loading = false;
                    this.visible = false;
                    this.msgBox = this.$message.success('操作成功');
                    this.$emit('handleOk')
                },
                err=>{
                    this.loading = false;
                    this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '操作失败')
                }
            )
        }
    }
}
</script>

<style lang="less" scoped>
    p{
        margin:0;
    }
    .drawer-footer{
        position: absolute;
        right: 0px;
        bottom: 0px;
        width: 100%;
        border-top: 1px solid rgb(233, 233, 233);
        padding: 10px 16px;
        background: rgb(255, 255, 255);
        text-align: right;
    }
    .card-flex{
        width:100%;
        height:calc(100vh - 180px);
        display:flex;
        flex-wrap:wrap;
        overflow: auto;
        .tech-selected,.tech-un-selected{
            margin:1%;
            width:31%;
            height:270px;
            padding:4px;
            box-sizing: border-box;
            border-radius: 4px;
        }
        .tech-un-selected{
            border:1px solid #d9d9d9;
            .card-model{
                width:100%;
                position: relative;
                height:calc(100% - 30px);
                .ant-checkbox-wrapper{
                    position: absolute;
                    top:0;
                    right:0;
                    display: none;
                }
            }
            &:hover{
                border-color: #1890FF;
                /deep/ .ant-checkbox-wrapper{
                    position: absolute;
                    top:0;
                    right:0;
                    display: block;
                    .ant-checkbox-inner{
                        width: 20px !important;
                        height: 20px !important;
                        border-radius: 50% !important;
                        background: rgba(0,0,0,.6);
                    }
                }
            }
        }
        .tech-selected{
            border:1px solid #1890FF;
            .card-model{
                width:100%;
                position: relative;
                height:calc(100% - 30px);
                /deep/.ant-checkbox-wrapper{
                    position: absolute;
                    right:0;
                    top:0;
                    .ant-checkbox-inner{
                        width: 20px !important;
                        height: 20px !important;
                        border-radius: 50% !important;
                    }
                }
            }
        }
        .logo{
            position: absolute;
            width: 30%;
            top: 35%;
            left: 50%;
            transform: translate(-50%,-50%);
        }
        .card-name{
            width:100%;
            padding:5px 8px;
            text-align:center;
            color:rgba(0,0,0,.65);
            font-size:13px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>