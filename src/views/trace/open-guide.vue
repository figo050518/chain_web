<template>
    <div>
        <a-modal
            title="店铺导购配置"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-spin :spinning="confirmLoading">
                <a-form-model ref="openForm" :model="guideForm" :rules="rules">
                    <a-form-model-item label="店铺名称" prop="shop_name" required>
                        <a-input v-model="guideForm.shop_name" placeholder="请输入店铺名称"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="店铺说明" prop="introduction" required>
                        <a-input v-model="guideForm.introduction" placeholder="请输入店铺说明"></a-input>
                    </a-form-model-item>
                    <a-form-model-item label="店铺图标" prop="shop_icon" required>
                        <a-upload
                            v-model="guideForm.shop_icon"
                            action="http://139.159.146.109:9530/v1/file/upload"
                            list-type="picture-card"
                            :file-list="fileList"
                            name="upload"
                            @preview="handlePreview"
                            :remove="handleRemove"
                            :beforeUpload="handleBefore"
                            @change="handleChange"
                        >
                            <div v-if="fileList.length<1">
                                <a-icon type="plus" />
                            </div>
                        </a-upload>
                        <div style="margin-top:-20px;display:flex;flex-direction:column;font-size:12px;color:#989898;">
                            <span style="height:25px;line-height:25px;">仅支持jpg、png格式文件，大小不超过5M</span>
                            <span style="height:25px;line-height:25px;">建议使用图片比例1:1，推荐大小64*64</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="店铺链接" prop="shop_link" required>
                        <a-input v-model="guideForm.shop_link" placeholder="请输入店铺链接"></a-input>
                    </a-form-model-item>
                </a-form-model>
            </a-spin>
        </a-modal>
        <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible=false;">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<script>
export default {
    data(){
        return{
            previewVisible:false,
            previewImage:'',
            visible:false,
            confirmLoading:false,
            guideForm:{
                batch_number:'',
                shop_name:'',
                introduction:'',
                shop_icon:[],
                shop_link:'',
            },
            fileList:[],
            rules:{
                shop_name:[
                    {required:true,message:'请输入店铺名称',trigger:['blur','change']},
                    {min:1,max:16,message:'最多支持16个字符',trigger:['blur','change']}
                ],
                introduction:[
                    {required:true,message:'请输入店铺说明',trigger:['blur','change']},
                    {min:1,max:32,message:'最多支持32个字符',trigger:['blur','change']}
                ],
                shop_icon:[{required:true,message:'请上传店铺图标',trigger:['blur','change']}],
                shop_link:[
                    {required:true,message:'请输入店铺链接',trigger:['blur','change']},
                    {min:1,max:256,message:'最多支持256个字符',trigger:['blur','change']}
                ],
            },
            msgBox:null,
        }
    },
    methods:{
        show(record){
            this.visible = true;
            this.confirmLoading = true;
            this.guideForm.batch_number = record.batch_number;
            this.getGuideDetail(record).then(data=>{
                if(data){
                    this.guideForm = {
                        batch_number:data.batch_number,
                        shop_name:data.shop_name,
                        introduction:data.introduction,
                        shop_icon:data.shop_icon?[{
                            uid:-1,
                            name:'icon',
                            status:'done',
                            url:data.shop_icon
                        }]:[],
                        shop_link:data.shop_link,
                    };
                    this.fileList=data.shop_icon?[{
                        uid:-1,
                        name:'icon',
                        status:'done',
                        url:data.shop_icon
                    }]:[]
                }
                this.confirmLoading = false;
            })
        },
        getGuideDetail(data){
            this.msgBox ? this.$message.destroy() : null;
            return new Promise(resolve=>{
                this.$http(
                    '/sass/shop/query',
                    'GET',
                    {batch_number:data.batch_number},
                    {},
                    res=>{
                        resolve(res.payload);
                    },
                    err=>{
                        resolve('')
                        this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '获取店铺详情失败');
                    }
                )
            })
        },
        handleBefore(file,fileList){
            this.msgBox ? this.$message.destroy() : null;
            return new Promise((resolve,reject)=>{
                if(fileList[0].type!='image/png' && fileList[0].type!='image/jpeg' && fileList[0].type!='image/jpg'){
                    this.msgBox = this.$message.error('请选择正确的文件格式');
                    return reject(false);
                }
                if(fileList[0].size/1048576>5){
                    this.msgBox = this.$message.error('文件不能大于5MB');
                    return reject(false);
                }
                return resolve(true)
            })
        },
        handleChange({ fileList }) {
            this.fileList = fileList;
            if(fileList.length>0){
                if(fileList[0].response&&fileList[0].response.errCode==0){
                    this.guideForm.shop_icon = [{
                        uid:-1,
                        name:'icon',
                        status:'done',
                        url:fileList[0].response.data,
                    }]
                }
            }
        },
        async handlePreview(file) {
            this.previewImage = this.guideForm.shop_icon[0].url;
            this.previewVisible = true;
        },
        // 移除文件
        handleRemove(file){
            return new Promise((resolve)=>{
                this.guideForm.shop_icon = [];
                return resolve(true)
            })
        },
        handleOk(){
            this.msgBox ? this.$message.destroy() : null;
            this.$refs.openForm.validate(valid => {
                if (valid) {
                    this.confirmLoading = true;
                    let params = JSON.parse(JSON.stringify(this.guideForm))
                    params.shop_icon = this.guideForm.shop_icon[0].url
                    this.$http(
                        '/sass/shop/input',
                        'POST',
                        params,
                        {},
                        res=>{
                            this.confirmLoading = false;
                            this.visible = false;
                            this.msgBox = this.$message.success('开启成功');
                            this.$emit('handleOk')
                        },
                        err=>{
                            this.confirmLoading = false;
                            this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '开启失败')
                        }
                    );
                }
            });
        },
        handleCancel(){
            this.$refs.openForm.resetFields();
            this.fileList = [];
            this.visible = false;
        }
    }
}
</script>