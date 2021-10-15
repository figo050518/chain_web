const getters = {
    sidebar:state => state.app.sidebar,
    device:state => state.app.device,
    crumbList:state => state.app.crumbList,
    showCrumb:state => state.app.showCrumb,

    token:state => state.user.token,
    user_id:state => state.user.user_id,
    status: state => {
      return JSON.parse(state.user.status) 
    },
    cer:state => {
      return JSON.parse(state.user.cer)
    },
    company_id:state => {
          return JSON.parse(state.user.company_id) 
        },
    company_name:state=>state.user.company_name
}

export default getters;