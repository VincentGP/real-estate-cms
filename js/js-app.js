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
            $("#wdw-login").show();
          //Else make the user sign up as with the role of super-admin
        } else if (jData.status == "error") {
            //Hide all windows
            $(".wdw").hide();
            //Show the super-admin signup window
            $("#wdw-super-admin-signup").css("display", "flex");
        }
    });
    //When the page is loaded, get the total amount of properties
    fnGetCurrentProperties();
});


/************************************************************************/
/************************************************************************/
/************************************************************************/

//TRIGGERS FUNCTIONALITY

//Function run on right click
$(".wdw").contextmenu(function(event) {
    //Hide all .wdw
    $(".wdw").hide();
    //Show the menu
    $("#wdw-menu").show();
    //Prevent default behaviour
    event.preventDefault();
});

//Run when there's a change in the id txt-create-property-address
$('#txt-create-property-address').change(function() {
    fnConvertAddress();
});

//Run fnGetProperties on click
$(document).on("click", "[data-go-to='wdw-properties']", function() {
    fnGetProperties();
});

//Run fnGetPropertiesUserRole on click
$(document).on("click", "[data-go-to='wdw-properties-user']", function() {
    fnGetPropertiesUserRole();
});

//Run fnGetUsers on click
$(document).on("click", "[data-go-to='wdw-users']", function() {
    fnGetUsers();
});

//Empty login text fields when the user logs out and run the function fnLogOut
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

//Run fnGetPropertiesMap on click
$(document).on("click", "[data-go-to='wdw-map']", function() {
    fnGetPropertiesMap();
});

//Run fnLogin on click
$(document).on("click", "#btnLogin", function() {
    fnLogin();
});

//Run fnResetImageInput on click
$(document).on("click", "[data-go-to='wdw-menu']", function() {
    fnResetImageInput();
});

//Run fnSendPropertyList on click
$(document).on("click", ".btnSendProperties", function() {
    fnSendPropertyList();
});

//Run fnSuperAdminSignup on click
$("#btnSuperAdminSignup").click(function() {
    fnSuperAdminSignup();
});

//Call function on click
$("#btnUserSignup").click(function(){
    //Run the following function
    fnUserSignup();
});

//Submit the form frmCreateProperty on click
$("#btn-save-property").click(function(){
    $("#frmCreateProperty").submit();
});

//Submit the form frmCreateUser on click
$("#btn-save-user").click(function(){
    $("#frmCreateUser").submit();
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
    //Grab the ID (by default hidden from the user). Used if updating the user
    var sId = $("#txt-create-user-id").val();
    //If there is an Id and the validation is ok then run the following function
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
                    swal({
                        title: "User updated!",
                        text: "You will be taken to the user page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdw-users").show();
                    }, 2000);
                }
            }
        });
        //If there is no Id and the form passes front-end validation
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
                    swal({
                        title: "User created!",
                        text: "You will be taken to the user page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdw-users").show();
                    }, 2000);
                }
            }
        });
    }
});


//Sign up of a super-admin
function fnSuperAdminSignup() {
    //Store the text from the textboxes in variables
    var sEmail = $("#txtSuperAdminSignupEmail").val();
    var sPassword = $("#txtSuperAdminSignupPassword").val();
    //The URL to be passed via AJAX
    var sUrl = "services/users/api-super-admin-signup.php?email=" + sEmail + "&password=" + sPassword;
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
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
        }
    });
}

//Sign up of a regular user
function fnUserSignup() {
    //Store the text from the textboxes in variables
    var sEmail = $("#txtSignupEmail").val();
    var sPassword = $("#txtSignupPassword").val();
    //The URL to be passed via AJAX
    var sUrl = "services/users/api-user-signup.php?email=" + sEmail + "&password=" + sPassword;
    //Initiate AJAX and get jData in return
    $.getJSON(sUrl, function(jData) {
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
        }
    });
}

//Used when users login
function fnLogin() {
    //Store the text from the textboxes in variables
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
        }
    });
}

