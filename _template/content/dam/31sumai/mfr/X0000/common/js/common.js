

// Page top
var topBtn = $('#page-top');
topBtn.hide();
//スクロールが100に達したらボタン表示 (Shows button when scroll exceeds 100)
$(window).scroll(function () {
	if ($(this).scrollTop() > 100) {
		topBtn.fadeIn();
	} else {
		topBtn.fadeOut();
	}
});
//スクロールしてトップ (Scroll to top)
topBtn.click(function () {
	$('body,html').animate({
		scrollTop: 0
	}, 500);
	return false;
});


$(function(){
	// Navigation tabs top and bottom synchronization
	$('.nav-tabs li a').click(function (e) {
		e.preventDefault();
		$('html, body').animate({
			scrollTop: $('.tabs-top').offset().top
		}, 500);
		var href = $(this).attr('href');
		$('.nav-tabs li').removeClass('active');
		$('.nav-tabs li a[href="'+href+'"]').closest('li').addClass('active');
		$('.tab-pane').removeClass('in active');
		$('.tab-pane'+href).addClass('in active');
	});

	if(/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){

		// SP navigation offsets
		function checkScrollHeight(){
			footer_nav = $('.footer-nav-01 .btn-cont');
			h = $('.header-01-wrap').innerHeight();

			if ($(window).scrollTop() > h) footer_nav.fadeIn().css('display','table');
			else footer_nav.fadeOut();

			if ($(window).scrollTop() > 4){
				$('.header-02 .navbar-toggle').css('margin-top', '0');
				$('#gnavi-01').css('top','64px');
			}else{
				$('.header-02 .navbar-toggle').css('margin-top', '5px');
				$('#gnavi-01').css('top','69px');
			}
		}

		$(window).scroll(function (){
			checkScrollHeight();
		});

		// SP navigation toggles
		var tglnav = $('#toggle-nav');

		function close_nav_sp(){
			$('.navbar-collapse').on('hidden.bs.collapse', function() {
				$('body').removeClass('nav-sp-open').find('#nav-sp-overlay').remove();
				tglnav.closest('.navbar-header').removeClass('open');
			});
		}

		function open_nav_sp(){
			$(tglnav).closest('.navbar-header').addClass('open');
			$('body').addClass('nav-sp-open').append('<div id="nav-sp-overlay"></div>');

			$('#nav-sp-overlay').on('click', function(e){
				e.stopPropagation();
				tglnav.click();
			});
		}

		tglnav.click(function(){
			if($(this).hasClass('collapsed'))
			open_nav_sp();
			else
			close_nav_sp();
		});
	}

	/* Safari Browser */
	if(!!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/)) {
		document.getElementsByTagName('body')[0].className += ' is-safari';
	}

	/* IE Browser */
	if (navigator.appName == 'Microsoft Internet Explorer' ||
	!!(navigator.userAgent.match(/Trident/) || navigator.userAgent.match(/rv 11/))
	|| (typeof $.browser !== "undefined" && $.browser.msie == 1)){
		document.getElementsByTagName('body')[0].className += ' is-ie';
	}

	/* Detect if OSX */
	if(navigator.appVersion.indexOf("Mac")!=-1){
		document.getElementsByTagName('body')[0].className += ' mac';
	}
})

//////////////////// AEM components ////////////////////

// colorboxがopen状態かどうかをbodyにclass付与する
$(function(){
	var className = "colorboxOpen";
	$(document).bind('cbox_open', function(){
		$('body').addClass(className);
	}).on('cbox_closed',function(){
		$('body').removeClass(className);
	});
})

// pc/spモード管理（&イベントフック定義）
// 以下の様な感じでviewモード変更時とload完了時にfunctionが実行される
//
// viewMode.onChange(function(from,to){
// 	if(to === 'pc'){}
// 	else if(to === 'sp'){}
// })
//
var ViewMode = function() {
	var currentMode = '';
};
ViewMode.prototype = {
	onChange:function(func){
		var _this = this;
		$(function(){
			var mode = _this.getMode();
			func(_this.currentMode,mode);
		})
		$(window).on('resize', function(){
			var mode = _this.getMode();
			if(mode != _this.currentMode){
				func(_this.currentMode,mode);
				_this.currentMode = mode;
			}
		});
	},
	getMode: function() {
		var mode = (window.matchMedia && window.matchMedia('screen and (max-width:767px)').matches)? 'sp' : 'pc';
		return mode;
	},
	isPc: function() {
		var _this = this;
		var rtn = (_this.getMode() == 'pc')? true : false;
		return rtn;
	},
	isSp: function() {
		var _this = this;
		var rtn = (_this.getMode() == 'sp')? true : false;
		return rtn;
	},
}
var viewMode = new ViewMode();

