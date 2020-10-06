// Global variable
let navH;

// Move body down based on #navbar's height
function moveBodyDown() {
	$('body').css('margin-top',navH);
}

function targetBlankForExternalLinks() {
	$('a[href^="http"]').attr({
		'target': '_blank',
		'rel': 'noopener'});
}

function setBodyBgColor() {
	$('body').addClass('bg-secondary');
}


$(document).ready(function () {
	navH = $('#navbar').innerHeight(); //assign navH a value after it's loaded
	moveBodyDown();
	setBodyBgColor();
	targetBlankForExternalLinks();
});



