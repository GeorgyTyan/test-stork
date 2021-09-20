import api from './api.js';
import view from './view.js';

const route = {
  loadHomePage() {
    api
      .fetchRequest('https://jsonplaceholder.typicode.com/users')
      .then(data => {
        view
          .render('/pages/users.html', data)
      });
  },
  loadUserPage(id) {
    api
      .fetchRequest(`https://jsonplaceholder.typicode.com/users/${ id }`)
      .then(data => {
        view
          .render('/pages/user.html', data)
      });
  },
  loadNotFoundPage() {
    view.render('/pages/404.html');
  }
};

window.onpopstate = () => {
  let path = window.location.pathname;
  let id = null;
  if (path !== '/') {
    let arrPath = path.split('/');
    id = arrPath.pop();
    path = arrPath.join('/');
  }
  switch (path) {
    case '/':
      route.loadHomePage();
      break;
    case '/user':
      route.loadUserPage(id);
      break;
    default:
      route.loadNotFoundPage();
      break;
  }
};

window.onLinkClick = (path) => {
  history.pushState({}, path, window.location.origin + path);
  window.onpopstate();
};

export default route;
