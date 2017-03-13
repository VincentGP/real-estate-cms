<?php

	//Use $_GET to retrieve and store email and password being passed
	$sEmail = $_GET['email'];
	$sPassword = $_GET['password'];
	$sFileName = "data-users.txt";
	//Get the contents of the txt database and store them in the variable sajUsers
	$sajUsers = file_get_contents($sFileName);
	//Decodes sajUsers and store it in ajUsers. Now we have an array of JSON objects
	$ajUsers = json_decode($sajUsers);
	//If ajUsers is not an array, make an empty array
	if(!is_array($ajUsers)) {
		$ajUsers = [];
	}
	//If the email and password is empty, display an error
	if($sEmail == null && $sPassword == null) {
		echo '{"status":"error"}';
		exit;
	} else {
	//Store empty JSON object in jUser
	$jUser = json_decode('{}');
	//Add unique id to jUser based on length of ajUsers
	$jUser->id = count($ajUsers)+1;
	//Asign a role to the user
	$jUser->role = "user";
	//Add email to jUser
	$jUser->email = $sEmail;
	//Add password to jUser
	$jUser->password = $sPassword;
	//Push jUser to the array
	array_push($ajUsers, $jUser);
	//Encode object to text, make the JSON nice to look at and allow special characters
	$sajUsers = json_encode($ajUsers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	//Save data to the file
	file_put_contents($sFileName, $sajUsers);
	echo '{"status":"ok"}';
}

?>