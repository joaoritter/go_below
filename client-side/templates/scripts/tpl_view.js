
var url_base = "http://wwwp.cs.unc.edu/Courses/comp426-f13/ritterj/goBelow/server-side";

$(document).ready(function () {
	
	clear_form();

	remove_entry();
});



var remove_entry = function(){
	$('#remove').on('click', function(e){
		e.preventDefault();
		$.ajax(url_base + "/go.php/" + phpVars[4] , {
			type: "GET",
			dataType: "json",
			data: {rm: true},
			success: function(json_obj, status, jqXHR){
				var result = $('<div class="result green"></div>');
				var title = $('<div class="down_title"></div>');
				var subtext = $('<div class="result_subtext"></div>')
				title.append('Success!');
				subtext.append('Your search has been deleted')
				result.append(title).append(subtext).hide().insertAfter('#button_place').slideDown([1000]);
				setTimeout('redirect()', 3000)
			}, 
			error: function(jqXHR, status, error){
				
				var result = $('<div class="result yellow"></div>');
				var title = $('<div class="down_title"></div>');
				var subtext = $('<div class="result_subtext"></div>')
				title.append('Something is wrong...');
				subtext.append(jqXHR.responseText);
				result.append(title).append(subtext).hide().insertAfter('#button_place').slideDown([1000]);
				
				
			}
		});


	})
}


var redirect = function(){
	 window.location = "http://wwwp.cs.unc.edu/Courses/comp426-f13/ritterj/goBelow/client-side/main.html";
}





var clear_form = function(){

	$('#make_changes').on('click', function(e){
		e.preventDefault();
	
		$('.chngble').remove();

		$("#main_form").removeClass('fixed_data');
		$("#main_form").addClass('maliable_data');
		
		var from_date = $('<input id="from_date" class="date_input rmafter" type="text" name="from_date" maxlength="30" value="' + phpVars[0] + '">');
		var until_date = $('<input id="until_date" class="date_input rmafter" type="text" name="until_date" maxlength="30" value="' + phpVars[1] + '">');
		var threshold = $('<input id="threshold" class="rmafter" type="text" name="threshold" style="width:5em;" maxlength="5" value="' + phpVars[2] + '">');
		var nm1;
		var nm2;
		if (phpVars[3] == 0){
			nm1 = 'checked="checked"'
			nm2 = '';
		}else{
			nm2 = 'checked="checked"'
			nm1 = '';
		}

		var radio = $('<div id="radio_box" class="rmafter"></div>');
		radio.append('<input id="email_me" type="radio" name="notify_phone" value="0"' + nm1 +'>');
		var l1 = $('<label id="email_me_label" class="radio" for="email_me"></label>');
		var s1 = $('<span></span>');
		s1.append('<p>Email</p>');
		l1.append(s1);
		radio.append(l1);
		radio.append('<input id="text_me" type="radio" name="notify_phone" value="1" maxlength="16"' + nm2 + '>');
		var l2 = $('<label id="text_me_label" class="radio" for="text_me"></label>');
		var s2 = $('<span></span>');
		s2.append('<p>Text message</p>');
		l2.append(s2);
		radio.append(l2);

		var new_button = $('<button id="memorialize_changes" class="rmafter" type="submit" title="memorialize_changes">Update</button>');
								
		from_date.insertAfter('label[for="from_date"]');
		until_date.insertAfter('label[for="until_date"]');
		threshold.insertAfter('label[for="threshold"]');
		radio.insertAfter('#notify_phone');
		$('#button_place').append(new_button);

		create_dropdivs();
		
		toggle_dropdivs();
		
		monitor_radio();
	
		set_datepickers();

		post_form();

	});

}

var create_dropdivs = function(){
	var date_text = $('<div id="date_text"></div>');
	date_text.append('<h4>The date range within which you would like to search.</h4>');
	date_text.hide();
	date_text.insertAfter('#deparr_line');
	
	var mini_calendar1 = $('<img class="mini_calendar mini_calendar_from" src="../../../../client-side/images/mini_calendar.png" alt="Show Calendar">');
	mini_calendar1.hide();
	mini_calendar1.insertAfter('#date_text');

	var mini_calendar2 = $('<img class="mini_calendar mini_calendar_until" src="../../../../client-side/images/mini_calendar.png" alt="Show Calendar">');
	mini_calendar2.hide();
	mini_calendar2.insertAfter('#from_date');
	
	var threshold_text = $('<div id="threshold_text"></div>'); 
	threshold_text.append('<h4>The maximum amount you wish to pay for the flight.</h4>');
	threshold_text.hide();
	threshold_text.insertAfter('#date_line');
	
	var phone_field = $('<div id="phone_field"></div>');
	phone_field.append('<hr>').append('<label for="phone_number"><p>Phone |</p></label>');
	phone_field.append('<input id="phone" type="tel" name="phone" placeholder="###-###-####" maxlength="20">');
	phone_field.hide(); 
	phone_field.insertAfter('#radio_box');
};


var toggle_dropdivs = function(){	
	
	$(".date_input").on('focus', function(e) {
		var date_text = $('#date_text');
		if (date_text.hasClass('visible')) return;
		clean_text_fields();
		date_text.addClass('visible');
		date_text.slideDown([1000]);
		$(".date_input").attr("placeholder", "mm/dd/yyyy");
		$(".mini_calendar").show('slide');
	});

	$("#threshold").on('focus', function(e) {
		var thresh_text = $('#threshold_text');
		if (thresh_text.hasClass('visible')) return;
		clean_text_fields();
		thresh_text.addClass('visible');
		thresh_text.slideDown([1000]);
	});
};

