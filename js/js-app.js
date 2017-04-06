/************************************************************************/
/************************************************************************/
/************************************************************************/

//CORE FUNCTIONALITY

//When the document is loaded, then run the following
$(document).ready(function() {
    //The service used for determining which user types are currently in the database
    var sUrl = "services/users/api-get-user-type.php";
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
        //If the status is ok then show the login window
        if (jData.status == "ok") {
            //Show the login window
            $("#wdwLogin").show();
            //Else make the user sign up as with the role of super-admin
        } else if (jData.status == "error") {
            //Hide all windows
            $(".wdw").hide();
            //Show the super-admin signup window
            $("#wdwSuperAdminSignup").css("display", "flex");
        }
    });
    //When the page is loaded, get the total amount of properties. Used for determining when to show notifications
    fnGetCurrentProperties();
});

//Run function on right-click
$(".wdw").contextmenu(function(event) {
    //Hide all elements with the class .wdw
    $(".wdw").hide();
    //Show the main menu
    $("#wdwMenu").show();
    //Prevent default behaviour i.e. don't show the default contextmenu
    event.preventDefault();
});

//Listen for changes in the input field and run funtion everytime a change is detected
$("#txtCreatePropertyAddress").on("change paste keyup", function() {
   //Converts the address to lat and lng coordinates
   fnConvertAddress();
});

//Run fnGetProperties on click
$(document).on("click", "[data-go-to='wdwProperties']", function() {
    fnGetProperties();
});

//Run fnGetPropertiesUserRole on click
$(document).on("click", "[data-go-to='wdwPropertiesForUserRole']", function() {
    fnGetPropertiesUserRole();
});

//Run fnGetUsers on click
$(document).on("click", "[data-go-to='wdwUsers']", function() {
    fnGetUsers();
});

//Empty login text fields when the user logs out and run function fnLogOut
$(document).on("click", "#btnLogOut", function() {
    $("#txtLoginEmail").val('');
    $("#txtLoginPassword").val('');
    fnLogout();
});

//Empty login text fields
$(document).on("click", "[data-go-to='wdwUserSignup']", function() {
    $("#txtLoginEmail").val('');
    $("#txtLoginPassword").val('');
});

//Run fnGetPropertiesMap on click
$(document).on("click", "[data-go-to='wdwMap']", function() {
    fnGetPropertiesMap();
});

//Run fnLogin on click
$(document).on("click", "#btnLogin", function() {
    fnLogin();
});

//Run fnResetImageInput on click
$(document).on("click", "[data-go-to='wdwMenu']", function() {
    fnResetImageInput();
});

//Run fnSendPropertyList on click
$(document).on("click", ".btnSendProperties", function() {
    fnSendPropertyList();
});

//Run fnSuperAdminSignup on click
$("#btnSuperAdminSignup").click(function() {
    $("#frmSuperAdminSignup").submit();
});

//Submit form when button is clicked
$("#btnUserSignup").click(function(){
    $("#frmUserSignup").submit();
});

//Submit form when button is clicked
$("#btnSaveProperty").click(function(){
    $("#frmCreateProperty").submit();
});

//Submit form when button is clicked
$("#btnSaveUser").click(function(){
    $("#frmCreateUser").submit();
});

//When the DOM is loaded and you click on a element with the link class
$(document).on("click", ".link", function() {
    //Hide all elements with the class wdw
    $(".wdw").hide();
    //Store the attribute from the window you just clicked in a variable
    var sWindowToShow = $(this).attr("data-go-to");
    //Show the window you just clicked on
    $("#" + sWindowToShow).css("display", "flex");

    //Get the property id, address, price, lat and lng you clicked on and store them in variables
    var sPropertyIdToEdit = $(this).siblings(".lblPropertyId").text();
    var sPropertyAddressToEdit = $(this).siblings(".lblPropertyAddress").text();
    var sPropertyPriceToEdit = $(this).siblings(".lblPropertyPrice").text();
    var sPropertyLatToEdit = $(this).siblings(".lblPropertyLat").text();
    var sPropertyLngToEdit = $(this).siblings(".lblPropertyLng").text();
    //Select text fields and pass the values from the previous variables
    $("#txtCreatePropertyId").val(sPropertyIdToEdit);
    $("#txtCreatePropertyAddress").val(sPropertyAddressToEdit);
    $("#txtCreatePropertyPrice").val(sPropertyPriceToEdit);
    $("#txtCreatePropertyLat").val(sPropertyLatToEdit);
    $("#txtCreatePropertyLng").val(sPropertyLngToEdit);
    //Get the user id, email, password and role you clicked on and store them in variables
    var sUserIdToEdit = $(this).siblings(".lblUserId").text();
    var sUserEmailToEdit = $(this).siblings(".lblUserEmail").text();
    var sUserPasswordToEdit = $(this).siblings(".lblUserPassword").text();
    //Select text fields and pass the values from the previous variables
    $("#txtCreateUserId").val(sUserIdToEdit);
    $("#txtCreateUserEmail").val(sUserEmailToEdit);
    $("#txtCreateUserPassword").val(sUserPasswordToEdit);
});


