---
title: IE9-上传图片
date: 2018-12-25 15:21:10
tags: IE
---

## 前言
这里记录一下ie9下面的坑

### 1.1 利用input的upload来上传图片
在chrome firefox下面的上传图片可以采用input的upload操作.代码如下


```javascript
<span className="iconOuter" onClick={e => uploadImage(e)}>
    <input type="file" id="btn_file2" accept="image/x-png,image/gif,image/jpeg,image/bmp" onChange={imgChange} style={{ display: 'none' }} />
    <Icon type="add" className="iconAdd"></Icon>
</span>
```

```javascript
 
 uploadImage = () => {
    this.actualInput = document.getElementById('btn_file2'); //上面input的id
    document.getElementById('btn_file2').click();
  }
  
  imgChange = (e) => {
    let _this = this;
    if (e.target.value.trim().length === 0) {
      this.setState({
        imgWarning: '请上传图片',
      });
    }
    const val = e.target.value && e.target.value.substr(e.target.value.lastIndexOf('.'));
    if (val && !val.match(/.jpg|.gif|.png|.bmp|.svg/i)) {
      this.setState({
        imgWarning: '必须是一个图片',
      });
      return false;
    }
    this.setState({
      imgWarning: false,
    });
    if (navigator.userAgent.indexOf('MSIE 9.0') > 0) {
        //ie9的时候逻辑，此处省略；具体见下面
    }
    //start:关键代码
    const [obj] = document.getElementById('btn_file2').files; //这里的上传的图片是在dialog中的
    const imgUrl = window.URL.createObjectURL(obj);
    // document.getElementById('imgSrc2').src = imgUrl;
    // 创建对象
    const imgObj = new Image();
    // 改变图片的src
    imgObj.src = imgUrl;
    // 加载完成执行
    imgObj.onload = function () {
      if (imgObj.width !== imgObj.height || imgObj.width !== 120 || obj.size > 5000000) {
        openMess({
          title: '上传图标失败！',
          content: '图标尺寸须为120*120，且不大于5M！',
          duration: 6,
          type: 'danger',
          closable: false,
        });
        return false;
      }
      const { uploadApplication, requestError } = _this.props;
      const from = new FormData();
      from.append('btn_file2', obj);
      //end:关键代码
      uploadApplication(from).then(({ error, payload }) => {
        if (error) {
          _this.actualInput.value = null;
          requestError(payload);
        } else if (payload && payload.url) {
          // document.getElementById('imgSrc2').src = payload.url;
          _this.setState({
            newApplicationIcon: payload.url,
          });
        }
      });
      return true;
    };

  }
```


但是在ie9下面则需要使用input+form++iframe，
input的onchange触发form的submit，然后监听iframe的onload事件，获取ifame中内容，其实就是上传后图片的地址

具体代码如下（es6+react）


```javascript
<div className={iconDialogContent}>
  {
      navigator.userAgent.indexOf('MSIE 9.0')> 0 &&
      (
        <div className="ie9_form" style={{ position: 'relative' }}>
          <div className="hidden_form" >
            <form
              id="upload-form"
              name="myform"
              action="/manager/file/upload/oss/workbench-image-path-applicationIcon"
              method="post"
              target="frameUpload"
              acceptCharset="utf-8"
              encType="multipart/form-data"
            >
              <input id="btn_file2" className={formBtnFile} type="file" name="file" accept="image/x-png,image/gif,image/jpeg,image/bmp" onChange={e => imgChange(e)} />
            </form>
            <iframe id="frameUpload" title="frameUpload" name="frameUpload" style={{ width: 0, height: 0, opacity: 0 }} />
          </div>
          <span className="iconOuter">
            <Icon type="add" className="iconAdd"></Icon>
          </span>
        </div>
      )
  }

</div>
```

