<?php
	
	//Include functions
	include '../functions.php';
	//Get id, address and price, and store them
	$sFileName = "data-users.txt";
	$sId = $_POST['id'];
	$sEmail = $_POST['email'];
	$sPassword = $_POST['password'];
	$sRole = $_POST['role'];
	//Get the content from txt file
	$sajUsers = file_get_contents($sFileName);
	//Convert to array of JSON objects
	$ajUsers = json_decode($sajUsers);
	//If ajUsers isn't an array, then create an empty array
	if(!is_array($ajUsers)) {
		$ajUsers = [];
	}
	//Boolean value that can be either true or false
	$bIsEmailValid = fnIsEmailValid($sEmail);
	$bIsPasswordValid = fnIsPasswordValid($sPassword);
	//Loop through the users
	for($i = 0; $i < count($ajUsers); $i++) {
		//Check if the id matches
		if($sId ==  $ajUsers[$i]->id && $bIsEmailValid && $bIsPasswordValid){
			//If the id matches, update the following:
			$ajUsers[$i]->email = $sEmail;
			$ajUsers[$i]->password = $sPassword;
			$ajUsers[$i]->role = $sRole;
			//Convert the object to text
			$sajUsers = json_encode($ajUsers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
			//Save the data to the file and echo status
			file_put_contents($sFileName, $sajUsers);
			echo '{"status":"ok"}';
			exit;
		}
	}
	echo '{"status":"error"}';

?>