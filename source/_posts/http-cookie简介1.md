---
title: http-cookie简介1
date: 2019-01-04 14:41:49
tags: http
---
了解一下cookie
<!--  more -->


## 1.前言

首先了解一下什么是cookie?

**cookie是一种WEB服务器通过浏览器在访问者的硬盘上存储信息的手段**。IE浏览器把Cookie信息保存在类似于C://windows//cookies的目录下。


当用户再次访问某个站点时,服务端将要求浏览器查找并返回先前发送的Cookie信息,来识别这个用户。


cookies给网站和用户带来的好处非常多:

- 1、Cookie能使站点跟踪特定访问者的访问次数、最后访问时间和访问者进入站点的路径

- 2、Cookie能告诉在线广告商广告被点击的次数,从而可以更精确的投放广告

- 3、Cookie有效期限未到时,Cookie能使用户在不键入密码和用户名的情况下进入曾经浏览过的一些站点

- 4、Cookie能帮助站点统计用户个人资料以实现各种各样的个性化服务

## 2. cookie 存在哪里？
> **cookie是一种WEB服务器通过浏览器在访问者的硬盘上存储信息的手段**

一般存在浏览器目录中的文本文件中

## 3.cookie分为多少种？

- 1.带失效时间expires的，在下次访问之前，如果失效时间到期，会自动清除对应cookie，expires和maxAge的概念差不多，通常两个时间都是一样的，一个是时间，一个时间长度，前者是HTTP/1.0 protocol，后者是HTTP/1.1 protocol，为了向下兼容而已，所以，最好是两个参数都设置

- 2.跟随session结束就自动清除的，这种cookie很常见。通常你会在console看到它的expires时间是1969年的或者所边当前时间还要早的时间或者session，这种cookies会在会话结束的同时清除掉

## 4.Cookie的工作原理是什么？

前面我们说了Cookie一般存在浏览器目录中的文本文件中，并且会根据domain分开存放，比如，当你输入jianshu.com的时候，浏览器会向jianshu发送一个request，然后server根据request来返回response，把结果在显示器中显示，当你发送这个request的时候，浏览器会寻找当前浏览器目录中是否存在jianshu.com的相关cookie，如果有，浏览器会把Cookie文件中的数据放在request header中一起向server发送，服务器收到Cookie数据，服务器会根据你的cookie信息做一些相应的处理，比如第一次访问的话，会为你创建一个新的session id，否者来检测你是否需重新登录等等操作。

## 5. Cookie包含哪些字段？

### 5.1 查看cookie

比如在chrome下打开jianshu.com，F12 -> Application -> Cookies -> https://www.jianshu.com

![chrome下cookie查看](https://upload-images.jianshu.io/upload_images/5342565-24141bac572d3c5f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1000/format/webp)


> 一个域名下面可能存在着很多个cookie对象。

> **也可以在Console里边输入document.cookies，但是只显示非HTTP的cookie name和value，没有其他信息**

### 5.2 cookie字段解析

**name**字段为一个cookie的名称。

**value**字段为一个cookie的值。

**domain**字段为可以访问此cookie的域名。

> 1、~~非顶级域名，如二级域名或者三级域名，设置的cookie的domain只能为顶级域名或者二级域名或者三级域名本身，不能设置其他二级域名的cookie，否则cookie无法生成。~~

> 2、顶级域名只能设置domain为顶级域名，不能设置为二级域名或者三级域名，否则cookie无法生成。

> 3、二级域名能读取设置了domain为顶级域名或者自身的cookie，不能读取其他二级域名domain的cookie。
>
> 所以要想cookie在多个二级域名中共享，需要设置domain为顶级域名，这样就可以在所有二级域名里面或者到这个cookie的值了。

> 4、顶级域名只能获取到domain设置为顶级域名的cookie，其他domain设置为二级域名的无法获取。

   **path**字段为可以访问此cookie的页面路径。 比如domain是abc.com,path是/test，那么只有/test路径下的页面可以读取此cookie。
> domain+path =可以读取此cookie的url

**expires/Max-Age**字段为此cookie超时时间。
若设置其值为一个时间，那么当到达此时间后，此cookie失效。**不设置的话默认值是Session，意思是cookie会和session一起失效**。当浏览器关闭(不是浏览器标签页，而是整个浏览器) 后，此cookie失效。

**Size**字段为此cookie大小。

**http**字段为cookie的httponly属性。若此属性为true，则只有在http请求头中会带有此cookie的信息，而不能通过document.cookie来访问此cookie。

**secure**字段为设置是否只能通过https来传递此条cookie

### 5.3 cookie设置过期时间


```javascript
cookie.setMaxAge(0);//不记录cookie


cookie.setMaxAge(-1);//会话级cookie,关闭浏览器失效


cookie.setMaxAge(60*60);//过期时间为1小时

```
### 5.4 cookie的其他操作

 主要是两种方式
 - 前端操作
 - 后端操作
 
#### 5.4.1 前端操作cookie

以chrome为例子，可以直接在console里边对cookie进行修改，例如我们将default_font改成Simplified
> **当然这只是举个例子，至于修改完重新发送请求到jianshu server之后会不会有作用，这个取决于jianshu server**

F12 -> Console，输入：

```javascript
document.cookie = "default_font=Simplified;path=/"

```
#### 5.4.2 后端服务器操作
可以直接在response上面进行操作，你可以直接抹掉某个cookie

```javascript
response.clearCookie('default_font')
```

这个时候回来的response header就不会带default_font这个cookie了
也可以修改已存在的cookie过期时间或者加入新的cookie，nodejs的application可以使用cookie.js

```javascript
res.setHeader('Set-Cookie', cookie.serialize('my_cookie', 'my_value', {
    httpOnly: false,
    expires: "Mon, 11 Jun 2018 05:47:25 GMT"
    maxAge: 60 * 60 * 24 * 7 // 1 week
}));

```

这个时候浏览器就会接受到一个包含cookie为my_cookie=my_value，并且过期时间为一个星期的response。

## 参考文献
[关于Cookie的一些思考和理解](https://www.jianshu.com/p/64c0f5d073bb)

[cookie过期时间设置](https://www.aliyun.com/jiaocheng/829186.html)


## 遇见的状况

- 1.如果cookie设置了一个已经过期的字段，那么在chrome下的cookie则会不展示这个字段；document.cookie也不会展示这个字段，等于白写；