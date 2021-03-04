---
title: window.location.search
date: 2019-07-16 11:03:08
tags: window 
---

有时候需要从window.location.search去掉的值是空的，配合一些方法就会报错。甚至有时候不是空有的时候是空的，那么原因是因为是什么？

<!-- more -->


## 1. 定义 ?

URL：http://b.a.com:88/index.php?name=kang&when=2016#first

|属性 |含义 |值 |
| --------   | :----------- | :---- |
|protocol:	|协议	| "http:"
|hostname:  |	服务器的名字|	"b.a.com"
|port:  |	端口|	"88"
|pathname:  | URL中主机名后的部分	|"/index.php"
|search:  |	"?"后的部分，又称为查询字符串|	"?name=kang&when=2016"
|hash:  |	返回"#"之后的内容	| "#first"
|host:  |	等于hostname + port	|"b.a.com:88"| 
|href:  |	当前页面的完整URL	|"http://www.a.com:88/index.php?name=kang&when=2016#first"


location的8个属性都是可读写的，但是只有href与hash的写才有意义。

例如改变location.href会重新定位到一个URL，

而修改location.hash会跳到当前页面中的anchor(`<a id="name">或者<div id="id">`等)名字的标记(如果有)，而且页面不会被重新加载


## 2 为什么为空?
答： **查询字符串search只能在取到“？”后面和“#”之前的内容，如果“#”之前没有“？”search取值为空。**

注意上面的search和hash的区别，如果URL中“？”之前有一个“#”，比如：`http://localhost:63342/index.html#/version?type=35&id=5`。
那么使用`window.location.search`得到的就是空（“”）。

因为`？type=35&id=5`串字符是属于`#/version?type=35&id=5`这个串字符的，