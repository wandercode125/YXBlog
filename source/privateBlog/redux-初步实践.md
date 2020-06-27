---
title: redux-初步实践
date: 2020-03-01 23:54:34
tags: redux
---

今天看到一个视频，讲了redux的初步使用。这里就介绍一下。

## 1 redux开始

### 1.1 简单例子1
redux不仅仅是可以和react一起使用，还可以和其他框架一起使用

```javascript

//第一步  npm install redux --save-dev

//第二步 引入createStore

import {createStore} from 'redux'

//第三步 定义reducer
const userReducer = (state={name:'defaultName'},action){
  return state
}

//第四步定义 store
const store  = createStore({
  userReducer
})

//此处我们可以获取一个store的信息
console.log(store);
console.log(store.getState);

```

- 我们打印store可以获得一些方法，如dispatch、getState、subscribe、replaceReducer等
- {name:'defaultName'}

> 总结
> - reducer有两个参数，state和action
> - createStore用来生成store，需要reducer做参数。store上不仅仅有state还有很重要的方法

下面介绍另外一个很关键的内容，便是dispatch，这个方法是唯一能改变state的方式

###1.2 简单例子2


```javascript

//第一步  npm install redux --save-dev

//第二步 引入createStore

import {createStore} from 'redux'

//第三步 定义reducer
const userReducer = (state={name:'defaultName'},action) =>{
  return state
}

//第四步定义 store
const store  = createStore({
  userReducer
})

store.dispatch({
  type:"CHANGENAME",
  payload:"NewName"
})

//可以获取一个action的信息
//在 userReducer中添加console.log(action)
//输出是 {"type":"CHANGENAME","payload":{"name":"NewName"}}
// 因此可以改写成
```

```javascript

//第一步  npm install redux --save-dev

//第二步 引入createStore

import {createStore} from 'redux'

//第三步 定义reducer
const userReducer = (state={name:'defaultName'},action){
 switch (action.type){
    case 'CHANGENAME':
            return {state,name:action.payload.name}
    }
}

//第四步定义 store
const store  = createStore({
  userReducer
})

store.dispatch({
  type:"CHANGENAME",
  payload:"NewName"
})

```

### 1.3 当有多个reducer怎么办
```javascript

// 引入combineReducer
import { createStore, combineReducers } from 'redux';
const userReducer = (state = { name: 'defaultName' }, action) => {
    console.log('userReducer', JSON.stringify(action));//groupReducer {"type":"CHANGENAME","payload":{"name":"NewName"}}
    switch (action.type) {
        case 'CHANGENAME':
            return { state, name: action.payload.name }

        default:
            return state;
    }
}

const groupReducer = (state = { group: 'defaultGroup' }, action) => {
    console.log('groupReducer', JSON.stringify(action)); //groupReducer {"type":"CHANGENAME","payload":{"name":"NewName"}}

    switch (action.type) {
        case 'CHANGEGROUP':
            return { state, group: action.payload.group }
        default:
            return state;
    }
}

const reducer = combineReducers({ userReducer, groupReducer })

const store = createStore(reducer)

store.dispatch({
    type: 'CHANGENAME',
    payload: { name: "NewName" }
})

console.log('store', store);
console.log('getState', JSON.stringify(store.getState()))//{"userReducer":{"state":{"name":"defaultName"},"name":"NewName"},"groupReducer":{"group":"defaultGroup"}}


```

### 1.4 当有异步请求

推荐使用 http://jsonplaceholder.typicode.com/

当有个更新数据需要异步请求，那么redux需要引入插件

```javascript

//安装插件 npm install axios 和redux-thunk --save

import{ createStore,combineReducers} from 'rediux'

import {get } from 'axio'

import thunk from 'redux-thunk';


const listReducer = (state = { list: {userId:0} }, action) => {
    
    switch (action.type) {
        case 'CHANGELIST':
           
            return { state, list: action.payload }
        default:
            return state;
    }
}

const getListJSON = () =>{
    return get('http://jsonplaceholder.typicode.com/posts')
}

const reducer = combineReducers({listReducer })

const store = createStore(
    reducer,
    compose(applyMiddleware(...[thunk]))
)


store.dispatch(async function(dispatch){
   let res = await getListJSON()
    dispatch({
        type:"CHANGELIST",
        payload:res.data.slice(0,1)
    })
    console.log('store', store);
    console.log('getState', JSON.stringify(store.getState()))//{"userReducer":{"name":"defaultName"},"groupReducer":{"group":"defaultGroup"},"listReducer":{"state":{"list":{"userId":0}},"list":[{"userId":1,"id":1,"title":"sunt aut facere repellat provident occaecati excepturi optio reprehenderit","body":"quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"}]}}
})


```

最重要的是在createStore中使用compose，并且注意applyMiddleWare的方法的参数



## 2 react-redux

react-redux关键的一点就是在最顶层的组件注入state，将state转成props

```javascript

//第一步安装react-redux


```