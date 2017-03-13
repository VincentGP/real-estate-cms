<?php  
	
	//Displays the email stored in the session
	session_start();
	echo '{"email":"'.$_SESSION['sEmail'].'"}';

?>