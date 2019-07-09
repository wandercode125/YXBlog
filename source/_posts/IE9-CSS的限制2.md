---
title: IE9-CSS的限制2
date: 2018-12-25 16:21:22
tags: IE
---

[Stylesheet Limits in Internet Explorer
](https://blogs.msdn.microsoft.com/ieinternals/2011/05/14/stylesheet-limits-in-internet-explorer/)

## 1.1 前言


[ie css坑的翻译1](https://support.microsoft.com/zh-cn/help/262161/a-webpage-that-uses-css-styles-does-not-render-correctly-in-internet-e) outlines the maximum number of stylesheets and rules supported by Internet Explorer 6 to 9.

```
A sheet may contain up to 4095 rules
A sheet may @import up to 31 sheets
@import nesting supports up to 4 levels deep

```


Some folks have wondered about the math that underlies these numbers. The root of the limitations is that Internet Explorer uses a 32bit integer to identify, sort, and apply the cascading rules. The integer’s 32bits are split into five fields: four sheetIDs of 5 bits each, and one 12bit ruleID. The 5 bit sheetIDs results in the 31 @import limit, and the 12 bit ruleID results in the 4095 rules-per-sheet limitation. While these limits are entirely sufficient for most sites, there are some sites (particularly when using frameworks and controls) that can encounter the limits, requiring workarounds.

> 翻译

有些人对这些数字感到疑惑。limitations的根本在于，Internet Explorer使用32位整数来标识、排序和应用这些级联规则。

32位整数被分成五个部分：
1. 5bit用来表示SeigesID；
2. 12bit的RuleID；

5位SHITEDS导致31个@导入限制，12位RuleID导致每张表限制的4095条规则。虽然这些限制对于大多数站点来说已经完全足够了，但是有些站点（尤其是使用框架和控制时）可能遇到这些限制，需要解决办法。



### 1.2示例 There’s a simple test page for the limits here.


### 1.3 ie 升级

Update: IE10 Platform Preview #2 significantly raises the limits described above. In IE10 (any browser/document mode):

1. A sheet may contain up to 65534 rules
2. A document may use up to 4095 stylesheets
3. @import nesting is limited to 4095 levels (due to the 4095 stylesheet limit)