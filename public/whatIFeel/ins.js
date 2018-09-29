
(function(searchData) {
    function render(data){
      console.log(data)
      var telDom = '';
      data.list.forEach(item => {
        telDom += '<li class="content-item">'
        +'<span class="content-time">'+item.date+'</span>'
        +'<span class="content-spec">'+item.content+'</span>'
        +'</li>';
      })
      document.getElementById('feelContent').innerHTML = telDom;
    }
    function loadData(success) {
      if (!searchData) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', './ins.json?t=' + +new Date(), true);

        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            var res = JSON.parse(this.response);
            searchData = res;
            success(searchData);
          } else {
            console.error(this.statusText);
          }
        };

        xhr.onerror = function() {
          console.error(this.statusText);
        };

        xhr.send();
      } else {
        success(searchData);
      }
    }
    var Ins = {
      init: function init() {
        loadData(function(data) {
          render(data);
        });
      }
    };
    Ins.init();
    // export default impush;

    /***/
})(undefined);