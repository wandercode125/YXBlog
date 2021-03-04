---
title: 前端模块化-3AMD
date: 2018-08-27 14:11:00
tags: 模块化
categories: 

---
 Commonjs,AMD,CMD,ES6的模块化总结
<!-- more -->

<!-- more -->

## 1.摘要
### 1.1 总结
    
前端模块规范有三种：CommonJs,AMD和CMD。

- CommonJs用在服务器端，AMD和CMD用在浏览器环境
- AMD 是 RequireJS 在推广过程中对模块定义的规范化产出。**AMD提前执行（异步加载：依赖先执行）+延迟执行）**
- CMD 是 SeaJS 在推广过程中对模块定义的规范化产出。 **CMD:延迟执行（运行到需加载，根据顺序执行）**


### 1.2  前端的四种模块化方案

(webpack/require.js/seajs/browserify）

JS不具备原生的模块化技能，因此需要采用第三方开发的模块依赖处理库来实现模块化：CommonJS、AMD、CMD、ES6

这四种方案的实现对比：

> CommonJS:  exports（或者module.exports）+ require 
>
> AMD: define + require 
>
> CMD：define+require+exports/exports 
>
> ES6: export + import


**++Ps. CommonJS 和AMD上下的require也不是一样的,cmd与amd的文字一样内容差了好多参数)++**

由于ES6本身是原生语言支持实现的模块化，但是现代浏览器大多都还未支持，因此必须使用相应的transpiler工具转换成ES5的AMD,CMD模块，再借助于systemjs/requirejs等模块加载工具才能使用。其中ES6的transpiler（代码转换器）一般是用babel，他的作用是将ES6

## 2 AMD

### 2.1 简介

`AMD（Asynchronous Module Definition）`见名知意，就是异步模块定义，当然是为了解决上述同步加载问题。
`AMD`对应的就是很有名的`RequireJS`。

### 2.2 格式

#### 2.2.1 定义

如何写个符合AMD的js文件

```javascript

// 定义模块 myModule.js
define(['dependency'], function(){
    var name = 'Byron';
    function printName(){
        console.log(name);
    }

    return {
        printName: printName
    };
});
```

#### 2.2.2 使用

```javascript
// 加载模块
require(['myModule'], function (my){
　 my.printName();
});

```

### 2.3 语法解析

`requireJS`定义了一个函数 `define`，它是全局变量，用来定义模块

```javascript

define(id?, dependencies?, factory);

```

id：可选参数，用来定义模块的标识，如果没有提供该参数，脚本文件名（去掉拓展名）

dependencies：是一个当前模块依赖的模块名称数组

factory：工厂方法，模块初始化要执行的函数或对象。如果为函数，它应该只被执行一次。如果是对象，此对象应该为模块的输出值

在页面上使用require函数加载模块


### 2.4 如何使用

```javascript
require([dependencies], function(){});

```
require()函数接受两个参数*

第一个参数是一个数组，表示所依赖的模块

第二个参数是一个回调函数，当前面指定的模块都加载成功后，它将被调用。加载的模块会以参数形式传入该函数，从而在回调函数内部就可以使用这些模块

require()函数在加载依赖的函数的时候是异步加载的，这样浏览器不会失去响应，它指定的回调函数，只有前面的模块都加载成功后，才会运行，解决了依赖性的问题。
