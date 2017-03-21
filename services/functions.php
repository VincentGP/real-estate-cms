<?php

	//Price validation
	function fnIsPriceValid($sPrice, $iMin, $iMax) {
		//Convert the price from string to float
		$fPrice = (float)$sPrice;
		//If the under or over the iMin and iMax, or is not empty, then return false
		if($fPrice < $iMin || $fPrice > $iMax || empty($fPrice)) {
			return false;
		}
		//Otherwise return true
		return true;
	}

	function fnIsEmailValid($sEmail) {
	//If the email is valid return true otherwise return false
	if(preg_match("/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/", $sEmail)) {
		return true;
	}
	return false;
	}

	function fnIsPasswordValid($sPassword) {
	//If the email is valid return true otherwise return false
	if(preg_match("/.{6,}/", $sPassword)) {
		return true;
	}
	return false;
	}

	//Check if the address is a valid address || NOT USED ATM, CLASHES WITH GOOGLE AUTOCOMPLETE - TOO SPECIFIC NEEDS TO BE MORE GENERAL
	function fnIsAddressValid($sAddress) {
		return preg_match('/^(.+) (\d{1,3}[a-z]?) (\d{1,2}|st|kl)? ?(\d{1,2}|tv|mf|th)?.*(\d{4})$/img', $sAddress);
	}

	//Check for duplicates
	function fnCheckForDuplicate($sFileName, $sVariableToCheck, $jKeyToCheckAgainst) {
		//Get the contents from the txt file
		$sajDatabase = file_get_contents($sFileName);
		//Decode to array of JSON objects
		$ajDatabase = json_decode($sajDatabase);
		//Loop through the database
		for($i = 0; $i < count($ajDatabase); $i++) {
			//If the variable and the key matches, then return false
			if($sVariableToCheck == $ajDatabase[$i]->$jKeyToCheckAgainst) {
				return false;
			}
		}
		//Otherwise return true
		return true;
	}

?>