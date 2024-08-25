import images from 'url:../../img/icons.svg';

export default class View {
  _parentContainer;
  _data;
  _errMessage = 'No recipes found for your query. Please try again!';
  _successMessage = '';

  render(data) {
    this._data = data;
    // Check if the data is an array and has no values
    if (Array.isArray(this._data) && this._data.length === 0)
      return this._errMessage;

    const html = this._generateMarkup();
    // Add the html in the recipe container after clearing all the contents
    this._clearParentContainer();
    this._parentContainer.insertAdjacentHTML('beforeend', html);
  }

  // Method to not re render entire view but to update part of view based on changes
  update(data) {
    this._data = data;
    // Check if the data is an array and has no values
    if (Array.isArray(this._data) && this._data.length === 0)
      return this._errMessage;

    const newMarkup = this._generateMarkup();
    // Now create a virtual DOM with this new markup string so that we can compare both the current and Virtual DOM for changes
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newDOMElements = Array.from(newDOM.querySelectorAll('*'));
    const currentDOMElements = Array.from(
      this._parentContainer.querySelectorAll('*')
    );

    // Now loop over new array list and identify the nodes which are different :: Also only consider the nodes which have text content as we know the changes will only be text based
    newDOMElements.forEach((newEl, index) => {
      // nodeValue will return the text only for text type contents for rest type it will be blank :: This will only executed on elements which have changes in text.
      if (
        !newEl.isEqualNode(currentDOMElements[index]) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        currentDOMElements[index].textContent = newEl.textContent;
      }
      // Also now as there are changes in attributes of the +/- buttons we will also need to update the attributes as well
      if (!newEl.isEqualNode(currentDOMElements[index])) {
        Array.from(newEl.attributes).forEach(attr =>
          currentDOMElements[index].setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _generateMarkup() {
    console.log(`Stub for generating markup`);
  }

  // Function to show error message
  displayErrorMessage(message = this._errMessage) {
    const html = `
    <div class="error">
       <div>
        <svg>
          <use href="${images}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clearParentContainer();
    this._parentContainer.insertAdjacentHTML('beforeend', html);
  }

  displaySuccessMessage(message = this._successMessage) {
    const html = `<div class="message">
          <div>
            <svg>
              <use href="${images}#icon-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>`;
    this._clearParentContainer();
    this._parentContainer.insertAdjacentHTML('beforeend', html);
  }

  // Function to show the loading spinner
  showSpinner() {
    const spinner = `
  <div class="spinner">
    <svg>
      <use href="${images}#icon-loader"></use>
    </svg>
  </div>
  `;
    this._clearParentContainer();
    this._parentContainer.insertAdjacentHTML('afterbegin', spinner);
  }

  _clearParentContainer() {
    this._parentContainer.innerHTML = '';
  }
}
