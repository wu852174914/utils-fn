const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleDeclarationsWebpackPlugin } = require('bundle-declarations-webpack-plugin');
console.log(BundleDeclarationsWebpackPlugin)
module.exports = {
  mode: 'production',
  entry: './src/index.ts', // 项目的入口文件
  output: {
    path: path.resolve(__dirname, 'dist'), // 打包后的输出目录
    filename: 'index.js', // 打包后的文件名
    libraryTarget: 'umd', // 适用于多种环境的通用模式
    globalObject: 'this' // 兼容不同环境的全局对象
  },
  resolve: {
    extensions: ['.ts'] // 解析的文件扩展名
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleDeclarationsWebpackPlugin({
        entry: ["./src/index.ts"],
        outFile: "main.d.ts",
    }),
]
};
