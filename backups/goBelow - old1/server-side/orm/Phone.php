<?php

date_default_timezone_set('America/New_York');

class Phone{
	private $id;
	private $number;

	public static function create($number){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$result = $mysqli->query("insert into Phone_numbers values (0, '" . $mysqli->real_escape_string($number) . "')");

		if($result){
			$id = $mysqli->insert_id;
			return new Phone($id, $number);
		}
		return null;
	}

	private function __construct($id, $number){
		$this->id = $id;
		$this->number = $number;
	}

	public function id(){
		return $this->id;
	}
	public function number(){
		return $this->number;
	}

	public static function getRepeatID($number){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$result = $mysqli->query("select id from Phone_numbers where number = '" . $number ."'");

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

		$result = $mysqli->query("select id from Phone_numbers");
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
		$result = $mysqli->query("select * from Phone_numbers where id = " . $id);

		if($result){
			if ($result->num_rows == 0) {
				return null;
      		}
      		$phone_info = $result->fetch_array();
      		return new Phone(intval($phone_info['id']), $phone_info['number']);
		}
		return null;	
	}

	public function getJSON(){
		$json_obj = array('id' => $this->id, 
						'number' => $this->number);
		return json_encode($json_obj);
	}
}



?>