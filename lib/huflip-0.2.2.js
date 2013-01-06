/* huFlip -----------------------------------------------------------------------------------------------------
 * Inspired by Windows 8

 * v0.2.2
 * Last Update: Jan.4, 2013

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

	timeoutResize:	null,

	cSize: {
		'x':	'width',
		'y':	'height'
	},

	// All variables below are default values
	// 以下变量全为默认值

	// total duration time, millisecond
	// 总动画时长，毫秒
	duration:	 	600,

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
				'perspective':	'1200px',
				'rotateY':		'-90deg'
			},
			overlayEnd: {
				'scale':		1,
				'perspective':	'1200px',
				'rotateY':		'0deg'
			},
			overlayFade: {
				'scale':		0,
				'perspective':	'1200px',
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
				'perspective':	'1200px',
				'rotateY':		'90deg'
			},
			overlayEnd: {
				'scale':		1,
				'perspective':	'1200px',
				'rotateY':		'0deg'
			},
			overlayFade: {
				'scale':		0,
				'perspective':	'1200px',
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
				'perspective':	'1200px',
				'rotateX':		'90deg'
			},
			overlayEnd: {
				'scale':		1,
				'perspective':	'1200px',
				'rotateX':		'0deg'
			},
			overlayFade: {
				'scale':		0,
				'perspective':	'1200px',
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
				'perspective':	'1200px',
				'rotateX':		'-90deg'
			},
			overlayEnd: {
				'scale':		1,
				'perspective':	'1200px',
				'rotateX':		'0deg'
			},
			overlayFade: {
				'scale':		0,
				'perspective':	'1200px',
				'rotateX':		'0deg'
			}
		}
	],

	// CSS for overlay layer
	// 浮层样式
	overlayStyle:[
		// 0, 默认
		{
			'background':	'#252525'
		},
		// 1: DARK
		{
			'background':	'#0a0a0a'
		},
		// 2
		{
			'background':	'#1b58b8'
		},
		// 3
		{
			'background':	'#b81b1b'
		},
		// 4
		{
			'background':	'#15992a'
		}
	],

	// placeholder
	// 占坑用
	'_': null
};

// CSS Compatibility check
_huFlip.csscheck = function(prop){
	if( !_huFlip.csscheck_div ){
		_huFlip.csscheck_div = document.createElement( "div" )
	}
	return ( prop in _huFlip.csscheck_div.style )
};

// CSS prefix
_huFlip.cssprefix_result = {};
_huFlip.cssprefix = function(prop, onlyPrefix){
	if( _huFlip.cssprefix_result[prop] ){
		var b = _huFlip.cssprefix_result[prop]
	}else{
		var b = ''
			,pre = [
				'-webkit-',
				'-moz-',
				'-ms-',
				'-o-'
			]
			,check		= _huFlip.csscheck(prop)

		if( !check ){
			for( var i = 0; i < pre.length; i++ ){
				if( _huFlip.csscheck(pre[i]+prop) ){
					b = pre[i];
					break;
				}
			}
		}

		_huFlip.cssprefix_result[prop] = b;
	}
	
	return onlyPrefix ? b : b+prop
}

// Add CSS Style Sheet
_huFlip.addStyleSheet = function(selector, declaration, sheet){
	var v = ''
		,sheet = sheet || _huFlip.sheet

	for(var i in declaration){
		if( jQuery.browser.msie && parseFloat(jQuery.browser.version) < 9 && i == 'opacity' ){
			v += 'filter:alpha(opacity=' + declaration[i]*100 + ')'
		}else{
			v += _huFlip.cssprefix(i) + ':' + declaration[i]+';'
		}
	}

	if( !sheet ){
		var style = document.createElement('style');
		document.getElementsByTagName('head')[0].appendChild(style);
		if (!window.createPopup) { /* For Safari */
			style.appendChild(document.createTextNode(''));
		}

		_huFlip.sheet = document.styleSheets[document.styleSheets.length - 1];

		sheet = _huFlip.sheet
	}

	if(sheet.insertRule){
		sheet.insertRule(selector+'{'+v+'}', sheet.cssRules.length)
	}else{
		sheet.addRule(selector, v)
	}
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
	this.index	= _huFlip.index

	this.objClass = 'huFlip_obj_'+this.index
	this.objClassEnd = 'huFlip_obj_'+this.index+'_end'

	// 检查属性
	this.animation = _huFlip.animation[this.animation] ? this.animation : 0

	// 计算动画时间
	this.durationA	= this.duration/4;
	this.durationB	= this.duration -  this.durationA;

	_huFlip.obj.push(this);

	_huFlip.index++;

	// bind click event to obj
	// 添加click事件
	this.obj
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
	isFliping:		false
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

	var o = huFlipObj.obj
		,overlay = huFlipObj.overlay
		,animationId = huFlipObj.animation
		,duration = huFlipObj.duration
		,durationA = huFlipObj.durationA
		,durationB = huFlipObj.durationB
		,objCSS = huFlipObj.objCSS
		,container = huFlipObj.container
		,classname = huFlipObj.objClass
		,classnameEnd = huFlipObj.objClassEnd

		,animation = _huFlip.animation[animationId]
		,size = _huFlip.cSize[animation.axis]

		// 计算数值
		,obj = {
			height:	o.outerHeight(),
			width:	o.outerWidth(),
			top:	o.offset().top,
			left:	o.offset().left
		}
		,win = {
			height:	jQuery(window).height(),
			width:	jQuery(window).width()
		}

		// 浮层的初始样式计算
		,_scale = (obj[size] / win[size]) /2
		,_left = obj.left + obj.width/2 - win.width/2
		,_top = obj.top + obj.height/2 - win.height/2
		//,_left = obj.left - jQuery('body').scrollLeft()
		//,_top = obj.top - jQuery('body').scrollTop()
		//,_width = obj.width
		//,_height = obj.height
		//,_transform = 'scale('+_scale+') perspective(1000px) rotateY(-90deg)';
		//,_transform = huFlipObj.returnTransform('overlay', 'start')
		,_transform = 'scale('+_scale+') '+huFlipObj.returnTransform('overlay', 'start')
		,_ease = 'cubic-bezier(0.075, 0.820, 0.165, 1.000)'

		,_UA		= navigator.userAgent
		,bOpera		= /Opera/.test(_UA)
		,bWebkit	= /WebKit/.test(_UA)
		,bIE		= (!!(window.attachEvent&&!window.opera))
		,bGecko		= (!bWebkit&&_UA.indexOf("Gecko")!=-1)

	// 隐藏页面的滚动条
	if(!bGecko)
		jQuery('body').addClass('huFlip_body')

	// 开始元素动画
	o.addClass(classname)
		.addClass(classnameEnd)

	// 浮层初始css
	overlay.css(_huFlip.cssprefix('transition'),'')
		.css({
			'top':			_top,
			'left':			_left,
			//'width':		_width,
			//'height':		_height,
			'opacity':		1
		})
		.css(
			_huFlip.cssprefix('transform'),
			_transform
		)
	huFlipObj.outbox.css('overflow', 'hidden')

	// 浮层动画
	setTimeout(function(){
		//_transform = 'scale(1) perspective(1000px) rotateY(0deg)';
		overlay.css(
			_huFlip.cssprefix('transition'),
			_huFlip.cssprefix('transform')+' '+(durationB/1000)+'s '+_ease+','
				+'top '+(durationB/1000)+'s '+_ease+','
				+'left '+(durationB/1000)+'s '+_ease+','
				//+'width '+(durationB/1000)+'s '+_ease+','
				//+'height '+(durationB/1000)+'s '+_ease+','
				+'opacity '+(durationB/1000)+'s '+_ease+''
		)
		.css({
			//'width':		'100%',
			//'height':		'100%',
			'top':			0,
			'left':			0
		}).css(_huFlip.cssprefix('transform'), huFlipObj.returnTransform('overlay', 'end'))

		if(bGecko){
			setTimeout(function(){
				jQuery('body').addClass('huFlip_body')
			},50)
		}
	}, durationA)

	// 浮层动画结束
	setTimeout(function(){
		// 开始元素样式还原
		o.removeClass(classname)
			.removeClass(classnameEnd)

		huFlipObj.outbox.css('overflow', 'auto')

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
		,durationA = huFlipObj.durationA
		,durationB = huFlipObj.durationB
		,overlayCSS = huFlipObj.overlayCSS

		,_UA		= navigator.userAgent
		,bOpera		= /Opera/.test(_UA)
		,bWebkit	= /WebKit/.test(_UA)
		,bIE		= (!!(window.attachEvent&&!window.opera))
		,bGecko		= (!bWebkit&&_UA.indexOf("Gecko")!=-1)

	huFlipObj.outbox.css('overflow', 'hidden')
	overlay.css(
		// transform
		_huFlip.cssprefix('transform'),
		// overlayFade
		// eg: 'scale(0) perspective(1000px) rotateY(0deg)'
		huFlipObj.returnTransform('overlay', 'fade')
	).css('opacity',0)

	// 还原body的overflow样式
	if(bGecko){
		setTimeout(function(){
			jQuery('body').removeClass('huFlip_body')
		},50)
	}else{
		jQuery('body').removeClass('huFlip_body')
	}

	// 还原浮层样式至动画初始值
	setTimeout(function(){
		overlay.css(_huFlip.cssprefix('transition'), '')
				//.css(_huFlip.cssprefix('transform'), overlayCSS.transform)

		huFlipObj.isFliping = false;
		huFlipObj.isShowing = false;
	}, durationB)
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

	var huFlipObj	= this
		,sheets = {
			'html.huFlip_html': {
				'min-height':	'100% !important'
			},
			'body.huFlip_body': {
				'overflow':		'hidden'
			},
			'.huFlip_overlay': {
				'position':			'fixed',
				'top':				'0px',
				'left':				'0px',
				'width':			'100%',
				'height':			'100%',
				'z-index':			'1000',
				'max-width':		'100%',
				'overflow':			'hidden'
			},
			'.huFlip_overlay_btnclose': {
				'display':		'block',
				'position':		'absolute',
				'z-index':		'9999',
				'width':		'30px',
				'height':		'30px',
				'line-height':	'30px',
				'top':			'5px',
				'left':			'5px',
				'text-align':	'center',
				'font-size':	'20px',
				'font-family':	'Arial',
				'opacity':		'0.35',
				'color':		'#fff',
				'background':	'#999',
				'border':		'1px solid #fff',
				'text-decoration':'none'
			},
			'.huFlip_overlay_btnclose:hover': {
				'opacity':		'0.65'
			},
			'.huFlip_overlay_btnclose:active': {
				'opacity':		'0.25'
			},
			'.huFlip_overlay_outbox': {
				'width':		'100%',
				'height':		'100%',
				'display':		'inline-block',
				'position':		'relative',
				'z-index':		1,
				'text-align':	'center',
				'overflow':		'hidden'
			},
			'.huFlip_overlay_outbox_i': {
				'display':		'inline-block',
				'width':		0,
				'height':		'100%',
				'vertical-align':'middle'
			},
			'.huFlip_overlay_container': {
				'display':		'inline-block',
				'max-width':	'100%',
				'max-height':	'100%',
				'vertical-align':'middle'
			},
			'.huFlip_overlay_outbox > img': {
				'max-height':	'97.5%',
				'max-width':	'97.5%',
				'display':		'inline-block',
				'border':		'0',
				'vertical-align':'middle'
			},
			'.huFlip_overlay_outbox > iframe': {
				'height':		'97.5%',
				'width':		'97.5%',
				'display':		'inline-block',
				'border':		'0',
				'vertical-align':'middle'
			}
		}
	for( var i in sheets ){
		_huFlip.addStyleSheet(i, sheets[i])
	}







	jQuery('html')
		.addClass('huFlip_html')
		.off('keyup.huFlip')
		.on({
			'keyup.huFlip': function(e){
				var key = window.event ? e.keyCode : e.which;

				switch(key){
					case 27: // ESC
						huFlipObj.unflipAll();
						break;
				}
			}
		});

	jQuery(window)
		.off('resize.huFlip')
		.on({
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

	// 初始元素的样式表
	var classname = '.'+huFlipObj.objClass
		,classnameEnd = '.'+huFlipObj.objClassEnd
		,sheets = {}

	sheets[classname] = {
			'transform':	huFlipObj.returnTransform('obj', 'start'),
			'transition':	_huFlip.cssprefix('transform')+' '+(huFlipObj.durationA/1000)+'s linear'
		}
	sheets[classnameEnd] = {
			'transform':	huFlipObj.returnTransform('obj', 'end')
		}

		//sheets[classname].transition = _huFlip.cssprefix('transform')+' '+(huFlipObj.durationA/1000)+'s linear'

	for( var i in sheets ){
		_huFlip.addStyleSheet(i, sheets[i])
	}


	// 初始化浮层：创建元素
	var overlayStyle = _huFlip.overlayStyle[huFlipObj.overlayStyle] || huFlipObj.overlayStyle
	overlayStyle[_huFlip.cssprefix('transform')] = huFlipObj.returnTransform('overlay', 'start');

	huFlipObj.overlay = jQuery('<div />')
							.addClass('huFlip_overlay')
							.css(overlayStyle)
							//.css(_huFlip.cssprefix('backface-visibility'), 'hidden')
							//.css(_huFlip.cssprefix('transform'), 'scale(0) perspective(1000px)')
							.appendTo(jQuery('body'))

	// 初始化容器
	huFlipObj.outbox = jQuery('<div/>').addClass('huFlip_overlay_outbox').appendTo(huFlipObj.overlay)
						jQuery('<i/>').addClass('huFlip_overlay_outbox_i').appendTo(huFlipObj.outbox)
	// 容器元素
	huFlipObj.container = jQuery('<div/>').addClass('huFlip_overlay_container').appendTo(huFlipObj.outbox)
	// 关闭按钮
	huFlipObj.btnClose = jQuery('<a/>').attr('href','javascript:;')
								.addClass('huFlip_overlay_btnclose')
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

	// 如果目标元素是一张图片或iframe，自动添加尺寸限制
	if( huFlipObj.el.length == 1
		&& ( huFlipObj.el[0].tagName == 'IMG' || huFlipObj.el[0].tagName == 'IFRAME' )
		){
		/*
		huFlipObj.el.css({
				'max-height':	'95%',
				'max-width':	'95%',
				'display':		'inline-block',
				'vertical-align':'middle'
			})
			.appendTo(huFlipObj.outbox)*/
		huFlipObj.el.appendTo(huFlipObj.outbox)
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
								return i[args[0]];
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
