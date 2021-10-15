import axios from 'axios';

const service = axios.create({
    baseURL: VUE_APP_BASE_URL, // api base_url
    timeout: 6000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
    },
});

service.interceptors.request.use(
    config => {
        let token = sessionStorage.getItem('token');
        if (token) {
            config.headers['token'] = token;
        }
        return config;
    },
    err => {
        return Promise.reject('error')
    }
)

service.interceptors.response.use(
    response => {
        if(response.status == 200){
            if(response.data.rspCode == 0){
                return Promise.resolve(response.data);
            }else{
                return Promise.reject(response.data);
            }
        }else{
            return Promise.reject(response.data);
        }
    },
    error => {
        console.log('error',error)
        if(error.message.includes('timeout of')){
            return Promise.reject({
                rspCode:'-1',
                rspMsg:'请求超时，请稍后再试'
            })
        }else if(error.message.includes('Network Error')){
            return Promise.reject({
                rspCode:'-2',
                rspMsg:'服务器异常'
            })
        }else{
            return Promise.reject({
                rspCode:'-3',
                rspMsg:''
            })
        }
    }
)

export default service;