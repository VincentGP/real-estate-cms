<?php  
	
	//Fetches the email stored in the SESSION
	session_start();
	echo '{"email":"'.$_SESSION['sEmail'].'"}';

?>