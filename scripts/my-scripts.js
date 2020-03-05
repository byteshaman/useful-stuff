$(document).ready(function () {

	//add data-toggle="popover" to elem
	function makePoppable(elem) {
		elem.attr('data-toggle', 'popover');
		//personalize the pop effect
		elem.popover({
			placement: 'right',
			trigger: 'hover'
		});
	}

	function formatWell(elem) {
		var address = new URL(elem.attr('href'));
		var hostname = address.hostname;
		if (hostname.indexOf('www')>-1) //if hostname contains 'www'
			hostname = hostname.substring(4); //update it removing 'www.'
		return hostname;
	}

	function setDataContent(elem) {
		makePoppable(elem);
		var websiteName = formatWell(elem);
		//set data-content to custom values for most used links
		if (websiteName.indexOf('github.') > -1)
			websiteName = "github";
		else if (websiteName.indexOf('css-tricks') > -1)
			websiteName = "css-tricks.com";
		else if (websiteName.indexOf('w3schools') > -1)
			websiteName = "w3schools";
		else if (websiteName.indexOf('github.') > -1)
			websiteName = "github";

		elem.attr('data-content', websiteName);
	}

	//make list links open in a new tab
	$('li a').attr('target', '_blank');

	//scan every list link which hasn't a 'multi' class
	$('li:not(.multi) a').each(function () {
		var attr = $(this).attr('data-content');
		if (typeof attr !== typeof undefined && attr !== false) { //if link has attribute 'data-content' (undefined works for some browsers, false for others)
			makePoppable($(this)); //make it poppable
		}
		else {
			setDataContent($(this));
		}
		

		
		//indexOf returns -1 if the string passed as parameter is not found
		
	});

	//scan every list link with multi class
	$('li.multi a').each(function () {
		var textVal = formatWell($(this));
		$(this).text(textVal); //assigns the formatted URL value to the link's text
	});


		let navH = $('#navbar').innerHeight();
		$('body').css('margin-top',navH);


});