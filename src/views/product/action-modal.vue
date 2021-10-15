<template>
    <div>
        <a-modal
            title="添加商品"
            :visible="visible"
            :confirm-loading="confirmLoading"
            @ok="handleOk"
            @cancel="handleCancel"
        >
            <a-spin :spinning="confirmLoading">
                <a-form-model ref="actionForm" :model="proForm" :rules="rules">
                    <a-form-model-item label="商品名称" prop="product_name" required>
                        <a-input v-model="proForm.product_name" autocomplete="off" placeholder="请输入商品名称" />
                    </a-form-model-item>
                    <a-form-model-item label="商品图片（最多上传6张）" prop="product_picture">
                        <a-upload
                            v-model="proForm.product_picture"
                            action="http://139.159.146.109:9530/v1/file/upload"
                            accept="image/png,image/jpeg"
                            list-type="picture-card"
                            :file-list="fileList"
                            name="upload"
                            @preview="handlePreview"
                            :remove="handleRemove"
                            :beforeUpload="handleBefore"
                            @change="handleChange"
                        >
                            <div v-if="fileList.length < 6">
                                <a-icon type="plus" />
                            </div>
                        </a-upload>
                        <div style="display:flex;flex-direction:column;font-size:12px;color:#989898;">
                            <span style="height:25px;line-height:25px;">仅支持jpg、png格式文件，大小不超过5M</span>
                            <span style="height:25px;line-height:25px;">建议使用图片比例1:1</span>
                        </div>
                    </a-form-model-item>
                    <a-form-model-item label="商品说明" prop="introduction">
                        <a-input v-model="proForm.introduction" autocomplete="off" placeholder="请输入商品说明" />
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
            action:'add',
            visible:false,
            confirmLoading:false,
            proForm:{
                product_name:'',
                product_picture:[],
                introduction:'',
                company_id:Number(this.$store.getters.company_id),
                created_at:null,
            },
            product_base_id:null,
            fileList:[],
            rules:{
                product_name:[
                    {required:true,message:'商品名称为必填项',trigger:['blur','change']},
                    {min:1,max:32,message:'最多支持32个字符',trigger:['blur','change']}
                ],
                introduction:[
                    {min:1,max:128,message:'最多支持128个字符',trigger:['blur','change']}
                ]
            },
            previewImage:'',
            previewVisible:false,

            msgBox:null,
        }
    },
    methods:{
        show(action,record){
            this.confirmLoading = true;
            this.visible = true;
            this.action = action;
            this.fileList = [];
            setTimeout(()=>{
                this.$refs.actionForm.resetFields();
                if(action == 'edit'){
                    this.product_base_id = record.product_base_id;
                    this.proForm = JSON.parse(JSON.stringify(record));
                    if(record.product_picture){
                        this.filterPicture(record).then(data=>{
                            this.confirmLoading = false;
                            this.fileList = data.picture || [];
                        })
                    }else{
                        this.confirmLoading = false;
                        this.fileList = [];
                    }
                }else{
                    this.confirmLoading = false;
                }
            },100)
        },
        filterPicture(data){
            return new Promise(resolve=>{
                let filter = {
                    picture:[],
                    ...data
                };
                data.product_picture.map((e,i)=>{
                    let obj = {
                        uid:i,
                        name:i+'u_img',
                        status:'done',
                        url:e
                    };
                    filter.picture.push(obj)
                })
                resolve(filter);
            })
        },
        handleBefore(file,fileList){
            return new Promise((resolve,reject)=>{
                if(fileList[0].type!='image/png' && fileList[0].type!='image/jpeg' && fileList[0].type!='image/jpg'){
                    this.$message.error('请选择正确的文件格式');
                    return reject(false);
                }
                if(fileList[0].size/1048576>5){
                    this.$message.error('文件不能大于5MB');
                    return reject(false);
                }
                return resolve(true)
            })
        },

        handleChange({ file,fileList }) {
            let len = fileList.length-1;
            this.fileList = fileList;
            if(file.response && file.response.errCode == 0){
                this.fileList.splice(len,1);
                this.fileList.push({
                    uid:len,
                    name:+len+'u_img',
                    status:'done',
                    url:file.response.data,
                })
            }
        },

        // 图片预览
        async handlePreview(file) {
            this.previewImage = file.url;
            this.previewVisible = true;
        },
        // 图片删除
        handleRemove(file){
            return new Promise((resolve)=>{
                this.fileList.map((e,i)=>{
                    if(e.name==file.name){
                        this.fileList.splice(i,1)
                        this.proForm.product_picture.splice(i,1);
                    }
                })
                resolve(true)
            })
        },


        handleCancel:function(){
            this.$refs.actionForm.resetFields();
            this.fileList = [];
            this.proForm.product_picture = [];
            this.visible = false;
            this.confirmLoading = false;
        },
        filterParams(){
            return new Promise((resolve)=>{
                let list = [];
                this.fileList.map(e=>{
                    if(e.status == 'done' && e.response && e.response.errCode == 0){
                        list.push(e.response.data)
                    }
                });
                resolve(list);
            })
        },
        handleOk:function(){
            this.msgBox ? this.$message.destroy() : null;
            this.proForm.product_picture = [];
            this.$refs["actionForm"].validate(valid => {
                if (valid) {
                    this.fileList.map(e=>{
                        if(e.status=='done'){
                            this.proForm.product_picture.push(e.url)
                        }
                        if(e.status=='uploading'){
                            this.msgBox = this.$message.warning('图片上传中，请稍后');
                            return;
                        }
                    })
                    this.confirmLoading = true;
                    let msg = this.action == 'add' ? '新建' : '编辑';
                    let url = this.action == 'add' ? '/sass/product/input' : '/sass/product/modify';
                    let params =  this.action == 'add' ? 
                        this.proForm : 
                        {
                            product_base_id:this.product_base_id,
                            ...this.proForm
                        };
                    this.$http(
                        url,
                        'POST',
                        params,
                        {},
                        res=>{
                            this.confirmLoading = false;
                            this.visible = false;
                            this.msgBox = this.$message.success(msg+'成功');
                            this.$emit('handleOk')
                        },
                        err=>{
                            this.confirmLoading = false;
                            this.msgBox = this.$message.error(this.$errCode[err.rspCode] || msg+'失败')
                        }
                    )
                }
            });
        },
    }
}
</script>

<style lang="less" scoped>
    /deep/ .ant-upload-list-picture-card-container{
        width:78px !important;
        height:78px !important;
        .ant-upload-list-item{
            width:78px !important;
            height:78px !important;
        }
    }
    /deep/ .ant-upload-select{
        width:78px !important;
        height:78px !important;
    }
    /deep/ .ant-upload-picture-card-wrapper{
        display:flex;
    }
</style>