/************************************************************************/
/************************************************************************/
/************************************************************************/


//USERS FUNCTIONALITY

//When the form with the id frmCreateUser is submitted run the following function
$("#frmCreateUser").on('submit', function(event) {
    //Stop the page from reloading
    event.preventDefault();
    //Variable with the form submitted
    var sForm = $(this);
    //Validate the form using the Parsley library
    sForm.parsley().validate();
    //Grab the id from the text field
    var sId = $("#txtCreateUserId").val();
    //If there is an id and the validation is ok then run the following function
    if (sId && sForm.parsley().isValid()) {
        //Initiate AJAX and get jData in return
        $.ajax({
            "url": "services/users/api-update-user.php",
            "method": "POST",
            "data": new FormData(this),
            "contentType": false,
            "processData": false,
            "cache": false,
            success: function(jData) {
                //If the server returns with an error display error message
                if (jData.status == "error") {
                    sweetAlert("Oops...", "Something went wrong!", "error");
                    //Otherwise notify the user that a user has been updated
                } else {
                    //Populate the user window
                    fnGetUsers();
                    //Display success message
                    swal({
                        title: "User updated!",
                        text: "You will be taken to the user page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    //Navigate to wdwUsers
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdwUsers").css("display", "flex");
                    }, 2000);
                }
            }
        });
      //If there's no id and the form passes front-end validation
    } else if (sForm.parsley().isValid()) {
        //Initiate AJAX and get jData in return
        $.ajax({
            "url": "services/users/api-create-user.php",
            "method": "POST",
            "data": new FormData(this),
            "contentType": false,
            "processData": false,
            "cache": false,
            success: function(jData) {
                //If the server returns with an error display error message
                if (jData.status == "error") {
                    sweetAlert("Oops...", "Something went wrong!", "error");
                    //Otherwise notify the user that a user has been added
                } else {
                    //Populate the user window
                    fnGetUsers();
                    //Display success message
                    swal({
                        title: "User created!",
                        text: "You will be taken to the user page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    //Navigate to WdwUsers
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdwUsers").css("display", "flex");
                    }, 2000);
                }
            }
        });
    }
});


//Sign up of a user with the role super-admin
$("#frmSuperAdminSignup").on('submit', function(event) {
    //Stop the page from reloading
    event.preventDefault();
    //Variable with the form submitted
    var sForm = $(this);
    //Validate the form using the Parsley library
    sForm.parsley().validate();
    //If the form passes front-end validation
    if (sForm.parsley().isValid()) {
        //Initiate AJAX and get jData in return
        $.ajax({
            "url": "services/users/api-super-admin-signup.php",
            "method": "POST",
            "data": new FormData(this),
            "contentType": false,
            "processData": false,
            "cache": false,
            success: function(jData) {
                //If the server returns with an error display error message
                if (jData.status == "error") {
                    sweetAlert("Oops...", "Something went wrong!", "error");
                    //Otherwise notify the user that a user has been updated
                } else {
                    //Display success message
                    swal({
                        title: "You signed up!",
                        text: "You will be taken to the login page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    //Navigate to login window
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdwLogin").show();
                    }, 2000);
                }
            }
        });
    }
});


