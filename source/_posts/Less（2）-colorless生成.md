---
title: Less（2）-colorless生成
date: 2019-12-24 20:36:09
tags: less
---

前面讲了在线修改样式调用的方法是window.less.modifyVars，这边讲一下color.less的生成。
下面的代码来源于我的项目组

## 1 color.less

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

@color-black: #000001;
@color-white: #FFFFF1;

//colors.scss
@styleguide-generate-template: false ;

// The two possible colors for overlayed text.
@color-dark-contrast: @color-white ;
@color-light-contrast: @color-black ;

// 主题色




// 默认色
@default-color: @palette-grey-300;
@default-color-dark:  @palette-grey-400;
@default-color-light: @palette-grey-200;

// 字体
@font-family-primary: "Open Sans", "Helvetica Neue", Arial, "Hiragino Sans GB", "Microsoft YaHei", sans-serif  ;
// 主字号
@font-size-base: 14px  ;
// 主文本色
  

// 圆角，包括：button、select等

// 边框色，包括按钮、输入框、分页

// 条目hover背景色，包括：select、dropdown、table、datepicker、tree、menu、calendar

// 条目selected背景色，包括：select、menu等

// Button 细化样式变量:
// 次按钮背景色

// 次按钮文本色


// Table 细化样式变量：
// 表头背景色

// 表头文字颜色

// 表格分割线颜色

// 表格行hover背景色

@unit: 10px ;

@gray-light:    @palette-grey-400 ;
@gray-lighter:   @palette-grey-300 ;
@gray-lightest: @palette-grey-200 ;

// 边框圆角
@border-radius-base:         @border-radius;

//-- Indexes
@zindex-menubar:          1400;

// hover时的背景色，包括select、dropdown、table、datepicker、tree、menu等组件
@hover-bg-color-base:  @item-hover-bg-color-base ;
// // selected背景色，包括：select、menu等
@selected-bg-color-base:  @item-selected-bg-color-base ;

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

@brand-info:  @palette-cyan-500 ;

@brand-light :  @color-dark-contrast ;

//不同背景下对应的文字颜色
@color-info:  @palette-cyan-500 ;

//全局不同状态颜色

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
@button-active-color: @default-color-dark ;
@button-focus-color:  @default-color-light;

// Button 配置不同colors属性时的背景色.
@button-primary-color:   @brand-primary;
@button-primary-active-color:   @brand-primary-active;
@button-primary-hover-color:   @brand-primary-hover;
@button-secondary-color:   @brand-secondary;
@button-secondary-active-color:   @brand-secondary-active;
@button-secondary-hover-color:   @brand-secondary-hover;
// Button 文字颜色.
// 主按钮(colors:'primary')
@button-primary-text-color:  @text-color-base;
@button-text-color:  @button-primary-text-color;
// 次按钮(colors:'secondary')
@button-second-text-color:  @button-secondary-text-color;
// 默认按钮(<Button></Button>)
@button-default-text-color: @palette-grey-900;

// Button 边框样式及颜色.
@button-border-style:  solid;
@button-border-color:  @border-color-base;
@button-default-border-color:  @button-default-color ;

// Button 不同状态下的边框颜色 ：hover、active、focus状态.
@button-hover-border-color:  @brand-default-hover;
@button-active-border-color:  @brand-default-active;
@button-focus-border-color:  @brand-default-active;

// Button 最小宽度、高度、内边距、外边距、行高、边框粗细、圆角.
@button-border-width: 1/10 *  @unit ;

// UText

@form-control-border-radius:  @border-radius-base;
@form-control-color: #424242;
@form-control-bg-color: #fff;
@form-control-border-color:  @border-color-base;

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

@radio-primary-bg:             @brand-primary;

@radio-border-color: #d9d9d9;
@radio-bg-color: #fff;
@radio-color: rgba(0, 0, 0, 0.65);

@radio-checked-bg-color: #fff;
@radio-checked-color:  @brand-primary;
@radio-checked-border-color:  @brand-primary;

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


color.less的难点在于需要将整个组件库（50多个组件）的样式放到这里，而且组件库使用的scss的语法，所以需要这部分的工程量较大。后续可能会上传如何从scss生成less

