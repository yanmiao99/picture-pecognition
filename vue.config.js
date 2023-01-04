module.exports = {
    outputDir: 'dist',
    publicPath: './',
    devServer: {
        // 自动打开浏览器
        open: true,
        disableHostCheck: true,
        proxy: {
            '/': {
                target: 'http://139.224.119.139:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
}
