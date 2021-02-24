// Dynamycally set default column to be ordered
let colNum = 0;
const pageURL = location.href
if (pageURL.includes('link-4-devs')) { //in link-4-devs page default order column is 2nd because of language col
  colNum = 1;
}

// Add tags column
//append th element with 'Tags' text in table thead
const th = document.createElement('th');
th.textContent = 'Tags';
th.classList.add("tags")
document.querySelector('thead tr').appendChild(th);
//append 
document.querySelectorAll('tbody tr').forEach((el) => {
  //split the array based on , then trim spaces, then sort the array and finally creates an ordered string
  let tagsString = (el.dataset.tags)
      .split(',') //split string
      .map(str => str.trim()) //remove space
      .map(str => document.querySelector(`button[value=${str}]`).textContent.toLowerCase()) //
      .sort()
      .join(', ');
  const td = document.createElement('td');
  td.textContent = tagsString;
  el.appendChild(td);
});

$("#datatablesTable").DataTable({
  // Make the table scrollable after the height is > 450px
  "scrollY": 450,
  // Remove pagination (to allow scrolling)
  "paging": false,
  // Make proper columns not orderable (based on class on TH element)
  "columnDefs":
  [
    { "targets": ["lang", "desc", "tags"], "orderable": false },
  ],
  // Set default ordering column
  "order": [[colNum, 'asc']],
  // Show only search bar (which will occupy all the space available)
  "dom": 'ft',
  // Put search as placeholder of searchbar
  "language": {
    "search": "",
    "searchPlaceholder": "Search"
  }
});

// Set the width of the searchbar to 100% 
$('div.dataTables_filter input').addClass('w-100');