$(function(){
  var $elem = $('.js-madori_popup');
  $elem.on('click',function(){
    if($(this).find('i').is(':visible')){
      $.colorbox({
        maxWidth:"95%",
        maxHeight:"95%",
        speed:0,
        opacity: 0.2,
        href: $(this).attr('href')
      });
    }
    return false;
  })
})
