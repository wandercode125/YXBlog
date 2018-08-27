---
title: redux
date: 2018-08-24 10:00:30
tags:
---



有一篇redux的吐槽写的甚好，翻译一下
---

<!-- more -->
## 1.前言
mirror
A simple and powerful React framework with minimal API and zero boilerplate. (Inspired by dva and jumpstate)
一款简洁、高效、易上手的 React 框架。（Inspired by dva and jumpstate）

> Painless React and Redux.
> 
> Why?

We love React and Redux.
我们热爱 React 和 Redux。
A typical React/Redux app looks like the following:
一个**典型的** React/Redux 应用看起来像下面这样：

 - An actions/ directory to manually create all action types (or action creators)
>  
>  一个 actions/ 目录用来手动创建所有的 action type（或者 action creator）

 - A reducers/ directory and tons of switch clause to capture all action types
>  一个 reducers/ 目录和超级多的 switch语句 来捕获所有的 action type
> 
 - Apply middlewares to handle async actions
>  必须要依赖 middleware 才能处理 异步 action；

 - Explicitly invoke dispatch method to dispatch all actions
>    显示调用 dispatch 方法来 dispatch 所有的 action；

 - Manually create history to router and/or sync with store
>  手动创建 history 对象关联路由组件，可能还需要与 store 同步；

>  - Invoke methods in history or dispatch actions to programmatically changing routes
调用 history 上的方法或者 dispatch action 来手动更新路由；
  
