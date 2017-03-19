<?php
	
	function repeat() {
	      static $number = 0;
	      $number++;
	      return $number;
	 }

	 echo repeat();


?>