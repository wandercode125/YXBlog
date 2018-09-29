---
title: webpack单页应用和多页应用搭建初试水（一）
date: 2018-08-27 16:05:40
tags:
categories: self

---
虽然之前研究过一些webpack配置，但是也没有着手去做过。再者平时的demo也都是基于react的，所以不得不使用webpack，这里就随便写个单页和多页的webpack。

前提，不考虑任何优化，什么代码分割，什么图片压缩，什么公共代码提取都一边去，这是最最简单的可以使用的单页和多页的应用.希望你还是要懂得一些基本的webpack配置，比如entry，output等等，如果这些也不是很清楚请直接ctrl+c ctrl+v
<!-- more -->
# 在此处输入标题

### 1.单页应用

对应的就是一个页面，所有的功能请在一个页面实现，那么只需要两个文件：index.js和index.html。

#### 1.1 index.js
随便你想怎么拆分都行，随便你想引入什么文件都可以，请最后一定要有一句

    ReactDOM.render(
        <h1>haha</h1>,
        document.querySelector('#main')
    );

注意：
    1.import ReactDOM  from 'react-dom';
    2.index.html一定要有`<div id="main"></div>`

#### 1.2 index.html

    <html>
      <body>
        <div id="main"></div>
        <script type="text/javascript" src="./bundle.js"></script>
      </body>
    </html>

 注意：
 1.bundle.js命名以及路径与webpack.config.js有关系
 
 #### 1.3 webpack.config.js

    var path  = require('path');
    module.exports = {
      devtool: '#source-map',
      entry: './main.js',
      output: {
        filename: 'bundle.js',
        // path: path.resolve(__dirname, 'dist'),
      },
      module: {
        rules: [
          {
            test: /\.js?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['es2015', 'react']
              }
            }
          },
          {
    
            test: /\.css$/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                 loader: 'css-loader',
              
              }
            ]
          }
        ]
      },
    };

#### 1.4 packgae.json

    "scripts": {
        "start": "webpack-dev-server --inline   --open",
        "build": "webpack --config webpack.config.js -p"
      },

  
### 2.多页应用

多页应用其实要做好需要做很多，关键有公共代码的提取，毕竟每个页面差不多都要引入react 、react-dom等等一些公共文件，如果不提出来那么基础每夜会造成文件有点大，但是我们这里全都不考虑。

多页的应用关键就在于一个插件的使用：
htmlwebpackplugin，为了生成多个html

#### 2.1.页面请都放在pages/下面

建立一个单独的文件夹，login/, 下面需有index.js 和 index.html

#### 2.2 index.js

    import ReactDOM  from 'react-dom';
    import React, { Component } from 'react';
    import './index.css';
    
    ReactDOM.render(<h1>这里是page1</h1>, document.getElementById('main'));

#### 2.3 index.html

    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="X-UA-Compatible" content="ie=edge">
            <title>锚点</title>
        </head>
      <body>
        <div id="main"></div>
      </body>
    </html>

#### 2.4 webpack.config.js

    var path = require('path');
    var glob = require('glob');
    // const webpack = require('webpack');
    const ExtractTextPlugin = require('extract-text-webpack-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const CleanWebpackPlugin = require('clean-webpack-plugin');
    var entries = {}, chunks = [],plugins=[];
    
    glob.sync('./pages/*/index.js').forEach(path => {
      const chunk = path.split('./pages/')[1].split('/index.js')[0];
      entries[chunk] = path;
      chunks.push(chunk);
    });
    glob.sync('./pages/*/index.html').forEach(path => {
      const chunk = path.split('./pages/')[1].split('/index.html')[0];
      const filename = chunk + '.html';
      const htmlConf = {
        filename: filename,
        template:  path,
        inject: true,
        favicon: '',
        hash: true,
        // 每个html引用的js模块，也可以在这里加上vendor等公用模块
        chunks: [chunk]
      }
      plugins.push(new HtmlWebpackPlugin(htmlConf));
    });
    
    module.exports = {
      devtool:'#source-map',
      entry: entries,
      output: {
        filename: 'bundle_[name].js',
        path:path.join(__dirname,'dist')
      },
      module: {
        rules: [
          {
            test: /\.js?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['es2015', 'react']
              }
            }
          },
          {
    
            test: /\.css$/,
            use:ExtractTextPlugin.extract({
              use: [
                'css-loader'
              ],
              fallback: 'style-loader'
            })
          }
        ]
      },
      plugins:[
        new ExtractTextPlugin({
          filename: '[name].css', 
        }),
        new CleanWebpackPlugin(["dist"]),
        ...plugins,
      ],
      devServer:{
        inline: true, // hot load
        // contentBase: './pages',
        https:false,
        open:true,
      }
    };

#### 2.5 package.json

    "scripts": {
        "dev": "webpack-dev-server --hot",
        "build": "webpack "
      },

