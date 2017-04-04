<?php
	
	//Variable which refers to the database file
	$sFileName = "data-users.txt";
	//GET the ID passed through the URL
	$id = $_GET['id'];
	//Store the contents of the database in the variable sajUsers
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
		//If the ID matches
		if($id == $ajUsers[$i]->id) {
			//Deletes the user from the database
			array_splice($ajUsers, $i, 1);
			//Convert the object to text
			$sajUsers = json_encode($ajUsers, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
			//Save the data to the file
			file_put_contents($sFileName, $sajUsers);
			echo '{"status":"ok"}';
			exit;
		}
	}
	//If no match is found, then echo an error message
	echo '{"status":"error"}';

?>