/*--------------------------------------------------------------------------*/
/* common.function */
/*--------------------------------------------------------------------------*/

var CJS = {
  DEBUG: false,
  init: function() {
    CJS.DEBUG = (location.hash == '#debug') ? true : CJS.DEBUG
  },

  MSG: {
    MSG_ANY_ERROR: 'エラーが発生いたしました。\nお手数をお掛けいたしますが、時間をおいて再度お試しくださいますようお願いいたします。',
    MSG_NETWORK_ERROR: '通信エラーが発生いたしました。\nお手数をお掛けいたしますが、時間をおいて再度お試しくださいますようお願いいたします。',
  },

  /*
  	// 以下の様に使用する
  	// 単一＆複数ajax処理を並列処理します（$.whenでまとめているので、全てのajax通信が完了してからdone||failが実行されます）
  	// ネットワークエラーやjson内のstatusエラーはajax内部処理にてハンドリングします
  	CJS.ajax([
  		{url: URL.GET_ATTEND,data: {bukkenCd: BUKKEN_CODE,}},
  		{url: URL.GET_WAKU_LIST,data: {bukkenCd: BUKKEN_CODE,}}
  	]).done(function(res) {
  		//成功時処理
			//console.log(res[0],res[1])
  	}).fail(function() {
  		//失敗時処理
  	})
  */
  ajax: function(args) {
    var defer = $.Deferred();
    var funcs = [];
    _.each(args, function(options, i) {
      funcs.push(CJS._deferred_ajax(options));
    });
    $.when.apply($, funcs).done(function() {
      defer.resolve(arguments)
    }).fail(function(e) {
      // 通信エラー
      alert(CJS.MSG.MSG_NETWORK_ERROR);
      defer.reject();
    })
    return defer.promise();
  },
  _deferred_ajax: function(options) {
    var defer = $.Deferred();
    var defaults = {
      type: 'GET',
      url: '',
      data: {},
      dataType: 'json',
    }
    var options_merge = $.extend(true, {}, defaults, options);
    $.ajax(options_merge).done(function(json) {
      if (CJS.DEBUG && json.resultStatus == 200) {
        defer.resolve(json.data.contents)
      } else if (!CJS.DEBUG && json.resultStatus == 'success') {
        defer.resolve(json.data)
      } else {
        defer.reject();
      }
    }).fail(function() {
      defer.reject();
    });
    return defer.promise();
  },
}
CJS.init();

/*--------------------------------------------------------------------------*/
/* anchor link active check */
/*--------------------------------------------------------------------------*/
$(function() {
  var $anchors = $('.js-anchor_active_check').find('a[href^="#"]');
  $anchors.each(function() {
    var id = $(this).attr('href');
    if ($(id).length) {
      $(this).addClass('active');
    } else {
      $(this).addClass('disabled');
    }
  });
});
/*--------------------------------------------------------------------------*/
/* maptag change image */
/*--------------------------------------------------------------------------*/
$(function() {
  var $map = $('.js-area_map');
  $map.each(function() {
    var $areas = $(this).find('area');
    var $img = $('img[usemap="#' + $(this).attr('name') + '"]');
    var defaultSrc = $img.attr('src');

    $areas.each(function() {
      var suffix = '-' + $(this).data('area');
      var src = defaultSrc.replace(/(\.gif|\.jpg|\.png)/g, suffix + '$1');
      $(this).data('hover_src', src);

      $('<img>').attr('src', $(this).data('hover_src'));
    }).on({
      'mouseenter': function() {
        $img.attr('src', $(this).data('hover_src'));
      },
      'mouseleave': function() {
        $img.attr('src', defaultSrc);
      }
    })
  })
});
/*--------------------------------------------------------------------------*/
/* close window button */
/*--------------------------------------------------------------------------*/
$(function() {
  var $bt = $('.js-window_close');
  $bt.on('click', function() {
    window.close();
    return false;
  })
});

