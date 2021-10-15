const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
    lintOnSave:false,
    outputDir:"dist",
    publicPath:"./",
    devServer:{
        port:9005,
    },
    productionSourceMap:false,
    css: {
        loaderOptions: {
          less: {
            modifyVars: {
              'primary-color': '#1890FF',
              'layout-color': '#1890FF',
            //   'border-radius-base': '4px'
            },
            // DO NOT REMOVE THIS LINE
            javascriptEnabled: true
          }
        }
    },
    configureWebpack:{
        plugins:[
            new CompressionWebpackPlugin({
                filename:"[path].gz[query]",
                algorithm: "gzip",
                test: /\.js$|\.html$|.\css$|\.otf$|\.ttf/, // 匹配文件名
                threshold: 10240, //对10K以上的数据进行压缩
                minRatio: 0.8,
                deleteOriginalAssets: false // 不删除源文件
            })
        ]
    },
    chainWebpack:config=>{
        config.optimization.minimize(true)
        config.optimization.splitChunks({
            chunks:"all"
        });
        config.module.rule('images')
        .test(/\.jpg|jpeg|png|gif|svg(\?.*)?$/)
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({ bypassOnDebug: true })
    }
}