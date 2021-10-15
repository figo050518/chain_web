import http from "@/utils/http.js";

const state = {
    traceTempInfo: {
        list: [],
        total: 0
    },
    traceDetailInfo: [],
    productList: [],
    initialCert: {},
    certInfo: {},
    miniModalList: [],
    miniModalConfig: {}

}
const getters = {
    traceTempInfo: state => state.traceTempInfo,
    traceDetailInfo: state => state.traceDetailInfo,
    productList: state => state.productList,
    initialCert: state => state.initialCert,
    certInfo: state => state.certInfo,
    miniModalList: state => state.miniModalList,
    miniModalConfig: state => state.miniModalConfig
}

const mutations = {
    GET_TRACE_TEMP(state, payload) {
        state.traceTempInfo.list = payload.list,
            state.traceTempInfo.total = payload.total
    },
    GET_TRACE_DETAIL(state, payload) {
        state.traceDetailInfo = payload.list
    },
    GET_PRODUCT_LIST(state, payload) {
        state.productList = payload.list
    },
    GET_INNITAL_CERT(state, payload) {
        state.initialCert = payload
    },
    GET_CERT_INFO(state, payload) {
        state.certInfo = payload
    },
    GET_MINI_LIST(state, payload) {
        state.miniModalList = payload.list
    },
    GET_MINI_CONFIG(state, payload) {
        state.miniModalConfig = payload
    }

}
const actions = {
    getTraceTempList({ commit }, params = {}) {
        console.log("溯源模板=列表params", params);
        return new Promise((resolve) => {
            http("/sass/template/queryAll", "GET", params, {},
                res => {
                    let list = res.payload.data || []
                    list.map((e) => {
                        e.name_isCopy = false;
                        e.createPerson = sessionStorage.getItem('user')
                    });
                    commit('GET_TRACE_TEMP', { list, total: res.payload.counts });
                    resolve(true);
                },
                err => {
                    console.log(`err`, err);
                })
        });
    },
    getTraceDetail({ commit }, params = {}) {
        console.log("溯源模板=详情params", params);
        return new Promise((resolve) => {
            http("/sass/template/query", "GET", params, {},
                res => {
                    let list = res.payload || []
                    let result = [];
                    if (list.length != 0) {
                        console.log("-------")
                        console.log(list)
                        list.map((e, i) => {
                            result.push(e);
                            if (e.content && e.content.length!=0) {
                                e.content.map((c, j) => {
                                    if (c.type != '文本') {
                                        // result[i].content[j].value = [];
                                        // let detail = c.detail ?
                                        //     c.detail.indexOf(',') > -1 ?
                                        //         c.detail.split('[')[1].split(']')[0].split(',') :
                                        //         [c.detail.split('[')[1].split(']')[0]] :
                                        //     [];
                                        let detail=[]
                                        if (c.detail) {
                                            if (c.detail.indexOf(',') > -1) {
                                              detail = c.detail.replace(/[\[\]\"\s]/g, '').split(',')
                                            } else {
                                              let arr = []
                                              arr.push(c.detail.replace(/[\[\]\"\s]/g, ''))
                                              detail = arr
                                            }
                                          } 
                                          c.detail = detail.map((m, k) => {
                                            let obj = {
                                                uid: k,
                                                name: k + 'detail',
                                                status: 'done',
                                                url: m,
                                                order: i,
                                                row: j,
                                                col: k,
                                            }
                                            return obj
                                            // result[i].content[j].value.push(obj)
                                        })
                                        // c.detail=result[i].content[j].value

                                    } else {
                                        console.log("c.detail",c.detail)

                                    }
                                })
                            } else {
                                result[i].content = [];
                            }
                        })

                    }
                    
                    commit('GET_TRACE_DETAIL', { list:result });
                    resolve(true);
                },
                err => {
                })
        });

    },
    getProductList({ commit }, params = {}) {
        return new Promise((resolve,reject)=>{
            http(
            '/sass/product/queryName',
            'GET',
            params,
            {},
            res => {
                commit("GET_PRODUCT_LIST", { list: res.payload || [] });
                resolve(true);
            },
            err => {
                console.log(err);
            }
        )
        })

    },
    //证书配置
    fetchInitalCert({ commit }, params = {}) {
        return new Promise((resolve) => {
            http(
                '/sass/cert/query',
                'GET',
                params,
                {},
                res => {
                    let obj1 = res.payload
                    let obj = {};
                    for (const key in obj1) {
                        if (Object.hasOwnProperty.call(obj1, key)) {
                            const element = obj1[key];
                            if (key != "chain_name" && key != "upload_name" && key != "company_id") {
                                if (element == "true") {
                                    obj[key] = true
                                } else if (element == "false") {
                                    obj[key] = false
                                }
                            }
                            else {
                                obj[key] = element
                            }
                        }
                    }
                    commit("GET_INNITAL_CERT", obj)
                    resolve(true)
                },
                err => {
                    console.log(err);
                }
            )
        })
    },
    //证书内容
    fetchCertContent({ commit }, params = {}) {
        return new Promise((resolve) => {
            let obj2 = {
                chain_name: "",
                block_height: "6536731",
                block_time: "2019-09-11 11:32:27",
                txid: "0f148bfd4fc566a9d323c9a9ea6ec05fc6006459953894cdb2e57d4",
                upload_name: "",
                upload_prove: "91441881MA51RR1P93",
                upload_time: "2019-06-14 14:57:43"
            }
            commit("GET_CERT_INFO", obj2)
            resolve(true)
        })

    },
    //小程序模板列表
    getMiniList({ commit }, params = {}) {
        return new Promise((resolve) => {
            http("/sass/applets/queryList", "GET", params, {},
                res => {
                    let list = res.payload || []
                    let initailModal={}
                    list.map(item => {
                        item.warn1 = item.warning_module === "" ? "1" : "2"
                        if(item.applets_id==1){
                            initailModal=item
                        }
                    })

                    commit('GET_MINI_LIST', { list });
                    initailModal.warn1 = initailModal.warning_module === "" ? "1" : "2",
                    commit('GET_MINI_CONFIG', initailModal);
                    resolve(true);
                },
                err => {
                    // this.$message.error('操作失败');
                })
        })
    },
    //小程序模板配置
    fetchInitalMini({ commit }, params = {}) {
        return new Promise((resolve) => {
            http("/sass/applets/queryList", "GET", params, {},
                res => {
                    let list = res.payload || []
                    let initailModal={}
                    list.map(item => {
                        if(item.applets_id==1){
                            initailModal=item
                        }
                    })
                    initailModal.warn1 = initailModal.warning_module === "" ? "1" : "2",
                    commit('GET_MINI_CONFIG', initailModal);
                    resolve(true);
                },
                err => {
                    // this.$message.error('操作失败');
                })

        })

    }

}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}