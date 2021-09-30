import view from './view.js';
import store from './store.js';

const route = {
  loadHomePage(param) {
    const users = store.state;
    const renderOptions = {
      paginate: true,
      selector: '.users-pagination',
      itemsPerPage: 4,
      currentPage: param.page,
    };
    console.log("#### renderOptions:", renderOptions);
    view.render('/pages/users.html', users, renderOptions);
  },
  loadUserPage(param) {
    const user = store.state.find(item => item.id === param.id);
    view.render('/pages/user.html', user)
  },
  loadNotFoundPage() {
    view.render('/pages/404.html');
  }
};

window.onpopstate = () => {
  let path = window.location.pathname;
  let param = path.match('[^\\/]+$');
  if (param !== null) param = parseInt(param[0]);
  let arrPath = path.split('/');
  arrPath.pop();
  path = arrPath.join('/') === '' ? '/' : arrPath.join('/');
  switch (path) {
    case '/':
      route.loadHomePage({ page: param });
      break;
    case '/user':
      route.loadUserPage({ id: param });
      break;
    default:
      route.loadNotFoundPage();
      break;
  }
};

window.onLinkClick = (path) => {
  if (path === 'back') {
    history.back();
    return;
  }
  history.pushState({}, path, window.location.origin + path);
  window.onpopstate();
};

export default route;
