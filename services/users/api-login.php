<?php
	
	//Initiate session
	session_start();
	//Variable which refers to the database file
	$sFileName = "data-users.txt";
	//Use $_GET to retrieve and store email and password being passed
	$sEmail = $_GET['email'];
	$sPassword = $_GET['password'];
	//Store the contents of the file in sajUsers
	$sajUsers = file_get_contents($sFileName);
	//Convert sajUsers to an array of objects
	$ajUsers = json_decode($sajUsers);
	//Loop through ajUsers
	foreach ($ajUsers as $jUser) {
		//If a match is found in the database
		if ($sEmail == $jUser->email && $sPassword == $jUser->password) {
			//Save the current users role in a variable
			$sCurrentRole = $jUser->role;
			//Store the email in a SESSION
			$_SESSION['sEmail'] = $sEmail;
			//Echo status message and the current role
			echo '{"status":"ok","role":"'.$sCurrentRole.'"}';
			exit;
		}
	}
	//Echo error status message
	echo '{"status":"error"}';

?>