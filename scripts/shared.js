// Global variable
export let navH = document.getElementById("navbar").clientHeight;

// Move body down based on #navbar's height
document.querySelector('body').style.marginTop = `${navH}px`; 

// External links in new tab
document.querySelectorAll('a[href ^= "http"]').forEach(el => {
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
});


// Add classes to body
document.querySelector('body').classList.add('bg-seconday'); 



