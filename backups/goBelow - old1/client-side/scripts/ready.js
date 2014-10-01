// JavaScript Document

var url_base = "http://wwwp.cs.unc.edu/Courses/comp426-f13/ritterj/goBelow/server-side";
var first_time = 0;
$(document).ready(function () {

	create_dropdivs();
		
	toggle_dropdivs();
		
	monitor_radio();
	
	set_datepickers();
	
	ap_list();

	post_form();
});

var create_dropdivs = function(){
	var airports_text = $('<div id="airports_text"></div>');
	airports_text.append('<h4>Your starting location and destination.</h4>');
	airports_text.hide();
	airports_text.insertAfter('#email_line');

	var date_text = $('<div id="date_text"></div>');
	date_text.append('<h4>The date range within which you would like to search.</h4>');
	date_text.hide();
	date_text.insertAfter('#deparr_line');
	
	var mini_calendar1 = $('<img class="mini_calendar mini_calendar_from" src="images/mini_calendar.png" alt="Show Calendar">');
	mini_calendar1.hide();
	mini_calendar1.insertAfter('#date_text');

	var mini_calendar2 = $('<img class="mini_calendar mini_calendar_until" src="images/mini_calendar.png" alt="Show Calendar">');
	mini_calendar2.hide();
	mini_calendar2.insertAfter('#from_date');
	
	var threshold_text = $('<div id="threshold_text"></div>'); 
	threshold_text.append('<h4>The maximum amount you wish to pay for the flight.</h4>');
	threshold_text.hide();
	threshold_text.insertAfter('#date_line');
	
	var phone_field = $('<div id="phone_field"></div>');
	phone_field.append('<hr>').append('<label for="phone_number"><p>Phone |</p></label>');
	phone_field.append('<input id="phone" type="tel" name="phone" placeholder="###-###-####">');
	phone_field.hide(); 
	phone_field.insertAfter('#radio_box');
};


var toggle_dropdivs = function(){	
	$("#email").on('focus', function(e) {
		clean_text_fields();
	});

	$(".airports").on('focus', function(e) {
		var airports_text = $('#airports_text')
		if (airports_text.hasClass('visible')) return;
		clean_text_fields();
		airports_text.addClass('visible');
		airports_text.slideDown([1000]);
		$('#depart_from').attr("placeholder", "JFK");
		$('#arrive_at').attr("placeholder", "LAX");
	});
	
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
		this.src = 'images/mini_calendar_hover.png';
	    }, function(){
	        this.src = 'images/mini_calendar.png';
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

var ap_list = function(){
	$( "#depart_from" ).autocomplete({
		source: function(request, response) {
   		var input_arr = request.term.toUpperCase().split(" ");
   		response(funnel_results(input_arr, airports_list, 0));
  		}, 
  		autoFocus: true,
  		delay: 50,
  		minLength: 2
	});
	$( "#arrive_at" ).autocomplete({
		source: function(request, response) {
   		var input_arr = request.term.toUpperCase().split(" ");
   		response(funnel_results(input_arr, airports_list, 0));
  		}, 
  		autoFocus: true,
  		delay: 50,
  		minLength: 2
	});
};

var post_form = function(){
	var form = $("#main_form");
	form.on('submit', function(e){
		e.preventDefault();
		if (form.hasClass('flagged')) return;
		form.addClass('flagged');
		var proceed1 = check_df_value();
		var proceed2 = check_aa_value();
		var proceed3 = check_email_value();
		var proceed4 = check_d1_value();
		var proceed5 = check_d2_value();
		var proceed6 = check_thresh_value();
		var proceed7 = check_phone_value();
		if (!proceed1 || !proceed2 || !proceed3 || !proceed4 || !proceed5 || !proceed6 || !proceed7){
			form.removeClass('flagged');
			return;
		}
		$.ajax(url_base + "/go.php", {
			type: "POST",
			dataType: "json",
			data: {email: $("input[name='email']").val(), 
				depart_from: $('#depart_from').data('airport').code,
				arrive_at: $('#arrive_at').data('airport').code,
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
				subtext.append('You will receive an email confirmation shortly.')
				result.append(title).append(subtext).hide().insertAfter('#go').slideDown([1000]);
				$(':input').on('focus', function(){
					$(this).on('keydown', function(){
						result.slideUp([1000]).removeClass('green');
						form.removeClass('flagged');
					});
				});
			}, 
			error: function(jqXHR, status, error){
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

















