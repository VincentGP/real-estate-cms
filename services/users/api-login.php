<?php
	//Use $_GET to retrieve and store email and password being passed
	$sEmail = $_GET['email'];
	$sPassword = $_GET['password'];
	$sFileName = "data-users.txt";
	//Store the contents of the file in sajUsers
	$sajUsers = file_get_contents($sFileName);
	//Decodes sajUsers and store it in ajUsers
	$ajUsers = json_decode($sajUsers);
	//Loop through ajUsers
	foreach ($ajUsers as $jUser) {
		//If the information matches set loginAuthenticator to true
		if ($sEmail == $jUser->email && $sPassword == $jUser->password) {
			$loginAuthenticator = true;
			$currentRole = $jUser->role;
		}
	}
	//Echo different echos based on whether loginAuthenticator is true/false
	if ($loginAuthenticator == true) {
			echo '{"status":"ok","role":"'.$currentRole.'"}';
		} else {
			echo '{"status":"error"}';
		}
?>