$(function(){
	var $imgs = $('img[data-b_sp_img]').each(function(){
		$(this).attr('data-b_pc_img',$(this).attr('src'))
	})
	viewMode.onChange(function(from,to){
		if(to === 'pc'){
			$imgs.each(function(){
				$(this).attr('src',$(this).attr('data-b_pc_img'))
			})
		}else if(to === 'sp'){
			$imgs.each(function(){
				$(this).attr('src',$(this).attr('data-b_sp_img'))
			})
		}
	})
})

// 2220_トップキービジュアル
$(function(){
	$('.js-b-p-top_keyvisual').each(function(){
		var $_this = $(this);
		var isSlide = ($_this.hasClass('b-p-top_keyvisual_slide'))? true:false;
		var isLoop = ($_this.data('repeat') == 'loop')? true:false;
		var autoPlaySpan = (typeof $_this.data('auto_play_span') == 'undefined')? 5000:$_this.data('auto_play_span');
		var current = -1;
		var $itemsWrapper = $_this.find('ul');
		var $items = $itemsWrapper.find('li');
		var itemsLength = $items.length;
		var $markers = null;
		var timer = null;

		function init(){
			var $markerContainer = $('<div class="js-b-marker b-markerWrapper"></div>').appendTo($_this)
			// if(isLoop){
				for(var i=0 ; i<itemsLength ; i++){
					$('<a href="#" class="b-marker" data-num="'+i+'"></a>').appendTo($markerContainer).on('click',function(){
						changeSlide($(this).data('num'));
						return false;
					});
				}
				$_this.on('swipeleft', function(){
					autoNext();
				}).on('swiperight', function(){
					autoPrev();
				})
			// }
			if(isSlide){
				$items.filter(':first').clone().appendTo($itemsWrapper);
				$items.filter(':last').clone().prependTo($itemsWrapper);
			}
			if(!isSlide){
				setInterval(function(){
					if(itemsLength >= 1){
						$itemsWrapper.outerHeight($items.eq(current).outerHeight());
					}
				},0)
			}

			$markers = $markerContainer.children();
			changeSlide(0);
		}
		function next(){
			var num = current+1;
			if(num >= itemsLength){
				if(isLoop){
					num = 0;
					changeSlide(num);
				}
			}else{
				changeSlide(num);
			}
		}
		function autoNext(){
			var num = current+1;
			if(isSlide && num >= itemsLength && isLoop){
				changeSlide(num,function(){
					current = 0;
					$itemsWrapper.stop().css({
						'margin-left':-(100)+'%'
					})
				});
			}else{
				next();
			}
		}
		function prev(){
			var num = current-1;
			num = (num < 0)? (itemsLength-1) : num;
			changeSlide(num);
		}
		function autoPrev(){
			var num = current-1;
			if(isSlide && num < 0 && isLoop){
				changeSlide(num,function(){
					current = (itemsLength-1);
					$itemsWrapper.stop().css({
						'margin-left':-((itemsLength)*100)+'%'
					})
				});
			}else{
				prev();
			}
		}
		function changeSlide(num,compFunc){
			if(num == current) return false;
			clearTimer();
			var t = 500;
			if(isSlide){
				$itemsWrapper.stop().animate({
					'margin-left':-((num+1)*100)+'%'
				},t,function(){
					if(typeof compFunc == 'function'){
						compFunc();
					}
				})
			}else{
				$items.fadeOut(t).eq(num).fadeIn(t)
			}
			var tmp = (num <= (itemsLength-1))? num : itemsLength%num;
			$markers.removeClass('b-current').eq(tmp).addClass('b-current');
			setTimer()
			$items.removeClass('b-current').eq(tmp).addClass('b-current')
			current = num;
		}
		function setTimer(){
			timer = setTimeout(function(){
				autoNext();
			},autoPlaySpan)
		}
		function clearTimer(){
			clearTimeout(timer);
		}
		init();
	})
})

// 現地案内図colorbox
$(function(){
	var $annailink = $('.js-annaizu_link');
	function setColorBox(){
		$annailink.each(function(){
			var $modal = $('.js-b-annaizu_modal');
			$(this).colorbox({
				inline:true,
				href:$modal,
				opacity:0.8,
				width:'900px',
				maxHeight:'90%',
				fixed:true,
				// reposition:true,
			})
		});
	}
	function removeColorBox(){
		$annailink.each(function(){
			$(this).colorbox.remove();
		})
	}
	viewMode.onChange(function(from,to){
		if(to === 'pc'){
			setColorBox();
		}else if(to === 'sp'){
			removeColorBox()
		}
	})
})


