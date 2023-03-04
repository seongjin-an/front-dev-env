const path = require('path')
// const MyWebpackPlugin = require('./my-webpack-plugin')
const webpack = require('webpack')
const childProcess = require('child_process')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    mode: 'development',
    entry: {
        // main:'./src/app.js'
        main:'./app.js'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js'
    },
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        // publicPath: "/",
        host: "dev.domain.com",
        // overlay: true,
        port: 8081,
        // stats: "errors-only",
        historyApiFallback: true,
    },
    module: {
        rules: [
            // {
            //     test: /\.js$/,
            //     use: [
            //         path.resolve('./my-webpack-loader.js')
            //     ]
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader", // 바벨 로더를 추가한다
              },
        
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         'css-loader', 
            //     ]
            // },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                // loader: 'file-loader',
                loader: 'url-loader',
                options: {
                    // publicPath: './dist/',
                    name: "image/[name].[ext]?[hash]",
                    limit: 20000, //2kb
                }
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `
                Build Date: ${new Date().toLocaleString()}
                Commit Version: ${childProcess.execSync('git rev-parse --short HEAD')}
                Author: ${childProcess.execSync('git config user.name')}
            `
        }),
        new webpack.DefinePlugin({
            TWO: '1+1',
            THREE: JSON.stringify('1+2'),
            'api.domain': JSON.stringify('http://dev.api.domain.com')
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            templateParameters: {
                env: process.env.NODE_ENV === 'development' ? '(개발용)' : '' // NODE_ENV=development npm run build 혹은 NODE_ENV=production npm run build
            },
            minify: process.env.NODE_ENV === 'production' ? {
                collapseWhitespace: true,
                removeComments: true
            }: false
        }),
        new CleanWebpackPlugin(), // remove dist
        ...(process.env.NODE_ENV === 'production' ? [new MiniCssExtractPlugin({filename: '[name].css'})] : [])
        
    ]
}