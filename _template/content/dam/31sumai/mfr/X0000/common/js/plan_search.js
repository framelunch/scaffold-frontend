// plan_list.js 記述分-----------------------------------------------------------------------------------

// JavaScript Document

//iOSでの閲覧時bodyタグにclass="ios"を付与
$(function() {
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPad') > 0 || ua.indexOf('iPod') > 0) {
        $("body").addClass("ios");
    }
});

/*
planSearch用jsはここから
アコーディオンや比較時の動き
*/

$(function() {

    //画面幅768px以下の時のアコーディオン表示
    if (window.matchMedia('(max-width:768px)').matches) {
        $('.planSearch .planPop').removeClass('remodal');
        $('.planSearch').addClass('accordion');
        $('.contents .planSearch dt').on('click', function() {
            $(this).next().slideToggle().toggleClass('active');
            $(this).toggleClass('active');
        });
        $('.contents .planSearch dd div, .contents .planSearch dd p, .contents .planSearch dd .areaBox').on('click', function() {
            $(this).parents('dd').slideToggle().toggleClass('active');
            $(this).parents('dd').prev().toggleClass('active');
        });
    }
    $('.planBase a.accordionLink').on('click', function() {
        $(this).parents('li').toggleClass('open');
        $(this).siblings('div.img').slideToggle();
    });


    //「リスト」表示と「比較」表示の切り替え
    $('.planSearch .conf ul li a.list').on('click', function() {
        $(this).parents('li').addClass('active');
        $(this).parents('li').siblings().removeClass('active');
        $('.planSearch .planListWrap').removeClass('comparison');
        $('.planSearch .planList').css({
            'width': '98%'
        });
    });
    $('.planSearch .conf ul li a.comparison').on('click', function() {
        $(this).parents('li').addClass('active');
        $(this).parents('li').siblings().removeClass('active');
        $('.planSearch .planListWrap').addClass('comparison');
        var liWidth = 260;
        if (window.matchMedia('(max-width:480px)').matches) {
            liWidth = 250;
        }
        $('.planSearch .planList').css({
            // 'width': ($('.planSearch .planBase').length - $('.planSearch .planBase.delete').length) * liWidth
            'width': Number(document.getElementById('list_length').textContent.replace(/件/,'')) * liWidth
        });
    });


    //間取り「✕」ボタンクリック plan_search.jsで記述していたプラン件数変更処理もここで行う
    $('.planSearch .planBase > li span.close').on('click', function() {
        $(this).parents('.planBase').addClass('delete').css({'display': 'none'});
        var liWidth = 260;
        if (window.matchMedia('(max-width:480px)').matches) {
            liWidth = 250;
        }
        document.getElementById('list_length').textContent = String(Number(document.getElementById('list_length').textContent.replace(/[^0-9]/g,''))-1) + '件';
        let length = Number(document.getElementById('list_length').textContent.replace(/件/,'')) * liWidth; // 件数名を参照し現在の表示件数を取得後、幅計算
        $('.planSearch .planList').css({
            'width': String(length)
        });
    });

});

/*
代表間取り用jsはここから
タブ切替とslickjsの記述
*/

$(function() {
    //間取りリスト3LDK・4LDKタブ切り替え時アクティブな方へ下線移動
    $(window).on('load resize', function() {
        if ($(".planContList .listTab li.bar").length) {
            $('.planContList .listTab li.bar').css({
                "left": $('.planContList .listTab li.tab.active').position().left,
                "width": $('.planContList .listTab li.tab.active').width()
            });
        }
    });

    //間取りリスト3LDK・4LDKタブ切り替え
    $('.planContList .listTab li.tab').on('click', function() {
        $(this).addClass('active');
        $(this).siblings('li.tab').removeClass('active');
        var index = $('.planContList .listTab li.tab').index(this) + 1;
        $('.planContList .planList.list' + index).slideDown(500);
        $('.planContList .planList.list' + index).siblings('.planList').slideUp(500);
        $('.planContList .listTab li.bar').css({
            "left": $(this).position().left,
            "width": $(this).width()
        });
    });

    //画面幅768px以下の時のアコーディオン表示
    $('.planContList .planList ul.list a.accordionLink').on('click', function() {
        $(this).parents('li').toggleClass('open');
        $(this).siblings('div.img').slideToggle();
    });
});


