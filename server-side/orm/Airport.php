<?php

date_default_timezone_set('America/New_York');

Class Airport{
	private $id;
	private $code;
	private $name;
	private $city;
	private $country;
	private $latitude;
	private $longitude;

	private function __construct($id, $code, $name, $city, $country, $latitude, $longitude){
		$this->id = $id;
		$this->code = $code;
		$this->name = $name;
		$this->city = $city;
		$this->country = $country;
		$this->latitude = $latitude;
		$this->longitude = $longitude;
	}

	public function id(){
		return $this->id;
	}
	public function code(){
		return $this->code;
	}
	public function name(){
		return $this->name;
	}
	public function city(){
		return $this->city;
	}
	public function country(){
		return $this->country;
	}
	public function latitude(){
		return $this->latitude;
	}
	public function longitude(){
		return $this->longitude;
	}

	public static function getAllIDs(){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");
		$result = $mysqli->query("select id from Airports");
		$id_array = array();
		if ($result) {
			while ($next_row = $result->fetch_array()) {
				$id_array[] = intval($next_row['id']);
			}
		}
		return $id_array;
	}

	public static function findByCode($code){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");
		$result = $mysqli->query("Select * from Airports where code = '" . $code . "'");
		if ($result){
			if ($result->num_rows == 0){
				return null;
			}

			$airport_info = $result->fetch_array();
		
			return new Airport(intval($airport_info['id']),
							$airport_info['code'],
							$airport_info['name'],
							$airport_info['city'],
							$airport_info['country'],
							$airport_info['latitude'],
							$airport_info['longitude']);
		}
		return null;
	}

	public static function findByID($id){
		$mysqli = new mysqli("classroom.cs.unc.edu", "ritterj", "ritterj", "ritterjdb");

		$result = $mysqli->query("select * from Airports where id = " . $id);
		if ($result) {
			if ($result->num_rows == 0){
				return null;
			}
		
			$airport_info = $result->fetch_array();

			return new Airport(intval($airport_info['id']),
								$airport_info['code'],
								$airport_info['name'],
								$airport_info['city'],
								$airport_info['country'],
								$airport_info['latitude'],
								$airport_info['longitude']);
		}
		return null;
	}

	public function getJSON(){
		$json_obj = array(
				'id' => $this->id,
				'code' => $this->code,
				'name' => $this->name,
				'city' => $this->city,
				'country' => $this->country,
				'latitude' => $this->latitude,
				'longitude' => $this->longitude);
		return json_encode($json_obj);
	}
}
?>