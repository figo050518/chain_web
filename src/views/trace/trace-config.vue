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
    <div class="def-card animate__animated animate__zoomIn"
         style="margin-top:16px;padding:20px 0;">
      <div class="def-card-header"
           style="padding:0 20px;">
        <p class="def-card-title">溯源环节信息</p>
        <div style="display:flex;align-items:center;">
          <a-select v-model="model"
                    placeholder="选择溯源模板"
                    style="width:150px;margin-right:10px;">
            <a-select-option v-for="(item,index) in modelList"
                             :key="index"
                             :value="item">
              {{item}}
            </a-select-option>
          </a-select>
          <a-button type="primary"
                    :disabled="configForm.segmentList.length>0||!model"
                    style="margin-right:10px;"
                    @click="importModel">导入模板</a-button>
          <a-button type="primary"
                    :disabled="configForm.segmentList.length==0"
                    @click="modelVisible=true;">保存为模板</a-button>
        </div>
      </div>
      <a-spin :spinning="loading">
        <div v-if="configForm.segmentList.length==0">
          <a-list :data-source="[]" />
        </div>
        <div v-else>
          <a-collapse v-model="activeKey"
                      :bordered="false">
            <a-collapse-panel v-for="(item,order) in configForm.segmentList"
                              :key="order.toString()"
                              :style="order==0?'border-top:1px solid #d9d9d9;':''">
              <div slot="header">
                <span style="color:#000;font-weight:500;margin-right:10px;">{{item.pre_name}}</span>
                <span>
                  <a-tag :color="item.chain_status==0?'blue':'green'">{{item.chain_status==0?'未上链':'已上链'}}</a-tag>
                  <a v-if="item.chain_status==0 && item.showChain"
                     @click="handleChain(item)">上链</a>
                </span>
              </div>
              <div slot="extra"
                   style="display:flex;align-items:center;"
                   v-if="item.chain_status==0">
                <a-button v-if="item.editing"
                          type="link"
                          size="small"
                          @click="handleSave(item,order)">保存</a-button>
                <a-button v-if="item.editing"
                          type="link"
                          size="small"
                          @click="cancelSegment(order)">取消</a-button>
                <a-button v-if="!item.editing"
                          type="link"
                          size="small"
                          :disabled="item.disabled"
                          @click="editSegment(order)">编辑</a-button>
                <a-popconfirm v-if="!item.editing"
                              title="确定删除该环节?"
                              ok-text="确定"
                              cancel-text="取消"
                              @confirm="DeleteSegment(item,order)"
                              @cancel="return true;">
                  <a-button type="link"
                            size="small"
                            :disabled="item.disabled">删除</a-button>
                </a-popconfirm>
                <!-- <span style="display:inline-flex;flex-direction:column;margin-left:10px;">
                                    <a-icon 
                                        type="caret-up" 
                                        :style="order==0?'cursor:not-allowed;color:rgba(0,0,0,.2);':'cursor:pointer;'"
                                    />
                                    <a-icon 
                                        type="caret-down" 
                                        :style="order==Number(configForm.segmentList.length-1)?'cursor:not-allowed;color:rgba(0,0,0,.2);':'cursor:pointer;'" 
                                    />
                                </span> -->
              </div>
              <a-form-model ref="configForm"
                            :model="item">
                <a-form-model-item v-if="item.editing"
                                   label="环节名称编辑"
                                   prop="process_name"
                                   required
                                   :rules="[{required:true,message:'请填写环节名称',trigger:['blur','change']}]"
                                   style="display:flex;">
                  <a-input v-model="item.process_name"
                           style="width:200px;"></a-input>
                </a-form-model-item>
                <a-table :row-key="record => record.id"
                         :columns="columns"
                         :data-source="item.content"
                         :pagination="false">
                  <template slot="slot-title"
                            slot-scope="text,record,index">
                    <span v-if="!item.editing">{{text}}</span>
                    <a-form-model-item v-else
                                       :prop="'content.'+index+'.title'"
                                       required
                                       :rules="[
                                                {required:true,message:'请填写标题',trigger:['blur','change']},
                                                {min:1,max:12,message:'最大支持12位字符',trigger:['blur','change']}
                                            ]">
                      <a-input v-model="record.title"
                               placeholder="请输入标题"></a-input>
                    </a-form-model-item>
                  </template>
                  <template slot="type"
                            slot-scope="text,record,index">
                    <span v-if="!item.editing">{{text}}</span>
                    <a-form-model-item v-else
                                       :prop="'content.'+index+'.type'"
                                       required>
                      <a-select v-model="record.type"
                                style="width: 120px"
                                @change="handleSelect(order,record.type,index)">
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
                  <template slot="value"
                            slot-scope="text,record,index">
                    <span v-if="!item.editing">
                      <span v-if="record.type=='文本'">{{text}}</span>
                      <ul v-if="record.type=='图片'"
                          style="padding:0;display:flex;align-items:center;">
                        <li v-for="(image,j) in record.value"
                            :key="j"
                            style="margin-right:5px;width:78px;height:78px;padding:5px;border-radius:4px;border:1px solid #d9d9d9;">
                          <img :src="image.url"
                               style="width:100%;height:100%;">
                        </li>
                      </ul>
                      <ul v-if="record.type=='视频'"
                          style="padding:0;display:flex;align-items:center;">
                        <li v-for="(video,j) in record.value"
                            :key="j"
                            style="margin-right:5px;width:78px;height:78px;padding:5px;border-radius:4px;border:1px solid #d9d9d9;">
                          <video class="el-upload-list__item-thumbnail"
                                 style="width:100%;height:100%;">
                            <source :src="video.url">
                          </video>
                        </li>
                      </ul>
                    </span>
                    <span v-else
                          style="display:flex;align-items:center;">
                      <a-form-model-item v-if="record.type=='文本'"
                                         :prop="'content.'+index+'.value'"
                                         required
                                         :rules="[
                                                    {required:true,message:'请填写内容',trigger:['blur','change']},
                                                    {min:1,max:128,message:'最大支持128个字符',trigger:['blur','change']}
                                                ]">
                        <a-input v-model="record.value"
                                 placeholder="请输入内容"></a-input>
                      </a-form-model-item>
                      <!-- <a-icon 
                                                v-if="record.type=='text'" 
                                                type="link"
                                                style="margin:0 3px;margin-top:-27px;cursor:pointer;color:#1890ff;"  
                                                @click="handleLink(order,record,index)"
                                            ></a-icon>
                                            <a-form-model-item 
                                                v-if="record.type=='text'&&record.link" 
                                                :prop="'content.'+index+'.url'" 
                                                required
                                                :rules="[
                                                    {required:true,message:'请填写链接',trigger:['blur','change']},
                                                    {min:1,max:128,message:'最大支持128个字符',trigger:['blur','change']}
                                                ]"
                                            >
                                                <a-input v-model="record.url" placeholder="请填写链接"></a-input>
                                            </a-form-model-item> -->
                      <a-form-model-item v-if="record.type=='图片'"
                                         :prop="'content.'+index+'.value'"
                                         required
                                         :rules="[{required:true,message:'请上传图片',trigger:['blur','change']}]"
                                         style="display:flex;align-items:center;">
                        <a-upload v-model="text"
                                  accept="image/png,image/jpeg"
                                  list-type="picture-card"
                                  :file-list="record.value"
                                  name="upload"
                                  @preview="handlePreview"
                                  :remove="handleRemove"
                                  :customRequest="customIRequest"
                                  :data="{order:order,current:index,record:record}">
                          <a-icon type="plus" />
                        </a-upload>
                      </a-form-model-item>
                      <a-form-model-item v-if="record.type=='视频'"
                                         :prop="'content.'+index+'.value'"
                                         required
                                         :rules="[{required:true,message:'请上传视频文件',trigger:['blur','change']}]"
                                         style="display:flex;align-items:center;">
                        <a-upload v-if="record.value.length==0 || record.value[0].status=='uploading'"
                                  v-model="text"
                                  accept="video/mp4"
                                  list-type="picture-card"
                                  :file-list="record.value"
                                  name="upload"
                                  @preview="handlePreviewVideo"
                                  :remove="handleRemove"
                                  :customRequest="customVRequest"
                                  :data="{order:order,current:index,record:record}">
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
                            <a-icon type="delete"
                                    style="cursor:pointer;font-size:16px;margin-left:6px;color:#fff;"
                                    @click="handleRemove(record.value[0])" />
                          </div>
                        </div>
                      </a-form-model-item>
                    </span>
                  </template>
                  <template slot="scan"
                            slot-scope="text,record">
                    <a-switch v-model="record.scan"
                              :disabled="!item.editing" />
                  </template>
                  <template slot="action"
                            slot-scope="text,record,index">
                    <span v-if="!item.editing">删除</span>
                    <a-popconfirm v-else
                                  title="确定删除该条信息?"
                                  ok-text="确定"
                                  cancel-text="取消"
                                  @confirm="handleDelete(order,index)"
                                  @cancel="return true;">
                      <a>删除</a>
                    </a-popconfirm>
                  </template>
                </a-table>
                <a-button type="dashed"
                          icon="plus"
                          size="large"
                          style="font-size:14px;margin:16px 24px 24px;width:calc(100% - 48px);text-align:center;"
                          @click="handleAddInfo(order)"
                          v-if="item.editing">添加新的一行信息</a-button>
              </a-form-model>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <a-button type="dashed"
                  icon="plus"
                  size="large"
                  :disabled="!canAddSegment"
                  style="font-weight:bold;margin:16px 24px 24px;width:calc(100% - 48px);text-align:center;"
                  @click="handleAddSegment">添加溯源环节</a-button>
      </a-spin>
    </div>

    <a-modal title="预览"
             :visible="imageVisible"
             :footer="null"
             @cancel="imageVisible=false;">
      <img alt="example"
           style="width: 100%"
           :src="imageSrc" />
    </a-modal>
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

    <!-- 保存为模板弹窗 -->
    <a-modal title="保存为模板"
             :visible="modelVisible"
             :confirm-loading="saveLoading"
             @ok="saveAsModel"
             @cancel="saveCancel">
      <a-spin :spinning="saveLoading">
        <a-form-model ref="modelForm"
                      :model="modelForm">
          <a-form-model-item label="模板名称"
                             prop="board_name"
                             required
                             :rules="[
                            {required:true,message:'请填写模板名称',trigger:['blur','change']},
                            {min:1,max:16,message:'最多输入16个字符',trigger:'change'}
                        ]">
            <a-input v-model="modelForm.board_name"
                     placeholder="请输入模板名称"></a-input>
          </a-form-model-item>
        </a-form-model>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data () {
    return {
      loading: false,
      params: {
        batch_number: '',
        product_name: ''
      },

      // 保存为模板相关参数
      modelVisible: false,
      saveLoading: false,
      modelForm: {
        board_name: '',
      },

      // 模板选择相关参数
      model: undefined,
      modelList: [],               //溯源模板列表

      canAddSegment: true,
      activeKey: [],
      configForm: {
        segmentList: [],         //所有展示在流程列表中的流程数据
      },
      savedSegment: [],            //已经存入数据库的流程数据
      columns: [
        {
          title: '标题',
          dataIndex: 'title',
          width: 200,
          scopedSlots: { customRender: 'slot-title' }
        },
        {
          title: '类型',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        {
          title: '内容',
          dataIndex: 'value',
          scopedSlots: { customRender: 'value' }
        },
        {
          title: '扫码展示',
          dataIndex: 'scan',
          width: 120,
          scopedSlots: { customRender: 'scan' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: 100,
          scopedSlots: { customRender: 'action' }
        },
      ],

      // 预览相关信息
      imageVisible: false,
      imageSrc: '',
      videoVisible: false,
      videoSrc: '',

      msgBox: null,
    }
  },
  created () {
    this.params = {
      batch_number: this.$route.params.batch_number,
      product_name: this.$route.query.product_name,
    }
    this.getConfigInfo();
    this.getModelList();
  },
  methods: {
    // 溯源模板列表拉取
    getModelList () {
      this.msgBox ? this.$message.destroy() : null;
      this.$http(
        '/sass/template/queryList',
        'GET',
        {
          company_id: Number(this.$store.getters.company_id),
          product_name: this.params.product_name,
        },
        {},
        res => {
          this.modelList = res.payload || [];
        },
        err => {
          this.msgBox = this.$message.error('拉取模板列表失败')
        }
      )
    },
    // 导入模板
    importModel () {
      this.msgBox ? this.$message.destroy() : null;
      this.loading = true;
      this.$http(
        '/sass/template/query',
        'GET',
        {
          company_id: Number(this.$store.getters.company_id),
          product_name: this.params.product_name,
          board_name: this.model,
        },
        {},
        res => {
          let result = JSON.parse(JSON.stringify(res.payload));
          this.handleModelSave(result).then(() => {
            this.$message.success('导入成功');
            this.getConfigInfo();
          })
        },
        err => {
          this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '导入模板失败');
        }
      )
    },
    // 导入模板时获取到的模板立刻保存
    handleModelSave (list) {
      return new Promise((resolve) => {
        list.map((e, i) => {
          let params = {
            company_id: Number(this.$store.getters.company_id),
            batch_number: this.params.batch_number,
            alias_name: (Math.random() * 1000000).toFixed(0),
            process_name: e.process_name,
            content: e.content
          }
          this.$http(
            '/sass/process/input',
            "POST",
            params,
            {},
            res => {
              if (i == list.length - 1) {
                resolve(true);
              }
            },
            err => {
              this.loading = false;
              this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '保存失败')
            }
          )
        })
      })
    },
    // 保存为模板
    saveAsModel () {
      this.msgBox ? this.$message.destroy() : null;
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          this.saveLoading = true;
          this.filterModel(this.configForm.segmentList).then(params => {
            this.$http(
              '/sass/template/input',
              'POST',
              params,
              {},
              res => {
                this.modelVisible = false;
                this.saveLoading = false;
                this.msgBox = this.$message.success('保存成功')
              },
              err => {
                this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '保存失败')
              }
            )
          });
        }
      })

    },
    filterModel (segmentList) {
      return new Promise(resolve => {
        let params = {
          board_name: this.modelForm.board_name,
          product_name: this.params.product_name,
          company_id: Number(this.$store.getters.company_id),
          process: [],
        };
        segmentList.map((e, i) => {
          let obj = {
            process_name: e.process_name,
            content: [],
          }
          e.content.map((c, j) => {
            let obj1 = {
              title: c.title,
              type: c.type,
              detail: '',
              status: c.scan ? 1 : 0,
            }
            if (c.type != '文本') {
              let detail = '['
              c.value.map((d, k) => {
                if (k == c.value.length - 1) {
                  detail += d.url + ']';
                  obj1.detail = detail;
                } else {
                  detail += d.url + ','
                }
              })
            } else {
              obj1.detail = c.value;
            }
            obj.content.push(obj1)
          })
          params.process.push(obj)
        })
        resolve(params)
      })
    },
    saveCancel () {
      this.$refs.modelForm.resetFields();
      this.modelVisible = false;
      this.saveLoading = false;
    },
    // 获取配置信息
    getConfigInfo () {
      this.msgBox ? this.$message.destroy() : null;
      this.loading = true;
      this.$http(
        '/sass/process/query',
        'GET',
        {
          company_id: this.$store.getters.company_id,
          batch_number: this.params.batch_number,
        },
        {},
        res => {
          this.loading = false;
          this.canAddSegment = true;
          this.filterInfo(res.payload).then(data => {
            this.configForm.segmentList = data;
            this.savedSegment = JSON.parse(JSON.stringify(data));
          })
        },
        err => {
          this.loading = false;
          this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '获取溯源详情失败')
        }
      )
    },
    filterInfo (data) {
      return new Promise(resolve => {
        let result = [];
        if (data) {
          data.map((e, i) => {
            this.activeKey.push(i.toString())
            result.push(e);
            result[i].pre_name = e.process_name;
            result[i].showChain = true;
            result[i].editing = false;
            result[i].disabled = false;
            if (e.content) {
              e.content.map((c, j) => {
                result[i].content[j].scan = c.status == 0 ? false : true;
                if (c.type != '文本') {
                  result[i].content[j].value = [];
                  let detail = c.detail ?
                    c.detail.indexOf(',') > -1 ?
                      c.detail.split('[')[1].split(']')[0].split(',') :
                      [c.detail.split('[')[1].split(']')[0]] :
                    [];
                  detail.map((m, k) => {
                    let obj = {
                      uid: k,
                      name: k + 'detail',
                      status: 'done',
                      url: m,
                      order: i,
                      row: j,
                      col: k,
                    }
                    result[i].content[j].value.push(obj)
                  })
                } else {
                  result[i].content[j].value = c.detail;
                }
              })
            } else {
              result[i].content = [];
            }
          })
        }
        resolve(result)
      })
    },
    // 新增环节
    handleAddSegment () {
      this.configForm.segmentList.map(e => {
        e.disabled = true;
      })
      let obj = {
        process_name: '新增环节',
        pre_name: '新增环节',
        editing: true,
        disabled: false,
        showChain: false,
        chain_status: 0,
        content: [
          {
            id: 1,
            title: '',
            type: '文本',
            value: '',
            scan: true,
          }
        ],
      }
      this.configForm.segmentList.push(obj);
      this.activeKey = [(this.configForm.segmentList.length - 1).toString()];
      this.canAddSegment = false;
    },
    // 新增一行新的信息
    handleAddInfo (order) {
      let len = this.configForm.segmentList[order].content.length;
      this.configForm.segmentList[order].content.push({
        id: len + 1,
        title: '',
        type: '文本',
        value: '',
        scan: true,
      })
      this.configForm.segmentList[order].showChain = false;
    },
    // 删除一行消息
    handleDelete (order, index) {
      if(this.savedSegment[order]){
        if (!this.savedSegment[order].content[index]) {
          this.configForm.segmentList[order].showChain = true;
        } else {
          this.configForm.segmentList[order].showChain = false;
        }
      }
      this.configForm.segmentList[order].content.splice(index, 1);
    },

    // 控制类型选择器
    handleSelect (order, text, index) {
      this.configForm.segmentList[order].content[index].type = text;
      if (text != '文本') {
        this.configForm.segmentList[order].content[index].value = [];
      } else {
        this.configForm.segmentList[order].content[index].value = '';
      }
    },
    // // 控制链接展示与否
    // handleLink(order,record,index){
    //     this.configForm.segmentList[order].content.forEach((e,i)=>{
    //         if(i==index){
    //             this.configForm.segmentList[order].content[i].link = !record.link
    //         }
    //     })
    // },
    // 图片上传拦截
    customIRequest (data) {
      this.msgBox ? this.$message.destroy() : null;
      let file = data.file;
      if (file.type != 'image/png' && file.type != 'image/jpeg' && file.type != 'image/jpg') {
        this.msgBox = this.$message.error('文件格式不支持');
        return;
      } else if (file.size / 1048576 > 5) {
        this.msgBox = this.$message.error('文件不能大于5MB');
        return;
      } else {
        this.uploadFile(data.data, file);
      }
    },
    // 视频上传拦截
    customVRequest (data) {
      this.msgBox ? this.$message.destroy() : null;
      let file = data.file;
      if (file.type != 'video/mp4') {
        this.msgBox = this.$message.error('文件格式不支持');
        return;
      } else if (file.size / 1048576 > 5) {
        this.msgBox = this.$message.error('文件不能大于5MB');
        return;
      } else {
        this.uploadFile(data.data, file);
      }
    },
    // 文件上传参数处理
    uploadFile (params, file) {
      const formData = new FormData();
      let currentSegment = this.configForm.segmentList[params.order];
      formData.append('upload', file);
      let col = currentSegment.content[params.current].value.length;
      let obj = {
        uid: file.uid,
        name: file.name,
        status: 'uploading',
        order: params.order,
        row: params.current,
        col: col,
        type: file.type
      }
      currentSegment.content[params.current].value.push(obj);
      let len = currentSegment.content[params.current].value.length;
      this.saveData(formData).then(res => {
        currentSegment.content[params.current].value[len - 1].status = 'done';
        currentSegment.content[params.current].value[len - 1].uid = len;
        currentSegment.content[params.current].value[len - 1].url = res.data;
      }).catch(err => {
        currentSegment.content[params.current].value.splice(len - 1, 1)
      })
    },
    // 文件上传请求
    saveData (data) {
      this.msgBox ? this.$message.destroy() : null;
      return new Promise((resolve, reject) => {
        axios.post('http://139.159.146.109:9530/v1/file/upload', data).then(res => {
          if (res.status == 200 && res.data.errCode == 0) {
            resolve(res.data);
          } else {
            this.msgBox = this.$message.error('文件上传失败');
            reject(false)
          }
        }).catch(err => {
          this.msgBox = this.$message.error('文件上传失败');
          reject(false)
        })
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
    handleRemove (file) {
      return new Promise((resolve) => {
        this.configForm.segmentList[file.order].content[file.row].value.splice(file.col, 1);
        return resolve(true)
      })
    },

    // 流程上链
    handleChain (data) {
      let _this = this;
      _this.$confirm({
        title: "提示",
        content: "数据上链后不支持修改，是否继续？",
        okText: "继续",
        cancelText: "取消",
        onOk: () => {
          _this.$http(
            '/sass/process/onChain',
            'GET',
            { process_id: data.id },
            {},
            res => {
              _this.msgBox = _this.$message.success('上链成功');
              _this.getConfigInfo();
            },
            err => {
              _this.msgBox = _this.$message.error(_this.$errCode[err.rspCode] || '上链失败');
            }
          )
        },
      })
    },
    // 保存环节  --  如果环节是未保存的，则调新增接口，否则调修改接口
    handleSave (data, order) {
      this.activeKey = [(order + 1).toString()];
      setTimeout(() => {
        this.$refs.configForm[order].validate(valid => {
          if (valid) {
            this.filterParams(data).then(params => {
              if (!params) {
                return;
              }
              this.loading = true;
              let url;
              if (order > this.savedSegment.length - 1) {
                url = '/sass/process/input';
              } else {
                url = '/sass/process/update';
                params.id = data.id;
                params.created_at = data.created_at;
              }
              this.$http(
                url,
                "POST",
                params,
                {},
                res => {
                  this.loading = false;
                  this.getConfigInfo();
                  this.msgBox = this.$message.success('保存成功')
                },
                err => {
                  this.loading = false;
                  this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '保存失败')
                }
              )
            })
          }
        })
      }, 10)
    },
    // 参数整理
    filterParams (data) {
      return new Promise(resolve => {
        let params = {
          company_id: Number(this.$store.getters.company_id),
          batch_number: this.params.batch_number,
          process_name: data.process_name,
          alias_name: (Math.random() * 1000000).toFixed(0),
          content: data.content,
        };
        data.content.map((e, i) => {
          params.content[i].status = e.scan ? 1 : 0;
          if (e.type != '文本') {
            let detail = '['
            e.value.map((d, j) => {
              if (d.status == 'uploading') {
                this.msgBox = this.$message.warning('文件正在上传中，请稍后');
                return resolve(false)
              }
              if (j == e.value.length - 1) {
                detail += d.url + ']';
                params.content[i].detail = detail;
              } else {
                detail += d.url + ','
              }
            })
          } else {
            params.content[i].detail = e.value;
          }
        })
        resolve(params)
      })
    },
    // 删除环节   --  如果删除的环节还未保存则直接删除，如果已经保存就调用删除接口。
    DeleteSegment (item, order) {
      this.msgBox ? this.$message.destroy() : null;
      if (order > this.savedSegment.length - 1) {
        this.configForm.segmentList.splice(order, 1);
      } else {
        this.$http(
          '/sass/process/delete',
          'GET',
          {
            company_id: Number(this.$store.getters.company_id),
            id: item.id,
          },
          {},
          res => {
            this.getConfigInfo();
            this.msgBox = this.$message.success('删除成功')
          },
          err => {
            this.msgBox = this.$message.error(this.$errCode[err.rspCode] || '删除失败')
          }
        )
      }
    },
    // 编辑环节
    editSegment (order) {
      this.configForm.segmentList.map((e, i) => {
        if (i != order) {
          this.configForm.segmentList[i].disabled = true;
        }
      })
      this.activeKey = [(order + 1).toString()];
      this.configForm.segmentList[order].editing = true;
      this.canAddSegment = false;
    },
    // 环节取消编辑
    cancelSegment (order) {
      this.configForm.segmentList[order].editing = false;
      this.activeKey = [(order + 1).toString()];
      this.canAddSegment = true;
      this.configForm.segmentList.map(e => {
        e.disabled = false;
      })
    },
  }
}
</script>

<style lang="less" scoped>
.flex-label {
  display: flex;
  align-items: center;
  p {
    width: 33%;
    margin: 0;
  }
}
/deep/ .ant-upload-list-picture-card-container {
  width: 78px !important;
  height: 78px !important;
  .ant-upload-list-item {
    width: 78px !important;
    height: 78px !important;
  }
}
/deep/ .ant-upload-picture-card-wrapper {
  display: flex;
}
/deep/ .ant-upload-select {
  width: 78px !important;
  height: 78px !important;
}
/deep/ .ant-collapse {
  .ant-collapse-item-active {
    .ant-collapse-header {
      border-bottom: 1px solid #d9d9d9;
    }
  }
  .ant-collapse-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .ant-collapse-content {
    background: #fff !important;
  }
}
</style>