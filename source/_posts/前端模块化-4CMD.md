---
title: 前端模块化-4CMD
date: 2018-08-27 14:11:00
tags: 模块化
categories: 总结 工作

---
 Commonjs,AMD,CMD,ES6的模块化总结
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

- CommonJS:  exports（或者module.exports）+ require 
- AMD: define + require 
- CMD：define+require+exports/exports 
- ES6: export + import


**Ps. CommonJS 和AMD上下的require也不是一样的,cmd与amd的文字一样内容差了好多参数)**

由于ES6本身是原生语言支持实现的模块化，但是现代浏览器大多都还未支持，因此必须使用相应的transpiler工具转换成ES5的AMD,CMD模块，再借助于systemjs/requirejs等模块加载工具才能使用。其中ES6的transpiler（代码转换器）一般是用babel，他的作用是将ES6


## 2 CMD

### 2.1 简介

CMD 即`Common Module Definition`通用模块定义，`CMD`规范是国内发展出来的，就像`AMD有个requireJS`，CMD有个浏览器的实现`SeaJS`，`SeaJS`要解决的问题和`requireJS`一样，只不过在模块定义方式和模块加载（可以说运行、解析）时机上有所不同。



### 2.2 格式

#### 2.2.1 定义

如何写个符合CMD的js文件

在 CMD 规范中，一个模块就是一个文件。代码的书写格式如下:
```javascript

// a.js文件
define(id?, deps?, factory)
或者
define(function(require, exports, module) {

  // 模块代码

});

```

一般多用第二种写法 ，原因如下

1、因为CMD推崇一个文件一个模块，所以经常就用文件名作为模块id
2、CMD推崇依赖就近，所以一般不在define的参数中写依赖，在factory中写
3、factory有三个参数

#### 2.2.1 使用

配合seajs的使用
```javascript
/ 加载模块
seajs.use(['a.js'], function(A){
    var star= A.data;
    console.log(star);  //1
});
```


### 2.3 语法解析


require是可以把其他模块导入进来的一个参数;require 是一个方法，接受 模块标识 作为唯一参数，用来获取其他模块提供的接口

exports是可以把模块内的一些属性和方法导出的;

module 是一个对象，上面存储了与当前模块相关联的一些属性和方法


## 3 CMD vs AMD

### 3.1 写法

AMD是依赖关系前置,在定义模块的时候就要声明其依赖的模块;

CMD是按需加载依赖就近,只有在用到某个模块的时候再去require：

具体的区别可以看下面的代码

```javascript
// CMD
define(function(require, exports, module) {
  var a = require('./a')
  a.doSomething()
  // 此处略去 100 行
  var b = require('./b') // 依赖可以就近书写
  b.doSomething()
  // ... 
})

```

```javascript
// AMD 默认推荐的是
define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
  a.doSomething()
  // 此处略去 100 行
  b.doSomething()
  ...
}) 

```



### 3.2 机制

AMD在加载完成定义（define）好的模块就会立即执行，所有执行完成后，遇到require才会执行主逻辑。（提前加载）

CMD在加载完成定义（define）好的模块，仅仅是下载不执行，在遇到require才会执行对应的模块。（按需加载）

AMD用户体验好，因为没有延迟，CMD性能好，因为只有用户需要的时候才执行。


## 4 seajs的使用

seajs使用例子


```javascript

// 定义模块  myModule.js
define(function(require, exports, module) {
  var $ = require('jquery.js')
  $('div').addClass('active');
  exports.data = 1;
});

// 加载模块
seajs.use(['myModule.js'], function(my){
    var star= my.data;
    console.log(star);  //1
});

```