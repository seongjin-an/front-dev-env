const path = require('path')
// const MyWebpackPlugin = require('./my-webpack-plugin')
const webpack = require('webpack')
const childProcess = require('child_process')

module.exports = {
    mode: 'development',
    entry: {
        main:'./src/app.js'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    path.resolve('./my-webpack-loader.js')
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader', 
                ]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                // loader: 'file-loader',
                loader: 'url-loader',
                options: {
                    publicPath: './dist/',
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
        })
    ]
}