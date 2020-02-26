$(document).ready(function () {
	$('li a').attr({
		data-toggle: 'popover',
		target: '_blank'
	});

	$('[data-toggle="popover"]').popover({
		placement: 'right',
		trigger: 'hover'
	});
});