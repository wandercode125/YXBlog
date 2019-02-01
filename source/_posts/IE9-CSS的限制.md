---
title: IE9-CSS的限制
date: 2018-12-25 15:21:22
tags: IE
---

## 在ie下css渲染不正确
在《ie9记事（1）》中1.2提到ie9下css的长度限制，下面有具体的示例展示。
具体参考microsoft网站上所写的[A webpage that uses CSS styles does not render correctly in Internet Explorer](https://support.microsoft.com/zh-cn/help/262161/a-webpage-that-uses-css-styles-does-not-render-correctly-in-internet-e)

1.1-1.4是microsoft网站上的英文翻译，1.5是针对3条规则的示例展示

---


### 1.1 症状Symptoms

在“Applies to”部分中（style、computed）列出的Microsoft Internet Explorer加载网页时，网页上的样式丢失或看起来不正确。

注意，不管页面是使用内联样式或级联样式表，都会出现出现这样的问题。

您也可能收到以下错误信息：
> The page you are looking for might have been moved or had its name changed.


### 1.2 起因cause

此问题发生在Internet Explorer中，当是下面的情况的时候：

1. All style tags after the first 31 style tags are not applied.前31个样式标签之后的所有样式标签都不被应。

2. All style rules after the first 4,095 rules are not applied.前4095(不包含4095)个规则之后的所有样式规则不起效。

3. 在使用@import规则连续导入导入其他样式表的外部样式表的页面上，忽略超过三个级别深的样式表。On pages that uses the @import rule to continously import external style sheets that import other style sheets, style sheets that are more than three levels deep are ignored.


### 1.3 更多信息More Information

当Internet Explorer中加载的页面本身出现问题，网络监视工具可以指示出tcp请求重置了。然后，如果原始请求是POST请求，Internet Explorer会生成另一个POST请求。或者，Internet Explorer可以发送GET请求。

这种style tag limitation也可能会影响使用.xSL文件。当.xsl文件在文档中嵌入了样式标记时，您试图查看.xml文件时，将收到以下错误消息：

```
Internet Explorer could not open the Internet Site:
file://c:\aaa.xml

```
When you click
OK, you receive the following error message:

```
The page cannot be displayed
```

该代码示例，设置在“步骤来重现问题”部分可以动态创建样式表，并且生成以下错误消息：

```
A Runtime Error has occurred.
Do you wish to Debug?

Line: 8
Error: Invalid argument.
```


If the style sheets are not applied dynamically but are, instead, applied through <Style> tags or through .css files, the "Invalid argument" error message is not generated. In this case, all style sheets after the thirty-first style sheet are ignored.
Steps to reproduce the problem
如果不动态应用样式表，而是通过<Style>标记或通过.css文件应用，则不会生成“Invalid argument”错误消息。在这种情况下，忽略第三十一样式表之后的所有样式表。

### 1.4 重现问题的步骤Steps to reproduce the problem

Paste the following code sample in an HTML page. Run the code sample. An error is generated after the thirty-first style tag is applied.


```
<html>
    <head>
        <script>
        function fnCreateStyleSheets()
        {
          for (i=1 ; i <= 32; i++)
          {
            document.createStyleSheet()
            StyleSheetCount.innerText = "Total Style Sheets = " + i
          }
        }
        </script>
    </head>
    <body onLoad="fnCreateStyleSheets()">
        <div id="StyleSheetCount"></div>
    </body>
</html>
```
### 1.5 示例

#### 1.5.1 All style tags after the first 31 style tags are not applied.前31个样式标签之后的所有样式标签都不被应。



```
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>

    </title>
    <style type="text/css">
        div {
            color: Red;
        }
    </style>
    <link href="./31selectors.aspx_files/Stylesheet01.css" type="text/css" rel="stylesheet">
    <link href="./31selectors.aspx_files/Stylesheet02.css" type="text/css" rel="stylesheet">
    <link href="./31selectors.aspx_files/Stylesheet03.css" type="text/css" rel="stylesheet">
    <link href="./31selectors.aspx_files/Stylesheet04.css" type="text/css" rel="stylesheet">
    <link href="./31selectors.aspx_files/Stylesheet05.css" type="text/css" rel="stylesheet">
    <link href="./31selectors.aspx_files/Stylesheet06.css" type="text/css" rel="stylesheet">
   ...
   <link href="./31selectors.aspx_files/Stylesheet32.css" type="text/css" rel="stylesheet">
    <link href="./31selectors.aspx_files/Stylesheet33.css" type="text/css" rel="stylesheet">
    <link href="./31selectors.aspx_files/Stylesheet34.css" type="text/css" rel="stylesheet">
</head>

<body>
    <span>If stylesheet is loaded, it should be colored green. IE loads only 30 because we have a style tag.</span>
    <div>
        <div class="class1">Test Stylesheet 01</div>
        <div class="class2">Test Stylesheet 02</div>
        <div class="class3">Test Stylesheet 03</div>
        <div class="class4">Test Stylesheet 04</div>
        <div class="class5">Test Stylesheet 05</div>
        ...
        <div class="class29">Test Stylesheet 29</div>
        <div class="class30">Test Stylesheet 30</div>
        <div class="class31">Test Stylesheet 31</div>
        <div class="class32">Test Stylesheet 32</div>
        <div class="class33">Test Stylesheet 33</div>
        <div class="class34">Test Stylesheet 34</div>
    </div>
</body>
</html>

```
// css

```
// Stylesheet01.css
.class1 
{
	color: green;
}

// Stylesheet02.css
.class2 
{
	color: green;
}
...

// Stylesheet30.css
.class30
{
	color: green;
}
// Stylesheet31.css
.class31 
{
	color: green;
}
...
```

> Test Stylesheet 30 还是link中的样式，字体颜色是绿色，

>但是Test Stylesheet 31的样式才不是link 31.css中样式了，是红色的。说明Stylesheet31.css没起效


#### 1.5.2 All style rules after the first 4,095 rules are not applied.前4095(不包含4095)个规则之后的所有样式规则不起效。



```
<html>
    <title></title>
    <link type="text/css" rel="Stylesheet" href="./4095issues_files/4095issues.css">
</head>
<body>
    All rows should be with red background if the corresponding selector has any effect. <br>
    In IE only 4094 rows are with red background because we have two selectors in rule 4094 (one dummy).
    <div class="redClass0001">Test 0001</div>
    <div class="redClass0002">Test 0002</div>
    <div class="redClass0003">Test 0003</div>
    <div class="redClass0004">Test 0004</div>
    <div class="redClass0005">Test 0005</div>
    <div class="redClass0006">Test 0006</div>
    ...
    <div class="redClass4092">Test 4092</div>
    <div class="redClass4093">Test 4093</div>
    <div class="redClass4094">Test 4094</div>
    <div class="redClass4095">Test 4095</div>
    <div class="redClass4096">Test 4096</div>
    <div class="redClass4097">Test 4097</div>
    <div class="redClass4098">Test 4098</div>
    <div class="redClass4099">Test 4099</div>
    <div class="redClass4100">Test 4100</div>
    <div class="redClass4011">Test 4011</div>
</body>
</html>

```
// css

```
.redClass0001 { background: red }
.redClass0002 { background: red }
.redClass0003 { background: red }
.redClass0004 { background: red }
.redClass0005 { background: red }
.redClass0006 { background: red }
.redClass0007 { background: red }
.redClass0008 { background: red }
...
.redClass4093 { background: red }
.redClass4094,
.pinkClass4099 { background: red } /* The limit is obviously 4095 selectors which is much easier to hit than 4095 rules. */
.redClass4095 { background: red }
.redClass4096 { background: red }
.redClass4097 { background: red }
.redClass4098 { background: red }
.redClass4099 { background: red }
.redClass4100 { background: red }
```
> 4094行是红色背景，但是4099行并不是，说明看着选择器个数起效果



### 1.6 参考文献References

For more information, visit the following Microsoft Developer Network (MSDN) websites:

["STYLE element | style Object"](http://msdn.microsoft.com/en-us/library/ms535898(VS.85).aspx)

["addRule Method"](http://msdn.microsoft.com/en-us/library/aa358796(VS.85).aspx)

["@import Rule"](http://msdn.microsoft.com/en-us/library/ms530768(VS.85).aspx)
