---
title: chrome--调试技巧1
date: 2019-06-29 10:54:16
tags: 浏览器
---

## 1 前提

前端开发调试很重要。除了一下简单的调试，本篇博客会汇总一些从其他地方看来的chrome小知识点


### 1.1 $家族

没有看错，不需要引入jquery.js文件就可以使用$


#### 1.1.1 $_

返回上一个被执行过的值

如果之前的值没有保存在变量里，可以通过这个方法临时访问（为什么说临时，因为当你执行完下一个表达式后，$_已经更新了哈）

#### 1.1.2 $
`document.querySelector()`方法的别名。不过比较少为人知的应该是它的第二个参数。指定从哪个节点开始选择。有时候想减少范围时，尤其管用！

> P.S. 函数签名`$(selector, [startNode])`。

#### 1.1.3 $$
`document.querySelectorAll()`方法的别名，可参考同上。

> P.S. 函数签名`$$(selector, [startNode])`


###  1.2 monitor/unmonitor

用来观察函数调用的工具方法。在函数调用的时候，可以同步输出函数名以及参数。

```console

> function add(x) {return x+1}
< undefined
> monitor(add);
< undefined
> add(99);
  function add called with arguments : 99
< 100

> unmonitor(add);
< undefined
> add(99)
< 100


```

当不再需要观察该函数时，调用unmonitor取消即可。
> 但是匿名函数不会生效，因为获取不到名字.


###  1.3 monitorEvents/unmonitorEvents

可以观察对像的事件~

eg
```javascript
monitorEvents(window,'resize');
monitorEvents(window,'click');

//也可以同时观察对象的多个事件~
monitorEvents(window,['click','resize']);
unmonitorEvents(window,'resize');
unmonitorEvents(window,'click');


```

> P.S. 函数签名：`monitorEvents(object[, events])`

###  1.4 copy

快速拷贝一个对象为字符串表示方式到剪切板~

```console

> const cord = {x:1,y:2}
< undefined
> copy(cord);
< undefined


```


###  1.5 getEventListeners
获取注册到一个对象上的所有事件监听器~

```javascript

getEventListeners(dom);

```

## 2 断点调试

### 2.1.1 DOM breakpoint
在Elements面板，右键点击节点唤出菜单，添加对应的DOM断点，可以监测指定节点的子树修改(substree modifications)、属性修改(attribute modifications)、以及节点的移除(node removal)。

> 知道，不再解释

### 2.1.2 Source breakpoint

有时候无需在源码中添加debugger。直接在Source面板添加断点即可调试。见下图行号上的小蓝色箭头！

> 常用，不解释


### 2.1.3 Conditional breakpoint

条件断点。只有符合条件时，才会触发断点。见下图行号上的小橙色箭头！

> 常用，不解释

## 3 小技巧


### 3.1 查找命令

如果找不到对应的指令，可以在控制台使用快捷键Ctrl + Shift + P。MacOS的话就是Command + Shift + P（这个和编辑器是一样的道理）。快速搜索你想要的控制面板工具


## 4  文献

[谷歌官方文档](https://jsproxy.ga/-----https://developers.google.com/web/tools/chrome-devtools/console/utilities)