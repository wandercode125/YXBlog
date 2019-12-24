---
title: JS作用域系列—作用域
date: 2018-09-28 12:55:03
tags: JS
categories: 总结
---

综述：
在《JS作用域系列—this》中所讲的整个流程就是一个执行环境的创建。
执行环境又称为作用域又称为执行上下文。

<!-- more -->
## 1. 执行上下文(执行环境)

> 涉及到上下文，函数的作用域或者说是执行环境

### 1.1 this的指向

略，在《JS作用域系列1——this》


### 1.2 执行环境的创建
为什么this的指向不定的原因？
一个函数被执行时，会创建一个执行环境（ExecutionContext），函数的所有的行为均发生在此执行环境中。**构建该执行环境时：**
 >   
    1. JavaScript 首先会创建 arguments变量，其中包含调用函数时传入的参数。
    2. 接下来创建作用域链。
    3. 然后初始化变量，
        - 3.1 首先初始化函数的形参表，值为arguments变量中对应的值，如果arguments变量中没有对应值，则该形参初始化为 undefined；
        - 3.2 如果该函数中含有内部函数，则初始化这些内部函数；
        - 3.3 如果没有，继续初始化该函数内定义的局部变量，需要注意的是此时这些变量初始化为undefined，其赋值操作在执行环境（ExecutionContext）创建成功后，函数执行时才会执行；这点对于我们理解JavaScript中的变量作用域非常重要，鉴于篇幅，我们先不在这里讨论这个话题。
    4. 最后为 this变量赋值，如前所述，**会根据函数调用方式的不同**，赋给 this全局对象，当前对象等。

至此函数的执行环境（ExecutionContext）创建成功，函数开始逐行执行，所需变量均从之前构建好的执行环境（ExecutionContext）中读取。
 

> 上面的文字非常的好，非常大好
![执行上下文创建流程][2]

++上图还有一个大难点就是创建作用域链，下篇文章专讲++

而这个执行环境怎么表示呢？js为每一个执行环境关联了一个变量对象VO（Variable Object ）。这个变量对象具体包含了argument、函数的形参，局部变量（内部变量）

>详情见《js作用域系列-this》
  
### 1.3 Execution Context
**执行环境、执行上下文**

**每个函数都有自己的执行环境**。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。而在函数执行后，栈将其环境弹出，把控制权返回给之前的执行环境。 


#### 1.3.1 执行环境的建立
分为两个阶段：

> 进入执行上下文（创建阶段）和执行阶段（激活/执行阶段）

（1）进入上下文阶段：就是执行环境的创建，**发生在函数调用时，但在执行具体代码之前**(上面图的最后一步)。具体完成创建，作用域链；创建变量、函数和参数以及求this的值 
（2）执行代码阶段：主要完成变量赋值、函数引用和解释/执行其他代码
   
  **总的来说可以将执行上下文看作是一个对象**
  
   
```JavaScript
EC = {
        Scope:{/*VO以及所有父执行上下文中的VO，或者称之为作用域链*/}
       VO:{/*函数中的arguments对象、参数、内部变量以及函数声明*/},
       this:{},
       
    }
```

    
 **EC的组成正好将执行环境创建的过程给拆分了**

#### 1.3.2 函数表达式
 这里需要说明一下：函数表达式不包含在变量对象之中
   
```
function bar() {} // function declaration, FD  
    (function baz() {}); // function expression, FE  

    console.log(  
        this.foo == foo, // true  
        window.bar == bar // true  
     );  

   console.log(baz); // ReferenceError, "baz" is not defined
```

## 2 实战

如果上面的过程你真的会了，下面几道道题。

### 2.1.只有形参
创建：初始化形参a
执行：逐行执行，a是形参
```javascript
t(null);function t(a){console.log(a);}
// null

```
### 2.2.形参+function名
创建：初始化形参和function，同名function覆盖形参，a指想function a
执行：逐行执行，a是function
```javascript
t(null);
function t(a){
    console.log(a);
    function a(){alert(12)};
    console.log(a)
}
// ƒ a(){alert(12)}
// ƒ a(){alert(12)}

```

