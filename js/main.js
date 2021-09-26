import route from './route.js';
import store from './store.js';
import api from "./api.js";

window.onload = async () => {
  const users = await api.fetchRequest('https://jsonplaceholder.typicode.com/users');
  store.state = users;
  window.onpopstate();
};