import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { getToken, setToken, removeToken } from '@/utils/auth';

router.beforeEach((to, from, next) => {
  NProgress.start();
  next();
  if (to.path == '/login') {
    removeToken();
    sessionStorage.clear();
  }
  if (to.path != '/login' && !getToken()) {
    if(to.path == '/user/register'){
      next();
    }else{
      next('/login');
    }
  } else {
    next();
  }
})

router.afterEach(() => {
  NProgress.done()
})