;(function($, mod){
	var defaults = {
		container: '#container', //模块的父容器（jquery selector）
		element: '.section', //滚屏的模块（jquery selector）
		//eventType: 'click', //事件类型（click, mousewheel）
		isGo: true, //是否出现一个向下滚屏的按钮，默认出现
		curIndex: 1, //默认当前显示为第1屏
		//isLoop : false, //默认不循环
		duration: 800, //动画过渡时间(毫秒)
		ease: 'ease', //动画过渡效果的时间曲线linear,ease, ease-in, ease-out, ease-in-out
		isPage: true //默认分页(最后一项在ie7浏览器下，如果后面紧跟着",",会抛出错误)
	};

	//全局变量
	var $container, $target, $section, $pagination, len, ease, duration,
		index = 1,
		canScroll = true;

	//构造函数
	function switchPage(opts) {
		this.opts = $.extend({}, defaults, opts);
		this.init();
	}


	/****公共函数****/
	switchPage.prototype = {
		init: function() {
			//缓存需要的数据
			$container = $(this.opts.container);
			$target = $(this.opts.target);
			$section = $(this.opts.element);
			len = $(this.opts.element).length;
			index = this.opts.curIndex;
			ease = this.opts. ease;
			duration = this.opts.duration;

			resize();
			this.pagination(len);
			this.goNext();
			initEffect(ease, duration);

		},
		pagination:	function (len) {//导航分页
			if(this.opts.isPage) {
				var tmpl = '';
				for(var i = 1; i < len+1; i++) {
					if(i === 1) {
						tmpl += '<a href="#" class="current"><i>'+ i +'</i></a>';
					}
					else {
						tmpl += '<a href="#"><i>'+ i +'</i></a>';
					}
				}
				$('<div />', {html: tmpl, id: "pagination"}).appendTo('body');

				//缓存变量
				$pagination = $('#pagination');
				$pagination.find('a').eq(index-1).addClass('current').siblings('a').removeClass('current');

				$pagination.on('click', 'a', function(e) {
					e.preventDefault();
					index = $(this).index();
					if(!canScroll) return;
					scrollDown();
				});
				
			}

		},
		goNext: function() {//通过一个btn触发下一屏切换
			if(this.opts.isGo) {
				$('<div />', {html: 'next', id: "next"}).appendTo('body');
				$target = $('#next');
				$target.on('click', function(){
					if(!canScroll) return;
					scrollDown();

				});
			}
		}

	};


	/****私有函数****/

	//重写鼠标滚轮事件
	$(document).on('mousewheel DOMMouseScroll', MouseWheelHandle);
	//滚轮事件处理程序
	function MouseWheelHandle(e) {
		var value = e.originalEvent.wheelDelta || -e.originalEvent.detail,
			delta = Math.max(-1, Math.min(1, value));
			
		e.stopPropagation();
		if(canScroll) {
			if(delta < 0) {
				scrollDown();

			}else {
				scrollUp();
			}
		}

		return false;
	}

	//当窗口改变时重置
	var timer = null;
	window.onresize = function() {
		clearTimeout(timer);
		timer = setTimeout(function() {
			resize();
			initEffect(ease, duration);
		}, 500);
	}

	//获取窗口高度赋值给滚屏的块元素
	function resize() {
		var bW = $('body').width(),
			bH = $('body').height();

		$section.width(bW);
		$section.height(bH);
		$container.width(bW);
		$container.height(bH*len);
	}

	//滚到具体某一屏
	function scrollPage() {
		if($pagination.length) {//导航高亮
			$pagination.find('a').eq(index-1).addClass('current').siblings('a').removeClass('current');
		}
		initEffect(ease, duration);
	}

	//向下滚屏
	function scrollDown() {
		// console.log('向下滚动');
		if(index < len) {
			index++;
			if(index == len) {
				$target.fadeOut(300);
			}
			else {
				$target.fadeIn(300);
			}
			scrollPage();
		}
	}

	//向上滚屏
	function scrollUp() {
		// console.log('向上滚动');
		if(index > 1) {
			index--;
			$target.fadeIn(300);
			scrollPage();
		}
	}

	//动画效果
	function initEffect(ease, duration) {
		canScroll = false;
		if(index == len) {
			$target.fadeOut(300);
		}
		var top = $('.section').eq(index-1).position().top;
		if(mod.csstransitions) {//支持css3过渡效果
			$container
				.css({
					'-webkit-transform': 'translate3d(0px, -' + top + 'px, 0px)',
					'-moz-transform': 'translate3d(0px, -' + top + 'px, 0px)',
					'-o-transform': 'translate3d(0px, -' + top + 'px, 0px)',
					'-ms-transform': 'translate3d(0px, -' + top + 'px, 0px)',
					'transform': 'translate3d(0px, -' + top + 'px, 0px)',
					'-webkit-transition': duration + 'ms ' + ease,
					'-moz-transition': duration + 'ms ' + ease,
					'-o-transition': duration + 'ms ' + ease,
					'-ms-transition': duration + 'ms ' + ease,
					'transition': duration + 'ms ' + ease
				})
				.on('webkitTransitionEnd transitionend', function() {
					canScroll = true;
				});
		}
		else {//ie9-系列
			$container.animate({
				top: -top + 'px'
			}, duration, function(){
				canScroll = true;
			});
		}
	}


	//暴露接口
	$.fn.switchPage = function(opts) {
		return new switchPage(opts);
	};


})(jQuery, Modernizr);