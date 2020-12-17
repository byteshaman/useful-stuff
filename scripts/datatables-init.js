$("#datatablesTable").DataTable({
  // Make the table scrollable after the height is > 400px
  "scrollY": 450,
  // Remove "show entries" and pagination info
  "paging": false,
  "bInfo": false,
  // Make second column not orderable
  "columnDefs":
    [
      { "targets": "lang", "orderable": false },
      { "targets": "desc", "orderable": false },
    ],
  "dom": 'ft',
  "language": {
    "search": "",
    "searchPlaceholder": "Search"
  }
});