//Sign up of a regular user
$("#frmUserSignup").on('submit', function(event) {
    //Stop the page from reloading
    event.preventDefault();
    //Variable with the form submitted
    var sForm = $(this);
    //Validate the form using the Parsley library
    sForm.parsley().validate();
    //If the form passes front-end validation
    if (sForm.parsley().isValid()) {
        //Initiate AJAX and get jData in return
        $.ajax({
            "url": "services/users/api-user-signup.php",
            "method": "POST",
            "data": new FormData(this),
            "contentType": false,
            "processData": false,
            "cache": false,
            success: function(jData) {
                //If the server returns with an error display error message
                if (jData.status == "error") {
                    sweetAlert("Oops...", "Something went wrong!", "error");
                    //Otherwise notify the user that a user has been updated
                } else {
                    //Display success message
                    swal({
                        title: "You signed up!",
                        text: "You will be taken to the login page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    //Navigate to wdwLogin
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdwLogin").show();
                    }, 2000);
                }
            }
        });
    }
});

//Used when users login
function fnLogin() {
    //Store the text from the inputs in variables
    var sEmail = $("#txtLoginEmail").val();
    var sPassword = $("#txtLoginPassword").val();
    //The URL to be passed via AJAX
    var sUrl = "services/users/api-login.php?email=" + sEmail + "&password=" + sPassword;
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
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
                $("#wdwMenu").css("display", "flex");
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
                $("#wdwMenu").css("display", "flex");
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
                $("#wdwMenu").css("display", "flex");
            }, 1000);
            //If no match was found then display an error message
        } else {
            sweetAlert("Oops...", "Something went wrong!", "error");
        }
    });
}

//Logs out the current user
function fnLogout() {
    //The service used for logging out
    var sUrl = "services/users/api-logout.php";
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
        //If the status is ok display success message
        if(jData.status == "ok") {
            swal({
                title: "Thank you!",
                text: "You succesfully logged out! See you soon!",
                showConfirmButton: true
            });
        }
    });
}

//Display all the users
function fnGetUsers() {
    //Variable containing the service we need to use
    var sUrl = "services/users/api-get-users.php";
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
        //Blueprint of the user elements
        var sUser = '<div class="lblUser">\
                            <div class="lblUserId">{{id}}</div>\
                            <div class="lblUserEmail">{{email}}</div>\
                            <div class="lblUserPassword">{{password}}</div>\
                            <div class="lblUserRole">{{role}}</div>\
                            <div data-go-to="wdwCreateUser" class="fa fa-pencil fa-fw link"></div>\
                            <div class="fa fa-trash fa-fw btnDeleteUser"></div>\
                        </div>';
        //Remove all elements from the DOM
        $("#wdwUsers").empty();
        //Append a title
        $("#wdwUsers").append("<h2>Users</h2>");
        //Append navigation
        $("#wdwUsers").append("<a data-go-to='wdwMenu' class='link'>Go to menu</a>");
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
            //Append the user template to the wdw with the id wdwUsers
            $("#wdwUsers").append(sUserTemplate);
        }
    });
}

//Builds the main menu for a user with the role 'super-admin'
function fnGetSuperAdminMenu() {
    //The blueprint of the menu elements
    var sMenu = '<div class="lblMenu">\
                    <h2>MANAGE PROPERTIES</h2>\
                    <div data-go-to="wdwProperties" class="link">SHOW PROPERTIES</div>\
                    <div data-go-to="wdwCreateProperty" class="link">CREATE PROPERTY</div>\
                    <div data-go-to="wdwMap" class="link">MAP OF PROPERTIES</div>\
                    <h2>MANAGE USERS</h2>\
                    <div data-go-to="wdwUsers" class="link">SHOW USERS</div>\
                    <div data-go-to="wdwCreateUser" class="link">CREATE USER</div>\
                </div>\
                <button id="btnLogOut" data-go-to="wdwLogin" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdwMenu").empty();
    //Append the blueprint to the main menu
    $("#wdwMenu").append(sMenu);
    //Display the email for the user currently logged in
    fnGetSessionEmail();
}

//Builds the main menu for a user with the role 'admin'
function fnGetAdminMenu() {
    //The blueprint of the menu elements
    var sMenu = '<div class="lblMenu">\
                    <h2>MANAGE PROPERTIES</h2>\
                    <div data-go-to="wdwProperties" class="link">SHOW PROPERTIES</div>\
                    <div data-go-to="wdwCreateProperty" class="link">CREATE PROPERTY</div>\
                    <div data-go-to="wdwMap" class="link">MAP OF PROPERTIES</div>\
                </div>\
                <button id="btnLogOut" data-go-to="wdwLogin" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdwMenu").empty();
    //Append the blueprint to the main menu
    $("#wdwMenu").append(sMenu);
    //Display the email for the user currently logged in
    fnGetSessionEmail();
}

