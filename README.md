# waterfall-news
[预览地址](https://cccccchenyuhao.github.io/waterfall-news/index.html)

## 懒加载原理
  判断元素出现在视野中，发送 AJAX 请求数据
 ```
 function isShow() {
    return $('.load').offset().top <= $(window).height() + $(window).scrollTop()
}
function lazyLoad() {
    if (isShow()) {
        getData(render)
    }
}
```
## 瀑布流原理
  `item`绝对定位，`item-wrap`相对定位。定义一个数组存放高度。每次加载`item`计算数组最小高度，拼接到最小的列上，并计算该列的总高度赋值给数组对应的项。
  ```
  var colArr = [],
    colWidth = $('.item').outerWidth(true),
    colNum = parseInt($('.item-wrap').outerWidth(true) / colWidth);

  for (var i = 0; i < colNum; i++) {
    colArr.push(0)
  }
  function layout($node) {
    var idx = 0,
        minSumHeight = colArr[0];
    for (var i = 0; i < colArr.length; i++) {
        if (colArr[i] < minSumHeight) {
            idx = i;
            minSumHeight = colArr[i];
        }
    }
    $node.css({
        left: colWidth * idx,
        top: minSumHeight,
        opacity: 1
    });
    colArr[idx] = $node.outerHeight(true) + colArr[idx];
    $('.item-wrap').height(Math.max.apply(null, colArr));
}
```

