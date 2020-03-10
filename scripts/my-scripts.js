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
		hostname = hostname.substring(4); //remove it
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

function moveBodySidebarDown () {
	$('body').css('margin-top',navH);
	$('body').attr('data-offset',navH + 5); //to apply the "active" class properly

	//positioning the navbar's links
	$('#sidebar>nav').css('top',navH); 
}

//every time the user clicks on a link whose href starts with '#', scroll to it keeping in mind the fixed navbar's height
function moveAnchorDown() {
	$('a[href^="#"]').click(function () {
		let target = $($(this).attr('href'));
		let offsetTop = target.offset().top;
		let scrollto = offsetTop - navH;
	$('html, body').animate({scrollTop:scrollto}, 5);
	});
}


//global variable
var navH;

$(document).ready(function () {
	navH = $('#navbar').innerHeight(); //assign navH a value after it's loaded
	moveBodySidebarDown();
	moveAnchorDown();
	

	//make list links, children of #content, and table links open in a new tab; 'rel','noopener' to prevent performance and security issues for _blank (https://web.dev/external-anchors-use-rel-noopener/)
	$('#content li a, td>a').attr({
	'target': '_blank',
	'rel':'noopener'});


	//scan every list link which hasn't a 'multi' class
	$('#sidebarandcontent li:not(.multi) a').each(function () {
		var attr = $(this).attr('data-content');
		if (typeof attr !== typeof undefined && attr !== false) { //if link has attribute 'data-content' (undefined works for some browsers, false for others)
			makePoppable($(this)); //make it poppable
		}
		else {
			setDataContent($(this));
		}
	});

	//scan every list link with multi class
	$('#sidebarandcontent li.multi a').each(function () {
		var textVal = formatWell($(this));
		$(this).text(textVal); //assigns the formatted URL value to the link's text
	});

	$('#swTable').DataTable(
		{
			"sScrollY": "575", //fixed height
      "bScrollCollapse": false, 
			"lengthMenu": [ 15, 50, 75, 100 ] //personalize "Show X entries" menu
		}
	);
});

