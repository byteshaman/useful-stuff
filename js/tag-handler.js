export let selectedTags = [];
export const visibleButtons = '.tag-container:not(.hidden) .button-container button'


document.querySelector('body').addEventListener("click",(ev)  => {
  
  const target = ev.target;
  if (target.matches('.button-container button')) {
    const idx = selectedTags.indexOf(target.value);
    updateButtonSelectedClass(target,idx);
    updateSelectedTags(target,idx);
    hideRows(target.value);
    updateActiveButtons();
  }
})

//disable all the buttons that combined with the currently selected ones will produce no result
function updateActiveButtons() {
  const activeRows = document.querySelectorAll('tbody tr:not(.hidden)');
  const buttons = document.querySelectorAll(visibleButtons);

  //contains all the possible tags that will produce at least one result with the currently selected ones
  let activeButtonsTags = []
  activeRows.forEach(row => {
    activeButtonsTags.push(... (getRowTagsArray(row)))
  })
  activeButtonsTags = Array.from(new Set(activeButtonsTags));

  buttons.forEach(button => {
    button.disabled = !activeButtonsTags.includes(button.value)
  })

}

function updateSelectedTags(btn,i) {
  if (i==-1)
    selectedTags.push(btn.value);
  else
    selectedTags.splice(i, 1);
}

function updateButtonSelectedClass(btn,i) {
  if (i==-1)
    btn.classList.add('selected');
  else
    btn.classList.remove('selected');
}

function getRowTagsArray(row) {
  return row.dataset.tags.replaceAll(' ', '').split(',').sort();
}

function hideRows(tag) {
  const rows = document.querySelectorAll('tbody tr');

  rows.forEach(row => {
    //remove spaces between tags and split the strin based on ,
    const tags = getRowTagsArray(row);
    if (!containsAll(selectedTags, tags))
      row.classList.add('hidden');
    else
      row.classList.remove('hidden');
  })
}

function containsAll(arr1, arr2) {
  return arr1.every(elem => arr2.includes(elem));
}

export function clearOnChange() {
  document.querySelector('#search').value='';
  const buttons = document.querySelectorAll(visibleButtons);
  buttons.forEach(btn => {
    btn.classList.remove('selected')
    btn.disabled = false;
  })
  selectedTags = [];
}