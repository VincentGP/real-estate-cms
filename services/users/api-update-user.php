<?php
	
	//Include the functions file
	include '../functions.php';
	//Variable which refers to the database file
	$sFileName = "data-users.txt";
	//Grab information about users via POST and store in variables
	$sId = $_POST['id'];
	$sEmail = $_POST['email'];
	$sPassword = $_POST['password'];
	$sRole = $_POST['role'];
	//Store the contents of the database in the variable sajUsers
	$sajUsers = file_get_contents($sFileName);
	//Convert to array of objects
	$ajUsers = json_decode($sajUsers);
	//If ajUsers isn't an array, then create an empty array
	if(!is_array($ajUsers)) {
		$ajUsers = [];
	}
	//Boolean values that can be either true or false
	$bIsEmailValid = fnIsEmailValid($sEmail);
	$bIsPasswordValid = fnIsPasswordValid($sPassword);
	//Loop through the users
	for($i = 0; $i < count($ajUsers); $i++) {
		//Check if the id matches
		if($sId ==  $ajUsers[$i]->id && $bIsEmailValid && $bIsPasswordValid) {
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
	//If the boolean is false echo an error status
	echo '{"status":"error"}';

?>