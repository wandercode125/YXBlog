---
title: JS作用域系列—作用域链
date: 2018-09-28 13:55:24
tags: JS
categories: 总结
---

综述：
在《JS作用域系列—作用域》中有个EC对象，包含VO，this，和Scope。Scope就是作用域链，也是在执行上下文创建流程图中第二步就开始创建作用域链了
    
<!-- more -->

## 1. 执行上下文(执行环境)
略，在《JS作用域系列—作用域》


## 2. 作用域链

### 2.1 作用域链用处

在红宝书中对作用域链的描述有这么一段话：

1. 当代码在一个环境中执行时，会创建变量对象的一个作用域链（作用域链指向变量对象）。所以作用域链的用途是保证对执行环境有权访问的所有变量和函数的有序访问。作用域链的前端始终是当前执行的代码所在环境的变量对象。

2. 如果这个环境是函数，则将其活动对象作为变量对象。活动对象在最开始时只包含一个变量，即arguments对象。作用域链的下一个变量对象来自包含环境，而在下一个变量对象则来自下一个包含环境。这样一直延续到全局执行环境；

3. 全局执行环境的变量对象始终都是作用域链中的最后一个对象。 全局环境的变量对象始终存在，而局部环境的变量对象，则只在函数执行的过程中存在。

> 活动对象 === 变量对象？
> 
> 当函数被调用的时候，一个特殊的对象——活动对象将会被创建。 换句话说，活动对象除了变量和函数声明之外，它还存储了形参和arguments对象。
> 这不就是vo（变量对象吗）吗？


### 2.2  作用域链知识总结

 - 当代码在一个环境中执行时，都会创建一个作用域链
。 **作用域链的用途是保证对执行环境有权访问的所有变量和函数的有序访问。整个作用域链的本质是一个指向变量对象的指针列表。作用域链的最前端，始终是当前正在执行的代码所在环境的变量对象，作用域链中的最后一个对象，始终是全局执行环境的变量对象。**
 
- 如果这个环境是函数，则将其活动对象（activation object)作为变量对象。活动对象在最开始时只包含一个变量，就是函数内部的arguments对象。作用域链中的下一个变量对象来自该函数的包含环境，而再下一个变量对象来自再下一个包含环境。这样，一直延续到全局执行环境，全局执行环境的变量对象始终是作用域链中的最后一个对象。

### 2.3 作用域链形成
  在创建XX函数时，会创建一个预先包含全局变量对象的作用域链，这个作用域链会被保存在内部的[[Scope]]属性中。当调用XX函数时，会为函数创建一个执行环境，然后通过赋值函数的[[Scope]]属性中的对象构建起执行环境的作用域链。

### 2.4 demo

无论什么时候在函数中访问一个变量时，就会从作用域链中搜索具有相应名字的变量。

一般来讲，当函数执行完毕后，局部活动对象就会被销毁，内存中仅保存全局作用域（全局执行环境的变量对象）**。但是闭包的情况又有所不同。**

![此处输入图片的描述][4]

在另一个函数内部定义的函数会将包含函数（即外部函数）的活动对象添加到它的作用域链中。因此，在createComparisonFunction()函数内部定义的匿名函数作用域链中，实际上将会包含外部函数createComparisonFunction()的活动对象。


```javascript
var compare = createCOmparisionFunction('name');
var result = compare({name:'jack'},{name:'lisa'});
//解除对匿名函数的引用
compareName = null ;

```


当上述代码执行时，下图展示了包含函数与内部匿名函数的作用域链 ![此处输入图片的描述][5]

在匿名函数从createComparisonFunction()中被返回后，它的作用域链被初始化为包含createComparisonFunction()函数的活动对象和全局变量对象。(从下面看)

这样，匿名函数就可以访问在createComparisonFunction()中定义的所有变量。更为重要的是， createComparisonFunction()函数在执行完毕后，**其活动对象也不会被销毁**，因为匿名函数的作用域链仍然在引用这个活动对象。**即当createComparisonFunction()函数返回后，其执行环境的作用域链会被销毁，但它的活动对象任然会留在内存中；**直到匿名函数被销毁后，createComparisonFunction()的活动对象才会被销毁。


  [1]: https://raw.githubusercontent.com/XYooo/image/master/this1.png
  [2]: https://raw.githubusercontent.com/XYooo/image/master/this2.png
  [3]: https://raw.githubusercontent.com/XYooo/image/master/this3.png
  [4]: https://raw.githubusercontent.com/XYooo/image/master/this4.png
  [5]: https://raw.githubusercontent.com/XYooo/image/master/this5.png