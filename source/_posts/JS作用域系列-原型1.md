---
title: JS作用域系列—原型1
date: 2018-09-28 15:55:58
tags: javascript
categories: 总结
---


<!--more-->

综述：前面讲了作用域vs作用域链，可以知道作用域链是作用域的部分内容。下面讲原型和原型链～～。涉及几个概念，普通对象vs函数对象；构造函数vs实例，prototype属性vs原型对象

注意：原型链总有例外，这里讲的都是100%可以推出来的，不存在特例

## 1 对象

### 1.1 对象就分两种

在此之前，先普及一下js中的对象分类：**JavaScript中，万物皆对象！**

但对象也是有区别的，**分为普通对象和函数对象**。Object 、Function 是 JS 自带的函数对象。

### 1.2 对象创建方式

我们可以简单的将创建对象的方式分为三种：
1. 函数创建对象、
2. 字面量创建、
3. Object创建。

### 1.3 普通对象和函数对象


```javascript

typeOf(普通对象) === object
typeOf(函数对象）====Function

```

```javascript
//demo1.js
var o1 = {}; 
var o2 =new Object();
var o3 = new f1();

function f1(){}; 
var f2 = function(){};
var f3 = new Function('str','console.log(str)');

console.log(typeof Object); //function 
console.log(typeof Function); //function  

console.log(typeof f1); //function 
console.log(typeof f2); //function 
console.log(typeof f3); //function   

console.log(typeof o1); //object 
console.log(typeof o2); //object 
console.log(typeof o3); //object

```

在上面的例子中 o1 o2 o3 为普通对象，f1 f2 f3 为函数对象。
>怎么区分，其实很简单，凡是通过 new Function() 创建的对象都是函数对象，其他的都是普通对象。

**f1,f2,归根结底都是通过 new Function()的方式进行创建的。Function Object 也都是通过 New Function()创建的。**


### 1.4 new Function是个特例

建议看完全篇之后再看这里


```javascript

var f3 = new Function('str','console.log(str)');
console.log(typeof f3); //function
f3.constructor === Function; //true


```

1. f3是实例，是函数对象而不是普通对象

```javascript

console.log(typeof Function.prototype) ;//function

Function.prototype.construtor == Function; //true

Function.prototype.prototype; //undefine

```
2. 原型对象，是函数对象不是普通对象，且这个函数对象没有protype属性

以上全都不符合总结部分的3.4.5条，请注意




## 2 构造函数：函数对象变身构造函数

一定要分清楚普通对象和函数对象，下面我们会常常用到它。

### 2.1 new操作 vs 实例对象

我们先复习一下构造函数的知识：

new一下就出现构造函数和实例了。

```javascript
function Person(name, age, job) {
 this.name = name;
 this.age = age;
 this.job = job;
 this.sayName = function() { alert(this.name) } 
}
var person1 = new Person('Zaxlct', 28, 'Software Engineer');
var person2 = new Person('Mick', 23, 'Doctor');

```

上面的例子中 person1 和 person2 都是 Person 的**实例**。
这**两个实例都有一个 constructor** （构造函数）属性，该属性（是一个指针）指向 Person。 即：

```javascript

console.log(person1.constructor == Person); //true
console.log(person2.constructor == Person); //true

```

我们要记住两个概念（构造函数，实例）：

- person1 和 person2都是 **构造函数 Person**  的实例。
- 一个公式：实例的构造函数属性（constructor）指向构造函数。

逆向理解，如果你用函数A去创造了A的实例a，那么A就化身成为‘构造函数’，实例a有个constructor属性（这个属性称之为构造函数属性）指向A

### 2.2 实例对象是普通对象还是函数对象？

## 3.原型对象：函数对象指定原型对象

### 3.1 原型对象

前面讲了普通对象、函数对象，下面是原型对象
**原型对象，本质它就是一个 普通对象，从现在开始你要牢牢记住原型对象就是 A.prototype 。**

```javascript
//demo
function Person() {}
    Person.prototype.name = 'Zaxlct';
    Person.prototype.age  = 28;
    Person.prototype.job  = 'Software Engineer';
    Person.prototype.sayName = function() {
    alert(this.name);
}
  
var person1 = new Person();
person1.sayName(); // 'Zaxlct'

var person2 = new Person();
person2.sayName(); // 'Zaxlct'

console.log(person1.sayName == person2.sayName); //true

```

那什么是原型对象呢？

我们把上面的例子改一改你就会明白了：

