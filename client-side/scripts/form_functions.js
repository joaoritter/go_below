//used in toggle_dropdivs

var clean_text_fields = function(){
	$('.visible').slideUp([1000]).removeClass('visible');
	$(".date_input").removeAttr("placeholder");
	$('#depart_from').removeAttr("placeholder");
	$('#arrive_at').removeAttr("placeholder");
	$(".mini_calendar").hide();
};

//used in ap_list
var funnel_results = function(i_arr, arr, idx){
   	var matches = $.map(arr, function(tag) {
   		var v_arr = tag.label.toUpperCase().split(" ");
   		for (var i = 0, len = v_arr.length; i < len; i++){		
   			if (v_arr[i].indexOf(i_arr[idx]) === 0){
   				return tag;
   			}
   		}				
   	});
   	if(i_arr.length - 1 === idx) return matches;
   	return funnel_results(i_arr, matches, idx+1);			
}


//used in post_form
var check_df_value = function(){
   var depart_from = $('#depart_from');
   var depart_from_val = depart_from.val();
   if($('#depart_from').val() == ""){
      if (depart_from.hasClass('no_good')) return false;
      depart_from.addClass('no_good');
      var down = $("<div class='down red'></div>");
      var title = $('<div class="down_title"></div>');
      title.append('Required');
      down.append(title).hide().insertAfter('#depart_from').slideDown([1000]);
      remove_down(depart_from);
      return false;
   }
   var dv = depart_from_val.toUpperCase().split(" ");
   new_dv = funnel_results(dv, airports_list, 0);
   var len = new_dv.length;
   if(new_dv.length == 1){
      depart_from.val(new_dv[0].value).data('airport', new_dv[0]);
      return true;
   } else if (new_dv.length > 1){
      for (var i = 0; i < len; i++){
         if (depart_from_val == new_dv[i].value){
            depart_from.val(new_dv[0].value).data('airport', new_dv[0]);
            return true;
         }
      }
      if (depart_from.hasClass('no_good')) return false;
      depart_from.addClass('no_good');
      var down = $("<div class='down yellow'></div>");
      var title = $('<div class="down_title"></div>');
      if (new_dv.length > 9){
         title.append('Be more specific');
      }else{
         title.append('Did you mean...');
         down.append(title);
         for (var i = 0; i < len; i++){
            var ap_option = $('<div class="ap_option">' + new_dv[i].label + '</div>');
            ap_option.data('airport', new_dv[i]);
            down.append(ap_option);
         }
      }
      down.hide().insertAfter('#depart_from').slideDown([1000]);
       $('.ap_option').on('click', function(e){
               depart_from.val($(this).data('airport').value);
               down.slideUp([1000]).removeClass('yellow');
               depart_from.removeClass('no_good');
      });
      remove_down(depart_from);
      return false;
   } else{
      if ($('#depart_from').hasClass('no_good')) return false;
      $('#depart_from').addClass('no_good');
      var down = $("<div class='down yellow'></div>");
      var title = ('<div class="down_title"></div>');
      title.append('Airport not found');
      down.append(title).hide().insertAfter('#depart_from').slideDown([1000]);
      remove_own(depart_from);
      return false;
   }
}

