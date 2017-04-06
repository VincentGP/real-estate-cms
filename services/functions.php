<?php

	//Price validation
	function fnIsPriceValid($sPrice, $iMin, $iMax) {
		//Convert the price from string to float
		$fPrice = (float)$sPrice;
		//If the price is under or over the iMin and iMax, or is empty, then return false
		if($fPrice < $iMin || $fPrice > $iMax || empty($fPrice)) {
			return false;
		}
		//Otherwise return true
		return true;
	}

	//Email validation
	function fnIsEmailValid($sEmail) {
	//If the email is valid return true otherwise return false
	if(preg_match("/^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/", $sEmail)) {
		return true;
	}
	return false;
	}

	function fnIsPasswordValid($sPassword) {
	//If the password is valid return true otherwise return false
	if(preg_match("/.{6,}/", $sPassword)) {
		return true;
	}
	return false;
	}

	//Check if the address is a valid address (There needs to be street name that is followed by a number)
	function fnIsAddressValid($sAddress) {
		return preg_match('/^(.+) (\d{1,4}[a-z]?)/', $sAddress);
	}

	//Check for duplicates
	function fnCheckForDuplicate($sFileName, $sVariableToCheck, $jKeyToCheckAgainst) {
		//Get the contents from the file
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

//Delete image directory when a property is deleted
function fnDeletePropertyDirectory($sPath) {
    //If sPath is a valid directory
    if (is_dir($sPath) === true) {
        //Store new RecursiveIteratorIterator in the variable files
        $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($sPath), RecursiveIteratorIterator::CHILD_FIRST);
        //Loop through all the files
        foreach ($files as $file) {
        	//If the file doesn't exist in an array
            if (in_array($file->getBasename(), array('.', '..')) !== true) {
                //If the file is in a valid directory
                if ($file->isDir() === true) {
                	//Remove it
                    rmdir($file->getPathName());
                }
                //If the file is a valid file or a symbolic link
                else if (($file->isFile() === true) || ($file->isLink() === true)) {
                	//Delete the file
                    unlink($file->getPathname());
                }
            }
        }
        //Return true or false depending on success
        return rmdir($sPath);
    }
    //If the file path is a valid file or a symbolic link
    else if ((is_file($sPath) === true) || (is_link($sPath) === true)) {
        //Return true or false depending on success
        return unlink($sPath);
    }
    //Otherwise return false
    return false;
}

?>