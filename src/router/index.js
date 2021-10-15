import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: '/',
    name: 'Login',
    hidden:true,
    redirect:'/login',
    component: ()=>import('@/views/login.vue'),
    children:[{
      path:'login',
      component: ()=>import('@/views/login.vue'),
    }]
  },
  {
    path: '/user',
    name: 'register',
    hidden:true,
    component: ()=>import('@/views/register.vue'),
    children:[
      {
        path:'register',
        component: ()=>import('@/views/register.vue'),
      }
    ]
  },
  {
    path: '*',
    name: '404',
    hidden:true,
    component: ()=>import('@/views/404.vue'),
    children:[
      {
        path:'404',
        component: ()=>import('@/views/404.vue'),
      }
    ]
  },
  {
    path:'/overview',
    name:'overview',
    redirect:'/overview/index',
    meta:{
      title:'总览页',
      icon:'icon-zonglan1'
    },
    component:() => import ('@/views/index.vue'),
    children:[{
      path:'index',
      component:() => import('@/views/overview/index.vue')
    }]
  },
  {
    path:'/product',
    name:'product',
    meta:{
      title:'商品管理',
      icon:'icon-shangpinliebiao'
    },
    component:() => import ('@/views/index.vue'),
    children:[{
      path:'index',
      component:() => import('@/views/product/index.vue')
    }]
  },
  {
    path:'/trace',
    name:'trace',
    meta:{
      title:'溯源管理',
      icon:'icon-huaban4fuben2_'
    },
    component:() => import ('@/views/index.vue'),
    children:[
      {
        path:'index',
        component:() => import('@/views/trace/index.vue')
      },
      {
        path:'product-config/:product_info_id',
        title:'商品信息配置',
        hidden:true,
        component:() => import('@/views/trace/product-config.vue')
      },
      {
        path:'trace-config/:batch_number',
        title:'溯源信息配置',
        hidden:true,
        component:() => import('@/views/trace/trace-config.vue')
      }
    ]
  },
  {
    path:'/identify',
    name:'identify',
    meta:{
      title:'码包列表',
      icon:'icon-shengcheng'
    },
    component:() => import ('@/views/index.vue'),
    children:[
      {
        path:'record',
        title:'生成记录',
        component:() => import('@/views/identify/record.vue')
      },
    ]
  },
  {
    path:'/config',
    name:'config',
    meta:{
      title:'配置管理',
      icon:'icon-peizhi'
    },
    component:() => import ('@/views/index.vue'),
    children:[
      {
        path:'track',
        title:'溯源模板管理',
        component:() => import('@/views/config/trace-modal.vue')
      },
      // {
      //   path:'trace-template',
      //   title:'溯源模板配置',
      //   hidden:true,
      //   component:() => import('@/views/config/trace-template.vue')
      // },
      {
        path:'mini',
        title:'小程序模板管理',
        component:() => import('@/views/config/mini-modal.vue'),
      },
      // {
      //   path:'mini-config',
      //   title:'小程序模板配置',
      //   hidden:true,
      //   component:() => import('@/views/config/mini-config.vue')
      // },
      {
        path:'certificate',
        title:'溯源链证书配置',
        component:() => import('@/views/config/certificate.vue')
      }
    ]
  },
  //暂定
  {
    path:'/mini-config',
    name:'mini-config',
    hidden:true,
    component:() => import ('@/views/index.vue'),
    redirect:'/mini-config/index',
    children:[
      {
        path:'index',
        title:'小程序模板配置',
        component:() => import('@/views/config/mini-config.vue')
      },
    ]
  },
  {
    path:'/trace-template',
    name:'trace-template',
    hidden:true,
    component:() => import ('@/views/index.vue'),
    redirect:'/trace-template/index',
    children:[
      {
        path:'index',
        title:'溯源模板配置',
        component:() => import('@/views/config/trace-template.vue')
      },
    ]
  },

   
]

const router = new VueRouter({
  routes
})

export default router
