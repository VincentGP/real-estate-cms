# Real Esate CMS

A content management system for properties

## Description

With Real Estate CMS, you are able to CREATE property listings, READ every property available present in the database, UPDATE individual properties, and finally, DELETE properties individually.

Other features include a Google Maps overview, notification when new properties are added to the database, and user management.

### Cool Features

**Display the current users email using SESSION**

```
//FRONT-END

//Fetches the email from the current session
function fnGetSessionEmail() {
    //The service used for fetching the email
    var sUrl = "services/users/api-display-current-email.php";
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
        //Blueprint used for displaying the email
        var sEmail = '<div id="lblCurrentEmail">You are logged in as {{email}}</div>';
        //Replace the placeholder with the real email
        sEmail = sEmail.replace("{{email}}", jData.email);
        //Append sEmailTemplate to the main menu
        $("#wdwMenu").append(sEmail);
    });
}

BACK-END

	
	//Fetches the email stored in the SESSION
	session_start();
	echo '{"email":"'.$_SESSION['sEmail'].'"}';

```

And repeat

```
until finished
```

## Built With

* [jQuery](https://jquery.com)
* [Parsley](http://parsleyjs.org) Front-end Javascript validation library
* [Google Maps API](https://developers.google.com/maps/)
* [Sweet Alert](http://t4t5.github.io/sweetalert/) Alerts
* [Cleave.js](https://nosir.github.io/cleave.js/) Formatting of inputs

## Authors

* **Vincent Gercke Pedersen**

