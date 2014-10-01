<!-- 
<?php

require_once('model.php');

	$formatted = array();
	
	foreach ($airport_list as $index => $airport){
		$label = '{ label: "' . $airport['code'] . '     ' . $airport['city'] . ', ' . $airport['country'] . ' - ' . $airport['name'] . '", ';
		$value = ' value: "'$airport['code'] . '   ' . $airport.['city'] . '"}';
		$formatted[] =  $label . $value;
	}
	print $formatted; 

?>
 -->



<?php
print '{label: "apple", key: "Apple"}, {label: "pear", key: "Pear"}' 


?>