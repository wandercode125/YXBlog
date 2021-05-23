---
title: 模块化-3AMD
date: 2018-08-27 14:11:00
tags: 模块化
categories: 

---

## 1.摘要
### 1.1 总结
    
参考 《模块化-2CommonJS》

### 1.2  前端的四种模块化方案
参考 《模块化-2CommonJS》


## 2 AMD

### 2.1 简介

`AMD（Asynchronous Module Definition）`见名知意，就是异步模块定义，当然是为了解决上述同步加载问题。`AMD`对应的就是很有名的`RequireJS`。

### 2.2 语法

`requireJS`定义了一个函数 `define`，它是全局变量，用来定义模块

#### 2.2.1 定义

1. 如何写个符合AMD的js文件
```javascript
// 定义模块 myModule.js
define(['dependency'], function(){
    var name = 'Byron';
    function printName(){console.log(name);}
    return {
        printName: printName
    };
});
```
2. 语法解析

```javascript
define(id?, dependencies?, factory);
```

- id：可选参数，用来定义模块的标识，如果没有提供该参数，脚本文件名（去掉拓展名）
- dependencies：是一个当前模块依赖的模块名称数组
- factory：工厂方法，模块初始化要执行的函数或对象。
  - 如果为函数，它应该只被执行一次。
  - 如果是对象，此对象应该为模块的输出值


#### 2.2.2 使用
1. 在页面上使用require函数加载模块
```javascript
// 加载模块
require(['myModule'], function (my){
　 my.printName();
});

```
2. 语法解析
```javascript
require([dependencies], function(){});
```
require()函数接受两个参数
- 第一个参数是一个数组，表示所依赖的模块
- 第二个参数是一个回调函数，当前面指定的模块都加载成功后，它将被调用。加载的模块会以参数形式传入该函数，从而在回调函数内部就可以使用这些模块

require()函数在加载依赖的函数的时候是异步加载的，这样浏览器不会失去响应，它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。
