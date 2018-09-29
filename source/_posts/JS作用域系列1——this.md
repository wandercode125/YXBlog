---
title: JS作用域系列1——this
date: 2018-09-28 11:55:09
tags: JS
categories: 工作
---

综述：
    关于this最想知道的内容估计就是this的指向了，但是再js中，this的指向的确定不是在定义时候，而是在执行的时候，因为执行方式（调用方式）有多种。
<!-- more -->

### 1.1 this的指向

首先必须要说的是，this的指向在**函数定义的时候** 是确定不了的，**只有函数执行的时候才能确定** this到底指向谁
下面是决策树，至于文字看面试2
![此处输入图片的描述][1]

### 1.2为什么this的指向不定呢
 
总结的一段话：**（IBM developerworks文档库来源）** 
**JavaScript 中的函数既可以被当作普通函数执行，也可以作为对象的方法执行，这是导致 this 含义如此丰富的主要原因。**

一个函数被执行时，会创建一个执行环境（ExecutionContext），函数的所有的行为均发生在此执行环境中。**构建该执行环境时：**
    1. JavaScript 首先会创建 arguments变量，其中包含调用函数时传入的参数。
    2. 接下来创建作用域链。
    3. 然后初始化变量，
        - 3.1 首先初始化函数的形参表，值为arguments变量中对应的值，如果arguments变量中没有对应值，则该形参初始化为 undefined。
        - 3.2 如果该函数中含有内部函数，则初始化这些内部函数。
        - 3.3 如果没有，继续初始化该函数内定义的局部变量，需要注意的是**此时这些变量初始化为 undefined，其赋值操作在执行环境（ExecutionContext）创建成功后，函数执行时才会执行，**
        这点对于我们理解 JavaScript 中的变量作用域非常重要，鉴于篇幅，我们先不在这里讨论这个话题。
    4. 最后为 this变量赋值，如前所述，**会根据函数调用方式的不同**，赋给 this全局对象，当前对象等。

至此函数的执行环境（ExecutionContext）创建成功，函数开始逐行执行，所需变量均从之前构建好的执行环境（ExecutionContext）中读取。
 

> 上面的文字非常的好，非常大好
![执行上下文创建流程][2]

  
而这个执行环境怎么表示呢？js为每一个执行环境关联了一个变量对象VO（Variable Object ）。这个变量对象具体包含了argument、函数的形参，局部变量（内部变量)

> 总的来说可以将执行上下文看作是一个对象
    EC = {
        VO:{/*函数中的arguments对象、参数、内部变量以及函数声明*/}
        this:{},
        Scope:{/*VO以及所有父执行上下文中的VO*/}
    }

  [1]: https://raw.githubusercontent.com/XYooo/image/master/this1.png
  [2]: https://raw.githubusercontent.com/XYooo/image/master/this2.png
  [3]: https://raw.githubusercontent.com/XYooo/image/master/this3.png
  [4]: https://raw.githubusercontent.com/XYooo/image/master/this4.png
  [5]: https://raw.githubusercontent.com/XYooo/image/master/this5.png