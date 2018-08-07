var isPopUpOpened = false;
var bwg_overflow_initial_value = false;
var bwg_overflow_x_initial_value = false;
var bwg_overflow_y_initial_value = false;

function spider_createpopup(url, current_view, width, height, duration, description, lifetime, lightbox_ctrl_btn_pos) {
  url = url.replace(/&#038;/g, '&');
  if (isPopUpOpened) { return };
  isPopUpOpened = true;
  if (spider_hasalreadyreceivedpopup(description) || spider_isunsupporteduseragent()) {
    return;
  }
  bwg_overflow_initial_value = jQuery("html").css("overflow");
  bwg_overflow_x_initial_value = jQuery("html").css("overflow-x");
  bwg_overflow_y_initial_value = jQuery("html").css("overflow-y");
  jQuery("html").attr("style", "overflow:hidden !important;");
  jQuery("#bwg_spider_popup_loading_" + current_view).show();
  jQuery("#spider_popup_overlay_" + current_view).css({display: "block"});
  jQuery.ajax({
    type: "GET",
    url:   url,
    success: function (data) {
      var popup = jQuery(
        '<div id="spider_popup_wrap" class="spider_popup_wrap" style="' +
        ' width:' + width + 'px;' +
        ' height:' + height + 'px;' +
        ' margin-top:-' + height / 2 + 'px;' +
        ' margin-left: -' + width / 2 + 'px; ">' +
        data +
        '</div>')
        .hide()
        .appendTo("body");
      spider_showpopup(description, lifetime, popup, duration, lightbox_ctrl_btn_pos);
    },
    beforeSend: function() {},
    complete:function() {}
  });
}

function spider_showpopup(description, lifetime, popup, duration, lightbox_ctrl_btn_pos) {
  var cur_image_key = parseInt( jQuery( '#bwg_current_image_key' ).val() );
  if ( typeof data[cur_image_key] != 'undefined' ) {
    isPopUpOpened = true;
    var is_embed = data[cur_image_key]['filetype'].indexOf( "EMBED_" ) > -1 ? true : false;
    if ( !is_embed ) {
      if ( jQuery( '#spider_popup_wrap .bwg_popup_image_spun img' ).prop( 'complete' ) ) {
        /* Already loaded. */
        bwg_first_image_load( popup );
      }
      else {
        jQuery( '#spider_popup_wrap .bwg_popup_image_spun img' ).on( 'load error', function () {
          bwg_first_image_load( popup );
        } );
      }
    }
    else {
      bwg_first_image_load( popup );
    }
    spider_receivedpopup( description, lifetime, lightbox_ctrl_btn_pos );
  }
}

function bwg_first_image_load(popup) {
  popup.show();
  jQuery( ".bwg_spider_popup_loading" ).hide();
  if ( bwg_param['preload_images'] ) {
    bwg_preload_images( parseInt( jQuery( '#bwg_current_image_key' ).val() ) );
  }
  bwg_load_filmstrip();
}

function spider_hasalreadyreceivedpopup(description) {
  if (document.cookie.indexOf(description) > -1) {
    delete document.cookie[document.cookie.indexOf(description)];
  }
  return false;
}

function spider_receivedpopup(description, lifetime, lightbox_ctrl_btn_pos) {
  var date = new Date();
  date.setDate(date.getDate() + lifetime);
  document.cookie = description + "=true;expires=" + date.toUTCString() + ";path=/";
  if (lightbox_ctrl_btn_pos == 'bottom') {
    jQuery(".bwg_toggle_container").css("bottom", jQuery(".bwg_ctrl_btn_container").height() + "px");
  }
  else if (lightbox_ctrl_btn_pos == 'top') {
    jQuery(".bwg_toggle_container").css("top", jQuery(".bwg_ctrl_btn_container").height() + "px");
  }
}

function spider_isunsupporteduseragent() {
  return (!window.XMLHttpRequest);
}

function spider_destroypopup(duration) {
  if (document.getElementById("spider_popup_wrap") != null) {
    if (typeof jQuery().fullscreen !== 'undefined' && jQuery.isFunction(jQuery().fullscreen)) {
      if (jQuery.fullscreen.isFullScreen()) {
        jQuery.fullscreen.exit();
      }
    }
    if (typeof enable_addthis != "undefined" && enable_addthis) {
      jQuery(".at4-share-outer").hide();
    }
    setTimeout(function () {
      jQuery(".spider_popup_wrap").remove();
      jQuery(".bwg_spider_popup_loading").css({display: "none"});
      jQuery(".spider_popup_overlay").css({display: "none"});
      jQuery(document).off("keydown");
      if (bwg_overflow_initial_value) {
        jQuery("html").css("overflow", bwg_overflow_initial_value);
      }
      if (bwg_overflow_x_initial_value) {
        jQuery("html").css("overflow-x", bwg_overflow_x_initial_value);
      }
      if (bwg_overflow_y_initial_value) {
        jQuery("html").css("overflow-y", bwg_overflow_y_initial_value);
      }
    }, 20);
  }
  isPopUpOpened = false;
  var isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));
  var viewportmeta = document.querySelector('meta[name="viewport"]');
  if (isMobile && viewportmeta) {
    viewportmeta.content = 'width=device-width, initial-scale=1';
  }
  var scrrr = jQuery(document).scrollTop();
  window.location.hash = "";
  jQuery(document).scrollTop(scrrr);
  if ( typeof bwg_playInterval != "undefined" ) {
    clearInterval(bwg_playInterval);
  }
}
function get_ajax_pricelist(){
  var post_data = {};
  jQuery(".add_to_cart_msg").html("");
  post_data["ajax_task"] = "display";
  post_data["image_id"] = jQuery('#bwg_popup_image').attr('image_id');

  /* Loading. */
  jQuery("#ecommerce_ajax_loading").css('height', jQuery(".bwg_ecommerce_panel").css('height'));
  jQuery("#ecommerce_opacity_div").css('width', jQuery(".bwg_ecommerce_panel").css('width'));
  jQuery("#ecommerce_opacity_div").css('height', jQuery(".bwg_ecommerce_panel").css('height'));
  jQuery("#ecommerce_loading_div").css('width', jQuery(".bwg_ecommerce_panel").css('width'));
  jQuery("#ecommerce_loading_div").css('height', jQuery(".bwg_ecommerce_panel").css('height'));
  document.getElementById("ecommerce_opacity_div").style.display = '';
  document.getElementById("ecommerce_loading_div").style.display = 'table-cell';
  jQuery.ajax({
    type: "POST",
    url:  jQuery('#bwg_ecommerce_form').attr('action'),
    data: post_data,
    success: function (data) {
      jQuery(".pge_tabs li a").on("click", function(){
        jQuery(".pge_tabs_container > div").hide();
        jQuery(".pge_tabs li").removeClass("pge_active");
        jQuery(jQuery(this).attr("href")).show();
        jQuery(this).closest("li").addClass("pge_active");
        jQuery("[name=type]").val(jQuery(this).attr("href").substr(1));
        return false;
      });
      var manual = jQuery(data).find('.manual').html();
      jQuery('.manual').html(manual);

      var downloads = jQuery(data).find('.downloads').html();
      jQuery('.downloads').html(downloads);

      var pge_options = jQuery(data).find('.pge_options').html();
      jQuery('.pge_options').html(pge_options);

      var pge_add_to_cart = jQuery(data).find('.pge_add_to_cart').html();
      jQuery('.pge_add_to_cart').html(pge_add_to_cart);
    },
    beforeSend: function(){
    },
    complete:function(){
      document.getElementById("ecommerce_opacity_div").style.display = 'none';
      document.getElementById("ecommerce_loading_div").style.display = 'none';
      /*
      Update scrollbar.
      jQuery(".bwg_ecommece_panel").mCustomScrollbar({scrollInertia: 150 });
      jQuery(".bwg_ecommerce_close_btn").click(bwg_ecommerce);
      */
    }
  });
  return false;
}

