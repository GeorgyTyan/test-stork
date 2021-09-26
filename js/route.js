import view from './view.js';
import store from './store.js';

const route = {
  loadHomePage() {
    const users = store.state;
    view.render('/pages/users.html', users)
  },
  loadUserPage(id) {
    const user = store.state.find(item => item.id === id);
    view.render('/pages/user.html', user)
  },
  loadNotFoundPage() {
    view.render('/pages/404.html');
  }
};

window.onpopstate = () => {
  let path = window.location.pathname;
  let param = null;
  if (path !== '/') {
    let arrPath = path.split('/');
    param = parseInt(arrPath.pop());
    path = arrPath.join('/');
  }
  switch (path) {
    case '/':
      route.loadHomePage();
      break;
    case '/user':
      route.loadUserPage(param);
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
