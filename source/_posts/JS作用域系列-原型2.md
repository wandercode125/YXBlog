---
title: JS作用域系列—原型2
date: 2018-09-28 15:55:59
tags: JS
categories: 总结
---



<!--more-->
## 0 摘要

前面原型1主要讲述了几个概念，分为函数对象和普通对象，从函数对象引申出来的实例对象和原型对象。函数对象和普通对象就是所有的对象分类，实例对象和原型对象的是函数对象还是普通对象？ 答案是：既可以是普通对象，但是也可能是函数对象。具体看前面，不再细讲

## 1 _proto_
前面主要讲了proptype属性和constructor属性，那么什么是_proto_

### 1.1 _proto_指向原型对象

JS 在创建对象（不论是普通对象还是函数对象）的时候，都有一个叫做__proto__ 的内置属性，**用于指向创建它的构造函数的原型对象**。

对象 person1 有一个__proto__属性，创建它的构造函数是 Person，构造函数的原型对象是 Person.prototype ，所以：

```javascript
person1.__proto__ == Person.prototype
```
请看下图

![流程图](https://raw.githubusercontent.com/XYooo/image/master/yuanxing2.jpg)

根据上面这个连接图，我们能得到：


```javascript
Person.prototype.constructor == Person;
person1.__proto__ == Person.prototype;
person1.constructor == Person;
```

不过，要明确的真正重要的一点就是，这个连接存在于实例（person1）与构造函数（Person）的原型对象（Person.prototype）之间，而不是存在于实例（person1）与构造函数（Person）之间。

> 注意：因为绝大部分浏览器都支持__proto__属性，所以它才被加入了 ES6 里（ES5 部分浏览器也支持，但还不是标准）


### 1.2 总结-总结2

1._proto_属性存在每个对象中
2._proto_属性指向---------->该构造函数的原型对象
3.prototype属性指向------->自身的原型对象
4.都可以有_proto_属性，但是prototype属性只有函数对象才有


## 2 原型链

上述的总结1，总结2，说了种种关系，这些关系构成了原型链

总结1如下：
1.对象就分为普通对象，函数对象。原型对象属于普通对象（有特例）
2.new一下就出现了构造函数跟实例，实例是普通对象（有特例6）
3.实例都有一个contrutor属性，指向构造函数（有特例6）
4.函数对象都有prototype属性，prototype属性指向原型对象（因此函数对象都有原型对象），原型对象是普通对象，原型对象中都有constructor属性，指向函数对象
5.由3，4可得到因为都有constructor属性，因此原型对象也是实例
6.但 Function.prototype 除外，它是函数对象，但它很特殊，他没有prototype属性（前面说道函数对象都有prototype属性）Function.prototype = new Function()//请看第一对象部分


![流程图](https://raw.githubusercontent.com/XYooo/image/master/yuanxing1.jpg)


- (Functions）函数对象一列都有_proto_属性(只要是对象就有)，还是有prototype属性（因为是函数对象）。
  - _proto_指向构造函数的原型对象
  - prototype指向自身的原型对象 
- （XX.prototype）原型对象那一列都有constructor属性，只有_proto_属性 
  - _proto_指向构造函数的原型对象
- 实例那一列那一列只有_proto_属性 
  - _proto_指向构造函数的原型对象
    

## 3 实践

```javascript
person1.__proto__ 是什么？
Person.__proto__ 是什么？
Person.prototype.__proto__ 是什么？
Object.__proto__ 是什么？
Object.prototype__proto__ 是什么？

```

答案：
第一题：
- 因为 person1.__proto__ === person1 的构造函数.prototype
- 因为 person1的构造函数 === Person
- 所以 person1.__proto__ === Person.prototype

第二题：
- 因为 Person.__proto__ === Person的构造函数.prototype
- 因为 Person的构造函数 === Function
- 所以 Person.__proto__ === Function.prototype

第三题：
- Person.prototype 是一个普通对象，我们无需关注它有哪些属性，只要记住它是一个普通对象。
- 因为一个普通对象的构造函数 === Object
- 所以 Person.prototype.__proto__ === Object.prototype

第四题，参照第二题，因为 Person 和 Object 一样都是构造函数

第五题：
- Object.prototype 对象也有proto属性，但它比较特殊，为 null 。
- 因为 null 处于原型链的顶端，这个只能记住。
Object.prototype.__proto__ === null

