
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
    //Select the element and extract the value
    $("#txt-create-property-id").val(sPropertyIdToEdit);
    $("#txt-create-property-address").val(sPropertyAddressToEdit);
    $("#txt-create-property-price").val(sPropertyPriceToEdit);

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
    fnGetPropertiesUser();
});

//When the DOM is loaded you are able to get users
$(document).on("click", "[data-go-to='wdw-users']", function() {
    fnGetUsers();
});

//Empty login text fields when the user logs out
$(document).on("click", "#btn-log-out", function() {
    $("#txtLoginEmail").val('');
    $("#txtLoginPassword").val('');
});


/************************************************************************/
/************************************************************************/
/************************************************************************/


//Call function on click
$("#btnLogin").click(function(){
	fnLogin();
});

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
            sPropertyTemplate = sPropertyTemplate.replace("{{id}}", jData[i].sUniqueId);
            //Replace the string '{{address}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{address}}", jData[i].sAddress);
            //Replace the string '{{price}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{price}}", jData[i].iPrice);
            //Append the property template to the wdw with the id wdw-properties
            $("#wdw-properties").append(sPropertyTemplate);
        }
    });
}


function fnGetPropertiesUser() {
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
            sPropertyTemplate = sPropertyTemplate.replace("{{id}}", jData[i].sUniqueId);
            //Replace the string '{{address}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{address}}", jData[i].sAddress);
            //Replace the string '{{price}}', with the unique data passed from jData
            sPropertyTemplate = sPropertyTemplate.replace("{{price}}", jData[i].iPrice);
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
    var sPrice = $("#txt-create-property-price").val();
    //If there is an id then update
    if (sId) {
        var sUrl = "services/properties/api-update-property.php?id="+sId+"&address="+sAddress+"&price="+sPrice;
        //If there is no id, then create a new property
    } else {
        var sUrl = "services/properties/api-create-property.php?address=" + sAddress+"&price="+sPrice;
    }
    //Pass the data to the server
    $.getJSON(sUrl, function(jData) {
        if (jData.status == "ok") {}
        //Display success message
        swal("You did it!", "You saved the property", "success")
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
					<h2>MANAGE USERS</h2>\
					<div data-go-to="wdw-users" class="link">SHOW USERS</div>\
					<div data-go-to="wdw-create-user" class="link">CREATE USER</div>\
				</div>\
				<button id="btn-log-out" data-go-to="wdw-login" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdw-menu").empty();
    //Append the blueprint to the menu
    $("#wdw-menu").append(sMenu);
}


function fnGetAdminMenu() {
    //The blueprint of the HTML elements displayed when the function is executed
    var sMenu = '<div class="lblContainer">\
					<h2>MANAGE PROPERTIES</h2>\
					<div data-go-to="wdw-properties" class="link">SHOW PROPERTIES</div>\
					<div data-go-to="wdw-create-property" class="link">CREATE PROPERTY</div>\
				</div>\
				<button id="btn-log-out" data-go-to="wdw-login" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdw-menu").empty();
    //Append the blueprint to the menu
    $("#wdw-menu").append(sMenu);
}


function fnGetUserMenu() {
    //The blueprint of the HTML elements displayed when the function is executed
    var sMenu = '<div class="lblContainer">\
					<h2>MANAGE PROPERTIES</h2>\
					<div data-go-to="wdw-properties-user" class="link">SHOW PROPERTIES</div>\
				</div>\
				<button id="btn-log-out" data-go-to="wdw-login" class="link">Log out</button>';
    //Remove all elements from the DOM
    $("#wdw-menu").empty();
    //Append the blueprint to the menu
    $("#wdw-menu").append(sMenu);
}




