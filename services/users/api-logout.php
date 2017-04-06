<?php 
	
	//Initiate session
	session_start();
	//Destroys session on log out (you can also use session_destroy();)
	unset($_SESSION['sEmail']);
	//Echo status message
	echo '{"status":"ok"}';

?>