$(window).on('load', function() {
    //カルーセルの要否判定
    var size1 = $(".List_cont_wrap .planBase").length;
    var size2 = $(".List_cont_wrap2 .planBase").length;
    var size3 = $(".List_cont_wrap3 .planBase").length;
    if (size1 >= 4) {
        $(".List_cont_wrap").addClass("slide1-on");
    } else {
        $(".List_cont_wrap").addClass("NotSlide");
    }
    if (size2 >= 4) {
        $(".List_cont_wrap2").addClass("slide2-on");
    } else {
        $(".List_cont_wrap2").addClass("NotSlide");
    }
    if (size3 >= 4) {
        $(".List_cont_wrap3").addClass("slide3-on");
    } else {
        $(".List_cont_wrap3").addClass("NotSlide");
    }

    function sliderSetting() {
        var width = $(window).width();
        console.log(width);
        if (width >= 640) {
            //タブ1の要素を設定
            if ($(".List_cont_wrap").hasClass('slide1-on')) {
                var planItemMaxHeight1 = 0;
                $('.TopPlanList .list1 .planBase').each(function(idx, elem) {
                    var height1 = $(elem).height();
                    if (planItemMaxHeight1 < height1) {
                        planItemMaxHeight1 = height1;
                    }
                });
                $('.TopPlanList .list1 .planBase').height(planItemMaxHeight1);
                var slider1 = $('.slide1-on').not('.slick-initialized').slick({
                    dots: true,
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    swipe: false
                });
                //タブ1切り替え(setPosition)
                $('.planContList .tab1').on('click', function() {
                    slider1.slick('setPosition');

                });
            }
            //タブ2切り替え・要素設定(setPosition)
            $('.planContList .tab2').on('click', function() {
                if ($(".List_cont_wrap2").hasClass('slide2-on')) {
                    var slider2 = $('.slide2-on').not('.slick-initialized').slick({
                        dots: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        swipe: false
                    });
                    var planItemMaxHeight2 = 0;
                    $('.TopPlanList .list2 .planBase').each(function(idx, elem) {
                        var height2 = $(elem).height();
                        if (planItemMaxHeight2 < height2) {
                            planItemMaxHeight2 = height2;
                        }
                    });
                    $('.TopPlanList .list2 .planBase').height(planItemMaxHeight2);
                    slider2.slick('setPosition');
                }
            });
            //タブ3切り替え・要素設定(setPosition)
            $('.planContList .tab3').on('click', function() {
                if ($(".List_cont_wrap3").hasClass('slide3-on')) {
                    var slider3 = $('.slide3-on').not('.slick-initialized').slick({
                        dots: true,
                        slidesToShow: 3,
                        slidesToScroll: 1,
                        swipe: false
                    });
                    var planItemMaxHeight3 = 0;
                    $('.TopPlanList .list3 .planBase').each(function(idx, elem) {
                        var height3 = $(elem).height();
                        if (planItemMaxHeight3 < height3) {
                            planItemMaxHeight3 = height3;
                        }
                    });
                    $('.TopPlanList .list3 .planBase').height(planItemMaxHeight3);
                    slider3.slick('setPosition');
                }
            });
        }
    }
    sliderSetting();

    function sliderSetting2() {
        var width = $(window).width();
        console.log(width);
        if (width >= 640) {
            //ウインドウサイズ変更時のカルーセルエラー回避
            var Sflag1 = false;
            var Sflag2 = false;
            var Sflag3 = false;
            $('.planContList .tab1').on('click', function() {
                if (!Sflag1) {
                    Sflag1 = true;
                    if ($(".List_cont_wrap").hasClass('slide1-on')) {
                        $('.TopPlanList .list1 .slick-next').trigger('click');
                        // console.log("strack1 click");
                    }
                }
            });
            $('.planContList .tab2').on('click', function() {
                if (!Sflag2) {
                    Sflag2 = true;
                    if ($(".List_cont_wrap2").hasClass('slide2-on')) {
                        $('.TopPlanList .list2 .slick-next').trigger('click');
                        // console.log("strack2 click");
                    }
                }
            });
            $('.planContList .tab3').on('click', function() {
                if (!Sflag3) {
                    Sflag3 = true;
                    if ($(".List_cont_wrap3").hasClass('slide3-on')) {
                        $('.TopPlanList .list3 .slick-next').trigger('click');
                        // console.log("strack3 click");
                    }
                }
            });
        }
    }

    $(window).resize(function() {
        sliderSetting2();
    });
});


//ブラウザ幅が641px以上の時、リサイズによって640px以下になるとリロード
//ブラウザ幅が640px以下の時、リサイズによって641px以上になるとリロード
$(function() {
    var sCheck;
    $(window).on('load', function() {
        if (window.matchMedia('(max-width:640px)').matches) {
            sCheck = 1;
        } else {
            sCheck = 0;
        }
    });
    $(window).on('resize', function() {
        if ((window.matchMedia('(max-width:640px)').matches) && (sCheck == 0)) {
            location.reload();
            sCheck = 1;
        } else if ((window.matchMedia('(min-width:641px)').matches) && (sCheck == 1)) {
            location.reload();
            sCheck = 0;
        }
    });
});

// -----------------------------------------------------------------------------------------------------

