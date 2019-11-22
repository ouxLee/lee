!function($, win, doc){
    var Wheel = function(){
        this.tempoTemplate = {} ;
        this.global = {};
    };
    Wheel.prototype = {
        max_sync_item_num : 10000,  //最大同步商品数
        constructor: Wheel,
        //hover效果
        menuHover: function(){
            $.fn.hoverDelay = function(options) {
                var defaults = {
                    hoverDuring: 100,
                    outDuring: 100,
                    hoverEvent: $.noop,
                    outEvent: $.noop
                };
                var sets = $.extend(defaults, options || {});
                return $(this).each(function() {
                    var hoverTimer, outTimer;
                    var that = this;
                    $(this).hover(function() {
                        clearTimeout(outTimer);
                        hoverTimer = setTimeout(function(){ sets.hoverEvent.apply(that); }, sets.hoverDuring);
                    }, function() {
                        clearTimeout(hoverTimer);
                        outTimer = setTimeout(function(){ sets.outEvent.apply(that); }, sets.outDuring);
                    })
                });
            };
            $(".Pull-down").hoverDelay({
                hoverEvent: function() {
                    if($(this).find('.js_no_show_Pull-down').length > 0 && $(this).find('.js_no_show_Pull-down').is(':visible')){
                    }else{
                        $(this).addClass("Pull-down-hover");
                    }
                },
                outEvent: function() {
                    $(this).removeClass("Pull-down-hover");
                }
            });
            return this;
        },

        //顶部错误提示
        showTopNotice: function(msg, bool, custom){
        	var div = $(".btnposin");
        	var timer = null;
        	clearTimeout(timer);
        	div.remove();
        	if(bool == undefined) {
	            $("body").append('<div class="btnposin topbtn center" id="operate_tip"><div class="btnstyle i-block"><i class="i-block j-icon middle m-r-5"></i><span class="i-block middle">'+msg+'</span></div></div>');
        	} else if(bool == "" && msg == "") {
        		$("body").append('<div class="btnposin topbtn center" id="twoCustom_tip"><div class="btnstyle twocolor i-block">'+custom+'</div></div>');
        	} else {
	            $("body").append('<div class="btnposin topbtn center" id="error_tip"><div class="btnstyle btnerror i-block"><i class="berimg i-block j-icon middle m-r-5"></i><span class="i-block middle">'+msg+'</span></div></div>');
        	}
        	$(".btnposin").css({
        		position: 'fixed',
        		top: '50%',
        		left: 0,
        		right: 0,
        		marginTop: -1 * ($(".btnposin").outerHeight() / 2)
        	})
        	timer = setTimeout(function() {
        		$(".btnposin").fadeOut({
        			duration: 2000,
        			easing: "swing"
        		})
        	}, 1500);
        },
        //返回顶部和footer位置
        rightTop: function(){
            var footer = $('.foot');
            var footerheight = footer.outerHeight(true);
            var box = $('.content-box');
            var retop = $('.retop');
            var docs = $(doc).height(), wins = $(win).height();
            var c = docs > wins;

            if((box.offset().top + box.outerHeight(true) + footerheight) > $(window).height()) {
                footer.css({
                    position: 'relative',
                    display: 'block'
                });
            } else {
                footer.css({
                    position: 'absolute',
                    display: 'block'
                });
            }

            retop.click(function(){
                $('html, body').stop().animate({
                    scrollTop: 0
                }, 200);
            });

            $(window).scroll(function(){
                $(this).scrollTop() > 100 ?  retop.stop().fadeIn(200) : retop.stop().fadeOut(200);
            });
            return this;
        },
        //切换透明度
        ckSlide: function(opts){
            var defaults = {
                clas: '',
                autoPlay: false,
                dir: null,
                isAnimate: false
            };
            var opts = $.extend({}, defaults, opts || {});
            if($(opts.clas).find('.ck-slide-wrapper').children('li').length == 1) {
                $('.ctrl-slide').hide();
                return;
            }
            $(opts.clas).each(function(){
                var that = $(this);
                var slidewrap = that.find('.ck-slide-wrapper');
                var slide = slidewrap.find('li');
                var slidebox = $('.ck-slidebox ul');
                var count = slide.length;
                var next = that.find('.ck-next');
                var prev = that.find('.ck-prev');
                var index = 0;
                var time = null;
                var li = '';
                that.data('opts', opts);

                slide.css({
                    'opacity': 0,
                    'display': 'none'
                }).eq(0).css({
                    'opacity': 1,
                    'display': 'block'
                });
                if(slide <=1) {
                    next.add(prev).css({
                        'display': 'none'
                    });
                    return;
                }
                for(var i = 0; i < count; i++) {
                    li+= "<li><em>'" + i + "'</em></li>"
                }
                slidebox.append(li);
                slidebox.find('li').eq(0).addClass('current');

                next.on('click', function(){
                    if(opts['isAnimate'] == true) {
                        return;
                    }

                    var old = index;
                    if(index >= count - 1) {
                        index = 0;
                    } else {
                        index++;
                    }
                    change.call(that, index, old);
                });

                prev.on('click', function(){
                    if(opts['isAnimate'] == true){
                        return;
                    }

                    var old = index;
                    if(index <= 0){
                        index = count - 1;
                    }else{
                        index--;
                    }
                    change.call(that, index, old);
                });

                that.find('.ck-slidebox li').each(function(cindex){
                    $(this).on('click.slidebox', function(){
                        change.call(that, cindex, index);
                        index = cindex;
                    });
                });

                that.on('mouseover', function(){
                    if(opts.autoPlay) {
                        clearInterval(time);
                    }
                });

                that.on('mouseleave', function(){
                    if(opts.autoPlay) {
                        startAtuoPlay();
                    }
                });

                startAtuoPlay();
                function startAtuoPlay(){
                    if(opts.autoPlay){
                        time = setInterval(function(){
                            var old = index;
                            if(index >= count - 1){
                                index = 0;
                            } else {
                                index++;
                            }
                            change.call(that, index, old);
                        }, 4000);
                    }
                }

                var box = $(this).find('.ck-slidebox');
                box.css({
                    'margin-left':-(box.width() / 2)
                });

                switch(opts.dir){
                    case "x":
                        opts['width'] = slide.outerWidth(true);
                        slidewrap.css({
                            'width':count * opts['width']
                        });
                        slide.css({
                            'float':'left',
                            'position':'relative'
                        });
                        slidewrap.wrap('<div class="ck-slide-dir"></div>');
                        slide.show();
                        break;
                }
            });

            function change(show, hide) {
                var that = $(this);
                var opts = that.data('opts');
                var wrap = that.find('.ck-slide-wrapper li');
                var li = that.find('.ck-slidebox li');
                if(opts.dir == 'x') {
                    var x = show * opts['width'];
                    $(this).find('.ck-slide-wrapper').stop().animate({'margin-left':-x}, function(){opts['isAnimate'] = false;});
                    opts['isAnimate'] = true;
                } else {
                    wrap.eq(hide).stop().animate({opacity: 0}, function(){ $(this).hide(); });
                    wrap.eq(show).show().css({opacity: 0}).stop().animate({opacity: 1});
                }

                li.removeClass('current');
                li.eq(show).addClass('current');
            }
        },
        //无缝滚动
        cxScroll: function(settings){
            if(!settings.clas.length){return};
            // 默认值
            var defaults = {
                clas: '',
                direction:"right",  // 滚动方向
                easing:"swing",     // 缓动方式
                step:3,             // 滚动步长
                accel:160,          // 手动滚动速度
                speed:800,          // 自动滚动速度
                time:4000,          // 自动滚动间隔时间
                auto:true,          // 是否自动滚动
                prevBtn:true,       // 是否使用 prev 按钮
                nextBtn:true,       // 是否使用 next 按钮
                safeLock:true       // 滚动时是否锁定控制按钮
            };
            settings=$.extend({},defaults,settings);

            var obj= $(settings.clas);
            var scroller={
                lock:false,
                dom:{}
            };

            scroller.init=function(){
                scroller.dom.box=obj.find(".box");
                scroller.dom.list=scroller.dom.box.find(".list");
                scroller.dom.items=scroller.dom.list.find("li");
                scroller.itemSum=scroller.dom.items.length;

                // 没有元素或只有1个元素时，不进行滚动
                if(scroller.itemSum<=1){return};
                scroller.dom.prevBtn=obj.find(".prev");
                scroller.dom.nextBtn=obj.find(".next");
                scroller.itemWidth=scroller.dom.items.outerWidth();
                scroller.itemHeight=scroller.dom.items.outerHeight();


                if(settings.direction=="left"||settings.direction=="right"){
                    // 容器宽度不足时，不进行滚动
                    if(scroller.itemWidth*scroller.itemSum<=scroller.dom.box.outerWidth()){return};

                    scroller.prevVal="left";
                    scroller.nextVal="right";
                    scroller.moveVal=scroller.itemWidth;
                }else{
                    // 容器高度不足时，不进行滚动
                    if(scroller.itemHeight*scroller.itemSum<=scroller.dom.box.outerHeight()){return};

                    scroller.prevVal="top";
                    scroller.nextVal="bottom";
                    scroller.moveVal=scroller.itemHeight;
                };

                // 元素：后补
                scroller.dom.list.append(scroller.dom.list.html());

                // 添加元素：手动操作按钮
                if(settings.prevBtn&&!scroller.dom.prevBtn.length){
                    scroller.dom.prevBtn=$("<a></a>",{"class":"prev"}).prependTo(obj);
                };
                if(settings.nextBtn&&!scroller.dom.nextBtn.length){
                    scroller.dom.nextBtn=$("<a></a>",{"class":"next"}).prependTo(obj);
                };

                // 事件：鼠标移入停止，移出开始
                if(settings.auto){
                    obj.hover(function(){
                        settings.auto=false;
                        scroller.lock=false;
                        scroller.off();
                    },function(){
                        settings.auto=true;
                        scroller.lock=false;
                        scroller.on();
                    });
                };

                scroller.bindEvents();
                scroller.on();
            };

            scroller.bindEvents=function(){
                if(settings.nextBtn&&scroller.dom.prevBtn.length){
                    scroller.dom.nextBtn.bind("click",function(){
                        if(!scroller.lock){
                            scroller.goto(scroller.nextVal,settings.accel);
                        };
                    });
                };
                if(settings.prevBtn&&scroller.dom.prevBtn.length){
                    scroller.dom.prevBtn.bind("click",function(){
                        if(!scroller.lock){
                            scroller.goto(scroller.prevVal,settings.accel);
                        };
                    });
                };
            };

            // 方法：开始
            scroller.on=function(){
                if(!settings.auto){return};
                if(typeof(scroller.run)!=="undefined"){
                    clearTimeout(scroller.run);
                };

                scroller.run=setTimeout(function(){
                    scroller.goto(settings.direction);
                },settings.time);
            };

            // 方法：停止
            scroller.off=function(){
                scroller.dom.box.stop(true);
                if(typeof(scroller.run)!=="undefined"){
                    clearTimeout(scroller.run);
                };
            };

            // 方法：滚动
            scroller.goto=function(d,t){
                scroller.off();
                if(settings.controlLock){
                    scroller.lock=true;
                };

                var _max;   // _max 滚动的最大限度
                var _dis;   // _dis 滚动的距离
                var _speed=t||settings.speed;

                switch(d){
                    case "left":
                    case "top":
                        _max=0;
                        if(d=="left"){
                            if(parseInt(scroller.dom.box.scrollLeft(),10)==0){
                                scroller.dom.box.scrollLeft(scroller.itemSum*scroller.moveVal);
                            };
                            _dis=scroller.dom.box.scrollLeft()-(scroller.moveVal*settings.step);
                            if(_dis%scroller.itemWidth>0){
                                _dis-=(_dis%scroller.itemWidth)-scroller.itemWidth;
                            };
                            if(_dis<_max){_dis=_max};
                            scroller.dom.box.animate({"scrollLeft":_dis},_speed,settings.easing,function(){
                                if(parseInt(scroller.dom.box.scrollLeft(),10)<=_max){
                                    scroller.dom.box.scrollLeft(0);
                                };
                            });
                        }else{
                            if(parseInt(scroller.dom.box.scrollTop(),10)==0){
                                scroller.dom.box.scrollTop(scroller.itemSum*scroller.moveVal);
                            };
                            _dis=scroller.dom.box.scrollTop()-(scroller.moveVal*settings.step);
                            if(_dis%scroller.itemHeight>0){
                                _dis-=(_dis%scroller.itemHeight)-scroller.itemHeight;
                            };
                            if(_dis<_max){_dis=_max};
                            scroller.dom.box.animate({"scrollTop":_dis},_speed,settings.easing,function(){
                                if(parseInt(scroller.dom.box.scrollTop(),10)<=_max){
                                    scroller.dom.box.scrollTop(0);
                                };
                            });
                        };
                        break;

                    case "right":
                    case "bottom":
                        _max=scroller.itemSum*scroller.moveVal;
                        if(d=="right"){
                            _dis=scroller.dom.box.scrollLeft()+(scroller.moveVal*settings.step);
                            if(_dis%scroller.itemWidth>0){
                                _dis-=(_dis%scroller.itemWidth);
                            };
                            if(_dis>_max){_dis=_max};
                            scroller.dom.box.animate({"scrollLeft":_dis},_speed,settings.easing,function(){
                                if(parseInt(scroller.dom.box.scrollLeft(),10)>=_max){
                                    scroller.dom.box.scrollLeft(0);
                                };
                            });
                        }else{
                            _dis=scroller.dom.box.scrollTop()+(scroller.moveVal*settings.step);
                            if(_dis%scroller.itemHeight>0){
                                _dis-=(_dis%scroller.itemHeight);
                            };
                            if(_dis>_max){_dis=_max};
                            scroller.dom.box.animate({"scrollTop":_dis},_speed,settings.easing,function(){
                                if(parseInt(scroller.dom.box.scrollTop(),10)>=_max){
                                    scroller.dom.box.scrollTop(0);
                                };
                            });
                        };
                        break;

                    // not default
                };

                scroller.dom.box.queue(function(){
                    if(settings.controlLock){
                        scroller.lock=false;
                    };
                    scroller.on();
                    $(this).dequeue();
                });
            };

            scroller.init();
        },
        navHover: function(){
            var navTab    = $('.nav-tab-hover'),
                navLi     = navTab.children('li'),
                rightDiv  = $('.moveTo'),
                leftWidth = 0,
                thereis = function(index) {
                    if(navLi.eq(index).hasClass('hoveractive')) {
                        var you = navLi.eq(index);
                        var num = 0;
                        var prev = you.prevAll();

                        if(index == 0) {
                            prev = you;
                            leftWidth = 0;
                        } else {
                            $.each(prev, function(){
                                leftWidth += $(this).outerWidth(true);
                            });
                        }
                        rightDiv.css({
                            'width' : you.outerWidth(true),
                            'left' : leftWidth
                        });
                        return;
                    }
                };
            navLi.each(function(index) {
                thereis.apply(this, [index]);
            });
            navLi.click(function() {
                $(this).addClass('hoveractive').siblings().removeClass();
            });
            navTab.delegate('li', 'mouseenter', function() {
                var indexs = $(this).prevAll().length,
                    iWidth = (function() {
                        var width = 0;
                        for(var i = 0; i < indexs; i++) {
                            width += navLi.eq(i).outerWidth(true);
                        }
                        return width;
                    })();
                $('.moveTo').css({
                    'width' : $(this).outerWidth(true)
                });
                rightDiv.stop().animate({
                    left: iWidth
                }, 140);
            });
            navTab.bind('mouseleave', function() {
                var you = 0;
                var widths = 0;
                (function() {
                    navLi.each(function(indexs) {
                        if(navLi.eq(indexs).hasClass("hoveractive")) {
                            you = navLi.eq(indexs).outerWidth(true);
                            for(var i = 0; i < indexs; i++) {
                                widths += navLi.eq(i).outerWidth(true);
                            }
                        }
                    })
                })();
                rightDiv.stop().animate({
                    'left': widths + 'px'
                }, 140, function() {
                    navLi.each(function(index) {
                        rightDiv.css({
                            'left': widths + 'px',
                            'width': you + 'px'
                        });
                    })
                });
            });
        },
        //ajax请求
        ajax: function(url, params, callback, transferMode, variables, asyn) {
            if(zt.no_ajax == 'true'){
                return false;
            }
            transferMode = typeof(transferMode) === "string" && transferMode.toUpperCase() === "GET" ? "GET": "POST";
            asyn = asyn === false ? false: true;

            var run = function() {
                $.ajax({
                    type: transferMode,
                    url: url,
                    data: params,
                    contentType: "application/x-www-form-urlencoded; charset=utf-8",
                    async: asyn,
                    error: function(a, b, c) {
                        var obj = new Object();
                        obj.status = 999;
                        callback.call(self, obj, variables);
                    },
                    success: function(data) {
                        try {
                            var obj = jQuery.parseJSON(data);
                        } catch(err) {
                            alert("返回数据异常，请尝试按（CTRL+F5）强制刷新页面或清空浏览器缓存后再试\n强烈建议使用IE8或以上、FIREFOX、CHROME浏览器\n\n如果问题仍然无法解决，请与客服联系");
                            var obj = new Object();
                            obj.status = 999;
                            $.ajax({
                                type: "POST",
                                url: "misc.php?action=log_ajax_error",

                                data: "url=" + url + "&data=" + (data)
                            });
                        }
                        if (typeof(callback) === "function") {
                            if(zt.no_ajax == 'true'){
                                return false;
                            }
                            if (obj.status == 0 || obj.status == 'LOGIN_TIMEOUT') { //未登录
                                zt.no_ajax = 'true';
                                alert(obj.msg);
                                window.location = "http://container.api.taobao.com/container?appkey=12200271";
                                return;
                            } else if (obj.status == -1 || obj.status == 'REFRESH') { //刷新页面
                                zt.no_ajax = 'true';
                                alert(obj.msg);
                                window.location.reload(true);
                                return;
                            } else if (obj.status == 'UPGRADE_FIRST') { //版本太低
                                zt.dialogUpgrade(1); // 请升级
                            } else if( obj.status == 'AUTH_TIMEOUT'){//短授权
                                window.shortAuthCallback = function(){
                                    zt.ajax(url, params, callback, transferMode, variables, asyn);
                                };
                                window.close_hra_notice = function(){};
                                zt.showHraNotice();
                                callback.call(self, obj,variables);
                                return ;
                            } else if (obj.status == 'TYPE_ERROR') {
                                zt.alert(obj.msg,'',function(){window.location="/"});
                                return;
                            }
                            callback.call(self, obj, variables);
                        }
                    },
                    
                    error: function (data) {
//                            console.log(data);
                            if (data.readyState != 0) {
                                alert("返回数据异常，请尝试按（CTRL+F5）强制刷新页面或清空浏览器缓存后再试\n强烈建议使用IE8或以上、FIREFOX、CHROME浏览器\n\n如果问题仍然无法解决，请与客服联系");
                                $.ajax({
                                    type: "POST",
                                    url: "misc.php?action=log_ajax_error",

                                    data: "url=" + url + "&data=" + (JSON.stringify(data))
                                });
                           }
                    }
                });
            };
            run();
        },
        collectionpage: function(){
            var url = 'http://promotion.dzsofts.net/home';
            var title = '促销专家';
            $('.colle_sc').click(function(){
                try {
                    window.external.addFavorite(url, title);
                }
                catch (e) {
                    try {
                        window.sidebar.addPanel(title, url, "");
                    }
                    catch (e) {
                        swal({
	                        type: "warning",
	                        title: '',
	                        text: '抱歉，您所使用的浏览器无法完成此操作。\n加入收藏失败，请使用Ctrl+D进行添加',
	                        allowEscapeKey : false,
	                        html: true,
	                        confirmButtonText: "好"
	                    },function(){
	                        
	                    });
                    }
                }
            });
        },
        showHraNotice: function() {//短授权提示
        	//iframe模式
        	//$.frame({ href: "http://container.api.taobao.com/container?appkey=12200271&scope=promotion&state=short" ,width:"750px",height:"400px",title:"请短授权后再操作"});
        	
			$('hra-notice').remove();
        	//新窗口模式
            var html = '<div class="hra-notice modal" role="dialog" aria-hidden="true" data-backdrop="static">' +
                '<div class="modal-dialog modal-sm">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                '<h4 class="modal-title">提示</h4>' +
                '</div>' +
                '<div class="modal-body">'+
                '<div id="dialog-hra-notice" title="短授权提示" style="overflow:hidden;"><div class="save_notice_rs center">请点击授权按钮打开小窗进行授权</div></div>' +
                '</div>' +
                '<div class="modal-footer center">' +
                '<button type="button" class="btn btn-default notice-btn ">去淘宝授权</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
            if($("#dialog-hra-notice").attr("id") == undefined) {
                $("body").append(html);
            }
				var notice = $('.hra-notice');
				notice.modal('show');
				/*var btn = notice.find('.notice-btn');
				$(btn).removeAttr()*/
				notice.find('.notice-btn').off('click');
				notice.find('.notice-btn').one('click', function(){

				var iWidth=760;                          //弹出窗口的宽度; 
				var iHeight=500;                         //弹出窗口的高度; 
				//获得窗口的垂直位置 
				var iTop = (window.screen.availHeight - 30 - iHeight) / 2; 
				//获得窗口的水平位置 
				var iLeft = (window.screen.availWidth - 10 - iWidth) / 2; 
                window.open("http://container.api.taobao.com/container?appkey=12200271&scope=promotion&state=short","_blank","toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=no, copyhistory=no, width="+iWidth+", height="+iHeight+", top="+iTop+", left="+iLeft);
                notice.modal('hide');
            });
        },

        //加载广告位
        loadAdv:function() {
            zt.ajax("/home/ajax_load_notice","",function(data){
                if('OK' == data.status){
                    var url = '/misc/activityNotice?aplication=promotion&activity_notice='+data.adv+'&nick='+data.taobao_nick+'&version_no='+data.version_no+'&day='+data.invalidated_day;
                    zt.loadJS(url, function(){
                        $('.focusmap').find('.hide-box').addClass('show').end().find('.List_loading').remove();
                        zt.ckSlide({
                            clas: '.focusmap',
                            autoPlay: true
                        }); //首页幻灯片
                        if($("#customer_rotation").children().length < 1){
                            $("#customer_rotation").css({'height': 0});
                        }else{
                            $('#user_sms_pic').removeClass('hide');
                        }
                        if ($('#sms_1212').children().length < 1) {
                                $('#sms_1212').css({'height':0});
                        } else {
                                $('#sms_1212').parents("#user_sms_pic").removeClass('hide');
                        }
                        if($("#dialog_pic").children().length > 0){
                            $(".js_dialog_pic").html($("#dialog_pic").html());
                        }

                        var url = window.location;
                        var pathname = url.pathname;
                        pathname = pathname.replace(/\/html\//,'');
                        var c = /^index.htm[l]/.test(pathname);
                        if(!c){ //如果不是首页
                            $(".dialog_advert").parent(".dialogParent").remove();
                            $(".zt-modal").remove();
                        }
                    });
                }
            });
        },


        dialogUpgrade:function(upgrade, title, msg) {

            $('#renew-box').modal('hide');
            if($('#xufei').data('show') == 'true'){
                if(upgrade){
                    $('#shengji').modal('show');
                }else{
                    $('#xufei').modal('show');
                }
                return false;
            }
            zt.loadAdv();
            zt.ajax("/misc/ajax_load_upgrade","",function(data){
                if('OK' == data.status){
                    if(!$('#xufei').data('show')){
                        var template = Tempo.prepare('buy_advanced');
                        template.render(data.msg.advanced);
                        //                  template.into('buy_vip').render(data.msg.vip);
                        Tempo.prepare('buy_vip').render(data.msg.vip);
                        Tempo.prepare('buy_vip_up').render(data.msg.vip);

                        if(data.msg.meal){
                            Tempo.prepare('buy_meal').render(data.msg.meal);
                            Tempo.prepare('buy_meal2').render(data.msg.meal);
                            $("#buy_meal,#buy_meal2").removeClass('hide');
                        }
                    }

                    var html =  data.msg.version_no >3 ? '继续享受<span class="color10">至尊版</span>带给您的尊贵服务' :'或许，至尊版才是您的归属。';
                    if(data.msg.version_no >3){
                        $(".js_version_box").hide();
                        $('#hide_vip_detail').hide();
                    }
                    $("#buy_version_tip").html(html);
                    if( title!=undefined){
                        $("#shengji .modal-title").html( title);
                        $("#xufei .modal-title").html( title);
                    }
                    if( msg!=undefined){
                        $("#shengji .JS_modal_msg").html( msg);
                        $("#xufei .JS_modal_msg").html( msg);
                    }

                    if(upgrade){
                        $('#shengji').modal('show');
                    }else{
                        $('#xufei').modal('show');
                    }
                    $('#xufei').data('show','true');
                }
            });
        },


        pageChange:function(obj,callback){
            //数据分页
            $(obj+' .js_page').delegate( 'li', 'click', function(){
                var page = $(this).find('a').text();
                if( page=='上一页') page = Number($(this).parents(obj).find('.active a').html())-1;
                else if( page=='下一页') page = Number($(this).parents(obj).find('.active a').html())+1;
                else if ( page == '首页') page = 1;
                else if ( page == '末页') page = Number($(this).find('a').attr('data-totalpages'));
                if( !$(this).hasClass('disabled') && !$(this).hasClass('active')) callback.call(self, page);
            });
        },


        loadMessage:function(page){
            zt.ajax('/message/all_message',{'pagenum':page, 'new':1},function(data){
                $("#message_box .js_num").hide();
                if(data.pager.total>0){

                    if(zt.tempoTemplate.message == undefined){
                        zt.tempoTemplate.message = Tempo.prepare('message_wrap',{'escape' : false});
                    }
                    zt.tempoTemplate.message.render(data.msg);

                    $("#xiaoxi .js_page").html(data.pager.pagenav).removeClass('hide');
                    $("#xiaoxi .js_no_message").hide();
                    $("#message_wrap").removeClass('hide').show();
                }else{
                    $("#message_wrap").hide();
                }
                $('#xiaoxi').find('.modal-dialog').css({
                    marginTop: $('#xiaoxi').find('.modal-dialog').outerHeight() / 2 * -1
                })
            });
            $('#xiaoxi').modal('show');
        },


        loadProductLog:function(page){
            zt.ajax('/common/ajax_product_log',{'pagenum':page},function(data){
                if(data.pager.total>0){
                    if(zt.tempoTemplate.product_log == undefined){
                        zt.tempoTemplate.product_log = Tempo.prepare('product_log_box',{'escape' : false} );
                    }
                    zt.tempoTemplate.product_log.render(data.msg);
                    $("#product_log_box .js_page").html(data.pager.pagenav).removeClass('hide');
                }
            });
            $('#productupdate').modal('show');
        },

        activitySearch:function(id){
            if(!id){
                var id= $.trim($("#activity_search_val").val());
            }
            if(id == ''){
                return;
            }
            zt.ajax('/home/query',{'id':id},function(data){
                if('OK' == data.status){
                    if(zt.tempoTemplate.activity_search == undefined){
                        zt.tempoTemplate.activity_search = Tempo.prepare('activity-search-box');
                        $( "#activity-search-box" ).on( "click", ".js_del",function() {
                            zt.removeActivityItem( this ,  $(this).data('num_iid')  );
                        });
                    }
                    zt.tempoTemplate.activity_search.render(data.msg);
                    $("#activity-search-dialog .js_no_message").addClass('hide');
                    $("#activity-search-box").removeClass('hide');
                }else{
                    $("#activity-search-dialog .js_no_message").removeClass('hide');
                    $("#activity-search-box").addClass('hide');
                }
                $('#activity-search-dialog').find('.modal-dialog').css({
                	marginTop: -1 * $('#activity-search-dialog').find('.modal-dialog').outerHeight() / 2
                })
            });
        },

        //执行删除活动宝贝
        queryRemoveActivityItem:function(type, act_id, num_iid, callback , vars)
        {
            if(type == 'promotion'){
                zt.ajax("promotions.php?action=ajax_remove_item", {'num_iid':num_iid, 'promotion_id':act_id}, callback, "POST", vars );
            }else if(type == 'batch_promotion'){
                zt.ajax('batch_promotions.php?action=ajax_remove_item', {'num_iid':num_iid, 'batch_promotion_id':act_id}, callback, "POST", vars );
            }else if(type == 'limit_discount'){
                zt.ajax('/limit_discount/ajax_remove_item', {'num_iid':num_iid, 'act_id':act_id}, callback, "POST", vars );
            }else if(type == 'mjs'){
                var id = Array();id.push(num_iid);
                zt.ajax('/mjs/ajax_remove_item', {'id[]':id, 'act_id':act_id}, callback, "POST", vars );
            } else if (type == 'batch_discount') {
                zt.ajax("batch_discount.php?action=ajax_remove_item",{"act_id":act_id,"num_iid":num_iid},callback,"POST",vars);
            }
        },


        //删除活动中的宝贝
        removeActivityItem:function(obj, num_iid)
        {
            var html = '<span class="_loading"><img src="'+zt.global.cdn+'/images/ajax-loader.gif" style="height: 16px; width: 16px;">正在处理...</span>';
            $(obj).siblings('._loading').remove();
            $(obj).siblings().hide();
            $(obj).after(html).hide();

            var type = $(obj).data('type');
            var act_id = $(obj).data('id');
            zt.queryRemoveActivityItem(type, act_id, num_iid, zt.callbackRemoveActivityItem , {"obj":obj,"id":num_iid});
        },


        //删除活动中的宝贝
        removeActivityItem1:function(obj, num_iid)
        {
            var html = '<span class="_loading"><img src="'+zt.global.cdn+'/images/ajax-loader.gif" style="height: 16px; width: 16px;">正在处理...</span>';
            $(obj).siblings('._loading').remove();
            $(obj).siblings().hide();
            $(obj).after(html).hide();

            var type = $(obj).data('type');
            var act_id = $(obj).data('id');



            if(type == '促销活动'){
                zt.ajax("promotions.php?action=ajax_remove_item", {'num_iid':num_iid, 'promotion_id':act_id}, zt.callbackRemoveActivityItem, "POST", {"obj":obj,"id":num_iid});
            }else if(type == '多买多优惠'){
                zt.ajax('batch_discount.php?action=ajax_remove_item', {'num_iid':num_iid, 'act_id':act_id}, zt.callbackRemoveActivityItem, "POST", {"obj":obj,"id":num_iid});
            }else if(type == '阶梯促销'){
                zt.ajax('batch_promotions.php?action=ajax_remove_item', {'num_iid':num_iid, 'batch_promotion_id':act_id}, zt.callbackRemoveActivityItem, "POST", {"obj":obj,"id":num_iid});
            }else if(type == '限时打折'){
                zt.ajax('/limit_discount/ajax_remove_item', {'num_iid':num_iid, 'act_id':act_id}, zt.callbackRemoveActivityItem, "POST", {"obj":obj,"id":num_iid});
            }else if(type == '满就送'){
                var id = Array();id.push(num_iid);
                zt.ajax('man.php?action=ajax_remove_item', {'id[]':id, 'act_id':act_id}, zt.callbackRemoveActivityItem, "POST", {"obj":obj,"id":num_iid});
            }
        },
        //删除活动中的宝贝回调
        callbackRemoveActivityItem:function(data, vars){
            $(vars.obj).siblings('._loading').remove();
            if(1 == data.status || 'OK' == data.status){
                var tr  = $(vars.obj).closest('tr');
                $(tr).fadeOut('slow',function(){
                    $(tr).remove();
                    if($("#activity-search-box tr").size() == 1){
                        zt.activitySearch(vars.id);
                    }
                });

            }else {
                $(vars.obj).siblings().show();
                $(vars.obj).show();
                if(data.status == 0 || data.status == 'FAIL'){
                    if(data.error){
                        alert(data.error);
                    }else{
                        alert(data.msg);
                    }
                }
            }
        },
        loadJS:function(url, success) {//加载js
            var domScript = document.createElement('script');
            domScript.src = url;
            success = success || function(){};
            domScript.onload = domScript.onreadystatechange = function() {
                if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
                    this.onload = this.onreadystatechange = null;
                    this.parentNode.removeChild(this);
                    success();
                }
            };
            document.getElementsByTagName('head')[0].appendChild(domScript);
        },

        pageInit:function(){//页面初始化
            //用户信息
            zt.ajax("/common/ajax_load_header_info","",function(data){
                if('OK' == data.status){
                        Tempo.prepare("header_info").when(TempoEvent.Types.RENDER_COMPLETE, function(event){
                            $("#header_info").removeClass('hide');
                        }).render(data.msg);
                        Tempo.prepare("user_info").render(data.msg);
                        zt.global  = data.global;
                        var timestamp = Date.parse(new Date());
                        zt.global.timeDifference = parseInt(timestamp) - parseInt(zt.global.standardTime);
                        zt.global.user = {taobao_nick:data.msg.taobao_nick};
                        if (data.msg.type != 'B') {
                            $(".mobile_template").remove();
                        } else {
                            $(".mobile_template").show();
                            $("#m_batch_update_sell_point").attr('href', '/html/batch_update/sell_point.html#type=b');
                        }
                        zt.version_no = data.msg.version_no;
                        zt.type = data.msg.type;
                        var newsnum = $(".header .js_num");
                        if(newsnum.text() > 99) {
                                newsnum.text("99+");
                        }
                        
                        if (data.msg.is_qianniu == 1) {
                                $("#m_batch_print, #m_bak").hide();
                        }
                    zt.menuHover();
                }
            });
            //扩展公用信息
            zt.ajax('/common/getExtendInfo', "", function(data){
            	if( 'OK'==data.status){
                    if(data.info.is_show_forbide===1){
                        $('#m_forbid_buying').show();
                    }
            	}
            });
            //更多日志
            $(".product_more").click(function(){
                zt.loadProductLog();
                zt.pageChange("#product_log_box"  ,zt.loadProductLog);
            });
            //查看新闻
            $( "body" ).on( "click",  "#message_box",function() {
                zt.loadMessage(1);
                zt.pageChange("#xiaoxi", zt.loadMessage);
            });
            //升级续费
            $( "body" ).on( "click",  ".js_upgrade_btn",function() {
                zt.dialogUpgrade(1);
                return false;
            });
            $( "body" ).on( "click",  "#js_upgrade_btn, .js_xf_btn",function() {
                zt.dialogUpgrade();
                return false;
            });
            $("#xufei .js_version a").click(function(){
                $(this).addClass('active').siblings().removeClass("active");
                if( $(this).data("id") == 'vip'){
                    $("#buy_vip").removeClass('hide');
                    $("#buy_advanced").addClass('hide');
                }else{
                    $("#buy_advanced").removeClass('hide');
                    $("#buy_vip").addClass('hide');
                }
            });

            $("#xufei .js_buy_url").delegate( 'a', 'click', function(){
                $('#xufei').modal('hide');
            });
            $("#shengji .js_buy_url").delegate( 'a', 'click', function(){
                $('#shengji').modal('hide');
            });
            //活动查询
            $("#activity_search_btn").click(function(){
                zt.activitySearch();
            });
            //活动查询
            $("#activity-search-btn").click(function(){
                $('#activity-search-dialog').modal('show');
            });

            $('#activity-search-dialog').on('show.bs.modal', function (e) {
                $("#activity_search_val").val('');
                $("#activity-search-box").addClass('hide');
            });
        },
        showTab:function(id){
            $("#header_tab a").each(function(){
                ( $(this).data("id") == id) ?  $(this).addClass("active") : '';
            });
        },
        //type 类型,title标题, text内容, fun回调
        popup:function(type ,title, text, fun, fun2, ok_button, qx_button, close){
            if( type==undefined) type=1;
            if( text==undefined) text='';
            if( ok_button==undefined || ok_button=='') ok_button='确定';
            if( qx_button==undefined || qx_button=='') qx_button='取消';
            if( close==undefined) close=true;
            switch( type){
                case 1://成功提示
                    swal({
                        type: "success",
                        title: title,
                        text: text,
                        allowEscapeKey : false,
                        html: true,
                        confirmButtonText: "好"
                    },function(){
                        if (typeof(fun) === "function") { fun();
                        }
                    });
                    break;
                case 2://失败提示
                    swal({
                        type: "error",
                        title: title,
                        text: text,
                        allowEscapeKey : false,
                        html: true,
                        type: "warning",
                        confirmButtonText: "好"
                    },function(){
                        if (typeof(fun) === "function") { fun(); }
                    });
                    break;
                case 3://疑问提示(全屏)
                    swal({
                        type: "warning",
                        title: title,
                        text: text,
                        html: true,
                        showCancelButton: true,
                        cancelButtonText: qx_button,
                        confirmButtonText: ok_button,
                        closeOnConfirm: close
                    },function(isConfirm){
                        if (isConfirm){
                            fun();
                        }else{
                            if (typeof(fun2) === "function") { fun2(); }
                        }
                    });
                    break;
            }
        },

        bigLoading:function(msg,hide){
            if(hide){
                $('#ingtishi').modal('hide');
                return false;
            }
            var text = msg || '正在加载...';
            $('#ingtishi .loadingAlltext').html(text);
            $('#ingtishi').modal({ keyboard:false });
        },

        listLoading:function(obj,msg){//列表页loading
            var text = msg || '正在加载...';
            zt.global.cdn = zt.global.cdn || cdn;
            var html = '<div class="discount_loading center"><i class="loading_img"></i><span class="i-block middle m-l-5 font_24">'+text+'</span></div>';
            obj.html(html);
        },

        noneList:function(obj,msg){
            var text = msg || '抱歉，未找到相匹配的宝贝！';
            var html = '<div class="no_tip center" id="status_empty"><i class="warning_icon"></i><span class="middle">'+text+'</span></div>';
            obj.html(html);
        },

        //获取店铺最低折扣
        getLowDiscount : function(is_reload,node){
            $("#header_discount,#header_discount_text").html('同步中..');
            $(node) && $(node).hide();
            zt.ajax("/misc/index", {
                is_reload: is_reload
            },function(data){
                $("#header_discount,#header_discount_text").html('未同步');
                $(node) && $(node).show();
                if (data.status == 1) {
                    $("#header_discount").attr("value", data.discount_value);
                    $('#mix_discount').val(data.discount_value);
                    $("#header_discount").html(data.discount);
                    $("#header_discount_text").html(data.discount_value);
                    $("#header_discount_text").closest('div').children("a").eq(0).find('.repeat_tips').remove();
                } else if (data.status == 2) { 
                    var html='<span class="repeat_tips m-l-5 repeat_tipae" style="display:inline-block;">!<div class="tooltip top fade in" style="min-width:150px;margin-left:-75px;"><div class="tooltip-arrow"></div><div class="tooltip-inner">'+data.msg+'</div></div></span>';
                    $("#header_discount").attr("value", "0");                   
                    $("#header_discount").attr("value", "0");
                    $("#header_discount,#header_discount_text").html('同步失败，请稍后重试');
                    $("#header_discount_text").closest('div').children("a").eq(0).append(html);

                } else if (data.status == 3) {
                    zt.showHraNotice();
                }
                return false;
            });
            $(document).on("mouseover",".repeat_tipae",function(){
                var that=$(this);
                that.addClass("Pull-down-hover")
            })
            $(document).on("mouseout",".repeat_tipae",function(){
                var that=$(this);
                that.removeClass("Pull-down-hover")
            })
        },

        //同步宝贝
        syncData : function ()
        {
            zt.bigLoading("正在同步...");
            zt.ajax("/taobao_items/ajax_sync_item", '', function(data){
                zt.bigLoading('','hide');
                if(data.status == 'OK'){
                    zt.popup(1,'同步成功');
                }else if(data.status == 'FAIL'){
                    zt.popup(2,"同步失败");
                }
            });
        },

        //错误浮层
        alert : function(text,title, fun)
        {
            if(title == undefined){
                title = '';
            }
            zt.popup(2, title, text, fun);
        },

        /**
         * tips局部错误冒泡浮层
         * @param obj               jq对象
         * @param text              提示内容
         * @param placement         显示内容的位置：left,right,top,bottom，默认top
         * @param is_red            是否显示为红色气泡，默认白色。
         * @param is_auto_cancel    点击外面是否消失提示，默认是消失
         */
        tipsAlert : function( obj, text, placement, is_red, is_auto_cancel)
        {
                if (obj.length < 1) {
                        return false;
                }
            var red_template = '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content color10"></div></div>';
            if( placement==undefined) placement = 'top';
            if( is_auto_cancel==undefined) trigger = 'focus';
            else trigger = 'manual';
            if(obj[0].nodeName=="INPUT") {
                    obj.addClass("error_input");
            }
            if( text!=''){
            	$(obj).attr('data-content', text);
                if( is_red==undefined || is_red==true)  obj.popover({ container: 'body', html: true, placement: placement, template: red_template, trigger: trigger }).popover('show');
                else obj.popover({ container: 'body', html: true, placement: placement, trigger: trigger}).popover('show');
                if( $('#'+obj.attr('aria-describedby')!=undefined)){
                    $('#'+obj.attr('aria-describedby')).find('.popover-content').html( text);
                    $('#'+obj.attr('aria-describedby')).next().find('.popover-content').html( text);
                }
                obj.focusout( function(){obj.popover('destroy');obj.unbind('focusout');});
            }
            else{
            	$(obj).attr('data-content', '');
                obj.popover('destroy');
                obj.removeClass("error_input");
                $("#"+obj.attr("aria-describedby")).remove();
            }
        },

        /**
         * JS获取GET值
         * @param param 变量名，为空是则取所有GET值，类似php的$_GET，使用方法：zt.urlGet('username')
         */
        urlGet:function( param)
        {
            var aQuery = window.location.href.split("?");//取得Get参数
            var aGET = new Array();
            if( aQuery.length > 1)
            {
                var aBuf = aQuery[1].split("&");
                for( var i=0, iLoop = aBuf.length; i<iLoop; i++)
                {
                    var aTmp = aBuf[i].split("=");//分离key与Value
                    if( aTmp[1] && aTmp[1].indexOf('#')>-1){//兼容带#的url，防止url有#取到错值
                        str_tmp = aTmp[1].split("#");
                    	aTmp[1] = str_tmp[0];
                    }
                    aGET[aTmp[0]] = aTmp[1];
                }
            }
            if( param==undefined)
                return aGET;
            else return aGET[param];
        },
        
        /**
         * 活动倒计时功能
         * @param divname			div的id
         * @param starttime			活动开始时间
         * @param endtime			活动结束时间
         * @param nostart_callback	活动未开始回调
         * @param start_callback	活动已开始回调
         * @param end_callback		活动已结束回调
         * @param format			倒计时格式
         */
        countdown: function( jquery_divobj, starttime, endtime, nostart_callback, start_callback, end_callback, format){
        	jquery_divobj.html('loading...');
            clearInterval(zt.countdown_over);
            showtime(starttime, endtime);
            zt.countdown_over = setInterval(function(){
                showtime(starttime, endtime)
            }, 1000);
            function showtime(starttime, endtime){
                var id = jquery_divobj,
                	StartTime = new Date(starttime.replace(/-/g, '/')), //开始时间
                    EndTime = new Date(endtime.replace(/-/g, '/')), //截止时间
                    NowTime = new Date();
                
                var t = NowTime.getTime() - StartTime.getTime();
                if( t>0){
                	var is_start = true;
                	if( start_callback!=undefined) start_callback();
                	t = EndTime.getTime() - NowTime.getTime();
                }else{
                	var is_start = false;
                	if( nostart_callback!=undefined) nostart_callback();
                	t = StartTime.getTime() - NowTime.getTime();
                }
                
                var d = Math.floor(t/1000/60/60/24),
                    h = Math.floor( (t-d*60*60*24*1000)/1000/3600),//Math.floor(t/1000/30/60%24),
                    m = Math.floor(t/1000/60%60),
                    s = Math.floor(t/1000%60);
                if(d < 10) d = '0' + d;
                if(h < 10) h = '0' + h;
                if(m < 10) m = '0' + m;
                if(s < 10) s = '0' + s;
                if(t < 0) {
            		d = h = m = s = 0;
                    clearInterval(zt.countdown_over);
                    if( end_callback!=undefined) end_callback();
                    return;
                }
                if(id && t>=0) {
                	if(format==1) {
                		if(d == 0) {
	                        id.html('<span>' + h + '</span> : ' + '<span>' + m + '</span> : ' + '<span>' + s + '</span>');
	                        return;
	                    }
	                    id.html('<span>' + d + '</span>天 ' + '<span>' + h + '</span>小时 ' + '<span>' + m + '</span>分 ' + '<span>' + s + '</span>秒');
	                } else {
	                    if(d == 0) {
	                        id.html('<span>' + h + '</span>时' + '<span>' + m + '</span>分' + '<span>' + s + '</span>秒');
	                        return;
	                    }
	                    id.html('<span>' + d + '</span>天' + '<span>' + h + '</span>时' + '<span>' + m + '</span>分' + '<span>' + s + '</span>秒');
	                }
                }
                id =NowTime = t =d =h =m =s =null;  
                return;
            }
        },

        success : function( text, title, fun)
        {
            if(title == undefined){
                title = '';
            }
            zt.popup(1, title, text, fun);
        },

        confirm : function(text, title,  fun, fun2, ok_button, qx_button, close)
        {
            if(title == undefined){
                title = '';
            }
            zt.popup(3, title, text, fun, fun2, ok_button, qx_button, close);
        },

        pageTitle : function(title){
            document.title= title+" - 促销专家";
        },

        isSetDiscount: function() {
            zt.confirm('是否已重新设置最低折扣？','',function(){
                zt.getLowDiscount(1);
            });
        },

        last_height : $('.content-box').height(),

        checkHeightDo : function (){
            var current_height = $('.content-box').height();
            var winheight = $(window).height();
            if((current_height!=zt.last_height) || winheight!=zt.winheigh){
                zt.rightTop();
                zt.last_height = current_height;
                zt.winheigh = winheight;
            }
        },

        rowsfixedJs : function (bool) {
            var win = $(window);
            var btmdiv = $('.fixedbtm');
            var btmdiv1 = $('.fixedbtma');
            var current_height = $('.content-box').height();

            btmdiv.removeClass('fixed-rows');
            btmdiv1.removeClass('fixed-rows');
            if( current_height == zt.last_height){
                return;
            }

            var btm_top = btmdiv.offset().top + btmdiv.outerHeight(true);

            var btm_top1 = 0;
            if(btmdiv1.length) {
            	btm_top1 = btmdiv1.offset().top + btmdiv1.outerHeight(true);
            }

            btnfix();
            win.on('scroll resize', btnfix);

            function btnfix() {
                if(btmdiv.length >= 1) {
                    var num = parseInt(win.scrollTop() + win.height());
                    if(btm_top < num) {
                        btmdiv.removeClass('fixed-rows');
                    } else {
                        btmdiv.addClass('fixed-rows');
                    }
                }
                if(btmdiv1.length >= 1) {
                    var num = parseInt(win.scrollTop() + win.height());
                    if(btm_top1 < num) {
                        btmdiv1.removeClass('fixed-rows');
                    } else {
                        btmdiv1.addClass('fixed-rows');
                    }
                }
            }
        },


        //右下角帮助中心tips列表
        helpList : function(topic_id, mao){
            $('#zt_help').hover(function(){

                if(typeof zt.is_tips_lists =='string' && zt.is_tips_lists=='OK'){
                    if($('#help_list').find('dl').length>0){
                        $('#zt_help').addClass('Pull-down-hover');
                    }else{
                        $('#help_list').hide();
                    }
                    return false;
                }

                zt.is_tips_lists = 'OK';

                zt.ajax("/misc/ajax_get_help", {'topic_id':topic_id},function(data){
                    var html_1 = '';
                    var html_2 = '';
                    var html_3 = '';
                    var type_1 = [];
                    var type_2 = [];
                    var type_3 = [];
                    $.each(data.msg,function(i,n){
                        if(n.text_type==1){
                            type_1.push(n);
                        }
                        if(n.text_type==2){
                            type_2.push(n);
                        }
                        if(n.text_type==3){
                            type_3.push(n);
                        }
                    });
                    if(type_1.length>0){
                        html_1 = '<dl><dt>功能介绍</dt>';
                        $.each(type_1,function(i,n){
                            html_1 += '<dd><a href="http://help.dzsofts.net/default.php?id='+n.id+'" target="_blank">'+n.title+'</a></dd>';
                        });
                        html_1 += '</dl>';
                    }
                    if(type_2.length>0){
                        html_2 = '<dl><dt>操作教程</dt>';
                        $.each(type_2,function(i,n){
                            html_2 += '<dd><a href="http://help.dzsofts.net/default.php?id='+n.id+'"  target="_blank">'+n.title+'</a></dd>';
                        });
                        html_2 += '</dl>';
                    }
                    if(type_3.length>0){
                        html_3 = '<dl><dt>常见问题</dt>';
                        $.each(type_3,function(i,n){
                            html_3 += '<dd><a href="http://help.dzsofts.net/default.php?id='+n.id+'"  target="_blank" >'+n.title+'</a></dd>';
                        });
                        html_3 += '</dl>';
                    }

                    if(html_1=='' && html_2=='' && html_3==''){
                        $('#help_list').hide();

                    }else{
                        $('#zt_help').addClass('Pull-down-hover');
                        $('#help_list').show().find('.js_popover_content_help').html(html_1+html_2+html_3);
                    }

                    return false;

                });
            },function(){});
			if (mao != undefined) {
				$('#zt_help').find('.zt_help_link').attr('href','http://help.dzsofts.net/default.php?topic_id='+topic_id+'#'+mao);	
			} else {
				$('#zt_help').find('.zt_help_link').attr('href','http://help.dzsofts.net/default.php?topic_id='+topic_id);
			}
            

        },
        contentsHeight: function(){
            var menuMax = function(){
                var ul = $('#JS_navlist');
                var li = $('#JS_navlist').children('li');
                var max, len, menuHeight = 0;
                var arr = [];

                li.each(function(index){
                    var that = $(this);
                    var size = that.children('.list-item').find('li').length;
                    arr.push(size);
                });

                max = arr[0];
                len = arr.length;
                for(var i = 0; i < len; i++){
                    if(max < arr[i]) max = arr[i];
                }

                if (!Array.prototype.indexOf)
                {
                    Array.prototype.indexOf = function(elt /*, from*/)
                    {
                        var len = this.length >>> 0;
                        var from = Number(arguments[1]) || 0;
                        from = (from < 0)
                            ? Math.ceil(from)
                            : Math.floor(from);
                        if (from < 0)
                            from += len;
                        for (; from < len; from++)
                        {
                            if (from in this &&
                                this[from] === elt)
                                return from;
                        }
                        return -1;
                    };
                }

                return menuHeight = li.eq(arr.indexOf(max)).children('ul').outerHeight(true) + ul.outerHeight(true);
            };

            $(window).resize(function(){
                contentAuto();
            }).trigger('resize');

            function contentAuto(){
                var leftHeight = menuMax();
                var mainHeight = $('.main');
                var win = $(window).height();

                if($('body').height() <= win) {
                    mainHeight.css({
                        minHeight: leftHeight
                    });
                } else {
                    mainHeight.css({
                        minHeight: win - $('.header').outerHeight(true) - $('.foot').outerHeight(true) - parseInt(mainHeight.css('margin-top')) - parseInt($(".content-box").css('margin-bottom'))
                    });
                }
            }
        },

        //静态模块统计使用率
        statModule : function ()  {
            var url = window.location;
            var pathname = url.pathname;
            var search = url.search;
            pathname = pathname.replace(/\/html\//,'');
            var c = /^index.htm[l]/.test(pathname);
            if(c){
                return;
            }
            zt.ajax("/misc/stat_module", {'pathname': pathname, 'search':search}, function () {});
        },

        navText : function(names){
        	$('#nav_span').remove();
        	var href = typeof names[0] == 'object' ? names[0][1] : 'javascript:;';
        	var text = typeof names[0] == 'object' ? names[0][0] : names[0];
        	var html = '<span class="middle i-block m-t-5" id="nav_span" style="color:#666;">';
        	if(names.length == 1){
        		html = '<span class="middle nav_3" style="font-size:16px;color:#333;">'+names[0]+'</span>';
        	}else{
	        	html += '<a href="'+href+'" class="middle nav_1" style="font-size:16px;color:#666;">'+text+'</a><span class="i-block bread-arrow-right m-l-5 m-r-5 middle"></span>';
	        	if(typeof names[2] != 'undefined') {
	        		href = typeof names[1] == 'object' ? names[1][1] : 'javascript:;';
	        		text = typeof names[1] == 'object' ? names[1][0] : names[1];
	        		html += '<a href="'+href+'" class="middle nav_1" style="font-size:16px;color:#666;">'+text+'</a><span class="i-block bread-arrow-right m-l-5 m-r-5 middle"></span>';
	        	}
	        	if(typeof names[2] != 'undefined' || typeof names[1] != 'undefined'){
	        		html += '<span class="middle nav_3" style="font-size:16px;color:#333;">'+(names[2] || names[1])+'</span>';
	        	}
        	}
        	html += '</span>';
        	
        	$('.title_header').prepend(html);
        	$('.title_header_left').hide();
        	$('.nav_1').each(function(){
        		if($(this).attr('href') == 'javascript:;'){
        			$(this).css('cursor','inherit');
        		}
        	});
        	$('.nav_1').hover(function(){
        		if($(this).attr('href') != 'javascript:;'){
        			$(this).css('color','#399bff');
        		}
        	},function(){
        		$(this).css('color','#333');
        	});
        },
        // 验证手机号码
        isPhone: function(val) {
        	var telReg = !!val.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
        	return telReg;
        },
        // 充值短信包
        prepaidText: function() {
        	$(document).on("click", ".JS_chong", function() {
        		$("#arge").modal("show");
        	})
        	zt.ajax("/sms/ajaxGetSmsInfo", {}, function(data) {
        		if(data.status=='OK') {
        			$(".JS_info_sms_num").html( data.info.sms_num);
        			if(zt.setSmsUserInfoTemplate == null){
	                    zt.setSmsUserInfoTemplate = Tempo.prepare('tariff_package_box',{'escape' : false} );
	                }
        			zt.setSmsUserInfoTemplate.render(data.info.tariff_package);
        			if(data.info.activity_sms_title!='') {
	                    $(".JS_activity_sms_title").html(data.info.activity_sms_title);
	                    $(".JS_activity_sms_time").html(data.info.activity_sms_endtime);
	                    $(".JS_activity_tips").removeClass('hide');
	                }else {
	                	$(".JS_activity_tips").addClass('hide');
	                }
	                $(".JS_diypay").insertAfter($('.JS_paylast:last'));
                	zt.diySmsPayPrice();
                    setTimeout(function() {
                        $('#arge').find('.modal-dialog').css({
                            marginTop: $('#arge').find('.modal-dialog').height() / 2 * -1
                        })
                        $("#tariff_package_box").removeClass('hide').find('tbody').children('tr').eq(0).find('.JS_sms_pay').addClass('btn-default');
                    }, 100)
                    
        		} else {
        			zt.alert( data.msg);
        		} 
        	})
        	
        	//diy sms pay price click
	        $('#arge').on('click change keyup', ".JS_diypay_sms_sum", function(){
	            zt.diySmsPayPrice();
	        });
        },
        // sms pay
	    smsPay: function( package_no){
	    	if( zt.urlGet('change')==undefined)
	    		var newTab = window.open('about:blank');
	    	
	        if( package_no==undefined || package_no=='') return zt.alert('请先选择套餐！');
	        var messages = '';
	        if( package_no==999){
	            messages = $('.JS_diypay_sms_sum').val();
	            var match = !!(messages+'').match(/^\d+$/g);
	            if( !match) return zt.alert("请输入正确的数字");
	            if( messages < 100) return zt.alert('最少充值100条');
	            if( messages > 200000) return zt.alert('最多充值200000条');
	        }
	        zt.ajax( '/sms/createOrder', {package_no:package_no, messages:messages}, function( data){
	            if( data.status=='OK'){
	                $('#arge').modal('hide');
	                if( zt.urlGet('change')!=undefined)
	                	location.href = "/sms/toPay?order_no="+data.order_no;
	                else{
		                newTab.location.href = "/sms/toPay?order_no="+data.order_no;
		                zt.smsPayCallback( data.order_no);
	                }
	            }else zt.alert( data.msg);
	        });
	    },
	    // sms Pay callback
	    smsPayCallback: function( order_no){
	        swal(
	            {
	                title: "登陆支付宝充值",
	                text: "付款完成前，请不要关闭此窗口，若付款失败，请重试或联系客服。",
	                type: "warning",
	                showCancelButton: true,
	                confirmButtonColor: "#399bff",
	                confirmButtonText: "完成付款",
	                cancelButtonText: "暂不付款",
	                closeOnConfirm: false,
	                closeOnCancel: false
	            },
	            function( isConfirm){
	                if( isConfirm){
	                    zt.ajax( '/sms/ajaxCheckOrder', {order_no:order_no}, function(info){
	                        if( info.status=='OK'){
	                            swal("充值成功!", "您已成功充值"+info.info.sms_buy_num+"条短信，短信余额为"+info.info.sms_surplus_num+"条！", "success");
	                            $('.JS_info_sms_num').html(info.info.sms_surplus_num);
	                        }else{
	                            swal({
	                                    title:"充值未完成",
	                                    text:"很抱歉，我们尚未收到您的款项，请前往支付宝进行确认。是否重新充值?",
	                                    type:"warning",
	                                    showCancelButton: true,
	                                    confirmButtonColor: "#399bff",
	                                    confirmButtonText: "重新充值",
	                                    cancelButtonText: "取消",
	                                    closeOnConfirm: false
	                                },
	                                function( isConfirm){
	                                    if( isConfirm){
	                                        var newTab = window.open('about:blank');
	                                        newTab.location.href = "/sms/toPay?order_no="+order_no;
	                                        zt.smsPayCallback( order_no);
	                                    }
	                                });
	                        }
	                    });
	                }else{
	                    swal.close();
	                    //var newTab = window.open('about:blank');
	                    //newTab.location.href = "http://help.dzsofts.net/content.php?content_id=403";
	                }
	            }
	        );
	    },
	    //diy sms pay price
	    diySmsPayPrice: function(){
	        var sms_sum = parseInt($(".JS_diypay_sms_sum").val());
	        diy_pay_input = $('.JS_diypay_sms_sum');
	        
	        sms_sum = isNaN(sms_sum) ? 0 : sms_sum;
	        setTimeout( function(){
	        	zt.ajax( '/sms/checkPayPrice', {package_no:999, messages:sms_sum}, function( data){
		            if( data.status=='OK'){
		            	$(".JS_diypay_save_cost").html(data.save_cost);
		    	        $(".JS_diypay_promotional_cost").html(data.promotional_cost);
		    	        $(".JS_diypay_original_cost").html(data.original_cost);
		    	        $(".JS_diy_unit_cost").html(data.unit_cost);
		    	        
		    	        diy_pay_input.removeClass('error_input');
		    	        diy_pay_input.next().hide();
		                /*$(".JS_sms_pay[data-package_no=999]").addClass('btn-default');*/
		            }else{
		            	diy_pay_input.addClass('error_input');
		            	diy_pay_input.next().show();
		                /*$(".JS_sms_pay[data-package_no=999]").removeClass('btn-default');*/
		                diy_pay_input.siblings('.popover').find('.popover-content').html( data.msg);
		            }
		        });
	        },100);
	        return;
	        
	        //原价
	        var original_cost = (sms_sum/10).toFixed(2);
	        //单价
	        if(sms_sum == 0){
	            var unit_cost = 0;
	        }else{
	            if( zt.sms_activity == 1){
	                if(sms_sum < 500){
	                    var unit_cost = 0.9;
	                }else if(sms_sum >= 500 && sms_sum < 1000){
	                    var unit_cost = 0.6;
	                }else if(sms_sum >= 1000 && sms_sum < 5000){
	                    var unit_cost = 0.58;
	                }else if(sms_sum >= 5000 && sms_sum < 10000){
	                    var unit_cost = 0.53;
	                }else if(sms_sum >= 10000 && sms_sum < 50000){
	                    var unit_cost = 0.5;
	                }else if(sms_sum >= 50000 && sms_sum < 100000){
	                    var unit_cost = 0.46;
	                }else if(sms_sum >= 100000 && sms_sum < 200000){
	                    var unit_cost = 0.42;
	                }else if(sms_sum >= 200000){
	                    var unit_cost = 0.4;
	                }
	            }else{
	                if(sms_sum < 500){
	                    var unit_cost = 0.9;
	                }else if(sms_sum >= 500 && sms_sum < 1000){
	                    var unit_cost = 0.8;
	                }else if(sms_sum >= 1000 && sms_sum < 5000){
	                    var unit_cost = 0.7;
	                }else if(sms_sum >= 5000 && sms_sum < 10000){
	                    var unit_cost = 0.6;
	                }else if(sms_sum >= 10000 && sms_sum < 50000){
	                    var unit_cost = 0.55;
	                }else if(sms_sum >= 50000){
	                    var unit_cost = 0.5;
	                }
	            }
	
	        }
	        //现价
	        var promotional_cost = zt.get_price( sms_sum,unit_cost).toFixed(2);
	        //省下
	        var save_cost = (sms_sum/10 - promotional_cost*1).toFixed(2);
	        var len = save_cost.length;
	
	        $(".JS_diypay_save_cost").html(save_cost);
	        $(".JS_diypay_promotional_cost").html(promotional_cost);
	        $(".JS_diypay_original_cost").html(original_cost);
	        $(".JS_diy_unit_cost").html(parseFloat(unit_cost*10).toFixed(1));
	    },
	    // diy sms pay price for get_price
	    get_price: function( sms_sum, unit_cost){
	        var price = 0;
	        price = sms_sum/10*unit_cost;
	        return price;
	    },
	    // 保存canvas成图片
	    saveCanvasImage: function(arr) {
	    	var type = 'png';
			var imgData = canvas.toDataURL(type);
			var myDate = new Date();
			var year = myDate.getFullYear(); 
			var mouth = myDate.getMonth() + 1;
			var dat = myDate.getDate(); 
			var hours = myDate.getHours(); 
			var Minutes = myDate.getMinutes(); 
			var Seconds = myDate.getSeconds();
			var _fixType = function(type) {
			    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
			    var r = type.match(/png|jpeg|bmp|gif/)[0];
			    return 'image/' + r;
			};
			imgData = imgData.replace(_fixType(type),'image/octet-stream');
				var saveFile = function(data, filename){
		    	var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
			    save_link.href = data;
			    save_link.download = filename;
			   
			    var event = document.createEvent('MouseEvents');
			    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
			    save_link.dispatchEvent(event);
			};
			var filename = arr + '_' + year + '_' + mouth + '_' + dat + '_' + hours + ':' + Minutes + ':' + Seconds + '.' + type;
			saveFile(imgData,filename);
	    }
    };
    window.zt = new Wheel();
    window.shortAuthCallback = function(){}; //声明段授权回调空方法
    window.close_hra_notice = function(){};

}(jQuery, window, document);

$(function(){
    zt.contentsHeight();
    if( $('.content-box').length >0){
        window.setInterval( 'zt.checkHeightDo()', 200);
    }
    try{
        if (menu_id != undefined) {
            var awrap = $("#m_"+menu_id);
            var m = awrap.closest("li");
            awrap.addClass("active");
            m.closest('.list-item').closest('li').addClass('selected');
            m.closest(".list-item").siblings("h4").removeClass("new-yy");
            m.closest('ul').show();
        }
    }
    catch (error){}
    //input placeholder
    $("input[placeholder]").length && (function(){
        var input = $("input[placeholder]");
        input.each(function(){
            var placeholder = "";
            var that = $(this)[0];
            if(that && !("placeholder" in document.createElement("input")) && (placeholder = that.getAttribute("placeholder"))) {
                var idLabel = that.id;
                if(!idLabel) {
                    idLabel = "placeholder_" + new Date().getTime();
                    that.id = idLabel;
                }
                var eleLabel = document.createElement("label");
                with(eleLabel){
                    htmlFor = idLabel;
                    style.position = "absolute";
                    // style.left = "0";
                    style.top = "50%";
                    style.marginTop = "-12px";
                    style.zIndex = "3";
                    style.color = "#aaa";
                    style.cursor = "text";
                }
                that.parentNode.style.position = "relative";
                that.parentNode.insertBefore(eleLabel, that);
                that.onfocus = function() {
                    eleLabel.innerHTML = "";
                };
                that.onblur = function() {
                    if(this.value === "") {
                        eleLabel.innerHTML = placeholder;
                    }
                };
                if(that.value === "") {
                    eleLabel.innerHTML = placeholder;
                }
            }
        });
    })();

    //select hover
    $(document).on("mouseleave mouseenter", ".mfs-container", function(e) {
        var $ul = $(this).find('ul');
        if(e.type == 'mouseenter') {
        	$(this).addClass('hover');
        } else {
        	$(this).removeClass('hover');
        }
        switch(e.type) {
            case "mouseenter": $ul.show(); break;
            case "mouseleave": $ul.hide(); break;
        }
    });
    
    //modal reset auto
    var modals =  $(".modal");
    modals.on("show.bs.modal", function() {
    	var that = $(this);
    	var dialog = that.find(".modal-dialog");
    	that.removeClass("fade");
    })
    
    //充值短信
    var tmp_value = 1;
    $(".header").on("mouseenter", ".resttime", function() {
        if (tmp_value == 1) {
            zt.prepaidText();
            tmp_value = 2;
        }
    });
    
    //搜狗浏览器下a标签blur事件无效
	$(".btn").each(function() {
   		$(this).attr({
	  		role: "button",
	  		tabindex: "0"
	  	})
	})
    
    //鼠标没有滚轮导致时间不能选中问题
    var clickflog = {}; 
	$(document).on('click', '.available', function(e) {
	    if(e.target != clickflog.target && (e.timeStamp-clickflog.timeStamp) < 382) { 
	    	$(".applyBtn").trigger("click");
	    	clickflog = {};
	    } else {
	    	clickflog = e;
	    }
	})
	
	//sms pay
    $('#arge').on('click', '.JS_sms_pay', function(){
        /*if(!$(this).hasClass('btn-default'))
        	return $('.JS_diypay_sms_sum').focus();*/
        zt.smsPay($(this).attr('data-package_no'));
    })
    //限制充值短信只能输入整数
    $("body").on('input keyup', '.input-integer, .JS_diypay_sms_sum', function(){
    	if(this.value!=this.value.replace(/[^\d]/g, '')) {
    		this.value = this.value.replace(/[^\d]/g, '');
    	}	
    });
    
    //弹窗居中
    $('body').on('shown.bs.modal', '.modal[role="dialog"]', function () {
	  	var that = $(this);
	  	var modalDialog = that.find('.modal-dialog');
	  	modalDialog.css({
	  		position: 'absolute',
	  		left: '50%',
	  		top: '50%',
	  		marginLeft: modalDialog.outerWidth() / 2 * -1,
	  		marginTop: modalDialog.outerHeight() / 2 * -1
	  	})
	})
	
	//初始化加入收藏
	zt.collectionpage();
    
})

//格式化时间控件
Date.prototype.format = function(fmt)
{

    var o = {
        "M+": this.getMonth()+1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth()+3)/3), //季度
        "S": this.getMilliseconds()              //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if( new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1)?(o[k]):(("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}

//格式化时间函数，day表示天数，为空或0时为当天，负数为倒退天数，正数为向前天数，format为格式化字串。
function getFormatDate( day, format){
    if( day==undefined) day = 0;
    if( format==undefined) format = "yyyy-MM-dd hh:mm:ss";
    var zdate = new Date();
    var sdate = zdate.getTime()-(1*24*60*60*1000);
    var edate = new Date(sdate+((day+1)*24*60*60*1000)).format( format);
    return edate;
}



//设置cookies函数
function setCookie(name,value,day)
{
    if(!day){
        var day = 30; //此 cookie 将被保存 30 天
    }
    var exp  = new Date();    //new Date("December 31, 9998");
    exp.setTime(exp.getTime() + day*24*60*60*1000);
    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
}

//取cookies函数
function getCookie(name)
{
    var arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));
    if(arr != null) return unescape(arr[2]); return null;
}