/* Submit popup. */
function spider_ajax_save(form_id) {
  var post_data = {};
  post_data["bwg_name"] = jQuery("#bwg_name").val();
  post_data["bwg_comment"] = jQuery("#bwg_comment").val();
  post_data["bwg_email"] = jQuery("#bwg_email").val();
  post_data["bwg_captcha_input"] = jQuery("#bwg_captcha_input").val();
  post_data["ajax_task"] = jQuery("#ajax_task").val();
  post_data["image_id"] = jQuery("#image_id").val();
  post_data["comment_id"] = jQuery("#comment_id").val();

  /* Loading. */
  jQuery("#ajax_loading").css('height', jQuery(".bwg_comments").css('height'));
  jQuery("#opacity_div").css('width', jQuery(".bwg_comments").css('width'));
  jQuery("#opacity_div").css('height', jQuery(".bwg_comments").css('height'));
  jQuery("#loading_div").css('width', jQuery(".bwg_comments").css('width'));
  jQuery("#loading_div").css('height', jQuery(".bwg_comments").css('height'));
  document.getElementById("opacity_div").style.display = '';
  document.getElementById("loading_div").style.display = 'table-cell';
  jQuery.ajax({
    type: "POST",
    url:  jQuery('#' + form_id).attr('action'),
    data: post_data,
    success: function (data) {
      var str = jQuery(data).find('.bwg_comments').html();
      jQuery('.bwg_comments').html(str);
    },
    beforeSend: function(){
    },
    complete:function(){
      document.getElementById("opacity_div").style.display = 'none';
      document.getElementById("loading_div").style.display = 'none';
      /* Update scrollbar. */
      jQuery(".bwg_comments").mCustomScrollbar({scrollInertia: 150});
      /* Bind comment container close function to close button. */
      jQuery(".bwg_comments_close_btn").click(bwg_comment);
      bwg_captcha_refresh('bwg_captcha');
    }
  });
  return false;
}

