<?php
	
	//Include the functions file
	include '../functions.php';
	//Variable which refers to the database file
	$sFileName = "data-users.txt";
	//Grab the variables passed via POST
	$sEmail = $_POST['email'];
	$sPassword = $_POST['password'];
	$sRole = $_POST['role'];
	//Store the contents of the database in the variable sajUsers
	$sajUsers = file_get_contents($sFileName);
	//Convert sajUsers to an array of objects
	$ajUsers = json_decode($sajUsers);
	//If ajUsers isn't an array then make an empty array
	if(!is_array($ajUsers)) {
		$ajUsers = [];
	}
	//Boolean value that can be either true or false
	$bIsEmailValid = fnIsEmailValid($sEmail);
	$bIsPasswordValid = fnIsPasswordValid($sPassword);
	$bDuplicateEmail = fnCheckForDuplicate($sFileName, $sEmail, 'email');
	//If the boolean values are true then push the data to the database
	if($bDuplicateEmail && $bIsEmailValid && $bIsPasswordValid) {
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
		exit;
	}
	//If the boolean is false echo an error
	echo '{"status":"error"}';

?>