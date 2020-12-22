// Dynamycally set default column to be ordered
let colNum = 0;
const pageURL = location.href
if (pageURL.includes('link-4-devs')) { //I'm in link-4-devs page default order column is 1st (Name)
  colNum = 1;
}

$("#datatablesTable").DataTable({
  // Make the table scrollable after the height is > 450px
  "scrollY": 450,
  // Remove pagination (to allow scrolling)
  "paging": false,
  // Make proper columns not orderable (based on class on TH element)
  "columnDefs":
  [
    { "targets": ["lang", "desc"], "orderable": false },
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