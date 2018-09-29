---
title: JS作用域系列2——执行上下文
date: 2018-09-28 12:55:03
tags: JS
categories: 工作
---

综述：
    在《JS作用域系列1——this》中讲了一个this啥时候赋值的时候讲的整个流程就是一个执行环境的创建
<!-- more -->
## （1）执行上下文(执行环境)

> 涉及到上下文，函数的作用域或者说是执行环境
### 1.1 this的指向
略，在《JS作用域系列1——this》
### 1.2(为什么this的指向不定呢)执行环境创建过程

一个函数被执行时，会创建一个执行环境（ExecutionContext），函数的所有的行为均发生在此执行环境中。**构建该执行环境时：**

    1. JavaScript 首先会创建 arguments变量，其中包含调用函数时传入的参数。
    2. 接下来创建作用域链。
    3. 然后初始化变量，
        - 3.1 首先初始化函数的形参表，值为arguments变量中对应的值，如果arguments变量中没有对应值，则该形参初始化为 undefined；
        - 3.2 如果该函数中含有内部函数，则初始化这些内部函数；
        - 3.3 如果没有，继续初始化该函数内定义的局部变量，需要注意的是**此时这些变量初始化为 undefined，其赋值操作在执行环境（ExecutionContext）创建成功后，函数执行时才会执行；
        **这点对于我们理解 JavaScript 中的变量作用域非常重要，鉴于篇幅，我们先不在这里讨论这个话题。**
    4. 最后为 this变量赋值，如前所述，**会根据函数调用方式的不同**，赋给 this全局对象，当前对象等。

至此函数的执行环境（ExecutionContext）创建成功，函数开始逐行执行，所需变量均从之前构建好的执行环境（ExecutionContext）中读取。
 

> 上面的文字非常的好，非常大好
![执行上下文创建流程][2]

  
  而这个执行环境怎么表示呢？js为每一个执行环境关联了一个变量对象VO（Variable Object ）。这个变量对象具体包含了argument、函数的形参，局部变量（内部变量）
  
## 1.3 执行环境、执行上下文(Execution Context)

**每个函数都有自己的执行环境**。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。而在函数执行后，栈将其环境弹出，把控制权返回给之前的执行环境。 

### 1.3.1 执行环境的建立分为两个阶段：
> 进入执行上下文（创建阶段）和执行阶段（激活/执行阶段）

 1. 进入上下文阶段：就是执行环境的创建，发生在函数调用时，但在执行具体代码之前(上面图的最后一步)。具体完成创建，作用域链；创建变量、函数和参数以及求this的值 
 2. 执行代码阶段：主要完成变量赋值、函数引用和解释/执行其他代码
    
  > 总的来说可以将执行上下文看作是一个对象
    EC = {
       VO:{/*函数中的arguments对象、参数、内部变量以及函数声明*/},
       this:{},
       Scope:{/*VO以及所有父执行上下文中的VO*/}
    }
  > **EC的组成正好将执行环境创建的过程给拆分了**

> 这里需要说明一下：函数表达式不包含在变量对象之中
>     var foo = 10;  
>     function bar() {} // function declaration, FD  
>     (function baz() {}); // function expression, FE  
> 
>     console.log(  
>       this.foo == foo, // true  
>       window.bar == bar // true  
>     );  
> 
>     console.log(baz); // ReferenceError, "baz" is not defined

之后，全局上下文的变量对象为 
![此处输入图片的描述][3]


  [1]: https://raw.githubusercontent.com/XYooo/image/master/this1.png
  [2]: https://raw.githubusercontent.com/XYooo/image/master/this2.png
  [3]: https://raw.githubusercontent.com/XYooo/image/master/this3.png
  [4]: https://raw.githubusercontent.com/XYooo/image/master/this4.png
  [5]: https://raw.githubusercontent.com/XYooo/image/master/this5.png