var check_aa_value = function(){
   var arrive_at = $('#arrive_at');
   var arrive_at_val = arrive_at.val();
   if(arrive_at_val == ""){
      if (arrive_at.hasClass('no_good')) return false;
      arrive_at.addClass('no_good');
      var down = $("<div class='down red'></div>");
      title = $('<div class="down_title"></div>');
      title.append('Required');
      down.append(title);
      down.append(title).hide().insertAfter('#arrive_at').slideDown([1000]);
      remove_down(arrive_at);
      return false;
   }

   var av = arrive_at_val.toUpperCase().split(" ");
   new_av = funnel_results(av, airports_list, 0);
   var len = new_av.length;
   if(new_av.length == 1){
      arrive_at.val(new_av[0].value).data('airport', new_av[0]);
      if (arrive_at_val != $('#depart_from').val()) return true;
      if (arrive_at.hasClass('no_good')) return false;
      arrive_at.addClass('no_good');
      var down = $("<div class='down yellow'></div>");
      title = $('<div class="down_title"></div>');
      title.append('Can\'t depart from and arrive at the same airport.');
      down.append(title);
      down.hide().insertAfter('#arrive_at').slideDown([1000]);
      remove_down(arrive_at);
      return false;
   } else if (new_av.length > 1){
      for (var i = 0; i < len; i++){
         if (arrive_at_val == new_av[i].value){
            arrive_at.val(new_av[0].value).data('airport', new_av[0]);
            return true;
         }
      }
      if (arrive_at.hasClass('no_good')) return false;
      arrive_at.addClass('no_good');
      var down = $("<div class='down yellow'></div>");
      title = $('<div class="down_title"></div>');
      if (new_av.length > 9){      
            title.append('Be more specific')
            down.append(title);
      } else {
         title.append('Did you mean...');
         down.append(title);
         for (var i = 0; i < len; i++){
            var ap_option = $('<div class="ap_option">' + new_av[i].label + '</div>');
            ap_option.data('airport', new_av[i]);
            down.append(ap_option);
         }
      } 
      down.hide().insertAfter('#arrive_at').slideDown([1000]);
      $('.ap_option').on('click', function(e){
            arrive_at.val($(this).data('airport').value);
            down.slideUp([1000]).removeClass('yellow');
            arrive_at.removeClass('no_good');
         });
      remove_down(arrive_at);
      return false;
   } else{
      if (arrive_at.hasClass('no_good')) return false;
      arrive_at.addClass('no_good');
      var down = $("<div class='down yellow'></div>");
      var title = $('<div class="down_title"></div>');
      title.append('Airport not found');
      down.append(title).hide().insertAfter('#arrive_at').slideDown([1000]);
      remove_down(arrive_at);
      return false;
   }
}
var check_email_value = function(){
   var email = $('#email');
   var email_val = email.val();
   if (email_val == ""){
      if (email.hasClass('no_good')) return false;
      email.addClass('no_good');
      var down = $("<div class='down red'></div>");
      var title = $("<div class='down_title'></div>");
      title.append('Required');
      down.append(title).hide().insertAfter(email).slideDown([1000]);
      remove_down(email);
      return false;
   }
   var re = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (re.test(email_val)) return true;
    if (email.hasClass('no_good')) return false;
      email.addClass('no_good');
      var down = $("<div class='down yellow'></div>");
      var title = $('<div class="down_title"></div>');
      title.append('Invalid email address');
      down.append(title).hide().insertAfter(email).slideDown([1000]);
      remove_down(email);
      return false;
}

var check_d1_value = function(){
   var date = $('#from_date');
   var date_val = date.val();
   if (date_val == ""){
      if (date.hasClass('no_good')) return false;
      date.addClass('no_good');
      var down = $("<div class='down red'></div>");
      var title = $("<div class='down_title'></div>");
      title.append('Required');
      down.append(title).hide().insertAfter(date).slideDown([1000]);
      datepicker_remove_down(down, date, ".mini_calendar_from");
      remove_down(date);
      return false;
   } //rest gets validated as a result of PHP
   return true;
}

var check_d2_value = function(){
   var date = $('#until_date');
   var date_val = date.val();
   if (date_val == ""){
      if (date.hasClass('no_good')) return false;
      date.addClass('no_good');
      var down = $("<div class='down red'></div>");
      var title = $("<div class='down_title'></div>");
      title.append('Required');
      down.append(title).hide().insertAfter(date).slideDown([1000]);
      datepicker_remove_down(down, date, ".mini_calendar_until");
      remove_down(date);
      return false;
   } //rest gets validated as a result of PHP
   return true;
}

