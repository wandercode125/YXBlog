---
title: JS作用域系列-apply/bind/call
date: 2019-07-21 21:05:03
tags: javascript
categories: 总结
---

之前对于这块非常的模糊，经常看到但是不是很理解，百度完了看完之后就忘记了。结果现在做的项目中处处用到这几个方法，原因是因为现在的项目嵌套层级太深了，希望使用这几个方法，能够让几个文件共享变量。

<!--more-->


# 1 摘要
我们都知道`call` `apply` `bind`都可以改变函数调用的this指向。

## 1.1 apply语法
```javascript
fun.apply(thisArg, [argsArray])
```
`thisArg` 在 `fun` 函数运行时指定的 this 值。需要注意的是，指定的 this 值并不一定是该函数执行时真正的 this 值，如果这个函数处于非严格模式下，则指定为 `null` 或 `undefined` 时会自动指向全局对象（浏览器中就是window对象），同时值为原始值（数字，字符串，布尔值）的 this 会指向该原始值的自动包装对象。

`argsArray` 一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 fun 函数。如果该参数的值为null 或 undefined，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。

## 1.2 call语法
```javascript
fun.call(thisArg, arg1, arg2, ...)

```
`thisArg`: 在fun函数运行时指定的this值。需要注意的是，指定的this值并不一定是该函数执行时真正的this值，如果这个函数处于非严格模式下，则指定为null和undefined的this值会自动指向全局对象(浏览器中就是window对象)，同时值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象。

`arg1`, `arg2`, ... 指定的参数列表


## 1.3 bind语法
```javascript
fun.bind(thisArg[, arg1[, arg2[, ...]]])

```
`thisArg` 当绑定函数被调用时，该参数会作为原函数运行时的 this 指向。当使用new 操作符调用绑定函数时，该参数无效。

`arg1`, `arg2`, `...`当绑定函数被调用时，这些参数将置于实参之前传递给被绑定的方法。



# 2  总结


- `call`跟`apply`的用法几乎一样，唯一的不同就是传递的参数不同，

    -  `call`只能一个参数一个参数的传入。

    -  `apply`则只支持传入一个数组，哪怕是一个参数也要是数组形式。最终调用函数时候这个数组会拆成一个个参数分别传入。

- bind方法，他是直接改变这个函数的this指向并且返回一个新的函数，之后再次调用这个函数的时候this都是指向bind绑定的第一个参数。bind传餐方式跟call方法一致。



>1当我们使用一个函数需要改变this指向的时候才会用到`call`,`apply`,`bind`
>
>2如果你要传递的参数不多，则可以使用fn.call(thisObj, arg1, arg2 ...)
>
>3如果你要传递的参数很多，则可以用数组将参数整理好调用fn.apply(thisObj, [arg1, arg2 ...])
>
>4如果你想生成一个新的函数长期绑定某个函数给某个对象使用，则可以使用const newFn = fn.bind(thisObj); newFn(arg1, arg2...)


# 3 小技巧

## 3.1 apply的小技巧
```javascript
// 如果一个数组我们已知里面全都是数字，想要知道最大的那个数，由于Array没有max方法，Math对象上有
// 我们可以根据apply传递参数的特性将这个数组当成参数传入
// 最终Math.max函数调用的时候会将apply的数组里面的参数一个一个传入，恰好符合Math.max的参数传递方式
// 这样变相的实现了数组的max方法。min方法也同理
const arr = [1,2,3,4,5,6]
const max = Math.max.apply(null, arr)
console.log(max)    // 6


```


## 3.2 bind的小技巧

```javascript
// 如果你想将某个函数绑定新的`this`指向并且固定先传入几个变量可以在绑定的时候就传入，之后调用新函数传入的参数都会排在之后
const obj = {}
function test(...args) {console.log(args)}
const newFn = test.bind(obj, '静态参数1', '静态参数2')
newFn('动态参数3', '动态参数4')

```

输出

```javascript
(4) ["静态参数1", "静态参数2", "动态参数3", "动态参数4"]
```


# 4 模拟实现 call 和 apply

```javascript

let a = {
    value: 1
}
function getValue(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value)
}
getValue.call(a, 'yck', '24')
getValue.apply(a, ['yck', '24'])


```

输出

```javascript

yck
24
1
yck
24
1
```


目的是为了更能理解

可以从以下几点来考虑如何实现

- 不传入第一个参数，那么默认为 window
- 改变了 this 指向，让新的对象可以执行该函数。那么思路是否可以变成给新的对象添加一个函数，然后在执行完以后删除？

## 4.1 模拟实现 call 


```javascript

Function.prototype.myCall = function (context) {
  var context = context || window
  // 给 context 添加一个属性
  // getValue.call(a, 'yck', '24') => a.fn = getValue
  context.fn = this //ps 请注意这个this是调用myCall的函数指定的this，如上面的demo  this应该指定的是getValue(.myCall(a,...))
  // 将 context 后面的参数取出来
  var args = [...arguments].slice(1)//除了第一个
  // getValue.call(a, 'yck', '24') => a.fn('yck', '24')
  var result = context.fn(...args)
  // 删除 fn
  delete context.fn
  return result
}


```
## 4.2 模拟实现 apply



```javascript


Function.prototype.myApply = function (context) {
  var context = context || window
  context.fn = this

  var result
  // 需要判断是否存储第二个参数
  // 如果存在，就将第二个参数展开
  if (arguments[1]) {
    result = context.fn(...arguments[1])
  } else {
    result = context.fn()
  }

  delete context.fn
  return result
}

```

## 4.3 模拟实现bind



```javascript
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  var _this = this
  var args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments) //超级注意ps这里解释上面bind的小技巧
    }
    return _this.apply(context, args.concat(...arguments))
  }
}

```




# 5 参考文献

[文章1](https://yuchengkai.cn/docs/frontend/#%E6%A8%A1%E6%8B%9F%E5%AE%9E%E7%8E%B0-call-%E5%92%8C-apply)