<template>
    <a-modal
        title="生成二维码"
        :visible="visible"
        :confirm-loading="confirmLoading"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <a-spin :spinning="confirmLoading">
            <a-form-model ref="createForm" :model="createForm" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item label="商品名称" prop="product_name" required>
                    <a-input v-model="createForm.product_name" disabled></a-input>
                </a-form-model-item>
                <a-form-model-item label="批次号" prop="batch_number" required>
                    <a-input v-model="createForm.batch_number" disabled></a-input>
                </a-form-model-item>
                <a-form-model-item label="商品数量" prop="quantity" required>
                    <a-input v-model="createForm.quantity" disabled></a-input>
                </a-form-model-item>
                <a-form-model-item label="生码数量" prop="code_quantity" required :rules="[{validator:checkNumber,trigger:['blur','change']}]">
                    <a-input-number v-model="createForm.code_quantity" style="width:100%;"></a-input-number>
                </a-form-model-item>
            </a-form-model>
        </a-spin>
    </a-modal>
</template>

<script>
export default {
    data(){
        const checkNumber = (rule,value,callback)=>{
            if(value||value==0){
                if(/^[0-9]*[1-9][0-9]*$/.test(value)){
                    if(this.createForm.quantity && value < this.createForm.quantity ){
                        callback(new Error('生码数量不能小于商品数量'));
                    }else{
                        callback()
                    }
                }else{
                    callback(new Error('生码数量必须是正整数'))
                }
            }else{
                callback(new Error('请填写生码数量'));
            }
        }
        return{
            checkNumber:checkNumber,

            visible:false,
            confirmLoading:false,
            labelCol: { span: 5 },
            wrapperCol: { span: 18 },
            createForm:{
                product_name:'',
                batch_number:'',
                code_quantity:0,
                quantity:0,
            },
            msgBox:null,
        }
    },
    methods:{
        create(record){
            this.visible = true;
            this.createForm = {
                product_name:record.product_name,
                batch_number:record.batch_number,
                quantity:record.quantity,
                code_quantity:null,
            }
        },
        handleCancel:function(){
            this.visible = false;
            this.confirmLoading = false;
        },
        handleOk:function(){
            this.msgBox ? this.$message.destroy() : null;
            this.$refs.createForm.validate(valid=>{
                if(valid){
                    this.confirmLoading = true;
                    this.$http(
                        '/sass/qrcode/input',
                        "POST",
                        {
                            product_name:this.createForm.product_name,
                            batch_number:this.createForm.batch_number,
                            code_quantity:this.createForm.code_quantity,
                            quantity:this.createForm.quantity,
                            company_id:Number(this.$store.getters.company_id)
                        },
                        {},
                        res=>{
                            this.confirmLoading = false;
                            this.visible = false;
                            this.msgBox = this.$message.success('生码成功');
                            this.$emit('handleOk')
                        },
                        err=>{
                            this.confirmLoading = false;
                            this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '生码失败')
                        }
                    )
                }
            })
        }
    }
}
</script>