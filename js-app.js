


//Function that determines if the is a super-admin user on page load
$(document).ready(function() {
    var sUrl = "services/users/api-get-user-type.php";
    //Initiate Ajax and pass the data to the server
    $.getJSON(sUrl, function(jData) {
        //If the status is ok then show the login window
        if (jData.status == "ok") {
            $("#wdw-login").show();
          //Else make the user sign up as super-admin
        } else if (jData.status == "error") {
            $(".wdw").hide();
            $("#wdw-super-admin-signup").css("display", "flex");
        }
    });
    //Run the function fnSuperAdminSignup when the button is pressed
    $("#btnSuperAdminSignup").click(function() {
        fnSuperAdminSignup();
    });
});

//When the DOM is loaded and you click on a element with the link class
$(document).on("click", ".link", function() {
    //Hide all windows
    $(".wdw").hide();
    //Store the attribute from the window you just clicked in a variable
    var sWindowToShow = $(this).attr("data-go-to");
    //Show the window you just clicked on
    $("#" + sWindowToShow).css("display", "flex");

    //Get the property id, address and price you clicked on and store them
    var sPropertyIdToEdit = $(this).siblings(".lbl-property-id").text();
    var sPropertyAddressToEdit = $(this).siblings(".lbl-property-address").text();
    var sPropertyPriceToEdit = $(this).siblings(".lbl-property-price").text();
    var sPropertyLatToEdit = $(this).siblings(".lbl-property-lat").text();
    var sPropertyLngToEdit = $(this).siblings(".lbl-property-lng").text();
    //Select the element and extract the value
    $("#txt-create-property-id").val(sPropertyIdToEdit);
    $("#txt-create-property-address").val(sPropertyAddressToEdit);
    $("#txt-create-property-price").val(sPropertyPriceToEdit);
    $("#txt-create-property-lat").val(sPropertyLatToEdit);
    $("#txt-create-property-lng").val(sPropertyLngToEdit);

    //Get the user id, email, password and role you clicked on and store them
    var sUserIdToEdit = $(this).siblings(".lbl-user-id").text();
    var sUserEmailToEdit = $(this).siblings(".lbl-user-email").text();
    var sUserPasswordToEdit = $(this).siblings(".lbl-user-password").text();
    var sUserRoleToEdit = $(this).siblings(".lbl-user-role").text();
    //Select the element and extract the value
    $("#txt-create-user-id").val(sUserIdToEdit);
    $("#txt-create-user-email").val(sUserEmailToEdit);
    $("#txt-create-user-password").val(sUserPasswordToEdit);
    $("#txt-create-user-role").val(sUserRoleToEdit);
});

