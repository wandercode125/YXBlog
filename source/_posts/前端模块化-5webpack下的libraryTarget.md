---
title: 前端模块化-5webpack下的libraryTarget
date: 2019-03-28 19:59:42
tags: 模块化
---
output.library和output.libraryTarget属性可能大家都会比较陌生，因为一般如果只在项目中使用 webpack 不需要关注这两个属性，但是如果是开发类库，那么这两个属性就是必须了解的。说白了就是发包

## 1简介

回想一下，当我们引入别人开发的类库时有几种方式？下面假设我们引入一个demo方法：

### 1.1.传统方式：script标签


```javascript

<script src="demo.js"></script>
<script>demo();</script>

```


### 1.2.AMD

```javascript
define(['demo'], function(demo) {

   demo();

});

```


### 1.3.commonjs 方式

```javascript
const demo = require('demo');

demo();
```


### 1.4.ES6 module


```
import demo from 'demo';

demo();

```

大家思考一下，为什么这个类库能支持不同方式的引入？如何实现的？

> 这就是 webpack 配置output.library和output.libraryTarget提供的功能。

## 2.output.library

### 2.1 语法
支持输入string或者object(从 webpack 3.1.0 版本开始支持; 限于 libraryTarget: “umd” 时使用)类型的值。

### 2.2 output.library vs output.libraryTarget
output.library的值被如何使用会根据output.libraryTarget的取值不同而不同。 而默认output.libraryTarget的取值是var，如果如下配置：

```
output: {
  library: "myDemo"
}

```

如果在 `HTML` 页面中使用`script`标签引入打包结果文件，那么变量`myDemo`对应的值将会是入口文件(`entry file`)的返回值。


## 3.output.libraryTarget

### 3.1 语法
支持输入string类型的值。默认值：var

### 3.2 用途
1. 此配置的作用是控制 webpack 打包的内容是如何暴露的。
 
2. 请注意这个选项需要和output.library所绑定的值一起产生作用。


## 4分类

在以下的 demo 中，假设`output.library`值是`myDemo`。`_entry_return_`表示入口点返回的值。在`bundle`中，它是`webpack`从入口点生成的函数的输出。

4.1.暴露一个变量

4.2.通过对象属性暴露

4.3.模块定义系统

4.4.其他类型

### 4.1 暴露一个变量

以下选项会把打包返回的值（无论暴露的是什么）**绑定到一个由output.library指定的变量上**，无论包是被如何引用。

#### 4.1.1 libraryTarget: "var"- (default)

使用这个配置，当库被加载时，那么库的返回值会被分配到使用用var申明的变量上。


```javascript
var myDemo = _entry_return_;

// In a separate script...
myDemo();

```

如果没有设置output.library值，那么将不会发生赋值行为。

亲测：可以通过script标签音如，library挂载在window上

####  4.1.2 libraryTarget: "assign"

使用这个设置，会把库返回值分配给一个没使用var申明的变量中，如果这个变量没有在引入作用域中提前申明过，**那么将会挂载在全局作用域中**。（注意，这个行为有可能会覆盖全局作用域中的已有变量）


```javascript
myDemo = _entry_return_;
```

### 4.2 通过对象属性暴露

以下选项将库的返回值（无论返回值是什么）分配给特定对象的指定属性，属性由`output.library`指定，对象由`output.libraryTarget`指定。

当`output.library`没有指定为非空字符串，那么默认行为是将库返回值的所有属性(properties)都分配到对象中，代码如下：


```javascript
(function(e, a) { for(var i in a) e[i] = a[i]; }(${output.libraryTarget}, _entry_return_)

```

**注意，发生这个行为的时候 webpack 并不会检查对象中是否已经存在这些属性值，也就是会发生覆盖行为。**

#### 4.2.1libraryTarget: "this" 

> 将库的返回值分配给`this`对象的由`output.library`指定的属性。其中`this`的意义由用户决定。


```javascript
this["myDemo"] = _entry_return_;
//使用时
this.myDemo();
或者
myDemo(); // if this is window

```


#### 4.2.2 libraryTarget: "window" 

将库的返回值分配给`window`对象的由output.library指定的属性。


```javascript
window["myDemo"] = _entry_return_;

//使用时

window.myDemo.doSomething();
```

#### 4.4.3 libraryTarget: "global" 

将库的返回值分配给global对象的由output.library指定的属性。


```javascript
global["myDemo"] = _entry_return_;

//使用时

global.myDemo();

```
> 实际经测试与window是一样的，不会出现global

