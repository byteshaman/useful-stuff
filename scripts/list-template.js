import {navH} from './shared.js';

// Format element removing www.
function removeWWW(elem) {
	let address = new URL(elem.attr('href'));
	let hostname = address.hostname;
	if (hostname.indexOf('www')>-1) //if hostname contains 'www'
		hostname = hostname.substring(4); //remove it
	return hostname;
}

// Add data-toggle="popover" to elem	
function makePoppable(elem) {
	elem.attr('data-toggle', 'popover');
	// Personalize the pop effect: show it on the right when the user hovers on it
	elem.popover({
		placement: 'right',
		trigger: 'hover'
	});
}

// Every time the user clicks on a link whose href starts with '#', scroll to it keeping in mind the fixed navbar's height
function moveAnchorDown() {
	$('a[href^="#"]').click(function () {
		// For elements whose href is only '#'
		if ($(this).attr('href').length == 1) {return;}

		// Set the target to be the link on on which the user has clicked (escape '.' if the id contains it)
		let target = $($(this).attr('href'));
		
		// Get the offset position for the target
		let offsetTop = target.offset().top;
		let scrollto = offsetTop - navH;
		$('html, body').animate({scrollTop:scrollto}, 5);
	});
}


function moveSidebarDown () {
  $('body').attr('data-offset',navH + 5); // To properly apply the "active" class to main category 1 when the scrollbar is on top
	// Position the sidebar's links
	$('#sidebar>nav').css('top',navH); 
}

/** Scan every list link: 
 * if item has multi class and set its content
 * if item has not multi class:
 * if it has a data-content value, make it poppable
 * else set a proper data-content for it
 * 
 * */ 
function scanLiElems() {  
  $('#content li a').each(function () {
		if ($(this).parent().hasClass('multi')) {
			let textVal = removeWWW($(this));
			$(this).text(textVal); //assigns the formatted URL value to the link's text
		}
		else {
			let attr = $(this).attr('data-content');
			if (typeof attr !== typeof undefined && attr !== false) {
				makePoppable($(this)); //make it poppable
			}
			else {
				setDataContent($(this));
			}
		}
	});
}

// Set the data-content attribute of elem to a custom one for specific websites, the idea is to use this function for websites that are used many times
function setDataContent(elem) {
	makePoppable(elem);
	let websiteName = removeWWW(elem);
	// Set data-content to custom values for most used links: e.g. if the name contains github. then data-content will be just "github"
	if (websiteName.indexOf('github.') > -1)
		websiteName = "github";
	elem.attr('data-content', websiteName);
}

  
$(document).ready(function () {
  moveAnchorDown();
  moveSidebarDown ();
  scanLiElems();
});