/*--------------------------------------------------------------------------*/
/* login status view update (include username show) */
/*--------------------------------------------------------------------------*/
$(function() {
  var $only_login = $('.js-only_logged_in');
  var $only_logout = $('.js-only_logged_out');
  var $username = $('.js-username');

  $.cookie.json = false;
  var COOKIE = {
    un: $.cookie('un'),
    cid: $.cookie('cid')
  }

  if (typeof COOKIE['un'] === 'undefined' && typeof COOKIE['cid'] === 'undefined') {
    //status logout
    $only_login.hide(0);
    $only_logout.show(0);
  } else {
    //status login
    $only_login.show(0);
    $only_logout.hide(0);
    $username.text(COOKIE['un']);
  }
});

/*--------------------------------------------------------------------------*/
/* login href update (for redirect path) */
/*--------------------------------------------------------------------------*/
$(function(){
	 var $anchors = $('.js-login_anchor');
	 var currentPath = location.pathname + location.search + location.hash
	 $anchors.each(function(){
		 var href = $(this).attr('href')
		 $(this).attr('href',href + '?redirectFlg=1&refererUrl=' + encodeURIComponent(currentPath))
	 })
})

/*--------------------------------------------------------------------------*/
/* favorite button (by cookie) */
/*--------------------------------------------------------------------------*/
$(function() {
  var data_attr = 'bukken_code';
  var class_added = 'added';
  var $bts = $('.js-add_favorite');
  var $counter = $('.js-fav_counter');

  function setFavBtEvent() {
    $bts.on('click', function() {
      var favs = getCookieFavs();
      var code = $(this).data(data_attr);

      if ($(this).hasClass(class_added)) {
        //解除
        favs = _.without(favs, code);
      } else {
        //追加
        favs.push(code);
      }
      favs = _.uniq(favs);
      setCookieFavs(favs);
			updateSpFavCounter();
      updateFavBtStatus();
      return false;
    })
  }

  function getCookieFavs() {
    $.cookie.json = true;
    var favs = $.cookie('fav');
    if (typeof favs === 'undefined') {
      favs = [];
    }
    return favs;
  }

  function setCookieFavs(favs) {
    $.cookie.json = true;
    $.cookie('fav', favs, {
      expires: 3650,
      path: '/'
    })
  }

  function updateFavBtStatus() {
    var favs = getCookieFavs();
    $bts.each(function() {
			var addTxt = ($(this).find('span').data('fav_add'))? $(this).find('span').data('fav_add') : 'お気に入り';
			var removeTxt = ($(this).find('span').data('fav_remove'))? $(this).find('span').data('fav_remove') : '登録済み';
      var code = $(this).data(data_attr);
      if ($.inArray(code, favs) < 0) {
        //登録してない
        $(this).removeClass(class_added).find('span').text(addTxt);
      } else {
        //登録済み
        $(this).addClass(class_added).find('span').text(removeTxt);
      }
    })
  }
	function updateSpFavCounter(){
		var cnt = getCookieFavs().length;
		$counter.html(cnt);
	}
	updateSpFavCounter();
  updateFavBtStatus();
  setFavBtEvent();
});

