//获取数据 生成节点
var isLoading = false
function getData(render) {
    if (isLoading) return
    isLoading = true
    $.ajax({
        url: 'http://platform.sina.com.cn/slide/album_tech',
        dataType: 'jsonp',
        jsonp: "jsoncallback",
        data: {
            app_key: '1271687855',
            num: count,
            page: page
        }
    }).done(function (ret) {
        if (ret && ret.status && ret.status.code === "0") {
            render(ret.data);
            page++
        } else {
            console.log('get error data');
        }
    }).always(function () {
        isLoading = false
    });
}
var count = 10
var page = 1

function getNode(item) {
    var tpl = ''
    tpl += '<li class="item">';
    tpl += ' <a href="' + item.url + '" class="link"><img src="' + item.img_url + '" alt=""></a>';
    tpl += ' <h4 class="title">' + item.short_name + '</h4>';
    tpl += '</li>';
    return $(tpl)
}

//瀑布流布局
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

function render(newsArr) {
    $.each(newsArr, function (idx, news) {
        var $node = getNode(news)
        $node.find('img').load(function () {
            $('.item-wrap').append($node)
            layout($node)
        })
    })
}

//滚动到定点加载数据

function isShow() {
    return $('.load').offset().top <= $(window).height() + $(window).scrollTop()
}
function lazyLoad() {
    if (isShow()) {
        getData(render)
    }
}
lazyLoad()
// 绑定滚动事件
$(window).on('scroll', function () {
    debounce(lazyLoad(), 500)

})

//滚动事件节流
function debounce(func, delay) {
    var timeout
    return function () {
        clearTimeout(timeout)
        var context = this,
            args = arguments,
            timeout = setTimeout(function () {
                func.apply(context, args)
            }, delay)
    }
}
