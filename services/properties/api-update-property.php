<?php

	//Include the functions file
	include '../functions.php';
	//Variable which refers to the database file
	$sFileName = "data-properties.txt";
	//Variables with values passed from the form
	$sId = $_POST['id'];
	$sAddress = $_POST['address'];
	$sPrice = $_POST['price'];
	$iLat = $_POST['lat'];
	$iLng = $_POST['lng'];
	//Store the contents of the txt database in the variable sajProperties
	$sajProperties = file_get_contents($sFileName);
	//Convert sajProperties to an array of objects
	$ajProperties = json_decode($sajProperties);
	//If ajProperties isn't an array, then create an empty array
	if(!is_array($ajProperties)) {
		$ajProperties = [];
	}
	//Boolean value that can be either true or false
	$bPrice = fnIsPriceValid($sPrice, 0, 18446744073709551615);
	//Loop through the properties
	for($i = 0; $i < count($ajProperties); $i++) {
		//If the id matches, the price is valid and the address isn't empty
		if($sId == $ajProperties[$i]->id && $bPrice && $sAddress == !null) {
			//Update the property
			$ajProperties[$i]->address = $sAddress;
			$ajProperties[$i]->price = $sPrice;
			$ajProperties[$i]->lat = $iLat;
			$ajProperties[$i]->lng = $iLng;
			$ajProperties[$i]->dateUpdated = date('d-m-Y');
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