

const loadDiv = document.createElement('div');
loadDiv.id = 'loader';
document.querySelector('body').prepend(loadDiv);

loadDiv.style.position = 'fixed';
loadDiv.style.width = '100%';
loadDiv.style.height = '100vh';
loadDiv.style.zIndex = '2000'; //bootstrap navbar is 1030
loadDiv.style.background = `#161519 url('../imgs/loading.gif') no-repeat center`;