/*--------------------------------------------------------------------------*/
/* #btn_pagetop */
/*--------------------------------------------------------------------------*/
$(function() {
  $('body').on('click', 'a', function() {
    if (location.href.replace(/#.*$/, '') != $(this).prop('href').replace(/#.*$/, '')) return true;

    var anchor = $(this).attr('href').replace(/^.*#/, '');
    var target = $(anchor == '#' || anchor == '' ? 'html' : '#'+anchor.replace(/[ !"#$%&'()*+,.\/:;<=>?@\[\\\]^`{|}~]/g, '\\$&'));
    if (!target.is(':visible')) return true;
    var position = target.offset().top;
    $('body, html').animate({
      scrollTop: position
    }, 500, 'swing');
    return false;
  });
});
/*--------------------------------------------------------------------------*/
/* input:focus */
/*--------------------------------------------------------------------------*/
$(function() {
  $('input:text').focus(function() {
    if ($(this).val() == $(this).data('explanation')) {
      $(this).val('');
    }
  }).blur(function() {
    if ($(this).val() == '' && $(this).data('explanation')) {
      $(this).val($(this).data('explanation'));
    }
  });
});

/*--------------------------------------------------------------------------*/
/* img:smartphone change image
/*--------------------------------------------------------------------------*/
$(function() {
  var attrSpSrc = 'data-sp_src';
  var attrPcSrc = 'data-pc_src';
  var $imgs = $('img[' + attrSpSrc + ']');

  $imgs.each(function() {
    $(this).attr(attrPcSrc, $(this).attr('src'));
  })
  $(window).on('resize', function() {
    resetImgPath();
  })

  resetImgPath();

  function resetImgPath() {
    if (window.matchMedia('screen and (max-width:640px)').matches) {
      //sp
      $imgs.each(function() {
        $(this).attr('src', $(this).attr(attrSpSrc));
      })
    } else {
      //pc
      $imgs.each(function() {
        $(this).attr('src', $(this).attr(attrPcSrc));
      })
    }
  }
});

/*--------------------------------------------------------------------------*/
/* smartphone change class
/*--------------------------------------------------------------------------*/
$(function() {
  var attrSpClass = 'data-sp_class';
  var attrPcClass = 'data-pc_class';
  var $items = $('[' + attrSpClass + '],[' + attrPcClass + ']');

  $items.each(function() {
    if (typeof($(this).attr(attrSpClass)) == 'undefined') {
      $(this).attr(attrSpClass, '')
    }
    if (typeof($(this).attr(attrPcClass)) == 'undefined') {
      $(this).attr(attrPcClass, '')
    }
  })

  $(window).on('resize', function() {
    changeClass();
  })

  function changeClass() {
    $items.each(function() {
      var $elem = $(this);
      if (window.matchMedia('screen and (max-width:640px)').matches) {
        //sp
        $items.each(function() {
          var $elem = $(this);
          var pcClassesArr = String($(this).attr(attrPcClass)).split(' ');
          $.each(pcClassesArr, function(i, v) {
            $elem.removeClass(v)
          });
          var spClassesArr = String($(this).attr(attrSpClass)).split(' ');
          $.each(spClassesArr, function(i, v) {
            $elem.addClass(v)
          });
        });
      } else {
        //pc
        $items.each(function() {
          var $elem = $(this);
          var spClassesArr = String($(this).attr(attrSpClass)).split(' ');
          $.each(spClassesArr, function(i, v) {
            $elem.removeClass(v)
          });
          var pcClassesArr = String($(this).attr(attrPcClass)).split(' ');
          $.each(pcClassesArr, function(i, v) {
            $elem.addClass(v)
          });
        });
      }
    })
  }
  changeClass();
});

/*--------------------------------------------------------------------------*/
/* accordion */
/*--------------------------------------------------------------------------*/
$(function() {
  var t = 200;
  var attr_target = 'data-accordion_target';
  var attr_closetxt = 'data-close_txt';
  var attr_opentxt = 'data-open_txt';
  var attr_onlysp = 'data-accordion_onlysp';
  var class_close = 'js-accordion_close';
  var $bts = $('.js-accordion_bt');
  var $contents = $('.js-accordion_content');

  $bts.each(function() {
    var mode = 'pc';
    var $bt = $(this);
    var target = $bt.attr(attr_target);
    var $content = $contents.filter('[' + attr_target + '="' + target + '"]');
    if (typeof $bt.attr(attr_onlysp) !== "undefined" && $bt.attr(attr_onlysp) === 'true') {
      if (window.matchMedia('screen and (max-width:640px)').matches) {
        init();
      } else {
        //attr_onlyspがtrueなので、pcの場合は何もしない
      }
    } else {
      init();
    }

    function init() {
      $content.slideUp(0);
      $bt.addClass(class_close);
      $bt.attr(attr_opentxt, $bt.text());

      $bt.on('click', function() {
        if ($(this).hasClass(class_close)) {
          $content.slideDown(t);
          $(this).removeClass(class_close);
          if (typeof $(this).attr(attr_closetxt) !== "undefined") {
            $(this).text($(this).attr(attr_closetxt));
          }
          $(this).addClass('c-btn_accordion_close')
        } else {
          $content.slideUp(t);
          $(this).addClass(class_close);
          if (typeof $(this).attr(attr_closetxt) !== "undefined") {
            $(this).text($(this).attr(attr_opentxt));
          }
          $(this).removeClass('c-btn_accordion_close')
        }
        return false;
      })
    }
  })
});

/*--------------------------------------------------------------------------*/
/* sp footer accordion */
/*--------------------------------------------------------------------------*/
$(function() {
  var mode = 'pc';
  var t = 200;
  var attr_target = 'data-footer_accordion_target';
  var $bts = $('.js-footer_accordion_bt');
  var $contents = $('.js-footer_accordion_content');
  var plus_icon = 'fa-plus-square-o'
  var minus_icon = 'fa-minus-square-o'

  $(window).on('resize', winResize);

  function winResize() {
    if (window.matchMedia('screen and (max-width:640px)').matches) {
      if (mode != 'sp') {
        $contents.stop().slideUp(0);
        mode = 'sp';
      }
    } else {
      if (mode != 'pc') {
        $contents.stop().slideDown(0);
        mode = 'pc';
      }
    }
  }
  winResize();

  $bts.each(function() {
    var $bt = $(this);
    var target = $bt.attr(attr_target);
    var $content = $contents.filter('[' + attr_target + '="' + target + '"]');

    $bt.parent().on('click', function() {
      if (mode == 'sp') {
        if ($content.is(':visible')) {
          $content.stop().slideUp(t);
          $bt.find('i').removeClass(minus_icon).addClass(plus_icon)
        } else {
          $content.stop().slideDown(t)
          $bt.find('i').removeClass(plus_icon).addClass(minus_icon)
        }
      }
      return false;
    })
  })
});

/*--------------------------------------------------------------------------*/
/* sp global navi */
/*--------------------------------------------------------------------------*/
$(function() {
  var t = 200;
  var timer = null;
  var $content = $('.js-gnavi_content');
  var $scroll_area = $content.find('.js-gnavi_scroll');
  var $bt_close = $('.js-gnavi_close');
  var $bt_open = $('.js-gnavi_open');

  $bt_open.on('click', function() {
    $content.fadeIn(200);
    timer = setInterval(function() {
      var h = window.innerHeight - $bt_close.height();
      $scroll_area.css('height', h);
    }, 0)
  })
  $bt_close.on('click', function() {
    $content.fadeOut(200);
    clearInterval(timer);
  })
});

/*--------------------------------------------------------------------------*/
/* zip search
/*--------------------------------------------------------------------------*/
$(function() {
  var URL = {
    GET_ADDRESS_LIST: '/services/api/master/addresses.json'
  }
  if (CJS.DEBUG) {
    URL = {
      GET_ADDRESS_LIST: '/API/getAddressList.json'
    }
  }

  var t = 200;
  $('.js-zip_search_block').each(function() {
    var $inputs = $(this).find('.js-zip_auto');
    var $input1 = $inputs.filter('[data-zip="first"]');
    var $input2 = $inputs.filter('[data-zip="last"]');
    var $message = $(this).find('.js-zip_auto_message');
    var $select = $(this).find('.js-zip_auto_options');
    var $result_wrapper = $(this).find('.js-zip_auto_result');
    var $result_input_prefecture = $(this).find('.js-prefecture_code');
    var $result_input_city = $(this).find('.js-city_code');
    var $result_input_town = $(this).find('.js-town_code');
    var $result_pref_and_city = $(this).find('.js-zip_auto_pref_and_city');
    var data_selected = 'data-selected_message';
    var data_nonselect = 'data-non_select_message';
    $message.attr(data_selected, $message.text());
    var txt_choose = '選択してください';
    var MSG_NONE_RESULT = '該当する郵便番号が見つかりませんでした。\n郵便番号をお確かめのうえ再度入力して下さい。';


    //init
    if ($inputs.length == 2) {
      if ($input1.val() != '' && $input2.val() != '') {
        // 既に郵便番号が入力されているとき（変更画面や確認からの戻り時）
        $message.text($message.attr(data_selected));
        callZipApi();
      } else {
        // 住所が設定されていないとき
        resetResult();
        $result_wrapper.slideUp(0);
      }
      setEvent();
    }

    function setEvent() {
      var timer = null;
      var nowval = '';
      $inputs.on({
        'focus': function() {
          timer = setInterval(function() {
            if (
              String($input1.val()).match(/^\d{3}$/) &&
              String($input2.val()).match(/^\d{4}$/) &&
              nowval != (String($input1.val()) + String($input2.val()))
            ) {
              nowval = (String($input1.val()) + String($input2.val()));
              //clearInterval(timer);
              callZipApi();
            } else {
              //resetResult();
            }
          }, 0)
        },
        'blur': function() {
          clearInterval(timer);
        }
      })
    }

    function callZipApi() {
      CJS.ajax([{
        url: URL.GET_ADDRESS_LIST,
        data: {
          zipCd: String($input1.val()) + String($input2.val())
        }
      }]).done(function(res) {
        showResult(res[0])
      }).fail(function() {})
    }

    function showResult(data) {
      // 郵便番号　→　普通にtype=textのvalueに入れておいて欲しい
      // 都道府県コード　→　郵便番号から復元する	2桁（TODOFUKEN_CD）prefCd
      // 市区郡町村コード　→　郵便番号から復元する	3桁（SHIKUGUN_CD）shikugunchosonCd
      // 大字・通称コード＋字・丁目コード　→　復元出来ないので、hiddenで「大字・通称コード＋字・丁目コード」を渡して欲しい	6桁（OAZA_TSUSHOMEI_CD + AZA_CHOME_CD）oazaTsushomeiCd + azaChomeCd
      // 番地・マンション名・部屋番号等　→　普通にtype=textのvalueに入れておいて欲しい
      if (data.length <= 0) {
        alert(MSG_NONE_RESULT);
        resetResult();
        return;
      }
      $message.text($message.attr(data_selected));

      $result_input_prefecture.val(data[0].prefCd);
      $result_input_city.val(data[0].cityCd);
      $result_pref_and_city.text(String(data[0].prefNm) + String(data[0].cityNm));

      $select.children().remove();
      $select.append('<option value="">' + txt_choose + '</option>')
      $.each(data, function(i, v) {
        $select.append('<option value="' + String(v.townCd) + '">' + v.townNm + '</option>')
      });
      if ($result_input_town.val() != '' && $select.children('[value="'+$result_input_town.val()+'"]').length >= 1) {
        $select.val($result_input_town.val());
      }
      $select.off('change').on('change', function() {
        $result_input_town.val($(this).val());
      })

      $result_wrapper.stop().slideDown(t);
      return;
    }

    function resetResult() {
      $message.text($message.attr(data_nonselect));

      $result_input_prefecture.val('');
      $result_input_city.val('');
      $result_input_town.val('')
      $result_pref_and_city.text('');

      $select.children().remove();

      $result_wrapper.stop().slideUp(t);
    }
  })
});

/*--------------------------------------------------------------------------*/
/* hope type
/*--------------------------------------------------------------------------*/
$(function() {
  var t = 200;
  var $contents = $('.js-hope_type_content').hide(0);
  var $checkboxs = $('.js-hope_type');

  $checkboxs.on('change', function(e,time) {
		var _t = (typeof time === "undefined")? t : time;
    var $targetContent = $contents.filter('[data-hope_type="' + $(this).data('hope_type') + '"]');
    if ($(this).prop('checked')) {
      $targetContent.slideDown(_t);
    } else {
      $targetContent.slideUp(_t);
    }
  }).each(function(){
		$(this).triggerHandler('change',[0]);
	})
});

/*--------------------------------------------------------------------------*/
/* another submit
/*--------------------------------------------------------------------------*/
$(function() {
  var $bts = $('.js-another_submit');
  $bts.each(function() {
    $(this).on('click', function() {
      var $form = $(this).closest('form');
      $form.attr('action', $(this).data('submit_target')).submit();
    })
  })
});

/*--------------------------------------------------------------------------*/
/* form flow
/*--------------------------------------------------------------------------*/
$(function() {
  var $uls = $('.js-form_flow').children('ul');
  $uls.each(function() {
    var len = $(this).children('li').length;
    $(this).addClass('flow_length_' + len)
  })
});

/*--------------------------------------------------------------------------*/
/* h1#visual height setting
/*--------------------------------------------------------------------------*/
$(function() {
  var $visual = $('h1#visual');
  function resetHeight() {
		$visual.each(function() {
			var $_this = $(this)
			var path = $_this.css('background-image').match(/https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:@&=+$,%#]+[a-z]/g);
			if(path == null){
				return;
			}

			var img = new Image();
			img.src = path;
			var timer = setInterval(function(){
				if(img.width && img.height){
					loadComplete();
				}
			},0)
			function loadComplete(){
				clearInterval(timer);
				var h = img.height;
				var w = img.width;
				var area_w = ($_this.width() <= w) ? $_this.width() : w;
				$_this.css({
					'height': (area_w * h) / w
				})
			}
		})
  }
	resetHeight();
	$(window).on('resize', function() {
		resetHeight();
	})
})
/*--------------------------------------------------------------------------*/
/* search result map image
/*--------------------------------------------------------------------------*/
$(function() {
	var $elem = $('.c-result_box .c-explain2').find('a[href^="/content/dam/31sumai/mfr/"]');
	$elem.on('click',function(){
		$.colorbox({
			maxWidth:"95%",
			maxHeight:"95%",
			speed:0,
			opacity: 0.2,
			href: $(this).attr('href')
		});
		return false;
	})
})
/*--------------------------------------------------------------------------*/
/* entry form all check
/*--------------------------------------------------------------------------*/
$(function() {
	var $elem = $('.js-allcheck');
	$elem.on('change',function(){
		var $inputs = $('[data-check_listener="simultaneous"]')
		if($(this).is(':checked')){
			$inputs.prop('checked', true);
		}else{
			$inputs.prop('checked', false);
		}
		return false;
	})
})
/*--------------------------------------------------------------------------*/  
/* div:smartphone change Style  
/*--------------------------------------------------------------------------*/  
$(function() {  
  var attrSpStyle = 'data-sp_style';
  var attrPcStyle = 'data-pc_style';
  var $styles = $('[' + attrSpStyle + ']');

  $styles.each(function() { 
    $(this).attr(attrPcStyle, $(this).attr('style'));
  })
  $(window).on('resize', function() {
    resetStyle();
  })

  resetStyle(); 

  function resetStyle() {
    if (window.matchMedia('screen and (max-width:640px)').matches) {
        //sp
        $styles.each(function() {
        $(this).attr('style', $(this).attr(attrSpStyle));
      })
    } else {
        //pc
        $styles.each(function() {
        $(this).attr('style', $(this).attr(attrPcStyle));
      })
    }
  }
});


/*-------------------------------------------------------------------------- */
/* password Mask-UnMask */
/*-------------------------------------------------------------------------- */
$(function() {
    $(".mskbutton").on('click',function () {
       // iconの切り替え
       $(this).toggleClass("password-mask password-no-mask");
       // 入力フォームの取得
       var input = $(this).parent().find(".password-input");
       // type切替
       if (input.attr("type") == "password") {
           input.attr("type", "text");
       } else {
           input.attr("type", "password");
       }
   });
});
