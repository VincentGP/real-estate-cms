<?php
	
	//Include functions
	include '../functions.php';
	//Get the values passed in the URL
	$sFileName = "data-properties.txt";
	$sAddress = $_GET['address'];
	$sPrice = $_GET['price'];
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
	//Boolean value that can be either true or false
	$bPrice = fnIsPriceValid($sPrice, 0, 18446744073709551615);
	$bDuplicateAddress = fnCheckForDuplicate($sFileName, $sAddress, 'address');
	//If the price and address is valid push all the data to the database
	if($bPrice && $bDuplicateAddress && $sAddress == !null) {
		$jProperty = json_decode('{}');
		$jProperty->id = uniqid();
		$jProperty->address = $sAddress;
		$jProperty->price = $sPrice;
		$jProperty->lat = $iLat;
		$jProperty->lng = $iLng;
		//Push the object to the array
		array_push($ajProperties, $jProperty);
		//Convert the object to text
		$sajProperties = json_encode($ajProperties, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
		//Save the data to the file and echo the status
		file_put_contents($sFileName, $sajProperties);
		echo '{"status":"ok"}';
		exit;
	}
	//If the boolean is false echo an error
	echo '{"status":"error"}';

?>