//Builds the main menu for a user with the role 'user'
function fnGetUserMenu() {
    //The blueprint of the menu elements
    var sMenu = '<div class="lblMenu">\
                    <h2>MANAGE PROPERTIES</h2>\
                    <div data-go-to="wdwPropertiesForUserRole" class="link">SHOW PROPERTIES</div>\
                    <div data-go-to="wdwMap" class="link">MAP OF PROPERTIES</div>\
                </div>\
                <button id="btnLogOut" data-go-to="wdwLogin" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdwMenu").empty();
    //Append the blueprint to the main menu
    $("#wdwMenu").append(sMenu);
    //Display the email for the user currently logged in
    fnGetSessionEmail();
}

//When the DOM is loaded and you click on a element with the btnDeleteProperty class
$(document).on("click", ".btnDeleteUser", function() {
    //Store the ID and element you want to delete in variables
    var sIdToDelete = $(this).siblings(".lblUserId").text();
    var oTheParent = $(this).parent();
    //The service you use to delete the user from the database
    var sUrl = "services/users/api-delete-user.php?id=" + sIdToDelete;
    //Alert the user that this action will delete a user
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
            //Initiate AJAX and get jData in return
            $.getJSON(sUrl, function(jData) {
                //If the status is ok then remove the element
                if (jData.status == "ok") {
                    oTheParent.remove();
                }
            });
            //Display success message to the user
            swal("Deleted!", "The user has been deleted.", "success");
        });
});

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


/************************************************************************/
/************************************************************************/
/************************************************************************/


//PROPERTIES FUNCTIONALITY

//When the form with the id frmCreateProperty is submitted run the following function
$("#frmCreateProperty").on('submit', function(event) {
    //Stop the page from reloading
    event.preventDefault();
    //Store the form submitted
    var sForm = $(this);
    //Validate the form using the Parsley library
    sForm.parsley().validate();
    //Grab the ID (by default hidden from the user)
    var sId = $("#txtCreatePropertyId").val();
    //If there is an Id and the validation is ok then run the following function
    if (sId && sForm.parsley().isValid()) {
        //Initiate AJAX and get jData in return
        $.ajax({
            "url": "services/properties/api-update-property.php",
            "method": "POST",
            "data": new FormData(this),
            "contentType": false,
            "processData": false,
            "cache": false,
            success: function(jData) {
                //If the server returns with an error display error message
                if (jData.status == "error") {
                    sweetAlert("Oops...", "Something went wrong!", "error");
                    //Otherwise notify the user that a property has been updated
                } else {
                    //Populate the property window
                    fnGetProperties();
                    //Display success message
                    swal({
                        title: "Property updated!",
                        text: "You will be taken to the properties page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    //Navigate to wdwProperties
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdwProperties").css("display", "flex");
                    }, 2000);
                    //Reset the image input
                    fnResetImageInput();
                }
            }
        });
        //If iImageCounter is 3 or more and the form passes validation
    } else if (iImageCounter >= 3 && sForm.parsley().isValid()) {
        //Initiate AJAX and get jData in return
        $.ajax({
            "url": "services/properties/api-create-property.php",
            "method": "POST",
            "data": new FormData(this),
            "contentType": false,
            "processData": false,
            "cache": false,
            success: function(jData) {
                //If the server returns with an error display error message
                if (jData.status == "error") {
                    sweetAlert("Oops...", "Something went wrong!", "error");
                    //Otherwise notify the user that a property has been added
                } else {
                    //Populate the property window
                    fnGetProperties();
                    //Display success message
                    swal({
                        title: "Property created!",
                        text: "You will be taken to the properties page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    //Navigate to wdwProperties
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdwProperties").css("display", "flex");
                    }, 2000);
                    //Reset the image input
                    fnResetImageInput();
                }
            }
        });
    }
});

