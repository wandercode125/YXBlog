---
title: Less（1）-浏览器端的用法
date: 2019-06-26 00:37:13
tags:
---


## 1 前言

这里不讲less的用法，也不讲如何使用gulp、webpack编译less生成css文件，而是less的浏览器端用法。
目的是为了动态修改css样式

## 2 摘要
实现的原理：通过html中使用link引入less文件，使用script引入less.js文件，使用less.modifyVars，动态修改less变量值，从而修改css样式
用途：实现样式定制

## 4 项目中实际使用
原理在section3中有讲到，这里直接先看实际使用。...cdnPath是公司cdn路径，隐私去掉。

主题定制功能使用这个了，实现代码如下:

### 4.1 html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="主题定制面板" />
  <meta name="keywords" content="ynpm ynpm-tool yonyou" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
  <link id="tinper-bee-theme" href="...cdnPath/tinper-bee.css" rel="stylesheet">
  <title>主题定制面板</title>
</head>
<body>
  <div id="theme-app"></div>
  <link id='color-less' rel="stylesheet/less" type="text/css"  href="...cdnPath/color.less">
 <script>
      window.less = {
        async: false,
        env: 'production'
      };
    </script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"></script>

</body>
</html>
```

### 4.2 js

动态修改css样式

```js

window.less.modifyVars(
        this.lessChangeStyle
      )
        .then(() => { console.log('change success') })
        .catch(error => {
          console.log(`Failed to update theme`, error);
      });

```

 this.lessChangeStyle的格式
```

```

## 3 官网上浏览器端的用法

### 3.1 官网建议
这部分的资料来自于[less中文网][1]-浏览器端用法。
> Using less.js in the browser is great for development, but it's not recommended for production
> 
> 最好在development模式下使用less.js，不推荐在production模式使用

很可惜，为了实现动态修改css样式，这个功能需要在production下使用。
让我们看下官网解释为什么不推荐在production模式下使用less.js
[不推荐理由][2]

> We recommend using less in the browser only for development or when you need to dynamically compile less and cannot do it serverside. This is because less is a large javascript file and compiling less before the user can see the page means a delay for the user. In addition, consider that mobile devices will compile slower. For development consider if using a watcher and live reload (e.g. with grunt or gulp) would be better suited.
>
> 我们推荐仅在development模式下或者在服务器端不能动态编译less文件的时候需要动态编译less文件的情况下使用less。因为less是一个大体积js文件，编译less需要一定时间，因此给用户造成延迟。另外在移动端，这个时间会需要更久。在development模式下考虑使用watcher或着grunt、gulp等工具的重加载。

很显然，我们的需求动态生成css样式满足第二点，因此请使用less。

在渲染HTML页面时，less文件需要编译成css文件。我们可以有很多种方法。在服务器端，如Node.js，我们有专门的less编译模块。如果是在客户端，需要从LESS官网下载less.js文件，然后在HTML页面中引入。

### 3.2 使用方式

- To start off, link your .less stylesheets with the rel attribute set to "stylesheet/less":

```html
<link rel="stylesheet/less" type="text/css" href="styles.less" />
```

- Next, download less.js and include it in a <script></script> tag in the <head> element of your page:

```html
<script src="less.js" type="text/javascript"></script>
```

- options

你可以引入`<script src="less.js"></script>`之前通过创建一个全局less对象的方式来指定参数，
```html
<script>
    less = {
        env: "development",
        logLevel: 2,
        async: false,
        fileAsync: false,
        poll: 1000,
        functions: {},
        dumpLineNumbers: "comments",
        relativeUrls: false,
        globalVars: {
            var1: '"string value"',
            var2: 'regular value'
        },
        rootpath: ":/a.com/"
    };
</script>
```
但是这影响所有初始链接标记。你也可以在指定的脚本标签的增加选项，如下：
```html
<script src="less.js" data-env="development"></script>
```

或者，你也可以在链接配置参数覆盖某些选项，如下：
```html

<link data-dump-line-numbers="all" data-global-vars='{ myvar: "#ddffee", mystr: "\"quoted\"" }' rel="stylesheet/less" type="text/css" href="less/styles.less">

