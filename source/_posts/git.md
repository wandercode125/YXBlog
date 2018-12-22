---
title: "git新操作备注"
tags: 
	- "git"
---

使用git进行工程的操作，长期下来git pull 、git add 、git push、就可以完成日常所需，但是近期有些其他的操作，记录下来都是亲身测试有效的

<!-- more -->
### 1.开个新分支
（1）如果新建一个以develop内容为基础的分支

 - git checkout develop 
 - git checkout -b yx0628develop_new

不断修改不断的保存也是可以生成log的

 - git add .  //这是提交全部修改，慎重 
 - git commit -m'全部修改提交'

（2）把新分支的代码合并到develop
 前提：先把新分支yx0628develop_new的代码add完毕，commit完毕
 

 - git checkout develop  
 - git merge yx0628develop_new
无冲突
 - git push 
有冲突
 - 解决冲突
 - git add 冲突文件
 - git commit -m'随便你想写什么'
 - git push

###2.代码迁移仓库（保留log）
不保留log等提交的记录的迁移就不说了，soeasy！
目标：把A仓库的代码迁移到B仓库并且保存所有的git log，B仓库已经存在了哦，哪怕是个空仓库。

再说这个之前先说点其他。在使用git的时候我们可能见到这样的命令。不想看解说想直接看步骤的，[直接步骤](#1)

>     git pull origin master //拉取远程master分支的代码
>     git push origin master //把代码推到远程master分支上去

有没有人好奇为什么是origin，而不是其他名字，比如git pull orginal master或者git pull origin2 master;

解答上面的问题很简单，请在你的工程中输入

>     git remote
发现了什么呢？默认就有一个origin，代表远程仓库。origin是有地址，地址就是当前仓库的git地址，是个url哦。所以为什么git push origin master就自动相应的推到的远程仓库的master分支了。


<h2 id="1">下面是正确的操作步骤，(看准情况分类很重要，就两种)</h2>
不管哪种情况请从情况1开始看哈哈：

<h2>情况1：</h2>
**B仓库是一个空仓库，除了默认的master分支，没有任何分支**。把A的branch1,branch2,branch3...依次迁入B，B也就有branch1,branch2,branch3,

 - 进入A工程
 - git remote     
    > 原因：看下当前远程仓库有啥名字，然后取个崭新的名字，不重复的名字，名字是过渡，不必纠结。这里取名origin2

 - git remote add origin2 master
  > 不纠结照抄这就话
 - git remote set-url origin2 git@git.hub.com:B.git
    > 原因：后面的B仓库地址url才是关键，origin2只是过渡，百人百种起法

 -  进入A工程的branch1分支上
 - git pull 
   > 原因：拉取一下最新代码

 -  git checkout -b branchB1 
 > 原因：branchB1是基于A工程branch1开的新分支，代码跟A工程branch1一毛一样，**但是这个名字branchB1非常重要，非常重要**，原因只有一个：这个分支会被推到B工程，结果就是B工程下面就有这个分支。所以你懂的，万一你的B工程下面已经有了该分支名字，你这个做了好多工作的branchB1是根本推不上去的，是不是很疯狂

 - git push origin2
 
 > 结果：这一步能不能成功就看上一步，不多说，就看你取名字瞎不瞎


如果上面的结束，说明已经成功迁移出一个分支了。常见问题：

疑问1:问其他的分支怎么做，请重复
 - 进入A工程的branch2分支上
 - git pull 
 - git checkout -b branchB2
 - git push origin2
branch2 变成branchB2然后被推到B仓库

疑问2:你还问我第三个分支怎么迁移，不解释啦实在不行哎我还能说啥。

疑问3: 我打眼一看B工程中的分支名字都是branchB1,branchB2....怎么破，
改分支的名字直接登陆git.hub.com,打开工程你会看到branches这个，点进去可以修改.至于改名字，代码都迁移过去了，改个名字还很远吗

<h2>情况2：</h2>
**B仓库不是一个空仓库，里面各种各样乱七八糟的分支**。把A的branch1,branch2,branch3...一次迁入B，B也就有branch1,branch2,branch3,

呃呃呃呃呃，
步骤跟上面一毛一样，能不能推成功，就看你起名字的功夫了。什么名字，就是你最后要推到B工程上去的分支名字，注意在这里.






 