```javascript
Person.prototype = {
   name:  'Zaxlct',
   age: 28,
   job: 'Software Engineer',
   sayName: function() {
     alert(this.name);
   }
}
```
上述代码非常简单，Person原型对象定义了公共的say方法。


### 3.2 原型对象 vs prototype属性

在 JavaScript 中，每当定义一个对象（函数也是对象）时候，对象中都会包含一些预定义的属性 。
**其中每个对象都有_propto_属性，但是只有函数对象才有prototype 属性，这个属性指向函数的原型对象。**
1. 只有函数对象才有prototype属性
2. 只有函数对象才有原型对象
3. 或者说有prototype属性就有原型对象

> 规则1:每个对象都有 __proto__ 属性，但只有函数对象才有 prototype 属性，该属性指向原型对象，换句话说是有原型对象


### 3.3 原型对象 vs constructor属性

**在默认情况下，所有的原型对象都会自动获得一个 constructor（构造函数）属性，这个属性（是一个指针）指向 prototype 属性所在的函数（Person）**

> 规则2：上面这句话有点拗口，我们「翻译」一下：有一个默认的 constructor 属性，这个属性是一个指针，指向 Person。即：

> Person.prototype.constructor == Person



### 3.4 原型对象是实例对象
这是由3.3 、3.4推论而来
在上面第二小节《构造函数》里，我们知道实例的构造函数属性（constructor）指向构造函数 ：

```javascript
person1.constructor == Person

```

这两个「公式」好像有点联系：

```javascript
person1.constructor == Person
Person.prototype.constructor == Person

```
person1 为什么有 constructor 属性？那是因为 person1 是 Person 的实例。
那 Person.prototype 为什么有 constructor 属性？？同理， Person.prototype （你把它想象成 A） 也是Person 的实例。
**也就是在 Person 创建的时候，创建了一个它的实例对象并赋值给它的 prototype，基本过程如下：**

**超级关键：**
```javascript
function Person(){};
//隐形执行：
Person.prototype.constructor= Person;
```
可以理解为过程自然而然形成

> 结论：原型对象（Person.prototype）是 构造函数（Person）的一个实例。
> 再次重复一遍。原型对象还有一个必不可少的contructor属性。

### 3.5 原型对象是普通对象还是函数对象？

注意这一点无法100%类推，因为有个 new Fuction()

#### 3.5.1 new Function()

上面1.3就提到了，凡是通过 new Function() 创建的对象都是函数对象，其他的都是普通对象。Function Object 也都是通过 New Function()创建的。
那么 Function创建的实例对象也是函数对象，
Function的原型对象是Function的实例对象，**因此这里的原型对象是函数对象，特别的是没有prototype属性**

#### 3.5.2 其他

我们知道什么对象是有constructor，那就是实例对象，所以原型对象Person.prototype是函数对象(Person)的一个实例。
在函数对象创建的时候被创建的，因此也是一个普通对象，但是Function函数有点意外

但 Function.prototype 除外，它不是普通对象它是函数对象。但它很特殊，他没有prototype属性（前面说道函数对象都有prototype属性，因此都有原型对象）

可以按照4.2的图对一下

### 3.5 用途
**原型对象的用途是为每个实例对象存储共享的方法和属性，它仅仅是一个普通对象而已。**
**并且所有的实例是共享同一个原型对象，因此有别于实例方法或属性，原型对象仅有一份。**（原型继承从此而来）所有就会有如下等式成立：

```javascript
person.say == new Person().say
```
## 4 总结

### 4.1 总结1

1.对象就分为普通对象，函数对象。原型对象属于普通对象（有特例）

2.new一下就出现了构造函数跟实例，实例是普通对象（有特例6）

3.实例都有一个contrutor属性，指向构造函数（有特例6）

4.函数对象都有prototype属性，prototype属性指向原型对象（因此函数对象都有原型对象），原型对象是普通对象，原型对象中都有constructor属性，指向函数对象

5.由3，4可得到因为都有constructor属性，因此原型对象也是实例

6.但 Function.prototype 除外，它是函数对象，但它很特殊，他没有prototype属性（前面说道函数对象都有prototype属性）Function.prototype = new Function()//请看第一对象部分


### 4.2 总结图

![流程图](https://raw.githubusercontent.com/XYooo/image/master/yuanxing1.jpg)

## 5 参考

[最详尽的 JS 原型与原型链终极详解，没有「可能是」。（一）](https://www.jianshu.com/p/dee9f8b14771)

[一个例子让你彻底明白原型对象和原型链](https://www.jianshu.com/p/aa1ebfdad661)