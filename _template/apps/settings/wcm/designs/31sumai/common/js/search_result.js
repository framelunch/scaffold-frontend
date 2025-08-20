
$(function(){
	var $targets = $();
	$('.c-result_box').each(function(){
		$targets = $targets.add($(this).find('.c-name a'))
		$targets = $targets.add($(this).find('.c-explain1'))
		$targets = $targets.add($(this).find('.c-explain2 dd'))
	})

	var keys = String($('#keyword[name="q"]').val()).replace(/　/g, ' ').split(" ");
	$targets.each(function(){
		var $target = $(this)
		_.each(keys,function(v,i){
			$target.highlight(v);
		})
	})
	$('.js-highlight').css({
		"background-color":"#ff0"
	})
})
