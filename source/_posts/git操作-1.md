---
title: git操作-合并和暂存篇
date: 2019-12-24 20:50:25
tags: git
---

因为业务需求，有个工程开辟很多分支导致每个分支的开发进度不一致。有时候需要在自己的分支上合并其他分支的代码，某个文件夹或者具体到某次提交。

git的操作先从功能展示，在深入其原理


## 1 合并

场景： 把B分支的代码合并到A分支，当前在A分支

### 1.1 git merge：合并整个分支 

git merge 可以合并代码

#### 1.1.1 fastforward模式

这种模式下，删除分支后，会丢掉分支信息。(简言而知在A上看不到B上commit信息都没有)

``` javascript
git merge B

// 没有冲突
git push origin A

//有冲突，解决完之后
Git add .
Git commit -m’fix 冲突’
git push origin A

```


用git log --graph命令可以看到分支合并图

#### 1.1.2 --no-ff模式

如果要强制禁用Fast forward模式，Git就会在merge时生成一个新的commit，这样，从分支历史上就可以看出分支信息。（可以在A上查看到B的commit信息）

``` javascript
git merge --no-ff -m "merge with no-ff" B

```
因为本次合并要创建一个新的commit，所以加上-m参数，把commit描述写进去。
合并后，我们用git log看看分支历史：


### 1.2 git cherry-pick ：合并某次提交

合并某次提交

``` javascript
git cherry-pick 
例如
git cherry-pick 4c805e2

```

合并某次提交记录


### 1.3 git checkout: 合并某些文件或文件夹

合并某些文件或文件夹

``` javascript
git checkout B 某些文件  某些目录/**

```

注意：上面这个并不好，应该改成

``` javascript
git checkout -b A_temp
//当前分支A_temp
git checkout B `某些文件`  `某些目录/**`
// 注意目录后面的两个*表示深层拷贝

git checkout A
git merge A_temp

```

原因：使用checkout会把B分支的代码原原本本合并到A_temp,哪怕A_temp也有改动代码



## 2 暂存代码


场景：比如在develop开发着新功能，突然急需解决其他分支如master的代码的bug

解决方案：暂存develop代码，切到其他分支，

```javascript
// 当前分支develop 
git stash
git status  //本次操作无意义
//此时 git status 肯定是空的
git checkout master
Git pull
Git checkout -b bugfix_master
// 修改完
git add .
Git commit -m’bugfix’
Git checkout master
Git merge —no-diff -m "merged bug fix "  bugfix_master

```

回到develop，怎么取出

``` javascript

git stash list

git stash pop

```
一是用`git stash apply`恢复，但是恢复后，stash内容并不删除，你需要用`git stash drop`来删除；
另一种方式是用`git stash pop`，恢复的同时把stash内容也删了：

你可以多次stash，恢复的时候，先用git stash list查看，然后恢复指定的stash，用命令：

```javascript

$ git stash apply stash@{0}

```


## 3 git push 前

git push操作顺利推到远程没什么好说的，如果该分支线上有人提前提交了代码，git push应该会失败，需要先git pull.

此时 你确定直接 git pull   



