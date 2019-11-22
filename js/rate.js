var Rate = {
	//手机评价首页数据初始化
	initIndex: function(){
		document.title = '售后评价';
		zt.ajax('/rate/init_data',{},function(data){
			if( data.status == 'OK'){
				var switchs = data.switchs;
				var total = data.total;
				
				if(switchs.pingjia == '0') $('.pingjia').addClass('color2').html('未开启');
				else if(switchs.pingjia == '1') $('.pingjia').addClass('color9').html('已开启');
				else $('.pingjia').html('获取失败');
				if(switchs.defense == '0') $('.defense').addClass('color2').html('未开启');
				else if(switchs.defense == '1') $('.defense').addClass('color9').html('已开启');
				else $('.defense').html('获取失败');
				if(switchs.remind == '0') $('.remind').addClass('color2').html('未开启');
				else if(switchs.remind == '1') $('.remind').addClass('color9').html('已开启');
				else $('.remind').html('获取失败');

				$('.forbid_num').html(total.forbid ? total.forbid:0);
				$('.blacklist_num').html(total.blacklist ? total.blacklist:0);
				$('.whitelist_num').html(total.whitelist ? total.whitelist:0);
			}
		})
	},

	//黑名单列表
	initBlackList: function () {
		document.title = '黑名单';
		var blacklistVM = new Vue({
			el: '#blacklist-content',
			data: {
				items: {},
				totalPages: 1,
				//分页状态
				pageScuess: true,
				pagenum: 1,
				totalnum: 0,	//当前页面显示条数
				editStatus: true
			},

			mounted: function () {
				this.loadList(0);
				zt.pageScroll.call(this, this.page);
			},

			methods: {
				//加载列表
				loadList: function (search, page) {
					var word = '';
					var that = this;
					var inactive = $('.there-inactive');
					if (page != '1') {
						that.items = {};
						that.pagenum = 1;
						word = $('#word').val();
					}
					inactive.addClass('hide');
					$('#ct').remove();
					zt.loading('show');
					zt.ajax('/rate/get_black_list', {
						word: word,
						is_search: search,
						pagenum: that.pagenum
					}, function (data) {
						if (data.status == 'OK') {
							var list = data.data.list;
							var pageInfo = data.data.pageInfo;
							if (list.length == 0) {
								inactive.removeClass('hide');
								if (search) inactive.html('<i class="icon-wraning"></i><br/>没有匹配的内容！');
								else inactive.html('<i class="icon-wraning"></i><br/>您还未添加黑名单账号！');
								zt.loading('hide');
								$('#blacklist-content').removeClass('hide');
								return;
							}

							that.totalnum += list.length;
							if (page != '1') {
								that.items = list;
								that.totalPages = pageInfo.totalpages;
							} else {
								//分页状态
								that.pageScuess = true;
								that.items = that.items.concat(list);
								$('#page-loading').hide();
								if (that.pagenum == that.totalPages) {
									$('.mui-content').append('<div id="ct" class="text-center m-t-10 m-b-10 font-14">没有更多了~</div>');
								}
							}
						}
						zt.loading('hide');
						$('#blacklist-content').removeClass('hide');
					})
				},
				//修改备注
				changeDetail: function (item) {
					var btnArray = ['取消', '确定'];
					mui.prompt(item.created_at + '      ' + item.type, '请输入备注', item.buyer_nick, btnArray, function (e) {
						if (e.index == 1) {
							zt.ajax('/rate/change_black_remark', {id: item.id, remark: e.value}, function (data) {
								if (data.status == 'OK') {
									item.remark = e.value;
									mui.toast(data.msg);
								} else {
									mui.toast(data.msg);
								}
							})
						}
					});
					if (item.remark) $('.mui-popup-input input').val(item.remark);
				},
				//修改名单
				showEditList: function (e) {
					$(e.target).hide();
					$('.right-nav').hide();
					$('#blistBtn').show();
					this.editStatus = !this.editStatus;
					$('.blacklist li b').css({width:"75%"});
					$('#blacklist [type="checkbox"]').prop('checked', false);
				},
				//删除
				deleteList: function () {
					var that = this;
					var btnArray = ['取消', '删除'];
					var list = $('#blacklist');
					var checkedbox = $('input[type="checkbox"]:checked');
					if (checkedbox.length == 0) {
						mui.toast('请选择买家');
					} else {
						var id = [];
						checkedbox.each(function () {
							id.push($(this).closest('li').attr('list-id'));
						});
						var del = id.length;
						mui.confirm('<div></div>', '确认删除？', btnArray, function (e) {
							if (e.index == 1) {
								zt.loading('show');
								zt.ajax('/rate/delete_black', {id: id}, function (data) {
									zt.loading('hide');
									if (data.status == 'OK') {
										checkedbox.parent().parent().parent().remove();
										mui.toast('删除成功');
										that.totalnum = that.totalnum - del;
										console.log(that.totalnum);
										if( that.totalnum == '0'){	//清空自动返回列表页
											that.page();
											// window.location.reload();
										}
									} else {
										mui.toast(data.msg);
									}
								})
							}
						});
					}
				},
				//取消
				cancelBtn: function () {
					window.location.reload();
				},
				//分页
				page: function () {
					var that = this;
					var loadWrapper = $('.mui-content');
					var pageload = null;
					var loadHtml = [
						'<div id="page-loading" class="lod text-center m-b-10">',
						'<div class="m-loading-wrapper i-block">',
						'<span class="mui-spinner ver-top"></span>',
						'<span class="i-block ver-top m-loading-text m-l-5 font-16">正在加载，请稍候..</span>',
						'</div>',
						'</div>'
					].join('');
					if (that.totalPages > 1) {
						if (that.pagenum == that.totalPages) {
							return;
						} else if (!loadWrapper.find('#page-loading').length) {
							loadWrapper.append(loadHtml);
						}
						$('#page-loading').show();
						if (that.pageScuess) {
							that.pageScuess = false;
							that.pagenum = that.pagenum + 1;
							that.loadList('', 1);
						}
					}
				}
			}
		});
	},

	//增加黑名单
	initAddBlack:function(){
		document.title = '黑名单';
		var AddBlackVM = new Vue({
			el:'#AddBlack',
			data:{
				isChecked:false
			},
			mounted:function(){
				this.pickerDate();
			},
			methods:{
				pickerDate:function(){
					(function($, doc) {
						$.init();
						$.ready(function() {
							//普通示例
							var userPicker = new $.PopPicker();
							userPicker.setData([{
								value: '1',
								text: '一个月'
							}, {
								value: '2',
								text: '二个月'
							}, {
								value: '3',
								text: '三个月'
							}, {
								value: '6',
								text: '半年'
							}
							]);
							var pCheck = doc.getElementById('pickerCheck');
							var showUserPickerButton = doc.getElementById('showUserPicker');
							var userResult = doc.getElementById('userResult');
							var choose_type;
							if(!userResult.innerText){
								userResult.innerText='一个月';
								userResult.value='1';
							}
							showUserPickerButton.addEventListener('tap', function(event) {
								choose_type = 1;
								userPicker.show(function(items) {
									d =JSON.stringify(items[0].text).trim() ;
									d = d.replace("\"","").replace("\"","");
									userResult.innerText=d;
									AddBlackVM.isChecked=true;
								});
							}, false);
							pCheck.addEventListener('tap', function(event) {
								if(!this.checked) {
									choose_type = 2;
									userPicker.show(function (items) {										
										d = JSON.stringify(items[0].text).trim();
										d = d.replace("\"", "").replace("\"", "");
										userResult.innerText = d;
										AddBlackVM.isChecked=true;
									});
								}
							}, false);
							$('body').on('tap','.mui-poppicker-btn-cancel',function(){
								if(choose_type == 2) AddBlackVM.isChecked=false;
							});
						});
					})(mui, document);
				},
				cancelBtn:function(){
					window.history.go(-1);
					// window.location.href = '/html/rate/show_black_list.html';
				},
				alertBtn:function(){
					if( $('#alertBtn').attr('data-pass') == '1' ) return;
					if(!($(blistText).val())&&(AddBlackVM.isChecked==false)){
						mui.toast('请添加黑名单用户');
					}else{
						var addDate;
						switch( $('#userResult').html()){
							case "一个月":
								addDate = 1;
								break;
							case "二个月":
								addDate = 2;
								break;
							case "三个月":
								addDate = 3;
								break;
							case "半年":
								addDate = 6;
								break;
						}
						var into = $('#pickerCheck').prop('checked') === true? 1 : 0;
						var nickTextarea = $('#blistText').val();
						$('#alertBtn').attr('data-pass','1');
						zt.loading('show');
						zt.ajax('/rate/add_black', {addDate:addDate, into:into, nickTextarea:nickTextarea}, function(data){
							zt.loading('hide');
							if( data.status == 'OK'){
								mui.toast('添加成功');
								setTimeout( function(){window.history.go(-1);} , 1000);
								// window.location.href = '/html/rate/show_black_list.html';
							}else{
								mui.toast(data.msg);
								setTimeout( function(){window.history.go(-1);} , 1000);
							}
						})
					}

				}

			}
		});
	},
	//白名单列表
	initWhiteList: function () {
		document.title = '白名单';
		var whitelistVM = new Vue({
			el: '#whitelist-content',
			data: {
				items: {},
				totalPages: 1,
				//分页状态
				pageScuess: true,
				pagenum: 1,
				totalnum: 0,
				editStatus: true
			},

			mounted: function () {
				this.loadList(0);
				zt.pageScroll.call(this, this.page);
			},

			methods: {
				//加载列表
				loadList: function (search, page) {
					var word = $('#word').val();
					var that = this;
					var inactive = $('.there-inactive');
					if (page != '1') {
						that.items = {};
						that.pagenum = 1;
					}
					inactive.addClass('hide');
					$('#ct').remove();
					zt.loading('show');
					zt.ajax('/rate/get_white_list', {
						word: word,
						is_search: search,
						pagenum: that.pagenum
					}, function (data) {
						if (data.status == 'OK') {
							var list = data.data.list;
							var pageInfo = data.data.pageInfo;
							if (list.length == 0) {
								inactive.removeClass('hide');
								if (search) inactive.html('<i class="icon-wraning"></i><br/>没有匹配的内容！');
								else inactive.html('<i class="icon-wraning"></i><br/>您还未添加白名单账号！');
								zt.loading('hide');
								$('#whitelist-content').removeClass('hide');
								return;
							}

							that.totalnum += list.length;
							if( page != '1'){
								that.items = list;
								that.totalPages = pageInfo.totalpages;
							}else{
								//分页状态
								that.pageScuess = true;
								that.items = that.items.concat(list);
								$('#page-loading').hide();
								if(that.pagenum == that.totalPages) { 
									$('.mui-content').append('<div id="ct" class="text-center m-t-10 m-b-10 font-14">没有更多了~</div>');
								}
							}
						}
						zt.loading('hide');
						$('#whitelist-content').removeClass('hide');
					})
				},

				//修改备注
				changeDetail: function (item) {
					var btnArray = ['取消', '确定'];
					mui.prompt(item.created_at + '      手工录入', '请输入备注', item.buyer_nick, btnArray, function (e) {
						if (e.index == 1) {
							zt.ajax('/rate/change_white_remark', {id: item.id, remark: e.value}, function (data) {
								if (data.status == 'OK') {
									item.remark = e.value;
									mui.toast('修改成功');
								} else {
									mui.toast(data.msg);
								}
							})
						}
					});
					if (item.remark) $('.mui-popup-input input').val(item.remark);
				},
				//修改名单
				showEditList: function (e) {
					$(e.target).hide();
					$('.right-nav').hide();
					$('#blistBtn').show();
					this.editStatus = !this.editStatus;
					$('.blacklist li b').css({width:"75%"});
					$('#whitelist [type="checkbox"]').prop('checked', false);
				},
				//删除
				deleteList: function () {
					var that = this;
					var btnArray = ['取消', '删除'];
					var list = $('#whitelist');
					var checkedbox = $('input[type="checkbox"]:checked');
					if (checkedbox.length == 0) {
						mui.toast('请选择买家');
					} else {
						var id = [];
						checkedbox.each(function () {
							id.push($(this).closest('li').attr('list-id'));
						});
						var del = id.length;
						mui.confirm('<div></div>', '确认删除？', btnArray, function (e) {
							if (e.index == 1) {
								zt.loading('show');
								zt.ajax('/rate/delete_white', {id: id}, function (data) {
									zt.loading('hide');
									if (data.status == 'OK') {
										checkedbox.parent().parent().parent().remove();
										mui.toast('删除成功');
										that.totalnum = that.totalnum - del;
										if( that.totalnum == '0'){	//清空自动返回列表页
											that.page();
										}
									} else {
										mui.toast(data.msg);
									}
								})
							}
						});
					}
				},
				//取消
				cancelBtn: function () {
					window.location.reload();
				},
				//分页
				page: function () {
					var that = this;
					var loadWrapper = $('.mui-content');
					var pageload = null;
					var loadHtml = [
						'<div id="page-loading" class="lod text-center m-b-10">',
						'<div class="m-loading-wrapper i-block">',
						'<span class="mui-spinner ver-top"></span>',
						'<span class="i-block ver-top m-loading-text m-l-5 font-16">正在加载，请稍候..</span>',
						'</div>',
						'</div>'
					].join('');
					if (that.totalPages > 1) {					
						if (that.pagenum == that.totalPages) {
							return;
						} else if (!loadWrapper.find('#page-loading').length) {
							loadWrapper.append(loadHtml);
						}
						$('#page-loading').show();
						if (that.pageScuess) {
							that.pageScuess = false;
							that.pagenum = that.pagenum + 1;
							that.loadList('', 1);
						}
					}
				}				
			},
		});
	},

	//禁止购买名单列表
	initWarningList: function () {
		document.title = '禁止购买名单';
		var warninglistVM = new Vue({
			el: '#warninglist-content',
			data: {
				items: {},
				totalPages: 1,
				//分页状态
				pageScuess: true,
				pagenum: 1,
				totalnum: 0,
				editStatus: true,
			},

			mounted: function () {
				this.loadList(0);
				zt.pageScroll.call(this, this.page);
			},

			methods: {
				//加载列表
				loadList: function (search, page) {
					var word = '';
					var that = this;
					var inactive = $('.there-inactive');
					if (page != '1') {
						that.items = {};
						that.pagenum = 1;
						word = $('#word').val();
					}
					inactive.addClass('hide');
					$('#ct').remove();
					zt.loading('show');
					zt.ajax('/rate/get_warning_list', {
						word: word,
						is_search: search,
						pagenum: that.pagenum
					}, function (data) {
						if (data.status == 'OK') {
							var list = data.list;
							if (list.length == 0) {
								inactive.removeClass('hide');
								if (search) inactive.html('<i class="icon-wraning"></i><br/>没有匹配的内容！');
								else inactive.html('<i class="icon-wraning"></i><br/>您还未添加禁止购买名单账号！');
								zt.loading('hide');
								$('#warninglist-content').removeClass('hide');
								return;
							}

							that.totalnum += list.length;
							if (page != '1') {
								that.items = list;
								that.totalPages = data.totalPages;
							} else {
								//分页状态
								that.pageScuess = true;
								that.items = that.items.concat(list);
								$('#page-loading').hide();
								if (that.pagenum == that.totalPages) {
									$('.mui-content').append('<div id="ct" class="text-center m-t-10 m-b-10 font-14">没有更多了~</div>');
								}
							}
						}
						zt.loading('hide');
						$('#warninglist-content').removeClass('hide');
					})
				},
				//修改名单
				showEditList: function (e) {
					$(e.target).hide();
					$('.right-nav').hide();
					$('#blistBtn').show();
					this.editStatus = !this.editStatus;
					$('.blacklist li b').css({width:"75%"});
					$('#warninglist [type="checkbox"]').prop('checked', false);
				},
				//删除
				deleteList: function () {
					var that = this;
					var btnArray = ['取消', '删除'];
					var list = $('#warninglist');
					var checkedbox = $('input[type="checkbox"]:checked');
					if (checkedbox.length == 0) {
						mui.toast('请选择用户');
					} else {
						var nick = [];
						checkedbox.each(function () {
							nick.push($(this).closest('li').find('label').find('b').text());
						})
						var del = nick.length;
						mui.confirm('<div></div>', '确认删除？', btnArray, function (e) {
							if (e.index == 1) {
								zt.loading('show');
								zt.ajax('/rate/delete_warning', {nick: nick}, function (data) {
									zt.loading('hide');
									if (data.status == 'OK') {
										checkedbox.parent().parent().parent().remove();
										mui.toast('删除成功');
										that.totalnum = that.totalnum - del;
										if( that.totalnum == '0'){	//清空自动返回列表页
											that.page();
										}
									} else {
										mui.toast(data.msg);
									}
								})
							}
						});
					}
				},
				//取消
				cancelBtn: function () {
					window.location.reload();
				},
				//分页
				page: function () {
					var that = this;
					var loadWrapper = $('.mui-content');
					var pageload = null;
					var loadHtml = [
						'<div id="page-loading" class="lod text-center m-b-10">',
						'<div class="m-loading-wrapper i-block">',
						'<span class="mui-spinner ver-top"></span>',
						'<span class="i-block ver-top m-loading-text m-l-5 font-16">正在加载，请稍候..</span>',
						'</div>',
						'</div>'
					].join('');
					if (that.totalPages > 1) {
						if (that.pagenum == that.totalPages) {
							return;
						} else if (!loadWrapper.find('#page-loading').length) {
							loadWrapper.append(loadHtml);
						}
						$('#page-loading').show();
						if (that.pageScuess) {
							that.pageScuess = false;
							that.pagenum = that.pagenum + 1;
							that.loadList('', 1);
						}
					}
				}
			}
		});
	},

	//增加禁止购买名单
	initAddWarning:function(){
		document.title = '禁止购买名单';
		var AddWarningVM = new Vue({
			el:'#addWarning',
			data:{
				isChecked:false
			},
			mounted:function(){
				this.pickerDate();
			},
			methods:{
				pickerDate:function(){
					(function($, doc) {
						$.init();
						$.ready(function() {
							//普通示例
							var userPicker = new $.PopPicker();
							userPicker.setData([{
								value: '1',
								text: '一个月'
							}, {
								value: '2',
								text: '二个月'
							}, {
								value: '3',
								text: '三个月'
							}
							]);
							var pCheck = doc.getElementById('pickerCheck');
							var showUserPickerButton = doc.getElementById('showUserPicker');
							var userResult = doc.getElementById('userResult');
							var choose_type;
							if(!userResult.innerText){
								userResult.innerText='一个月';
								userResult.value='1';
							}

							var userResult = doc.getElementById('userResult');
							showUserPickerButton.addEventListener('tap', function(event) {
								choose_type = 1;
								userPicker.show(function(items) {
									d =JSON.stringify(items[0].text).trim() ;
									d = d.replace("\"","").replace("\"","");
									userResult.innerText=d;
									AddWarningVM.isChecked=true;
								});
							}, false);
							pCheck.addEventListener('tap', function(event) {
								if(!this.checked) {
									choose_type = 2;
									userPicker.show(function (items) {
										d = JSON.stringify(items[0].text).trim();
										d = d.replace("\"", "").replace("\"", "");
										userResult.innerText = d;
										AddWarningVM.isChecked=true;
									});
								}
							}, false);
							$('body').on('tap','.mui-poppicker-btn-cancel',function(){
								if(choose_type == 2) AddWarningVM.isChecked=false;
							});
						});
					})(mui, document);
				},
				cancelBtn:function(){
					window.history.go(-1);
					// window.location.href = '/html/rate/show_forbid_list.html';
				},
				alertBtn:function(){
					if( $('#alertBtn').attr('data-pass') == '1' ) return;
					if(!($(blistText).val())&&(AddWarningVM.isChecked==false)){
						mui.toast('请添加禁止购买名单用户');
					}else{
						var addDate;
						switch( $('#userResult').html()){
							case "一个月":
								addDate = 1;
								break;
							case "二个月":
								addDate = 2;
								break;
							case "三个月":
								addDate = 3;
								break;
						}
						var into = $('#pickerCheck').prop('checked') ===true ? 1 : 0;
						var nickTextarea = $('#blistText').val();
						$('#alertBtn').attr('data-pass','1');
						zt.loading('show');
						zt.ajax('/rate/add_warning', {addDate:addDate, into:into, nickTextarea:nickTextarea}, function(data){
							zt.loading('hide');
							if( data.status == 'OK'){
								mui.toast('成功添加' + data.success + '个，失败' + data.fail + '个');
								setTimeout( function(){window.history.go(-1);} , 1000);
								// window.location.href = '/html/rate/show_forbid_list.html';
							}else{
								mui.toast(data.msg);
								setTimeout( function(){window.history.go(-1);} , 1000);
							}
						})
					}
				}

			}
		});
	},

	//自动评价
	initAutoRate: function () {
		document.title = '自动评价';
		var autoRateVM = new Vue({
			el: '#autoRate-content',
			data: {
				items:[],
				infos:{},
				totalPages: 1,
				//分页状态
				pageScuess: true,
				pagenum: 1,
				editStatus: true,
				isShow:true,
				isEdit:true,
				textarea:'',
				editText:'',
				checked:false,
				logShow:false,
				logs:[],
				isHasLog:false,
				checkedStatus:[],
				pingSetInfo:{},
				rateStatus:false,	//评价开启状态
				rateType:0,		//交易成功后评价设置	0不评价 1立即评价 2定时评价
				ratenum:0
			},
			mounted: function () {
				this.autoRate();
				this.rateLog();
				this.pickerDate();
				$('.side-footer').on('tap','button',function(){
					mui('.mui-off-canvas-wrap').offCanvas().close();
				});
				var that = this;
				$('.mui-inner-wrap').on('scroll',function() {
					if( that.logShow){
						var winHeight = $(window).height();
						var divHeight = $('.mui-content').height();
						if (($(this).scrollTop() + winHeight) == divHeight) {
							that.page();
						}
					}
				});
				window.onload=function(){autoRateVM.insertTitle();};

			},
			update:function(){
				var text=$('.side-content li[class*="mui-selected"] a').html();
				$('#pingText').html(text);
			},
			methods: {
				//自动评价初始信息   /rate/initAutoRate
				autoRate:function(){
					var that = this;
					zt.loading('show');
					zt.ajax('/rate/init_auto_rate',{},function(data){
						if (data.status == 'OK') {
							that.items=data.data.pingjia_content;
							that.infos=data.data.ping_set_info;
							that.ratenum = that.items.length;

							var ping_set_info = data.data.ping_set_info;
							that.rateStatus = ping_set_info.is_enable == '1' ? true : false;

							if( ping_set_info.buyer_unrated == '0') that.rateType = 0;
							else if( ping_set_info.buyer_unrated == '1' && ping_set_info.is_qiangping != '1') that.rateType = 1;
							else if( ping_set_info.buyer_unrated == '1' && ping_set_info.is_qiangping == '1') that.rateType = 2;
						
							var pingjia_text;
							switch( that.rateType){
								case 0:
									pingjia_text = '交易成功后不评价';
									break;
								case 1:
									pingjia_text = '交易成功立即评价';
									break;
								case 2:
									pingjia_text = '交易成功后' +'<em style="color: #999" class="em1">'+ that.infos.qiangping_day +'</em>'+'天'+'<em style="color: #999" class="em2">'+that.infos.qiangping_hour + '</em>'+'小时后评价';
									break;
							}
							$('#pingText').html(pingjia_text);
						}
						zt.loading('hide');
						$('#autoRate-content>div').removeClass('hide');
					});
				},
				//选择器
				pickerDate: function () {
					(function ($, doc) {
						$.init();
						$.ready(function () {
							var userPicker = new $.PopPicker({
								layer: 2
							});
							var dateArr = [];
							var hourArr = [];
							for (var j = 0; j < 24; j++) {
								hourArr = hourArr.concat({text: j.toString(), value: j.toString()});
							}
							for (var i = 0; i < 15; i++) {
								dateArr = dateArr.concat({
									text: i.toString(),
									value: i.toString(),
									children: hourArr
								});
							}
							userPicker.setData(dateArr);
							$('#pickerShow').on('tap', '#dateA', function () {
								var a=autoRateVM.infos.qiangping_day;
								var b=autoRateVM.infos.qiangping_hour;
								userPicker.pickers[0].setSelectedValue(a,500);
								userPicker.pickers[1].setSelectedValue(b,500);
								userPicker.show(function (items) {
									$('#offCanvasSide #showDate')[0].innerText = parseInt(items[0].text);
									$('#offCanvasSide #showHouer')[0].innerText = parseInt(items[1].text);
									autoRateVM.infos.qiangping_day = $('#offCanvasSide #showDate')[0].innerText;
									autoRateVM.infos.qiangping_hour=$('#offCanvasSide #showHouer')[0].innerText;
								});
							});

						});
					})(mui, document);
				},

				//选择器插入标题
				insertTitle:function(){
					var html='<div class="mui-dtpicker-title"><h5>天</h5><h5>小时</h5></div>';
					$(".mui-poppicker-header").eq(0).after(html);
					$(".mui-poppicker-header").siblings(".mui-dtpicker-title").children('h5').css("width","50%");
				},

				//点击li中的添加按钮事件
				addLists: function () {
					this.isShow=false;
				},
				//评价日记与自动评价切换
				logIsShow:function(){
					this.logShow=true;
					if( this.totalPages == this.pagenum)	$('#ct').show();
				},
				rateSet:function(){
					this.logShow=false;
					if( this.totalPages == this.pagenum)	$('#ct').hide();
				},
				//添加
				addList:function(){
					var _value=this.textarea;
					var _this = this;
					if(_this.items.length>=10){
						mui.toast('评价内容最多十条！');
					}else{
						if(_value){
							zt.ajax('/rate/ajax_edit_content',{content:_value,content_id:0,edit_content_action:"edit"},function(data){
								if (data.status == 'OK') {
									mui.toast(data.msg);

									_this.items.push({
										id:data.data.id,
										content: _value,
										enable: 1,
									});
									_this.ratenum++;
								}
							});
							this.textarea='';
							this.isShow=true;
						}else{
							mui.toast('请添加评价内容');
						}
					}
				},
				cancelList:function(){
					this.isShow=true;
				},
				//编辑
				editplus:function(item){
					$('#autoRate li .rate-text').addClass('hide');
					$('#autoRate li').css({'height':'42px'});
					$('#autoRate li .edit-box').css({display:'block'});
					$('#c'+item.id).css({display:'none'});
					$('#b'+item.id).removeClass('hide');
					var edit=$('.d-edit').parent("#c"+item.id);
					edit.addClass('hide');
					$('#c'+item.id).removeClass('hide');
					edit.next("#b"+item.id).removeClass('hide');
					edit.parent("#li"+item.id).css({'height':'140px'});
					var that=this;
					that.editText=item.content;
					$("#autoRate textarea").blur(function(){
						$('#autoRate li .rate-text').addClass('hide');
						$('#autoRate li').css({'height':'42px'});
						$('#autoRate li .edit-box').css({display:'block'});
					});
				},
				//checkbox选中状态
				rateChecked:function(id){
					zt.ajax('/rate/ajax_edit_content',{content_id:id,edit_content_action:'edit'});
				},
				//保存
				editList:function(item){
					var that=this;
					if(that.editText){
						zt.ajax('/rate/ajax_edit_content',{content:that.editText,content_id:item.id,edit_content_action:'edit'},function(data){
							if (data.status == 'OK') {
								item.content = that.editText;
								mui.toast('保存成功');
								$('#b'+item.id).addClass('hide');
								$('#c'+item.id).css({display:'block'});
								$('#autoRate li').css({'height':'42px'});

							}else{
								mui.toast('保存失败');
							}
						});
					}
				},
				//删除
				deleteList:function(item, items, index){
					var  _this = this;
					zt.ajax('/rate/ajax_delete_content',{content_id:item.id,edit_content_action:'del'},function(data){
						if(data.status == 'OK'){							
							items.splice(index,1);
							$('#b'+item.id).addClass('hide');
							$('#c'+item.id).css({display:'block'});
							$('#autoRate li').css({'height':'42px'});
							_this.ratenum--;
							mui.toast('删除成功');
						}
						else
							mui.toast('删除失败');
					});
				},
				//侧滑栏开关
				canvasToggle:function(){
					mui('.mui-off-canvas-wrap').offCanvas().show();
				},
				//保存抢评设置
				canvasSubmit:function(){
					var buyer_unrated = $('.rate_type_content').find('.mui-selected').attr('data-value') == '0' ? 0 : 1;
					var is_qiangping = $('.rate_type_content').find('.mui-selected').attr('data-value') == '2' ? 1 : 2;

					$('.val_buyer_unrated').val( buyer_unrated );
					$('.val_qiangping').val( is_qiangping);
					$('.val_day').val( $('#offCanvasSide #showDate').text() );

					$('.val_hour').val( $('#offCanvasSide #showHouer').text() );

					var text=$('.side-content li[class*="mui-selected"] a').html();
					$('#pingText').html(text);
					 mui.toast('保存成功');
				},
				rateLog: function (search, page) {
					var tid = '';
					var that = this;
					var inactive = $('.there-inactive');
					if (page != '1') {
						that.logs = {};
						that.pagenum = 1;
						tid = $('[name="tid"]').val();
					}
					inactive.addClass('hide');
					$('#ct').remove();
					zt.loading('show');
					zt.ajax('/rate/rate_log', {
						tid: tid,
						pagenum: that.pagenum
					}, function (data) {
						if (data.status == 'OK') {
							var list = data.data.list;
							var pageInfo = data.data.pageInfo;
							if (list.length == 0) {
								inactive.removeClass('hide');
								if (search) inactive.html('<i class="icon-wraning"></i><br/>没有匹配的内容！');
								else inactive.html('<i class="icon-wraning"></i><br/>没有评价日志内容！');
								zt.loading('hide');
								$('#autoRate-content').removeClass('hide');
								return;
							}

							if (page != '1') {
								that.logs = list;
								that.totalPages = pageInfo.totalpages;
							} else {
								//分页状态
								that.pageScuess = true;
								that.logs = that.logs.concat(list);
								$('#page-loading').hide();
								if (that.pagenum == that.totalPages) {
									$('.mui-content').append('<div id="ct" class="text-center m-t-10 m-b-10 font-14">没有更多了~</div>');
								}
							}
						}else if( data.status == 'UPGRADE_FIRST'){
							inactive.removeClass('hide');
							inactive.html('<i class="icon-wraning"></i><br/>'+data.msg);
						}
						zt.loading('hide');
						$('#autoRate-content').removeClass('hide');
					})
				},
				page: function () {
					var that = this;
					var loadWrapper = $('.mui-content');
					var pageload = null;
					var loadHtml = [
						'<div id="page-loading" class="lod text-center m-b-10">',
						'<div class="m-loading-wrapper i-block">',
						'<span class="mui-spinner ver-top"></span>',
						'<span class="i-block ver-top m-loading-text m-l-5 font-16">正在加载，请稍候..</span>',
						'</div>',
						'</div>'
					].join('');
					if (that.totalPages > 1) {
						if (that.pagenum == that.totalPages) {
							return;
						} else if (!loadWrapper.find('#page-loading').length) {
							loadWrapper.append(loadHtml);
						}
						$('#page-loading').show();
						if (that.pageScuess) {
							that.pageScuess = false;
							that.pagenum = that.pagenum + 1;
							that.rateLog('', 1);
						}
					}
				},
				//保存页面设置所有设置内容
				saveRateSet:function(type){
					var that = this;

					var params = {
						buyer_rated : $('input[name="buyer_rated"]').attr('checked') ? 1 : 0,
						buyer_unrated : $('.val_buyer_unrated').val(),
						filter_blacklist : $('.filter_blacklist').hasClass('mui-active') ? 1: 0,
						is_enable : type,
						is_qiangping : $('.val_qiangping').val(),
						qiangping_day: $('.val_day').val(),
						qiangping_hour: $('.val_hour').val()
					};
					zt.loading('show');
					zt.ajax('/rate/ajax_save_set',params,function(data){
						zt.loading('hide');
						if( data.status == 'OK'){
							mui.toast('保存成功');
							that.rateStatus = type;
						}else if( data.status == 'FAIL'){
							mui.toast(data.msg);
						}
					})
				}
			}
		})
	},

	//差评防御
	initDefense: function(){
		document.title = '差评防御';
		var defenseVM = new Vue({
			el: '#defense-content',
			data:{
				infos:{},
				items:[],
				logs:[],
				isShow: 1,
				orderSet: 1,
				buyerSet: 1,
				isSave: 0,
				logPage: 1,
				logTotalPage: 1,
				pageScuess: true,
			},
			mounted: function(){
				this.initData();
				this.defenseLog();
				this.defenseUeo();
				var that = this;
				$('.mui-inner-wrap').on('scroll',function() {
					if( that.isShow == '0'){
						var winHeight = $(window).height();
						var divHeight = $('.mui-content').height();
						if (($(this).scrollTop() + winHeight) == divHeight) {
							that.page();
						}
					}
				})
			},
			methods: {
				initData: function(){
					var that = this;
					zt.loading('show');
					zt.ajax('/rate/show_defense_setting',{},function(data){
						zt.loading('hide');
						if( data.status == 'OK'){
							that.infos = data.data.result;
							that.items = data.data.arr_close_reason;
							that.isSave = that.infos.is_enable;
							$('#defense-content>div').show();
							if( that.isSave == '1'){
								$('#save_open').hide();
								$('#closeBtn').show();
							}else{
								$('#save_open').show();
								$('#closeBtn').hide();
							}
						}
					})
				},

				defenseLog: function( search, page ){
					var that = this;					
					var tid = '';
					var inactive = $('.there-inactive');

					if (page != '1') {
						that.logs = {};
						that.logPage = 1;
						tid = $('[name="tid"]').val();
					}

					inactive.addClass('hide');
					$('#ct').remove();
					zt.loading('show');
					zt.ajax('/rate/show_defense_log',{tid:tid, pagenum:that.logPage},function(data){
						if( data.status == 'OK'){
							var list = data.data.list;
							var pageInfo = data.data.pageInfo;

							if (list.length == 0) {
								inactive.removeClass('hide');
								if (search) inactive.html('<i class="icon-wraning"></i><br/>没有匹配的内容！');
								else inactive.html('<i class="icon-wraning"></i><br/>无防御记录');
								zt.loading('hide');
								return;
							}

							if (page != '1') {
								that.logs = list;
								that.logTotalPage = pageInfo.totalpages;
							} else {
								//分页状态
								that.pageScuess = true;
								that.logs = that.logs.concat(list);
								$('#page-loading').hide();
								if (that.logPage == that.logTotalPage) {
									$('.mui-content').append('<div id="ct" class="text-center m-t-10 m-b-10 font-14">没有更多了~</div>');
								}
							}
						}else if( data.status == 'UPGRADE_FIRST'){
							inactive.removeClass('hide');
							inactive.html('<i class="icon-wraning"></i><br/>'+data.msg);
						}
						zt.loading('hide');
					})
				},

				page: function () {
					var that = this;
					var loadWrapper = $('.mui-content');
					var pageload = null;
					var loadHtml = [
						'<div id="page-loading" class="lod text-center m-b-10">',
						'<div class="m-loading-wrapper i-block">',
						'<span class="mui-spinner ver-top"></span>',
						'<span class="i-block ver-top m-loading-text m-l-5 font-16">正在加载，请稍候..</span>',
						'</div>',
						'</div>'
					].join('');
					if (that.logTotalPage > 1) {
						if (that.logPage == that.logTotalPage) {
							return;
						} else if (!loadWrapper.find('#page-loading').length) {
							loadWrapper.append(loadHtml);
						}
						$('#page-loading').show();
						if (that.pageScuess) {
							that.pageScuess = false;
							that.logPage = that.logPage + 1;
							that.defenseLog('', 1);
						}
					}
				},

				//差评防御与防御日志显示
				showSetting: function () {
					this.isShow = 1;
					if( this.logTotalPage == this.logPage)	$('#ct').hide();
				},
				//输入框用户体验修改
				defenseUeo:function(){
					$('.mui-content input[type="number"],.mui-content input[type="text"]').on("click",function(){
						var a =false;
						if (a == true){
							return false;
						}
						a = true;
						this.select();
						var that=$(this).parent().next()[0];
						if(!that.checked){
							that.checked=true;

						}
					});
					$('#defenseSetting input[type="checkbox"]').on('click',function(){
						if(this.checked){
							var that=$(this).prev().find('input')[0];
							if(that) that.select();
						}
					});
				},

				showNote: function () {
					this.isShow = 0;
					if( this.logTotalPage == this.logPage)	$('#ct').show();
				},
				//关闭订单设置
				setReason: function () {
					$('#close_info').show();
					$('#unclose_info').hide();
					mui('.mui-off-canvas-wrap').offCanvas().show();
				},
				
				//不关闭订单 备注设置
				setQizhi: function () {
					$('#close_info').hide();
					$('#unclose_info').show();
					mui('.mui-off-canvas-wrap').offCanvas().show();
				},

				saveDefense: function(type){
					var params = $('#defense_set_content').serialize();
					params += '&' + $('#order_set_content').serialize();
					params += '&order_close_reason=' + $('#order_set_content li.mui-selected').text();
					params += '&is_enable=' + type;
					var that = this;
					zt.ajax('/rate/ajax_save_defense_set',params,function(data){
						if( data.status == 'OK'){
							mui.toast('保存成功');
							// that.isSave = type;
							if( type == '1'){
								$('#save_open').hide();
								$('#closeBtn').show();
							}else{
								$('#save_open').show();
								$('#closeBtn').hide();
							}
						}else if( data.status == 'FAIL'){	
							mui.toast( data.msg);
						}
					})
				},
				
				//侧滑栏确认、取消按钮
				canvasSubmit: function () {
					mui('.mui-off-canvas-wrap').offCanvas().close();
					mui.toast('修改成功');
				},
				canvasCancel: function () {
					mui('.mui-off-canvas-wrap').offCanvas().close();
				}
			}
		})
	},
	

	//中差评提醒
	initRemind: function(){
		document.title = '中差评提醒';
		var remindVM = new Vue({
			el: '#remind-content',
			data:{
				infos:{},
				care : 0,	//买家关怀
				careText : '',	
				smsRemind : 0,	//短信提醒
				emailRemind : 0,//邮件通知
				emailPerTid : 0,//邮件实时提醒
				emailStatus : 0,
				emailStatusText : '',
				phoneNum:'',
				email:'',
			},
			mounted: function(){
				this.initData();
				this.initSmsInfo();
			},
			methods: {
				//中差评提醒初始数据
				initData: function(){
					var that = this;

					zt.loading('show');
					zt.ajax('/rate/show_remind_setting',{},function(data){
						if( data.status == 'OK'){
							that.infos = data.data;
													
							that.care = that.infos.sms_status_care;
							that.careText = that.care=='1' ? '已开启':'未开启';
							that.smsRemind = that.infos.sms_status;
							that.emailRemind = that.infos.remind_status;
							that.emailPerTid = that.infos.email_per_tid;
							that.emailStatus = that.infos.show_validate_email;
							that.emailStatusText = that.emailStatus ? '(未验证)':'(已验证)';
							that.email = that.infos.email;
						}
						zt.loading('hide');
						$('#remind-content').removeClass('hide');
					})
				},
				//用户短信相关数据
				initSmsInfo: function(){
					var that = this;
					zt.ajax('/sms/ajax_get_sms_info',{},function(data){
						if( data.status == 'OK'){
							that.phoneNum = data.info.phone;
						}
					})
				},
				//中差评短信提醒 开关
				messageSwitch: function(){
					var that = this;
					//that.smsRemind = that.smsRemind=='1'?'0':'1';
					zt.loading('show');
					zt.ajax('/sms/ajax_shop_sms_switch',{'is_open':that.smsRemind=='1'?'0':'1',name:'bad_review',type:'108'},function(data){
						zt.loading('hide');
						if( data.status == 'OK'){
							that.smsRemind = that.smsRemind=='1'?'0':'1';
						}else{
							//that.smsRemind = that.smsRemind=='1'?'0':'1';
							if( data.error_code == '5'){
								zt.modal($('#iphone-popup'), 'show');
							}else if( data.status=='FAIL'){
								mui.toast(data.msg);
							}
						}
					})
				},
				//中差评邮件通知 开关
				emailSwitch: function(){
					var that = this;
					// that.emailRemind = that.emailRemind=='1'?'0':'1';
					if( that.emailRemind == '0'){	//开启
						zt.ajax('/rate/ajax_check_version',{},function(data){
							if( data.status == 'OK'){
								if( that.email == ''){	//未绑定邮箱
									$('#email-popup .mui-popup-title').html('绑定邮箱');
									zt.modal($('#email-popup'), 'show');
								}else{
									zt.loading('show');
									zt.ajax('/rate/ajax_save_email_set',{'email':that.email,switch_email_per_tid:that.emailPerTid},function(data){
										zt.loading('hide');
										if(data.status=='OK'){
											that.emailRemind = that.emailRemind=='1'?'0':'1';
											mui.toast('开启中差评邮件通知成功');
										}else{									
											mui.toast(data.msg);
										}
									});
								}
							}
						})
					}else{	
						zt.loading('show');
						zt.ajax('/rate/ajax_close_email',{is_open:0},function(data){
							zt.loading('hide');
							if(data.status=='OK'){
								that.emailRemind = that.emailRemind=='1'?'0':'1';
								mui.toast('关闭中差评邮件通知成功');
							}else{									
								mui.toast(data.msg);
							}
						})
					}
				},
				//修改邮箱
				changeEmail: function(){
					var that = this;
					$('#email-popup .mui-popup-title').html('修改邮箱');
					zt.modal($('#email-popup'), 'show');
				},
				//邮箱实时提醒 开关
				emailPerTidSwitch: function(){
					var that = this;
					that.emailPerTid = that.emailPerTid=='1'?'0':'1';
					zt.loading('show');
					zt.ajax('/rate/ajax_save_email_set',{'email':that.email,switch_email_per_tid:that.emailPerTid},function(data){
						zt.loading('hide');
						if(data.status=='OK'){
							// mui.toast(data.data.email_msg);
						}else{

							mui.toast(data.msg);
						}
					});
				},
				//邮箱验证
				checkEmail: function(){
					var that = this;
					zt.loading('show');
					zt.ajax('/rate/ajax_check_email',{},function(data){
						zt.loading('hide');
						if( data.status=='OK'){
							mui.toast(data.msg);
						}else{
							mui.toast(data.msg);
						}
					})
				},

				//手机绑定
				bindPhone: function(){
					var b = $('#code').val();
					if(b==''){
						mui.toast('验证码不能为空');
						return;
					}
					zt.ajax('/sms/ajax_validation_code',{'code':b},function(data){
						if(data.status=='OK'){
							zt.modal($('#iphone-popup'), 'hide');
							$('.mui-popup-backdrop').remove();
							mui.toast('手机号绑定成功');
						}else{
							mui.toast(data.msg);
						}
					});
				},
				//取消
				cancelPhone: function(){
					clearInterval(mm);
					zt.modal($('#iphone-popup'), 'hide');
					$('.mui-popup-backdrop').remove();
				},
				//获取验证码
				sendCode: function(){
					var status = '';
					var phone = $('#save_phone').val();
					var that = $(this);
					var timer = null;

					var telReg = !!phone.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/);
					if(telReg == false) {
						mui.toast('请输入正确的十一位手机号码');
						return;
					}

					zt.ajax('/sms/ajax_send_phone_code',{'phone':phone},function(data){
						if(data.status=='OK'){
							status = 'OK';
							mui.toast('验证码已发送，请注意查收');
							if(!that.hasClass('disabled')) {
								time = 60;
								that.addClass('disabled');
								that.html('<span class="btn-time-text">' + (time--) +'</span>秒后重发');
								timer = setInterval(function() {
									var timetext = $('.btn-time-text');
									timetext.text(time--);
									if(time == 0) {
										that.removeClass('disabled').text('发送验证码');
										clearInterval(timer);
									}
								}, 1000)
							}
						}else{
							status = 'FAIL';
							mui.toast(data.msg);
						}
					});
				},
				//保存邮箱
				saveEmail: function(){
					var that = this;
					var email = $('#save_email').val();
					if(email==''){
						mui.toast('邮箱不能为空');
						return;
					}
					zt.loading('show');
					zt.ajax('/rate/ajax_save_email_set',{'email':email,switch_email_per_tid:0},function(data){
						zt.loading('hide');
						if(data.status=='OK'){
							zt.modal($('#email-popup'), 'hide');
							that.email = email;
							if( data.data.email_send == '1'){
								mui.toast(data.data.email_msg);
								this.emailRemind = '0';
							}else if( data.data.email_msg){
								mui.toast(data.data.email_msg);
								$('.mui-popup-backdrop').remove();
							}else
								mui.toast('保存成功');
						}else{
							mui.toast(data.msg);
						}
					});
				},
				//取消
				cancelEmial: function(){
					zt.modal($('#email-popup'), 'hide');
					this.emailRemind = this.infos.remind_status;
					$('.mui-popup-backdrop').remove();
				},
					
			}
		})		
	}
}