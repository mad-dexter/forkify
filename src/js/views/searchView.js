class SearchView {
  #parentElement = document.querySelector('.search');

  getSearchTerm() {
    const query = document.querySelector('.search__field').value;
    this.#clearSearchTerm();
    return query;
  }

  #clearSearchTerm() {
    document.querySelector('.search__field').value = '';
  }

  addEventForSearch(handler) {
    this.#parentElement.addEventListener('submit', handler);
  }
}

export default new SearchView();
