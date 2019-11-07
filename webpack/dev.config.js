// starter/webpack.config.js
import WebpackCommonConfig, { resolve } from './common.config';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

module.exports = merge(WebpackCommonConfig, {
  devServer: {
    contentBase: resolve('.'), // 告诉服务器从哪个目录中提供内容
    // ignored: /node_modules/,
    // aggregateTimeout: 300, //监听到变化发生后等300ms再去执行动作，防止文件更新太快导致编译频率太高
    // poll: 1000, //通过不停的询问文件是否改变来判断文件是否发生变化，默认每秒询问1000次
    historyApiFallback: true, // 启用当使用 HTML5 History API 时，任意的 404 响应都可能需要被替代为 index.html。
    publicPath: '/', // 修复output.publicPath问题
    compress: true, // 一切服务都启用 gzip 压缩
    host: '0.0.0.0',
    open: true, // 告诉 dev-server 在 server 启动后打开浏览器
    port: 8000, // 指定要监听请求的端口号
    stats: 'errors-only', // 精确控制要显示的 bundle 信息 (在 bundle 中只显示错误)
    hot: true, // 启用 webpack 的 模块热替换 功能
    watchContentBase: true
  },
  plugins: [
    //显示模块相对路径
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(), // 热替换模块插件
    new HtmlWebpackPlugin({
      title: 'Hello World',
      template: resolve('/src/index.html'),
      filename: 'index.html',
      // multihtmlCache: true,   // 解决多页热部署的关键
      minify: {
        // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
      },
      chunksSortMode() {
        return true;
      },
    }),
  ],
});
