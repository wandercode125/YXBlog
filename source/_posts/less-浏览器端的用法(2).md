---
title: less-浏览器端的用法(2)
date: 2021-04-14 00:37:13
tags: less
---
11
<!--more-->

前面讲了在线修改样式调用的方法是less在浏览器端使用可以配置的一些参数。下面将整个项目中需要的工作
  1. 在html引入对应项目组件样式的less文件，本项目是color.less文件
  2. 在html引入less.js的cdn资源
  3. 

## 1 项目中使用
`...cdnPath`是公司cdn路径，隐私去掉。在线主题定制功能使用这个了，实现代码如下:

### 1.1 html
```html
<!-- start: 关键的代码在这里 -->
 <link id='color-less' rel="stylesheet/less" type="text/css"  href="...cdnPath/color.less">
 <script>
      window.less = {
        async: false,
        env: 'production'
      };
    </script>
  <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/less.js/2.7.2/less.min.js"></script>
 <!-- end: 关键的代码在这里 -->

```
注意
- link的 rel="stylesheet/less"中rel内容特殊
- 两个`script`标签，都要有。


### 1.2 js

动态修改css样式

```javascript
window.less.modifyVars({
    "@primary-color":"#e1bee7",
    "@border-radius":"10px",
    "@border-color":"#c62828",
  }).then(() => { console.log('change success') })
  .catch(error => {
    console.log(`Failed to update theme`, error);
});
```

### 1.3 项目数据结构

编辑面板

type：字段编辑方式，仅支持color（取色器），number（数字输入框），string（输入框）
label：标签名，编辑器右侧展示label
key：要修改的less变量（关键，对应.less文件的变量名）
style：简单描述，暂无实际含义
level：暂无实际含义


##  2 color.less

下面展示一下实际项目中现在使用的less的是什么样子的

```less

@primary-color: #F53C32;
@primary-color-dark: #E60012;
@primary-color-light: #E60012;
@secondary-color: #E0E0E0;
@secondary-color-dark: #BDBDBD;
@secondary-color-light: #BDBDBD;
@text-color-base: #FFFFF1;
@border-radius: 3px;
@border-color: #A5ADBA;
@button-secondary-text-color: #212121;
@item-hover-bg-color-base: #EBECF0;
@item-selected-bg-color-base: #F7F7F7;
@table-header-background-color: #f7f7f7;
@table-header-text-color: #666666;
@table-border-color-base: #e9e9e9;
@table-row-hover-bg-color: #ebecf0;
//vars.less
@palette-grey-100: 	#F5F5F5;
@palette-grey-200: 	#EEEEEE;
@palette-grey-300: #E0E0E0;
@palette-grey-400: #BDBDBD ;
@palette-grey-900: #212121;
@palette-cyan-500: #00BCD4;

// 默认色
@default-color: @palette-grey-300;
@default-color-dark:  @palette-grey-400;
@default-color-light: @palette-grey-200;

// 字体
@font-family-primary: "Open Sans", "Helvetica Neue", Arial, "Hiragino Sans GB", "Microsoft YaHei", sans-serif  ;
// 主字号
@font-size-base: 14px  ;
// 主文本色
  

// 品牌色
@brand-default:  @gray-lighter;
@brand-default-hover:  @gray-lightest;
@brand-default-active:   @gray-light;
@brand-primary :  @primary-color ;
@brand-primary-hover:  @primary-color-light ;
@brand-primary-active:  @primary-color-dark ;
@brand-secondary :  @secondary-color ;
@brand-secondary-hover:  @secondary-color-light ;
@brand-secondary-active:  @secondary-color-dark ;

//disable颜色
@disabled-color-base:  @gray-light;
@disabled-border-color:  @gray-lighter;
@disabled-bg-color:  @gray-lightest;
@border-color-base:   @border-color  ;

// UButton

// Button 基础背景色.
// 默认按钮(<Button></Button>)
@button-default-color:  @default-color;
@button-default-color-IE8:  @default-color;

// Button 不同状态下的背景色 ：hover、active、focus状态.
@button-hover-color:  @default-color-light ;
// ...省略
// UText

@form-control-border-radius:  @border-radius-base;
//...省略
//progresbar
@progress-primary-bg:   @brand-primary;

//timeline
@timeline-info-color:  @color-info;

// bee-tree
@tree-checkbox-color:  @primary-color ;
@tree-node-bg-color:  @hover-bg-color-base ;

//dropdown

@dropdown-item-hover-bg-color:   @palette-grey-100 ;
@dropdown-item-divier-bg-color:  @gray-lighter;
@dropdown-border-color:  @border-color-base;
@dropdown-border-radius:3px;

//select
@select-bg-color: #fff;
@select-border-color:  @border-color-base;
@select-border-radius:  @border-radius-base;

//switch
//color
@switch-border-color:  @gray-lighter;
@switch-back-color:  @gray-lighter;
@switch-checked-borColor:  @brand-primary;
@switch-checked-backColor:  @brand-primary;

// border-radius of different state switch
@switch-border-radius: 20px;
@switch-border-radius-after: 18px;

@switch-primary-bg:  @brand-primary;

//rate
@rate-star-default-color: @gray-lightest;
 @rate-star-active-color: @brand-primary;

//Checkbox

@checkbox-color: @primary-color ;

@checkbox-primary-bg:   @brand-primary;
@checkbox-info-bg:   @brand-info;

//progressbar
@progress-primary-bg:   @brand-primary;

// Radio

@radio-color:  @primary-color ;
@radio-primary-bg: @brand-primary;
@radio-border-color: #d9d9d9;
@radio-bg-color: #fff;
@radio-color: rgba(0, 0, 0, 0.65);

//select

@select-dropdown-selected-bg:  @selected-bg-color-base;

//下面是对单个组件样式
//bage
.customed .u-badge-primary.u-badge .badge-single,
.customed .u-badge-primary.u-badge .data-icon {
  background: @primary-color;
}
.customed .u-breadcrumb a {
  color: @primary-color;
}
.customed .u-breadcrumb li {
  color: @primary-color;
}
...省略
//button
.customed .u-button {
  background: @secondary-color;
  border: 1px solid @secondary-color;
  border-radius: @border-radius;
  color: @button-secondary-text-color;
}
.customed .u-button:hover {
  background-color: #EEEEEE;
  border-color: #EEEEEE;
}

```

color.less的难点在于需要将整个组件库（50多个组件）的样式放到这里，而且组件库使用的scss的语法，所以需要这部分的工程量较大。g

