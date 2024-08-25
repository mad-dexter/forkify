import View from './View.js';
import images from 'url:../../img/icons.svg';

class ResultsView extends View {
  _parentContainer = document.querySelector('.results');

  _generateMarkup() {
    const id = window.location.hash.slice(1);
    console.log(this._data);
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
              <div class="recipe__user-generated ${res.key ? '' : 'hidden'}">
                <svg>
                  <use href="${images}#icon-user"></use>
                </svg>
              </div>
            </a>
          </li>`
      )
      .join('')}
    `;
  }
}

export default new ResultsView();
