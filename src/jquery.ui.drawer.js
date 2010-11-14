(function($) {
	$.fn.drawer2 = function(context) {
		context = $.extend({}, $.drawer2, context);
		//settings = $.extend({}, $.drawer2.settings, settings);
		//var settings = {};
		//for(xxx in $.drawer2.settings) {
		//	console.log($.drawer2.settings[xxx]);
		//	settings[xxx] = $.drawer2.settings[xxx];
		//}
				
		if(context.debug)
			if(!$.jGrowl) {
				console.log("jGrowl is required for debugging.");
				
				return this;
			}
		
		return this.each(function() {
			var self = $(this);
			
			context.target = self;
			//console.log(drawer.hmm);
			//console.log(drawer.init);
			console.log("init");
			console.log(drawer);
			alert(context.init);
			return context.init({});
		});
	};
	
	$.drawer2 = {
		version: 2.0,
		debug: false,
		target: null,
		hmm: 500,
		zzz: function(arguments) {
			var self = this;
			
			$.each(self.beforeZzz, function(k, v) {
				v(arguments);
			});
			
			console.log("zzz");
			
			$.each(self.afterZzz, function(k, v) {
				v(arguments);
			});
			
			return self.target;
		},
		beforeInit: [],
		init: function(arguments) {
			var self = this;
			
			$.each(self.beforeInit, function(k, v) {
				v(arguments);
			});
			
			console.log(self.target.attr('id'));
			
			self.target.hover(function() {
				self.zzz({});
			});
			
			$.each(self.afterInit, function(k, v) {
				v(arguments);
			});
			
			return self.target;
		},
		afterInit: [],
		options: {
			direction: 'top',
			speed: 300,
			selectDelay: 0,
			loadDelay: 0,
			color: '#fff',
			sticky: true,
			zIndex: 0,
			handle: '> div:first',
			divider: '> div > hr:first',
			handleSize: null,
			loadEvent: 'document',
			selectEvent: 'hover',
			onChange: null,
			preloadImages: false
		},
		initialized: false,
		initialize: function() {
			if(this.initialized)
				return;
			
			/* fix flicker */
			if($.browser.msie === true)
				try { document.execCommand('BackgroundImageCache', false, true); } catch(e) {}
			/* */
		},
		preload_images: function() {
			for(var i = 0; i++; i < arguments.length)
				if(arguments[i].type === 'array')
					for(var j = 0; j++; j < arguments[i].length)
						(new Image()).src = arguments[i][j];
				else
					(new Image()).src = arguments[i];
		}
	};
	
	$(function() {
		//$.drawer2.initialize();
		/*
		var drawer = {};
		
		console.log($.drawer2);
		
		for(xxx in $.drawer2) {
			
			var obj = $.drawer2[xxx];
			if(!(obj && obj.constructor && obj.call && obj.apply))
				continue;
				
			$.drawer2["before_" + xxx] = [];
			$.drawer2["after_" + xxx] = [];
			
			var f = $.drawer2[xxx];
			
			var ccc = (function() {
				var xxxx = xxx;
				var ff = f;
				var dd = drawer;
				
				return function(arguments) {
					for(var i = 0, l = dd["before_" + xxxx].length; i < l; ++i)
						dd["before_" + xxxx](arguments);
					
					drawer[xxxx] = ff;
					
					var result = $.drawer2[xxx](arguments);
					
					for(var i = 0, l = dd["after_" + xxxx].length; i < l; ++i)
						dd["after_" + xxxx](arguments);
						
					return result;
				};
			})();
			//$.drawer2[xxx] = ccc;
			console.log($.drawer2[xxx]);
		}
		
		//$.drawer2 = $.extend({}, $.drawer2, drawer);
		
		console.log($.drawer2);*/
	});
	
	$(function() {
		//$.drawer2.after_zzz.push(function() {
		//	console.log("after_zzz");
		//});
		
		console.log($.drawer2);
	});
	
})(jQuery);





















