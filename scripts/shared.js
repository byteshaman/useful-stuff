// Global variable
export let navH = document.getElementById("navbar").clientHeight;


// Move body down based on #navbar's height
function moveBodyDown() {
	$('body').css('margin-top',navH);
}

function targetBlankForExternalLinks() {
	$('a[href^="http"]').attr({
		'target': '_blank',
		'rel': 'noopener noreferrer'});
}

function setBodyBgColor() {
	$('body').addClass('bg-secondary');
}


$(document).ready(function () {
	moveBodyDown();
	setBodyBgColor();
	targetBlankForExternalLinks();
});



