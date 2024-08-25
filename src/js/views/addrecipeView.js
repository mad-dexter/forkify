import View from './View.js';

class AddRecipeView extends View {
  _parentContainer = document.querySelector('.upload');
  _modal = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _modalCloseBtn = document.querySelector('.btn--close-modal');
  _addRecipieBtn = document.querySelector('.nav__btn--add-recipe');

  constructor() {
    super();
    this._addHandlerEvents();
  }

  hideShowForm() {
    this._modal.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addFormSubmissionEvent(handler) {
    this._parentContainer.addEventListener('submit', function (e) {
      e.preventDefault();
      // We can use FormData Api to get all the form data easily
      const formData = [...new FormData(this)];
      handler(formData);
    });
  }

  _addHandlerEvents() {
    this._modalCloseBtn.addEventListener('click', this.hideShowForm.bind(this));
    this._addRecipieBtn.addEventListener('click', this.hideShowForm.bind(this));
    this._overlay.addEventListener('click', this.hideShowForm.bind(this));

    // window.addEventListener('keydown', function (e) {
    //   if (e.key === 'Escape') {
    //     console.log(this);
    //   }
    // });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
