---
title: webpack下的libraryTarget（2）
date: 2019-03-28 20:03:45
tags: 模块化
---


> 上述代码是返回值，区别在于

###  具体栗子

- 
```
var PapRefer = function(e){var t={};.....
libraryTarget ='var';library="PapRefer";
```
- 
```
this.PapRefer = function(e){var t={};.....
libraryTarget ='this';library="PapRefer";
```
- 
```
window.PapRefer = function(e){var t={};.....
libraryTarget ='window';library="PapRefer";
```
- 
```
window.PapRef=function(e){var t={};.....
libraryTarget ='global';library="PapRefer";
```
- 
```
exports.PapRef=function(e){var t={};.....
libraryTarget='commonjs';library="PapRefer";
```


- 
```
module.exports=function(e){var t={};......
libraryTarget='commonjs2';library="PapRefer";
```
- 
```
define("PapRef",["react","prop-types","tinper-bee","react-dom"],function(__WEBPACK_EXTERNAL_MODULE__1__,__WEBPACK_EXTERNAL_MODULE__2__,__WEBPACK_EXTERNAL_MODULE__5__,__WEBPACK_EXTERNAL_MODULE__7__).....

libraryTarget='amd';library="PapRefer";
  ```
  
   
- 
```
!function(e,t){"object"==typeof exports&&"object"==typeof module.......
libraryTarget='umd';library="PapRefer";
```