// plan_search.js 記述分---------------------------------------------------------------------------------
window.onload = function() {
    // global ----------------------------------------------------------
    // 親要素CLASS名（リスト表示・比較表示で可変的に使用）
    var parent_list = 'search_plan_list';
    // 通常リストの親要素ID名
    var normal_list_id = 'search_plan_list';
    // 比較リストの親要素CLASS名
    var compare_list_class_name = 'comparison';

    // リストが<li><li>なのか<div></div>等なのか display:noneからの復帰の際に使用 例）div→block,li→list-item
    var display_style = 'block';
    // リストの親要素のdisplay指定 例）ulでflex指定している場合はflex
    var parent_display_style = 'flex';

    // 各listにつけてるクラス名
    var s_list_class_name = 'planBase';
    // 間取り選択要セレクトボックスID名
    var select_madori_id = 'madori_select';
    // 専有面積下限セレクトボックスID名
    var select_sqm_under_id = 'sqm_select_under';
    // 専有面積上弦セレクトボックスID名
    var select_sqm_over_id = 'sqm_select_over';
    // 販売価格下限セレクトボックスID名
    var select_yen_under_id = 'yen_select_under';
    // 販売価格上限セレクトボックスID名
    var select_yen_over_id = 'yen_select_over';
    // 並び替えセレクトボックスID名
    var select_sort_id = 'sort_select';
    // 間取りを記述しているタグのクラス名
    var ldk_class_name = 'ldk';
    // 専有面積を記述しているタグのクラス名
    var sqm_class_name = 'area1_val_01'; // プログラム側で「㎡」まで見ています
    // 販売価格を記述しているタグのクラス名
    var yen_class_name = 'yen_val'; // 現状はプログラム側で「値段」＋「円」まで見ています

    // 専有面積の単位
    var sqm_interval = 10; // 10刻み
    var sqm_unit = '㎡';
    // 販売価格の単位・切り上げ切り捨て設定
    var yen_interval = 10000; // 万
    var yen_unit = '万';
    var yen_unit_yi = '億';
    var yen_ceil_val  =  10000000; // 1000万単位で切り上げ切り捨て実行
    var yen_ceil_val2 =   5000000; // 500万単位で切り上げ切り捨て実行
    var start_yen     =  15000000; // 販売価格プルダウン最低値（1500万
    var center_yen    =  50000000; // 刻み切替点（5000万
    var last_yen      = 100000000; // 最高値（1億

    // 「リスト」ボタンID名
    var list_btn_id = 'list_btn';
    // 「比較」ボタンId名
    var compare_btn_id = 'compare_btn';

    // 比較表示のバツボタンのクラス名
    var close_btn_class_name = 'close';

    // 件数ID名
    var list_length = 'list_length';

    // 削除リセットボタンID名
    var reset_btn_id = 'c_reset_btn';
    // プルダウンリセットボタンID名
    var pull_reset_btn_id = 'pull_reset_btn';

    // 比較リストクラス
    var compare_class_name = 'compare';

    // 間取りセレクトボックス内ソート順設定 LDK > DK > K > R（仮
    var s_ldk = 4; // LDK
    var s_dk  = 3; // DK
    var s_k   = 2; // K
    var s_r   = 1; // R


    // func ------------------------------------------------------------
    /**
     * 検索プルダウンが初期状態か否か判定
     * @returns {boolean}
     */
    function checkSelectPull() {
        let result = false;
        let madori = document.getElementById(select_madori_id).value; // 選択中の間取り
        let sqm_under = document.getElementById(select_sqm_under_id).value; // 選択中の専有面積下限
        let sqm_over = document.getElementById(select_sqm_over_id).value; // 選択中の専有面積上限
        let yen_under = document.getElementById(select_yen_under_id).value; // 選択中の販売価格下限
        let yen_over = document.getElementById(select_yen_over_id).value; // 選択中の販売価格下限
        if(
            madori    !== 'すべて' ||
            sqm_under !== '下限なし' ||
            sqm_over  !== '上限なし' ||
            yen_under !== '下限なし' ||
            yen_over  !== '上限なし'
        ) {
            result = true;
        }
        return result;
    }
    /**
     * リストを選択中の項目に合わせて変更
     */
    function changeList() {
        // 検索リセットボタン有効/無効化
        if(checkSelectPull()) {
            document.getElementById(pull_reset_btn_id).removeAttribute("disabled");
            document.getElementById(pull_reset_btn_id).classList.add('s_active');
        } else {
            document.getElementById(pull_reset_btn_id).setAttribute("disabled", 'true');
            document.getElementById(pull_reset_btn_id).classList.remove('s_active');
        }

        let parent = document.getElementsByClassName(parent_list); // 親要素指定
        let madori = document.getElementById(select_madori_id).value; // 選択中の間取り
        let sqm_under = document.getElementById(select_sqm_under_id).value; // 選択中の専有面積下限
        let sqm_over = document.getElementById(select_sqm_over_id).value; // 選択中の専有面積上限
        let yen_under = document.getElementById(select_yen_under_id).value; // 選択中の販売価格下限
        let yen_over = document.getElementById(select_yen_over_id).value; // 選択中の販売価格下限

        let s_list = parent[0].getElementsByClassName(s_list_class_name);

        let list_num = 0; // 件数カウント用

        let check_compare_parent = document.getElementsByClassName(parent_list)[0].parentNode;
        let compare = check_compare_parent.classList.contains(compare_list_class_name);

        let price_undecided = document.getElementById('non_price_check'); // 価格未定チェック

        for(let i=0; i<s_list.length; i++) {
            // 価格未定処理
            if(s_list[i].dataset.yen === '価格未定' && price_undecided.checked === false) {
                s_list[i].style.display = 'none';
                continue;
            }

            // 比較表示状態か否か
            if(compare && s_list[i].classList.contains('delete')) {
                s_list[i].style.display = "none";
                continue;
            }
            // s_list[i].style.display = display_style;

            let ldk_text = s_list[i].dataset.ldk;
            let sqm = s_list[i].dataset.sqm;
            sqm = sqm !== 'all' ? Number(sqm) : sqm; // 100と10の位の比較式が文字列だとうまくいかないため数値は型変更
            let yen = s_list[i].dataset.yen;
            yen = (yen === 'all' || yen === '価格未定') ? yen : Number(yen);

            if((ldk_text === madori || madori === 'すべて') &&
                (sqm_under <= sqm || sqm_under === '下限なし') &&
                (sqm <= sqm_over || sqm_over === '上限なし') &&
                ((yen_under * yen_interval) <= yen || yen_under === '下限なし' || yen === '価格未定') &&
                (yen <= (yen_over * yen_interval) || yen_over === '上限なし' || yen === '価格未定')
            ) {
                s_list[i].style.display = display_style;
                // アニメーション
                if(!compare) {
                    // s_list[i].style.setProperty('-ms-animation', 'show 0.3s ease-out');
                    // s_list[i].style.setProperty('-ms-animation-name', 'show');
                    // s_list[i].style.setProperty('-ms-animation-duration', '0.3s');
                    // s_list[i].style.setProperty('-ms-animation-timing-function', 'ease-out');
                    s_list[i].style.animation = 'show 0.3s ease-out';
                }
                if(compare) s_list[i].style.animation = ''; // 比較時にanimation削除
                list_num++;
            } else {
                s_list[i].style.display = "none";
            }
        }
        // 件数変更
        document.getElementById(list_length).textContent = String(list_num) + '件';

        if(compare) {
            let liWidth = 260;
            if (window.matchMedia('(max-width:480px)').matches) {
                liWidth = 250;
            }
            let length = Number(document.getElementById(list_length).textContent.replace(/件/,'')) * liWidth;
            document.getElementsByClassName(parent_list)[0].style.width = String(length) + 'px';
        }
    }

    /**
     * 間取りセレクトボックスイベント
     */
    function changeMadori() {
        changeList();
    }


    // 専有面積セレクトボックスイベント---------------------
    /**
     * 専有面積・下限
     */
    function changeSqmUnder() {
        // 上限の値調整
        let s_sqm_o = document.getElementById(select_sqm_over_id);
        let _val = this.value !== 'all' ? Number(this.value) : this.value;
        if(_val == 'all') {
            for(let i=0; i<s_sqm_o.children.length; i++) {
                s_sqm_o.children[i].style.display = 'block';
            }
        } else {
            for(let i=0; i<s_sqm_o.children.length; i++) {
                let val = s_sqm_o.children[i].value;
                val = val !== 'all' ? Number(val) : val;
                if(val != 'all' && val <= _val) {
                    s_sqm_o.children[i].style.display = 'none';
                } else {
                    s_sqm_o.children[i].style.display = 'block';
                }
            }
        }
        // リスト変更
        // changeList();
    }
    /**
     * 専有面積・上限
     */
    function changeSqmOver() {
        // 下限の値調整
        let s_sqm_u = document.getElementById(select_sqm_under_id);
        let _val = this.value;
        if(_val == 'all') {
            for(let i=0; i<s_sqm_u.children.length; i++) {
                s_sqm_u.children[i].style.display = 'block';
            }
        } else {
            for(let i=0; i<s_sqm_u.children.length; i++) {
                let val = s_sqm_u.children[i].value;
                val = val !== 'all' ? Number(val) : val;
                if(val != 'all' && val >= _val) {
                    s_sqm_u.children[i].style.display = 'none';
                } else {
                    s_sqm_u.children[i].style.display = 'block';
                }
            }
        }
        // リスト変更処理
        // changeList();
    }

    // 販売価格セレクトボックスイベント---------------------------
    /**
     * 販売価格・下限
     */
    function changeYenUnder() {
        // 上限の値調整
        let s_yen_o = document.getElementById(select_yen_over_id);
        let _val = this.value;
        if(_val == 'all') {
            for(let i=0; i<s_yen_o.children.length; i++) {
                s_yen_o.children[i].style.display = 'block';
            }
        } else {
            for(let i=0; i<s_yen_o.children.length; i++) {
                let val = s_yen_o.children[i].value;
                val = val !== 'all' ? Number(val) : val;
                if(val != 'all' && val <= _val) {
                    s_yen_o.children[i].style.display = 'none';
                } else {
                    s_yen_o.children[i].style.display = 'block';
                }
            }
        }
        // リスト変更
        // changeList();
    }
    /**
     * 販売価格・上限
     */
    function changeYenOver() {
        // 上限の値調整
        let s_yen_u = document.getElementById(select_yen_under_id);
        let _val = this.value;
        if(_val == 'all') {
            for(let i=0; i<s_yen_u.children.length; i++) {
                s_yen_u.children[i].style.display = 'block';
            }
        } else {
            for(let i=0; i<s_yen_u.children.length; i++) {
                let val = s_yen_u.children[i].value;
                val = val !== 'all' ? Number(val) : val;
                if(val != 'all' && val >= _val) {
                    s_yen_u.children[i].style.display = 'none';
                } else {
                    s_yen_u.children[i].style.display = 'block';
                }
            }
        }
        // リスト変更
        // changeList();
    }

    /**
     * 並び替え
     */
    function changeSort() {
        let parent = document.getElementsByClassName(parent_list);
        let s_sort = document.getElementById(select_sort_id);
        let sort_value = document.getElementById(select_sort_id).value;
        let s_list = parent[0].getElementsByClassName(s_list_class_name);

        let new_array = Array.prototype.slice.call(s_list);

        switch (sort_value) {
            case '狭い順':
                new_array.sort(compareSqmNarrow);
                break;
            case '広い順':
                new_array.sort(compareSqmWide);
                break;
            case '高い順':
                new_array.sort(compareYenHigh);
                break;
            case '安い順':
                new_array.sort(compareYenLow);
                break;
            default:
                break;
        }

        for(let i=0; i<new_array.length; i++) {
            parent[0].appendChild(parent[0].removeChild(new_array[i]));
        }

    }

    // 専有面積比較 sort関数用
    /**
     * 狭い順
     * @param a
     * @param b
     * @returns {number}
     */
    function compareSqmNarrow(a,b) {
        let a_sqm_val = a.dataset.sqm ? Number(a.dataset.sqm) : 999999; // ない場合は後ろへ
        let b_sqm_val = b.dataset.sqm ? Number(b.dataset.sqm) : 999999; // ない場合は後ろへ

        if(a_sqm_val > b_sqm_val) {
            return 1;
        } else if(a_sqm_val < b_sqm_val) {
            return -1;
        }
    }
    /**
     * 広い順
     * @param a
     * @param b
     * @returns {number}
     */
    function compareSqmWide(a,b) {
        let a_sqm_val = a.dataset.sqm ? Number(a.dataset.sqm) : 0; // ない場合は後ろへ
        let b_sqm_val = b.dataset.sqm ? Number(b.dataset.sqm) : 0; // ない場合は後ろへ

        if(a_sqm_val < b_sqm_val) {
            return 1;
        } else if(a_sqm_val > b_sqm_val) {
            return -1;
        }
    }

    // 販売価格比較 sort関数用
    /**
     * 安い順
     * @param a
     * @param b
     * @returns {number}
     */
    function compareYenLow(a,b) {
        let a_yen_val = a.dataset.yen !== '価格未定' ? Number(a.dataset.yen) : 9999999999;
        let b_yen_val = b.dataset.yen !== '価格未定' ? Number(b.dataset.yen) : 9999999999;

        if(a_yen_val > b_yen_val) {
            return 1;
        } else if(a_yen_val < b_yen_val) {
            return -1;
        }
    }
    /**
     * 高い順
     * @param a
     * @param b
     * @returns {number}
     */
    function compareYenHigh(a,b) {
        let a_yen_val = a.dataset.yen !== '価格未定' ? Number(a.dataset.yen) : 0; // 価格未定を先頭へ
        let b_yen_val = b.dataset.yen !== '価格未定' ? Number(b.dataset.yen) : 0; // 価格未定を先頭へ

        if(a_yen_val < b_yen_val) {
            return 1;
        } else if(a_yen_val > b_yen_val) {
            return -1;
        }
    }

    /**
     * 標準リストページ
     */
    function normalList() {
        changeList();
        document.getElementById(reset_btn_id).setAttribute("disabled", true);
        document.getElementById(reset_btn_id).classList.remove('c_active');
    }
    /**
     * 比較リストページ
     */
    function compareList() {
        changeList();
        document.getElementById(reset_btn_id).removeAttribute("disabled");
        document.getElementById(reset_btn_id).classList.add('c_active');
    }

    /**
     * 比較リストページ×ボタン
     * @param e
     */
    function closeList(e) {

        // プラン件数変更 「件」を抜いてから再度挿入
        document.getElementById(list_length).textContent = String(Number(document.getElementById(list_length).textContent.replace(/[^0-9]/g,''))-1) + '件';
    }

    /**
     * 比較リストページ削除リセット
     */
    function reset_val() {
        let parent = document.getElementsByClassName(parent_list);
        let list = parent[0].getElementsByClassName(s_list_class_name);
        for(let i=0; i<list.length; i++) {
            list[i].classList.remove('delete');
        }
        changeList();
        let liWidth = 260;
        if (window.matchMedia('(max-width:480px)').matches) {
            liWidth = 250;
        }
        let length = Number(document.getElementById(list_length).textContent.replace(/件/,'')) * liWidth;
        document.getElementsByClassName(parent_list)[0].style.width = String(length) + 'px';
    }
    /**
     * 検索項目リセット
     */
    function p_reset_val() {
        // 間取り
        document.getElementById(select_madori_id).options[0].selected    = true;
        // 専有/延床面積
        document.getElementById(select_sqm_under_id).options[0].selected = true; // 下限
        let sqm_over_op = document.getElementById(select_sqm_over_id).options;
        sqm_over_op[sqm_over_op.length-1].selected  = true; // 上限（上限なしが一番最後に来るため）
        // 販売価格
        document.getElementById(select_yen_under_id).options[0].selected = true; // 下限
        let yen_over_op = document.getElementById(select_yen_over_id).options;
        yen_over_op[yen_over_op.length-1].selected  = true; // 上限（上限なしが一番最後に来るため）
        // 並び替え
        // document.getElementById(select_sort_id).options[0].selected      = true;
        changeList();
        // changeSort();
    }

    /**
     * 間取りセレクトボックス並び替え
     * @param a
     * @param b
     * @returns {number}
     */
    function madori_sort(a,b) {
        let a_str = a.match(/LDK|DK|K|R/);
        a_str = madori_sort_switch(a_str[0]); // 間取り名を数字変換
        let a_num = a.match(/^\d+/) != null ? a.match(/^\d+/)[0] : 0 ;

        let b_str = b.match(/LDK|DK|K|R/);
        b_str = madori_sort_switch(b_str[0]); //間取り名を数字変換
        let b_num = b.match(/^\d+/) != null ? b.match(/^\d+/)[0] : 0;

        if(a_str === b_str) return Number(a_num) > Number(b_num) ? 1 : -1; // 間取り名が一致している場合は〇LDKかで判別
        if(a_str < b_str) return 1;
        return -1;
    }
    /**
     * 間取りソート値割り当て
     * @param m_name
     * @returns {number}
     */
    function madori_sort_switch(m_name) {
        let res = -1;
        switch(m_name) {
            case 'LDK':
                res = s_ldk;
                break;
            case 'DK':
                res = s_dk;
                break;
            case 'K':
                res = s_k;
                break;
            case 'R':
                res = s_r;
                break;
            default:
                break;
        }
        return res;
    }

    // 英数字 全角→半角
    function hankaku2Zenkaku(str) {
        return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {// A
            return String.fromCharCode(s.charCodeAt(0) - 65248); //65248 0xFEE0
        });
    }

    /**
     * 全角→半角
     * @param value
     * @returns {string|*}
     */
    function hankaku(value) {
        if (!value) return value;
        return String(value).replace(/[！-～]/g, function(all) {
            return String.fromCharCode(all.charCodeAt(0) - 0xFEE0);
        });
    };

    /**
     * 価格未定
     */
    function non_price_check_func() {
        // console.log('価格未定check:',this.value);
        let parent = document.getElementsByClassName(parent_list);
        let s_list = parent[0].getElementsByClassName(s_list_class_name);
        let check = document.getElementById('non_price_check');
        changeList();
    }

    /**
     * 初期化
     * @param count
     */
    function init(count) {
        let parent = document.getElementsByClassName(parent_list);
        let s_list = parent[0].getElementsByClassName(s_list_class_name);

        let madori_items = parent[0].getElementsByClassName(ldk_class_name);
        let _madori_items = Array.prototype.slice.call(madori_items);

        // 間取りセレクト
        let madori = document.getElementById(select_madori_id);
        let madori2 = [];

        // 専有面積セレクト
        const sqm = parent[0].getElementsByClassName(sqm_class_name);
        let sqm_size = {'small':'','large':''};

        // 販売価格セレクト 価格未定仕様要確認
        const yen = parent[0].getElementsByClassName(yen_class_name);
        let yen_size = {'small':'','large':''};
        let yen_count = 0; // 価格未定時のul消失対策

        for(let i=0; i<count; i++) {
            // 間取りセレクト作成-------
            // 正規表現でLDK部分を切り取り 全角の場合があるため数字/英語はすべて半角に統一
            let madori_text = hankaku(madori_items[i].textContent); // 英数字を全角から半角に変換

            // LDK判別 先に空欄・改行を削除
            let match_res = madori_text.replace(/\r?\n/g,"");
            match_res = match_res.replace(/\s+/g, "");
            match_res = match_res.match(/^\d+LDK|^\d+DK|^\d+K|^\d+R/);
            // ヒットしない場合はスルー
            if(match_res !== null) {
                if(match_res[0].match(/^\d+K|^K/g)) match_res = 'K'; // Kは1Kも4Kも統一フィルタにする
                if(match_res[0].match(/^\d+R|^R/g)) match_res = 'R'; // Rも1Rも2Rも統一フィルタにする
                s_list[i].dataset.ldk = match_res[0]; // data属性で〇LDKか保存
                if(madori2.indexOf(match_res[0]) < 0) {
                    madori2.push(match_res[0]);
                }
            }


            // 専有面積セレクト
            let sqm_clone = sqm[i].cloneNode(true);
            let sqm_num = hankaku(sqm_clone.textContent);
            sqm_num = sqm_num.match(/\d+/g);
            s_list[i].dataset.sqm = '';
            // ヒットしない場合はスルー
            if(!!sqm_num) {
                if(sqm_num.length > 1) {
                    for(let l=0; l<sqm_num.length; l++) {
                        if(l == sqm_num.length-1) {
                            s_list[i].dataset.sqm += sqm_num[l];
                        } else {
                            s_list[i].dataset.sqm += sqm_num[l] + '.';
                        }
                    }
                } else if(sqm_num.length == 1) {
                    s_list[i].dataset.sqm = sqm_num[0];
                }

                if(i === 0) {
                    sqm_size['small'] = Number(sqm_num[0]);
                    sqm_size['large'] = Number(sqm_num[0]);
                } else {
                    if(sqm_size['small'] > Number(sqm_num[0])) {
                        sqm_size['small'] = Number(sqm_num[0]);
                    }
                    if(sqm_size['large'] < Number(sqm_num[0])) {
                        sqm_size['large'] = Number(sqm_num[0]);
                    }
                }
            }

            // 販売価格セレクト
            // 価格未定処理 yenがなければ価格未定として処理
            if(!s_list[i].getElementsByClassName('yen')[0]) {
                s_list[i].dataset.yen = '価格未定';
                yen_count--;
                continue;
            }
            // 空の場合はスルー
            if(yen[i+yen_count].textContent == '') continue;

            let yen_clone = yen[i+yen_count].cloneNode(true);

            yen_clone = hankaku(yen_clone.textContent); // 英数字を半角化
            yen_clone = yen_clone.replace(/,/g, '');
            // 億
            let yi_yen = yen_clone.match(/^\d+億/g);
            if(yi_yen) yi_yen = yi_yen[0].match(/^\d+/g);
            // 万
            let wan_yen = yen_clone.match(/\d+万/g);
            if(wan_yen) wan_yen = wan_yen[0].match(/^\d+/g); // 数字切り取り
            if(wan_yen == null || !wan_yen) wan_yen = '0000'; // 万値がない場合にも対応
            let z_wan = ('0000' + wan_yen) .slice(-4); // 0埋め処理
            // 円
            let dan_yen = yen_clone.match(/\d*$/g); // 数字はない場合有 円はどの価格表示にも存在するはず
            if(dan_yen) dan_yen = dan_yen[0].match(/\d+/g);
            if(dan_yen == null) dan_yen = '0000';
            let z_dan = ('0000' + dan_yen).slice(-4);

            // 億が存在するか否か 億がない場合は万が存在する前提
            let res_yen
            if(yi_yen) {
                res_yen = yi_yen + z_wan + z_dan;
            } else {
                res_yen = wan_yen + z_dan;
            }
            s_list[i].dataset.yen = res_yen;

            if(i+yen_count === 0) {
                yen_size['small'] = Number(res_yen);
                yen_size['large'] = Number(res_yen);
            } else {
                if(yen_size['small'] > Number(res_yen)) {
                    yen_size['small'] = Number(res_yen);
                }
                if(yen_size['large'] < Number(res_yen)) {
                    yen_size['large'] = Number(res_yen);
                }
            }
        }

        // 間取りをソートしてからセレクトボックスに挿入 LDK > DK > K > R順（仮
        let madori_arr = madori2; // IEでArray.fromが使えなかったので一旦回避
        madori_arr.sort(madori_sort);
        for(let i=0; i<madori_arr.length; i++) {
            let madori_op = document.createElement('option');
            madori_op.text = madori_arr[i];
            madori_op.value = madori_arr[i];
            madori.appendChild(madori_op);
        }

        // 専有面積セレクト--------------------------------------------------------------
        let small_sqm = Math.floor(sqm_size['small']/sqm_interval)*sqm_interval;
        let large_sqm = Math.ceil(sqm_size['large']/sqm_interval)*sqm_interval;
        // 専有面積上下限選択作成
        small_sqm = small_sqm > 20 ? small_sqm : 20; // 20～100㎡ 10㎡刻み 最後は「100㎡以上」とする仕様
        large_sqm = large_sqm < 100 ? large_sqm : 100;
        for(let i=small_sqm; i<=large_sqm; i=i+sqm_interval) {
            let op = document.createElement('option');
            // 下限
            op.text = String(i) + sqm_unit;
            // op.text += i >= 100 ? '以上' : '';
            op.value = String(i);
            let select_under = document.getElementById(select_sqm_under_id);
            select_under.appendChild(op);
            // 上限
            let op_clone = op.cloneNode(true);
            op_clone.text = String(i) + sqm_unit;
            // op_clone.text += i >= 100 ? '以下' : '';
            // op_clone.value = op_clone.value === '100' ? 'all' : op_clone.value;
            let select_over = document.getElementById(select_sqm_over_id);
            select_over.appendChild(op_clone);
        }
        let first_sqm_op = document.getElementById(select_sqm_over_id).children[0];
        let first_sqm_op_clone = first_sqm_op.cloneNode(true);
        document.getElementById(select_sqm_over_id).removeChild(first_sqm_op);
        document.getElementById(select_sqm_over_id).appendChild(first_sqm_op_clone).selected = true;

        // 販売価格セレクト--------------------------------------------------------------
        // 1500万円以下のものは要対策
        let small_yen = yen_size['small'] < start_yen ? start_yen : yen_size['small'];
        small_yen = Math.floor(small_yen/yen_ceil_val2)*yen_ceil_val2;
        let large_yen = Math.ceil(yen_size['large']/yen_ceil_val2)*yen_ceil_val2; // Math.ceilで切り上げ
        large_yen = large_yen > last_yen ? last_yen : large_yen;
        // 販売価格上下限選択作成
        for(let i=small_yen; i<=large_yen; i=i+yen_ceil_val2) {
            if(i>=center_yen && i%yen_ceil_val==yen_ceil_val2) continue; // 5000万以下は500万刻み、5000万以降は1000万刻み
            let op = document.createElement('option');
            op.text = String((i/yen_interval).toLocaleString()) + yen_unit; // カンマ区切り追加
            op.value = String(i/yen_interval);
            let op_clone = op.cloneNode(true);
            if(i>=last_yen) {
                op.text = '1億'; // 億の場合は単位を億にする 現状1億どまりなので計算はせずそのまま書き込み
                op_clone.text = '1億'; // 1億以下（20210218変更
            }
            let select_under = document.getElementById(select_yen_under_id);
            select_under.appendChild(op);
            let select_over = document.getElementById(select_yen_over_id);
            select_over.appendChild(op_clone);
        }
        // 「上限なし」を下に配置
        let first_yen_op = document.getElementById(select_yen_over_id).children[0];
        let first_yen_op_clone = first_yen_op.cloneNode(true);
        document.getElementById(select_yen_over_id).removeChild(first_yen_op);
        document.getElementById(select_yen_over_id).appendChild(first_yen_op_clone).selected = true;

        // 件数記入
        document.getElementById(list_length).textContent = count + '件';

        // 初期値でソートしておく
        changeSort();
    }

    // 初期化処理---------------------------------------------------------
    const PARENT = document.getElementsByClassName(parent_list);
    // parent_listでhtml要素が取れた場合のみ起動
    if(!!PARENT[0]) {
        const S_LIST = PARENT[0].getElementsByClassName(s_list_class_name);

        init(S_LIST.length); // 初期値挿入、作成

        // 各種取り出し
        let s_madori    = document.getElementById(select_madori_id);               // 間取りプルダウン
        let s_sqm_u     = document.getElementById(select_sqm_under_id);            // 専有面積プルダウン下限
        let s_sqm_o     = document.getElementById(select_sqm_over_id);             // 専有面積プルダウン上限
        let s_yen_u     = document.getElementById(select_yen_under_id);            // 販売価格プルダウン下限
        let s_yen_o     = document.getElementById(select_yen_over_id);             // 販売価格プルダウン上限
        let s_sort      = document.getElementById(select_sort_id);                 // 並び替えプルダウン
        let list_btn    = document.getElementById(list_btn_id);                    // リスト表示ボタン
        let compare_btn = document.getElementById(compare_btn_id);                 // 比較表示ボタン
        let close_btn   = PARENT[0].getElementsByClassName(close_btn_class_name);   // 比較×ボタン
        let reset_btn   = document.getElementById(reset_btn_id);                   // 比較削除リセットボタン
        let p_reset_btn = document.getElementById(pull_reset_btn_id);              // プルダウンリセットボタン
        let non_price_check = document.getElementById('non_price_check'); // 価格未定住戸チェックボックス

        // 間取りセレクトイベント付与-----------
        s_madori.addEventListener('change', changeList);

        // 専有面積セレクトイベント付与----------
        // 下限（左）
        // s_sqm_u.addEventListener('change', changeSqmUnder);
        s_sqm_u.addEventListener('change', changeList);
        // 上限（右）
        // s_sqm_o.addEventListener('change', changeSqmOver);
        s_sqm_o.addEventListener('change', changeList);

        // 販売価格セレクトイベント付与----------
        // 下限（左）
        // s_yen_u.addEventListener('change', changeYenUnder);
        s_yen_u.addEventListener('change', changeList);
        // 上限（右）
        // s_yen_o.addEventListener('change', changeYenOver);
        s_yen_o.addEventListener('change', changeList);

        // 並び替えセレクトイベント付与---------------------------
        s_sort.addEventListener('change', changeSort);

        // リスト表示ボタンイベント付与---------------------------
        list_btn.addEventListener('click', normalList);
        // 比較表示ボタンイベント付与-----------------------------
        compare_btn.addEventListener('click', compareList);

        // 比較表示時のバツボタンイベント付与----------------------jquery版で処理
        // for(let i=0; i<close_btn.length; i++) {
        //     close_btn[i].addEventListener('click', closeList);
        // }

        // 削除リセットボタン
        reset_btn.addEventListener('click', reset_val);
        // プルダウンリセットボタン
        p_reset_btn.addEventListener('click', p_reset_val);
        // 価格未定住戸チェックボックス
        non_price_check.addEventListener('change', changeList);
    }

};
