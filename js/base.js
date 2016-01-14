;
(function () {
    var getEl = document.querySelector.bind(document),
        getEls = document.querySelectorAll.bind(document),
        rongziUrlHost = 'http://cms.test.24money.com',//测试接口
        //rongziUrlHost = 'http://rongzi-cms.pingan.com',//生产接口
        seccodeId = "",
        activeId = "";
    // 手机校验
    function checkMobile(telDom) {
        var mobile = telDom.value;
        return !!(/^1[3,4,5,7,8][0-9]{9}$/.test(mobile)) ? true : false;
    }

    // 图形验证码校验
    function checkImgCode(imgcDom) {
        var imgCode = imgcDom.value;
        return !!(/^[\dA-Za-z]{4}/.test(imgCode)) ? true : false;
    }

    // 短信验证码校验
    function checkSMSCode(smsDom) {
        var smsCode = smsDom.value;
        return !!(/^\d/.test(smsCode)) ? true : false;
    }

    // 图形验证码接口
    function checkAjaxImgCode(mobile, callback) {
        reqwest({
            method: 'GET',
            url: rongziUrlHost + '/active/yzt/appvcode.html',
            type: 'jsonp',
            data: {
                mobile: getEl(mobile).value,
                appid: "10340"
            },
            success: function (res) {
                if (res.errcode === 0) {
                    if (res.data.type === "0") {
                        callback(res);
                    }
                }
            }
        });
    }


    // 发送短信验证码
    function ajaxSms(sms, imgcode, callback) {
        reqwest({
            method: 'GET',
            url: rongziUrlHost + '/active/yzt/sendNewSmsCode.html',
            type: 'jsonp',
            data: {
                mobile: getEl(sms).value,
                seccode: getEl(imgcode).value,
                seccodeId: seccodeId,
                appid: "10340"
            },
            success: function (res) {
                callback(res);
            }
        });
    }

    // 领取体验金注册一账通
    function openBox() {
        reqwest({
            url: rongziUrlHost + "/Fmall/Mammon/sendTasteMoney.html",
            method: "GET",
            type: "jsonp",
            data: {
                mobile: getEl("#inpMobile").value,
                smscode: getEl("#inpSMS").value,
                seccodeId: activeId,
                product_id: 16
            },
            success: function (res) {
                if (res.errcode == 0) {
                    getEl("#pChest").style.display = "none";
                    getEl("#pYztb").style.display = "block";
                }
                if (res.errcode == -1) {
                    errorGetcode.put('已参加过活动，请勿重复参加');
                }
                if (res.errcode == "0018") {
                    errorGetcode.put('验证码已过期');
                }else{
                    errorGetcode.put(res.msg);
                }
            },
            error: function (e) {
                console.log(e);
            }
        })
    }

    // 产品预约
    // function saleRemid() {
    //     reqwest({
    //         url: rongziUrlHost + "/Fmall/Mammon/subscribeOTP.html",
    //         method: "GET",
    //         type: "jsonp",
    //         data: {
    //             mobile: getEl("#inpMobile_sale").value,
    //             smscode: getEl("#inpSMS_sale").value,
    //             product_id: 12,
    //             seccodeId: activeId,
    //         },
    //         success: function (res) {
    //             if (res.errcode == 0) {
    //                 getEl("#pSale").style.display = "none";
    //                 getEl("#pSuccess").style.display = "block";
    //                 getEl("#setOk").addEventListener('click', function () {
    //                     getEl("#pSuccess").style.display = "none"
    //                     getEl("#pMask").style.display = "none";
    //                 })
    //             }
    //             if (res.errcode == -1) {
    //                 errorGetcode_sale.put('已预约过此产品，请勿重复领取');
    //             }
    //             if (res.errcode == "0018") {
    //                 errorGetcode_sale.put('验证码已过期');
    //             }else{
    //                 errorGetcode_sale.put(res.msg);
    //             }
    //         }
    //     })
    // }


    // 开宝箱报错文字提示
    var errorRemid = {
        put: function (msg) {
            var errorRemid = getEl("#errorRemid");
            errorRemid.innerText = msg;
        }
    };
    var errorModal = {
        put: function (msg) {
            var errorModal = getEl("#errorModal");
            errorModal.innerText = msg;
            errorModal.style.display = 'inline-block';
        }
    };
    var errorMobile = {
        put: function (msg) {
            var errorMobile = getEl("#errorMobile");
            errorMobile.innerText = msg;
            errorMobile.style.display = 'inline-block';
        }
    };
    var errorImgcode = {
        put: function (msg) {
            var errorImgcode = getEl("#errorImgcode");
            errorImgcode.innerText = msg;
            errorImgcode.style.display = 'inline-block';
        }
    };
    var errorGetcode = {
        put: function (msg) {
            var errorGetcode = getEl("#errorGetcode");
            errorGetcode.innerText = msg;
            errorGetcode.style.display = 'inline-block';
        }
    };

    // 设置开售提醒报错文字提示
    var errorMobile_sale = {
        put: function (msg) {
            var errorMobile_sale = getEl("#errorMobile_sale");
            errorMobile_sale.innerText = msg;
            errorMobile_sale.style.display = 'inline-block';
        }
    };
    var errorImgcode_sale = {
        put: function (msg) {
            var errorImgcode_sale = getEl("#errorImgcode_sale");
            errorImgcode_sale.innerText = msg;
            errorImgcode_sale.style.display = 'inline-block';
        }
    };
    var errorGetcode_sale = {
        put: function (msg) {
            var errorGetcode_sale = getEl("#errorGetcode_sale");
            errorGetcode_sale.innerText = msg;
            errorGetcode_sale.style.display = 'inline-block';
        }
    };

    // 获取短信验证码倒计时
    function countdown(el) {
        var count = 120;
        el.attributes.disable = true;
        var timer = setInterval(function () {
            if (!count) {
                clearInterval(timer);
                el.attributes.disable = false;
                el.innerText = '获取验证码';
                return;
            }
            el.innerText = count;
            count--;
        }, 1000);
    }


    return {
        init: function () {
            getEl('#openBox').addEventListener('click', function () {
                getEl('#pMask').style.display = 'block';
                getEl('#pChest').style.display = 'block';
                checkAjaxImgCode("#inpMobile", function(res){
                    getEl("#imgValCode").src = res.data.img;
                    getEl("#imgBlock").classList.remove("dn");
                    seccodeId = res.data.id;
                });
            });

            // getEl('#remindMe').addEventListener('click', function () {
            //     getEl('#pMask').style.display = 'block';
            //     getEl('#pSale').style.display = 'block';
            //     checkAjaxImgCode("#inpMobile_sale", function(res){
            //         getEl("#imgValCode_sale").src = res.data.img;
            //         getEl("#imgBlock_sale").classList.remove("dn");
            //         seccodeId = res.data.id;
            //     });
            // });

            [].forEach.call(getEls('.close'), function (item, index) {
                item.addEventListener('click', function () {
                    var pop = item.parentElement;
                    pop.style.display = 'none';
                    getEl("#pMask").style.display = "none";
                });
            });

            // 设置开售提醒
            getEl('#goRemid').addEventListener('click', function () {
                if (!checkMobile(getEl("#inpMobile_sale"))) {
                    errorMobile_sale.put("请输入正确的手机号码");
                    return false;
                }
                if (!checkImgCode(getEl("#inpImgCode_sale"))) {
                    errorImgcode_sale.put('请输入正确的图形验证码');
                    return false;
                }
                if (!checkSMSCode(getEl("#inpSMS_sale"))) {
                    errorGetcode_sale.put('请输入正确的验证码');
                    return false;
                }
                saleRemid();
            });

            // 开宝箱获取图形验证码
            getEl("#imgValCode").addEventListener('click', function () {
                checkAjaxImgCode("#inpMobile", function(res){
                    getEl("#imgValCode").src = res.data.img;
                    getEl("#imgBlock").classList.remove("dn");
                    seccodeId = res.data.id;
                });
            });

            // 设置开售提醒图形验证码
            getEl("#imgValCode_sale").addEventListener('click', function () {
                checkAjaxImgCode("#inpMobile_sale", function(res){
                    getEl("#imgValCode_sale").src = res.data.img;
                    getEl("#imgBlock_sale").classList.remove("dn");
                    seccodeId = res.data.id;
                });
            });

            // 开宝箱发送短信按钮
            getEl("#getCode").addEventListener('click', function () {
                if (this.attributes.disable) {
                    return false;
                }
                if (!checkMobile(getEl("#inpMobile"))) {
                    errorMobile.put('请输入正确的手机号码');
                    return false;
                }
                if (!checkImgCode(getEl("#inpImgCode"))) {
                    errorImgcode.put('请输入正确的图形验证码');
                    return false;
                }
                ajaxSms("#inpMobile", "#inpImgCode", function(res){
                    if (res.errcode == -11) {
                        errorMbile.put('手机号码为空');
                    }
                    if (res.errcode == -3) {
                        errorImgcode.put('图形验证码错误');
                        checkAjaxImgCode("#inpMobile", function(res){
                            getEl("#imgValCode").src = res.data.img;
                            getEl("#imgBlock").classList.remove("dn");
                            seccodeId = res.data.id;
                        });
                    }
                    if (res.errcode == -12) {
                        errorImgcode.put('图形验证码为空');
                        checkAjaxImgCode("#inpMobile", function(res){
                            getEl("#imgValCode").src = res.data.img;
                            getEl("#imgBlock").classList.remove("dn");
                            seccodeId = res.data.id;
                        });
                    }
                    if (res.errcode == 0) {
                        countdown(getEl("#getCode"));
                        activeId = res.data.activeId;
                    }
                });
            });

            // 设置开售提醒发送短信按钮
            getEl("#getCode_sale").addEventListener('click', function () {
                if (this.attributes.disable) {
                    return false;
                }
                if (!checkMobile(getEl("#inpMobile_sale"))) {
                    errorMobile_sale.put('请输入正确的手机号码');
                    return false;
                }
                if (!checkImgCode(getEl("#inpImgCode_sale"))) {
                    errorImgcode_sale.put('请输入正确的图形验证码');
                    return false;
                }
                ajaxSms("#inpMobile_sale", "#inpImgCode_sale", function(res){
                    if (res.errcode == -11) {
                        errorMbile_sale.put('手机号码为空');
                    }
                    if (res.errcode == -3) {
                        errorImgcode_sale.put('图形验证码错误');
                        checkAjaxImgCode("#inpMobile_sale", function(res){
                            getEl("#imgValCode_sale").src = res.data.img;
                            getEl("#imgBlock_sale").classList.remove("dn");
                            seccodeId = res.data.id;
                        });
                    }
                    if (res.errcode == -12) {
                        errorImgcode_sale.put('图形验证码为空');
                        checkAjaxImgCode("#inpMobile_sale", function(res){
                            getEl("#imgValCode_sale").src = res.data.img;
                            getEl("#imgBlock_sale").classList.remove("dn");
                            seccodeId = res.data.id;
                        });
                    }
                    if (res.errcode == 0) {
                        countdown(getEl("#getCode_sale"));
                        activeId = res.data.activeId;
                    }
                });
            });

            // 马上开宝箱
            getEl('#goOpenBox').addEventListener('click', function () {
                if (!checkMobile(getEl("#inpMobile"))) {
                    errorMobile.put("请输入正确的手机号码");
                    return false;
                }
                if (!checkImgCode(getEl("#inpImgCode"))) {
                    errorImgcode.put('请输入正确的图形验证码');
                    return false;
                }
                if (!checkSMSCode(getEl("#inpSMS"))) {
                    errorGetcode.put('请输入正确的验证码');
                    return false;
                }
                openBox();
            });

            // 开宝箱
            getEl("#inpMobile").addEventListener('blur', function () {
                !checkMobile(getEl("#inpMobile")) ? errorMobile.put('请输入正确的手机号码') : getEl("#errorMobile").style.display = "none";
                //ajaxCheckMobile();
            });

            getEl("#inpImgCode").addEventListener('blur', function () {
                !checkImgCode(getEl("#inpImgCode")) ? errorImgcode.put('请输入正确的图形验证码') : getEl("#errorImgcode").style.display = "none";
            });

            getEl("#inpImgCode").addEventListener('focus', function () {
                getEl("#errorImgcode").style.display = "none";
            });

            getEl("#inpMobile").addEventListener('focus', function () {
                getEl("#errorMobile").style.display = "none";
            });

            getEl("#inpSMS").addEventListener('focus', function () {
                getEl("#errorGetcode").style.display = "none";
            });

            // 开售提醒
            getEl("#inpMobile_sale").addEventListener('blur', function () {
                !checkMobile(getEl("#inpMobile_sale")) ? errorMobile_sale.put('请输入正确的手机号码') : getEl("#errorMobile_sale").style.display = "none";
            });

            getEl("#inpImgCode_sale").addEventListener('blur', function () {
                !checkImgCode(getEl("#inpImgCode_sale")) ? errorImgcode_sale.put('请输入正确的图形验证码') : getEl("#errorImgcode_sale").style.display = "none";
            });

            getEl("#inpImgCode_sale").addEventListener('focus', function () {
                getEl("#errorImgcode_sale").style.display = "none";
            });

            getEl("#inpMobile_sale").addEventListener('focus', function () {
                getEl("#errorMobile_sale").style.display = "none";
            });

            getEl("#inpSMS_sale").addEventListener('focus', function () {
                getEl("#errorGetcode_sale").style.display = "none";
            });

        }
    }
}().init());
