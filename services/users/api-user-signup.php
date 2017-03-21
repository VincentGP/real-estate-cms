<?php
	
	//Include functions
	include '../functions.php';
	//Use $_GET to retrieve and store email and password being passed
	$sFileName = "data-users.txt";
	$sEmail = $_GET['email'];
	$sPassword = $_GET['password'];
	//Get the contents of the txt database and store them in the variable sajUsers
	$sajUsers = file_get_contents($sFileName);
	//Decodes sajUsers and store it in ajUsers. Now we have an array of JSON objects
	$ajUsers = json_decode($sajUsers);
	//If ajUsers is not an array, make an empty array
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
		$jUser->role = "user";
		//Push jUser to the array
		array_push($ajUsers, $jUser);
		//Encode object to text, make the JSON nice to look at and allow special characters
		$sajUsers = json_encode($ajUsers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		//Save data to the file
		file_put_contents($sFileName, $sajUsers);
		echo '{"status":"ok"}';
		exit;
	}
	//If the boolean is false echo an error
	echo '{"status":"error"}';

?>