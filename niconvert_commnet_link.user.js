// ==UserScript==
// @name           Niconvert - Commnet Link
// @namespace      http://qixinglu.com
// @description    显示Acfun和Bilibili的弹幕评论地址
// @include        http://www.bilibili.tv/video/*
// @include        http://www.acfun.tv/v/*
// ==/UserScript==

var create_link = function(commnet_url) {
    var link = document.createElement('a');
    link.href = commnet_url;
    link.text = '评论地址';
    return link;
}

var do_bilibili = function() {
    var reg = new RegExp('id="bofqi".+?(?:ykid|qid|vid|uid)=(.+?)"');
    var commnet_uid = document.documentElement.innerHTML.match(reg)[1];
    var commnet_url = "http://comment.bilibili.tv/dm," + commnet_uid;
    var link = create_link(commnet_url);
    link.style.marginLeft = "10px";
    document.getElementsByClassName('tminfo')[0].appendChild(link);
}

var do_acfun = function() {
    var reg = new RegExp('flashvars=".+?id=(.+?)"');
    var commnet_uid = document.documentElement.innerHTML.match(reg)[1];
    var commnet_url = "http://122.224.11.162/" + commnet_uid + ".json";
    var link = create_link(commnet_url);
    document.querySelector('a[href=""]').parentNode.appendChild(link);
}

if (location.href.indexOf("http://www.bilibili.tv") === 0) {
    do_bilibili();
} else {
    do_acfun();
}
