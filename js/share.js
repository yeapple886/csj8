/**
 * Created by paux on 15/2/13.
 */
(function(){
    weixinShare(window.location.href);
    function weixinShare(url) {
        reqwest({
            method: 'GET',
            url: 'http://m.pingan.com/chaoshi/weixin/getsignaturejsonp.do?noncestr=121212&timestamp=1212121212&url=' + url,
            type: "jsonp",
            jsonp: 'callback',
            success: function(data) {
                console.log(data);
                weiApi(data);
            },
            error: function(xhr, type) {
                //alert('Ajax error!');
            }
        });
    };
    function weiApi(weiD) {
        wx.config({
            debug: false,
            appId: 'wx48543cb41e9ae050',
            timestamp: 1212121212,
            nonceStr: '121212',
            signature: weiD.resultData,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo'
            ]
        });
        wx.ready(function() {
            wx.checkJsApi({
                jsApiList: [
                    'getNetworkType',
                    'previewImage'
                ],
                success: function (res) {
                    //console.log(JSON.stringify(res));
                }
            });
            var shareData = {
                title: '惊闻发财消息奔走相告！平安金融旗舰店财神日来啦！',
                desc: '惊闻发财消息奔走相告！平安金融旗舰店财神日来啦！',
                link: 'http://m.pingan.com/c3/qjd/huodong/csr/index.shtml',
                imgUrl: 'http://m.pingan.com/app_images/c3/chaoshi/huodong/csr/200.jpg'
            };

            wx.onMenuShareAppMessage(shareData);
            wx.onMenuShareTimeline({
                title: '惊闻发财消息奔走相告！平安金融旗舰店财神日来啦！',
                link: 'http://m.pingan.com/c3/qjd/huodong/csr/index.shtml',
                imgUrl: 'http://m.pingan.com/app_images/c3/chaoshi/huodong/csr/200.jpg'
            });
            wx.onMenuShareQQ(shareData);
            wx.onMenuShareWeibo(shareData);
        });
        wx.error(function(res) {
            //alert(res.errMsg);
            //console.log(res.errMsg);
        });
    }
})();
