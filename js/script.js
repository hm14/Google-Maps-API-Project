<!doctype html>
<html lang="en">

	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" type="text/css" href="css/styles.css">
		<link rel="stylesheet" type="text/css" src="//normalize-css.googlecode.com/svn/trunk/normalize.css">
		<title>Study Sites</title>
	</head>

	<body>
		<container class="container">
			<section class="content">
				<div class="menu">
					<h3 id="title">
						Study Sites
					</h3>

					<form id="input-form">
<!-- <input id="input" placeholder="Search…" type="input" data-bind="textInput: query, valueUpdate: 'keydown'" autocomplete="off"></input>						 -->
						<!-- <input type="input" name="filter" data-bind="textInput: query, valueUpdate: 'keydown'" id="filter-box" placeholder="Enter search term..." > </input> -->
						<input type="input" name="filter" id="filter-box" placeholder="Enter search term..." > </input>
						<!-- Filter<br> -->
					</form>

					<ul data-bind="foreach: locationList" id="location-list">
						<li data-bind= "text: name, click: $parent.setLocation"></li>
					</ul>

					<div data-bind="with: currentLocation()" id="location">
						<div data-bind="text: name" id="location-name"></div>
						<img src="" alt="Library building" data-bind="attr: {src: imgUrl}" id="location-image">
						<div data-bind="text: streetAddress" id="location-address"></div>
						<div data-bind="text: cityAndZip" id="location-address"></div>
					</div>
					<br><br><br><br><br>
						<!-- <br><br><br><br><br><br><br> -->
				</div>
				<div class="map" id="map">
				</div>
			</section>

		</container>
		<script src="lib/knockout-3.4.2.js"></script>
		<script src="js/script.js"></script>
		<script async defer 
			src="https:maps.googleapis.com/maps/api/js?key=AIzaSyC4lwXmrA4ZGdXqhBAz16tHtsqKqxfrbpE&v=3&callback=initMap">
		</script>
	</body>
</html>
