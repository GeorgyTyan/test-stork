const app = document.getElementById('app');
const view = {
  async render(tplPath, context = {}) {
    let tpl = '';
    try {
      const response = await fetch(tplPath);
      if (response.ok) {
        tpl = await response.text();
        let parseForResult = this._parseFor(tpl, context);
        tpl = parseForResult || this._parseVars(tpl, context);
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

  _parseVars(tpl, context) {
    const tplVars = /\{\{(.*?)\}\}/g;
    let match = null;
    while (match = tplVars.exec(tpl)) {
      const tplVarNames = match[1].trim();
      if (!tplVarNames) {
        continue;
      }
      let contextVar = this._getContextVars(tplVarNames, context);
      tpl = tpl.replace(new RegExp(match[0], 'gi'), contextVar);
    }
    return tpl;
  },

  _parseFor(tpl, context) {
    const forBlockRegex = /\{\% for ([\S\s]*?)endfor \%\}/gm;
    const matchedForBlock = tpl.match(forBlockRegex);
    if (!matchedForBlock) return;
    const forBlock = matchedForBlock[0].trim().replace(/\{\%(.*?)\%\}/gm, '');
    let parsedTpl = '';
    for (let item of context) {
      parsedTpl += this._parseVars(forBlock, item);
    }
    return tpl.replace(forBlockRegex, parsedTpl);
  },

  _getContextVars(tplVarNames, context) {
    let arrTplVarNames = tplVarNames.split('.');
    if (arrTplVarNames.length > 1) {
      context = context[arrTplVarNames[0]];
      arrTplVarNames.shift();
      context = this._getContextVars(arrTplVarNames.join('.'), context);
    } else {
      context = context[arrTplVarNames[0]];
    }
    return context;
  }
};

export default view;