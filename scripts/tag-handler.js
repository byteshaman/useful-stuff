// Global variable
let listObj = {}
let trToShow = new Array();
let filtersArr = new Array();

// Add or remove tag from filtersArr
function addRemoveFiltersArr(btn) {
  // Get the value of the pressed button
  let tagName = btn.val();
  
  // Check if filtersArr contains the tag
  let i = filtersArr.indexOf(tagName);
  // Add tag if it's not already there, remove tag if it's already there (remove at i index, 1 time)
  i === -1 ? filtersArr.push(tagName) : filtersArr.splice(i, 1);
  populateTrToShow(filtersArr); // Calls containsAll and hideAllTr, and if needed displayFilteredTr
}

// Check if arr2 contains every element of arr1
function containsAll(arr1, arr2){
  return arr1.every(elem => arr2.includes(elem));
}

// Disable buttons that would produce an empty result
function disableButtons ()  {
  let filtersArrPlus = filtersArr;
  // For every not active button
  $('button:not(.selected)').each(function() {
    let count = 0;
    let btnVal = $(this).val();
    filtersArrPlus.push(btnVal);
    // For every key in listObj
    for (let key in listObj) {
      // Put tags (which is an array) in trObjectTagArray
      let trObjectTagArray = listObj[key].tags;
      // If the processed element's tag array contains every "filter" tag then increase count
      if (containsAll (filtersArrPlus, trObjectTagArray)) {
        count ++;
      }
    }
    if (count === 0) {
      $(this).prop('disabled', true);
    }
    else {
      $(this).prop('disabled', false);
    }
    // Remove the last element added
    filtersArrPlus.pop();
  });
}

// Display filtered Tr
function displayFilteredTr() {
  for (const elem of trToShow) {
    elem.css('display','table-row');
  }
}

// EVENT LISTENER: button click inside event listener
function eventListener() {
  $('#tagContainer button').click(function() {
    // Toggle class of clicked button
    $(this).toggleClass('selected');
    addRemoveFiltersArr($(this)); // Calls populateLiToShow
    disableButtons(); // Check if any button needs to be disabled because it would produce no results if combined with current tags in filtersArr
  });
}

// Hide every tr of table's body
function hideAllTr () {
  $('tbody > tr').css('display','none');  
}


// Make an object like: idx: {tags: [tag1, tag2], tr: trElem }
function populateListObj() {
  // For each tr in the table body
  $('table tbody > tr').each( function(idx) {
    // Add its tag and the element itself to the object
    listObj[idx] = {
      tags : $(this).attr('data-tags').split(', '), 
      tr : $(this)
    };
  });
}

// Populate the array trToShow with tr elements based on user's chosen tags
function populateTrToShow() {
  // Clear existing elements
  trToShow = [];
  // For every key in listObj
  for (let key in listObj) {
    // Put tags (which is an array) in trObjectTagArray
    let trObjectTagArray = listObj[key].tags;
    // If the processed element's tag array contains every "filter" tag then add the element (the tr itself) to trToShow
    if (containsAll (filtersArr, trObjectTagArray)) {
      trToShow.push(listObj[key].tr)
    }
  }
  hideAllTr(); 
  displayFilteredTr(); // There will always be at least one displayed items thanks to disableButtons()
}

// Add classes to card body and button
function addClasses() {
  $('#tagContainer button').addClass('btn my-1 my-btn');
  $('#tagContainer .card-body').addClass('p-0');;
  document.querySelector('#tagContainer').classList.add('row', 'text-center', 'mt-2', 'd-none', 'd-md-flex', 'justify-content-center');
}


$(document).ready( function() {
  addClasses();
  populateListObj()
  eventListener();
})