//When the DOM is loaded and you click on a element with the btn-delete-property class
$(document).on("click", ".btn-delete-property", function() {
    //Store the id and object you want to delete
    var sIdToDelete = $(this).siblings(".lbl-property-id").text();
    var oTheParent = $(this).parent();
    //The service you use to delete the property from the database
    var sUrl = "services/properties/api-delete-property.php?id="+sIdToDelete;
    //Alert the user that the action will delete a property
    swal({
            title: "Are you sure?",
            text: "You will not be able to recover this property!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
        function() {
            //Initiate Ajax
            $.getJSON(sUrl, function(jData) {
                //If the status is ok then remove the object
                if (jData.status == "ok") {
                    oTheParent.remove();
                }
            });
            //Display success message
            swal("Deleted!", "The property has been deleted.", "success");
        });
});

//When the DOM is loaded and you click on a element with the btn-delete-property class
$(document).on("click", ".btn-delete-user", function() {
    //Store the id and object you want to delete
    var sIdToDelete = $(this).siblings(".lbl-user-id").text();
    var oTheParent = $(this).parent();
    //The service you use to delete the user from the database
    var sUrl = "services/users/api-delete-user.php?id="+sIdToDelete;
    //Alert the user that the action will delete a user
    swal({
            title: "Are you sure?",
            text: "You will not be able to recover this user!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, delete it!",
            closeOnConfirm: false
        },
        function() {
            //Initiate Ajax
            $.getJSON(sUrl, function(jData) {
            	//If the status is ok then remove the object
                if (jData.status == "ok") {
                    oTheParent.remove();
                }
            });
            swal("Deleted!", "The user has been deleted.", "success");
        });
});


//When the DOM is loaded you are able to get properties
$(document).on("click", "[data-go-to='wdw-properties']", function() {
    fnGetProperties();
});

//When the DOM is loaded you are able to get users
$(document).on("click", "[data-go-to='wdw-properties-user']", function() {
    fnGetPropertiesUserRole();
});

//When the DOM is loaded you are able to get users
$(document).on("click", "[data-go-to='wdw-users']", function() {
    fnGetUsers();
});

//Empty login text fields when the user logs out
$(document).on("click", "#btn-log-out", function() {
    $("#txtLoginEmail").val('');
    $("#txtLoginPassword").val('');
    fnLogout();
});

//Empty login text fields
$(document).on("click", "[data-go-to='wdw-user-signup']", function() {
    $("#txtLoginEmail").val('');
    $("#txtLoginPassword").val('');
});

$(document).on("click", "[data-go-to='wdw-map']", function() {
    fnGetPropertiesMap();
});

$(document).on("click", "#btnLogin", function() {
    fnLogin();
});


/************************************************************************/
/************************************************************************/
/************************************************************************/

//Call function on click
$("#btnUserSignup").click(function(){
	fnUserSignup();
});

//Call function on click
$("#btn-save-property").click(function(){
	fnSaveProperty();
});

//Call function on click
$("#btn-save-user").click(function(){
	fnSaveUser();
});

/************************************************************************/
/************************************************************************/
/************************************************************************/


function fnLogin() {
    //Get the values passed through the URL
    var sEmail = $("#txtLoginEmail").val();
    var sPassword = $("#txtLoginPassword").val();
    var sUrl = "services/users/api-login.php?email="+sEmail+"&password="+sPassword;
    //Initiate Ajax
    $.get(sUrl, function(sData) {
        //Convert sData to a JSON object
        var jData = JSON.parse(sData);
        //If a match was found and the role is super-admin then show super-admin menu
        if (jData.status == "ok" && jData.role == "super-admin") {
            fnGetSuperAdminMenu();
            swal({
                title: "Success!",
                text: "Thank you for signing " + jData.role + "!",
                timer: 1000,
                type: "success",
                showConfirmButton: false
            });

            setTimeout(function() {
                $(".wdw").hide();
                $("#wdw-menu").css("display", "flex");
            }, 1000);

          //If a match was found and the role is admin then show admin menu
        } else if (jData.status == "ok" && jData.role == "admin") {
            fnGetAdminMenu();
            swal({
                title: "Success!",
                text: "Thank you for signing " + jData.role + "!",
                timer: 1000,
                type: "success",
                showConfirmButton: false
            });

            setTimeout(function() {
                $(".wdw").hide();
                $("#wdw-menu").css("display", "flex");
            }, 1000);

          //If a match was found and the role is user then show user menu
        } else if (jData.status == "ok" && jData.role == "user") {
            fnGetUserMenu();
            swal({
                title: "Success!",
                text: "Thank you for signing " + jData.role + "!",
                timer: 1000,
                type: "success",
                showConfirmButton: false
            });

            setTimeout(function() {
                $(".wdw").hide();
                $("#wdw-menu").css("display", "flex");
            }, 1000);

          //Display error message if nothing was found
        } else {
            swal({
                title: "No user found",
                text: "Please try again",
                type: "error",
                showConfirmButton: true
            });
        }
    });
}


function fnUserSignup() {
    //Get the values passed through the URL
    var sEmail = $("#txtSignupEmail").val();
    var sPassword = $("#txtSignupPassword").val();
    var sUrl = "services/users/api-user-signup.php?email="+sEmail+"&password="+sPassword;
    //Initiate Ajax
    $.get(sUrl, function(sData) {
        //Convert sData to a JSON object
        var jData = JSON.parse(sData);
        //If the status is ok display success message and show login window
        if (jData.status == "ok") {
            swal({
                title: "Thank you for signing up, user!",
                text: "You will be taken to the login page in 3 seconds",
                timer: 3000,
                showConfirmButton: false
            });
            setTimeout(function() {
                    $(".wdw").hide();
                    $("#wdw-login").show();
                }, 3000);
          //If the status is error then show error message
        } else if (jData.status == "error") {
            swal({
                title: "Error",
                type: "error",
                text: "Please fill out both fields",
                showConfirmButton: true
            });
        }
    });
}


function fnSuperAdminSignup() {
    //Get the values passed through the URL
    var sEmail = $("#txtSuperAdminSignupEmail").val();
    var sPassword = $("#txtSuperAdminSignupPassword").val();
    var sUrl = "services/users/api-super-admin-signup.php?email="+sEmail+"&password="+sPassword;
    //Initiate Ajax
    $.get(sUrl, function(sData) {
        //Convert sData to a JSON object
        var jData = JSON.parse(sData);
        //If the status is ok display success message and show login window
        if (jData.status == "ok") {
            swal({
                title: "Thank you for signing up, super-admin!",
                text: "You will be taken to the login page in 3 seconds",
                timer: 3000,
                showConfirmButton: false
            });
            setTimeout(function() {
                    $(".wdw").hide();
                    $("#wdw-login").show();
                }, 3000);
          //If the status is error then show error message
        } else if (jData.status == "error") {
            swal({
                title: "Error",
                text: "Please fill out both fields",
                showConfirmButton: true
            });
        }
    });
}


function fnGetProperties() {
	//Variable with the url of the service being used
    var sUrl = "services/properties/api-get-properties.php";
    //Initiate Ajax
    $.getJSON(sUrl, function(jData) {
        //The blueprint of the HTML elements displayed when the function is executed
        var sProperty = '<div class="lbl-property">\
							<div class="lbl-property-id">{{id}}</div>\
							<div class="lbl-property-address">{{address}}</div>\
							<div class="lbl-property-price">{{price}}</div>\
							<div data-go-to="wdw-create-property" class="fa fa-pencil fa-fw link"></div>\
							<div class="fa fa-trash fa-fw btn-delete-property"></div>\
						</div>';
        //Remove all elements from the DOM
        $("#wdw-properties").empty();
        //Append a title and navigation
        $("#wdw-properties").append("<h2>Properties</h2>");
        $("#wdw-properties").append("<a data-go-to='wdw-menu' class='link'>Go to menu</a>");
        //Loop through the array of jData
        for (var i = 0; i < jData.length; i++) {
            //sPropertyTemplate is now the same as sProperty
            var sPropertyTemplate = sProperty;
            //Replace the string '{{id}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{id}}", jData[i].id);
            //Replace the string '{{address}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{address}}", jData[i].address);
            //Replace the string '{{price}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{price}}", jData[i].price);
            //Append the property template to the wdw with the id wdw-properties
            $("#wdw-properties").append(sPropertyTemplate);
        }
    });
}

function fnGetPropertiesUserRole() {
    //Variable with the url of the service being used
    var sUrl = "services/properties/api-get-properties.php";
    //Initiate Ajax
    $.getJSON(sUrl, function(jData) {
        //The blueprint of the HTML elements displayed when the function is executed
        var sProperty = '<div class="lbl-property">\
							<div class="lbl-property-id">{{id}}</div>\
							<div class="lbl-property-address">{{address}}</div>\
							<div class="lbl-property-price">{{price}}</div>\
						</div>';
        //Remove all elements from the DOM
        $("#wdw-properties-user").empty();
        //Append a title and navigation
        $("#wdw-properties-user").append("<h2>Properties</h2>");
        $("#wdw-properties-user").append("<a data-go-to='wdw-menu' class='link'>Go to menu</a>");
        //Loop through the array of jData
        for (var i = 0; i < jData.length; i++) {
            //sPropertyTemplate is now the same as sProperty
            var sPropertyTemplate = sProperty;
            //Replace the string '{{id}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{id}}", jData[i].id);
            //Replace the string '{{address}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{address}}", jData[i].address);
            //Replace the string '{{price}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{price}}", jData[i].price);
            //Append the property template to the wdw with the id wdw-properties
            $("#wdw-properties-user").append(sPropertyTemplate);
        }
    });
}

function fnGetUsers() {
    //Variable with the url of the service being used
    var sUrl = "services/users/api-get-users.php";
    //Initiate Ajax
    $.getJSON(sUrl, function(jData) {
        //The blueprint of the HTML elements displayed when the function is executed
        var sUser = '<div class="lbl-user">\
							<div class="lbl-user-id">{{id}}</div>\
							<div class="lbl-user-email">{{email}}</div>\
							<div class="lbl-user-password">{{password}}</div>\
							<div class="lbl-user-role">{{role}}</div>\
							<div data-go-to="wdw-create-user" class="fa fa-pencil fa-fw link"></div>\
							<div class="fa fa-trash fa-fw btn-delete-user"></div>\
						</div>';
        //Remove all elements from the DOM
        $("#wdw-users").empty();
        //Append a title and navigation
        $("#wdw-users").append("<h2>Users</h2>");
        $("#wdw-users").append("<a data-go-to='wdw-menu' class='link'>Go to menu</a>");
        //Loop through the array of jData
        for (var i = 0; i < jData.length; i++) {
            //sUserTemplate is now the same as sUser
            var sUserTemplate = sUser;
            //Replace the string '{{id}}', with the unique data passed from jData
            sUserTemplate = sUserTemplate.replace("{{id}}", jData[i].id);
            //Replace the string '{{email}}', with the unique data passed from jData
            sUserTemplate = sUserTemplate.replace("{{email}}", jData[i].email);
            //Replace the string '{{password}}', with the unique data passed from jData
            sUserTemplate = sUserTemplate.replace("{{password}}", jData[i].password);
            //Replace the string '{{role}}', with the unique data passed from jData
            sUserTemplate = sUserTemplate.replace("{{role}}", jData[i].role);
            //Append the user template to the wdw with the id wdw-users
            $("#wdw-users").append(sUserTemplate);
        }
    });
}


function fnSaveProperty() {
    //Get the values from the text boxes
    var sId = $("#txt-create-property-id").val();
    var sAddress = $("#txt-create-property-address").val();
    //Create a new Geocoder object
    geocoder = new google.maps.Geocoder();
    //Initiate function to convert the variable sAddress to two coordinates
    geocoder.geocode({'address': sAddress}, function(results, status) {
        //If the Geocoder satus is ok then run the following
        if (status == google.maps.GeocoderStatus.OK) {
            //Store the latitude and longitude in two new variables
            var iLat = results[0].geometry.location.lat();
            var iLng = results[0].geometry.location.lng();
            //Store the value from the price text box in a new variable
            var sPrice = $("#txt-create-property-price").val();
            //If there is an id then update
            if (sId) {
                var sUrl = "services/properties/api-update-property.php?id=" + sId + "&address=" + sAddress + "&price=" + sPrice + "&lat=" + iLat + "&lng=" + iLng;
                //If there is no id, then create a new property
            } else {
                var sUrl = "services/properties/api-create-property.php?address=" + sAddress + "&price=" + sPrice + "&lat=" + iLat + "&lng=" + iLng;
            }
            //Pass the data to the server
            $.getJSON(sUrl, function(jData) {
                if (jData.status == "ok") {}
                //Display success message
                fnPropertyAddedTitleNotification(3);
                swal("You did it!", "You saved the property", "success")
            });

        } else {
            //Display an error message
            swal({
                title: "Sorry!",
                text: "Please try again. The reason for the error is: " + status,
                type: "error",
                showConfirmButton: true
            });
        }
    });
}


function fnSaveUser() {
    //Get the values from the text boxes
    var sId = $("#txt-create-user-id").val();
    var sEmail = $("#txt-create-user-email").val();
    var sPassword = $("#txt-create-user-password").val();
    var sRole = $("#txt-create-user-role").val();
    //If there is an id then update
    if (sId) {
        var sUrl = "services/users/api-update-user.php?id="+sId+"&email="+sEmail+"&password="+sPassword+"&role="+sRole;
        //If there is no id, then create a new user
    } else {
        var sUrl = "services/users/api-create-user.php?email="+sEmail+"&password="+sPassword+"&role="+sRole;
    }
    //Pass the data to the server
    $.getJSON(sUrl, function(jData) {
        if (jData.status == "ok") {}
        //Display success message
        swal("You did it!", "You saved the user", "success")
    });
}

function fnGetSuperAdminMenu() {
    //The blueprint of the HTML elements displayed when the function is executed
    var sMenu = '<div class="lblContainer">\
                    <h2>MANAGE PROPERTIES</h2>\
                    <div data-go-to="wdw-properties" class="link">SHOW PROPERTIES</div>\
                    <div data-go-to="wdw-create-property" class="link">CREATE PROPERTY</div>\
                    <div data-go-to="wdw-map" class="link">MAP OF PROPERTIES</div>\
                    <h2>MANAGE USERS</h2>\
                    <div data-go-to="wdw-users" class="link">SHOW USERS</div>\
                    <div data-go-to="wdw-create-user" class="link">CREATE USER</div>\
                </div>\
                <button id="btn-log-out" data-go-to="wdw-login" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdw-menu").empty();
    //Append the blueprint to the menu
    $("#wdw-menu").append(sMenu);
    fnGetSessionEmail();
}

function fnGetAdminMenu() {
    //The blueprint of the HTML elements displayed when the function is executed
    var sMenu = '<div class="lblContainer">\
					<h2>MANAGE PROPERTIES</h2>\
					<div data-go-to="wdw-properties" class="link">SHOW PROPERTIES</div>\
					<div data-go-to="wdw-create-property" class="link">CREATE PROPERTY</div>\
                    <div data-go-to="wdw-map" class="link">MAP OF PROPERTIES</div>\
				</div>\
				<button id="btn-log-out" data-go-to="wdw-login" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdw-menu").empty();
    //Append the blueprint to the menu
    $("#wdw-menu").append(sMenu);
    fnGetSessionEmail();
}

function fnGetUserMenu() {
    //The blueprint of the HTML elements displayed when the function is executed
    var sMenu = '<div class="lblContainer">\
					<h2>MANAGE PROPERTIES</h2>\
					<div data-go-to="wdw-properties-user" class="link">SHOW PROPERTIES</div>\
                    <div data-go-to="wdw-map" class="link">MAP OF PROPERTIES</div>\
				</div>\
				<button id="btn-log-out" data-go-to="wdw-login" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdw-menu").empty();
    //Append the blueprint to the menu
    $("#wdw-menu").append(sMenu);
    fnGetSessionEmail();
}

function fnPropertyAddedTitleNotification(iCounter){
        var sOriginalTitle = document.title;
        var bSwitch = 0;
        var iCounter;

        var iTimer = setInterval( function(){
            if( bSwitch == 0 ){ // it is the original title
                document.title = "NEW PROPERTY ADDED";
                bSwitch = 1;
            }else{
                document.title = sOriginalTitle;
                bSwitch = 0;
                iCounter--;
                if( iCounter == 0 ){
                    clearInterval( iTimer ); // Stop the interval
                }               
            }
        } , 1000 );
}

function fnLogout() {
    //Logs out and destroys the session
    var sUrl = "services/users/api-logout.php";
    $.getJSON(sUrl, function(jData) {
        if(jData.status == "ok") {
        }
    });
}

function fnGetSessionEmail() {
    //Gets the email stored in session and appends it to the menu
    var sUrl = "services/users/api-display-current-email.php";
    $.getJSON(sUrl, function(jData) {
        var sEmail = '<span>You are logged in as {{email}}</span>';
        var sEmailTemplate = sEmail;
        sEmailTemplate = sEmailTemplate.replace("{{email}}", jData.email);
        $("#wdw-menu").append(sEmailTemplate);
    });
}

/************************************************************************/
/************************************************************************/
/************************************************************************/

function fnGetPropertiesMap() {
    //The service used to fetch the properties
    var sUrl = "services/properties/api-get-properties.php";
    //Declaring a new information window as a new object
    var infoWindow = new google.maps.InfoWindow();

    //Creating the map
    var map = new google.maps.Map(document.getElementById("wdw-map"), {
        //Determining the default position of the map
        center: new google.maps.LatLng(55.686666, 12.563759),
        //The level of zoom
        zoom: 12,
        //The type of map
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    $("#wdw-map").append('<div><button id="btn-menu" data-go-to="wdw-menu" class="link">Go back</button></div>');

    //Initiate AJAX to get jData in return
    $.getJSON(sUrl, function(jData) {
        //Loop through the length of jData
        for (var i = 0; i < jData.length; i++) {
            //Store jData[i] in ajLocations
            var ajLocations = jData[i];
            
            //Declare new Google Maps object that takes two coordinates
            latLng = new google.maps.LatLng(ajLocations.lat, ajLocations.lng);
            
            //Creating a marker and putting it on the map. It's position based on the latLng object we just declared
            var marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: ajLocations.address
            });

            //Attaching a click event to the current marker
            google.maps.event.addListener(marker, "click", function(event) {
                //Display the address of the current marker in the information window
                infoWindow.setContent(ajLocations.address);
                infoWindow.open(ajLocations, marker);
            });

            //Creating a closure to retain the correct data 
            //The current data needs to be passed in the loop into the closure (marker, data)
            function fnAttainClosureInformationWindow(marker, ajLocations) {
                //Attaching click event to the current marker
                google.maps.event.addListener(marker, "click", function(event) {
                    infoWindow.setContent(ajLocations.address);
                    infoWindow.open(map, marker);
                });
            }
            
            fnAttainClosureInformationWindow(marker, ajLocations);
        }
    });
}

/************************************************************************/
/************************************************************************/
/************************************************************************/
