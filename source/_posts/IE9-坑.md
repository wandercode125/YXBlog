---
title: IE9-坑
date: 2019-06-29 11:31:18
tags: IE
---

陆续完善下工作中遇见的ie9的坑。当然这都是初级的坑

## 1 上传

上传一直是很麻烦的事情，还好我有源码


### 1.1 非IE9，利用input的upload来上传图片

[上传图片](/2018/12/25/IE9-上传图片/)


## 2 ie9下css加载不全
[ie9css加载不全](/2018/12/25/IE9-CSS的限制/)

## 3 ie判断汇总

### 3.1 是否是ie环境

1.在html上
```html

<!--[if IE]>
<p>Work in IE browser</p>
<![endif]-->

```
2.在js中

```javascript
(!!window.ActiveXObject || 'ActiveXObject' in window) ?
<p>Work in IE browser</p> : '' }

```
### 3.2 ie的事件绑定

暂定

### 3.3 其他

IE9不支持formdata
IE9不支持文件File接口
IE9不支持application/json格式
IE9不支持通过e.target.value获取dom组件的value值（input、select等）
IE9不支持250kcss
IE9不支持很多css3，如animation
IE9不支持h5 Input控件（select等）
IE9react下不支持BrowerRouter、支持HashRouter


### 3.3 window.location.origin

有时候需要拼接url，注意window.location.origin在ie9\8 下并找不到。因此用下面的方式进行替换window.location.origin

```javascript

const windowLocationOrigin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');//ie8-ie10不兼容的原因


```