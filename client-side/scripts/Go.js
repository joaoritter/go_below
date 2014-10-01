var Go = function(go_json){
	this.id = go_json.id;
	this.email = go_json.email;
	this.depart_from = go_json.depart_from;
	this.arrive_at = go_json.arrive_at;
	this.from_date = go_json.from_date;
	this.until_date = go_json.until_date;
	this.threshold = go_json.threshold;
	this.notify_phone = go_json.notify_phone;
	this.phone = go_json.phone;
}

//NO NEED FOR THE FOLLOWING AFTER THE PRESENTATION
Go.prototype.makeCompactDiv = function() {
    var cdiv = $("<div class='pick_me'></div>");

    var arprts_div = $("<div></div>");
    arprts_div.addClass('arprts');
    arprts_div.html(this.depart_from + " to " + this.arrive_at);
    cdiv.append(arprts_div);

    var dates_div = $("<div></div>");
    dates_div.addClass('dts');
	dates_div.html(this.from_date + " until " + this.until_date);
    cdiv.append(dates_div);

    var thresh_div = $("<div></div>");
    thresh_div.addClass('thrsh');
    thresh_div.html("Under $" + this.threshold);
    cdiv.append(thresh_div);
    cdiv.append('<button type="button" class="mb">Refresh</button>');
    cdiv.data('go', this);

    return cdiv;
};
