$(function () {
  $(".menu-trigger").on("click", function () {
    $(this).hasClass("active") ? ($(this).removeClass("active"), $("gnavi-02").removeClass("in"), $(".overlay").removeClass("open")) : ($(this).addClass("active"), $("nav").addClass("open"), $(".overlay").addClass("open"));
  }),
    $(".overlay").on("click", function () {
      $(this).hasClass("open") && ($(this).removeClass("open"), $(".menu-trigger").removeClass("active"), $("nav").removeClass("open"));
    }),
    $(".gnavi_bt").click(function () {
      var a = $("#gnavi-01 .nav").html(),
        e = $('<i class="fa fa-caret-right" aria-hidden="true"></i>');
      $("#global_nav_list>li:not(.default-ls)").remove(), $("#global_nav_list").prepend(a), $("#global_nav_list>li:not(.default-ls)>a,#global_nav_list>li.inactive").prepend(e), $("#global_nav_list>li").removeClass("active height-adjust-sp"), $("#global_nav_list>li>a>br").remove();
    });
});
