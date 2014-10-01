//used in toggle_dropdivs

var clean_text_fields = function(){
	$('.visible').slideUp([1000]).removeClass('visible');
	$(".mini_calendar").hide();
};

//used in ap_list


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