var check_thresh_value = function(){
   var thresh = $('#threshold');
   var tv = thresh.val().replace(/\,/g,'');
   var thresh_val = Math.floor(tv);
   if (thresh_val == ""){
      if (thresh.hasClass('no_good')) return false;
      thresh.addClass('no_good');
      var down = $("<div class='down red'></div>");
      var title = $("<div class='down_title'></div>");
      title.append('Required');
      down.append(title).hide().insertAfter(thresh).slideDown([1000]);
      remove_down(thresh);
      return false;
   }
   if (!(thresh_val > 0 && thresh_val < 10000)){
      if (thresh.hasClass('no_good')) return false;
      thresh.addClass('no_good');
      var down = $("<div class='down yellow'></div>");
      var title = $("<div class='down_title'></div>");
      title.append('Threshold out of range');
      down.append(title).hide().insertAfter(thresh).slideDown([1000]);
      remove_down(thresh);
      return false;
   }
   return true;
}

var check_phone_value = function(){
   var phone = $('#phone');
   var phone_val = phone.val().replace(/[A-Za-z$-]/g,''); //remove replace if i decide to go back
   if($('input[name="notify_phone"]:checked').val() == "0"){
      return true;
   } 
      if (phone_val == ""){
         if (phone.hasClass('no_good')) return false;
         phone.addClass('no_good');
         var down = $("<div class='down red'></div>");
         var title = $("<div class='down_title'></div>");
         title.append('Required');
         down.append(title).hide().insertAfter(phone).slideDown([1000]);
         radio_remove_down(down);
         remove_down(phone);
         return false;
      }
      //var re = new RegExp(/^\d{3}[\-]?\d{3}[\-]?\d{4}$/);
      if (phone_val.length < 10){
         if (phone.hasClass('no_good')) return false;
         phone.addClass('no_good');
         var down = $("<div class='down yellow'></div>");
         var title = $('<div class="down_title"></div>');
         title.append('Make sure area code is included');
         down.append(title).hide().insertAfter(phone).slideDown([1000]);
         radio_remove_down(down);
         remove_down(phone);
         return false;
         } 
      if (phone_val.length > 20){
         if (phone.hasClass('no_good')) return false;
         phone.addClass('no_good');
         var down = $("<div class='down yellow'></div>");
         var title = $('<div class="down_title"></div>');
         title.append('Invalid phone number');
         down.append(title).hide().insertAfter(phone).slideDown([1000]);
         radio_remove_down(down);
         remove_down(phone);
         return false;
      }
      return true;
      /*if (re.test(phone_val)) return true;
      if (phone.hasClass('no_good')) return false;
      phone.addClass('no_good');
      var down = $("<div class='down yellow'></div>");
      var title = $('<div class="down_title"></div>');
      title.append('Invalid phone number');
      down.append(title).hide().insertAfter(phone).slideDown([1000]);
      radio_remove_down(down);
      remove_down(phone);
      return false;*/
}

var remove_down = function(input){
   input.on("focus", function(){
         input.on("keydown", function(){
            input.next(".down").slideUp([1000]).removeClass('yellow').removeClass('red');
            input.removeClass('no_good');
         });
      });
}

var radio_remove_down = function(down){
   var radio = $('input[name="notify_phone"]');
   radio.on('change', function(){
      down.slideUp([1000]).removeClass('yellow').removeClass('red');
      $('#phone').removeClass('no_good');
   })
}

var datepicker_remove_down = function(down, input, cal_class){
   $(cal_class).on('click', function(){
      down.slideUp([1000]).removeClass('yellow').removeClass('red');
      input.removeClass('no_good');
   })
}

var err_ubf = function(){
   var date = $('#until_date');
   var date_val = date.val();
   if (date.hasClass('no_good')) return;
   date.addClass('no_good');
   var down = $("<div class='down yellow'></div>");
   var title = $("<div class='down_title'></div>");
   title.append('\'Until\' date can\'t be before \'From\' date');
   down.append(title).hide().insertAfter(date).slideDown([1000]);
   date.on('focus', function(){
      down.slideUp([1000]).removeClass('yellow').removeClass('red');
      input.removeClass('no_good');
   })
   remove_down(date);
   return;
}

