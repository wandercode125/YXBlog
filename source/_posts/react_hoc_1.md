---
title: "高阶组件入门（1)"
date: 2018-10-1 12:00:00
tags: 
	- "react"
	- "react-hoc"
---


高阶组件最大的特点就是重用组件逻辑。它并不是由React API定义出来的功能，而是由React的组合特性衍生出来的一种设计模式。
之前看过几篇文章介绍高阶组件，这篇文章就是动手操作一番，有时候还不得不吐槽，说好能获得到的属性跟方法为什么没有获取到？

<!-- more -->

一、高阶组件定义

> a higher-order component is a function that takes a component and returns a new component.
> 翻译：高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件。

还有一种写法就是：

> hocFactory:: W: React.Component => E: React.Component
> 其中 W (WrappedComponent) 是指被包裹的 React.Component，
> E (EnhancedComponent) 指返回类型为 React.Component 的新的 HOC。

二、常见的HOC 实现方式（两种）

> （1）Props Proxy（属性代理）： HOC 控制传给WrappedComponent W 的 props
> 
> 下面是用途：

 - 更改 props 
 - 抽象 state 
 - 通过 refs 获取组件实例 
 - 把 WrappedComponent 与其它 elements包装在一起

> （2）Inheritance Inversion（反向继承）： HOC 继承WrappedComponent W 的生命周期、state、各种function
> 
> 下面是用途：

 - 渲染劫持（Render Highjacking）
 -  操作 state


看到上面的这些官方介绍也许会有点懵，但是总言而之：高阶组件就是牵扯到两个组件的事情，那么就有下面的两个问题：
1.高阶组件EnhanceComponent能否将props,state,function传递给wrappedComponent？(看完本篇就会得到答案：能，必须能啊。全部当成props传给WrappedComponent了)
2.组件wrappedComponent能否将props,state,function传递给EnhancedComponent？

下面介绍开始...
三、Props Proxy （属性代理）— **操作props**
（3.1）更改props
主要是高阶组件HOC控制传入wrappedComponent的props，来修改wrappedComponent内的props。
如下图所示:

图3.1.1
HOC将{...this.props}，{...newProps}传递给WrappedComponent

![这里写图片描述](http://img.blog.csdn.net/20171102212149019?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZGVyX3Bvb2w=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

图3.1.2
WrappedComponent中的参数，这里不仅仅有从HOC传来的参数，还有WrappedComponent(即Base)中自带的参数。

![这里写图片描述](http://img.blog.csdn.net/20171102212305710?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZGVyX3Bvb2w=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

**注意，若是props中有重名的字段，那么HOC的props将会覆盖WrappedComponent中的props.**
**总言而之：你可以『读取，添加，修改，删除』将要传递给 WrappedComponent 的 props。**

（3.2）抽象 state 
这里不是通过ref获取state， 而是通过 { props, 回调函数 } 传递给wrappedComponent组件，通过回调函数获取state。这里用的比较多的就是react处理表单的时候。通常react在处理表单的时候，一般使用的是受控组件（[官方文档](https://reactjs.org/docs/forms.html#controlled-components)），即把input都做成受控的，改变value的时候，用onChange事件同步到state中。*当然这种操作通过Container组件也可以做到，具体的区别放到后面去比较（这点我也没有弄明白呢）*。看一下代码就知道怎么回事了：

```javascript
// 普通组件Login，这里充当WrappedComponent
import React, { Component } from 'react';
import formCreate from './form-create';

@formCreate  //这个用法是es7语法，下面有文章链接
export default class Login extends Component {
  render() {
    return (
      <div>
        <div>
          <label id="username">
            账户
          </label>
          <input name="username" {...this.props.getField('username')}/>
        </div>
        <div>
          <label id="password">
            密码
          </label>
          <input name="password" {...this.props.getField('password')}/>
        </div>
        <div onClick={this.props.handleSubmit}>提交</div>
        <div>other content</div>
      </div>
    )
  }
}

//HOC，高阶组件从这里开始
import React, { Component } from 'react';

const formCreate = WrappedComponent => class extends Component {

  constructor() {
    super();
    this.state = {
      fields: {},
    }
  }
  //是下面方法 getField()用到的
  onChange = key => e => {
    const { fields } = this.state;
    fields[key] = e.target.value;
    this.setState({
      fields,
    })
  }
  
  handleSubmit = () => {
    console.log(this.state.fields);
  }
  
  getField = fieldName => {
    return {
      onChange: this.onChange(fieldName),
    }
  }
  
  render() {
    const props = {
      ...this.props,
      handleSubmit: this.handleSubmit,
      getField: this.getField,
    }
    return (<WrappedComponent
      {...props}
    />);
  }
};
export default formCreate;
```
**关键：这里我们把state，onChange等方法都放到HOC里**，其实是遵从的react组件的一种规范，子组件简单，傻瓜，负责展示，逻辑与操作放到Container。比如说我们在HOC获取到用户名密码之后，再去做其他操作，就方便多了，而state，处理函数放到Form组件里，只会让Form更加笨重，承担了本不属于它的工作，这样我们可能其他地方也需要用到这个组件，但是处理方式稍微不同，就很麻烦了。

（3.3）通过 refs 获取组件实例
当我们包装WrappedComponent的时候，想获取到它的实例怎么办，可以通过引用(ref),在WrappedComponent组件挂载的时候，会执行ref的回调函数，在HOC中取到组件的实例。通过打印，可以看到它的props， state，都是可以取到的。

```javascript
import React, { Component } from 'react';

const refHoc = WrappedComponent => class extends Component {

  componentDidMount() {
    console.log(this.instanceComponent, 'instanceComponent');
  }

  render() {
    return (<WrappedComponent
      {...this.props}
      ref={instanceComponent => this.instanceComponent = instanceComponent}
    />);
  }
};

export default refHoc;
```
（3.4）把 WrappedComponent 与其它 elements包装在一起
这一点就是很简单且容易理解：出于操作样式、布局或其它目的，你可以将 WrappedComponent 与其它组件包装在一起。*一些基本的用法也可以使用正常的父组件来实现*。

> 此处看一下父组件能做和不能做的事情（与高阶组件对比）：
>1.操作 props
>2.抽象 state。但是有缺点，不能再父组件外获取到它的 state，除非明确地实现了钩子。
>3.与新的 React Element 包装。这似乎是唯一一点，使用父组件要比高阶组件强，但高阶组件也同样可以实现。
>4.Children 的操控。如果 children 不是单一 root，则需要多添加一层来包括所有 children，可能会使你的 markup 变得有点笨重。使用高阶组件可以保证单一 root。
>5.父组件可以在元素树立随意使用，它们不像高阶组件一样限制于一个组件。

通常来讲，能使用父组件达到的效果，尽量不要用高阶组件，因为高阶组件是一种更 hack 的方法，但同时也有更高的灵活性。
下一篇会继续介绍一下II

[高阶组件的es7语法@装饰器](https://github.com/iuap-design/blog/issues/128)
