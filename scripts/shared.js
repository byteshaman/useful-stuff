// Global variable
const navH = document.getElementById("navbar").clientHeight + 5;

document.querySelector('body').style.marginTop = `${navH}px`; // Move body down

// Set target and rel attributes for every external link
document.querySelectorAll('a[href^="http"]').forEach(el => {
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
});
