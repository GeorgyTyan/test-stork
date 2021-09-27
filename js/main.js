import route from './route.js';
import store from './store.js';
import api from "./api.js";

window.onload = async () => {
  store.state = await api.fetchRequest('https://jsonplaceholder.typicode.com/users');
  window.onpopstate();
};
