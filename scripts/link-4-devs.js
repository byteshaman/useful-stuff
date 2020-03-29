// Global variable
let listObj = {}
let trToShow = new Array();
let filtersArr = new Array();

// EVENT LISTENER
function eventListener() {
  $('#tagContainer button').click( function() {
    // Toggle class of clicked button
    $(this).toggleClass('selected');
    addRemoveFiltersArr($(this)); // Calls populateLiToShow and disableUselssButtons
  });
}

// Add or remove tag from filtersArr
function addRemoveFiltersArr(btn) {
  // Get the text of the button pressed, minus '#' to avoid problems with jQuery selectors
  let tagName = btn.text().substr(1).toLowerCase();
  // Check if filtersArr contains the tag
  let i = filtersArr.indexOf(tagName);
  // Add tag if it's not already there
  if (i === -1) {
    filtersArr.push(tagName);
  }
  else {
    // Remove tag if it's already there (remove at i index, 1 time)
    filtersArr.splice(i, 1);
  }
  populateTrToShow(); // Calls containsAll and hideAllTr, and if needed displayFilteredTr
}

// Display filtered Tr
function displayFilteredTr() {
  for (elem of trToShow) {
    elem.css('display','table-row');
  }
}

// Hide every tr of table's body
function hideAllTr () {
  $('#l4dTable tbody > tr').css('display','none');  
}

// Initialize DataTable
function initDataTable() {
  $('#l4dTable').DataTable(
    {
      // Make the table scrollable
      "scrollY": 400,
      "paging": false,
      "autoWidth": true,
      // Make first column not orderable
      "columnDefs": [
              { "targets": 0, "orderable": false },
              { "targets": 0, "width": "30px" }
      ],
      // Make the second column (Name) the default one for ordering
      "order": [[ 1, "asc" ]],
      // Remove "show entries" info
      "bInfo" : false
    }
  );
}


// Make an object like: idx: {tags: [tag1, tag2], tr: trElem }
function populateListObj() {
  // For each tr in the table body
  $('#l4dTable tbody > tr').each( function(idx) {
    // Add its tag and the element itself to the object
    listObj[idx] = {
      tags : $(this).attr('data-tags').split(', '), 
      tr : $(this)
    };
  });
}

// Populate the array trToShow with tr elements based on user's chosen tags
//! NEWWWWWWWWWWWWWWWWWWWWWWWWWW
function populateTrToShow() {
  // Clear existing elements
  trToShow = [];
  // Keep tracks of how many li elements are being displayed
  let count = 0;
  // For every key in listObj
  for (let key in listObj) {
    // Put tags (which is an array) in trObjectTagArray
    let trObjectTagArray = listObj[key].tags;
    // If the processed element's tag array contains every "filter" tag then add the element (the tr itself) to trToShow
    if (containsAll (filtersArr, trObjectTagArray)) {
      trToShow.push(listObj[key].tr)
      count ++;
    }
  }
  hideAllTr(); 
  if (count !== 0) {
    displayFilteredTr();
  }
}

//* Style the buttons by adding them classes
function styleButtons() {
  $('#tagContainer button').addClass('btn my-1 my-btn');
}

// Check if arr1 contains every element of arr2
function containsAll(arr1, arr2){
  return arr1.every(elem => arr2.includes(elem));
}


$(document).ready( function() {
  styleButtons();
  populateListObj()
  eventListener();
  initDataTable();
})

