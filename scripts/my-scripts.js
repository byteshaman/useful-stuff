$(document).ready(function () {

	//add data-toggle="popover" to elem
	function makePoppable(elem) {
		elem.attr('data-toggle', 'popover');
	}

	//make list links open in a new tab
	$('li a').attr('target', '_blank');

	//scan every list link
	$('li a').each(function () {
		var attr = $(this).attr('data-content');
		if (typeof attr !== typeof undefined && attr !== false) { //if link has attribute 'data-content' make it poppable
			makePoppable($(this));
		}
		//NOTE: undefined for some browsers, false for others

		//set data-content to default values for most used links
		//indexOf returns -1 if the string passed as parameter is not found
		if ($(this).attr('href').indexOf('w3') > -1) {
			makePoppable($(this));
			$(this).attr('data-content', 'w3.org');
		}
		if ($(this).attr('href').indexOf('css-tricks') > -1) {
			makePoppable($(this));
			$(this).attr('data-content', 'css-tricks.com');
		}
		if ($(this).attr('href').indexOf('stackoverflow') > -1) {
			makePoppable($(this));
			$(this).attr('data-content', 'stackoverflow.com');
		}
		if ($(this).attr('href').indexOf('github') > -1) {
			makePoppable($(this));
			$(this).attr('data-content', 'github.com');
		}
	});
	
	//personalize the pop effect for poppable elements
	$('[data-toggle="popover"]').popover({
		placement: 'right',
		trigger: 'hover'
	});
});