<?php
	
function fnIsEmailValid($sEmail) {
	if(preg_match("/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/", $sEmail)) {
		return true;
	}
	return false;
}
echo fnIsEmailValid("vincent@hotmailcom");

?>