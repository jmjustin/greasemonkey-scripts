// ==UserScript==
// @name        Only Show This User Posts Chinalist
// @namespace   qixinglu.com
// @description 内置中文网站的 Only Show This User Posts 规则
// @require     https://raw.github.com/muzuiget/greasemonkey-scripts/a05a04685e5efc306c559b9e395ee2cb8dfe0e82/only_show_this_user_posts.user.js
// @include     https://localhost/*
// @include     http://www.douban.com/group/topic/*
// @include     http://tieba.baidu.com/p/*
// @include     http://www.tianya.cn/publicforum/content/*
// @include     http://www.tianya.cn/techforum/content/*
// @include     http://bbs.city.tianya.cn/tianyacity/content/*
// @include     http://club.kdnet.net/dispbbs.asp?*
// @include     http://dzh.mop.com/whbm/*
// ==/UserScript==

var SITES = [
{
    title: '豆瓣小组',
    url: 'http://www.douban.com/group/topic/*',
    style: 'div.reply-doc:hover div.operation_div {' +
           '    display: block;' +
           '    width: auto;' +
           '}' +
           'div.reply-doc a.ostup {' +
           '    color: #BBBBBB;' +
           '    font-size: 12px;' +
           '}' +
           '#link-report a.ostup {' +
           '    float: right;' +
           '    color: #BBBBBB;' +
           '}',
    post: 'div.topic-content.clearfix, ul.topic-reply li',
    position: '#link-report, div.operation_div',
    username: 'div.topic-doc span.from a, div.reply-doc h4 a',
},
{
    title: '百度贴吧',
    url: 'http://tieba.baidu.com/p/*',
    style: 'a.ostup {' +
           '    color: #AAAAAA;' +
           '    maring-top: 10px;' +
           '}' +
           'li.ostup {' +
           '    list-style: none outside none;' +
           '}',
    post: 'div.l_post',
    position: 'ul.p_author, div.d_author_anonym',
    username: 'a.p_author_name, div.d_author_anonym',
    container: '<li class="ostup"></li>',
},
{
    title: '天涯公共论坛',
    url: 'http://www.tianya.cn/publicforum/content/*',
    style: '#firstAuthor td[align=right] {' +
           '    width: 285px !important;' +
           '}' +
           'a.ostup {' +
           '    color: #999999;' +
           '    float: right;' +
           '    margin-right: 10px;' +
           '    text-decoration: none;' +
           '}',
    post: '#firstAuthor, #pContentDiv table, #pContentDiv div.post',
    position: '#firstAuthor td:last-child, #pContentDiv table td:last-child',
    username: '#firstAuthor td[align=center] a[target], #pContentDiv table center a',
},
{
    title: '天涯技术论坛和城市',
    url: [
        'http://www.tianya.cn/techforum/content/*',
        'http://bbs.city.tianya.cn/tianyacity/content/*',
    ],
    style: 'a.ostup {' +
           '    color: #999999;' +
           '    float: right;' +
           '    margin-right: 10px;' +
           '}',
    post: '#pContentDiv div.vcard, #pContentDiv div.post',
    position: '#pContentDiv div.vcard',
    username: '#pContentDiv div.vcard a[target]',
},
{
    title: '凯迪论坛',
    url: 'http://club.kdnet.net/dispbbs.asp?*',
    post: 'div.posted-box-add, div.reply-box',
    position: 'div.posts-control',
    username: 'div.posted-info span.c-main a[target]',
},
{
    title: '猫扑大杂烩',
    url: 'http://dzh.mop.com/whbm/*',
    post: '#body, div.main div.tzhfP',
    position: '#lzxx_fun div.hfyc, li.caption div.hfyc',
    username: '#lzxx_fun .ico_klz + a[target], li.caption a.name',
},
]

var site = select_site(SITES);
if (site !== null) {
    site.showOnlyLabel = '只看这个用户';
    site.showAllLabel = '显示全部用户';
    var control = ostup(site);
    document.addEventListener("LightPagerAppended", function() {
        control.add_buttons();
        control.do_filter();
    });
}
