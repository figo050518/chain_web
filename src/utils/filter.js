import Vue from 'vue'
import moment from 'moment'


//加载moment第三方包格式化时间
Vue.filter('filterDate', (value, pattern) => {
    if (value === null) return;
    // if (!value) { value = new Date() }
    return moment(value).format(pattern || "YYYY-MM-DD HH:mm:ss");
})