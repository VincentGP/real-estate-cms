<?php
	
	//Variable which refers to the database file
	$sFileName = "data-users.txt";
	//Store the contents of the database in sajUsers
	$sajUsers = file_get_contents($sFileName);
	//Convert sajUsers to an array of objects
	$ajUsers = json_decode($sajUsers);
	//If ajUsers is not an array, echo an error and exit
	if(!is_array($ajUsers)) {
		echo '{"status":"error"}';
		exit;
	}
	//Convert the users to a string and echo result
	$sajUsers = json_encode($ajUsers, JSON_UNESCAPED_UNICODE);
	echo $sajUsers;
	
?>