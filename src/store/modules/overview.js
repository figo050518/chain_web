import http from "@/utils/http.js";
const state = {
    scanDataQuery: [],
    spreadDataQuery: [],
    productNum: [],
    blockInfo: {},
    identifyInfo: 0
}
const getters = {
    scanDataQuery: state => state.scanDataQuery,
    spreadDataQuery: state => state.spreadDataQuery,
    productNum: state => state.productNum,
    blockInfo: state => state.blockInfo,
    identifyInfo: state => state.identifyInfo
}

const mutations = {
    GET_SCAN_DATA(state, payload) {
        state.scanDataQuery = payload.list
    },
    GET_SPREAD_DATA(state, payload) {
        state.spreadDataQuery = payload.list
    },
    GET_PRODUCT_DATA(state, payload) {
        state.productNum = payload.list
    },
    GET_BLOCK_DATA(state, payload) {
        state.blockInfo = payload
    },
    GET_IDENTIFY_DATA(state, payload) {
        state.identifyInfo = payload
    }

}
const actions = {
    //扫码趋势
    getScanChartsData({ commit }, params = {}) {
        return new Promise((resolve) => {
            // let list = [
            //     {
            //         date: "Jan",
            //         num: 302
            //     }
            // ]
            // commit('GET_SCAN_DATA', { list });
            // resolve(true);
            http("/sass/overview/scanStatistics", "GET", params, {},
            res => {
                let list=res.payload || []
                commit('GET_SCAN_DATA', { list });
                resolve(true);
            },
            err => {
                console.log("失败err", err);
            })
        });
    },
    //扫码分布
    getSpreadChartsData({ commit }, params = {}) {
        return new Promise((resolve) => {
            // let list = [
            //     { city: "南京", num: 351 },
            //     { city: "西宁", num: 580 },
            // ]
            // commit('GET_SPREAD_DATA', { list });
            // resolve(true);
           

            http("/sass/overview/scanningDistribution", "GET", params, {},
            res => {
                let list=res.payload || []
                let max
                if(list.length!=0){
                    max = list[0].num;
                    for (let i = 0; i < list.length - 1; i++) {
                        max = max < list[i+1].num ? list[i+1].num : max
                    }
                }

                commit('GET_SPREAD_DATA', { list });
                resolve(max);
            },
            err => {
                console.log("失败err", err);
            })
        });

       

    },
    //商品统计
    getProductNum({ commit }, params = {}) {
        return new Promise((resolve) => {
            http("/sass/overview/product", "GET", params, {},
                res => {
                    let list = res.payload.statistics || []
                    commit('GET_PRODUCT_DATA', { list });
                    resolve(res);
                },
                err => {
                    console.log("失败err", err);
                })

        });


    },
    //banner统计
    getBlockData({ commit }, params = {}) {
        return new Promise((resolve) => {
            http("/sass/overview/blockchain", "GET", params, {},
                res => {
                    let obj = res.payload
                    commit('GET_BLOCK_DATA', obj);
                    resolve(true);
                },
                err => {
                    console.log("失败err", err);
                })
        });

    },
    getIdentifyData({ commit }, params = {}) {
        return new Promise((resolve) => {
            http("/sass/overview/qrcode", "GET", params, {},
                res => {
                    commit('GET_IDENTIFY_DATA', res.payload);
                    resolve(true);
                },
                err => {
                    console.log("失败err", err);
                })
        });


    }



}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}