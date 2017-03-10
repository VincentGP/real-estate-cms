<?php 
	
	//Destroys session on log out
	session_start();
	unset($_SESSION['sEmail']);
	echo '{"status":"ok"}';

?>