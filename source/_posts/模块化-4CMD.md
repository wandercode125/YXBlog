---
title: 模块化-4CMD
date: 2018-08-27 14:12:00
tags: javascript
categories:

---
<!-- more -->

## 1.摘要
### 1.1 总结
    
参考 《模块化-2CommonJS》

### 1.2  前端的四种模块化方案
参考 《模块化-2CommonJS》

## 2 CMD

### 2.1 简介

CMD 即`Common Module Definition`通用模块定义，`CMD`规范是国内发展出来的，就像`AMD有个requireJS`，CMD有个浏览器的实现`SeaJS`，`SeaJS`要解决的问题和`requireJS`一样，只不过在模块定义方式和模块加载（可以说运行、解析）时机上有所不同。



### 2.2 语法

#### 2.2.1 定义

1. 如何写个符合CMD的js文件

在 CMD 规范中，一个模块就是一个文件。代码的书写格式如下:
```javascript
// a.js文件
define(id?, deps?, factory)
//或者
define(function(require, exports, module) {
  // 模块代码
});

```
一般多用第二种写法 ，原因如下
1. 因为CMD推崇一个文件一个模块，所以经常就用文件名作为模块id
2. CMD推崇依赖就近，**所以一般不在define的参数中写依赖，在factory中写**
3. factory有三个参数

#### 2.2.1 使用

配合seajs的使用
```javascript
/ 加载模块
seajs.use(['a.js'], function(A){
    var star= A.data;
    console.log(star);  //1
});
```

### 2.3 sea.js

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

## 3 CMD vs AMD

### 3.1 写法

1. AMD是依赖关系前置,在定义模块的时候就要声明其依赖的模块;
2. CMD是按需加载依赖就近,只有在用到某个模块的时候再去require：

```javascript
// AMD 默认推荐的是
define(['./a', './b'], function(a, b) { // 依赖必须一开始就写好
  a.doSomething()
  // 此处略去 100 行
  b.doSomething()
  ...
}) 
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

### 3.2 机制

1. AMD在加载完成定义（define）好的模块就会立即执行，所有执行完成后，遇到require才会执行主逻辑。（提前加载）
2. CMD在加载完成定义（define）好的模块，仅仅是下载不执行，在遇到require才会执行对应的模块。（按需加载）
3. AMD用户体验好，因为没有延迟，
4. CMD性能好，因为只有用户需要的时候才执行。


