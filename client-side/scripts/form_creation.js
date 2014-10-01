// JavaScript Document

var createForm = function(){
	var content = $('<div id="content"></div>');
	content.append('<div id="logo"></div>');
	
	var form = $('<form id="main-form"></form>');
	
	var main_fieldset = $('<fieldset id="main-fieldset"></fieldset>');
	main_fieldset.append('<label for="email"><p>Email |</p></label>');
	main_fieldset.append('<input id="email" type="email" name="email" placeholder="belo@example.com" required>');
	main_fieldset.append('<hr id="email-line">');
	
	var airports_text = $('<div id="airports-text"></div>');
	airports_text.append('<h4>Your starting location and destination.</h4>');
	airports_text.hide();
	
	main_fieldset.append(airports_text);
	
	main_fieldset.append('<label for="depart-from"><p>Depart from |</p></label>');
	main_fieldset.append('<input id="depart-from" class="airports" type="text" name="depart-from" required>');
	main_fieldset.append('<label for="arrive-at"><p>Arrive at |</p></label>');
	main_fieldset.append('<input id="arrive-at" class="airports" type="text" name="arrive-at" required>')
	main_fieldset.append('<hr>');
	
	var date_text = $('<div id="date-text"></div>');
	date_text.append('<h4>The date range within which you would like to search.</h4>');
	date_text.hide();
	
	main_fieldset.append(date_text);
	
	var mini_calendar1 = $('<img class="mini-calendar mini-calendar-from" src="images/mini-calendar.png" alt="Show Calendar">');
	var mini_calendar2 = $('<img class="mini-calendar mini-calendar-until" src="images/mini-calendar.png" alt="Show Calendar">');
	mini_calendar1.hide();
	mini_calendar2.hide();
	
	main_fieldset.append(mini_calendar1);
	main_fieldset.append('<label for="start-date"><p>Search from |</p></label>');
	main_fieldset.append('<input id="start-date" class="date-input" type="text" name="start-date" required>');
	main_fieldset.append(mini_calendar2);
	main_fieldset.append('<label for="end-date"><p>Until |</p></label>')

	main_fieldset.append('<input id="end-date" class="date-input" type="text" name="end-date" required>')
	main_fieldset.append('<hr>');
	
	var threshold_text = $('<div id="threshold-text"></div>');
	threshold_text.append('<h4>The maximum amount you wish to pay for the flight.</h4>');
	threshold_text.hide();
	
	main_fieldset.append(threshold_text);
	
	main_fieldset.append('<label id="threshold-label" for="threshold"><p>Threshold | <span style="color: #999;">$</span></p></label>')
	main_fieldset.append('<input id="threshold" type="text" name="threshold" style="width:4em;" maxlength="4" required>');
	main_fieldset.append('<hr>');
	main_fieldset.append('<div id="notif-text"><h4>Notify via</h4></div>');
	
	var radio_box = $('<div id="radio-box"></div>');
	radio_box.append('<input id="email-me" type="radio" name="notif-set" value="email-me" checked="checked">');
	radio_box.append('<label id="email-me-label" class="radio" for="email-me"><span><p>Email</p></span></label>');
	radio_box.append('<input id="text-me" type="radio" name="notif-set" value="text-me">');
	radio_box.append('<label id="text-me-label" class="radio" for="text-me"><span><p>Text message</p></span></label>')
	
	main_fieldset.append(radio_box);
	
	var phone_field = $('<div id="phone-field"></div>');
	phone_field.append('<hr>').append('<label for="phone-number"><p>Phone |</p></label>');
	phone_field.append('<input id="phone-number" type="tel" name="phone-number" placeholder="###-###-####" required>');
	phone_field.hide();
	
	main_fieldset.append(phone_field);
	
	form.append(main_fieldset);
	
	var button_fieldset = $('<fieldset id="submit-fieldset"></fieldset>');
	button_fieldset.append('<button type="submit" title="Go"></button>');
	
	form.append(button_fieldset);
	
	content.append(form);
	
	$('body').append(content);
}

