import { getToken, setToken, removeToken } from '@/utils/auth';
import request from '@/utils/request'
const user = {
    state:{
        token:getToken(),
        user_id:sessionStorage.getItem('user_id') || '',
        company_id:sessionStorage.getItem('company_id') || '',
        company_name:sessionStorage.getItem('company_name') || '',
        status:sessionStorage.getItem('status') || '',
        cer:sessionStorage.getItem('certification'),

    },
    mutations:{
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_INFO: (state,data) => {
            state.user_id = data.user_id;
            state.company_id = data.company_id;
            state.company_name = data.company_name;
            state.status = data.status;

        },
        RESET_USER: (state) => {
            state.user_id = '';
            state.token = '';
            state.company_id = '';
            state.company_name = '';
            state.status = null;
        },
        RESET_ID:(state,id)=>{
            state.company_id = id;
        },
        SET_STATUS: (state,data) => {
            state.status = data;
        },

        SET_COMPANY_NAME: (state,data) => {
            state.company_name = data;
        },
        
        SET_CER: (state,data) => {
            state.cer = data;
        },
    },
    actions:{
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.user_name.trim();
            return new Promise((resolve, reject) => {
                request({
                    url:'/sass/user/login',
                    params:{},
                    headers:{
                        user_name:username,
                        password:userInfo.password
                    }
                }).then(response=>{
                    let data = response.payload;
                    commit('SET_TOKEN',data["token"]);
                    setToken(data["token"]);
                    commit('SET_INFO',data);
                    sessionStorage.setItem('user_id',data.user_id);
                    sessionStorage.setItem('company_id',data.company_id);
                    sessionStorage.setItem('company_name',data.company_name);
                    sessionStorage.setItem('status',data.status);
                    resolve(response);
                }).catch(error => {
                    console.log('登录失败',error);
                    reject(error)
                });
            })
        },
        
        // 前端登出
        Logout({ commit },user) {
            return new Promise((resolve, reject) => {
                request({
                    url:'/sass/user/logout',
                    params:{},
                }).then(response=>{
                    removeToken();
                    sessionStorage.clear();
                    commit('RESET_USER',user);
                    resolve(response.data);
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 存放当前账户状态到缓存
        SetStatus({ commit },status) {
        commit('SET_STATUS',status);
        sessionStorage.setItem('status',status);
        },
        // //当前公司名称
        SetCompanyName({commit},name){
            commit('SET_COMPANY_NAME',name);
            sessionStorage.setItem('company_name',name);
        },
        // 存放当前账户认证信息到缓存
        SetCertification({ commit },data) {
            commit('SET_CER',data);
            sessionStorage.setItem('certification',data);
        },
        // 重置企业ID
        toggleCompanyId({ commit }, id){
            commit('RESET_ID',id);
            sessionStorage.setItem('company_id',id)
        }
    }
}

export default user;