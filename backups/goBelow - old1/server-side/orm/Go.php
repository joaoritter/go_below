
<?php

date_default_timezone_set('America/New_York');


//require_once('orm/Phone.php');

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
			return new Go($id, intval($email), intval($depart_from), intval($arrive_at), $fdtstr, $udtstr, intval($threshold), $notify_phone, $phone);
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
/*
	private function update(){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$result = $mysqli->query("update Go set from_date='" . $mysqli->real_escape_string($this->from_date) .
							"', until_date='" . $mysqli->real_escape_string($this->until_date) .
							"', threshold=" . intval($this->threshold) .
							", notify_phone=" . intval($this->notify_phone) .
							", phone=" . intval($this->phone) . ")");
		return $result;
	}
*/
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
	public function until_date(){
		return $this->until_date;
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
/*
	//I'll need setters later for some advanced functionality	
	public function _from_date($from_date){
		if ($from_date == null){
			$fdtstr = null;
		} else{
			$fdtstr = $from_date->format('Y-m-d');
		}
		$this->from_date = $fdtstr;
		return $this->update();
	}

	public function _until_date($until_date){
		if ($until_date == null){
			$udtstr = null;
		} else{
			$udtstr = $until_date->format('Y-m-d');
		}
		$this->until_date = $udtstr;
		return $this->update();
	}
	public function _threshold($threshold){
		$this->threshold = $threshold;
		return $this->update();
	}
	public function _notify_phone($notify_phone){
		if ($notify_phone){
			$npstr = "1";
		} else{
			$npstr = "0";
		}
		$this->notify_phone = $npstr;
		return $this->update();
	}
	public function _phone($phone){
		$phone = Phone::create($phone);
		$this->phone = $phone->id;
		return $this->update();
	}
	
*/
/*
	public function delete(){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");
		$mysqli->query("delete from Go where id = " . $this->id);
	}
*/
	public function getJSON(){
		$json_obj = array(
				'id' => $this->id,
				'email' => $this->email,
				'depart_from' => $this->depart_from,
				'arrive_at' => $this->arrive_at,
				'from_date' => $this->from_date,
				'until_date' => $this->until_date,
				'threshold' => $this->threshold,
				'notify_phone' => $this->notify_phone,
				'phone' => $this->phone);
		return json_encode($json_obj);
	}
}
?>
