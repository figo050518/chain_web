import http from "@/utils/http.js";
const state={
    QRRecordInfo:{
        list:[],
        total:0
    },
    batchList:[]
}
const getters={
    QRRecordInfo: state => state.QRRecordInfo,
    batchList: state => state.batchList
}

const mutations={
    GET_QR_RECORD(state,payload){
        state.QRRecordInfo.list=payload.list,
        state.QRRecordInfo.total=payload.total
    },
    GET_BATCH_LIST(state,payload){
        state.batchList=payload.list
    }

}
const actions={
    getQRRecordList({commit},params={}){
        console.log("二维码列表params",params);
      //   return new Promise((resolve)=>{
      //       let list=[
      //           {
      //             id: "234343434334",
      //             product_name: "太阳出来了",
      //             batch_number: "2021063023654",
      //             quantity: "10000",
      //             code_quantity: "10000",
      //             status: 0,
      //             created_at: "2021-06-30 12:55:26",
      //             // tags: ["nice", "developer"]
      //           },
      //           {
      //             id: "234343434335",
      //             product_name: "太阳出来了",
      //             batch_number: "2021063023654",
      //             quantity: "10000",
      //             code_quantity: "10000",
      //             status: 1,
      //             created_at: "2021-06-30 12:55:26",
      //           },
      //           {
      //             id: "234343434336",
      //             product_name: "太阳出来了",
      //             batch_number: "2021063023654",
      //             quantity: "10000",
      //             code_quantity: "10000",
      //             status: 0,
      //             created_at: "2021-06-30 12:55:26",
      //           },
      //           {
      //               id: "234343434337",
      //               product_name: "太阳出来了",
      //               batch_number: "2021063023654",
      //               quantity: "10000",
      //               code_quantity: "10000",
      //               status: 0,
      //               created_at: "2021-06-30 12:55:26"
      //             },
      //             {
      //               id: "234343434338",
      //               product_name: "太阳出来了",
      //               batch_number: "2021063023654",
      //               quantity: "10000",
      //               code_quantity: "10000",
      //               status: 1,
      //               created_at: "2021-06-30 12:55:26",
      //             },
      //             {
      //               id: "234343434339",
      //               product_name: "太阳出来了",
      //               batch_number: "2021063023654",
      //               quantity: "10000",
      //               code_quantity: "10000",
      //               status: 0,
      //               created_at: "2021-06-30 12:55:26",
      //             },
      //             {
      //               id: "234343434340",
      //               product_name: "太阳出来了",
      //               batch_number: "2021063023654",
      //               quantity: "10000",
      //               code_quantity: "10000",
      //               status: 0,
      //               created_at: "2021-06-30 12:55:26"
      //             },
      //             {
      //               id: "234343434341",
      //               product_name: "太阳出来了",
      //               batch_number: "2021063023654",
      //               quantity: "10000",
      //               code_quantity: "10000",
      //               status: 1,
      //               created_at: "2021-06-30 12:55:26",
      //             },
      //             {
      //               id: "234343434342",
      //               product_name: "太阳出来了",
      //               batch_number: "2021063023654",
      //               quantity: "10000",
      //               code_quantity: "10000",
      //               status: 0,
      //               created_at: "2021-06-30 12:55:26",
      //             },
      //             {
      //               id: "234343434343",
      //               product_name: "太阳出来了",
      //               batch_number: "2021063023654",
      //               quantity: "10000",
      //               code_quantity: "10000",
      //               status: 0,
      //               created_at: "2021-06-30 12:55:26"
      //             },
      //             {
      //               id: "234343434344",
      //               product_name: "太阳出来了",
      //               batch_number: "2021063023654",
      //               quantity: "10000",
      //               code_quantity: "10000",
      //               status: 1,
      //               created_at: "2021-06-30 12:55:26",
      //             },
      //             {
      //               id: "234343434345",
      //               product_name: "太阳出来了",
      //               batch_number: "2021063023654",
      //               quantity: "10000",
      //               code_quantity: "10000",
      //               status: 0,
      //               created_at: "2021-06-30 12:55:26",
      //             }
      //         ]
      //         let total=list.length;
      //         list.map((e) => {
      //           e.name_isCopy = false;
      //           e.no_isCopy = false;
      //         });
      //       commit('GET_QR_RECORD',{list,total});
      //       resolve(true);
      // });

       return  new Promise((resolve)=>{
       http("/sass/qrcode/query","GET",params,{},
       res=>{
         commit('GET_QR_RECORD',{list:res.payload.data,total:res.payload.counts});
         resolve(true)
       },
       err=>{
         // this.$message.error('操作失败');
       })

       })
      
    },
    getBatchList({commit},params={}){
        // let list=[
        //     {
        //     value: "",
        //     label: "全部",
        //   },
        //   {
        //     value: "0",
        //     label: "批次1",
        //   },
        //   {
        //     value: "1",
        //     label: "批次2",
        //   }
        // ]
        // commit("GET_BATCH_LIST",{list});

        http("/sass/batch/number","GET",params,{},
        res=>{
          let list=res.payload
          commit("GET_BATCH_LIST",{list});
        },
        err=>{
          console.log(`err`, err);
        })

      


    }
}

export default {
    namespaced:true,
    state,
    getters,
    mutations,
    actions
}