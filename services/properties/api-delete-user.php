<?php
	//Get id and txt database
	$id = $_GET['id'];
	$sFileName = "data-users.txt";
	$sajUsers = file_get_contents($sFileName);
	//Convert sajUsers to an array of JSON objects
	$ajUsers = json_decode($sajUsers);
	//If it's not an array echo error and exit
	if(!is_array($ajUsers)) {
		echo '{"status":"error"}';
		exit;
	}
	//Loop that runs through ajUsers
	for($i = 0; $i < count($ajUsers); $i++) {
		//Checks if the ID matches
		if($id == $ajUsers[$i]->id) {
			//Deletes the user if the id matches
			array_splice($ajUsers, $i, 1);
			break;
		}
	}
	//Convert the object to text
	$sajUsers = json_encode($ajUsers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	//Save the data to the file
	file_put_contents($sFileName, $sajUsers);
	echo '{"status":"ok"}';
?>