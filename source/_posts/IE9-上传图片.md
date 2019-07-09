---
title: IE9-上传图片
date: 2018-12-25 15:21:10
tags: IE
---

## 前言
这里记录一下上传功能，，不仅仅适用于ie9

## 1 上传

上传一直是很麻烦的事情，还好我有源码


### 1.1 非IE9，利用input的upload来上传图片
在chrome firefox下面的上传图片可以采用input的upload操作.代码如下


```javascript
<span className="iconOuter" onClick={e => uploadImage(e)}>
    <input type="file" id="btn_file2" accept="image/x-png,image/gif,image/jpeg,image/bmp" onChange={imgChange} style={{ display: 'none' }} />
    <Icon type="add" className="iconAdd"></Icon>
</span>
```
>  其实上面的代码只显示icon 加号➕


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


### 1.2 IE9，使用input+form+iframe，

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

>  其实上面的代码只显示icon 加号➕


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

form+input+iframe针对的场景
- 1.可以使跨域的，比如这里的上传图片的url是

```
https://pubapi.yonyoucloud.com/file/upload/oss/workbench-image-path-applicationIcon

```

- 2.单张图片上传
