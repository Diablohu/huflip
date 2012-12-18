/* huFlip -----------------------------------------------------------------------------------------------------
 * Inspired by Windows 8

 * v0.1.0
 * Last Update: Dec.18, 2012

 * Author: Diablohu (dreamgen.cn)
 * Latest version, update history, sample codes and more information: SOON(TM)
 */

/* Quick Start ------------------------------------------------------------------------------------------------
 * Documents and code comments are still editing. Besides, I appologize for my poor English -_-||

 * Initialization - $( jQuery ).huFlip( el[, settings] )
   * el - jQuery DOM, the element to show.
   * settings - Object, optional. See huSticky.prototype.defaults for all defaults settings.

 * A data-attribute "huFlip" will be set to the initialized elements.
   * $( query ).data('huFlip') - Get huFlip object
   * Also, for "huFlip"ed elements, $( jQuery ).huFlip() will return the huFlip object.

*/

/* 简易说明 ---------------------------------------------------------------------------------------------------
 * 初始化 - $( jQuery ).huFlip( el[, settings] )
   * el - jQuery DOM, 欲显示的元素。
   * settings - Object, 可选。所有的默认值均在 huSticky.prototype.defaults 代码中。

 * 已初始化的元素会被自动添加 data-attribute "huFlip"。
   * $( query ).data('huFlip') - 获取 huFlip 对象
   * 另外，对于这些元素，$( jQuery ).huFlip() 也会返回 huFlip 对象

*/
















var _huFlip = {
	obj:			[],
	index:			0,
	isInit:			false,

	bodyScrollY:	null,
	timeoutResize:	null,

	cSize: {
		'x':	'width',
		'y':	'height'
	},

	// All variables below are default values
	// 以下变量全为默认值

	// total duration time, millisecond
	// 总动画时长，毫秒
	duration:	 	400,

	// animation effects
	// 动画方式
	animation: [
		// 0 - Left -> Right, this is default setting
		// 0 - 左->右，此为默认值
		{
			axis: 'y',
			objStart: {
				'scale':		1,
				'perspective':	'600px',
				'rotateY':		'0deg'
			},
			objEnd: {
				'scale':		1.2,
				'perspective':	'600px',
				'rotateY':		'90deg'
			},
			overlayStart: {
				//'scale':		0,
				'perspective':	'2000px',
				'rotateY':		'-90deg'
			},
			overlayEnd: {
				'scale':		1,
				'perspective':	'2000px',
				'rotateY':		'0deg'
			},
			overlayFade: {
				'scale':		0,
				'perspective':	'2000px',
				'rotateY':		'0deg'
			}
		},
		// 1 - Right -> Left
		// 1 - 右->左
		{
			axis: 'y',
			objStart: {
				'scale':		1,
				'perspective':	'600px',
				'rotateY':		'0deg'
			},
			objEnd: {
				'scale':		1.2,
				'perspective':	'600px',
				'rotateY':		'-90deg'
			},
			overlayStart: {
				//'scale':		0,
				'perspective':	'2000px',
				'rotateY':		'90deg'
			},
			overlayEnd: {
				'scale':		1,
				'perspective':	'2000px',
				'rotateY':		'0deg'
			},
			overlayFade: {
				'scale':		0,
				'perspective':	'2000px',
				'rotateY':		'0deg'
			}
		},
		// 2 - Top -> Bottom
		// 2 - 上->下
		{
			axis: 'x',
			objStart: {
				'scale':		1,
				'perspective':	'600px',
				'rotateX':		'0deg'
			},
			objEnd: {
				'scale':		1.2,
				'perspective':	'600px',
				'rotateX':		'-90deg'
			},
			overlayStart: {
				//'scale':		0,
				'perspective':	'2000px',
				'rotateX':		'90deg'
			},
			overlayEnd: {
				'scale':		1,
				'perspective':	'2000px',
				'rotateX':		'0deg'
			},
			overlayFade: {
				'scale':		0,
				'perspective':	'2000px',
				'rotateX':		'0deg'
			}
		},
		// 3 - Bottom -> Top
		// 3 - 下->上
		{
			axis: 'x',
			objStart: {
				'scale':		1,
				'perspective':	'600px',
				'rotateX':		'0deg'
			},
			objEnd: {
				'scale':		1.2,
				'perspective':	'600px',
				'rotateX':		'90deg'
			},
			overlayStart: {
				//'scale':		0,
				'perspective':	'2000px',
				'rotateX':		'-90deg'
			},
			overlayEnd: {
				'scale':		1,
				'perspective':	'2000px',
				'rotateX':		'0deg'
			},
			overlayFade: {
				'scale':		0,
				'perspective':	'2000px',
				'rotateX':		'0deg'
			}
		}
	],

	// CSS for overlay layer
	// 浮层样式
	overlayStyle:[
		// 0, 默认
		{
			'background':	'#045'
		}
	],

	// CSS for close button in overlay layer
	// 浮层对应的关闭按钮样式
	btnCloseStyle:[
		// 0, 默认
		{
			'background':	'#034',
			'border':		'1px solid #046',
			'color':		'#069',
		}
	],

	// placeholder
	// 占坑用
	'_': null
};

