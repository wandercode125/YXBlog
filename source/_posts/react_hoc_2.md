---
title: "高阶组件入门（2)"
date: 2018-10-1 12:00:00
tags: 
	- "react"
	- "react-hoc"
categories: 工作

---

（一）前篇回顾
-------

上篇文章[React高阶组件操作入门（一）](https://github.com/iuap-design/blog/issues/241)介绍了高阶组件的实现方式之一：PP（属性代理）。

其实在第一篇提到，高阶组件的使用就是涉及到两个问题：

1.高阶组件EnhanceComponent能否将props,state,function传递给wrappedComponent？
2.组件wrappedComponent能否将props,state,function传递给EnhancedComponent？

<!-- more -->
在第一篇文章就是解答了第一个问题，答案是能！！HOC将HOCd的props,state,function,当作props传给WrappedComponent组件，WrappedComponent通过this.props取到这些内容，如下图：

                          图1-1 EnhacedComponent组件传值

![这里写图片描述](http://img.blog.csdn.net/20171107205438033?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZGVyX3Bvb2w=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

                         图1-2 WrappedComponent组件接收
![这里写图片描述](http://img.blog.csdn.net/20171107205535216?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZGVyX3Bvb2w=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

（二）Inheritance Inversion（反向继承）
------------------------------

**反向继承可以解决上述的第二个疑问：**
组件wrappedComponent能否将props,state,function传递给EnhancedComponent？

这里是指EnhacedComponent继承了WrappedComponent组件的生命周期、state和function。按照上篇文章提到的两点用途出发来深入理解II。

 - 渲染劫持（Render Highjacking） 
 - 操作 state


 （2.1）渲染劫持


> 本质就是EnhacedComponent继承了WrappedComponent组件的生命周期函数，尤其是render()函数


```
//Wrappedcomponent
import React, { Component } from 'react';
class Usual extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usual: 'usual',
    }
  }

  componentDidMount() {
    console.log('didMount')
  }
 
  render() {
    console.log(this.props);

    return (
      <div>
        Usual
      </div>
    )
  }
}

export default Usual;

```


```
//下面是HOC
import React, { Component } from 'react';
const iiHoc = WrappedComponent => class extends WrappedComponent {
	  constructor(props){
	  	super(props);
	  	this.state = {
	  		...this.state,
	  	}
	  }
	
	  alertFunc = () =>{
	  	alert("HOC");
	  }

    render() {
      
      return <div>{super.render()}</div>
     
    }
}
export default iiHoc;
```
这样会正常的渲染出来 Usual

（2.2）操作 state


> 本质就是EnhacedComponent继承了WrappedComponent组件的state



             如图2-2-1通过this.state获取到WrappedComponent的state
![这里写图片描述](http://img.blog.csdn.net/20171107211149475?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZGVyX3Bvb2w=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



> 但是，关键是在EnhacedComponent的constructor中没有定义自己的state！！

若是定义就会出现的问题如下图2-2-2所示

     图2-2-2 EnhancedComponent的constructor中定义state,那么this.state的取值
![这里写图片描述](http://img.blog.csdn.net/20171107211424840?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZGVyX3Bvb2w=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

EnhacedComponent的state覆盖了Wrapped Component的state。这时候的怎么让两者并存呢？如下图2-2-3所示

          图2-2-3 EnhacedComponent的state与WrappedComponent的state并存
![这里写图片描述](http://img.blog.csdn.net/20171107211543953?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvd2FuZGVyX3Bvb2w=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

（2.3）function的继承
这里就不多说，通过this.functionName()就可以调用到WrappedComponent中的方法。**但是有一个注意的：若是EnhancedComponent中的方法与WrappedComponent的方法重名，那么EnhacedComponent函数覆盖Wrapped Component函数。**

（三）此处看一下父组件与高阶组件对比
------------------

有些同学可能会觉得高阶组件有些类似父组件的使用。例如，我们完全可以把高阶组件中的逻辑放到一个父组件中去执行，执行完成的结果再传递给子组件。从逻辑的执行流程上来看，高阶组件确实和父组件比较相像，但是高阶组件强调的是逻辑的抽象。高阶组件是一个函数，函数关注的是逻辑；父组件是一个组件，组件主要关注的是UI/DOM。如果逻辑是与DOM直接相关的，那么这部分逻辑适合放到父组件中实现；如果逻辑是与DOM不直接相关的，那么这部分逻辑适合使用高阶组件抽象，如数据校验、请求发送等。

（四）使用高阶组件遇到的问题
--------------
（4.1）静态方法丢失
无论PP还是II的方式，WrappedComponent的静态方法都不会复制，如果要用需要我们单独复制。因为高阶组件返回的新组件，是不包含被包装组件的静态方法。
具体的解决方案如下

> [静态方法解决方式](https://segmentfault.com/a/1190000010845410)

（4.2）refs不会传递。 
意思就是HOC里指定的ref，并不会传递到子组件，如果你要使用最好写回调函数通过props传下去。

（4.3）不要在render方法内部使用高阶组件。
简单来说react的差分算法会去比较 NowElement === OldElement, 来决定要不要替换这个elementTree。。因为高阶组件每次都会返回一个新的组件，在render中使用会导致每次渲染出来的组件都不相等（===），于是每次render，组件都会卸载（unmount），然后重新挂载（mount），既影响了效率，又丢失了组件及其子组件的状态。高阶组件最适合使用的地方是在组件定义的外部，这样就不会受到组件生命周期的影响了。

（4.4）最重要的原则就是，注意高阶组件不会修改子组件，也不拷贝子组件的行为。
高阶组件只是通过组合的方式将子组件包装在容器组件中，是一个无副作用的纯函数

（4.5）要给hoc添加class名，便于debugger。
当我们在chrome里应用React-Developer-Tools的时候，组件结构可以一目了然，所以DisplayName最好还是加上。

```
const getDisplayName = component => component.displayName || component.name
function hoc(WrappedComponent){
    return class HOC extends Component {
        static displayName = `HOC(${getDisplayName(WrappedComponent)})`
        constructor(props) {
        }
        
        componentWillMount() { 

        render() {
          return ()
        }
    }
}
export default hoc;
```

> [refs不会传递解决方法](https://segmentfault.com/a/1190000010845410)


（五）依然存留的疑问
----------

1.上述两个问题中的第二个问题：.组件wrappedComponent能否将props,state,function传递给EnhancedComponent？中没有解答是wrappedComponent能否将props传递给EnhancedComponent，这个没有找到资料，也许这是没有必要的操作。根据后续的深入开发以及学习中，也许会解答这个问题。
2.属性的校验
我们知道PropsTypes有着属性校验，那么EnhacedComponent与WrappedComponent之间的传值可以走属性校验吗？



