import Cookies from 'js-cookie';

const app = {
    state:{
        sidebar:{
            opened: !+Cookies.get('sidebarStatus'),
            withoutAnimation:false,
        },
        device:'desktop',
        crumbList:JSON.parse(sessionStorage.getItem('crumbList')),
        showCrumb:true,
        selectedKeys:[],
    },
    mutations:{
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1)
            } else {
                Cookies.set('sidebarStatus', 0)
            }
            state.sidebar.opened = !state.sidebar.opened
            state.sidebar.withoutAnimation = false
        },
        CLOSE_SIDEBAR: (state, withoutAnimation) => {
            Cookies.set('sidebarStatus', 1)
            state.sidebar.opened = false
            state.sidebar.withoutAnimation = withoutAnimation
        },
        TOGGLE_DEVICE: (state, device) => {
            state.device = device
        },
        SET_CRUMBLIST: (state,crumbList) => {
            sessionStorage.setItem('crumbList',JSON.stringify(crumbList));
            state.crumbList = crumbList;
        },
        SET_SHOWCRUMB: (state,showCrumb) => {
            state.showCrumb = showCrumb;
        }
    },
    actions: {
        ToggleSideBar: ({ commit }) => {
          commit('TOGGLE_SIDEBAR')
        },
        CloseSideBar({ commit }, { withoutAnimation }) {
          commit('CLOSE_SIDEBAR', withoutAnimation)
        },
        ToggleDevice({ commit }, device) {
          commit('TOGGLE_DEVICE', device)
        },
        ToggleCrumb({commit},crumbList){
            commit('SET_CRUMBLIST',crumbList)
        },
        ToggleCrumbShow({commit},showCrumb){
            commit('SET_SHOWCRUMB',showCrumb)
        },
    }
}

export default app