```javascript

// 下面是关键的三个方法，
// 第一个是chrome等下的spanclick方法：uploadImage
// 第二个是input的imgchange()，，
// 最后一个是ie9下的iframe的onload方法：

uploadImage = () => {
    this.actualInput = document.getElementById('btn_file2');
    this.actualInput.click();
}
  imgChange = (e) => {
    let _this = this;
    if (e.target.value.trim().length === 0) {
      this.setState({
        imgWarning: '请上传图片',
      });
    }
    const val = e.target.value && e.target.value.substr(e.target.value.lastIndexOf('.'));
    if (val && !val.match(/.jpg|.gif|.png|.bmp|.svg/i)) {
      this.setState({
        imgWarning: '必须是一个图片',
      });
      return false;
    }
    this.setState({
      imgWarning: false,
    });

    if (navigator.userAgent.indexOf('MSIE 9.0') > 0) {
      const formVal = document.getElementById('upload-form');
      formVal.submit();
      if (window.attachEvent) {
        document.getElementById('frameUpload').attachEvent('onload', this.handleOnLoad);
      } else {
        document.getElementById('frameUpload').addEventListener('load', this.handleOnLoad);
      }
      return true;// 后面的不再执行了
    }
    ....省略
  }

 handleOnLoad = () => {
    let _this = this;
    const frame = document.getElementById('frameUpload');
    const resp = {};
    const content = frame.contentWindow ?
      frame.contentWindow.document.body :
      frame.contentDocument.document.body;
 
    if (!content) throw new Error('Your browser does not support async upload');
    resp.responseText = content.innerHTML || 'null innerHTML';
    resp.json = JSON.parse(resp.responseText) || eval(`(${resp.responseText})`);
    
    const dataBack = resp.json || resp.responseText;
    
    if (dataBack) {
      // document.getElementById('imgSrc2').src = dataBack.data.url;
      // 创建对象
      const imgObj = new Image();
      // 改变图片的src
      // alert('dataBack.data.url'+dataBack.data.url)
      imgObj.src = dataBack.data.url;
      // 加载完成执行
      imgObj.onload = function () {
        if (imgObj.width !== imgObj.height || imgObj.width !== 120) {
          openMess({
            title:'上传图标失败！',
            content: '图标尺寸须为120*120，且不大于5M！',
            duration: 6,
            type: 'warning',
            closable: false,
          });
          return false;
        }
        _this.setState({
          newApplicationIcon: dataBack.data.url,
        });
      }
    }
  }

```

上面的袋面针对的场景
- 1.可以使跨域的，比如这里的上传图片的url是

```
https://pubapi.yonyoucloud.com/file/upload/oss/workbench-image-path-applicationIcon
```

- 2.单张图片上传


### 1.2 ie9下css加载不全

同一个页面在chrome下面显示正常，但是在ie9下面显示不正常。后来定位到是样式没加载全乎。

在chrome下面的main.css（工程的全部css样式文件）中关于.u-checkbox的样式有四处，但是ie9下main.css确只有三处，比对之后发现，在ie9的css中有个少了一个文件的样式，所以
> 猜测

> (1)因为在main.css通过import XXX.css方式引入文件，难道webpack打出来的dist文件没有main.css

 解答：并不是，因为chrome，火狐下面是好使的,所以XXXcss肯定是打进来了

> (2)ie9下文件没有加载全

解答：是的，ie9下css文件没有加载全，有两种情况，1.文件本身没有加载全，比如415k的文件，只加载了250k；2.文件加载全了，但是样式没有起效，跟selector的个数有关。

> ie9下的css长度有限制

### 1.2.1 

文献参考：

[IE9引发的血案-如何处理webpack打包后体积依然过大的css文件](https://blog.csdn.net/Napoleonxxx/article/details/80292006)

[does-ie9-have-a-file-size-limit-for-css](https://stackoverflow.com/questions/11080560/does-ie9-have-a-file-size-limit-for-css/11080846)

Miscrosoft官网上的规则[Rule](https://support.microsoft.com/zh-cn/help/262161/a-webpage-that-uses-css-styles-does-not-render-correctly-in-internet-e) 如下，
1. A sheet may contain up to 4095 rules
2. A sheet may @import up to 31 sheets
3. @import nesting supports up to 4 levels deep

另外也有一些文章提到单个css文件的大小不能超过250k。官方规则中并没有提到这一条。

### 1.2.2 每个规则的示

>[ a sheet may contain up to 4095 selectors, see]( http://demos.telerik.com/testcases/4095issues.html)


> [a sheet may @import up to 31 sheets, see](http://demos.telerik.com/testcases/BrokenTheme.aspx)


> @import nesting supports up to 4 levels deep



### 1.2.3 评论

```
1. To notice, IE10 doesn't have this limit (including when in IE7-8-9 modes) 
2. In my testing of IE9 I found the MAX SIZE to be 278kb –
```


### 1.3 ie判断


```
IS_IE = !!window.ActiveXObject || "ActiveXObject" in window;
```
