<?php

	session_start();
	//Include the functions file
	include '../functions.php';
	//Use the email stored in the SESSION
	$sTo = $_SESSION['sEmail'];
	//Variable which refers to the database file
	$sFileName = "data-properties.txt";
	//Store the contents of the txt database in the variable sajProperties
	$sajProperties = file_get_contents($sFileName);
	//Convert sajProperties to an array of objects
	$ajProperties = json_decode($sajProperties);
	//The subject of the mail
	$sSubject = 'List of properties for ' . date("d-m-Y");
	//Loop through the ajProperties
	for($i = 0; $i < count($ajProperties); $i++) {
		//Store the address and price in variables
		$sAddress = $ajProperties[$i]->address;
		$sPrice = $ajProperties[$i]->price;
		//Create template for displaying the address and price in a table
		$sTdTemplate = '<tr><td>'. $sAddress .'</td><td>'. $sPrice .'</td></tr>';
	}
	//The message/body of the email we want to send
	$sMessage = '
				<html>
				<head>
				  <title>'. $sSubject .'</title>
				</head>
				<body>
				  <table>
				    <tr>
				      <th>Address</th><th>Price</th>
				    </tr>
				    <tr>
				      '. $sTdTemplate .'
				    </tr>
				  </table>
				</body>
				</html>
	';
	//When sending HTML email the headers must be set to the following
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
	//Additional from header
	$headers .= 'From: Real Estate CMS <real-esate-cms@mail.com>' . "\r\n";
	//Finally, send the mail and echo a status message
	$bEmailWasSent = mail($sTo, $sSubject, $sMessage, $headers);
	//sEmailWasSent is true, the email has been sent and echo an ok message
	if($bEmailWasSent) {
		echo '{"status":"ok"}';
		exit;
	}
	echo '{"status":"error"}';
?>