<template>
    <div>
        <div class="def-card animate__animated animate__zoomIn">
            <div class="def-card-header">
                <p class="def-card-title">当前批次基本信息</p>
            </div>
            <div class="flex-label">
                <p>批次号：{{params.batch_number}}</p>
                <p>商品名称：{{params.product_name}}</p>
            </div>
        </div>
        <div class="def-card animate__animated animate__zoomIn" style="margin-top:16px;">
            <div class="def-card-header" style="justify-content:flex-start;">
                <p class="def-card-title" style="margin:0 10px 0 0;">商品信息</p>
                <a-tag :color="chain_status?'green':'blue'">
                    {{!chain_status?'未上链':'已上链'}}
                </a-tag>
                <a @click="handleChain" v-if="!chain_status && showChain">上链</a>
            </div>
            <a-form-model ref="configForm" :model="configForm">
                <a-table
                    :row-key="record => record.id"
                    :loading="loading" 
                    :columns="columns" 
                    :data-source="configForm.allList" 
                    :pagination="false"
                >
                    <template slot="slot-title" slot-scope="text,record,index">
                        <span v-if="index==0">{{text}}</span>
                        <a-form-model-item 
                            v-else 
                            :prop="'allList.'+index+'.title'" 
                            required 
                            :rules="[
                                {required:true,message:'请填写标题',trigger:['blur','change']},
                                {min:1,max:12,message:'最大支持12位字符',trigger:['blur','change']}
                            ]"
                        >
                            <a-input v-model="record.title" placeholder="请输入标题" :disabled="chain_status==1"></a-input>
                        </a-form-model-item>
                    </template>
                    <template slot="type" slot-scope="text,record,index">
                        <span v-if="index==0">{{text}}</span>
                        <a-form-model-item 
                            v-else 
                            :prop="'allList.'+index+'.type'" 
                            required
                        >
                            <a-select :disabled="chain_status==1" v-model="record.type" style="width: 120px" @change="handleSelect(record.type,index)">
                                <a-select-option value="文本">
                                    文本
                                </a-select-option>
                                <a-select-option value="图片">
                                    图片
                                </a-select-option>
                                <a-select-option value="视频">
                                    视频
                                </a-select-option>
                            </a-select>
                        </a-form-model-item>
                    </template>
                    <template slot="val" slot-scope="text,record,index">
                        <span v-if="index==0">{{text}}</span>
                        <span v-else style="display:flex;align-items:center;">
                            <a-form-model-item 
                                v-if="record.type=='文本'" 
                                :prop="'allList.'+index+'.value'" 
                                required
                                :rules="[
                                    {required:true,message:'请填写内容',trigger:['blur','change']},
                                    {min:1,max:128,message:'最大支持128个字符',trigger:['blur','change']}
                                ]"
                                :style="!record.link?'width:77%':''"
                            >
                                <a-input v-model="record.value" placeholder="请输入内容" :disabled="chain_status==1"></a-input>
                            </a-form-model-item>
                            <!-- <a-icon 
                                v-if="record.type=='text'" 
                                type="link"
                                style="margin:0 3px;margin-top:-27px;cursor:pointer;color:#1890ff;"  
                                @click="handleLink(record,index)"
                            ></a-icon>
                            <a-form-model-item 
                                v-if="record.type=='text'&&record.link" 
                                :prop="'allList.'+index+'.url'" 
                                required
                                :rules="[
                                    {required:true,message:'请填写链接',trigger:['blur','change']},
                                    {min:1,max:128,message:'最大支持128个字符',trigger:['blur','change']}
                                ]"
                            >
                                <a-input v-model="record.url" placeholder="请填写链接"></a-input>
                            </a-form-model-item> -->
                            <a-form-model-item 
                                v-if="record.type=='图片'" 
                                :prop="'allList.'+index+'.value'" 
                                required
                                :rules="[{required:true,message:'请上传图片',trigger:['blur','change']}]"
                            >
                                <a-upload
                                    v-model="text"
                                    accept="image/png,image/jpeg"
                                    list-type="picture-card"
                                    :file-list="record.value"
                                    name="upload"
                                    @preview="handlePreview"
                                    :remove="handleRemove"
                                    :customRequest="customIRequest"
                                    :data="{current:index,record:record}"
                                    :disabled="chain_status==1"
                                >
                                    <div v-if="record.value.length<6">
                                        <a-icon type="plus" />
                                    </div>
                                </a-upload>
                            </a-form-model-item>
                            <a-form-model-item 
                                v-if="record.type=='视频'" 
                                :prop="'allList.'+index+'.value'" 
                                required
                                :rules="[{required:true,message:'请上传视频文件',trigger:['blur','change']}]"
                            >
                                <a-upload
                                    v-if="record.value.length==0 || record.value[0].status=='uploading'"
                                    v-model="text"
                                    accept=".mp4"
                                    list-type="picture-card"
                                    :file-list="record.value"
                                    name="upload"
                                    @preview="handlePreviewVideo"
                                    :remove="handleRemove"
                                    :customRequest="customVRequest"
                                    :data="{current:index,record:record}"
                                    :disabled="chain_status==1"
                                >
                                    <div v-if="record.value.length<1">
                                        <a-icon type="plus" />
                                    </div>
                                </a-upload>
                                <div v-if="record.value.length==1&&record.value[0].status=='done'"
                                    style="margin-right:5px;width:78px;height:78px;padding:5px;border-radius:4px;border:1px solid #d9d9d9;position:relative;">
                                    <video class="el-upload-list__item-thumbnail"
                                            style="width:100%;height:100%;">
                                        <source :src="record.value[0].url">
                                    </video>
                                    <div style="width:63px;height:63px;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:1;display:flex;justify-content:center;align-items:center;">
                                        <a-icon type="eye"
                                                style="cursor:pointer;font-size:16px;color:#fff;"
                                                @click="handlePreviewVideo(record.value[0],'video/mp4')" />
                                        <a-icon 
                                            v-if="chain_status!=1"
                                            type="delete"
                                            style="cursor:pointer;font-size:16px;margin-left:6px;color:#fff;"
                                            @click="handleRemove(record.value[0])" />
                                    </div>
                                </div>
                            </a-form-model-item>
                        </span>
                    </template>
                    <template slot="scan" slot-scope="text,record">
                        <a-switch v-model="record.scan" :disabled="chain_status==1"/>
                    </template>
                    <template slot="action" slot-scope="text,record,index">
                        <span v-if="chain_status==1">删除</span>
                        <span v-else>
                           <span v-if="index==0">删除</span>
                            <div v-else>
                                <a-popconfirm
                                    title="确定删除？"
                                    ok-text="确定"
                                    cancel-text="取消"
                                    @confirm="handleDelete(index)"
                                >
                                    <a>删除</a>
                                </a-popconfirm>
                            </div> 
                        </span>
                    </template>
                </a-table>
            </a-form-model>
            <div style="margin:16px 24px 24px;width:100%;">
                <a-button 
                    type="dashed" 
                    icon="plus" 
                    size="large" 
                    style="font-size:14px;width:calc(100% - 48px)"
                    @click="handleAddInfo"
                    :disabled="chain_status==1"
                >添加新的一行信息</a-button>
            </div>
        </div>
        <div class="def-card animate__animated animate__zoomIn" style="margin-top:16px;text-align:right;">
            <a-button style="margin-right:10px;" @click="handleCancel">取 消</a-button>
            <a-button type="primary" @click="handleSave" :disabled="chain_status==1">保 存</a-button>
        </div>


        <!-- 图片预览 -->
        <a-modal title="预览"
                :visible="imageVisible"
                :footer="null"
                @cancel="imageVisible=false;">
            <img alt="example"
                style="width: 100%"
                :src="imageSrc" />
        </a-modal>

        <!-- 视频预览 -->
        <a-modal title="预览"
                    :visible="videoVisible"
                    :footer="null"
                    @cancel="videoVisible=false;">
            <video class="el-upload-list__item-thumbnail"
                    controls="true"
                    autoplay="false"
                    loop="false"
                    muted="muted"
                    style="width:100%;">
                <source :src="videoSrc">
            </video>
        </a-modal>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    
    data(){
        return{
            chain_status:true,
            showChain:true,
            loading:false,
            params:{
                batch_number:'',
                product_name:'',
                product_info_id:'',
            },
            configForm:{
                allList:[],
            },
            columns:[
                {
                    title:'标题',
                    dataIndex:'title',
                    width:200,
                    scopedSlots:{customRender:'slot-title'}
                },
                {
                    title:'类型',
                    dataIndex:'type',
                    scopedSlots:{customRender:'type'}
                },
                {
                    title:'内容',
                    dataIndex:'value',
                    scopedSlots:{customRender:'val'}
                },
                {
                    title:'扫码展示',
                    dataIndex:'scan',
                    width:120,
                    scopedSlots:{customRender:'scan'}
                },
                {
                    title:'操作',
                    dataIndex:'action',
                    width:100,
                    scopedSlots:{customRender:'action'}
                },
            ],
            // 预览相关信息
            imageVisible: false,
            imageSrc: '',
            videoVisible: false,
            videoSrc: '',

            msgBox:null,
        }
    },
    created(){
        this.getProductInfo();
    },
    methods:{
        // 获取配置信息
        getProductInfo(){
            this.params = {
                batch_number:this.$route.query.batch_number,
                product_name:this.$route.query.product_name,
                product_info_id:Number(this.$route.params.product_info_id),
            }
            this.msgBox ? this.$message.destroy() : null;
            this.$http(
                '/sass/product/infoQuery',
                'GET',
                {
                    product_info_id:this.params.product_info_id,
                },
                {},
                res=>{
                    let data = res.payload ? res.payload.content ? res.payload.content : [] :[];
                    this.filterInfo(data).then(list=>{
                        this.configForm.allList = list;
                        this.chain_status = res.payload.chain_status;
                    })
                },
                err=>{
                    this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '获取数据失败');
                }
            )
        },
        // 格式化响应数据
        filterInfo(data){
            return new Promise(resolve=>{
                let list = [];
                data.map((e,j)=>{
                    list.push(e);
                    list[j].scan = e.status == 1 ? true : false;
                    if(e.type!='文本'){
                        list[j].value = [];
                        let detail = e.detail ? 
                            e.detail.indexOf(',')>-1 ? 
                                e.detail.split('[')[1].split(']')[0].split(',') : 
                                [e.detail.split('[')[1].split(']')[0]] : 
                            [];
                        detail.map((m,i)=>{
                            let obj = {
                                uid:i,
                                name:i+'detail',
                                status:'done',
                                url:m,
                                row:j,
                                col:i,
                            }
                            list[j].value.push(obj)
                        })
                    }else{
                        list[j].value = e.detail;
                    }
                })
                resolve(list)
            })
        },

        // 上链
        handleChain(){
            let _this = this;
            _this.$confirm({
                title: "提示",
                content: "数据上链后不支持修改，是否继续？",
                okText: "继续",
                cancelText: "取消",
                onOk: () => {
                    _this.$http(
                        '/sass/product/onchain',
                        'GET',
                        {product_info_id:_this.params.product_info_id},
                        {},
                        res=>{
                            _this.msgBox = _this.$message.success('上链成功');
                            this.getProductInfo();
                        },
                        err=>{
                            _this.msgBox = _this.$message.error(_this.$errCode[err.rspCode] || '上链失败');
                        }
                    )
                },
                onCancel() {},
            });
        },
        // 控制类型选择器
        handleSelect(text,index){
            this.configForm.allList[index].type = text;
            if(text!='文本'){
                this.configForm.allList[index].value = [];
            }else{
                this.configForm.allList[index].value = '';
            }
        },
        // 控制链接展示与否
        // handleLink(record,index){
        //     this.configForm.allList.forEach((e,i)=>{
        //         if(i==index){
        //             this.configForm.allList[i].link = !record.link
        //         }
        //     })
        // },

        // 文件上传请求
        saveData(data){
            this.msgBox ? this.$message.destroy() : null;
            return new Promise((resolve,reject)=>{
                axios.post('http://139.159.146.109:9530/v1/file/upload',data).then(res=>{
                    if(res.status == 200 && res.data.errCode == 0){
                        resolve(res.data)
                    }else{
                        this.msgBox = this.$message.error('文件上传失败');
                        reject(false)
                    }
                }).catch(err=>{
                    this.msgBox = this.$message.error('文件上传失败');
                    reject(false)
                })
            })
        },
        // 图片上传拦截
        customIRequest(data){
            this.msgBox ? this.$message.destroy() : null;
            let file = data.file;
            if(file.type!='image/png' && file.type!='image/jpeg' && file.type!='image/jpg'){
                this.msgBox = this.$message.error('文件格式不支持');
                return;
            }else if(file.size/1048576>5){
                this.msgBox = this.$message.error('文件不能大于5MB');
                return;
            }else{
                this.uploadFile(data.data,file);
            }
        },
        // 视频上传前拦截
        customVRequest(data){
            this.msgBox ? this.$message.destroy() : null;
            let file = data.file;
            if(file.type!='video/mp4'){
                this.msgBox = this.$message.error('文件格式不支持');
                return;
            }else if(file.size/1048576>5){
                this.msgBox = this.$message.error('文件不能大于5MB');
                return;
            }else{
                this.uploadFile(data.data,file);
            }
        },
        // 文件上传参数处理
        uploadFile(params,file){
            const formData = new FormData()
            formData.append('upload', file);
            let obj = {
                uid:file.uid,
                name:file.name,
                status:'uploading',
                row:params.current,
                col:this.configForm.allList[params.current].value.length,
                type:file.type
            }
            this.configForm.allList[params.current].value.push(obj);
            let len = this.configForm.allList[params.current].value.length;
            this.saveData(formData).then(res=>{
                this.configForm.allList[params.current].value[len-1].status = 'done';
                this.configForm.allList[params.current].value[len-1].uid = len;
                this.configForm.allList[params.current].value[len-1].url = res.data;
            }).catch(err=>{
                this.configForm.allList[params.current].value.splice(len-1,1)
            })
        },
        // 文件预览
        async handlePreview (file) {
            this.imageSrc = file.url;
            this.imageVisible = true;
        },
        async handlePreviewVideo (file) {
            this.videoSrc = file.url;
            this.videoVisible = true;
        },
        // 移除文件
        handleRemove(file){
            return new Promise((resolve)=>{
                this.configForm.allList[file.row].value.splice(file.col,1);
                return resolve(true)
            })
        },

        // 添加信息
        handleAddInfo(){
            this.configForm.allList.push({
                id:this.configForm.allList.length+1,
                title:'',
                type:'文本',
                value:'',
                scan:true,
            });
            this.showChain = false;
        },
        // 删除商品信息
        handleDelete(index){
            this.configForm.allList.splice(index,1);
            this.showChain = true;
        },
        // 取消
        handleCancel(){
            this.$store.dispatch('ToggleCrumb',["溯源管理"]);
            this.$router.push('/trace/index');
        },
        filterUploading(){
            return new Promise(resolve=>{
                this.configForm.allList.map(e=>{
                    if(e.type=='图片' || e.type == '视频'){
                        e.value.map(file=>{
                            if(file.status=='uploading'){
                                this.msgBox = this.$message.warning('有文件正在上传中，请稍后');
                                return resolve(false)
                            }
                        })
                    }
                })
                resolve(true)
            })
        },
        // 数据保存
        handleSave(){
            this.msgBox ? this.$message.destroy() : null;
            this.$refs.configForm.validate(valid=>{
                if(valid){
                    this.filterUploading().then(res=>{
                        if(res){
                            this.filterParams(this.configForm.allList).then(params=>{
                                this.$http(
                                    '/sass/product/infoInput',
                                    'POST',
                                    params,
                                    {},
                                    res=>{
                                        this.msgBox = this.$message.success('保存成功');
                                        setTimeout(()=>{
                                            this.handleCancel();
                                        },1300);
                                    },
                                    err=>{
                                        this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '保存失败')
                                    }
                                )
                            })
                        }
                    })
                }
            })
        },
        filterParams(data){
            return new Promise(resolve=>{
                let params = {
                    content:[],
                    batch_number:this.params.batch_number,
                    product_info_id:this.params.product_info_id,
                }
                data.map((e,i)=>{
                    params.content.push(e);
                    params.content[i].status = e.scan ? 1 : 0;
                    if(e.type!='文本'){
                        let detail = '['
                        e.value.map((d,j)=>{
                            if(j == e.value.length-1){
                                detail +=d.url+']';
                                params.content[i].detail = detail;
                            }else{
                                detail+=d.url+','
                            }
                        })
                    }else{
                        params.content[i].detail = e.value;
                    }
                })
                resolve(params)
            })
        },
    }
}
</script>

<style lang="less" scoped>
    .flex-label{
        display:flex;
        align-items: center;
        p{
            width:33%;
            margin:0;
        }
    }
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