<?php
	//Start looking for sessions
	session_start();
	$sFileName = "data-properties.txt";
	//Get the properties from txt file and store in variable
	$sajProperties = file_get_contents($sFileName);
	//Convert sajProperties to an array of objects
	$ajProperties = json_decode($sajProperties);
	//If ajProperties is not an array, display an error and exit
	if(!is_array($ajProperties)) {
		echo '{"status":"error"}';
		exit;
	}
	//Convert the properties to a string and echo
	$sajProperties = json_encode($ajProperties, JSON_UNESCAPED_UNICODE);
	echo $sajProperties;
	
?>