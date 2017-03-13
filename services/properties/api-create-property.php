<?php

	//Get the values passed in the URL
	$sFileName = "data-properties.txt";
	$sAddress = $_GET['address'];
	$iPrice = $_GET['price'];
	$iLat = $_GET['lat'];
	$iLng = $_GET['lng'];
	//Store the contents of the txt database in the variable sajProperties
	$sajProperties = file_get_contents($sFileName);
	//Convert sajProperties to an array of objects
	$ajProperties = json_decode($sajProperties);
	//If ajProperties isn't an array then make an empty array
	if(!is_array($ajProperties)) {
		$ajProperties = [];
	}
	//If there's no values passed then shown an error
	if($sAddress == null || $iPrice == null) {
		echo '{"status":"error"}';
		exit;
	}
	//Make an empty JSON object and store variable in said object
	$jProperty = json_decode('{}');
	$jProperty->id = uniqid();
	$jProperty->address = $sAddress;
	$jProperty->price = $iPrice;
	$jProperty->lat = $iLat;
	$jProperty->lng = $iLng;
	//Push the object to the array
	array_push($ajProperties, $jProperty);
	//Convert the object to text
	$sajProperties = json_encode($ajProperties, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	//Save the data to the file and echo the status
	file_put_contents($sFileName, $sajProperties);
	echo '{"status":"ok"}';

?>