// 間取りcolorbox&accordion
$(function(){
	var $links = $('.js-b-madori_link');

	viewMode.onChange(function(from,to){
		if(to === 'pc'){
			removeAccordion()
			setColorBox();
		}else if(to === 'sp'){
			removeColorBox();
			setAccordion()
		}
	})
	function setColorBox(){
		$links.each(function(){
			var $anchor = $(this).children('a');
			var $modal = $(this).next('.js-b-madori_modal');
			$anchor.colorbox({
				rel:'madori',
				inline:true,
				href:$modal,
				opacity:0.8,
				width:'1042px',
				fixed:true,
				// maxWidth:"100%",
				maxHeight:"100%"
				// reposition:true,
			})
		});
	}
	function removeColorBox(){
		$links.each(function(){
			var $anchor = $(this).children('a');
			$anchor.colorbox.remove();
		})
	}
	function setAccordion(){
		$links.each(function(){
			var $anchor = $(this).children('a');
			var $modal = $(this).next('.js-b-madori_modal').slideUp(0);
			$anchor.on('click',function(){
				$anchor.toggleClass("js-opened");
				$modal.slideToggle(300);
			})
		})
	}
	function removeAccordion(){
		$links.each(function(){
			var $anchor = $(this).children('a');
			var $modal = $(this).next('.js-b-madori_modal').slideUp(0);
			$anchor.off('click')
		})
	}
});

// 物件_タブ（ページ内リンク）
$(function(){
	$('.js-b-l-tab_hash').each(function(){
		var $container = $(this);
		var isSpAccordion = ($container.hasClass('b-l-tab_hash_accordion'))? true:false;
		var $links = $container.find('.js-b-tab_ttl');
		var $headerLinkWrapper = $container.find('.js-b-tab_hash_header');
		var $footerLinkWrapper = $container.find('.js-b-tab_hash_footer');
		$headerLinkWrapper.append($links.clone().addClass('js-length-'+$links.length).addClass('js-b-tab_ttl-header'));
		$footerLinkWrapper.append($links.clone().addClass('js-length-'+$links.length).addClass('js-b-tab_ttl-footer'));
		var $contents = $container.find('.js-b-tab_content').hide(0);
		var $bts = $container.find('.js-b-tab_ttl');
		var current = 0;

		viewMode.onChange(function(from,to){
			$bts.eq(0).children('a').triggerHandler('click');
		})

		$bts.on('click',function(){
			var $a = $(this).children('a');
			var num = $a.data('tab_num');
			var $targetContent = $contents.filter('[data-tab_num="'+num+'"]');
			var $targetBts = $bts.children('a').filter('[data-tab_num="'+num+'"]');

			if(isSpAccordion && viewMode.isSp()){
				if($targetBts.eq(0).hasClass('b-active')){
					$targetContent.slideUp(200);
					$targetBts.removeClass('b-active');
				}else{
					$targetContent.slideDown(200);
					$targetBts.addClass('b-active');
				}
			}else{
				$contents.hide(0);
				$targetContent.show(0);
				$bts.children('a').removeClass('b-active');
				$targetBts.addClass('b-active');
				if($(this).hasClass('js-b-tab_ttl-footer')){
					var posTop = $headerLinkWrapper.offset().top + $headerLinkWrapper.height();
					$("html, body").animate({scrollTop:posTop}, 500);
				}
			}
			current = num;
			return false;
		}).eq(0).triggerHandler('click');

	});

})

// 物件ギャラリー
$(function(){
	$('.js-b-p-image_gallery').each(function(){
		var current = 0;
		var $thumbs_wrapper = $(this).find('.js-b-p-thumbnail_image');
		var $thumbs = $thumbs_wrapper.children();
		var $large_wrapper = $(this).find('.js-b-p-large_image');
		var $large = $thumbs_wrapper.clone().prependTo($large_wrapper);
		var $prev = $large_wrapper.find('.js-b-prev');
		var $next = $large_wrapper.find('.js-b-next');
		var timer = null;
		$large.find('a').children().unwrap();

		function eventSet(){
			$thumbs.each(function(){
				var $li = $(this);
				var num = $(this).index();
				$li.find('a').on('click',function(){
					changeSlide(num);
				})
			})
			$prev.on('click',function(){
				changeSlide(current-1)
			})
			$next.on('click',function(){
				changeSlide(current+1)
			})
		}
		eventSet();

		function setTimer(){
			clearTimeout(timer);
			timer = setTimeout(function(){
				changeSlide(current+1)
			},5000);
		}
		setTimer();

		function changeSlide(num){
			if(num == current) return;
			if(num < 0){
				num = $thumbs.length - 1;
			}else if(($thumbs.length - 1) < num){
				num = 0;
			}
			$large.stop().animate({
				'margin-left':-(num*100)+'%'
			},function(){
				current = num;
				setTimer();
			})
		}
	})
	//間取り詳細　平面図と家具配置例の切り替え
	$(function() {
		$('.planSpecWrap .planSpec .zumen a.heimenBtn').on('click', function() {
			$(this).siblings('div').addClass('heimen');
			$(this).siblings('div').removeClass('kagu');
			$(this).addClass('active');
			$(this).siblings('a.active').removeClass('active');
		});
	$('.planSpecWrap .planSpec .zumen a.kaguBtn').on('click', function() {
		$(this).siblings('div').addClass('kagu');
		$(this).siblings('div').removeClass('heimen');
		$(this).siblings('a.active').removeClass('active');
		$(this).addClass('active');
		});
	});
})
