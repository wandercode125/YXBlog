---
title: JS作用域系列—原型
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

1. **每个对象都有[[prototype]]属性,表示The prototype of this object，js的获取方式：`._propto_`**
   1. 参看5.1edition的Ecmascript[8.6.2Object Internal Properties and Methods](https://262.ecma-international.org/5.1/#sec-8.6.2)Table 8 — Internal Properties Common to All Objects
2. **但是只有函数对象才有prototype属性，这个属性指向一个对象。**
   1. 参看5.1edition的Ecmascript[13.2Creating Function Objects](https://262.ecma-international.org/5.1/#sec-13.2)的步骤1
   2. Create a new native ECMAScript object and let F be that object.
   3. 步骤16：Let proto be the result of creating a new object as would be constructed by the expression new Object()where Object is the standard built-in constructor with that name.这里创建了一个对象，称为proto
   4. 步骤18：Call the [[DefineOwnProperty]] internal method of F with arguments "prototype", Property Descriptor {[[Value]]: proto, { [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: false}, and false. **F创建个属性prototype，值指向proto**

总结：
1. 每个对象都有 __proto__ 属性，
2. 但只有函数对象才有 prototype 属性，该属性指向原型对象，换句话说是有原型对象


### 3.3 原型对象 vs constructor属性

constructor属性
1. 参看5.1edition的Ecmascript[13.2Creating Function Objects](https://262.ecma-international.org/5.1/#sec-13.2)的步骤1
2. Create a new native ECMAScript object and let F be that object.
3.  步骤16：Let proto be the result of creating a new object as would be constructed by the expression new Object()where Object is the standard built-in constructor with that name.这里创建了一个对象，称为proto
4. 步骤17：Call the [[DefineOwnProperty]] internal method of proto with arguments "constructor", Property Descriptor {[[Value]]: F, { [[Writable]]: true, [[Enumerable]]: false, [[Configurable]]: true}, and false. **proto创建个属性constructor，指向F**



总结：
Person.prototype.constructor == Person
> 1. F.prototype指向一个对象，这个对象上面有个属性constructor
> 2. A prototype property is automatically created for every function, to allow for the possibility that the function will be used as a constructor.


### 3.4 原型对象是实例对象
不是
### 3.5 原型对象是普通对象还是函数对象？

原型对象只是个对象，在创建函数的自动就被创建了。**关键自动自动自动，不是你来控制的**

#### 3.5.1 new Function()
就是创建个函数
[19.2.1.1 Function ( p1, p2, … , pn, body )](https://262.ecma-international.org/11.0/#sec-function-constructor)

### 3.5 用途
1. 原型对象的用途是为每个实例对象**存储共享的方法和属性**，它仅仅是一个普通对象而已。
2. 并且所有的实例是**共享同一个原型对象，因此有别于实例方法或属性，原型对象仅有一份。**
## 4 总结

### 4.1 总结1

1. 函数对象都有prototype属性，prototype属性指向原型对象（因此函数对象都有原型对象），原型对象是普通对象，原型对象中都有constructor属性，指向函数对象
2. Function.prototype，它是函数对象，但它很特殊
   1. Function.prototype.prototype 
      1. 是undefined
      2. 理解为：Function.prototype是`原型对象的终点`
   2. Function.prototype.__proto__ 
      1. 是Object
      2. 理解为：Function.prototype是个对象，也是由Object创建的，最终指向Object
   3. Function.prototype.__proto__.prototype 
      1. 是undefined
      2. 理解为：Function.prototype.__proto__是对象非函数，没有.prototype属性
      3. Function.prototype.__proto__ === Object.prototype//true
   4. Function.prototype.__proto__.__proto__ 
      1. 是null
      2. 理解为：Object.prototype是`原型属性的终点`
      3. Function.prototype.__proto__ === Object.prototype ;//true


### 4.2 总结图

![流程图](https://raw.githubusercontent.com/XYooo/image/master/yuanxing1.jpg)

## 5 参考

[最详尽的 JS 原型与原型链终极详解，没有「可能是」。（一）](https://www.jianshu.com/p/dee9f8b14771)

[一个例子让你彻底明白原型对象和原型链](https://www.jianshu.com/p/aa1ebfdad661)