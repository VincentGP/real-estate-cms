<?php
	
	//Variable which refers to the database file
	$sFileName = "data-users.txt";
	//Store the contents of the database in sajUsers
	$sajUsers = file_get_contents($sFileName);
	//Convert sajUsers to an array of objects
	$ajUsers = json_decode($sajUsers);
	//If ajUsers isn't an array, then create an empty array
	if(!is_array($ajUsers)) {
		$ajUsers = [];
	}
	//Loop through all the users in the database
	for($i = 0; $i < count($ajUsers); $i++) {
		//Check if any of the objects are super-admins
		if($ajUsers[$i]->role == "super-admin") {
			//If a match is found then echo the following
			echo '{"status":"ok"}';
			exit;
		}
	}
	//If no match is found, then echo an error message
	echo '{"status":"error"}';

?>