// CSS prefix
_huFlip.cssprefix = function(style, onlyPrefix){
	var b = ''
		,_UA		= navigator.userAgent
		,bOpera		= /Opera/.test(_UA)
		,bWebkit	= /WebKit/.test(_UA)
		,bIE		= (!!(window.attachEvent&&!window.opera))
		,bGecko		= (!bWebkit&&_UA.indexOf("Gecko")!=-1)

	if(bOpera){
		b = '-o-'
	}else if(bWebkit){
		b = '-webkit-'
	}else if(bIE){
		b = '-ms-'
	}else if(bGecko){
		b = '-moz-'
	}
	
	return onlyPrefix ? b : b+style
}






















function huFlip(obj, el, settings){
	obj = jQuery(obj);

	// check arguments
	// 若目标不存在则不运行
	if( !obj || !obj.length || !el )
		return false;

	// return "this"(huFlip object) if initialized
	// 若已执行过huFlip，则返回this
	if( obj.data('huFlip') )
		return this;

	var defaults = jQuery.extend(true, {}, this.defaults)
		,huFlipObj = this

	jQuery.extend(true, defaults, settings);
	jQuery.extend(true, this, defaults);

	this.obj	= obj;
	this.el		= el;

	_huFlip.obj.push(this);

	obj.data({
		huFlip:{
			index:	_huFlip.index
		}
	})

	_huFlip.index++;

	// bind click event to obj
	// 添加click事件
	this.obj
		.css(_huFlip.cssprefix('transform'), huFlipObj.returnTransform('obj', 'start'))
		.css(_huFlip.cssprefix('transition'), _huFlip.cssprefix('transform')+' '+(huFlipObj.duration/2000)+'s ease-in')
		.on({
			click:	function(){
				jQuery(this).huFlip('flip')
			}
		});
};






// prototype

// 可选属性的默认值
// 对于已建立的副本，请以 .[PROP] 来访问
// 如 A_Scroll_Fix_Object.is_showing
huFlip.prototype.defaults = {
	el:				null,
	animation:		0,
	duration:		_huFlip.duration,

	overlayStyle:	0,

	isInit:			false,
	isShowing:		false,
	isFliping:		false,

	overlayCSS: {
		'position':			'absolute',
		'top':				0,
		'left':				0,
		'width':			0,
		'height':			0,
		'z-index':			'1000',
		'max-width':		'100%',
		'overflow':			'hidden'
	}
};


// 获得CSS transform值
// dom - obj, overlay
// state - start, end, fade
huFlip.prototype.returnTransform = function(dom, state, huFlipObj){
	huFlipObj = huFlipObj || this;

	if( !huFlipObj || !dom || !state )
		return false;

	var transform = _huFlip.animation[huFlipObj.animation][dom + state.charAt(0).toUpperCase() + state.substr(1).toLowerCase()] || {}
		,r = '';

	for( var i in transform ){
		r += i+'('+transform[i]+') '
	}

	return r;
}


