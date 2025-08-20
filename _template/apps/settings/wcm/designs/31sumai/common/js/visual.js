$(function() {

	// main visual
	var fadeSpeed  = 1000;
	var slideSpeed = 6000;

 	var visual = $('#visual ul.cf');
	var slides = visual.find('li');
	var cnt = slides.length

	var pagination = $('#visual ul.pagination');

	$.each(slides, function() {
		pagination.append($('<li><a href="#"></a></li>'));
	});

	var paginations = pagination.find('li a');

	var currentIndex = 0;
	var slideTimer = null;
	var running = false;

	function slideTo(next) {
		if (running) {
			return false;
		}

		running = true;

		if (next == null) next = (currentIndex + 1) % cnt;

		setCurrentPagination(next);
		slides.eq(next).css('zIndex', cnt);

		if (transitionend) {
			slides.eq(currentIndex).one(transitionend, function() {
				setCurrentSlide(next);
				running = false;
			}).addClass('fade');
		}
		else {
			slides.eq(currentIndex).fadeOut(fadeSpeed, function() {
				setCurrentSlide(next);
				running = false;
			});
		}
	}

	function setCurrentSlide(newIndex) {
		slides.removeClass('current').eq(newIndex).addClass('current').css('zIndex', cnt + 1);

		if (newIndex != currentIndex) {
			prev_slide = slides.eq(currentIndex).css('zIndex', '-1');
			if (transitionend) {
				prev_slide.removeClass('fade')
			}
			else {
				prev_slide.show();
			}
		}
		else {
			setCurrentPagination(newIndex);
		}

		currentIndex = newIndex;
	}

	function setCurrentPagination(newIndex) {
		paginations.removeClass('current').eq(newIndex).addClass('current');
	}

	function startSlide() {
		if (slideTimer == null) {
			slideTimer = setInterval(slideTo, slideSpeed);
		}
	}

	function stopSlide() {
		if (slideTimer != null) {
			clearInterval(slideTimer);
			slideTimer = null;
		}
	}

	var transitionend = function() {
		var el = document.createElement('div');
		var transitions = {
			'WebkitTransition' : 'webkitTransitionEnd',
			'MozTransition'    : 'transitionend',
			'transition'       : 'transitionend'
		};
		for (var t in transitions) {
			if (el.style[t] !== undefined) {
				return transitions[t];
			}
		}
	}();

	//$('#visual').hover(stopSlide, startSlide);

	pagination.on('click', 'li a', function() {
		if (!$(this).hasClass('current')) {
			stopSlide();
			slideTo(paginations.index(this));
			startSlide();
		}
		return false;
	});

	//swipe
	(function() {
		if (window.matchMedia && window.matchMedia('screen and (max-width:640px)').matches) {
			// sp
			var direction, position;
			//mouseleaveイベント
			var onSliderInnerTouchStart = function(e){
				position = e.originalEvent.touches[0].pageX;
				direction = '';
			}
			visual.on('touchstart',onSliderInnerTouchStart);

			var onSliderInnerTouchMove = function(e){
				if (position - e.originalEvent.touches[0].pageX > 70) { // 70px以上移動しなければスワイプと判断しない
					direction = 'left'; //左と検知
				} else if (position - e.originalEvent.touches[0].pageX < -70) { // 70px以上移動しなければスワイプと判断しない
					direction = 'right'; //右と検知
				}
			}
			visual.on('touchmove',onSliderInnerTouchMove);

			var onSliderInnerTouchEnd = function(e){
				if (direction == 'right') {
					var next = (currentIndex-1 < 0)? cnt-1 : currentIndex-1;
					stopSlide();
					slideTo(next);
					startSlide();
				} else if (direction == 'left') {
					var next = (currentIndex+1 >= cnt)? 0 : currentIndex+1;
					stopSlide();
					slideTo(next);
					startSlide();
				}
			}
			visual.on('touchend',onSliderInnerTouchEnd);
		}
	}());

	setCurrentSlide(0);
	startSlide();

});