The problem?  [Too much boilerplates](https://github.com/reduxjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md) and a little bit tedious.

存在的问题？太多的  [样板文件](https://github.com/reduxjs/redux/blob/master/docs/recipes/ReducingBoilerplate.md)以及繁琐甚至重复的劳动。


In fact, most part of the above steps could be simplified. Like, create actions and reducers in a single method, or dispatch both sync and async actions by simply invoking a function without extra middleware, or define routes without caring about history, etc.
实际上，上述大部分操作都是可以简化的。比如，在单个 API 中创建所有的 action 和 reducer；比如，简单地调用一个函数来 dispatch 所有的同步和异步 action，且不需要额外引入 middleware；再比如，使用路由的时候只需要关心定义具体的路由，不用去关心 history 对象，等等。

That's exactly what Mirror does, encapsulates the tedious or repetitive work in very few APIs to offer a high level abstraction with efficiency and simplicity, and without breaking the pattern.
这正是 Mirror 的使命，用极少数的 API 封装所有繁琐甚至重复的工作，提供一种简洁高效的更高级抽象，同时保持原有的开发模式。
 2.超级重点，样板文件

> 2-1 Actions

> 2-2 Action Creators

> 2-3 Generating Action Creators

> 2-4 Async Action Creators

> 2-5 Reducers

> 2-6 Generating Reducers


 ### Reducing Boilerplate


----------


Redux is in part inspired by Flux, and the most common complaint about Flux is how it makes you write a lot of boilerplate. In this recipe, we will consider how Redux lets us choose how verbose we'd like our code to be, depending on personal style, team preferences, longer term maintainability, and so on.

Redux的部分是受Flux启发的，关于Flux最常见的抱怨就是它让你写出很多样板文件的。在下面的介绍中，我们将意识到Redux是如何让我们选择使用这种超级冗长的代码，当然这种选择也取决于个人风格、团队偏好、长期可维护性等等。

 2-1 Actions

----------


Actions are plain objects describing what happened in the app, and serve as the sole way to describe an intention to mutate the data. It's important that actions being objects you have to dispatch is not boilerplate, but one of the fundamental design choices of Redux.

Actions是一个描述app中发生了什么的普通对象（变量），也是唯一一种方式来描述数据意图变化。
要意识到是你必须dispatch的action，并不是无用的模板，而是redux基本设计规则

There are frameworks claiming to be similar to Flux, but without a concept of action objects. In terms of being predictable, this is a step backwards from Flux or Redux. If there are no serializable plain object actions, it is impossible to record and replay user sessions, or to implement hot reloading with time travel. If you'd rather modify data directly, you don't need Redux.

有些框架声称类似Flux，但是没有action概念。就可预测而言，这些框架相比Flux和react是一种倒退。如果没有action对象，是不可能记录和重演用户会话，也不可能实行热重载。如果你宁愿选择直接修改数据，则不需要使用Redux。

> Actions look like this: 

> { type: 'ADD_TODO', text: 'Use Redux' } 

> {type: 'REMOVE_TODO', id: 42 } 

> { type: 'LOAD_ARTICLE', response: { ...} }


It is a common convention that actions have a constant type that helps reducers (or Stores in Flux) identify them. We recommend that you use strings and not Symbols for action types, because strings are serializable, and by using Symbols you make recording and replaying harder than it needs to be.

约定习俗，actions有一个type（是个常量），目的为了帮助reducers（或者Stores in Flux）识别他们。我们建议将type定义成string类型或者不是symbols类型，因为strings are serializable,并且使用symbols类型会让你记录或者重演的行为变得更困难

In Flux, it is traditionally thought that you would define every action type as a string constant:

> const ADD_TODO = 'ADD_TODO' 
const REMOVE_TODO = 'REMOVE_TODO'
const LOAD_ARTICLE = 'LOAD_ARTICLE'

在Flux，一般都会把type定义成一个字符串常量

Why is this beneficial? It is often claimed that constants are unnecessary, and for small projects, this might be correct. For larger projects, there are some benefits to defining action types as constants:

为什么好呢？在小项目中，常量声明不是必须的，但是在大项目中，type定义成常量的好处如下：

 - It helps keep the naming consistent because all action types are gathered in a single place.

> 它有助于保持命名的一致性，因为所有操作类型都集中在一个地方。

 - Sometimes you want to see all existing actions before working on a new feature. It may be that the action you need was already added by somebody on the team, but you didn't know.
   
> 有时再添加新特性之前需要查看一下所有已存在的actions。也有可能你需要新增的action，你的队友已经添加但是你不知道

- The list of action types that were added, removed, and changed in a Pull Request helps everyone on the team keep track of scope and implementation of new features.
   
>   action的type列表，删除添加修改等操作很容易跟踪到

- If you make a typo when importing an action constant, you will get undefined. Redux will immediately throw when dispatching such an action, and you'll find the mistake sooner.

> 当你引入一个action常量的时候出现书写错误，那么你会得到undefined。当dispatch这个action的时候，redux立即报出问题，你就会很快地发现问题。

It is up to you to choose the conventions for your project. You may start by using inline strings, and later transition to constants, and maybe later group them into a single file. Redux does not have any opinion here, so use your best judgment.

这取决于你，在项目中使用约定习俗 。你可以使用inline strings, and later transition to constants 或者把他们都放入一个单独文件中。redux在这里没做任何要求。
（把它们放入一个单独文件中使我们项目中使用方式，可见diwork的配图）

 2-2 Action Creators


----------


It is another common convention that, instead of creating action objects inline in the places where you dispatch the actions, you would create functions generating them.

另外一个约定习俗是：不要在你要dispatch action的地方内联式地创建action，而是创建些生成他们的函数更好

For example, instead of calling dispatch with an object literal:

比如不要dipatch一个字面量对象

// somewhere in an event handler

    dispatch({
      type: 'ADD_TODO',
      text: 'Use Redux'
    })

You might write an action creator in a separate file, and import it into your component:
你最好在一个独立文件中写个action creator，然后import进来

    actionCreators.js
    
    export function addTodo(text) {
      return {
        type: 'ADD_TODO',
        text
      }
    }

    AddTodo.js
    
    import { addTodo } from './actionCreators'
    
    // somewhere in an event handler
    dispatch(addTodo('Use Redux'))
    
> 其实action creators就是return 一个action(一个action表现形式是type+其他内容)。就是把action封装下，在action的周围可以加上其他逻辑，如下：


Action creators have often been criticized as boilerplate. Well, you don't have to write them! You can use object literals if you feel this better suits your project. There are, however, some benefits for writing action creators you should know about.

Action creator经常被批评为是模板文件。好吧，实际上你可以不写他们。如果你觉得合适，你可以使用字面量对象。但是关于action creator的好处你需要知道一下

Let's say a designer comes back to us after reviewing our prototype, and tells us that we need to allow three todos maximum. We can enforce this by rewriting our action creator to a callback form with redux-thunk middleware and adding an early exit:

假设一个设计师在检查完原型之后回来告诉我们，我们需要允许最多三个任务。我们可以通过使用redux-thunk中间件将我们的action creator重写回调，并添加一个提前退出来实现这一点:

    function addTodoWithoutCheck(text) {
      return {
        type: 'ADD_TODO',
        text
      }
    }


    export function addTodo(text) {
      // This form is allowed by Redux Thunk middleware
      // described below in “Async Action Creators” section.
      return function (dispatch, getState) {
        if (getState().todos.length === 3) {
          // Exit early
          return
        }
        dispatch(addTodoWithoutCheck(text))
      }
    }

We just modified how the addTodo action creator behaves, completely invisible to the calling code. We don't have to worry about looking at each place where todos are being added, to make sure they have this check. Action creators let you decouple additional logic around dispatching an action, from the actual components emitting those actions. It's very handy when the application is under heavy development, and the requirements change often.

我们只需要修改addTodo这个action creator，完全可以忽略调用这个函数的任何地方（因此不用找到所有调用这个函数的地方添加任何额外操作）。action creator把dispatch an action周围的附加逻辑与发出这些动作的实际组件分离开来。
在繁重的开发阶段以及需求经常变动的情况下，这样开发变得非常敏捷

 2-3 Generating Action Creators


----------


Some frameworks like Flummox generate action type constants automatically from the action creator function definitions. The idea is that you don't need to both define ADD_TODO constant and addTodo() action creator. Under the hood, such solutions still generate action type constants, but they're created implicitly so it's a level of indirection and can cause confusion. We recommend creating your action type constants explicitly.

一些框架像Flummox可以通过action creator函数来生成action的type常量。这种想法意味着你不需要同时定义ADD_TODO 常量和 addTodo()这个 action creator。但是实质上还是需要生成action type常量，并且这种隐式创建会导致混淆。我们建议显式地创建action type

Writing simple action creators can be tiresome and often ends up generating redundant boilerplate code:
编写简单的action creator是非常累人的，并且常常会生成冗余的样板代码:

    export function addTodo(text) {
      return {
        type: 'ADD_TODO',
        text
      }
    }
    
    export function editTodo(id, text) {
      return {
        type: 'EDIT_TODO',
        id,
        text
      }
    }
    
    export function removeTodo(id) {
      return {
        type: 'REMOVE_TODO',
        id
      }
    }

You can always write a function that generates an action creator:

    function makeActionCreator(type, ...argNames) {
      return function (...args) {
        const action = { type }
        argNames.forEach((arg, index) => {
          action[argNames[index]] = args[index]
        })
        return action
      }
    }

    const ADD_TODO = 'ADD_TODO'
    const EDIT_TODO = 'EDIT_TODO'
    const REMOVE_TODO = 'REMOVE_TODO'
    
    export const addTodo = makeActionCreator(ADD_TODO, 'text')
    export const editTodo = makeActionCreator(EDIT_TODO, 'id', 'text')
    export const removeTodo = makeActionCreator(REMOVE_TODO, 'id')
    //上面的这个函数会返回来
    addTodo('hahah')
    {type: "ADD_TODO", text: "hahah"}

> 上面代码真的很不错，可以学习一下，闭包知识也有用到，type，argNames被保存了。注意返回的是一个函数

There are also utility libraries to aid in generating action creators, such as redux-act and redux-actions. These can help reduce boilerplate code and enforce adherence to standards such as Flux Standard Action (FSA).

有一些公共库帮助生成action creators，比如redux-act 和redux-actions . 这样可以减少模板代码和强制遵循FSA规范


 2-4 Async Action Creators


----------


异步的action creators

Middleware lets you inject custom logic that interprets every action object before it is dispatched. Async actions are the most common use case for middleware.

Middleware 允许您注入自定义逻辑在每个action对象中 before it is dispatched。异步操作是middleware最常见的用例。

Without any middleware, dispatch only accepts a plain object, so we have to perform AJAX calls inside our components:

没有middleware，dispatch只接受普通对象，因此我们不得不在组件中执行AJAX调用:

    actionCreators.js
    
    export function loadPostsSuccess(userId, response) {
      return {
        type: 'LOAD_POSTS_SUCCESS',
        userId,
        response
      }
    }
    
    export function loadPostsFailure(userId, error) {
      return {
        type: 'LOAD_POSTS_FAILURE',
        userId,
        error
      }
    }

    export function loadPostsRequest(userId) {
      return {
        type: 'LOAD_POSTS_REQUEST',
        userId
      }
    }

UserInfo.js

    import { Component } from 'react'
    import { connect } from 'react-redux'
    import {
      loadPostsRequest,
      loadPostsSuccess,
      loadPostsFailure
    } from './actionCreators'
    
    class Posts extends Component {
      loadData(userId) {
        // Injected into props by React Redux `connect()` call:
        // 通过调用React Redux `connect()`注入了props
        const { dispatch, posts } = this.props
    
        if (posts[userId]) {
          // There is cached data! Don't do anything.
          // 是否有缓存数据
          return
        }
    
        // Reducer can react to this action by setting
        // `isFetching` and thus letting us show a spinner.
        // 显示加载
        dispatch(loadPostsRequest(userId))
    
        // Reducer can react to these actions by filling the
        // `users`.
        
        fetch(`http://myapi.com/users/${userId}/posts`).then(
          response => dispatch(loadPostsSuccess(userId, response)),
          error => dispatch(loadPostsFailure(userId, error))
        )
      }
    
      componentDidMount() {
        this.loadData(this.props.userId)
      }
    
      componentWillReceiveProps(nextProps) {
        if (nextProps.userId !== this.props.userId) {
          this.loadData(nextProps.userId)
        }
      }
    
      render() {
        if (this.props.isFetching) {
          return <p>Loading...</p>
        }
    
        const posts = this.props.posts.map(post =>
          <Post post={post} key={post.id} />
        )
    
        return <div>{posts}</div>
      }
    }
    
    export default connect(state => ({
      posts: state.posts,
      isFetching: state.isFetching
    }))(Posts)


However, this quickly gets repetitive because different components request data from the same API endpoints. Moreover, we want to reuse some of this logic (e.g., early exit when there is cached data available) from many components.

然而这很快就会重复因为不同的组件使用相同api来请求数据，而且，我们希望重用许多组件中的一些逻辑（比如缓存数据存在的时候提前退出）
（如果有多个组件，需要重写很多次fetch请求呢）

Middleware lets us write more expressive, potentially async action creators. It lets us dispatch something other than plain objects, and interprets the values. For example, middleware can “catch” dispatched Promises and turn them into a pair of request and success/failure actions.

Middleware使我们能够编写更有表现力的、潜在的异步action creator。它允许我们dispatch something 而不是普通对象，并interprets the values。例如，middleware可以“捕获”已发出的promise，并将它们转换为一对请求+成功/失败操作。

The simplest example of middleware is redux-thunk. “Thunk” middleware lets you write action creators as “thunks”, that is, functions returning functions. This inverts the control: you will get dispatch as an argument, so you can write an action creator that dispatches many times.

middleware最简单的例子就是redux-thunk。thunk是允许你将action creators作为thunks，就是函数返回函数。这种反转控件，你可以将dispatch作为参数，因为写一个可以dispatch很多次的action creator

> Note 

> Thunk middleware is just one example of middleware. Middleware is
> not about “letting you dispatch functions”. It's about letting you
> dispatch anything that the particular middleware you use knows how to
> handle. Thunk middleware adds a specific behavior when you dispatch
> functions, but it really depends on the middleware you use. Thunk

> middleware只是一个简单例子，Middleware不是让你‘dispatch functions’。他是让你dispatch
> 任何Middleware知道如何处理的事情。Thunk Middleware可以在你dispatch
> functions之前添加一些特殊操作，不过这一切取决你你使用的Middleware

Consider the code above rewritten with redux-thunk:

actionCreators.js

    export function loadPosts(userId) {
      // Interpreted by the thunk middleware:
      // 交给thunk Middleware 解释
      return function (dispatch, getState) {
        const { posts } = getState()
        if (posts[userId]) {
          // There is cached data! Don't do anything.
          return
        }
    
        dispatch({
          type: 'LOAD_POSTS_REQUEST',
          userId
        })
    
        // Dispatch vanilla actions asynchronously
        fetch(`http://myapi.com/users/${userId}/posts`).then(
          response =>
            dispatch({
              type: 'LOAD_POSTS_SUCCESS',
              userId,
              response
            }),
          error =>
            dispatch({
              type: 'LOAD_POSTS_FAILURE',
              userId,
              error
            })
        )
      }
    }

UserInfo.js

    import { Component } from 'react'
    import { connect } from 'react-redux'
    import { loadPosts } from './actionCreators'
    
    class Posts extends Component {
      componentDidMount() {
        this.props.dispatch(loadPosts(this.props.userId))
      }
    
      componentWillReceiveProps(nextProps) {
        if (nextProps.userId !== this.props.userId) {
          this.props.dispatch(loadPosts(nextProps.userId))
        }
      }
    
      render() {
        if (this.props.isFetching) {
          return <p>Loading...</p>
        }
    
        const posts = this.props.posts.map(post =>
          <Post post={post} key={post.id} />
        )
    
        return <div>{posts}</div>
      }
    }
    
    export default connect(state => ({
      posts: state.posts,
      isFetching: state.isFetching
    }))(Posts)

This is much less typing! If you'd like, you can still have “vanilla” action creators like loadPostsSuccess which you'd use from a container loadPosts action creator.

更少的书写。如果你喜欢，你可以有vanilla action creators，如loadPostsSuccess
（其实就是把第一个UserInfo.js中loadData提出来加工一下改为loadPosts）

Finally, you can write your own middleware. Let's say you want to generalize the pattern above and describe your async action creators like this instead:
最后你可以编写自己的Middleware。如果你想要推广上面的模式，可以这样的描述你的异步action creators

    export function loadPosts(userId) {
      return {
      
        // Types of actions to emit before and after定义Types
        types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
        
        // Check the cache (optional):检查缓存
        shouldCallAPI: state => !state.posts[userId],
       
        // Perform the fetching:执行fetch
        callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
        // Arguments to inject in begin/end actions 参数注入在开始或者结束的actions
        payload: { userId }
      }
    }


The middleware that interprets such actions could look like this:

Middleware这样定义actions

    function callAPIMiddleware({ dispatch, getState }) {
      return next => action => {
        const {
          types,
          callAPI,
          shouldCallAPI = () => true,
          payload = {}
        } = action
    
        if (!types) {
          // Normal action: pass it on
          return next(action)
        }
    
        if (
          !Array.isArray(types) ||
          types.length !== 3 ||
          !types.every(type => typeof type === 'string')
        ) {
          throw new Error('Expected an array of three string types.')
        }
    
        if (typeof callAPI !== 'function') {
          throw new Error('Expected callAPI to be a function.')
        }
    
        if (!shouldCallAPI(getState())) {
          return
        }
    
        const [requestType, successType, failureType] = types
    
        dispatch(
          Object.assign({}, payload, {
            type: requestType
          })
        )
    
        return callAPI().then(
          response =>
            dispatch(
              Object.assign({}, payload, {
                response,
                type: successType
              })
            ),
          error =>
            dispatch(
              Object.assign({}, payload, {
                error,
                type: failureType
              })
            )
        )
      }
    }

After passing it once to applyMiddleware(...middlewares), you can write all your API-calling action creators the same way:

只要使用一次applyMiddleware(...middlewares), 您可以用同样的方式编写所有api调用的action creators


    export function loadPosts(userId) {
      return {
        types: ['LOAD_POSTS_REQUEST', 'LOAD_POSTS_SUCCESS', 'LOAD_POSTS_FAILURE'],
        shouldCallAPI: state => !state.posts[userId],
        callAPI: () => fetch(`http://myapi.com/users/${userId}/posts`),
        payload: { userId }
      }
    }
    
    export function loadComments(postId) {
      return {
        types: [
          'LOAD_COMMENTS_REQUEST',
          'LOAD_COMMENTS_SUCCESS',
          'LOAD_COMMENTS_FAILURE'
        ],
        shouldCallAPI: state => !state.comments[postId],
        callAPI: () => fetch(`http://myapi.com/posts/${postId}/comments`),
        payload: { postId }
      }
    }
    
    export function addComment(postId, message) {
      return {
        types: [
          'ADD_COMMENT_REQUEST',
          'ADD_COMMENT_SUCCESS',
          'ADD_COMMENT_FAILURE'
        ],
        callAPI: () =>
          fetch(`http://myapi.com/posts/${postId}/comments`, {
            method: 'post',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
          }),
        payload: { postId, message }
      }
    }


 2-5 Reducers


----------


Redux reduces the boilerplate of Flux stores considerably by describing the update logic as a function. A function is simpler than an object, and much simpler than a class.

Redux通过将更新逻辑描述为函数，大大减少了Flux样板。函数比对象简单，比类简单得多。

Consider this Flux store:

    const _todos = []
    
    const TodoStore = Object.assign({}, EventEmitter.prototype, {
      getAll() {
        return _todos
      }
    })
    
    AppDispatcher.register(function (action) {
      switch (action.type) {
        case ActionTypes.ADD_TODO:
          const text = action.text.trim()
          _todos.push(text)
          TodoStore.emitChange()
      }
    })

    export default TodoStore


With Redux, the same update logic can be described as a reducing function:

    export function todos(state = [], action) {
      switch (action.type) {
        case ActionTypes.ADD_TODO:
          const text = action.text.trim()
          return [...state, text]
        default:
          return state
      }
    }

The switch statement is not the real boilerplate. The real boilerplate of Flux is conceptual: the need to emit an update, the need to register the Store with a Dispatcher, the need for the Store to be an object (and the complications that arise when you want a universal app)。

这是对Flux的解析：
Switch语句不是真正冗余，Flux真正冗余的是概念：
需要emit an update
需要用一个dispatcher来注册store（就是store需要被注册在一个dispatcher上）
需要store是个对象（当你想要一个通用app的时候这就会非常的复杂）

It's unfortunate that many still choose Flux framework based on whether it uses switch statements in the documentation. If you don't like switch, you can solve this with a single function, as we show below.
愚蠢的是，许多人仍然根据文档中是否使用switch语句来选择Flux框架。如果您不喜欢switch，可以使用一个函数来解决这个问题，如下所示。

 2-6 Generating Reducers


----------


Let's write a function that lets us express reducers as an object mapping from action types to handlers. For example, if we want our todos reducers to be defined like this:

让我们编写一个函数，让我们将reducers表述为一个对象映射，映射关系是action type 映射到 handlers。例如，如果我们希望我们的todos是这样定义的:

    export const todos = createReducer([], {
      [ActionTypes.ADD_TODO]: (state, action) => {
        const text = action.text.trim()
        return [...state, text]
      }
    })

越来越像我们项目中用到了
这种映射关系去掉了switch
We can write the following helper to accomplish this:
可以使用下面的帮助来完成

    function createReducer(initialState, handlers) {
      return function reducer(state = initialState, action) {
        if (handlers.hasOwnProperty(action.type)) {
          return handlers[action.type](state, action)
        } else {
          return state
        }
      }
    }


This wasn't difficult, was it? Redux doesn't provide such a helper function by default because there are many ways to write it. Maybe you want it to automatically convert plain JS objects to Immutable objects to hydrate the server state. Maybe you want to merge the returned state with the current state. There may be different approaches to a “catch all” handler. All of this depends on the conventions you choose for your team on a specific project.
The Redux reducer API is (state, action) => newState, but how you create those reducers is up to you.

这并不难，不是吗?

Redux默认情况下不提供这样的帮助helper，因为有很多方法可以编写它。也许您希望它自动将普通JS对象转换为不可变对象，以适应服务器状态。也许您希望将返回的状态与当前状态合并。也有很多不同的方式来使用‘catch all’handler。所有这些都取决于您根据特定项目中选择的约定。

Redux reducer API是(state, action) => newState，但是如何创建这些reducer取决于您。

> action 、 action creators 、 reducer 的区别

> action  = type + new value

> action creators = logic + action

> reducer = state +  action creators


 3.diwork
diwork工作台的redux如下


  [单页中完整redux分成四个文件]: https://raw.githubusercontent.com/XYooo/image/master/redux2@2x.png
  [actions目录]: https://raw.githubusercontent.com/XYooo/image/master/redux3@2x.png
  [reducer目录]: https://raw.githubusercontent.com/XYooo/image/master/redux4@2x.png





