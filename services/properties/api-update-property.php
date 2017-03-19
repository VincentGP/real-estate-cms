<?php

	//Include functions
	include '../functions.php';
	//Get id, address and price, and store them
	$sId = $_GET['id'];
	$sAddress = $_GET['address'];
	$iPrice = $_GET['price'];
	$iLat = $_GET['lat'];
	$iLng = $_GET['lng'];
	$sFileName = "data-properties.txt";
	//Get the content from txt file
	$sajProperties = file_get_contents($sFileName);
	//Convert to array of JSON objects
	$ajProperties = json_decode($sajProperties);
	//If ajProperties isn't an array, then create an empty array
	if(!is_array($ajProperties)) {
		$ajProperties = [];
	}
	//Boolean value that can be either true or false
	$bPrice = fnIsPriceValid($iPrice, 0, 18446744073709551615);
	//Loop through the properties
	for($i = 0; $i < count($ajProperties); $i++) {
		//If the id matches and the price is valid
		if($sAddress == $ajProperties[$i]->address && $bPrice) {
			//If the id matches, update the keys
			$ajProperties[$i]->address = $sAddress;
			$ajProperties[$i]->price = $iPrice;
			$ajProperties[$i]->lat = $iLat;
			$ajProperties[$i]->lng = $iLng;
			//Convert the object to text
			$sajProperties = json_encode($ajProperties, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
			//Save the data to the file and echo status
			file_put_contents($sFileName, $sajProperties);
			echo '{"status":"ok"}';
			exit;
		}
	}
	echo '{"status":"error"}';

?>