### 2.3-0.形参+局部变量
解析：
创建：初始化形参a；局部变量a重名不覆盖（因为不赋值是undefined）
执行：逐行执行，a是形参，输出a，作用域找a给a赋值2，输出a
```javascript
t(null);function t(a){console.log(a);var a = 2;console.log(a);}
//null
// 2
```

解析：
创建：初始化形参a，局部变量a重名不覆盖
执行：逐行执行，a是形参，形参a等于null，找a给a赋值2，输出a
```javascript
t(null);function t(a){var a = 2;console.log(a);console.log(a);}
// 2
// 2
```
解析：
创建：初始化形参a，局部变量a重名不覆盖
执行：逐行执行，a是形参，形参a等于null，输出a；找a，a存在且是形参，输出a
```javascript
t(null);function t(a){console.log(a);var a ;console.log(a);}
// null
// null
```
解析：
创建：初始化形参a，同名局部变量a是undefined不覆盖
执行：逐行执行，形参a等于null，输出a
```javascript
t(null);function t(a){var a ;console.log(a);console.log(a);}
// null
// null
```
> 创建时：同名局部变量不会覆盖同行形参也不会覆盖同名函数名
> 执行时：只有赋值操作才能改变上述同名

### 2.3.形参+局部变量+function名
创建：初始化形参a，a被同名函数名覆盖，同名局部变量a是undefined不进行覆盖
执行：逐行执行，a是同名函数，找到a，赋值a等于2，输出a
```javascript
t(null);
function t(a){
    var a = 2;
    console.log(a);
    function a(){alert(12)};
    console.log(a)
}
// 2
// 2

```
#### 2.3-1.形参+局部变量（位置改变）+function名
创建：初始化形参a，a被同名函数名覆盖，同名局部变量a是undefined不进行覆盖
执行：逐行执行，a是函数，输出a，输出a
```javascript
t(null);
function t(a){
    console.log(a);
    function a(){alert(12)};
    console.log(a);
    var a = 2;
}
// ƒ a(){alert(12)}
//ƒ a(){alert(12)}
```

#### 2.3-2.形参+局部变量（位置改变）+function名
创建：初始化形参a，a被同名函数名覆盖，同名局部变量a是undefined不进行覆盖
执行：逐行执行，a是函数，输出a，找到a赋值a等于2，输出a

```javascript
t(null);
function t(a){
    console.log(a);
    var a = 2;
    function a(){alert(12)};
    console.log(a);

}
// ƒ a(){alert(12)}
// 2
```
#### 2.3-3.形参+局部变量（位置改变）+function名
创建：初始化形参a，a被同名函数名覆盖，同名局部变量a是undefined不进行覆盖
执行：逐行执行，a是函数，输出a，找到a赋值a等于2，输出a

```javascript
t(null);
function t(a){
    console.log(a);
    function a(){alert(12)};
    var a = 2;
    console.log(a);
}
//ƒ a(){alert(12)}
//1 2

```
### 2.4.同理window作用域下

创建：初始化函数a，同名局部变量a是undefined不进行覆盖
执行：逐行执行，a是函数，输出a，找到a赋值a等于2，输出a

```javascript

console.log(a);var a = 3;function a(){alert('a')}console.log(a)
// ƒ a(){alert('a')}
//3
```

  [1]: https://raw.githubusercontent.com/XYooo/image/master/this1.png
  [2]: https://raw.githubusercontent.com/XYooo/image/master/this2.png
  [3]: https://raw.githubusercontent.com/XYooo/image/master/this3.png
  [4]: https://raw.githubusercontent.com/XYooo/image/master/this4.png
  [5]: https://raw.githubusercontent.com/XYooo/image/master/this5.png