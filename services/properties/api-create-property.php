<?php
	
	//Include the functions file
	include '../functions.php';
	//Variable which refers to the database file
	$sFileName = "data-properties.txt";
	//Unique ID created based on the uniqid function
	$sId = uniqid();
	//Variables with values passed from the form
	$sAddress = $_POST['address'];
	$sPrice = $_POST['price'];
	$iLat = $_POST['lat'];
	$iLng = $_POST['lng'];
	//Timestamp of the date the property was added
	$sDateCreated = date('d-m-Y');
	//Store the contents of the txt database in the variable sajProperties
	$sajProperties = file_get_contents($sFileName);
	//Convert sajProperties to an array of objects
	$ajProperties = json_decode($sajProperties);
	//If ajProperties isn't an array then replace it with an empty array
	if(!is_array($ajProperties)) {
		$ajProperties = [];
	}
	//Checks whether or not the price is valid based on three parameters
	$bPrice = fnIsPriceValid($sPrice, 0, 18446744073709551615);
	//Checks if the address already is in the database
	$bDuplicateAddress = fnCheckForDuplicate($sFileName, $sAddress, 'address');
	//Counts the amount of files uploaded
	$iFileCounter = count($_FILES);
	//If the boolean values are true and the iFileCounter is 3 or more push the data to the database
	if($bPrice && $bDuplicateAddress && $sAddress == !null && $iFileCounter >= 3) {
		//Create a directory for the images, if it doesn't exist already
		if (!is_dir($sId)) {
	    mkdir('images/' . $sId);
		}
		//Declare the JSON object jProperty
		$jProperty = json_decode('{}');
		//Populate the JSON object
		$jProperty->id = $sId;
		$jProperty->address = $sAddress;
		$jProperty->price = $sPrice;
		$jProperty->lat = $iLat;
		$jProperty->lng = $iLng;
		$jProperty->dateCreated = $sDateCreated;
		//Loop through all the files received from POST
		for($i = 0; $i < count($_FILES); $i++) {
		//Split the string, to grab the file extension
		$sFileExtension = explode(".", $_FILES['file-'.$i]["name"]);
		//Create filename for the image
		$sFilename = 'image-' . $i . '.' . end($sFileExtension);
		//Store information about the files in variable
		$sFileparts = pathinfo($sFilename);
		//If the image has the extension jpg, png, jpeg or JPEG allow the file to be stored in the database
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
	//If the if statement isn't true echo an error message
	echo '{"status":"error"}';

?>