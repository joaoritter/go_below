<?php

date_default_timezone_set('America/New_York');

class Email{
	private $id;
	private $address;

	public static function create($address){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$result = $mysqli->query("insert into Email_addresses values (0, '" . $mysqli->real_escape_string($address) . "')");

		if($result){
			$id = $mysqli->insert_id;
			return new Email($id, $address);
		}
		return null;
	}

	private function __construct($id, $address){
		$this->id = $id;
		$this->address = $address;
	}

	public function id(){
		return $this->id;
	}
	public function address(){
		return $this->address;
	}

	public static function getRepeatID($address){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$result = $mysqli->query("select id from Email_addresses where address = '" . $address ."'");

		if ($result){
			while ($next_row = $result->fetch_array()) {
				$id_array[] = intval($next_row['id']);
			}
			if (count($id_array) == 1) return $id_array[0];
			if (count($id_array) > 1) return -1;
		} 
		return null;
	}

	public static function getAllIDs(){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$result = $mysqli->query("select id from Email_addresses");
		$id_array = array();

		if($result){
			while ($next_row = $result->fetch_array()) {
				$id_array[] = intval($next_row['id']);
			}
		}
		return $id_array;
	}

	public static function findByID($id){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");
		$result = $mysqli->query("select * from Email_addresses where id = " . $id);

		if($result){
			if ($result->num_rows == 0) {
				return null;
      		}
      		$email_info = $result->fetch_array();
      		return new Email(intval($email_info['id']), $email_info['address']);
		}
		return null;	
	}

	public function getJSON(){
		$json_obj = array('id' => $this->id, 
						'address' => $this->address);
		return json_encode($json_obj);
	}
}



?>