//Logs out the current user
function fnLogout() {
    //The service used for logging the user out
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
        //Append a title
        $("#wdw-users").append("<h2>Users</h2>");
        //Append navigation
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

//Builds the main menu for a user with the role 'super-admin'
function fnGetSuperAdminMenu() {
    //The blueprint of the menu elements
    var sMenu = '<div class="lblMenuContainer">\
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
    //Append the blueprint to the main menu
    $("#wdw-menu").append(sMenu);
    //Display the email for the logged in user
    fnGetSessionEmail();
}

//Builds the main menu for a user with the role 'admin'
function fnGetAdminMenu() {
    //The blueprint of the menu elements
    var sMenu = '<div class="lblMenuContainer">\
                    <h2>MANAGE PROPERTIES</h2>\
                    <div data-go-to="wdw-properties" class="link">SHOW PROPERTIES</div>\
                    <div data-go-to="wdw-create-property" class="link">CREATE PROPERTY</div>\
                    <div data-go-to="wdw-map" class="link">MAP OF PROPERTIES</div>\
                </div>\
                <button id="btn-log-out" data-go-to="wdw-login" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdw-menu").empty();
    //Append the blueprint to the main menu
    $("#wdw-menu").append(sMenu);
    //Display the email for the logged in user
    fnGetSessionEmail();
}

//Builds the main menu for a user with the role 'user'
function fnGetUserMenu() {
    //The blueprint of the menu elements
    var sMenu = '<div class="lblMenuContainer">\
                    <h2>MANAGE PROPERTIES</h2>\
                    <div data-go-to="wdw-properties-user" class="link">SHOW PROPERTIES</div>\
                    <div data-go-to="wdw-map" class="link">MAP OF PROPERTIES</div>\
                </div>\
                <button id="btn-log-out" data-go-to="wdw-login" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdw-menu").empty();
    //Append the blueprint to the main menu
    $("#wdw-menu").append(sMenu);
    //Display the email for the logged in user
    fnGetSessionEmail();
}

//When the DOM is loaded and you click on a element with the btn-delete-property class
$(document).on("click", ".btn-delete-user", function() {
    //Store the ID and element you want to delete in variables
    var sIdToDelete = $(this).siblings(".lbl-user-id").text();
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
        var sEmailTemplate = sEmail;
        //Replace the placeholder with the real email
        sEmailTemplate = sEmailTemplate.replace("{{email}}", jData.email);
        //Append sEmailTemplate to the main menu
        $("#wdw-menu").append(sEmailTemplate);
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
    var sId = $("#txt-create-property-id").val();
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
                    swal({
                        title: "Property updated!",
                        text: "You will be taken to the properties page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdw-properties").show();
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
                    swal({
                        title: "Property created!",
                        text: "You will be taken to the properties page in 2 seconds",
                        timer: 2000,
                        showConfirmButton: false
                    });
                    setTimeout(function() {
                        $(".wdw").hide();
                        $("#wdw-properties").show();
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
        var sProperty = '<div class="lbl-property">\
                            <div class="lbl-property-information">\
                                <div class="lbl-property-id">{{id}}</div>\
                                <div class="lbl-property-address">{{address}}</div>\
                                <div class="lbl-property-price">{{price}}</div>\
                                <div data-go-to="wdw-create-property" class="fa fa-pencil fa-fw link"></div>\
                                <div class="fa fa-trash fa-fw btn-delete-property"></div>\
                            </div>\
                                <div class="lbl-property-images" id="{{P-id}}">\
                            </div>\
                        </div>';
        //Remove all elements from the DOM
        $("#wdw-properties").empty();
        //Append a title
        $("#wdw-properties").append("<h2>Properties</h2>");
        //Append navigation
        $("#wdw-properties").append("<a data-go-to='wdw-menu' class='link'>Go to menu</a>");
        //Append email button
        $("#wdw-properties").append("<button class='btnSendProperties'>Receive Email with list of properties</button>");
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
            //Append the property template to the wdw with the id wdw-properties
            $("#wdw-properties").append(sPropertyTemplate);
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
        var sProperty = '<div class="lbl-property">\
                            <div class="lbl-property-information">\
                                <div class="lbl-property-id">{{id}}</div>\
                                <div class="lbl-property-address">{{address}}</div>\
                                <div class="lbl-property-price">{{price}}</div>\
                            </div>\
                                <div class="lbl-property-images" id="{{P-id}}">\
                            </div>\
                        </div>';
        //Remove all elements from the DOM
        $("#wdw-properties-user").empty();
        //Append a title
        $("#wdw-properties-user").append("<h2>Properties</h2>");
        //Append navigation
        $("#wdw-properties-user").append("<a data-go-to='wdw-menu' class='link'>Go to menu</a>");
        //Append email button
        $("#wdw-properties-user").append("<button class='btnSendProperties'>Receive Email with list of properties</button>");
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
            //Append the property template to the wdw with the id wdw-properties-user
            $("#wdw-properties-user").append(sPropertyTemplate);
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

//When the DOM is loaded and you click on a element with the class btn-delete-property
$(document).on("click", ".btn-delete-property", function() {
    //Store the address and element you want to delete in variables
    var sAddressToDelete = $(this).siblings(".lbl-property-address").text();
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

//Declare new Cleave object
var cleaveFormatPrice = new Cleave('#txt-create-property-price', {
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

//Variable used for counting the amount of properties
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
}, 1000);

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
            //Add the temporary src to the img-preview class
            $(self).siblings(".img-preview").attr("src", event.target.result);
        }
    //Run the function fnCreateImageInput
    fnCreateImageInput();
});

//Function used for creating new image input each time a image is previewed
function fnCreateImageInput() {
    //Every time an image is added, add to the counter
    iImageCounter++;
    //Variable that contains the image input template
    var sImageInputTemplate = '<div class="lbl-property-file-upload">\
                                 <img class="img-preview" src=""></img>\
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
    $('.lbl-property-file-upload').remove();
    //Empty the preview src
    $('.img-preview').attr('src', '');
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
    var map = new google.maps.Map(document.getElementById("wdw-map"), {
        //Determining the default position of the map
        center: new google.maps.LatLng(55.686666, 12.563759),
        //The level of zoom
        zoom: 12,
        //The type of map
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    //Append a back button to the upper right corner of the map
    $("#wdw-map").append('<div><button id="btn-menu" data-go-to="wdw-menu" class="link">Go back</button></div>');
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
    var sAddress = (document.getElementById('txt-create-property-address'));
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
    var sAddress = $("#txt-create-property-address").val();
    //Create a new Geocoder object
    geocoder = new google.maps.Geocoder();
    //Initiate function to convert the variable sAddress to two coordinates
    geocoder.geocode({ 'address': sAddress }, function(results, status) {
        //If the Geocoder status is ok then run the following
        if (status == google.maps.GeocoderStatus.OK) {
            //Store the latitude and longitude in two new variables
            var iLat = results[0].geometry.location.lat();
            var iLng = results[0].geometry.location.lng();
            //Put them in the invisible text boxes
            $("#txt-create-property-lat").val(iLat);
            $("#txt-create-property-lng").val(iLng);
        }
    });
}