function dialogUcenterBind(){
    swal({
        type: "warning",
        title: "",
        text: '<div style="text-align:left;font-size:14px;"><font color="red">注意：该自动功能会因淘宝定期清理授权而停止运作，建议您填写联系方式，以便授权失效后能及时通知您。</font><br/><a href="#" target="_blank">授权是什么？点我查看>></a></div>',
        html: true,
        showCancelButton: true,
        cancelButtonText: "不填写",
        confirmButtonText: "填写",
        closeOnConfirm: true
    },function(isConfirm){
        if (isConfirm){
            document.domain = 'dzsofts.net';
            $.frame({ href: "/user_center/dialogJump" });
        }
    });
}

//根据短信条数跳到支付宝
function matchingSMS(num) {
	var sms_sum = $(".JS_diypay_sms_sum");
	sms_sum.val(num);
	sms_sum.closest("tr").find(".JS_sms_pay").trigger("click");
}

//tips提示
(function(){
    $.fn.btnTips = function(options){
        var defaults = $.extend({}, $.fn.btnTips.defaultSettings, options || {});
        var timer = null;   
        var that = $(this);
        var dataName = that.data('tipsid');
        if($('#' + dataName).length >= 1) return;
        $('.popover-dy').removeClass('in').remove();
        initial.apply(that, [defaults]);
    };

    function initial(defaults){
        var that = $(this),
            top = that.offset().top,
            left = that.offset().left,
            direction, btn, width, height, btnwidth, btnheight,
            btnCont = null,
            btnLength = defaults.footBtn.length,
            num = Math.floor(Math.random()*(10000-1)+1),
            content,
            tipsDom;
        that.attr('data-tipsid', 'popover'+ num);
        tipsDom = '<div id="'+ "popover" + num + '"class="popover-dy popover fade Yao" style=>' +
                        '<div class="arrow"></div>' +
                        '<div class="popover-content"><div class="popo-head"><div class="popo-title m-t-10 m-b-10"></div><div class="popover-content-a"></div></div>' +
                        '<div class="popover-footer"></div></div>' +
                  '</div>'
        if(that.hasClass('posins')) {
            that.append(tipsDom);
            parents = $('#'+ 'popover' + num);
            content = $('.popover-content-a', parents);
            contenta = $('.popo-title', parents);
            if(defaults.wrap) {
                content.css({
                    'white-space': 'nowrap'
                })
            }
            content.html(defaults.contents);
            contenta.html(defaults.title);
            if(btnLength == 2) {
                btn = '<div class="i-block queding btn btn-default btn-sm m-right-5">' + defaults.footBtn[0] + '</div>' + '<div class="i-block quxiao btn btn-sm">' + defaults.footBtn[1] + '</div>';
                btnCont = $('.popover-footer', parents);
                btnCont.append(btn);
            } else if(defaults.footBtn[0] == '确定') {
                btn = '<div class="i-block queding btn btn-default btn-sm m-right-5">确定</div>';
                btnCont = $('.popover-footer', parents);
                btnCont.append(btn);
            } else if(defaults.footBtn[0] == '取消') {
                btn = '<div class="i-block quxiao btn btn-sm">取消</div>';
                btnCont = $('.popover-footer', parents);
                btnCont.append(btn);
            } else {
                btn = '<div class="queding btn btn-sm btn-warning btn-block">' + defaults.footBtn[0] + '</div>';
                btnCont = $('.popover-footer', parents);
                btnCont.append(btn);
            }
            width = parents.outerWidth();
            height = parents.outerHeight();
            btnwidth = that.outerWidth();
            btnheight = that.outerHeight();
            switch(defaults.placement) {
                case 'left':
                    break;
                    parents.addClass('left').children('.arrow').attr('style', 'top:50%');
                    break;
                case 'right':
                    break;
                    parents.addClass('right').children('.arrow').attr('style', 'top:50%');
                    break;
                case 'top':
                    parents.addClass('top').children('.arrow').attr('style', 'left:85%');
                    parents.css({
                        'top': 'auto',
                        'bottom': 0,
                        'left' : '50%',
                        'margin-left': -1 * (width) / 2 - 135 + 'px',
                        'margin-bottom': btnheight + 10 + 'px'  
                    })
                    break;
                case 'bottom':
                    parents.addClass('bottom').children('.arrow').attr('style', 'left:50%');
                    parents.css({
                        'left' : '50%',
                        'top' : btnheight + 'px',
                        'margin-left': -1 * (width) / 2 + 'px'
                    })
                    break;
            }
            parents.show();
            timer = setTimeout(function(){
                parents.addClass('in');
            }, 0);

        }
        else {
            $('body').append(tipsDom);
            parents = $('#'+ 'popover' + num);
            content = $('.popover-content-a', parents);
            contenta = $('.popo-title', parents);
            if(defaults.wrap) {
                content.css({
                    'white-space': 'nowrap'
                })
            }
            content.html(defaults.contents);
            contenta.html(defaults.title);
            if(btnLength == 2) {
                btn = '<div class="i-block queding btn btn-default btn-sm m-right-5">' + defaults.footBtn[0] + '</div>' + '<div class="i-block quxiao btn btn-sm">' + defaults.footBtn[1] + '</div>';
                btnCont = $('.popover-footer', parents);
                btnCont.append(btn);
            } else if(defaults.footBtn[0] == '确定') {
                btn = '<div class="i-block queding btn btn-default btn-sm m-right-5">确定</div>';
                btnCont = $('.popover-footer', parents);
                btnCont.append(btn);
            } else if(defaults.footBtn[0] == '取消') {
                btn = '<div class="i-block quxiao btn btn-sm">取消</div>';
                btnCont = $('.popover-footer', parents);
                btnCont.append(btn);
            } else {
                btn = '<div class="queding btn btn-sm btn-warning btn-block">' + defaults.footBtn[0] + '</div>';
                btnCont = $('.popover-footer', parents);
                btnCont.append(btn);
            }
            width = parents.outerWidth();
            height = parents.outerHeight();
            btnwidth = that.outerWidth();
            btnheight = that.outerHeight();
            switch(defaults.placement) {
                case 'left':
                    parents.addClass('left').children('.arrow').attr('style', 'top:50%');
                    parents.css({
                        'left': left - width + 'px',
                        'top' : top + (btnheight - height) / 2 + 'px'
                    })
                    break;
                case 'right':
                    parents.addClass('right').children('.arrow').attr('style', 'top:50%');
                    parents.css({
                        'left': left + btnwidth + 'px',
                        'top' : top + (btnheight - height) / 2 + 'px',

                    })
                    break;
                case 'top':
                    parents.addClass('top').children('.arrow').attr('style', 'left:85%');
                    parents.css({
                        'left': left + (btnwidth - width) / 2 - 135 +'px',
                        'top': top - height + 'px'
                    })
                    break;
                case 'bottom':
                    parents.addClass('bottom').children('.arrow').attr('style', 'left:50%');
                    parents.css({
                        'left': left + (btnwidth - width) / 2 + 'px',
                        'top': top + btnheight + 'px'
                    })
                    break;
                case 'top-center':
                    parents.addClass('top').children('.arrow').attr('style', 'left:50%');
                    parents.css({
                        'left': left + (btnwidth - width) / 2 + 'px',
                        'top': top - height + 'px'
                    })
                    break;
            }
            parents.show();
            timer = setTimeout(function(){
                parents.addClass('in');
            }, 0);
        }

        btnCont.children('.queding').on('click', function(e){
            if(defaults.hidden) $(this).parents('.popover').remove();
            defaults.okBtnCallback();
            e.stopPropagation();
        });
        btnCont.children('.quxiao').on('click', function(e){
            if(defaults.hidden) $(this).parents('.popover').remove();
            defaults.noBtnCallback();
            e.stopPropagation();
        });

        defaults.disa &&
            $(document).click(function(e){
                var ev = $(e.target);
                if(ev.attr('data-tipsid')!='' && ev.attr('data-tipsid')!=undefined) { return false };
                if((ev.attr('data-tips') == 'set') || (ev.parents().hasClass('popover-dy')) || (ev.hasClass('popover-dy')) || (ev.hasClass('bootstrap-select')) || (ev.parents().hasClass('bootstrap-select'))) return;
                $('.popover-dy').removeClass('in').remove();
            });

    }

    $.fn.btnTips.defaultSettings = {
        title:'我是标题',
        contents: 'hello 我是内容',
        placement: 'top',
        hidden: true,
        disa: true,
        wrap: false,
        okBtnCallback: function(){},
        noBtnCallback: function(){},
        footBtn: ['确定', '取消']
    };

})(jQuery)

!function(){
    var b_v = navigator.appVersion;
    var IE6 = b_v.search(/MSIE 6/i) != -1;
    var IE7 = b_v.search(/MSIE 7/i) != -1;
    if(IE6 || IE7) window.location.href = "http://www.baidu.com";
}()