<?php
	
	//Get id and access txt database
	$sId = $_GET['id'];
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
		if($sId == $ajProperties[$i]->id) {
			//Deletes the property if the id matches
			array_splice($ajProperties, $i, 1);
			echo '{"status":"ok"}';
			break;
		}
	}
	//Convert the object to text
	$sajProperties = json_encode($ajProperties, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	//Save the data to the file
	file_put_contents($sFileName, $sajProperties);

?>