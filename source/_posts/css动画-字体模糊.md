---
title: css动画-字体模糊
date: 2019-05-17 10:25:55
tags: css
---

## 1.摘要

当使用bee-modal弹框组件的时候，发现modal上面的内容发生迷糊现象甚至直线变曲线。


## 2.原因

后来看了bee-modal的样式，发现bee-modal使用了动画translate和transform属性，目的是为了让modal弹框居中展示。

### 2.1 原因

发现 transform: translate(-50%,-50%); 当使用translate进行位移的时候，如果选择的值是不接近整数的小数（测试时，整数和接近整数的小数比如：1.89、1.9+的数不会出现模糊的情况），位移的元素字体和背景等都会出现模糊的情况,这行居中css代码会导致字体模糊，直接去掉居中效果没了。

具体为什么会导致模糊，这是因为，transform变换会在浏览器上单独创建一个绘画层并重新进行渲染，rotate、transfor等渲染的时候，由于图层渲染的时候也处理了周围的文字，如果width和height的数值为奇数的文字可能会存在半个像素的计算量，浏览器对这半个像素会进行优化渲染，所以边缘会出现模糊的情况。


可以通过chrome的compute来查看具体的数值。

- 使用 transform 后出现效果模糊的情况，先查看 width height 属性是否为偶数,将元素的高度设置为偶数可解决； 
- 将transform: translate(-50%, -50%)改成transform: translate3d(-50%, -50%, 0)可以解决抖动，但仍然模糊。 
- 将元素的高度设置为偶数可解决； 
- 将transform: translate(-50%, -50%)中的y轴单位改成px也可以解决 
- 改成transform: translate(-50%, -52%)也可以解决（如果52%不行则从51%每个百分比尝试） 