//Displays the properties for a user with the role 'admin' and 'super-admin'
function fnGetProperties() {
    //Variable with the url of the service being used
    var sUrl = "services/properties/api-get-properties.php";
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
        //The blueprint of the HTML elements
        var sProperty = '<div class="lblProperty">\
                            <div class="lblPropertyInformation">\
                                <div class="lblPropertyId">{{id}}</div>\
                                <div class="lblPropertyAddress">{{address}}</div>\
                                <div class="lblPropertyPrice">{{price}}</div>\
                                <div data-go-to="wdwCreateProperty" class="fa fa-pencil fa-fw link"></div>\
                                <div class="fa fa-trash fa-fw btnDeleteProperty"></div>\
                            </div>\
                                <div class="lblPropertyImages" id="{{P-id}}">\
                            </div>\
                        </div>';
        //Remove all elements from the DOM
        $("#wdwProperties").empty();
        //Append a title
        $("#wdwProperties").append("<h2>Properties</h2>");
        //Append navigation
        $("#wdwProperties").append("<a data-go-to='wdwMenu' class='link'>Go to menu</a>");
        //Append email button
        $("#wdwProperties").append("<button class='btnSendProperties'>Receive Email with list of properties</button>");
        //Loop through the array of jData
        for (var i = 0; i < jData.length; i++) {
            //sPropertyTemplate is now the same as sProperty
            var sPropertyTemplate = sProperty;
            //Replace the string '{{id}}', with the data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{id}}", jData[i].id);
            //Replace the string 'P{{id}}', with the data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{P-id}}", "property-" + jData[i].id);
            //Replace the string '{{address}}', with the data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{address}}", jData[i].address);
            //Replace the string '{{price}}', with the data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{price}}", jData[i].price);
            //Append the property template to the wdw with the id wdwProperties
            $("#wdwProperties").append(sPropertyTemplate);
            //Declare the path to folder where the images are located
            var sPath = jData[i].id;
            //Variable where a string of the images is stored
            var sImages = jData[i].images;
            //Loop through the string of images
            for(var j = 0; j < sImages.length; j++) {
                //Path to the image
                var sImageTemplate = '<img src="services/properties/images/' + sPath + '/' + sImages[j] + '">';
                //Append the images to the property
                $("#property-" + jData[i].id).append(sImageTemplate);
            }
        }
    });
}

//Displays the properties for a user with the role 'user'
function fnGetPropertiesUserRole() {
    //Variable with the url of the service being used
    var sUrl = "services/properties/api-get-properties.php";
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
        //The blueprint of the HTML elements
        var sProperty = '<div class="lblProperty">\
                            <div class="lblPropertyInformation">\
                                <div class="lblPropertyId">{{id}}</div>\
                                <div class="lblPropertyAddress">{{address}}</div>\
                                <div class="lblPropertyPrice">{{price}}</div>\
                            </div>\
                                <div class="lblPropertyImages" id="{{P-id}}">\
                            </div>\
                        </div>';
        //Remove all elements from the DOM
        $("#wdwPropertiesForUserRole").empty();
        //Append a title
        $("#wdwPropertiesForUserRole").append("<h2>Properties</h2>");
        //Append navigation
        $("#wdwPropertiesForUserRole").append("<a data-go-to='wdwMenu' class='link'>Go to menu</a>");
        //Append email button
        $("#wdwPropertiesForUserRole").append("<button class='btnSendProperties'>Receive Email with list of properties</button>");
        //Loop through the array of jData
        for (var i = 0; i < jData.length; i++) {
            //sPropertyTemplate is now the same as sProperty
            var sPropertyTemplate = sProperty;
            //Replace the string '{{id}}', with the data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{id}}", jData[i].id);
            //Replace the string 'P{{id}}', with the data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{P-id}}", "property-" + jData[i].id);
            //Replace the string '{{address}}', with the data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{address}}", jData[i].address);
            //Replace the string '{{price}}', with the data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{price}}", jData[i].price);
            //Append the property template to the wdw with the id wdwPropertiesForUserRole
            $("#wdwPropertiesForUserRole").append(sPropertyTemplate);
            //Declare the path to folder where the images are located
            var sPath = jData[i].id;
            //Variable where a string of the images is stored
            var sImages = jData[i].images;
            //Loop through the string of images
            for(var j = 0; j < sImages.length; j++) {
                //Path to the image
                var sImageTemplate = '<img src="services/properties/images/' + sPath + '/' + sImages[j] + '">';
                //Append the images to the property
                $("#property-" + jData[i].id).append(sImageTemplate);
            }
        }
    });
}