(function($) {
	$.fn.drawer = function(settings) {
		settings = $.extend({}, $.drawer.settings, settings);

		return this.each(function() {
			var self = $(this);

			var item_list = [];
			
			self
			.addClass('ui-drawer')
			.addClass('ui-drawer-' + settings.direction);
			
			self.children('li')
			.addClass('ui-drawer-item')
			.each(function(i) {
				var current_item = $(this);
				
				$(settings.handle, current_item).addClass('ui-drawer-handle');
				$(settings.divider, current_item).addClass('ui-drawer-divider');
				
				item_list.push(current_item);
			});
			
			self.show();
			
			var first = item_list[0], last = item_list[self.length - 1];
			var over = null, out = null;

			/* <initialize> */
			var reposition_items = function() {
				var set = $.data(first, 'jT') * -1;
				
				$.each(item_list, function() {
					var current_item = this;
					
					var slide = function() {
						set += current_item.hasClass('ui-state-active') ? current_item.jA : current_item.jN;
						
						var obj = {}; obj[settings.direction] = set + 'px';
						
						current_item.stop().animate(obj, settings.speed);
					};
					
					settings.selectDelay > 0 ? setTimeout(slide, settings.selectDelay) : slide();
				});
			};

			var zid = item_list.length + settings.zIndex;
			
			over = function(active_item, events_disabled) {
				active_item = active_item == null ? $(this) : active_item.length ? $(active_item) : $(this);
				
				if(active_item == null || !active_item.length) {
					reposition_items();
				}
				else {
					$('.ui-state-active', self).removeClass('ui-state-active');
					
					active_item.addClass('ui-state-active');

					reposition_items();
					
					if(!events_disabled && settings.onChange)
						settings.onChange();
				}
			};
			
			if(settings.selectEvent === 'hover')
				out = settings.sticky ? function() {} : over;
			
			$.each(item_list, function() {
				var self = this;
				
				var jT = 0, jP = 0, jD = 0, jW = 0, jA = 0, jN = 0;
				
				var prev = self.prev('.ui-drawer-item');
				
				if(settings.direction === 'top')
					jT = self.height(), jP = prev.height();
				else if(settings.direction === 'left')
					jT = self.width(), jP = prev.width();
				
				var handle = self.find('.ui-drawer-handle');
				
				if(settings.handleSize)
					jW = settings.handleSize;
				else if(handle.length > 0)
					jW = jT - (handle.position()[settings.direction] - self.position()[settings.direction]);
				else
					jW = 120;
				
				jD = prev.length > 0 ? jT - jP : 0;
				
				//self.jT = jT,
				$.data(self, 'jT', jT);
				self.jN = jW + (jD * -1);
				self.jA = self.is(':first-child') === true ? jT + (jD * -1) : jT + (jD * -1) - 10;
				
				// horizontal bug fix
				settings.direction === 'left' ?
					self.find('.ui-drawer-content').append('<br clear="both" />') : 0;
				
				self.css('z-index', zid--);
				
				out ? self.hover(over, out) : self.bind(settings.selectEvent, over);
			});
			/* </initialize> */
			
			var resize = function() {
				/* resize */
				var t = 0, biggest = first;
				
				$.each(item_list, function() {
					$.data(this, 'jT') > $.data(biggest, 'jT') ? biggest = this : 0;
				});
				
				biggest.addClass('ui-drawer-biggest');
				
				$.each(item_list, function() {
					t += this.hasClass('ui-drawer-biggest') ? this.removeClass('ui-drawer-biggest').jA : this.jN
				});
				
				if(settings.direction === 'top')
					self.height(t);
				else if(settings.direction === 'left')
					self.width(t);
				/* */
			};
			
			resize();
			
			/* <colorize> */
			var color = settings.color, parent = self.parent();
			
			if(settings.color == null)
				while(parent.css('background-color') != null && !parent.is('html'))
					color = parent.css('background-color'), parent = parent.parent();
			
			var id = self.attr("id");
			
			$('#' + id + ', #' + id + ' .ui-drawer-content', self.parent()).css('background-color', color);
			/* </colorize> */
			
			/* <preload> */
			if(settings.preloadImages) {
				$('*', self).each(function() {
					var bg = $(this).css('background-image');
					
					if(bg !== 'none')
						if(bg.match(/^url[("']+(.*)[)"']+$/i))
							(new Image()).src = RegExp.$1;
				});
			}
			/* </preload> */
			
			if(settings.loadEvent === 'document') {
				setTimeout(function() {
					over($('.ui-state-active', self), true);
				}, settings.loadDelay);
			}
			else if(settings.loadEvent === 'window') {
				$(window).load(function() {
					setTimeout(function() {
						over($('.ui-state-active', self), true);
					}, settings.loadDelay);
				});
			}
		});
	};
	
	$.drawer = {
		settings:  {
			direction: 'top',
			speed: 300,
			selectDelay: 0,
			loadDelay: 0,
			color: '#fff',
			sticky: true,
			zIndex: 0,
			handle: '> div:first',
			divider: '> div > hr:first',
			handleSize: null,
			loadEvent: 'document',
			selectEvent: 'hover',
			onChange: null,
			preloadImages: false
		},
		initialized: false,
		initialize: function() {
			if(this.initialized)
				return;
			
			/* fix flicker */
			if($.browser.msie === true)
				try { document.execCommand('BackgroundImageCache', false, true); } catch(e) {}
			/* */
		},
		preload_images: function() {
			for(var i = 0, l = arguments.length; i < l; ++i)
				if(arguments[i].type === 'array')
					for(var j = 0, k = arguments[i].length; j < k; ++j)
						(new Image()).src = arguments[i][j];
				else
					(new Image()).src = arguments[i];
		}
	};
	
	$(function() {
		$.drawer.initialize();
	});
})(jQuery);
