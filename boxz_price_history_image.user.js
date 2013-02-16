// ==UserScript==
// @name        Box-z Price History Image
// @namespace   qixinglu.com
// @description 在网上商店产品页面，自动插入一张从 www.box-z.com 里的价格历史波动图片。
// @grant       GM_xmlhttpRequest
// @include     http://mvd.360buy.com/*
// @include     http://book.360buy.com/*
// @include     http://www.360buy.com/product/*
// @include     http://www.newegg.com.cn/product/*
// @include     http://www.newegg.com.cn/Product/*
// @include     http://www.amazon.cn/gp/product/*
// @include     http://www.amazon.cn/*/dp/*
// @include     http://www.amazon.cn/mn/detailApp*
// @include     http://product.dangdang.com/product.aspx?product_id=*
// @include     http://product.dangdang.com/Product.aspx?product_id=*
// @include     http://item.51buy.com/item-*
// @include     http://www.suning.com/emall/prd_10052_10051_-7_*.html*
// @include     http://www.suning.com/emall/snupgbpv_10052_10051_*_.html
// @include     http://www.suning.com/emall/sngbv_10052_10051_*_.html
// @include     http://www.gome.com.cn/ec/homeus/jump/product/*.html*
// @include     http://www.lusen.com/product-*
// @include     http://www.efeihu.com/Product/*.html*
// @include     http://www.tao3c.com/product/*
// @include     http://www.coo8.com/product/*.html*
// @include     http://www.yihaodian.com/product/detail.do?*
// @include     http://www.yihaodian.com/product/*
// @include     http://www.ouku.com/goods*
// @include     http://www.redbaby.com.cn/*/*.html*
// @include     http://www.bookschina.com/*
// @include     http://www.wl.cn/*
// @include     http://product.china-pub.com/*
// @include     http://www.winxuan.com/product/*
// @include     http://www.99read.com/product/*
// @include     http://www.99read.com/Product/*
// @include     http://www.new7.com/product/*
// ==/UserScript==

// 图书类还是 Google Chart
function google_chart(response) {
    var temp_document, img_node, img_node_src, image_node;
    temp_document = document.createElement('html');
    temp_document.innerHTML = response.responseText;
    img_node = temp_document.querySelector('div.fNumber img');
    if (img_node === null) {
        image_node = document.createElement('p');
        image_node.innerHTML = '这个产品貌似没有历史价格数据，<a href="' + response.finalUrl + '">查看链接</a>。';
    } else {
        // 修改样式
        img_node_src = img_node.src.replace('chs=630x180', 'chs=720x240');
        img_node_src = img_node_src.replace('chts=FF0000%2c13', 'chts=FF0000%2c14');
        img_node_src = img_node_src + '&chdls=,14';
        img_node.src = img_node_src;
        img_node.width = 720;
        img_node.height = 240;
        img_node.style.marginTop = '10px';
        img_node.style.marginBottom = '10px';
        // 加上链接
        image_node = document.createElement('a');
        image_node.href = response.finalUrl;
        image_node.appendChild(img_node);
    }
    return image_node;
}

// 非图书类是自托管图片
function self_host(urls) {
    var img_node = document.createElement('img');
    var detail_url = urls[0];
    var chart_url = urls[1];
    img_node.src = chart_url;
    img_node.width = 630;
    img_node.height = 180;
    img_node.style.marginTop = '10px';
    img_node.style.marginBottom = '10px';
    // 加上链接
    var image_node = document.createElement('a');
    image_node.href = detail_url;
    image_node.appendChild(img_node);
    return image_node;
}

// 获得价格历史图片
function create_history_image_node(response) {
    var image_node;
    if (response.responseText === undefined) {
        image_node = self_host(response);
    }
    else {
        image_node = google_chart(response);
    }
    return image_node;
}

function create_product_history_url(prefix, product_uid) {
    var detail_url = 'http://www.box-z.com/products/' + prefix + '-' + product_uid + '.shtml';
    var chart_url = 'http://www.box-z.com/pic/small/' + prefix + '-' + product_uid + '.png';
    return [detail_url, chart_url];
}

function create_book_history_url(prefix, product_uid) {
    var detail_url = 'http://www.box-z.com/books/' + prefix + '-' + product_uid + '.shtml';
    var chart_url = null;
    return [detail_url, chart_url];
}

var url = window.location.href;

