
<?php

date_default_timezone_set('America/New_York');

require_once('mailer-documents/PHPMailerAutoload.php');
require_once('Email.php');
require_once('Phone.php');

class Go {
	private $id;
	private $email;
	private $depart_from;
	private $arrive_at;
	private $from_date; //Y-m-d
	private $until_date; //Y-m-d
	private $threshold;
	private $notify_phone; //1/0
	private $phone;

	public static function create($email, $depart_from, $arrive_at, $from_date, $until_date, $threshold, $notify_phone, $phone){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");
		
		$fdtstr = $from_date->format('Y-m-d');
		
		$udtstr = $until_date->format('Y-m-d');
		
		if ($phone == null){
			$phone_id = "''";
		} else{
			$phone_id = $phone;
		}

		$result = $mysqli->query("insert into Go values (0, " .
							intval($email) . ", " .
							intval($depart_from) . ", " .
							intval($arrive_at) . ", '" .
							$fdtstr . "', '" .
							$udtstr . "', " .
							intval($threshold) . ", " .
							$notify_phone . ", " .
							$phone_id . ")"); 
	
		if ($result){
			$id = $mysqli->insert_id;
			return new Go($id, intval($email), intval($depart_from), intval($arrive_at), $from_date, $until_date, intval($threshold), $notify_phone, $phone);
		} 
		return null;
	}
	
	private function __construct($id, $email, $depart_from, $arrive_at, $from_date, $until_date, $threshold, $notify_phone, $phone){
		$this->id = $id;
		$this->email = $email;
		$this->depart_from = $depart_from;
		$this->arrive_at = $arrive_at;
		$this->from_date = $from_date;
		$this->until_date = $until_date;
		$this->threshold = $threshold;
		$this->notify_phone = $notify_phone;
		$this->phone = $phone;
	}

	public function id(){
		return $this->id;
	}
	public function email(){
		return $this->email;
	}
	public function depart_from(){
		return $this->depart_from;
	}
	public function arrive_at(){
		return $this->arrive_at;
	}
	public function from_date(){
		return $this->from_date;
	}
	public function formatted_from_date(){
		$dt = new datetime($this->from_date);
		return $dt->format('F j, Y');
	}
	public function until_date(){
		return $this->until_date;
	}
	public function formatted_until_date(){
		$dt = new datetime($this->until_date);
		return $dt->format('F j, Y');
	}
	public function threshold(){
		return $this->threshold;
	}
	public function notify_phone(){
		return $this->notify_phone;
	}
	public function phone(){
		return $this->phone;
	}

	//I'll need setters later for some advanced functionality	
	public function _from_date($from_date){
		$this->from_date = $from_date;
		return $this->update();
	}

	public function _until_date($until_date){
		$this->until_date = $until_date;
		return $this->update();
	}
	public function _threshold($threshold){
		$this->threshold = $threshold;
		return $this->update();
	}
	public function _notify_phone($notify_phone){
		$this->notify_phone = $notify_phone;
		return $this->update();
	}
	public function _phone($phone){
		if ($phone == null) return;
		$this->phone = $phone;
		return $this->update();
	}
	


	public static function findByID($id){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$result = $mysqli->query("select * from Go where id = " . $id);
		if ($result) {
			if ($result->num_rows == 0){
				return null;
			}
		
			$go_info = $result->fetch_array();

			return new Go(intval($go_info['id']),
								$go_info['email'],
								$go_info['depart_from'],
								$go_info['arrive_at'],
								$go_info['from_date'],
								$go_info['until_date'],
								$go_info['threshold'],
								$go_info['notify_phone'],
								$go_info['phone']);
		}
		return null;
	}

	public function remove(){
	    $mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");
	    $mysqli->query("delete from Go where id = " . $this->id);
	}

	public static function findByHash($hash){
		$id_array = self::getAllIDs();
		foreach($id_array as &$curID){
			if ($hash == md5($curID)){
				return self::findByID($curID);
			}
		}
		return null;
	}

	public static function getAllIDs(){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$result = $mysqli->query("select id from Go");
		$id_array = array();

		if($result){
			while ($next_row = $result->fetch_array()) {
				$id_array[] = intval($next_row['id']);
			}
		}
		return $id_array;
	}

