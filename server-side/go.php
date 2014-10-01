
<?php

require_once('orm/Go.php');
require_once('orm/Airport.php');
require_once('orm/Email.php');
require_once('orm/Phone.php');
require_once('Savant3-3.0.1/Savant3-3.0.1/Savant3.php');

$path_components = explode('/', $_SERVER['PATH_INFO']);

if ($_SERVER['REQUEST_METHOD'] == 'GET'){

	if ((count($path_components) >= 2) && ($path_components[1] != "")) {

    $go_id = trim($path_components[1]);

    $go = Go::findByID($go_id);

    if ($go == null) {
      // Go not found.
      header("HTTP/1.0 404 Not Found");
      print("Server Error: Error #99");
      exit();
    }

//RESTORE AFTER PRESENTATION

    if (isset($_REQUEST['rm'])) {
      $go->remove();
      header("Content-type: application/json");
      print(json_encode(true));
      exit();
    } 

    if (trim($path_components[2]) == "page"){

    	$tpl = new Savant3();

    	$tpl->title = "GoBelow User Page";
    	$df = Airport::findByID($go->depart_from());
    	$aa = Airport::findByID($go->arrive_at());
    	$tpl->id = $go->id();

    	$tpl->email = Email::findByID($go->email())->address();

		$tpl->depart_from = $df->code() . " - " . $df->city();
		$tpl->arrive_at = $aa->code() . " - " . $aa->city();
		$tpl->from_date = $go->formatted_from_date();
		$tpl->until_date = $go->formatted_until_date();
		$tpl->threshold = $go->threshold();
		$tpl->notify_phone = $go->notify_phone();
		$mdy_from_date = new datetime($go->from_date());
		$tpl->mdy_from_date = $mdy_from_date->format('m/d/Y');
		$mdy_until_date = new datetime($go->until_date());
		$tpl->mdy_until_date = $mdy_until_date->format('m/d/Y');

		$tpl->display("templates/usrform.tpl.php");
		exit();
    }

    $result = $go->the_go_below_function();
    if($result['result']){
		header("Content-type: application/json");
    	print(json_encode($result));
    	$go->send_alert_email($result['rand']);
    	$go->remove();
    	exit();
    }
    else{
		header("Content-type: application/json");
    	print(json_encode($result));
    	exit();
    }
 
}

} else if ($_SERVER['REQUEST_METHOD'] == 'POST'){

	//creating or updating
	if ((count($path_components) > 1) && ($path_components[1] != "")){
			$go_id = intval($path_components[1]);
	    	$go = Go::findByID($go_id);

	    if ($go == null) {
	      // Todo not found.
	      header("HTTP/1.0 404 Not Found");
	      print("Server Error: Error #105");
	      exit();
	    }
	    //end of fixxer
	    //Validate values
		if ((!isset($_REQUEST['from_date'])) || (trim($_REQUEST["from_date"]) == "")){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: From date required");
			exit();
		}
		if ((!isset($_REQUEST["until_date"])) || (trim($_REQUEST["until_date"]) == "")){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Until date required");
			exit();
		}
		if ((!isset($_REQUEST["threshold"])) || (intval($_REQUEST["threshold"]) == "")){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Threshold required");
			exit();
		}
		if (intval($_REQUEST["notify_phone"]) == 1){
			if ((!isset($_REQUEST["phone"])) || (trim($_REQUEST["phone"]) == "")){
				header("HTTP/1.0 400 Bad Request");
				print("Server Error: Phone number required");
				exit();
			}
		}

		$fdtstr = trim($_REQUEST["from_date"]);
		$udtstr = trim($_REQUEST["until_date"]);
		
		$threshold = intval($_REQUEST["threshold"]);
		if (!($threshold > 0 && $threshold < 10000)){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Threshold out of range");
			exit();
		}

		$notify_phone = intval($_REQUEST["notify_phone"]);
		if (!(($notify_phone == 0) || ($notify_phone == 1))){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Notification method not set");
			exit();
		}

		$new_phone_id = null;
		if ($notify_phone == 1){
			$phone = trim($_REQUEST["phone"]);
			//REGEX
			/*if(preg_match("/^\d{3}[\-]?\d{3}[\-]?\d{4}$/", $phone) == 0){
					header("HTTP/1.0 400 Bad Request");
	        		print("Server Error: Phone number format not recognized");
	        		exit();
			}*/
			$phone = preg_replace('/\D+/', '', $phone);

			if(strlen($phone) < 10){
				header("HTTP/1.0 400 Bad Request");
	        	print("Server Error: Make sure phone number has area code");
	        	exit();
			}
			if(strlen($phone) > 20){
				header("HTTP/1.0 400 Bad Request");
	        	print("Server Error: Phone number format not recognized");
	        	exit();
			}
				
			$new_phone_id = Phone::getRepeatID($phone);
			if($new_phone_id == null){
				$new_phone = Phone::create($phone);
				if ($new_phone == null){
					header("HTTP/1.0 500 Server Error");
					print("Server Error: Error #100"); //could not make new Phone");
					exit();
				}
				$new_phone_id = $new_phone->id();
			} else if ($new_phone_id == -1){
				header("HTTP/1.0 500 Server Error");
				print("Server Error: Error #101");// Phone database id overload");
				exit();
			}
						
		}


		try{
			$from_date = new DateTime($fdtstr);
		} catch (Exception $e) {
			header("HTTP/1.0 400 Server Error");
			print("Server Error: From date format not recognized");
			exit();
		}	

		try{
			$until_date = new DateTime($udtstr);
		} catch (Exception $e) {
			header("HTTP/1.0 400 Server Error");
			print("Server Error: Until date format not recognized");
			exit();
		}
		$now = new DateTime();
		if ($from_date < $now){
			$from_date = $now;
		}
		if ($until_date < $now){
			$until_date = $now;
		}

		if ($until_date < $from_date){
			$obj = array('problem' => 'ubf');
			header("HTTP/1.0 400 Bad Request");
	    	print(json_encode($obj));
	    	exit();
		}

		 // Update via ORM

		$update_go = $go->update($from_date, $until_date, $threshold, $notify_phone, $new_phone_id);		
	    
	    if ($update_go == null){
			header("HTTP/1.0 500 Server Error");
			print("Server Error: Error #109");
			exit();
		}
	  
	    // Return JSON encoding of updated Todo
	    header("Content-type: application/json");
	    print($update_go->getJSON());
	    exit();



	} else{
		//create new Go
		//validate values
		//check if empty fields
		if ((!isset($_REQUEST['email'])) || (trim($_REQUEST["email"]) == "")) {
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Email required");
			exit();
		}
		if ((!isset($_REQUEST['depart_from'])) || (trim($_REQUEST["depart_from"]) == "")) {
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Depart from required");
			exit();
		}
		if ((!isset($_REQUEST['arrive_at'])) || (trim($_REQUEST["arrive_at"]) == "")){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Arrive at required");
			exit();
		}
		if ((!isset($_REQUEST['from_date'])) || (trim($_REQUEST["from_date"]) == "")){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: From date required");
			exit();
		}
		if ((!isset($_REQUEST["until_date"])) || (trim($_REQUEST["until_date"]) == "")){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Until date required");
			exit();
		}
		if ((!isset($_REQUEST["threshold"])) || (intval($_REQUEST["threshold"]) == "")){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Threshold required");
			exit();
		}
		if (intval($_REQUEST["notify_phone"]) == 1){
			if ((!isset($_REQUEST["phone"])) || (trim($_REQUEST["phone"]) == "")){
				header("HTTP/1.0 400 Bad Request");
				print("Server Error: Phone number required");
				exit();
			}
		}

		//check if malformated fields
		$email = trim($_REQUEST["email"]);
		//check email REGEX
		if (preg_match("/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/", $email) == 0){
			header("HTTP/1.0 400 Bad Request");
        	print("Server Error: Email format not recognized");
        	exit();
		}

		$depart_from = trim($_REQUEST["depart_from"]);			
		$arrive_at = trim($_REQUEST["arrive_at"]);
		$fdtstr = trim($_REQUEST["from_date"]);
		$udtstr = trim($_REQUEST["until_date"]);
		
		$threshold = intval($_REQUEST["threshold"]);
		if (!($threshold > 0 && $threshold < 10000)){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Threshold out of range");
			exit();
		}
	
		$notify_phone = intval($_REQUEST["notify_phone"]);
		if (!(($notify_phone == 0) || ($notify_phone == 1))){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Notification method not set");
			exit();
		}
	
		$new_phone_id = null;
		if ($notify_phone == 1){
			$phone = trim($_REQUEST["phone"]);
			//REGEX
		/*if(preg_match("/^\d{3}[\-]?\d{3}[\-]?\d{4}$/", $phone) == 0){
				header("HTTP/1.0 400 Bad Request");
        		print("Server Error: Phone number format not recognized");
        		exit();
		}*/
			$phone = preg_replace('/\D+/', '', $phone);

		if(strlen($phone) < 10){
			header("HTTP/1.0 400 Bad Request");
        	print("Server Error: Make sure phone number has area code");
        	exit();
		}
		if(strlen($phone) > 20){
			header("HTTP/1.0 400 Bad Request");
        	print("Server Error: Phone number format not recognized");
        	exit();
		}
			
			$new_phone_id = Phone::getRepeatID($phone);
			if($new_phone_id == null){
				$new_phone = Phone::create($phone);
				if ($new_phone == null){
					header("HTTP/1.0 500 Server Error");
					print("Server Error: Error #100"); //could not make new Phone");
					exit();
				}
				$new_phone_id = $new_phone->id();
			} else if ($new_phone_id == -1){
				header("HTTP/1.0 500 Server Error");
				print("Server Error: Error #101");// Phone database id overload");
				exit();
			}
					
		}

		//create objects to use foreign key's.

		$new_email_id = Email::getRepeatID($email);
		if ($new_email_id == null){
			$new_email = Email::create($email);
			if ($new_email == null){
				header("HTTP/1.0 500 Server Error");
				print("Server Error: Error #102"); //Server could not make new Email");
				exit();
			}
			$new_email_id = $new_email->id();
		} else if ($new_email_id == -1){
			header("HTTP/1.0 500 Server Error");
			print("Server Error: Error #103");// Email database id overload");
			exit();
		}
		
		$new_depart_from = Airport::findByCode($depart_from); //precondition: client-side passes code as perameter 

		if ($new_depart_from == null){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Depart from airport not recognized");// Server could not make new Depart from airport");
			exit();
		}
		$new_depart_from_id = $new_depart_from->id();

		$new_arrive_at = Airport::findByCode($arrive_at);	//precondition: client-side passes code as perameter
		if ($new_arrive_at == null){
			header("HTTP/1.0 400 Bad Request");
			print("Server Error: Arrive at airport not recognized");// Server could not make new Arrive at airport");
			exit();
		}
		$new_arrive_at_id = $new_arrive_at->id();

		try{
			$from_date = new DateTime($fdtstr);
		} catch (Exception $e) {
    		header("HTTP/1.0 400 Server Error");
			print("Server Error: From date format not recognized");
			exit();
		}	

		try{
			$until_date = new DateTime($udtstr);
		} catch (Exception $e) {
    		header("HTTP/1.0 400 Server Error");
			print("Server Error: Until date format not recognized");
			exit();
		}
		$now = new DateTime();
		if ($from_date < $now){
			$from_date = $now;
		}
		if ($until_date < $now){
			$until_date = $now;
		}

		if ($until_date < $from_date){
			$obj = array('problem' => 'ubf');
			header("HTTP/1.0 400 Bad Request");
        	print(json_encode($obj));
        	exit();
		}

		//create Go entry via ORM

		$new_go = Go::create($new_email_id, $new_depart_from_id, $new_arrive_at_id, $from_date, $until_date, $threshold, $notify_phone, $new_phone_id);

		//report if this doesnt work

		if ($new_go == null){
			header("HTTP/1.0 500 Server Error");
			print("Server Error: Error #104");
			exit();
		}

/////REACTIVATE AFTER PREZZZZZ
		/**/
		$mail = $new_go->send_confirmation_email();
		//return JSON representation of new search

		if ($mail != 'mailsent'){
			header("HTTP/1.0 500 Server Error");
			print("Server Error: Error #105 " . $mail);
			exit();
		}
		
		/**/
//////////////

		header("Content-type: application/json");
		print($new_go->getJSON());
		exit();
	}
}

header("HTTP/1.0 500 Bad Request");
print("Server Error: Error #106");

?>