/* 网店处理规则 */
var sites = [{
    domain : '360buy.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        if (url.indexOf('http://www.360buy.com/product/') !== -1) {
            reg = new RegExp('http://www.360buy.com/product/(\\d+).html');
            product_uid = url.match(reg)[1];
            history_url = create_product_history_url('360buy', product_uid);
        } else {
            reg = new RegExp('http://.+\.360buy\.com/(\\d+).html');
            product_uid = url.match(reg)[1];
            history_url = create_book_history_url('360buy', product_uid);
        }
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('#choose');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'newegg.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.newegg.com.cn/[Pp]roduct/([^.]+).htm');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('newegg', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.mainInfoArea');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'amazon.cn',
    get_history_url: function() {
        var reg, product_uid, history_url;
        if (url.indexOf('/gp/product/') !== -1) {
            reg = new RegExp('http://www.amazon.cn/gp/product/([^/]+)/\?');
        } else if (url.indexOf('/dp/') !== -1) {
            reg = new RegExp('http://www.amazon.cn/[^/]+/dp/([^/]+)/\?');
        } else {
            reg = new RegExp('http://www.amazon.cn/mn/detailApp.*asin=(\\w+)');
        }
        product_uid = url.match(reg)[1];
        var category = document.querySelector('.nav-subnav-item.nav-category-button').textContent.trim();
        if (category === '图书') {
            history_url = create_book_history_url('amazon', product_uid);
        } else {
            history_url = create_product_history_url('amazon', product_uid);
        }
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('#handleBuy');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'dangdang.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://product.dangdang.com/[Pp]roduct.aspx\\?product_id=(\\d+)');
        product_uid = url.match(reg)[1];
        if (document.querySelectorAll('.dp_break a')[1].textContent === '图书') {
            history_url = create_book_history_url('dangdang', product_uid);
        } else {
            history_url = create_product_history_url('dangdang', product_uid);
        }
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.info');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : '51buy.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://item.51buy.com/item-([^.]+).htm');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('icson', product_uid);
        return history_url;
    }, 
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('#goods_detail_buyinfo');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'suning.com',
    get_history_url: function() {
        var reg, mess, product_uid, history_url;
        // 真恶心的url设计
        reg = new RegExp('http://www.suning.com/emall/(.+?).html');
        mess = url.match(reg)[1].split('_');
        if (mess[0] === 'prd') {
            product_uid = mess[4];
        }
        else {
            product_uid = mess[3];
        }
        history_url = create_product_history_url('suning', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        // 真混乱
        place_node = document.querySelector('.product_view, .groupViewContent, .show');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'gome.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.gome.com.cn/ec/homeus/jump/product/(\\d+).html');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('gome', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.showProdut');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'lusen.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.lusen.com/product-(\\d+)');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('lusen', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.goods-detail-tab');
        place_node.parentNode.insertBefore(image_node, place_node.previousElementSibling);
    }
}, {
    domain : 'efeihu.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.efeihu.com/Product/(\\d+?)\.html');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('efeihu', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('#itemInfo');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'tao3c.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.tao3c.com/product/(\\d+).html');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('tao3c', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.prodetailtext');
        place_node.parentNode.insertBefore(image_node, place_node.previousElementSibling);
    }
}, {
    domain : 'coo8.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.coo8.com/product/(\\d\+)\.html');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('coo8', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.mProd');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'yihaodian.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        if (url.indexOf('/product/detail.do') !== -1) {
            reg = new RegExp('http://www.yihaodian.com/product/detail.do\\?.*productID=(\\d+)');
        } else {
            reg = new RegExp('http://www.yihaodian.com/product/(\\d+)');
        }
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('yihaodian', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.produce');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'ouku.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.ouku.com/goods(\\d+)');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('ouku', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.celldetail_contright_xinde1');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'redbaby.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.redbaby.com.cn/\\w\+/\\d\{7}(\\d+?)\.html');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('redbaby', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.productRightBase');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'bookschina.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.bookschina.com/(\\d+)');
        product_uid = url.match(reg)[1];
        history_url = create_book_history_url('bookschina', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelectorAll('.float98')[1];
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'wl.cn',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.wl.cn/(\\d+)');
        product_uid = url.match(reg)[1];
        history_url = create_book_history_url('wl', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.pro layout blankbtm');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'china-pub.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://product.china-pub.com/(\\d+)');
        product_uid = url.match(reg)[1];
        history_url = create_book_history_url('chinapub', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.buybook');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : 'winxuan.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.winxuan.com/product/(\\d+)');
        product_uid = url.match(reg)[1];
        history_url = create_book_history_url('wenxuan', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.goods_info');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}, {
    domain : '99read.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.99read.com/[pP]roduct/(\\d+).aspx');
        product_uid = url.match(reg)[1];
        history_url = create_book_history_url('99read', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelectorAll('.NeiRongA-box')[1];
        place_node.parentNode.insertBefore(image_node, place_node.previousElementSibling);
    }
}, {
    domain : 'new7.com',
    get_history_url: function() {
        var reg, product_uid, history_url;
        reg = new RegExp('http://www.new7.com/product/(\\d+).html');
        product_uid = url.match(reg)[1];
        history_url = create_product_history_url('all3c', product_uid);
        return history_url;
    },
    request_callback: function(response) {
        var image_node, place_node;
        image_node = create_history_image_node(response);
        place_node = document.querySelector('.buy');
        place_node.parentNode.insertBefore(image_node, place_node.nextElementSibling);
    }
}];

function start_request(site) {
    var urls = site.get_history_url();
    if (urls[1] === null) {
        // 图书类
        GM_xmlhttpRequest({
            method: 'GET',
            url: urls[0],
            onload: site.request_callback
        });
    }
    else {
        // 非图书类
        site.request_callback(urls);
    }
}

/* 开始处理 */
var i, site;
for (i = 0; i < sites.length; i += 1) {
    if (url.indexOf(sites[i].domain) !== -1) {
        site = sites[i];
        break;
    }
}
start_request(site);