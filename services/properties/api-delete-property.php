<?php
	
	//Include the functions file
	include '../functions.php';
	//Variable which refers to the database file
	$sFileName = "data-properties.txt";
	//GET the address passed via the URL
	$sAddress = $_GET['address'];
	//Store the contents of the txt database in the variable sajProperties
	$sajProperties = file_get_contents($sFileName);
	//Convert sajProperties to array of JSON objects
	$ajProperties = json_decode($sajProperties);
	//If ajProperties is not an array echo an error and exit
	if(!is_array($ajProperties)) {
		echo '{"status":"error"}';
		exit;
	}
	//Loop through the entire length of ajProperties
	for($i = 0; $i < count($ajProperties); $i++) {
		//Checks if the Address matches
		if($sAddress == $ajProperties[$i]->address) {
			//Declare the path to the images
			$sDirectoryPath = 'images/' . $ajProperties[$i]->id;
			//Delete the folder containing the images
			fnDeletePropertyDirectory($sDirectoryPath);
			//Remove the property from the database
			array_splice($ajProperties, $i, 1);
			//Convert the object to text
			$sajProperties = json_encode($ajProperties, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
			//Save the data to the file
			file_put_contents($sFileName, $sajProperties);
			//Echo a succesful status message
			echo '{"status":"ok"}';
			exit;
		}
	}
	//If no match is found, then echo an error message
	echo '{"status":"error"}';

?>