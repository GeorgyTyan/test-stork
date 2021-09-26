const app = document.getElementById('app');
const view = {
  async render(tplPath, state = {}) {
    let tpl = '';
    try {
      const response = await fetch(tplPath);
      if (response.ok) {
        tpl = await response.text();
        let parseForResult = this._parseFor(tpl, state);
        tpl = parseForResult || this._parseVars(tpl, state);
      } else {
        tpl = 'Шаблон не найден.'
      }
    } catch (error) {
      throw error;
    }
    app.innerHTML = tpl;
    const spaLinks = document.querySelectorAll('.spa-link');
    for (let link of spaLinks) {
      link.addEventListener('click', (e) => {
        e.preventDefault();
      });
    }
  },

  _parseVars(tpl, state) {
    const tplVars = /\{\{(.*?)\}\}/g;
    let match = null;
    while (match = tplVars.exec(tpl)) {
      const tplVarNames = match[1].trim();
      if (!tplVarNames) {
        continue;
      }
      let stateVar = this._getstateVars(tplVarNames, state);
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

  _getstateVars(tplVarNames, state) {
    let arrTplVarNames = tplVarNames.split('.');
    if (arrTplVarNames.length > 1) {
      state = state[arrTplVarNames[0]];
      arrTplVarNames.shift();
      state = this._getstateVars(arrTplVarNames.join('.'), state);
    } else {
      state = state[arrTplVarNames[0]];
    }
    return state;
  }
};

export default view;