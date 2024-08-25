import View from './View.js';

class BookmarkView extends View {
  _parentContainer = document.querySelector('.bookmarks__list');
  _errMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    return `
    ${this._data
      .map(
        res => `<li class="preview">
            <a class="preview__link ${
              res.id === id ? 'preview__link--active' : ''
            }" href="#${res.id}">
              <figure class="preview__fig">
                <img src="${res.image}" alt="${res.title}" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${res.title}</h4>
                <p class="preview__publisher">${res.publisher}</p>
              </div>
            </a>
          </li>`
      )
      .join('')}
    `;
  }

  addLoadHandler(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarkView();
