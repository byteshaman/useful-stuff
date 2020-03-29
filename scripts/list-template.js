// Format element removing www.
function formatWell(elem) {
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
		let target = $($(this).attr('href'));
		let offsetTop = target.offset().top;
		let scrollto = offsetTop - navH;
	$('html, body').animate({scrollTop:scrollto}, 5);
	});
}


function moveSidebarDown () {
  $('body').attr('data-offset',navH + 5); //to properly apply the "active" class properly to main category 1 on page load

	//positioning the navbar's links
	$('#sidebar>nav').css('top',navH); 
}

// Scan every list link with multi class and set its content

function scanMultiLi() {  
  $('#sidebarandcontent li.multi a').each(function () {
    var textVal = formatWell($(this));
    $(this).text(textVal); //assigns the formatted URL value to the link's text
  });
}

/** Scan every list link that has not multi class:
 * if it has a data-content value, make it poppable
 * else set a proper data-content for it
*/ 
function scanNotMultiLi() {
  $('#sidebarandcontent li:not(.multi) a').each(function () {
    var attr = $(this).attr('data-content');
    if (typeof attr !== typeof undefined && attr !== false) {
      makePoppable($(this)); //make it poppable
    }
    else {
      setDataContent($(this));
    }
  });
}

// Set the data-content attribute of elem to a custom one for specific websites, used for websites that appear many times 
function setDataContent(elem) {
	makePoppable(elem);
	let websiteName = formatWell(elem);
	//set data-content to custom values for most used links
	if (websiteName.indexOf('github.') > -1)
		websiteName = "github";
	else if (websiteName.indexOf('css-tricks') > -1)
		websiteName = "css-tricks.com";
	else if (websiteName.indexOf('w3schools') > -1)
		websiteName = "w3schools";
	elem.attr('data-content', websiteName);
}


function targetBlankForContentLiLinks() {
  $('#content li a').attr({
    'target': '_blank',
    'rel':'noopener'});
}
  
$(document).ready(function () {
  moveAnchorDown();
  moveSidebarDown ();
  targetBlankForContentLiLinks();
  scanMultiLi();
  scanNotMultiLi();
});