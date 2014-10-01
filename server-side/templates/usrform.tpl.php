<html>
	<head>
		<meta charset="UTF-8">
		<title><?php echo $this->eprint($this->title); ?></title>
		<link href="../../../../client-side/styles.css" rel="stylesheet" type="text/css">
		<link href="../../../../client-side/jquery-ui-1.10.3-2.custom/css/custom-theme/jquery-ui-1.10.3.custom.min.css" rel="stylesheet" type="text/css">
		<script type="text/javascript">
    		phpVars = new Array();
    		<?php
        	echo 'phpVars.push("' . $this->mdy_from_date . '");';
        	echo 'phpVars.push("' . $this->mdy_until_date . '");';
        	echo 'phpVars.push("' . $this->threshold . '");';
        	echo 'phpVars.push("' . $this->notify_phone . '");';
        	echo 'phpVars.push("' . $this->id . '");';
    	?>
		</script>
		<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
		<script type="text/javascript" src="../../../../client-side/jquery-ui-1.10.3-2.custom/js/jquery-ui-1.10.3.custom.min.js"></script>
		<script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js"></script>
		<script type="text/javascript" src="../../../../client-side/templates/scripts/tpl_view.js"></script>
		<script type="text/javascript" src="../../../../client-side/templates/scripts/tpl_form_functions.js"></script>
		<script type="text/javascript" src="../../../../client-side/scripts/Go.js"></script>
	
	</head>
	<body>

		<div id="content">
			<div id="logo"></div>
			<form id="main_form" class="fixed_data">
				<fieldset id="main_fieldset">
					<label for="email">
						<p>Email |  <span class="php_data"><?php echo $this->eprint($this->email); ?></span></p>
					</label>
					<hr id="email_line">
					<label for="depart_from">
						<p>Depart from |  <span class="php_data"><?php echo $this->eprint($this->depart_from); ?></span></p>
					</label>
					
					<label for="arrive_at">
						<p>Arrive at |   <span class="php_data"><?php echo $this->eprint($this->arrive_at); ?></span></p>
					</label>
					<hr id="deparr_line">
					<label for="from_date" class="rmafter">
						<p>Search from |   <span class="php_data chngble"><?php echo $this->eprint($this->from_date); ?></span></p>
					</label>
					<label for="until_date" class="rmafter">
						<p>Until |   <span class="php_data chngble"><?php echo $this->eprint($this->until_date); ?></span></p>
					</label>
					<hr id="date_line">
					<label id="threshold_label" for="threshold" class="rmafter">
						<p>Threshold | <span style="color: #999;">$</span><span class="php_data chngble"><?php echo $this->eprint($this->threshold); ?></span></p>
					</label>
					<hr id="thresh_line">
					<div id="notify_phone" class="rmafter">
						<p>Notify via | <span class="php_data chngble"><?php if ($this->notify_phone == 1 ) echo "Text"; else echo "Email";?></span></p>
					</div>
				</fieldset>
				<fieldset id="submit_fieldset">
					<span id="button_place"><button id="make_changes" class="chngble" type="submit" title="make_changes">Make Changes</button>
					<button id="remove" class="chngble" type="submit" title="remove">Remove</button></span>
				</fieldset>
			</form>
		</div>
	</body>
</html>