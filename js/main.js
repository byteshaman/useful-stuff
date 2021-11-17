import { fw, l4d, us  } from './lists.js';
import { clearOnChange } from './tag-handler.js';


// Menu click
document.querySelector('nav').addEventListener('click', (ev) => {
  const el = ev.target;
  if (el.matches('a')) {
    const id = `${el.id}_tags`;
    clearOnChange();
    menuClickHandler(id, el.id);
  }
});


function menuClickHandler(tagContainerId, linkId) {
  // Show/hide tag div
  document.querySelectorAll('#container>div.tag-container').forEach(div => {
    const op = div.id == tagContainerId ? 'remove' : 'add';
    div.classList[op]('hidden');
  })
  // Set menu button to active
  document.querySelectorAll('nav>a').forEach(a => {
    const op = a.id == linkId ? 'add' : 'remove';
    a.classList[op]('active');
  })

  // Delete all nodes and instantiate proper list
  document.querySelector('tbody.list').replaceChildren();
  switch (linkId) {
    case 'l4d':
      new List('list', options, l4d);
      break;
    case 'us':
      new List('list', options, us);
      break;
    case 'fw':
      new List('list', options, fw);
      break;
  }
}

// Initialise lists
const options = {
  valueNames: ['name', 'url', 'description', 'tags'],
  item: function (val) {
    return `<tr data-tags="${val.tags}">
              <td ><a class="name" href="${val.url}" target="_blank">${val.name}</a></td>
              <td class="description">${val.description}</td>
              <td class="tags">${val.tags}</td>
            </tr>`
  }
}
new List('list', options, l4d);