<?php

	//Variable which refers to the database file
	$sFileName = "data-properties.txt";
	//Store the contents of the txt database in the variable sajProperties
	$sajProperties = file_get_contents($sFileName);
	//Convert sajProperties to an array of objects
	$ajProperties = json_decode($sajProperties);
	//If ajProperties is not an array, display an error and exit
	if(!is_array($ajProperties)) {
		echo '{"status":"error"}';
		exit;
	}
	//Convert the properties to a string and echo the properties
	$sajProperties = json_encode($ajProperties, JSON_UNESCAPED_UNICODE);
	echo $sajProperties;
	
?>