var monitor_radio = function(){
	$("input[type='radio']").change(function(){
		clean_text_fields();
		var phone_field = $('#phone_field');
		if ($(this).val() == "1"){
			 phone_field.slideDown([1000]);
		} else {
			 phone_field.slideUp([1000]);
		}
	});
};

var set_datepickers = function(){
	var from = $('#from_date');
	var until = $('#until_date');
	$('.mini_calendar').on('click', function(e){	
		$.datepicker.setDefaults($.extend($.datepicker.regional[""]));
		if ($(this).hasClass('mini_calendar_from')){
		     from.datepicker({ showAnim: "fade" });
			 until.datepicker({ showAnim: "fade" });
			 if (from.datepicker( "widget" ).is(":visible")){
				from.datepicker('hide');
				return;
			}
			 from.focus();
		}
		else{
			from.datepicker({ showAnim: "fade" });
			until.datepicker({ showAnim: "fade" });
			if (until.datepicker( "widget" ).is(":visible")){
				until.datepicker('hide');
				return;
			}
			until.focus();
		}			
	});
	$('.mini_calendar').hover(function(){
		this.src = '../../../../client-side/images/mini_calendar_hover.png';
	    }, function(){
	        this.src = '../../../../client-side/images/mini_calendar.png';
	});

	from.on('keydown', function(){
		if (from.datepicker( "widget" ).is(":visible")){
			from.datepicker('hide');
			return;
		}
	});
	until.on('keydown', function(){
		if (until.datepicker( "widget" ).is(":visible")){
			until.datepicker('hide');
			return;
		}
	});

};



var post_form = function(){
	var form = $(".maliable_data");
	form.on('submit', function(e){
		e.preventDefault();
		if (form.hasClass('flagged')) return;
		form.addClass('flagged');
		var proceed4 = check_d1_value();
		var proceed5 = check_d2_value();
		var proceed6 = check_thresh_value();
		var proceed7 = check_phone_value();
		if (!proceed4 || !proceed5 || !proceed6 || !proceed7){
			form.removeClass('flagged');
			return;
		}
		clean_text_fields();
		$.ajax(url_base + "/go.php/" + phpVars[4] , {
			type: "POST",
			dataType: "json",
			data: {
				from_date: $("input[name='from_date']").val(),
				until_date: $("input[name='until_date']").val(),
				threshold: Math.floor($("input[name='threshold']").val().replace(/\,/g,'')),
				notify_phone: $("input[name='notify_phone']:checked").val(),
				phone: $("input[name='phone']").val().replace(/\-/g,'')
				},
			success: function(json_obj, status, jqXHR){
				var result = $('<div class="result green"></div>');
				var title = $('<div class="down_title"></div>');
				var subtext = $('<div class="result_subtext"></div>')
				title.append('Success!');
				subtext.append('Your search has been updated')
				result.append(title).append(subtext).hide().insertAfter('#button_place').slideDown([1000]);
				var go_obj = new Go(json_obj);
				clear_inputs(go_obj);
				
			}, 
			error: function(jqXHR, status, error){
				alert(jqXHR.responseText);
				try{
					var err = $.parseJSON(jqXHR.responseText);
				}
				catch(e){}
				if(err){
					if (err.problem === 'ubf'){
						form.removeClass('flagged');
						err_ubf();
						return;
					} 
				}
				if (parseInt(jqXHR.status) === 500) var result = $('<div class="result red"></div>');
				else var result = $('<div class="result yellow"></div>');
				var title = $('<div class="down_title"></div>');
				var subtext = $('<div class="result_subtext"></div>')
				title.append('Something is wrong...');
				subtext.append(jqXHR.responseText);
				result.append(title).append(subtext).hide().insertAfter('#go').slideDown([1000]);
				$(':input').on('focus', function(){
					$(this).on('keydown', function(){
						result.slideUp([1000]).removeClass('red').removeClass('yellow');
						form.removeClass('flagged');
					});
				});	
				
			}
		});
	});
};

var clear_inputs = function(e){
		$("#main_form").addClass('fixed_data');
		$("#main_form").removeClass('maliable_data');
	$('.rmafter').slideUp([1000]).remove();
	var fd_label = $('<label for="from_date"></label>');
	fd_label.append('<p></p>').append('Search from |   <span class="php_data chngble">' + e.from_date +'</span>');
	var ud_label = $('<label for="until_date"></label>');
	ud_label.append('<p></p>').append('Until |   <span class="php_data chngble">' + e.until_date + '</span>');
	
	var t_label = $('<label id="threshold_label" for="threshold"></label>');
	t_label.append('<p></p>').append('Threshold | <span style="color: #999;">$</span><span class="php_data chngble">' + e.threshold + '</span>');
	
	var np_div = $('<div id="notify_phone">');
	if (e.notify_phone = 1){
		var s = "Phone";
	}
	else var s = "Email";
	np_div.append('<p>Notify via | <span class="php_data chngble">' + s + '</p>');
	fd_label.insertAfter('#deparr_line');
	ud_label.insertAfter('label[for="from_date"]');
	t_label.insertAfter('#date_line');
	np_div.insertAfter('#thresh_line');
	var button = $('<button id="make_changes" class="chngble" type="submit" title="make_changes">Make Changes</button>');
	$('#button_place').append(button);
	phpVars[0] = e.from_date;
	phpVars[1] = e.until_date;
	phpVars[2] = e.threshold;
	phpVars[3] = e.notify_phone;
	clear_form();
}





