import View from './View.js';
import images from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentContainer = document.querySelector('.pagination');

  addEventsForPageClick(handler) {
    this._parentContainer.addEventListener('click', function (e) {
      const targetEl = e.target.closest('.btn--inline');
      if (!targetEl) return;
      console.log(targetEl.dataset.pageNo);

      handler(Number(targetEl.dataset.pageNo));
    });
  }

  _generateMarkup() {
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // 1 page and more than 10 results
    if (
      this._data.page === 1 &&
      this._data.results.length > this._data.resultsPerPage
    ) {
      return `<button class="btn--inline pagination__btn--next" data-page-no=${
        this._data.page + 1
      }>
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${images}#icon-arrow-right"></use>
            </svg>
          </button>`;
    }

    // 1 page and no more results
    if (
      this._data.page === 1 &&
      this._data.results.length <= this._data.resultsPerPage
    ) {
      return '';
    }

    // Last page
    if (
      this._data.page === numOfPages &&
      this._data.results.length > this._data.resultsPerPage
    ) {
      return `<button class="btn--inline pagination__btn--prev" data-page-no=${
        this._data.page - 1
      }>
            <svg class="search__icon">
              <use href="${images}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>`;
    }

    // Any other page
    if (
      this._data.page !== 1 &&
      this._data.results.length > this._data.resultsPerPage
    ) {
      return `
        <button class="btn--inline pagination__btn--prev" data-page-no=${
          this._data.page - 1
        }>
            <svg class="search__icon">
              <use href="${images}#icon-arrow-left"></use>
            </svg>
            <span>Page ${this._data.page - 1}</span>
          </button>
      
          <button class="btn--inline pagination__btn--next" data-page-no=${
            this._data.page + 1
          }>
            <span>Page ${this._data.page + 1}</span>
            <svg class="search__icon">
              <use href="${images}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }
  }
}

export default new PaginationView();
