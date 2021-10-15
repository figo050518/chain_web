import request from './request';

let  $http = null;

$http = function(url,method,data,config,success,fail){
    request({
        method: method || 'GET',
        url: url,
        data: method!='GET' ? data : {},
        params:method == 'GET' ? data : {},
        headers:config || {}
    }).then(res=>{
        success && success(res)
    }).catch(err=>{
        fail && fail(err)
    })
}

export default $http;