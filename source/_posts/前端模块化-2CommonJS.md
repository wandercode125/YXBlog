---
title: 前端模块化-2CommonJS
date: 2018-08-27 14:08:43
tags: 模块化
categories: 总结 工作

---

上一篇讲了前端模块化中的旧方法，下面就讲我们常见但是易混的三个前端模块化。这里先讲commonjs


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


## 2. CommonJS

### 2.1 简介 

Node 应用由模块组成，采用 CommonJS 模块规范。

每个文件就是一个模块，有自己的作用域。在一个文件里面定义的变量、函数、类，都是私有的，对其他文件不可见。

所以**虽然JavaScript在web端发展这么多年，第一个流行的模块化规范却由服务器端的JavaScript应用带来，** CommonJS规范是由NodeJS发扬光大，这标志着JavaScript模块化编程正式登上舞台。


### 2.2 格式

```javascript

// example.js
var x = 5;
var addX = function (value) {
  return value + x;
};

```

上面代码中，变量x和函数addX，是当前文件example.js私有的，其他文件不可见。

如果想在多个文件分享变量，必须定义为global对象的属性。


```javascript 

global.warning = true;

```
上面代码的`warning`变量，可以被所有文件读取。当然，这样写法是不推荐的。

`CommonJS`规范规定，每个模块内部，`module`变量代表当前模块。这个变量是一个对象，它的`exports`属性（即`module.exports`）是对外的接口。加载某个模块，其实是加载该模块的`module.exports`属性。


看个例子

```javascript
//模块定义 myModel.js

var name = 'Byron';

function printName(){
    console.log(name);
}

function printFullName(firstName){
    console.log(firstName + name);
}

module.exports = {
    printName: printName,
    printFullName: printFullName
}
//或者
// module.exports.printName = printName;
// module.exports.printFullName = printFullName;


```

```javascript
//加载模块

var nameModule = require('./myModel.js');

nameModule.printName();

```

### 2.3 模块解析

根据CommonJS规范，

1. 一个单独的文件就是一个模块。
**每一个模块都是一个单独的作用域**，也就是说，在该模块内部定义的变量，无法被其他模块读取，除非定义为global对象的属性

2. 模块输出：
**模块只有一个出口，module.exports对象**，我们需要把模块希望输出的内容放入该对象

3. 加载模块：
加载模块使用require方法，该方法读取一个文件并执行，返回文件内部的module.exports对象

### 2.4 commonjs总结
>总结如下：
>
>1.所有代码都运行在模块作用域，不会污染全局作用域。
>
>2.模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
>
>3.模块加载的顺序，按照其在代码中出现的顺序。

### 2.5 commonjs缺点

仔细看上面的代码，**++会发现require是同步的++**。模块系统需要同步读取模块文件内容，并编译执行以得到模块接口。

这在服务器端实现很简单也很自然，然而， 想在浏览器端实现问题却很多。

因为浏览器端，加载JavaScript最佳、最容易的方式是在document中插入script 标签。**++但脚本标签script天生异步，传统CommonJS模块在浏览器环境中无法正常加载。++**

解决思路之一是，开发一个服务器端组件，对模块代码作静态分析，将模块与它的依赖列表一起返回给浏览器端。 这很好使，但需要服务器安装额外的组件，并因此要调整一系列底层架构。

另一种解决思路是，用一套标准模板来封装模块定义，但是对于模块应该怎么定义和怎么加载，又产生的分歧：


> 总结CommonJs适合服务器端，比如node，不适合浏览器


## 3 module对象

这部分是不是属于node的知识点了。

Node内部提供一个`Module`构建函数。所有模块都是`Module`的实例。

```javascript
function Module(id, parent) {
  this.id = id;
  this.exports = {};
  this.parent = parent;
  // ...

```

每个模块内部，都有一个`module`对象，代表当前模块。它有以下属性。

> module.id 模块的识别符，通常是带有绝对路径的模块文件名。
> 
> module.filename 模块的文件名，带有绝对路径。
> 
> module.loaded 返回一个布尔值，表示模块是否已经完成加载。
> 
> module.parent 返回一个对象，表示调用该模块的模块。
> 
> module.children 返回一个数组，表示该模块要用到的其他模块。
> 
> module.exports 表示模块对外输出的值。

下面是一个示例文件，最后一行输出module变量。

```javascript
// example.js
var jquery = require('jquery');
exports.$ = jquery;
console.log(module);

```

执行这个文件，命令行会输出如下信息。

```javascript
{ id: '.',
  exports: { '$': [Function] },
  parent: null,
  filename: '/path/to/example.js',
  loaded: false,
  children:
   [ { id: '/path/to/node_modules/jquery/dist/jquery.js',
       exports: [Function],
       parent: [Circular],
       filename: '/path/to/node_modules/jquery/dist/jquery.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  paths:
   [ '/home/user/deleted/node_modules',
     '/home/user/node_modules',
     '/home/node_modules',
     '/node_modules' ]
}

```

