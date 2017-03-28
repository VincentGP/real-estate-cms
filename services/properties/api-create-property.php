<?php
	
	//Include functions
	include '../functions.php';
	//Get the values passed in the URL
	$sFileName = "data-properties.txt";
	//The id is created based on mictrotime, could also be based on uniqueid()
	$sId = round(microtime(true));
	$sAddress = $_POST['address'];
	$sPrice = $_POST['price'];
	$iLat = $_POST['lat'];
	$iLng = $_POST['lng'];
	//Variable used to validate image uploads
	$iCounter = 0;
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
	$sFileCounter = count($_FILES);
	//If the price and address is valid push all the data to the database
	if($bPrice && $bDuplicateAddress && $sAddress == !null && $sFileCounter >= 3) {
		//Create a directory for the images, if it doesn't exist already
		if (!is_dir($sId)) {
	    mkdir('images/' . $sId);
		}
		$jProperty = json_decode('{}');
		$jProperty->id = $sId;
		$jProperty->address = $sAddress;
		$jProperty->price = $sPrice;
		$jProperty->lat = $iLat;
		$jProperty->lng = $iLng;
		//Loop through all the files received from POST
		for($i = 0; $i < count($_FILES); $i++) {
		//Split the string, to grab the file extension
		$sFileExtension = explode(".", $_FILES['file-'.$i]["name"]);
		//Create filename for the image
		$sFilename = 'image-' . $i . '.' . end($sFileExtension);
		//Store information about the files in variable
		$sFileparts = pathinfo($sFilename);
		//If the image has the extension jpg or png allow the file to be stored in the database
		switch($sFileparts['extension'])
		{
		    case "jpg":
		    case "png":
		    case "jpeg":
		    case "JPEG":
		    //Move the files to the right path (the folder previously created)
			move_uploaded_file( $_FILES['file-'.$i]['tmp_name'] , 'images/' . $sId . '/' . $sFilename );
		    $jProperty->images[] = $sFilename;
		    //If a file has no extension, break out of the switch statement
		    case "":
		    case NULL:
		    break;
		}
	}
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