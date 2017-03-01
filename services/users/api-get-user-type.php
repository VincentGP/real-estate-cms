<?php
	
	$sSuperAdmin = "super-admin";
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
		//Check if any of the objects are super-admins
		if($ajUsers[$i]->role == "super-admin") {
			//If a match is found then echo the following
			echo '{"status":"ok"}';
			exit;
		}
	}
	//Otherwise echo error status
	echo '{"status":"error"}';

?>