---
title: react的context
date: 2019-06-11 20:02:27
tags: react
---

## 1.摘要

 前几天学习了rc-tree-select的组件源码，学习一些之前不知道的写法。其中一点就是：在父组件(index.js->selector.js)中定义了一系列的方法，然后在下面子组件中(singleSelector.js、multipleSelector.js、popup.js)中直接使用父组件的写的这些方法


其实不用context写法也可以实现这个功能，只要将这个方法作为props传进去就可以，但是多传几层（如子组件下还有子子组件...），处理起来很麻烦。

### 1.1 对比props和context

React可以轻松地通过组件来跟踪数据流。

1.使用props在组件之间传递数据，props传递数据简单清晰，很容易看到正在传递数据信息如图一所示。组件A与组件C之间通信,C想获得A中的data数据,则需要通过props先将数据传递到组件B,B再通过props将数据传递到C。


使用props传递数据可以清晰看到数据流向，但是跨级传递非常麻烦。随着应用结构越来越复杂，组件嵌套层次越来越深，有时甚至需要将数据从最外层传递到最里层，使用props则需要一层一层地逐层传递数据。不过这样也太麻烦了，

2.如果有一种方法实现数据穿越就方便多啦。context能够做到这一点，它使得props不用流经组件树的每一层，将数据跨级传递到你想要传递到的深层次组件，如图二所示.


![props和context](https://raw.githubusercontent.com/XYooo/image/master/xuexiliangsanshi_context1.png'')

## 2.context使用


### 2.1 具体使用方法

- childContextTypes: 用于说明所传递的数据类型。

- getChildContext: 该方法表示该组件使用context传递数据,该方法返回的对象就是context需要传递的数据。getChildContext指定的传递给子组件的属性需要先通过childContextTypes来执行，不然会报错

- contextTypes: 在子组件中用于说明context接收的数据类型。任何想访问context里面的属性的组件都必须显示的指定一个contextTypes的属性，如果没有指定该属性，那么组件通过this.context访问属性将会出错。

### 2.2 项目中代码
先看一下项目中是如何使用的 

#### 2.2.1 父组件中使用context

```javascript
import React from 'react';
import { selectorContextTypes } from './Base/BaseSelector';
import { popupContextTypes } from './Base/BasePopup';
import { multipleSelectorContextTypes } from './Selector/MultipleSelector';
class Select extends React.Component {
  static propTypes = {
  }
  static defaultProps = {
   
  };
  **//关键1：需要先指明，childContextTypes必须使用这个名字**
  static childContextTypes = {
    rcTreeSelect: PropTypes.shape({
      ...selectorContextTypes,
      ...multipleSelectorContextTypes,
      ...popupContextTypes,

      onSearchInputChange: PropTypes.func,
      onSearchInputKeyDown: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }
  **//关键2：使用getChildContext**
  getChildContext() {
    return {
      rcTreeSelect: {
        onSelectorFocus: this.onSelectorFocus,
        onSelectorBlur: this.onSelectorBlur,
        onSelectorKeyDown: this.onComponentKeyDown,
        onSelectorClear: this.onSelectorClear,
        onMultipleSelectorRemove: this.onMultipleSelectorRemove,

        onTreeNodeSelect: this.onTreeNodeSelect,
        onTreeNodeCheck: this.onTreeNodeCheck,
        onPopupKeyDown: this.onComponentKeyDown,

        onSearchInputChange: this.onSearchInputChange,
        onSearchInputKeyDown: this.onSearchInputKeyDown,
      },
    };
  }

  // ===================== Render =====================

  render() {
    return (
     //省略...
    );
  }
}

```


下面是上面用到的
 selectorContextTypes,
 multipleSelectorContextTypes,
 popupContextTypes,

 ```javascript
//base/baseSelector.js
export const selectorContextTypes = {
  onSelectorFocus: PropTypes.func.isRequired,
  onSelectorBlur: PropTypes.func.isRequired,
  onSelectorKeyDown: PropTypes.func.isRequired,
  onSelectorClear: PropTypes.func.isRequired,
};
//selector/multipleSelector/index.js
export const multipleSelectorContextTypes = {
  onMultipleSelectorRemove: PropTypes.func.isRequired,
};

//base/basePopup.js
export const popupContextTypes = {
  onPopupKeyDown: PropTypes.func.isRequired,
  onTreeNodeSelect: PropTypes.func.isRequired,
  onTreeNodeCheck: PropTypes.func.isRequired,
};

 ```

可见，全是一些方法，并且指定都是必须。

#### 2.2.2 子组件中使用context

那么如何使用呢？下面是baseSelector为例
```js

export default function (modeName) {
  class BaseSelector extends React.Component {
    static propTypes = {
      //省略...
    };
    **//关键1，在这里指明，contextTypes必须使用这个名字**
    static contextTypes = {
      rcTreeSelect: PropTypes.shape({
        ...selectorContextTypes,
      }),
    };

    static defaultProps = {
    }

    constructor() {
      super();

    }
    //如何使用
    onFocus = (...args) => {
      const { rcTreeSelect: { onSelectorFocus } } = this.context;
      onSelectorFocus();
      
    };

    onBlur = (...args) => {
      const { rcTreeSelect: { onSelectorBlur } } = this.context;
      onSelectorBlur();
    };
    
    render() {
      const {
        //省略...
      } = this.props;
      const { rcTreeSelect: { onSelectorKeyDown } } = this.context;

      return (
        <span
          //...省略
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={onSelectorKeyDown}
        >
          {/*省略...*/}
        </span>
      );
    }
  }

  return BaseSelector;
}

```

## 3.参考文献

1.[React 中使用context实现数据穿越](http://www.sohu.com/a/197697519_575744)

完结