// 翻砖
huFlip.prototype.flip = function(huFlipObj){
	huFlipObj = huFlipObj || this;

	if( !huFlipObj || huFlipObj.isFliping || huFlipObj.isShowing )
		return false;

	if( !huFlipObj.isInit ){
		huFlipObj.init(huFlipObj)
	}

	huFlipObj.isFliping = true;

	var obj = huFlipObj.obj
		,overlay = huFlipObj.overlay
		,animationId = huFlipObj.animation
		,duration = huFlipObj.duration
		,objCSS = huFlipObj.objCSS
		,container = huFlipObj.container

		,animation = _huFlip.animation[animationId]
		,size = _huFlip.cSize[animation.axis]

		// 计算数值
		,obj_height = obj.outerHeight()
		,obj_width = obj.outerWidth()
		,obj_top = obj.offset().top
		,obj_left = obj.offset().left
		,window_height = jQuery(window).height()
		,window_width = jQuery(window).width()

		// 浮层的初始样式计算
		,_scale = eval('obj_' + size) / eval('window_' + size)
		//,_left = obj_left + obj_width/2 - window_width/2
		//,_top = obj_top + obj_height/2 - window_height/2
		,_left = obj_left
		,_top = obj_top
		,_width = obj_width
		,_height = obj_height
		//,_transform = 'scale('+_scale+') perspective(2000px) rotateY(-90deg)';
		,_transform = huFlipObj.returnTransform('overlay', 'start')

	// 存储当前body的overflow-y
	_huFlip.bodyScrollY = jQuery('body').css('overflow-y') || 'auto';

	// 开始元素动画
	obj.css(_huFlip.cssprefix('transform'),	huFlipObj.returnTransform('obj', 'end'));

	// 浮层初始css
	overlay.css({
			//'height':		window_height,
			//'width':		window_width,
			'top':			_top+'px',
			'left':			_left+'px',
			'width':		_width,
			'height':		_height
		})
		.css(
			_huFlip.cssprefix('transform'),
			_transform
		)
		.css(
			_huFlip.cssprefix('transition'),
			_huFlip.cssprefix('transform')+' '+(duration/2000)+'s ease-out,'
				+'top '+(duration/2000)+'s ease-out,'
				+'left '+(duration/2000)+'s ease-out,'
				+'width '+(duration/2000)+'s ease-out,'
				+'height '+(duration/2000)+'s ease-out'
		)
	huFlipObj.outbox.css('overflow', 'hidden')

	// 浮层动画
	setTimeout(function(){
		//_transform = 'scale(1) perspective(2000px) rotateY(0deg)';
		overlay.css({
			'top':			parseInt(jQuery('body').scrollTop()),
			'left':			parseInt(jQuery('body').scrollLeft()),
			'width':		'100%',
			'height':		'100%'
		}).css(_huFlip.cssprefix('transform'), huFlipObj.returnTransform('overlay', 'end'))
	}, duration/2)

	setTimeout(function(){
		// 开始元素样式还原
		obj.css(_huFlip.cssprefix('transform'), huFlipObj.returnTransform('obj', 'start'))

		huFlipObj.outbox.css('overflow', 'auto')

		// 隐藏页面的滚动条
		jQuery('body').css('overflow-y','hidden')

		huFlipObj.isFliping = false;
		huFlipObj.isShowing = true;
	}, duration)

};


// 翻回去
huFlip.prototype.unflip = function(huFlipObj){
	huFlipObj = huFlipObj || this;

	if( !huFlipObj || huFlipObj.isFliping || !huFlipObj.isShowing )
		return false;

	huFlipObj.isFliping = true;

	var obj = huFlipObj.obj
		,overlay = huFlipObj.overlay
		,animation = huFlipObj.animation
		,duration = huFlipObj.duration
		,overlayCSS = huFlipObj.overlayCSS

	huFlipObj.outbox.css('overflow', 'hidden')
	overlay.css(
		// transform
		_huFlip.cssprefix('transform'),
		// overlayFade
		// eg: 'scale(0) perspective(2000px) rotateY(0deg)'
		huFlipObj.returnTransform('overlay', 'fade')
	)

	// 还原body的overflow-y样式
	jQuery('body').css('overflow-y', _huFlip.bodyScrollY)

	// 还原浮层样式至动画初始值
	setTimeout(function(){
		overlay.css(_huFlip.cssprefix('transition'), '')
				.css(_huFlip.cssprefix('transform'), overlayCSS.transform)

		huFlipObj.isFliping = false;
		huFlipObj.isShowing = false;
	}, duration/2)
};


// 把所有当前显示的翻回去
huFlip.prototype.unflipAll = function(){
	for( var i = 0; i < _huFlip.obj.length; i++ ){
		var huFlipObj = _huFlip.obj[i];
		if(huFlipObj.isInit)
			huFlipObj.unflip();
	}
}


// 全局初始化
huFlip.prototype.initGlobal = function(){
	if(_huFlip.isInit)
		return false;

	var huFlipObj = this;

	jQuery('html').css('min-height', '100% !important');

	jQuery('html').off('keyup.huFlip').on({
		'keyup.huFlip': function(e){
			var key = window.event ? e.keyCode : e.which;

			switch(key){
				case 27: // ESC
					huFlipObj.unflipAll();
					break;
			}
		}
	});

	jQuery(window).off('resize.huFlip').on({
		'resize.huFlip': function(){
			if(_huFlip.timeoutResize)
				return true;

			_huFlip.timeoutResize = setTimeout(function(){
				for( var i = 0; i < _huFlip.obj.length; i++ ){
					var huFlipObj = _huFlip.obj[i];

					if( !huFlipObj || !_huFlip.isShowing )
						continue;

					huFlipObj.overlay.css({
							'height':		jQuery(window).height(),
							'top':			parseInt(jQuery('body').scrollTop())+'px',
							'left':			parseInt(jQuery('body').scrollLeft())+'px'
						})
				}

				_huFlip.timeoutResize = null
			},1)
		}
	})

	_huFlip.isInit = true;
}