//When the DOM is loaded and you click on a element with the class btnDeleteProperty
$(document).on("click", ".btnDeleteProperty", function() {
    //Store the address and element you want to delete in variables
    var sAddressToDelete = $(this).siblings(".lblPropertyAddress").text();
    var oTheParent = $(this).parent().parent();
    //The service you use to delete the property from the database
    var sUrl = "services/properties/api-delete-property.php?address=" + sAddressToDelete;
    //Alert the user that the action will delete the property
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
            //Initiate AJAX and get jData in return
            $.getJSON(sUrl, function(jData) {
                //If the status is ok then remove the element
                if (jData.status == "ok") {
                    oTheParent.remove();
                }
            });
            //Display success message
            swal("Deleted!", "The property has been deleted.", "success");
        });
});

//Send a list of properties to the current user
function fnSendPropertyList() {
    //Variable containing the URL to the service needed
    var sUrl = "services/properties/api-send-properties.php";
    //Initiate AJAX and receive jData in return
    $.getJSON(sUrl, function(jData) {
        //If the status is ok, then display success message
        if(jData.status == 'ok') {
            swal({
                title: "Thank you!",
                text: "You will receive an email with a list of the properties",
                showConfirmButton: true
            });
          //Else display error message
        } else {
            sweetAlert("Oops...", "Something went wrong! The email wasn't sent.", "error");
        }
    });
}

//Declare new Cleave object used for formatting the price in real time
var cleaveFormatPrice = new Cleave('#txtCreatePropertyPrice', {
    //Only take numeral values
    numeral: true,
    //Decimal is marked with a comma
    numeralDecimalMark: ',',
    //Delimiter is marked with a period
    delimiter: '.',
    //Only take positive numbers
    numeralPositiveOnly: true
});


/************************************************************************/
/************************************************************************/
/************************************************************************/


//NOTIFICATIONS FUNCTIONALITY

//Global variable used for counting the amount of properties
var iPropertyCount = 0;

//Function that fetches the current amount of properties
function fnGetCurrentProperties() {
    //Variable with the url of the service being used
    var sUrl = "services/properties/api-get-properties.php";
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
        //Set iPropertyCount to the current length of the array
        iPropertyCount = jData.length;
    });
}
setInterval(function() {
    //Variable with the url of the service being used
    var sUrl = "services/properties/api-get-properties.php";
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
        //If iPropertyCount is larger than 0 less than the current amount of properties
        if (iPropertyCount > 0 && iPropertyCount < jData.length) {
            //Set the new length of the properties
            iPropertyCount = jData.length;
            //Create desktop notification
            fnDesktopNotification("A property was created!");
            //Create title notification
            fnTitleNotification(3);
        }
    });
    //Check for new properties every 10 seconds
}, 10000);

//Creates a desktop notification with a custom message
function fnDesktopNotification(sMessage) {
    //Checks if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    //Checks whether or not notification permissions have already been granted
    else if (Notification.permission === "granted") {
        //Create notification
        var notification = new Notification(sMessage);
        //Build a sound object
        var oSound = new Audio('sounds/notification.mp3');
        //Play the sound
        oSound.play();
    }
    //Otherwise, ask the user for permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission(function(permission) {
            // If the user accepts, create notification
            if (permission === "granted") {
                var notification = new Notification(sMessage);
                //Build a sound object
                var oSound = new Audio('sounds/notification.mp3');
                //Play the sound
                oSound.play();
            }
        });
    }
}

//Makes the tab title blink a custom amount of times
function fnTitleNotification(iCounter) {
    //Declare variable which stores the original title
    var sOriginalTitle = document.title;
    //Boolean switch set to 0
    var bSwitch = 0;
    //Declare iCounter
    var iCounter;
    //Declare the variable iTimer which runs function on a set interval
    var iTimer = setInterval(function() {
        //When the bSwitch is 0
        if (bSwitch == 0) {
            //Display the new document title
            document.title = "PROPERTY MODIFIED";
            //Set the bSwitch to 1
            bSwitch = 1;
          //If the bSwitch is 1  
        } else {
            //Set the document title to the original title
            document.title = sOriginalTitle;
            //Switch the bSwitch to 0 again
            bSwitch = 0;
            //Decrease the iCounter
            iCounter--;
            //If the iCounter is 0
            if (iCounter == 0) {
                //Stop the interval
                clearInterval(iTimer);
            }
        }
    }, 1000);
}


/************************************************************************/
/************************************************************************/
/************************************************************************/


//FILE UPLOAD FUNCTIONALITY
    
//Global variable used to count the images
var iImageCounter = 0;

