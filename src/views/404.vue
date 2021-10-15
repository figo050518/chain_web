<template>
    <div class="not-found">
        <a-result status="404" title="404" sub-title="抱歉，您访问的页面不存在">
            <template #extra>
            <a-button type="primary" @click="backHome">
                返回首页
            </a-button>
            </template>
        </a-result>
    </div>
</template>

<script>
export default {
    methods:{
        backHome(){
            this.$router.replace('/overview/index');
        }
    }
}
</script>

<style lang="less" scoped>
    .not-found{
        width:100vw;
        height:100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>