```

> 注意：
>  1. 以上三种配置参数的优先级为：link标签的>script标签>全局对象
>  2. 对象属性名称不驼峰 (e.g logLevel -> data-log-level)
>  3. link标签的配置只和时间选项有关，其他不起作用(e.g verbose, logLevel ... are not supported）

### 3.3 注意事项

 1. 确保包涵.less样式表在less.js脚本之前
 2. 当你引入多个.less样式表时，它们都是独立编译的。所以，在每个文件中定义的变量、混合、命名空间都不会被其它的文件共享。
 3. Due to the same origin policy of browsers loading external resources requires enabling CORS.同源策略，小心跨域问题

### 3.4  参数解析
#### 3.4.1 async
```
Type: Boolean
Default: false
```
Whether to request the import files with the async option or not. See fileAsync.
是否异步加载重要文件


#### 3.4.3 env
```
Type: String Default: depends on page URL

```
运行环境，如果是production，你的css文件将被缓存到本地并且信息不会输出到控制台。如果url以file://开头或者在你本地或者没有标准的端口，这都将被认为是development模式。
例如：
```js
less = { env: 'production' };
```



#### 3.4.9 globalVars
```
Type: Object

Default: undefined

```

全局变量列表注入代码。“字符串”类型的变量必须显式地包含引号。

```js
less.globalVars = { myvar: "#ddffee", mystr: "\"quoted\"" };
```

This option defines a variable that can be referenced by the file. Effectively the declaration is put at the top of your base Less file, meaning it can be used but it also can be overridden if this variable is defined in the file.(翻译：这个选项定义了一个可以被文件引用的变量。这个变量也可以在文件中重新定义。)

#### 3.4.10 modifyVars
```
Type: Object

Default: undefined
```

Same format as globalVars.

As opposed to the globalVars option, this puts the declaration at the end of your base file, meaning it will override anything defined in your Less file.(翻译：与 globalVars参数含义相反,它将会在你文件最后定义，这意味着它将重写你在文件定义的变量)


#### 3.4.2 dumpLineNumbers

```
Type: String Options: ''| 'comments'|'mediaquery'|'all' Default: ''

```
如果设置了，这增加了源代码行信息输出的CSS文件。这有助于您调试，分析其中一个特定的规则是从哪里来的。
comments 选项用于输出user-understandable内容,
mediaquery 选项用于使用火狐插件解析css文件信息.

在未来我们希望这个选项被sourcemaps取代。

#### 3.4.4 errorReporting
```
Type: String

Options: html|console|function

Default: html

```
设置编译失败时错误报告的方法。

#### 3.4.5 fileAsync
```
Type: Boolean

Default: false
```

当以file协议访问页面，是否异步引入文件

#### 3.4.6 functions

```
Type: object
```

用户自定义函数
```less
e.g.

less = {
    functions: {
        myfunc: function() {
            return new(less.tree.Dimension)(1);
        }
    }
};
```
可以像Less函数一样使用它。
```css
.my-class {
  border-width: unit(myfunc(), px);
}

```
####3.4.7 logLevel
Type: Number

Default: 2

在控制台输出日志的数量。如果是production环境，将不会输出任何信息。
2 - Information and errors1 - Errors0 - Nothing


#### 3.4.8 relativeUrls
```
Type: Boolean

Default: false
```

使用相对路劲。如果设置FALSE，则url是相对根目录文件。


#### 3.4.11 rootpath
```
Type: String

Default: false
```

设置根目录，所有的Less文件都会以这个目录开始。

#### 3.4.12 useFileCache
```
Type: Boolean

Default: true (previously false in before v2)
```

#### 3.4.13 poll
```
Type: Integer

Default: 1000
```
在观察模式下，测试的时间。

是否要使用每个会话文件缓存。缓存文件可以使用modifyVars，并且它不会再次检索所有文件。如果您使用观察模式或调用刷新加载设置为true,那么运行之前缓存将被清除。



  [1]: http://lesscss.cn/
  [2]: http://lesscss.cn/usage/#using-less-in-the-browser