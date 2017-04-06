# Real Esate CMS

A content management system for properties

## Description

With Real Estate CMS, you are able to CREATE property listings, READ every property available present in the database, UPDATE individual properties, and finally, DELETE properties individually.

Other features include a Google Maps overview, notification when new properties are added to the database, and user management.

### Cool Features

**Display the current users email using SESSION**

FRONT-END
```
function fnGetSessionEmail() {
    var sUrl = "services/users/api-display-current-email.php";
    $.getJSON(sUrl, function(jData) {
        var sEmail = '<div id="lblCurrentEmail">You are logged in as {{email}}</div>';
        sEmail = sEmail.replace("{{email}}", jData.email);
        $("#wdwMenu").append(sEmail);
    });
}
```
BACK-END
```
session_start();
echo '{"email":"'.$_SESSION['sEmail'].'"}';
```

**Convert an adress to latitude and longitude coordinate**

```
function fnConvertAddress() {
    var sAddress = $("#txtCreatePropertyAddress").val();
    geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': sAddress }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var iLat = results[0].geometry.location.lat();
            var iLng = results[0].geometry.location.lng();
            $("#txtCreatePropertyLat").val(iLat);
            $("#txtCreatePropertyLng").val(iLng);
        }
    });
}
```
**Send email with table of every property to the user currently logged in**
```
	session_start();
	include '../functions.php';
	$sTo = $_SESSION['sEmail'];
	$sFileName = "data-properties.txt";
	$sajProperties = file_get_contents($sFileName);
	$ajProperties = json_decode($sajProperties);
	$sSubject = 'List of properties for ' . date("d-m-Y");
	$sListOfProperties = "";
	for($i = 0; $i < count($ajProperties); $i++) {
		$sAddress = $ajProperties[$i]->address;
		$sPrice = $ajProperties[$i]->price;
		$sTdTemplate = '<tr><td>'. $sAddress .'</td><td>'. $sPrice .'</td></tr>';
		$sListOfProperties .= $sTdTemplate;
	}
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
				      '. $sListOfProperties .'
				  </table>
				</body>
				</html>
	';
	$headers  = 'MIME-Version: 1.0' . "\r\n";
	$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
	$headers .= 'From: Real Estate CMS <real-esate-cms@mail.com>' . "\r\n";
	$bEmailWasSent = mail($sTo, $sSubject, $sMessage, $headers);
	if($bEmailWasSent) {
		echo '{"status":"ok"}';
		exit;
	}
	echo '{"status":"error"}';
```

## Built With

* [jQuery](https://jquery.com)
* [Parsley](http://parsleyjs.org) Front-end Javascript validation library
* [Google Maps API](https://developers.google.com/maps/)
* [Sweet Alert](http://t4t5.github.io/sweetalert/) Alerts
* [Cleave.js](https://nosir.github.io/cleave.js/) Formatting of inputs

## Authors

* **Vincent Gercke Pedersen**

