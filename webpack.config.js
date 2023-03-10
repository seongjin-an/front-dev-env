const path = require('path')
// const MyWebpackPlugin = require('./my-webpack-plugin')
const webpack = require('webpack')
const childProcess = require('child_process')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const apiMocker = require('connect-api-mocker')
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const mode = process.env.NODE_ENV ||"development"

module.exports = {
    // mode: 'development',
    mode,
    entry: {
        main:'./src/app.js',
        // main:'./app.js'
        // result: './src/result.js'
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].js'
    },
    devServer: {
        // contentBase: path.join(__dirname, "dist"),
        // publicPath: "/",
        // host: "dev.domain.com",
        // overlay: true,
        port: 8081,
        // stats: "errors-only",
        historyApiFallback: true,
        setupMiddlewares: (middlewares, devServer) => {
            if (!devServer) {
              throw new Error('webpack-dev-server is not defined');
            }
      
            devServer.app.get('/setup-middleware/some/path', (_, response) => {
              response.send('setup-middlewares option GET');
            });

            // devServer.app.get('/api/users', (req, res) => {
            //     res.json([
            //         {
            //             id: 1,
            //             name: "an",
            //         },
            //         {
            //             id: 2,
            //             name: "an2",
            //         },
            //         {
            //             id: 3,
            //             name: "an3"
            //         }
            //     ])
            // })

            devServer.app.use(apiMocker('/api', 'mocks/api'))
      
            // Use the `unshift` method if you want to run a middleware before all other middlewares
            // or when you are migrating from the `onBeforeSetupMiddleware` option
            middlewares.unshift({
              name: 'fist-in-array',
              // `path` is optional
              path: '/foo/path',
              middleware: (req, res) => {
                res.send('Foo!');
              },
            });
      
            // Use the `push` method if you want to run a middleware after all other middlewares
            // or when you are migrating from the `onAfterSetupMiddleware` option
            middlewares.push({
              name: 'hello-world-test-one',
              // `path` is optional
              path: '/foo/bar',
              middleware: (req, res) => {
                res.send('Foo Bar!');
              },
            });
      
            middlewares.push((req, res) => {
              res.send('Hello World!');
            });
      
            return middlewares;
          },
        //   hot: true
    },
    optimization: {
        minimizer: mode === 'production' ? [
            new CssMinimizerWebpackPlugin(),
            new TerserWebpackPlugin({
                terserOptions: {
                    compress: {
                      drop_console: true, // ?????? ????????? ????????????
                    },
                  },
            })
        ] : [],
        // splitChunks: {
        //     chunks: 'all'
        // },
    },
    externals: {
        axios: "axios"
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
                loader: "babel-loader", // ?????? ????????? ????????????
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
                env: process.env.NODE_ENV === 'development' ? '(?????????)' : '' // NODE_ENV=development npm run build ?????? NODE_ENV=production npm run build
            },
            minify: process.env.NODE_ENV === 'production' ? {
                collapseWhitespace: true,
                removeComments: true
            }: false
        }),
        new CleanWebpackPlugin(), // remove dist
        ...(process.env.NODE_ENV === 'production' ? [new MiniCssExtractPlugin({filename: '[name].css'})] : []),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: './node_modules/axios/dist/axios.min.js',
                    to: './axios.min.js'
                }
            ]
        })
    ]
}