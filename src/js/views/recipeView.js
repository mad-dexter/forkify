// Import the image svg file so that it can get the url of the build path of the svg file
import images from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';
import View from './View.js';

class RecipieView extends View {
  _parentContainer = document.querySelector('.recipe');

  // Add an event listener to listen for hash changes i.e. change in URL of application. Then get the hash to show the actual item in the section
  // Also add an load event listner which will also trigger when someone copies the url with hashid to load the item directly
  // Event Listener should be part of View and not controller. Also in order to call the handling method from controller we need to use the Publisher Subscriber model, where the View is the publisher and the controller is the subscriber which passes the method to be called on action.

  addEventForLoad(handler) {
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  }

  addEventForServingButton(handler) {
    this._parentContainer.addEventListener('click', function (e) {
      const targetEl = e.target.closest('.btn--tiny');
      if (!targetEl) return;
      // Also if next serving is marked as zero dont update any ingredients
      if (Number(targetEl.dataset.nextServing) === 0) return;

      // If proper elemnt is clicked then increase of decrease the amount
      handler(Number(targetEl.dataset.nextServing));
    });
  }

  addEventForBookMark(handler) {
    this._parentContainer.addEventListener('click', function (e) {
      const targetEl = e.target.closest('.btn--bookmark');
      if (!targetEl) return;

      handler();
    });
  }

  _generateMarkup() {
    return `
  <figure class="recipe__fig">
          <img src="${this._data.image}" alt="Image of ${
      this._data.title
    }" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>

        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${images}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${images}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>

            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--increase-servings" data-next-serving=${
                this._data.servings - 1
              }>
                <svg>
                  <use href="${images}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--increase-servings" data-next-serving=${
                this._data.servings + 1
              }>
                <svg>
                  <use href="${images}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${images}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${images}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>

        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients
            .map(
              rec =>
                `
            <li class="recipe__ingredient">
              <svg class="recipe__icon">
                <use href="${images}#icon-check"></use>
              </svg>
              <div class="recipe__quantity">${
                rec.quantity ? new Fraction(rec.quantity).toString() : ''
              }</div>
              <div class="recipe__description">
                <span class="recipe__unit">${rec.unit}</span>
                ${rec.description}
              </div>
            </li>`
            )
            .join('')}
          </ul>
        </div>

        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">The Pioneer Woman</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="http://thepioneerwoman.com/cooking/pasta-with-tomato-cream-sauce/"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${images}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>
  `;
  }
}

export default new RecipieView();
