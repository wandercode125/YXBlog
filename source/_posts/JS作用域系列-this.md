---
title: JS作用域系列—this
date: 2018-09-28 11:55:09
tags: javascript
categories: 总结
---
综述：关于this最想知道的内容估计就是this的指向了，但是在js中，this的指向的确定不是在定义时候，而是在执行的时候，因为执行方式（调用方式）有多种。

<!-- more -->

### 1.1 this的指向

首先必须要说的是，this的指向在**函数定义的时候**是确定不了的，**只有函数执行的时候才能确定** this到底指向谁
> 学习了很多文章，觉得《你不知道的javascript》上册中描述的最好。这里不做摘抄。
### 1.2为什么this的指向不定呢
总结的一段话：**（IBM developerworks文档库来源）JavaScript 中的函数既可以被当作普通函数执行，也可以作为对象的方法执行，这是导致 this 含义如此丰富的主要原因。**
一个函数被执行时，会创建一个执行环境（ExecutionContext），函数的所有的行为均发生在此执行环境中。
> 上面那句话也是来自某篇博客，但是关于创建ExecutionContext不如直接看Ecmascript的官方文档[《8Executable Code and Execution Contexts》](https://262.ecma-international.org/11.0/#sec-executable-code-and-execution-contexts)

**构建该执行环境时：**

    1. JavaScript 首先会创建 arguments变量，其中包含调用函数时传入的参数。
    2. 接下来创建作用域链。（很关键的内容，但是不是本篇blog的关键，请读者们忽略）
    3. 然后初始化变量，
        - 3.1 首先初始化函数的形参表，值为arguments变量中对应的值，如果arguments变量中没有对应值，则该形参初始化为 undefined。
        - 3.2 如果该函数中含有内部函数，则初始化这些内部函数。
        - 3.3 如果没有，继续初始化该函数内定义的局部变量，需要注意的是此时这些变量初始化为undefined，其赋值操作在执行环境（ExecutionContext）创建成功后，函数执行时才会执行
        - 这点对于我们理解JavaScript中的变量作用域非常重要，鉴于篇幅，我们先不在这里讨论这个话题。
    4. 最后为 this变量赋值，如前所述,会根据函数调用方式的不同，赋给 this全局对象，当前对象等。


至此函数的执行环境（ExecutionContext）创建成功，函数开始逐行执行，所需变量均从之前构建好的执行环境（ExecutionContext）中读取。
 
> 上面的文字非常的好，对于理解JS作用域系列也非常关键。将上述文字转化成流程图如下：
>
> ![执行上下文创建流程][2]
> 
> **红色文字，就是JS作用域系列几篇内容需要讲解的**

而这个执行环境怎么表示呢？总的来说可以将执行上下文看作是一个对象
```javascirpt
EC = {
    Scope:{/*VO以及所有父执行上下文中的VO*/}
    VO:{/*函数中的arguments对象、参数、内部变量以及函数声明*/}
    this:{},
}
```

### 1.3 this的指向规则
    1.隐式绑定（即使用.）》
    2.显式绑定 (call,apply,bind)
    3.new 绑定
    4.window 绑定

### 1.4 判断this的指向

绑定规则 四种
1. 默认绑定
2. 隐式绑定
   1. 隐式绑定，调用位置是否有上下文对象，
   2. 或者说是否被某个对象拥有或者包含，不过这种说法可能会造成一些误导。
   3. 或者说通过dot引用的。
3. 显示绑定
   1. JavaScript提供的绝大多数函数
   2. 以及你自己创建的所有函数都可以使用 call(..) 和 apply(..) 方法。
4. new绑定

> 强弱程度 new 绑定> 显式绑定 (call,apply,bind) > 隐式绑定（即使用.）>window 绑定

因此，将所有规则付诸实践，每当我在函数内部看到 this 关键字时，这些就是我为了判断它的引用而采取的步骤。
1. 查看函数在哪被调用。
2. 该函数是不是用 “new” 调用的？如果是，“this” 指向的就是 JavaScript 解释器新创建的对象。如果不是，继续第 3 步。
3. 该函数是不是用 “call”、“apply” 或者 “bind” 调用的？如果是，它会显式地指明 “this” 的引用。如果不是，继续第 4 步。
4. 点左侧有没有对象（隐式绑定）？如果有，它就是 “this” 的引用。如果没有，继续第 5步。
5. 是否在“严格模式”下？如果是，“this” 就是 undefined，如果不是，继续第 6 步。
6. JavaScript 很奇怪，“this” 会指向 “window” 对象。
(参考你不知道的js上册)
> 除了3，5，其他与上面的图是对应的
 
  [1]: https://raw.githubusercontent.com/XYooo/image/master/this1.png
  [2]: https://raw.githubusercontent.com/XYooo/image/master/this2.png
  [3]: https://raw.githubusercontent.com/XYooo/image/master/this3.png
  [4]: https://raw.githubusercontent.com/XYooo/image/master/this4.png
  [5]: https://raw.githubusercontent.com/XYooo/image/master/this5.png