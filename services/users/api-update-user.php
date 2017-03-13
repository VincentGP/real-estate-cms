<?php
	
	//Get id, address and price, and store them
	$sId = $_GET['id'];
	$sEmail = $_GET['email'];
	$sPassword = $_GET['password'];
	$sRole = $_GET['role'];
	$sFileName = "data-users.txt";
	//Get the content from txt file
	$sajUsers = file_get_contents($sFileName);
	//Convert to array of JSON objects
	$ajUsers = json_decode($sajUsers);
	//If ajUsers isn't an array, then create an empty array
	if(!is_array($ajUsers)) {
		$ajUsers = [];
	}
	//Loop through the users
	for($i = 0; $i < count($ajUsers); $i++) {
		//Check if the id matches
		if($sId ==  $ajUsers[$i]->id){
			//If the id matches, update the following:
			$ajUsers[$i]->email = $sEmail;
			$ajUsers[$i]->password = $sPassword;
			$ajUsers[$i]->role = $sRole;
			break;
		}
	}
	//Convert the object to text
	$sajUsers = json_encode($ajUsers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	//Save the data to the file and echo status
	file_put_contents($sFileName, $sajUsers);
	echo '{"status":"ok"}';

?>