//When the DOM is loaded and there's a change in inputs with the type file
$(document).on('change', '[type="file"]', function() {
    //Create a new preview object
    var oPreview = new FileReader();
    //Read the contents of the specified blob or file
    oPreview.readAsDataURL(this.files[0]);
    //Maintain the original reference to this
    var self = this;
    //When the data is loaded run the following function
    oPreview.onload = function(event) {
            //Add the temporary src to the imgPreview class
            $(self).siblings(".imgPreview").attr("src", event.target.result);
        }
    //Run the function fnCreateImageInput
    fnCreateImageInput();
});

//Function used for creating new image input each time a image is previewed
function fnCreateImageInput() {
    //Every time an image is added, add to the counter
    iImageCounter++;
    //Variable that contains the image input template
    var sImageInputTemplate = '<div class="lblPropertyFileUplaod">\
                                 <img class="imgPreview" src=""></img>\
                                 <input class="file" type="file" name="file-' + iImageCounter + '">\
                               </div>';
    //Append the template to the form
    $("#frmCreateProperty").append(sImageInputTemplate);
}

//Function for resetting the image inputs after the form is submitted
function fnResetImageInput() {
    //Set iImageCounter to 0
    iImageCounter = 0;
    //Reset the form
    $('#frmCreateProperty')[0].reset();
    //Remove the file upload classes
    $('.lblPropertyFileUplaod').remove();
    //Empty the preview src
    $('.imgPreview').attr('src', '');
}


/************************************************************************/
/************************************************************************/
/************************************************************************/


//GOOGLE MAPS FUNCTIONALITY

//Function that displays the Google Map
function fnGetPropertiesMap() {
    //The service used to fetch the properties
    var sUrl = "services/properties/api-get-properties.php";
    //Declaring a new information window as an object
    var infoWindow = new google.maps.InfoWindow();
    //Creating the map
    var map = new google.maps.Map(document.getElementById("wdwMap"), {
        //Determining the default position of the map
        center: new google.maps.LatLng(55.686666, 12.563759),
        //The level of zoom
        zoom: 12,
        //The type of map
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    //Append a back button to the upper right corner of the map
    $("#wdwMap").append('<div><button id="btnMenu" data-go-to="wdwMenu" class="link">Go back</button></div>');
    //Initiate AJAX and get jData in return
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
            //We now need to create a closure to retain the correct data
            //The current data needs to be passed in the loop into the closure (marker, data)
            function fnAttainClosureInformationWindow(marker, ajLocations) {
                //Attaching click event to the current marker
                google.maps.event.addListener(marker, "click", function(event) {
                    infoWindow.setContent(ajLocations.address);
                    infoWindow.open(map, marker);
                });
            }
            //Run the aforementioned function
            fnAttainClosureInformationWindow(marker, ajLocations);
        }
    });
}

//Callback function used to initialize Google Maps Autocomplete
function fnInitializeAutocomplete() {
    //Declare the element which needs to use the autocomplete function
    var sAddress = (document.getElementById('txtCreatePropertyAddress'));
    //Declare new Google Maps Autocomplete object
    var autocomplete = new google.maps.places.Autocomplete(sAddress);
    //Use the type 'geocode'
    autocomplete.setTypes(['geocode']);
    //Whenever somthing changes in the autocomplete object run the following function
    google.maps.event.addListener(autocomplete, 'place_changed', function() {
        //The current place
        var place = autocomplete.getPlace();
        //If the place isn't valid geometry return false
        if (!place.geometry) {
            return;
        }
        //Empty the sAddress variable
        var sAddress = '';
        //If the place has address_components then store them in sAddress
        if (place.address_components) {
            sAddress = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
    });
}

//Convert address to lat and lng
function fnConvertAddress() {
    //Get the values from the text box
    var sAddress = $("#txtCreatePropertyAddress").val();
    //Create a new Geocoder object
    geocoder = new google.maps.Geocoder();
    //Initiate function to convert the variable sAddress to two coordinates
    geocoder.geocode({ 'address': sAddress }, function(results, status) {
        //If the Geocoder status is ok then run the following
        if (status == google.maps.GeocoderStatus.OK) {
            //Store the latitude and longitude in two new variables
            var iLat = results[0].geometry.location.lat();
            var iLng = results[0].geometry.location.lng();
            //Put the values in the text input boxes
            $("#txtCreatePropertyLat").val(iLat);
            $("#txtCreatePropertyLng").val(iLng);
        }
    });
}
