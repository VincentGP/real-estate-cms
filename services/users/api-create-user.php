<?php
	
	//Get the values passed in the URL
	$sEmail = $_GET['email'];
	$sPassword = $_GET['password'];
	$sRole = $_GET['role'];
	$sFileName = "data-users.txt";
	//Store the contents of the txt database in the variable sajUsers
	$sajUsers = file_get_contents($sFileName);
	//Convert sajUsers to an array of objects
	$ajUsers = json_decode($sajUsers);
	//If ajUsers isn't an array then make an empty array
	if(!is_array($ajUsers)) {
		$ajUsers = [];
	}
	//Make an empty JSON object and store variable in said object
	$jUser = json_decode('{}');
	$jUser->id = uniqid();
	$jUser->email = $sEmail;
	$jUser->password = $sPassword;
	$jUser->role = $sRole;
	//Push the object to the array
	array_push($ajUsers, $jUser);
	//Convert the object to text
	$sajUsers = json_encode($ajUsers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	//Save the data to the file and echo the status
	file_put_contents($sFileName, $sajUsers);
	echo '{"status":"ok"}';

?>