<template>
    <a-drawer
        title="新建溯源批次"
        placement="right"
        :closable="true"
        :visible="visible"
        width="550"
        @close="handleCancel"
    >
        <a-spin :spinning="loading">
            <a-form-model ref="addForm" :model="addForm" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="批次号" prop="batch_number">
                    <a-input v-model="addForm.batch_number" autocomplete="off" placeholder="请输入批次号" />
                </a-form-model-item>
                <a-form-model-item label="选择商品" prop="product_base_id">
                    <a-select v-model="addForm.product_base_id" @change="handleChange" placeholder="请选择商品">
                        <a-select-option v-for="(item,index) in proList" :key="index" :value="item.product_base_id+';'+item.product_name">
                            {{item.product_name}}
                        </a-select-option>
                    </a-select>
                </a-form-model-item>
                <a-form-model-item label="商品数量" prop="quantity" required>
                    <a-input-number v-model="addForm.quantity" autocomplete="off" placeholder="请输入该批次商品数量" style="width:100%;" />
                </a-form-model-item>
                <a-form-model-item label="备注" prop="remarks">
                    <a-textarea v-model="addForm.remarks" :rows="4" autocomplete="off" placeholder="请输入备注信息" />
                </a-form-model-item>
            </a-form-model>
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
        const checkNumber = (rule,value,callback)=>{
            if(value){
                if(/^[0-9]*[1-9][0-9]*$/.test(value)){
                    callback();
                }else{
                    callback(new Error('数量必须是正整数'))
                }
                
            }else{
                callback(new Error('必填项且不为0'));
            }
        }
        return{
            loading:false,
            labelCol: { span: 4 },
            wrapperCol: { span: 19 },
            visible:false,
            confirmLoading:false,
            addForm:{
                batch_number:'',
                product_base_id:undefined,
                quantity:'',
                remarks:'',
            },
            rules:{
                batch_number:[
                    {required:true,message:'批次号为必填项',trigger:['blur','change']},
                    {min:1,max:64,message:'最多支持64个字符',trigger:['blur','change']}
                ],
                product_base_id:[{required:true,message:'请选择商品',trigger:['blur','change']}],
                quantity:[{validator:checkNumber,trigger:['blur','change']}],
                remarks:[ {min:1,max:128,message:'最多支持128个字符',trigger:['blur','change']}]
            },
            proList:[],
            msgBox:null,
        }
    },
    methods:{
        add(){
            this.loading = true;
            this.visible=true;
            
            this.getProductList().then(list=>{
                this.computBatch().then(now=>{
                    this.loading = false;
                    this.proList = list;
                    let batch_number = now.replace(/-/ig,'').replace(/:/ig,'');
                    this.addForm.batch_number = batch_number;
                });
            });
        },
        getProductList(){
            this.msgBox ? this.$message.destroy() : null;
            return new Promise((resolve)=>{
                this.$http(
                    '/sass/product/queryName',
                    'GET',
                    {company_id:this.$store.getters.company_id},
                    {},
                    res=>{
                        resolve(res.payload || [])
                    },
                    err=>{
                        this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '操作失败')
                    }
                )
            })
        },
        computBatch(){
            return new Promise(resolve=>{
                var date = new Date();
                this.year = date.getFullYear();
                let month = date.getMonth() + 1
                this.month = month < 10 ? '0'+ month : month;
                this.date = date.getDate()<10?'0'+date.getDate():date.getDate();
                this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                this.milliSeconds = date.getMilliseconds();
                var currentTime = this.year+'-'+this.month + '-' + this.date + '' + this.hour + ':' + this.minute + ':' + this.second + ':' + this.milliSeconds;
                resolve(currentTime)
            })
        },
        handleOk:function(){
            this.msgBox ? this.$message.destroy() : null;
            this.$refs.addForm.validate(valid=>{
                if(valid){
                    this.loading = true;
                    this.$http(
                        '/sass/batch/input',
                        'POST',
                        {
                            batch_number:this.addForm.batch_number,
                            product_name:this.addForm.product_base_id.split(';')[1],
                            quantity:this.addForm.quantity,
                            remarks:this.addForm.remarks,
                            company_id:Number(this.$store.getters.company_id),
                            product_base_id:Number(this.addForm.product_base_id.split(';')[0]),
                            applets_name:'默认',
                        },
                        {},
                        res=>{
                            this.loading = false;
                            this.visible = false;
                            this.msgBox = this.$message.success('新建成功')
                            this.$emit('handleOk')
                        },
                        err=>{
                            this.loading = false;
                            this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '新建批次失败')
                        }
                    )
                }
            })
        },
        handleCancel:function(){
            this.$refs.addForm.resetFields();
            this.visible = false;
        },
        handleChange:function(val){
            this.addForm.product_base_id = val;
        }
    }
}
</script>

<style lang="less" scoped>
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
</style>