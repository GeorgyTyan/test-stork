const app = document.getElementById('app');
const view = {
  async render(tplPath, state = {}, options = {}) {
    let tpl = '';
    let pagination = null;
    try {
      const response = await fetch(tplPath);
      if (response.ok) {
        tpl = await response.text();

        if (Object.prototype.hasOwnProperty.call(options, 'paginate')) {
          let paginationResponse = await this._makePagination(state, options);
          state = paginationResponse.state;
          pagination = paginationResponse.pagination;
        }
        let parseForResult = this._parseFor(tpl, state);
        tpl = parseForResult || this._parseVars(tpl, state);
      } else {
        tpl = 'Шаблон не найден.'
      }
    } catch (error) {
      throw error;
    }
    app.innerHTML = tpl;
    if (pagination) {
      const paginationElem = document.querySelector(options.selector);
      console.log("#### paginationElem:", paginationElem);
      paginationElem.innerHTML = pagination;
    }
    const spaLinks = document.querySelectorAll('.spa-link');
    for (let link of spaLinks) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  },

  async _makePagination(state, options) {
    let { currentPage } = options;
    const chunk = (arr, size) =>
      Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
      );
    let chunkedState = chunk(state, 4);
    currentPage = currentPage - 1 < 0 || currentPage > chunkedState.length ? 0 : currentPage - 1;
    state = chunkedState[currentPage];
    let pagination = '';
    const response = await fetch('components/pagination.html');
    if (response.ok) {
      let tpl = await response.text();
      for (let i = 0; i < chunkedState.length; i++) {
        let page = i + 1;
        let activeClass = 'active';
        let state = { page };
        if (currentPage === i) {
          state.active = activeClass;
        }
        pagination += this._parseVars(tpl, state);
      }
    }
    return { state, pagination };
  },

  _parseVars(tpl, state) {
    const tplVars = /\{\{(.*?)\}\}/g;
    let match = null;
    while (match = tplVars.exec(tpl)) {
      const tplVarNames = match[1].trim();
      if (!tplVarNames) {
        continue;
      }
      let stateVar = this._getStateVars(tplVarNames, state);
      if (!stateVar) stateVar = '';
      tpl = tpl.replace(new RegExp(match[0], 'gi'), stateVar);
    }
    return tpl;
  },

  _parseFor(tpl, state) {
    const forBlockRegex = /\{\% for ([\S\s]*?)endfor \%\}/gm;
    const matchedForBlock = tpl.match(forBlockRegex);
    if (!matchedForBlock) return;
    const forBlock = matchedForBlock[0].trim().replace(/\{\%(.*?)\%\}/gm, '');
    let parsedTpl = '';
    for (let item of state) {
      parsedTpl += this._parseVars(forBlock, item);
    }
    return tpl.replace(forBlockRegex, parsedTpl);
  },

  _getStateVars(tplVarNames, state) {
    let arrTplVarNames = tplVarNames.split('.');
    if (arrTplVarNames.length > 1) {
      state = state[arrTplVarNames[0]];
      arrTplVarNames.shift();
      state = this._getStateVars(arrTplVarNames.join('.'), state);
    } else {
      state = state[arrTplVarNames[0]];
    }
    return state;
  }
};

export default view;