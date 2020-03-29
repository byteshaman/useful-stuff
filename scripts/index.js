// Add proper classes to every card
function setCardClasses() {
 $('.card').addClass('my-3 mx-3 py-3 px-2');
 $('.card').css({
  'width' : '250px',
  'height' : '200px',
  'background-color': '#212529'
});
}

// Add proper CSS to every card
function setCardCSS() {
  $('.card').css({
   'width' : '250px',
   'height' : '200px'
 });
 }

// Set proper bg and text color to every button
function setButtonStyle() {
  $('.btn').css({
    'background-color' : 'black',
    'color' : 'white'
  });
 }

 // Add proper classes to every card
function setRowClasses() {
  $('#cardRowContainer > .row').addClass('d-flex justify-content-center');
 }
 

$(document).ready(function () {
  setCardClasses();
  setCardCSS();
  setButtonStyle();
  setRowClasses();
});