// 初始化元素
huFlip.prototype.init = function(huFlipObj){
	huFlipObj = huFlipObj || this;

	if( !huFlipObj || huFlipObj.isInit )
		return false;
		console.log(huFlipObj)

	// 初始化浮层：创建元素
	var overlayStyle = _huFlip.overlayStyle[huFlipObj.overlayStyle] || huFlipObj.overlayStyle

	huFlipObj.overlayCSS.transform = huFlipObj.returnTransform('overlay', 'start');
	jQuery.extend(huFlipObj.overlayCSS, overlayStyle);

	huFlipObj.overlay = jQuery('<div />')
							.css(huFlipObj.overlayCSS)
							.css(_huFlip.cssprefix('backface-visibility'), 'hidden')
							//.css(_huFlip.cssprefix('transform'), 'scale(0) perspective(2000px)')
							.appendTo(jQuery('body'))

	// 初始化容器
	huFlipObj.outbox = jQuery('<div/>').css({
									'width':		'100%',
									'height':		'100%',
									'display':		'inline-block',
									'position':		'relative',
									'z-index':		1,
									'text-align':	'center',
									'overflow':		'auto'
								})
							.appendTo(huFlipObj.overlay)
	jQuery('<i/>').css({
									'display':		'inline-block',
									'width':		0,
									'height':		'100%',
									'vertical-align':'middle'
								})
							.appendTo(huFlipObj.outbox)
	huFlipObj.container = jQuery('<div/>').css({
									'display':		'inline-block',
									'max-width':	'100%',
									'max-height':	'100%',
									'vertical-align':'middle'
								})
							.appendTo(huFlipObj.outbox)

	// 创建关闭按钮
	huFlipObj.btnClose = jQuery('<a/>').attr('href','javascript:;')
								.css({
										'display':		'block',
										'position':		'absolute',
										'z-index':		9999,
										'width':		30,
										'height':		30,
										'line-height':	'30px',
										'top':			5,
										'left':			5,
										'text-align':	'center',
										'font-size':	'20px',
										'font-family':	'Arial',
										'text-decoration':'none'
									})
								.css(_huFlip.btnCloseStyle[huFlipObj.overlayStyle] || huFlipObj.btnCloseStyle)
								.html('X')
								.on({
										'click':	function(){
											huFlipObj.unflip()
										}
									})
								.appendTo(this.overlay)

	// 将目标元素移动到容器中
	if( huFlipObj.el && huFlipObj.el.length )
		huFlipObj.el.appendTo(huFlipObj.container);

	// 如果目标元素是一张图片，自动添加尺寸限制
	if( huFlipObj.el.length == 1 && huFlipObj.el[0].tagName == 'IMG' ){
		var tempContainer = jQuery('<div/>').css({
											'width':	'90%',
											'height':	'90%',
											'background':'#000'
										})
										.appendTo(huFlipObj.container)
		huFlipObj.el.css({
				'max-height':	'95%',
				'max-width':	'95%',
				'display':		'inline-block',
				'vertical-align':'middle'
			})
			.appendTo(huFlipObj.outbox)
	}

	huFlipObj.isInit = true;

	huFlipObj.initGlobal();
};








// jQuery plugin
(function(jQuery){
	jQuery.fn.huFlip = function(){
		var args = jQuery.fn.huFlip.arguments;

		// 已初始化情况
		if( i = this.data('huFlip') ){
			if( !args ){
				// 没有options时，返回huFlip对象
				return i;
			}else{
				// 根据options返回参数值
				if( typeof args[0] == 'string' ){
					if( args.length > 1 ){
						if( args[0] == 'callback' ){
							// 若为多项字符串，且第一个变量为 callback，则运行第二个变量的 callback 函数
							// 例：jQuery( query ).huFlip('callback', 'fix_top')
							if( i.callback[args[1]] )
								i.callback[args[1]](i.dom);
							return i;
						}else{
							// 若为多项字符串，返回指定值组的对象
							// 例：jQuery( query ).huFlip('is_showing', 'callback')
							var _o = {};
							for( var k in args ){
								_o[args[k]] = i[args[k]]
							}
							return _o;
						}
					}else{
						// 若为单独字符串
						switch( args[0] ){
							case 'flip':
								// 执行flip
								i.flip();
								break;
							default:
								// 返回指定项的值
								return i[options];
								break;
						}
					}
				}else if( typeof args[0] == 'object' ){
					// 若为Array，返回指定值组的对象
					// 例：jQuery( query ).huFlip(['dom', 'settings'])
					var _o = {};
					for( var k in args[0] ){
						_o[args[0][k]] = i[args[0][k]]
					}
					return _o;
				}
			}

			return i;
		}

		this.each(function(){
			if( args ){
				var el = args[0]
					,options = args[1] || {}

				jQuery(this).data('huFlip', new huFlip(
											jQuery(this),
											el,
											options
										));
			}
		});
		return this;
	};
}(jQuery));
