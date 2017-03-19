<?php

	//Price validation
	function fnIsPriceValid($iPrice, $iMin, $iMax) {
		//If the under or over the iMin and iMax, or is not empty, then return false
		if($iPrice < $iMin || $iPrice > $iMax || empty($iPrice)) {
			return false;
		}
		//Otherwise return true
		return true;
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