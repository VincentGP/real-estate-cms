<?php
	
	include '../functions.php';
	//Get id and access txt database
	$sAddress = $_GET['address'];
	$sFileName = "data-properties.txt";
	$sajProperties = file_get_contents($sFileName);
	//Convert sajProperties to array of JSON objects
	$ajProperties = json_decode($sajProperties);
	//If it's not an array echo error and exit
	if(!is_array($ajProperties)) {
		echo '{"status":"error"}';
		exit;
	}
	//Loop that runs through ajProperties
	for($i = 0; $i < count($ajProperties); $i++) {
		//Checks if the ID matches
		if($sAddress == $ajProperties[$i]->address) {
			$sDirectoryPath = 'images/' . $ajProperties[$i]->id;
			fnDeleteProperty($sDirectoryPath);
			//Deletes the property if the id matches
			array_splice($ajProperties, $i, 1);
			echo '{"status":"ok"}';
			//Convert the object to text
			$sajProperties = json_encode($ajProperties, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
			//Save the data to the file
			file_put_contents($sFileName, $sajProperties);
			exit;
		}
	}
	echo '{"status":"error"}';

?>