#### 4.4.4 libraryTarget: "commonjs" 

将库的返回值分配给exports对象的由output.library指定的属性。正如名字所指，这个选项可以使用在 CommonJS 环境。


```javascript

exports["myDemo"] = _entry_return_;

require("myDemo").doSomething();
```
> myDemo是webpack中library的值

### 4.3模块定义系统

以下选项将产生一个**包含更完整兼容代码的包**，以确保与各种模块系统的兼容性。 此时`output.library`选项在不同的`output.libraryTarget`选项下具有不同的含义。

#### 4.3.1 libraryTarget: "commonjs2" 

> 将库的返回值分配给module.exports。正如名字所指，这个选项可以使用在 CommonJS 环境。

```javascript
//实际的代码
module.exports = _entry_return_;

//使用
const myDemo = require("myDemo");
myDemo();

```

> 注意，在这个情况下output.library不是必须的，因为此时output.library选项将会被忽略。
> 
> 有没有注意到 CommonJS 和 CommonJS2 长的非常像？他们确实很相似，但是其中有微妙的区别，想了解更多可以参考这个issue

> 注意：如果使用的方式不对，如不是require进来的，会报错module is not defined


#### 4.3.2 libraryTarget: "umd"  

这个选项会尝试把库暴露给前使用的模块定义系统，这使其和CommonJS、AMD兼容或者暴露为全局变量。 

**umd打出来的包，commonjs amd规范下可以使用，或者暴露成全局变量挂载window上，详情看最下面**

**output.library 选项在这里是必须的。**

最终代码输出如下：


```javascript

(function webpackUniversalModuleDefinition(root, factory) {
if(typeof exports === 'object' && typeof module === 'object')
  module.exports = factory(); //Commonjs的语法
else if(typeof define === 'function' && define.amd)
  define([], factory);
else if(typeof exports === 'object')
  exports["MyLibrary"] = factory();// 其他语法cmd
else
  root["MyLibrary"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return _entry_return_;
});
```

如果 output.library 没有输入有效值，那么对于全局变量的处理会和上面提到的 暴露一个变量 一致。代码输出如下：


```javascript

(function webpackUniversalModuleDefinition(root, factory) {
if(typeof exports === 'object' && typeof module === 'object')
  module.exports = factory();
else if(typeof define === 'function' && define.amd)
  define([], factory);
else {
  var a = factory();
  for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
}
})(this, function() {
return _entry_return_;
});
```


从 webpack 3.10.0 版本开始，我们可以通过把 output.library 定义为对象来控制不同目标环境的输出值。详情可参考这个Demo


```javascript
output: {
library: {
  root: "myDemo",
  amd: "my-demo",
  commonjs: "my-common-demo"
},
libraryTarget: "umd"
}
```

#### 4.3.3 libraryTarget: "amd"  

这个选项会把库作为 AMD 模块导出。 

AMD模块要求输入脚本（例如由 `<script>`标签加载的第一个脚本）被定义为具有特定属性，例如通常由 RequireJS 或任何兼容的加载器（诸如almond）提供的require和define属性。**否则，直接加载生成的 AMD 捆绑包将导致类似define is not defined的错误。 
由此定义生成的代码会如下：**


```javascript

define("myDemo", [], function() {
return _entry_return_;
});

```

以上的代码可以作为script标签引入代码的一部分被包含，然后在通过以下代码调用：

```javascript

require(['myDemo'], function(myDemo) {
// Do something with the library...
myDemo();
});

```

如果output.library没有定义有效值，那么生成的代码将如下：


```javascript

define([], function() {
return _entry_return_;
});

```

如果直接使用`<script>`标签加载，该库将无法按预期生效，或者根本无法生效（在 almond 加载器的情况下）。它只能通过与 RequireJS 兼容的异步模块加载器通过该文件的实际路径进行引入，因此在这种情况下，如果这些由服务器直接提供，那么output.path和output.filename配置可能变得非常重要。

> **非常重要的一件事情那就是umd和amd配置，打出来的包都可以共amd使用，换句话说可以让requirejs使用**



### 4.4 其他类型

#### 4.4.1libraryTarget: "jsonp" - 
> 这个方法会使用 jsonp 的方式把结果包裹起来。 
js 

```javascript

myDemo(_entry_return_);

```

库的依赖由 externals 定义。


## 5 ouput.library和output.libraryTarget

**总结一下ouput.library和output.libraryTarget的区别**

前者是文件id或者编译出来的代码块id

后面是指定规范，按照什么规范编译出文件