/* Submit rating. */
function spider_rate_ajax_save(form_id) {
  var post_data = {};
  post_data["image_id"] = jQuery("#" + form_id + " input[name='image_id']").val();
  post_data["rate"] = jQuery("#" + form_id + " input[name='score']").val();
  post_data["ajax_task"] = jQuery("#rate_ajax_task").val();
  jQuery.ajax({
    type: "POST",
    url:   jQuery('#' + form_id).attr('action'),
    data: post_data,
    success: function (data) {
      var str = jQuery(data).find('#' + form_id).html();
      jQuery('#' + form_id).html(str);
    },
    beforeSend: function(){
    },
    complete:function(){
    }
  });
  return false;
}

/* Set value by ID. */
function spider_set_input_value(input_id, input_value) {
  if (document.getElementById(input_id)) {
    document.getElementById(input_id).value = input_value;
  }
}

/* Submit form by ID. */
function spider_form_submit(event, form_id) {
  if (document.getElementById(form_id)) {
    document.getElementById(form_id).submit();
  }
  if (event.preventDefault) {
    event.preventDefault();
  }
  else {
    event.returnValue = false;
  }
}

/* Check if required field is empty. */
function spider_check_required(id, name) {
  if (jQuery('#' + id).val() == '') {
    alert(name + '* ' + bwg_objectL10n.bwg_field_required);
    jQuery('#' + id).attr('style', 'border-color: #FF0000;');
    jQuery('#' + id).focus();
    return true;
  }
  else {
    return false;
  }
}

/* Check if privacy polic field is checked. */
function comment_check_privacy_policy() {
	var bwg_submit = jQuery('#bwg_submit');
	bwg_submit.removeClass('bwg-submit-disabled');
	bwg_submit.removeAttr("disabled");
	if ( !jQuery('#bwg_comment_privacy_policy').is(':checked') ) {
		bwg_submit.addClass('bwg-submit-disabled');
		bwg_submit.attr('disabled', 'disabled');
	}
}

/* Check Email. */
function spider_check_email(id) {
  if (jQuery('#' + id).val() != '') {
    var email = jQuery('#' + id).val().replace(/^\s+|\s+$/g, '');
    if (email.search(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/) == -1) {
      alert(bwg_objectL10n.bwg_mail_validation);
      return true;
    }
    return false;
  }
}

/* Refresh captcha. */
function bwg_captcha_refresh(id) {
  if (document.getElementById(id + "_img") && document.getElementById(id + "_input")) {
    srcArr = document.getElementById(id + "_img").src.split("&r=");
    document.getElementById(id + "_img").src = srcArr[0] + '&r=' + Math.floor(Math.random() * 100);
    document.getElementById(id + "_img").style.display = "inline-block";
    document.getElementById(id + "_input").value = "";
  }
}

function bwg_play_instagram_video(obj,bwg) {
  jQuery(obj).parent().find("video").each(function () {
    if (jQuery(this).get(0).paused) {
      jQuery(this).get(0).play();
      jQuery(obj).children().hide();
    }
    else {
      jQuery(this).get(0).pause();
      jQuery(obj).children().show();
    }
  })
}
