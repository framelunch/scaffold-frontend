;
(function($) {
	var Carousel = function(elem) {
		this.init(elem);
	};
	Carousel.prototype = {
		init: function(elem) {
			var moving_flag = false;
			var mode = 'pc';
			var $slider_wrapper = $(elem);
			var $slider_inner = $slider_wrapper.children('.slider_inner');
			var $items_wrapper = $slider_inner.children('ul');
			var $items = $items_wrapper.children('li').not('.clone');
			var $bt_prev = $slider_wrapper.find('.btn_prev');
			var $bt_next = $slider_wrapper.find('.btn_next');
			var item_length = $items.length;
			var item_width = $items.eq(0).outerWidth(true);
			var t = 500;
			var current = 0;
			var autoplay_interval = ($slider_wrapper.data('interval'))? $slider_wrapper.data('interval') : 3000;
			var autoplay_timer = null;
			var autoplay_flag = $slider_wrapper.data('carousel-autoplay');
			var sp_disable_flag = $slider_wrapper.hasClass('slider_sp_disable');

			var minimum_length = 0;
			if(window.matchMedia && window.matchMedia('screen and (max-width:640px)').matches){
				//sp
				minimum_length = 3;
			}else{
				//pc
				minimum_length = 4;
				//pcの場合はdata('minimum_length')判定をする
				minimum_length = ($slider_wrapper.data('minimum_length'))? $slider_wrapper.data('minimum_length') : minimum_length;
			}

			var slider_id = $(elem).data('slider_id');

			var clone_before_length = 0;
			var clone_after_length = 0;

			var carouselEvents = [];
			function resetCarouselEvent(){
				var events = $slider_wrapper.data('carousel_events')
				$.each(events,function(i,v){
					var $elem = $(v.elem);
					$elem.off(v.eventType,v.eventFunc);
				})
			}
			function setCarouselEvent($elem,eventType,func){
				carouselEvents.push({
					'elem':$elem.on(eventType,func),
					'eventType':eventType,
					'eventFunc':func
				})
				$slider_wrapper.data('carousel_events',carouselEvents)
			}
			resetCarouselEvent();

			if (item_length < minimum_length) {
				$bt_prev.hide(0);
				$bt_next.hide(0);
				$slider_wrapper.addClass('disable_carousel')
				return;
			}

			function setPosition() {
				if (mode === 'pc') {
					$items_wrapper.css({
						'margin-left': -(item_width * (clone_before_length + current)),
					});
				} else {
					if (sp_disable_flag) {
						$items_wrapper.css({
							'margin-left': 0,
						});
					} else {
						$items_wrapper.css({
							'margin-left': -(item_width * (clone_before_length + current)) + ($slider_inner.innerWidth() - item_width) / 2,
						});
					}
				}
				moving_flag = false;
			}

			function changeSlide(num) {
				if (moving_flag) {
					return;
				}
				moving_flag = true;
				$items_wrapper.animate({
					'margin-left': parseFloat($items_wrapper.css('margin-left')) - item_width * num,
				}, {
					duration: t,
					complete: function() {
						current = current + num;
						if (current < 0) {
							current = item_length - 1;
						} else if (current >= item_length) {
							current = 0;
						}
						setPosition(num);
					}
				});
			}

			function setEvent() {
				//windowリサイズイベント
				var onWinResize = function(){
					if (window.matchMedia && window.matchMedia('screen and (max-width:640px)').matches) {
						mode = 'sp';
					} else {
						mode = 'pc';
					}
					//outerWidth()は少数点を取得出来ないので、使わない
					item_width = Number($items.eq(0).get(0).getBoundingClientRect().width) + Number($items.eq(0).css('margin-left').split('px').join('')) + Number($items.eq(0).css('margin-right').split('px').join(''));
					makeClone();
					setPosition();
				}
				setCarouselEvent($(window),'resize',onWinResize);
				$(window).trigger('resize')

				// prevクリックイベント
				var onPrevClick = function(){
					changeSlide(-1);
					return false;
				}
				setCarouselEvent($bt_prev,'click',onPrevClick);

				// nextクリックイベント
				var onNextClick = function(){
					changeSlide(+1);
					return false;
				}
				setCarouselEvent($bt_next,'click',onNextClick);

				// ポインタイベント
				$('[data-slider_id="' + slider_id + '"]').each(function() {
					var num = $(this).data('slider_index');
					var onPointerClick = function(){
						changeSlide(num - current);
						return false;
					}
					carouselEvents.push({
						'elem':$(this).on('click',onPointerClick),
						'event':{
							'click':onPointerClick
						}
					})
				})

				if (autoplay_flag) {
					//mouseenterイベント
					var onWrapperMouseEnter = function(){
						clearTimeout(autoplay_timer);
					}
					setCarouselEvent($slider_wrapper,'mouseenter',onWrapperMouseEnter);

					//mouseleaveイベント
					var onWrapperMouseLeave = function(){
						autoplay_timer = setTimeout(function() {
							clearTimeout(autoplay_timer);
							$bt_next.triggerHandler('click');
							onWrapperMouseLeave();
						}, autoplay_interval)
					}
					setCarouselEvent($slider_wrapper,'mouseleave',onWrapperMouseLeave);

					$slider_wrapper.trigger('mouseleave')
				}

				//swipe
				(function() {
					if (mode === 'sp' && !sp_disable_flag) {
						var direction, position;
						//mouseleaveイベント
						var onSliderInnerTouchStart = function(e){
							position = e.originalEvent.touches[0].pageX;
							direction = '';
						}
						setCarouselEvent($slider_inner,'touchstart',onSliderInnerTouchStart);

						var onSliderInnerTouchMove = function(e){
							if (position - e.originalEvent.touches[0].pageX > 70) { // 70px以上移動しなければスワイプと判断しない
								direction = 'left'; //左と検知
							} else if (position - e.originalEvent.touches[0].pageX < -70) { // 70px以上移動しなければスワイプと判断しない
								direction = 'right'; //右と検知
							}
						}
						setCarouselEvent($slider_inner,'touchmove',onSliderInnerTouchMove);

						var onSliderInnerTouchEnd = function(e){
							if (direction == 'right') {
								changeSlide(-1);
							} else if (direction == 'left') {
								changeSlide(+1);
							}
						}
						setCarouselEvent($slider_inner,'touchend',onSliderInnerTouchEnd);
					}
				}());
			}

			//make clone
			function makeClone() {
				if (mode === 'pc' || (mode === 'sp' && !sp_disable_flag)) {
					if ($items_wrapper.children('.clone').length == 0) {
						$items.clone().addClass('clone clone_before').prependTo($items_wrapper);
						$items.clone().addClass('clone clone_before').prependTo($items_wrapper);
						$items.clone().addClass('clone clone_after').appendTo($items_wrapper);
						$items.clone().addClass('clone clone_after').appendTo($items_wrapper);
					}
				} else {
					$items_wrapper.children('.clone').remove();
				}
				clone_before_length = $items_wrapper.children('.clone_before').length;
				clone_after_length = $items_wrapper.children('.clone_after').length;
			}

			setEvent();
		}
	};

	$.fn.Carousel = function() {
		return this.each(function() {
			new Carousel(this);
		});
	};

})(jQuery);
$(function() {
	$('.slider_wrapper').Carousel();
})
