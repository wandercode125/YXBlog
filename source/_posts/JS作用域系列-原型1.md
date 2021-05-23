---
title: JS作用域系列—原型1
date: 2018-09-28 15:55:58
tags: javascript
categories: 总结
---


<!--more-->

作用域链是作用域的部分内容。下面讲原型和原型链。涉及几个概念，
1. **普通对象vs函数对象**；
2. **构造函数vs实例**，
3. **prototype属性vs原型对象**
这些概念经常在各种博客见到，我只想说，全是障眼法，一堆文字堆砌，造成各种理解困难。

## 1 对象
### 1.1 内置对象

Ecmascript中涉及到很多内置对象，其中有两个Object和Function。（注意大写）。可以参考[19 Fundamental Objects](https://262.ecma-international.org/11.0/#sec-fundamental-objects)

**JavaScript中，万物皆对象！**，理解如下：
1. 隐式转换，基础类型可以转换成对应的内置对象
2. null和undefined特殊，没有对应的内置对象

### 1.2 对象创建方式
两种形式定义:
1. 声明(文字)形式
2. 构造形式。

> 《你不知道javascript上-对象》真的讲的很好
### 1.3 typeof语法
[sec-typeof-operator](https://262.ecma-international.org/11.0/#sec-typeof-operator)
UnaryExpression:typeof UnaryExpression
1. Let val be the result of evaluating UnaryExpression.
2. If Type(val) is Reference, then
   1. If IsUnresolvableReference(val) is true, return "undefined".
3. Set val to ? GetValue(val).
4. Return a String according to Table 35.

Table 35: typeof Operator Results

|Type of val |	Result|
|--|--|
|Undefined	|"undefined"
|Null	|"object"
|Boolean|	"boolean"
|Number|	"number"
|String|	"string"
|Symbol|	"symbol"
|BigInt|	"bigint"
|Object (does not implement [[Call]])|	"object"
|Object (implements [[Call]])|	"function"

**个人不太喜欢将对象分成：XX对象这种，函数对象也是Object，只不过实现了一个属性，这个属性叫做[[Call]]。还有[[]]这种双方括号包裹的属性，大部分都是不能通过dot（.）引用到的，只是Ecma语法**
### 1.4 new Function
 [19.2.1.1 Function ( p1, p2, … , pn, body )](https://262.ecma-international.org/11.0/#sec-function-constructor)
## 2 构造函数：

构造函数就是函数，所有的函数都能当构造函数，只要你想。
### 2.1 new操作 vs 实例对象
new + 函数，产生一个对象。（不清楚的可以去看new 操作）。

```javascript
function Person(name, age, job) {
  this.name = name;
  this.age = age;
  this.job = job;
  this.sayName = function() { alert(this.name) } 
}
var person1 = new Person('Zaxlct', 28, 'Software Engineer');
```
**非得有人闲得，给函数改名为构造函数，给对象改名为实例对象，函数还是那个函数，对象还是那个对象**
### 2.2 实例对象是普通对象还是函数对象？
**多脑残会有这么多名字**

> 实例对象是普通对象还是函数对象，都是对象呀。

## 3.原型对象：函数对象指定原型对象
### 3.1 原型对象

**原型对象，本质它就是一个普通对象，从现在开始你要牢牢记住原型对象就是 A.prototype**

### 3.2 原型对象 vs `.prototype` vs `.__proto__`

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