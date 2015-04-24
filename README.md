# switchpage
js显示全屏滚动
插件支持firefox/chrome/ie7+等主流浏览器

#插件接口说明
1.支持传入css3动画函数曲线ease/linear等
2.动画时间控制
3.自适应窗口大小
4.提供导航栏
5.提供一个翻页按钮（类似支付宝）


#默认选项配置
var defaults = {
		container: '#container', //模块的父容器（jquery selector）
		element: '.section', //滚屏的模块（jquery selector）
		isGo: true, //是否出现一个向下滚屏的按钮，默认出现
		curIndex: 1, //默认当前显示为第1屏
		duration: 800, //动画过渡时间(毫秒)
		ease: 'ease', //动画过渡效果的时间曲线linear,ease, ease-in, ease-out, ease-in-out
		isPage: true //默认出现导航栏
	};
