---
title: JS作用域系列—apply/bind/call
date: 2018-09-28 11:56:09
tags: javascript
categories: 总结
---
# 1 摘要
`call` `apply` `bind`都可以改变函数调用的this指向。

## 1.1 apply语法
```javascript
fun.apply(thisArg, argsArray)
```
1. `thisArg` 在 `fun` 函数运行时指定的 this 值。
   1. 需要注意的是，指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 `null` 或 `undefined` 时会自动指向全局对象（浏览器中就是window对象），
   2. 同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象。
2. `argsArray` 一个数组或者类数组对象，
   1. 其中的数组元素将作为单独的参数传给 fun 函数。
   2. 如果该参数的值为null 或 undefined，则表示不需要传入任何参数。
   3. 从ECMAScript 5 开始可以使用类数组对象。

## 1.2 call语法
```javascript
fun.call(thisArg, arg1, arg2, ...)
```
1. `thisArg`: 在fun函数运行时指定的this值。
   1. 需要注意的是，指定的this值并不一定是该函数执行时真正的this值，如果这个函数处于非严格模式下，则指定为null和undefined的this值会自动指向全局对象(浏览器中就是window对象)，
   2. 同时值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象。
2. `arg1`, `arg2`, ... 指定的参数列表


## 1.3 bind语法
```javascript
fun.bind(thisArg[, arg1[, arg2[, ...]]])
```
1. `thisArg` 当绑定函数被调用时，该参数会作为原函数运行时的 this 指向。
   1. **当使用new 操作符调用绑定函数时，该参数无效。（结合看《你不知道javascript上》bind的polyfill）**
2. `arg1`, `arg2`, `...`当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。


# 2  总结

- `call`跟`apply`的用法几乎一样，唯一的不同就是传递的参数不同，
    -  `call`只能一个参数一个参数的传入。
    -  `apply`则只支持传入一个数组，哪怕是一个参数也要是数组形式。最终调用函数时候这个数组会拆成一个个参数分别传入。
- bind方法，他是直接改变这个函数的this指向**并且返回一个新的函数**，之后再次调用这个函数的时候this都是指向bind绑定的第一个参数。bind传餐方式跟call方法一致。



>1当我们使用一个函数需要改变this指向的时候才会用到`call`,`apply`,`bind`
>
>2如果你要传递的参数不多，则可以使用fn.call(thisObj, arg1, arg2 ...)
>
>3如果你要传递的参数很多，则可以用数组将参数整理好调用fn.apply(thisObj, [arg1, arg2 ...])
>
>4如果你想生成一个新的函数长期绑定某个函数给某个对象使用，则可以使用const newFn = fn.bind(thisObj); newFn(arg1, arg2...)


# 3 小技巧
## 3.1 bind的小技巧

```javascript
// 如果你想将某个函数绑定新的`this`指向并且固定先传入几个变量可以在绑定的时候就传入，之后调用新函数传入的参数都会排在之后
const obj = {}
function test(...args) {console.log(args)}
const newFn = test.bind(obj, '静态参数1', '静态参数2')
newFn('动态参数3', '动态参数4')

```
**主要目的是预先设置函数的一些参数，后面再进行初始化时就可以只传入其余的参数。**

输出
```javascript
(4) ["静态参数1", "静态参数2", "动态参数3", "动态参数4"]
```


# 4 模拟实现 call 和 apply

## 4.1 模拟实现 call 


## 4.2 模拟实现 apply

## 4.3 模拟实现bind


# 5 参考文献

[文章1](https://yuchengkai.cn/docs/frontend/#%E6%A8%A1%E6%8B%9F%E5%AE%9E%E7%8E%B0-call-%E5%92%8C-apply)