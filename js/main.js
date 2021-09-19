import api from './api.js';
import view from './view.js';


api
  .fetchRequest('https://jsonplaceholder.typicode.com/users')
  .then(data => {
    view
      .render('/pages/users.html', data)
      .then(() => {
        const pageLinks = document.querySelectorAll('.spa-link');
        for (let link of pageLinks) {
          link.addEventListener('click', (e) => {
            e.stopImmediatePropagation();
          });
          console.log('#### link:', link);
        }
      });
  });

const onNavClick = (pathname) => {
  console.log('#### pathName:', pathname);
  window.history.pushState({}, pathname, window.location.origin + pathname);
};

/**
 * The Function is invoked when the window.history's state changes
 */
window.onpopstate = () => {
  // app.innerHTML = routes[window.location.pathname];
};