	public function send_confirmation_email(){
		$mail = new PHPMailer;
		$mail->isSMTP();                                     
		$mail->Host = 'smtp.gmail.com'; 
		$mail->SMTPAuth = true;       
		$mail->Port = 587;                        
		$mail->Username = 'joaovritter@gmail.com';                            
		$mail->Password = 'sw33tmelon$';                          
		$mail->SMTPSecure = 'tls'; 
		$mail->From = 'confirm@gobelow.com';
		$mail->FromName = 'GoBelow';
		$mail->AddAddress(Email::findByID($this->email)->address());
		$mail->WordWrap = 50;
		$mail->IsHTML(true);
		$mail->Subject = 'GoBelow Confirmation Message';

		$y1 = intval($this->from_date->format('Y'));
		$y2 = intval($this->until_date->format('Y'));

		if ($y1 == $y2){
			$fmdy = $this->from_date->format('F j');
			$umdy = $this->until_date->format('F j');
		}else{
			$fmdy = $this->from_date->format('F j, Y');
			$umdy = $this->until_date->format('F j, Y');
		}
		if ($this->from_date == $this->until_date) $dateText = "on $fmdy";
		else $dateText = "between $fmdy and $umdy";
		if (intval($this->notify_phone) === 1) $notifyText = "a text message notification to ".preg_replace("/^1?(\d{3})(\d{3})(\d{4})$/", "$1-$2-$3", Phone::findByID($this->phone)->number());
		else $notifyText = "another message to this email address";
		$dfcity = Airport::findByID($this->depart_from)->city();
		$dfcode = Airport::findByID($this->depart_from)->code();
		$aacity = Airport::findByID($this->arrive_at)->city();
		$aacode = Airport::findByID($this->arrive_at)->code();

		$mail->Body = "Thanks for using GoBelow! 
		\nWe will now begin searching for a flight from $dfcity ($dfcode) to$aacity ($aacode) that falls $dateText and costs under \$$this->threshold. 
		\nYou will receive $notifyText with a link to purchase flight tickets as soon as we find a match. 
		\nPlease note that we cannot guarentee prices. There is a better chance of locking in your low price if you persue the ticket soon after you receive notification from us. 
		\nTo view your GoBelow request or to remove it from our search engine, visit <a href='http://wwwp.cs.unc.edu/Courses/comp426-f13/ritterj/goBelow/server-side/go.php/" . $this->id . "/page/'>this link</a>.";
		
		if($mail->send()) return "mailsent";
		return $mail->ErrorInfo;
	}

	public function send_alert_email($price){
		$mail = new PHPMailer;
		$mail->isSMTP();                                     
		$mail->Host = 'smtp.gmail.com'; 
		$mail->SMTPAuth = true;       
		$mail->Port = 587;                        
		$mail->Username = 'joaovritter@gmail.com';                            
		$mail->Password = 'sw33tmelon$';                          
		$mail->SMTPSecure = 'tls'; 
		$mail->From = 'confirm@gobelow.com';
		$mail->FromName = 'GoBelow';
		$mail->AddAddress(Email::findByID($this->email)->address());
		$mail->WordWrap = 50;
		$mail->Subject = "We've found you a flight!";

		$mail->Body = "Thanks for using GoBelow! 
		\nWe have found a an airline ticket for \$$price which is lower than your threshold price of \$$this->threshold";
		
		if($mail->send()) return "mailsent";
		return $mail->ErrorInfo;
	}

	public function update($from_date, $until_date, $threshold, $notify_phone, $phone){
		
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$fdtstr = $from_date->format('Y-m-d');
		
		$udtstr = $until_date->format('Y-m-d');

		if ($phone == null){
			$phone_id = "''";
		} else{
			$phone_id = $phone;
		}

		$result = $mysqli->query("update Go set from_date='" . $fdtstr .
							"', until_date='" . $udtstr .
							"', threshold=" . intval($threshold) .
							", notify_phone=" . $notify_phone .
							", phone=" . $phone_id . 
							" where id=" . $this->id);
		if ($result){
			$this->from_date = $from_date;
			$this->until_date = $until_date;
			$this->threshold = intval($threshold);
			$this->notify_phone = $notify_phone;
			$this->phone = $phone;
			return $this;
		}
		return null;
	}

	public function getJSON(){
		
		$json_obj = array(
				'id' => $this->id,
				'email' => Email::findByID($this->email)->address(),
				'depart_from' => Airport::findByID($this->depart_from)->code(),
				'arrive_at' => Airport::findByID($this->arrive_at)->code(),
				'from_date' => $this->from_date->format('m-d-Y'),
				'until_date' => $this->until_date->format('m-d-Y'),
				'threshold' => $this->threshold,
				'notify_phone' => $this->notify_phone,
				'phone' => $this->phone);
		return json_encode($json_obj);
	}

	//DELETE AFTER PREZZZZ

	public function the_go_below_function(){
		$thresh = intval($this->threshold) + 7;
		$rand = rand(0, 10);
		$curprice = $thresh - $rand;
		if ($curprice < intval($this->threshold)){
			return array('rand'=>$curprice, 'result'=>true);
		}
		return array('rand'=>$curprice, 'result'=>false);

	}
}




?>