如果在命令行下调用某个模块，比如`node something.js`，那么`module.parent`就是`null`。如果是在脚本之中调用，比如`require('./something.js')`，那么`module.parent`就是调用它的模块。利用这一点，可以判断当前模块是否为入口脚本。

```javascript

if (!module.parent) {
    // ran with `node something.js`
    app.listen(8088, function() {
        console.log('app listening on port 8088');
    })
} else {
    // used with `require('/.something.js')`
    module.exports = app;
}

```

### 3.1 module.exports属性

`module.exports`属性表示当前模块对外输出的接口，其他文件加载该模块，实际上就是读取`module.exports`变量。

### 3.2 exports变量

为了方便，`Node`为每个模块提供一个`exports`变量，指向`module.exports`。这等同在每个模块头部，有一行这样的命令。

```javascript
var exports = module.exports;

```

造成的结果是，在对外输出模块接口时，可以向exports对象添加方法。


```javascript

exports.area = function (r) {
  return Math.PI * r * r;
};

exports.circumference = function (r) {
  return 2 * Math.PI * r;
};

```

注意，不能直接将`exports`变量指向一个值，**因为这样等于切断了`exports`与`module.exports`的联系。**

```javascript

exports = function(x) {console.log(x)};


或者

exports.hello = function() {
  return 'hello';
};

module.exports = 'Hello world';

```

第一句 ：上面这样的写法是无效的，因为`exports`不再指向`module.exports`了。
第二句 hello函数是无法对外输出的，因为`module.exports`被重新赋值了。

**这意味着，如果一个模块的对外接口，就是一个单一的值，不能使用`exports`输出，只能使用`module.exports`输出。**

```javascript
module.exports = function (x){ console.log(x);};
```

如果你觉得，`exports`与`module.exports`之间的区别很难分清，一个简单的处理方法，就是放弃使用`exports`，只使用`module.exports`。


## 4 require命令


### 4.1 基本用法


`Node`使用`CommonJS`模块规范，内置的`require`命令用于加载模块文件。

`require`命令的基本功能是，读入并执行一个`JavaScript`文件，然后返回该模块的`exports`对象。如果没有发现指定模块，会报错。

```javascript

// example.js
var invisible = function () {
  console.log("invisible");
}

exports.message = "hi";

exports.say = function () {
  console.log(message);
}


```
运行下面的命令，可以输出exports对象。

```javascript
var example = require('./example.js');
example
// {
//   message: "hi",
//   say: [Function]
// }

```

如果模块输出的是一个函数，那就不能定义在`exports`对象上面，而要定义在`module.exports`变量上面。

```javascript

module.exports = function () {
  console.log("hello world")
}

require('./example2.js')()


```

上面代码中，`require命令`调用自身，等于是执行`module.exports`，因此会输出 `hello world`。


### 4.2 加载规则

`require`命令用于加载文件，后缀名默认为`.js`。

```javascript
var foo = require('foo');
//  等同于
var foo = require('foo.js');

```


根据参数的不同格式，require命令去不同路径寻找模块文件。

-（1）如果参数字符串以“/”开头，则表示加载的是一个位于绝对路径的模块文件。比如，require('/home/marco/foo.js')将加载/home/marco/foo.js。

-（2）如果参数字符串以“./”开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，require('./circle')将加载当前脚本同一目录的circle.js。

-（3）如果参数字符串不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于Node的系统安装目录中），或者一个位于各级node_modules目录的已安装模块（全局安装或局部安装）。
**反正去node_module里面去找**
举例来说，脚本/home/user/projects/foo.js执行了require('bar.js')命令，Node会依次搜索以下文件。
>/usr/local/lib/node/bar.js
>
>/home/user/projects/node_modules/bar.js
>
>/home/user/node_modules/bar.js
>
>/home/node_modules/bar.js
>
>/node_modules/bar.js


这样设计的目的是，使得不同的模块可以将所依赖的模块本地化。

（4）如果参数字符串不以“./“或”/“开头，而且是一个路径，比如require('example-module/path/to/file')，则将先找到example-module的位置，然后再以它为参数，找到后续路径。

（5）如果指定的模块文件没有发现，Node会尝试为文件名添加.js、.json、.node后，再去搜索。.js件会以文本格式的JavaScript脚本文件解析，.json文件会以JSON格式的文本文件解析，.node文件会以编译后的二进制文件解析。

（6）如果想得到require命令加载的确切文件名，使用require.resolve()方法。

### 4.3 目录的加载规则

通常，我们会把相关的文件会放在一个目录里面，便于组织。这时，最好为该目录设置一个入口文件，让`require`方法可以通过这个入口文件，加载整个目录。

在目录中放置一个`package.json`文件，并且将入口文件写入`main`字段。

发包时候已经使用到了

`require`发现 参数 字符串指向一个目录以后，会自动查看该目录的`package.json`文件，然后加载`main字`段指定的入口文件。如果`package.json`文件没有`main`字段，或者根本就没有`package.json`文件，则会加载该目录下的`index.js文件`或`index.node文件`。



## 参考文献

[阮一峰的nodejs-commjs规范](http://javascript.ruanyifeng.com/nodejs/module.html)