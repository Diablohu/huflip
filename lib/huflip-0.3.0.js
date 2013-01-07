/* huFlip -----------------------------------------------------------------------------------------------------
 * Inspired by Windows 8

 * v0.2.3
 * Last Update: Jan.6, 2013

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

// tecHu
if( typeof _tecHu == 'undefined' )var _tecHu = {}

if(!_tecHu.csscheck){
	_tecHu.cssprefix_result = {};

	// CSS Compatibility check
	_tecHu.csscheck = function(prop){
		if( !_tecHu.csscheck_div ){
			_tecHu.csscheck_div = document.createElement( "div" )
		}
		return ( prop in _tecHu.csscheck_div.style )
	};
	_tecHu.csscheck_full = function(prop){
		return _tecHu.cssprefix(prop, null, true)
	};

	// CSS prefix
	_tecHu.cssprefix = function(prop, onlyPrefix, isCheck){
		if( _tecHu.cssprefix_result[prop] ){
			var b = _tecHu.cssprefix_result[prop]
		}else if( _tecHu.cssprefix_result[prop] === false ){
			if( isCheck )
				return false;
			var b = '';
		}else{
			var b = ''
				,pre = [
					'-webkit-',
					'-moz-',
					'-ms-',
					'-o-'
				]
				,check		= _tecHu.csscheck(prop)

			if( !check ){
				b = false;
				for( var i = 0; i < pre.length; i++ ){
					if( _tecHu.csscheck(pre[i]+prop) ){
						b = pre[i];
						break;
					}
				}
			}

			_tecHu.cssprefix_result[prop] = b;

			if( isCheck ){
				b = b===false ? false : true
				return b;
			}
		}

		b = b===false ? '' : b;
		
		return onlyPrefix ? b : b+prop
	}

	// check if browser support CSS3 3D transform
	_tecHu.csscheck_3d = function(){
		return _tecHu.csscheck_full('perspective')
	}
}

// Add CSS Style Sheet
if(!_tecHu.addStyleSheet){
	_tecHu.addStyleSheet = function(selector, declaration, sheet){
		var v = ''
			,sheet = sheet || _huFlip.sheet

		for(var i in declaration){
			if( jQuery.browser.msie && parseFloat(jQuery.browser.version) < 9 && i == 'opacity' ){
				v += 'filter:alpha(opacity=' + declaration[i]*100 + ')'
			}else{
				v += _tecHu.cssprefix(i) + ':' + declaration[i]+';'
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
			selector = selector.split(',')
			for( i = 0; i<selector.length ; i++){
				sheet.addRule(selector[i], v)
			}
		}
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

	if( typeof el == 'string' ){
		if( this.isImg ){
			// 强制设定为图片
			el = $('<img/>').attr('src', el)
		}else if( this.isIframe ){
			// 强制设定为Iframe
			el = $('<iframe/>').attr('src', el)
		}else{
			// 没有强制设定，自动判断
			if( /\.(jpg|jpeg|png|gif)$/i.test(el) ){
				// 若为图片
				el = $('<img/>').attr('src', el)
			}else if( /^([a-z]+\:\/\/)/i.test(el) ){
				// 若为绝对地址URL
				el = $('<iframe/>').attr('src', el)
			}else{
				// 若为其他，则判断为行文
				el = $('<div/>').html(el)
			}
		}
	}

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

	// 若el值为字符串（通常为一个URL），同时确定指向图片，可将此变量设为TRUE
	// 如果URL以.jpg、.gif等图片扩展名结尾，则会自动判断，不用设定此变量
	// 例：以下el值无需设定该变量，则会自动判断为图片
		// http://www.ooxx.com/aa/bb/cc.jpg
		// bb/cc.jpg
		// /aabb/cc.GIF
	// 例：以下el值不会自动判断为图片，如确定为图片，则需要设定此变量
		// http://www.ooxx.com/user/11/avatar
		// https://swo3rg.dm1.livefilestore.com/y1pLP2z0xbFfW43Z9ixgXKXLNZkTJQSmAnCQ3AJfMJlgpcvAaQjx7mxze14eSEplU2cGTYzGcx-4GlV7GvLbyyrtdTQ-Jn3lS54/20121218.jpg?psid=1
	isImg:			null,

	// 若el值为字符串（通常为一个URL），同时确定指向一个URL，可将此值设为TRUE
	// 如果为一个URL绝对地址，则会自动判断，不用设定此值
	// 例：以下el值无需设定该变量，则会自动判断为URL
		// http://www.ooxx.com/aa/bb/
	// 例：以下el值不会自动判断为URL，如确定为URL，则需要设定此变量
		// /aaa/bbb
		// aaa/bbb/
	isIframe:		null,

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
		,duration = huFlipObj.duration
		,durationA = huFlipObj.durationA
		,durationB = huFlipObj.durationB
		,classname = huFlipObj.objClass
		,classnameEnd = huFlipObj.objClassEnd

		,animation = _huFlip.animation[huFlipObj.animation]
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


	// 若浏览器支持CSS3 3D，则运行翻转效果
	if( _tecHu.csscheck_3d() ){
		// 开始元素动画
		o.addClass(classname)
			.addClass(classnameEnd)

		// 浮层初始css
		overlay.css(_tecHu.cssprefix('transition'),'')
			.css({
				'top':			_top,
				'left':			_left,
				//'width':		_width,
				//'height':		_height,
				'opacity':		1
			})
			.css(
				_tecHu.cssprefix('transform'),
				_transform
			)
		huFlipObj.outbox.css('overflow', 'hidden')

		// 浮层动画
		setTimeout(function(){
			overlay.css(
				_tecHu.cssprefix('transition'),
				_tecHu.cssprefix('transform')+' '+(durationB/1000)+'s '+_ease+','
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
			}).css(_tecHu.cssprefix('transform'), huFlipObj.returnTransform('overlay', 'end'))
		}, durationA)

		// 浮层动画结束
		setTimeout(function(){
			// 隐藏页面的滚动条
			jQuery('body').addClass('huFlipB')

			// 开始元素样式还原
			o.removeClass(classname)
				.removeClass(classnameEnd)

			huFlipObj.outbox.css('overflow', 'auto')

			huFlipObj.isFliping = false;
			huFlipObj.isShowing = true;
		}, duration)

	}else{
	// 若不支持，则运行放大效果
		overlay.css({
			'width':	obj.width,
			'height':	obj.height,
			'top':		obj.top,
			'left':		obj.left,
			'opacity':	0
		}).animate({
			'width':	win.width,
			'height':	win.height,
			'top':		0,
			'left':		0,
			'opacity':	1
		}, duration/2, function(){
			overlay.css({
				'width':	'100%',
				'height':	'100%'
			})

			// 隐藏页面的滚动条
			jQuery('body').addClass('huFlipB')

			huFlipObj.isFliping = false;
			huFlipObj.isShowing = true;
		})
	}
};


// 翻回去
huFlip.prototype.unflip = function(huFlipObj){
	huFlipObj = huFlipObj || this;

	if( !huFlipObj || huFlipObj.isFliping || !huFlipObj.isShowing )
		return false;

	huFlipObj.isFliping = true;

	var obj = huFlipObj.obj
		,overlay = huFlipObj.overlay
		,duration = huFlipObj.duration
		,durationA = huFlipObj.durationA
		,durationB = huFlipObj.durationB

		,_UA		= navigator.userAgent
		,bOpera		= /Opera/.test(_UA)
		,bWebkit	= /WebKit/.test(_UA)
		,bIE		= (!!(window.attachEvent&&!window.opera))
		,bGecko		= (!bWebkit&&_UA.indexOf("Gecko")!=-1)

	huFlipObj.outbox.css('overflow', 'hidden')

	// 若浏览器支持CSS3 3D，则运行翻转效果
	if( _tecHu.csscheck_3d() ){
		overlay.css(
			// transform
			_tecHu.cssprefix('transform'),
			// overlayFade
			// eg: 'scale(0) perspective(1000px) rotateY(0deg)'
			huFlipObj.returnTransform('overlay', 'fade')
		).css('opacity',0)

		// 还原浮层样式至动画初始值
		setTimeout(function(){
			overlay.css(_tecHu.cssprefix('transition'), '')

			huFlipObj.isFliping = false;
			huFlipObj.isShowing = false;
		}, durationB)

	}else{
	// 若不支持，则运行缩小效果
		overlay.css({
		}).animate({
			'width':	0,
			'height':	0,
			'top':		jQuery(window).height()/2,
			'left':		jQuery(window).width()/2,
			'opacity':	0
		}, durationA, function(){
			huFlipObj.isFliping = false;
			huFlipObj.isShowing = false;
		})
	}

	// 还原body的overflow样式
	if(bGecko){
		setTimeout(function(){
			jQuery('body').removeClass('huFlipB')
		},50)
	}else{
		jQuery('body').removeClass('huFlipB')
	}
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
			'html.huFlipH': {
				'min-height':	'100% !important'
			},
			'body.huFlipB': {
				'overflow':		'hidden'
			},
			// overlay
			'.huFlipO': {
				'position':			'fixed',
				'top':				'0px',
				'left':				'0px',
				'width':			'100%',
				'height':			'100%',
				'z-index':			'100000',
				'max-width':		'100%',
				'overflow':			'hidden',
				'color':			'#fff',
				'border':			'0',
				'padding':			'0',
				'margin':			'0',
				'backface-visibility':'hidden'
			},
			// overlay: close button
			'.huFlipOCB': {
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
			'.huFlipOCB:hover': {
				'opacity':		'0.65',
				'color':		'#fff',
				'text-decoration':'none'
			},
			'.huFlipOCB:active': {
				'opacity':		'0.25',
				'color':		'#fff',
				'text-decoration':'none'
			},
			// overlay: outbox
			'.huFlipOO': {
				'width':		'100%',
				'height':		'100%',
				'display':		'inline-block',
				'position':		'relative',
				'z-index':		1,
				'text-align':	'center',
				'overflow':		'hidden',
				'border':		'0',
				'padding':		'0',
				'margin':		'0',
				'margin-top':	(jQuery.browser.msie && parseFloat(jQuery.browser.version) < 8) ? '-8px' : '0',
				'vertical-align':'middle'
			},
			//'.huFlipOO_i': {
			'.huFlipOO:before': {
				//'display':		(jQuery.browser.msie && parseFloat(jQuery.browser.version) < 8) ? 'inline' : 'inline-block',
				'content':		'""',
				'display':		'inline-block',
				'width':		0,
				'height':		'100%',
				'vertical-align':'middle'
			},
			// overlay: container
			'.huFlipOC, .huFlipOO > img, .huFlipOO > iframe': {
				'display':		'inline-block',
				'max-width':	'100%',
				'max-height':	'100%',
				'border':		'0',
				'padding':		'0',
				'margin':		'0',
				'height':		'auto',
				'width':		'auto',
				'vertical-align':'middle'
			},
			'.huFlipOO > img, .huFlipOO > iframe': {
				'max-height':	'97.5%',
				'max-width':	'97.5%'
			}
		}
	for( var i in sheets ){
		_tecHu.addStyleSheet(i, sheets[i])
	}







	jQuery('html')
		.addClass('huFlipH')
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
			'transition':	_tecHu.cssprefix('transform')+' '+(huFlipObj.durationA/1000)+'s linear'
		}
	sheets[classnameEnd] = {
			'transform':	huFlipObj.returnTransform('obj', 'end')
		}

	for( var i in sheets ){
		_tecHu.addStyleSheet(i, sheets[i])
	}


	// 初始化浮层：创建元素
	var overlayStyle = _huFlip.overlayStyle[huFlipObj.overlayStyle] || huFlipObj.overlayStyle
	if( _tecHu.csscheck_3d() )
		overlayStyle[_tecHu.cssprefix('transform')] = huFlipObj.returnTransform('overlay', 'start');

	huFlipObj.overlay = jQuery('<div />')
							.addClass('huFlipO')
							.css(overlayStyle)
							.appendTo(jQuery('body'))

	// 初始化容器
	huFlipObj.outbox = jQuery('<div/>').addClass('huFlipOO').appendTo(huFlipObj.overlay)
						//jQuery('<i/>').addClass('huFlipOO_i').appendTo(huFlipObj.outbox)
	// 容器元素
	huFlipObj.container = jQuery('<div/>').addClass('huFlipOC').appendTo(huFlipObj.outbox)
	// 关闭按钮
	huFlipObj.btnClose = jQuery('<a/>').attr('href','javascript:;')
								.addClass('huFlipOCB')
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
	jQuery.fn.huflip = jQuery.fn.huFlip
}(jQuery));
