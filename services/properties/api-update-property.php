<?php
	
	//Get id, address and price, and store them
	$sId = $_GET['id'];
	$sAddress = $_GET['address'];
	$iPrice = $_GET['price'];
	$sFileName = "data-properties.txt";
	//Get the content from txt file
	$sajProperties = file_get_contents($sFileName);
	//Convert to array of JSON objects
	$ajProperties = json_decode($sajProperties);
	//If ajProperties isn't an array, then create an empty array
	if(!is_array($ajProperties)) {
		$ajProperties = [];
	}
	//Loop through the properties
	for($i = 0; $i < count($ajProperties); $i++) {
		//Check if the id matches
		if($sId ==  $ajProperties[$i]->id){
			//If the id matches, update the addres and price
			$ajProperties[$i]->address = $sAddress;
			$ajProperties[$i]->price = $iPrice;
			echo '{"status":"ok"}';
			break;
		}
	}
	//Convert the object to text
	$sajProperties = json_encode($ajProperties, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
	//Save the data to the file and echo status
	file_put_contents($sFileName, $sajProperties);

?>