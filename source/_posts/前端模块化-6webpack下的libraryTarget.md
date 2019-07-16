---
title: 前端模块化-6webpack下的libraryTarget
date: 2019-03-28 20:03:45
tags: 模块化
---


> 上述代码是返回值，区别在于

###  具体栗子

## 1.1  libraryTarget ='var';library="PapRefer";

```javascript
var PapRefer = function(e){var t={};.....

```

## 1.2  libraryTarget ='this';library="PapRefer";
  
```javascript
this.PapRefer = function(e){var t={};.....

```
## 1.3  libraryTarget ='window';library="PapRefer";
```javascript
window.PapRefer = function(e){var t={};.....

```

## 1.4  libraryTarget ='global';library="PapRefer";

```javascript
window.PapRef=function(e){var t={};.....
```

## 1.5  libraryTarget='commonjs';library="PapRefer";

```javascript
exports.PapRef=function(e){var t={};.....

```

## 1.6 libraryTarget='commonjs2';library="PapRefer";
```javascript
module.exports=function(e){var t={};......

```
## 1.7  libraryTarget='amd';library="PapRefer";
```javascript
define("PapRef",["react","prop-types","tinper-bee","react-dom"],function(__WEBPACK_EXTERNAL_MODULE__1__,__WEBPACK_EXTERNAL_MODULE__2__,__WEBPACK_EXTERNAL_MODULE__5__,__WEBPACK_EXTERNAL_MODULE__7__).....


  ```
  
   
## 1.8 libraryTarget='umd';library="PapRefer";

看代码可以看出来使用几个if判断，因此umd的规范编译出来的代码可以适用于 commonjs和amd
```javascript
!function(e,t){"object"==typeof exports&&"object"==typeof module.......

```
