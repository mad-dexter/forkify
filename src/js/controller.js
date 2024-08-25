// Import for polyfilling
import 'regenerator-runtime/runtime'; // For async await polyfiling
import 'core-js/stable'; // All other polyfiling

// Import statement for MVC modules
import {
  state,
  loadRecipe,
  loadSearchResult,
  getSearchResultsPerPage,
  updateServings,
  addDeleteBookMarks,
  uploadRecipe,
} from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipieView from './views/addrecipeView.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const showRecipie = async function () {
  const foodID = window.location.hash.replace('#', '');
  if (!foodID) return; // Guard statement for situations when the url is hit without any food id

  // Start the spinner before load. Will be cleared once leading is done
  recipeView.showSpinner();

  // Code to re render the results view with the selected result
  resultsView.update(getSearchResultsPerPage(1));
  bookmarkView.update(state.bookmark);

  try {
    // Step 1: Retrieve the recipies from webserver
    await loadRecipe(foodID);

    // Step 2: Fill the html with the data of the recipe
    recipeView.render(state.recipe);
  } catch (err) {
    recipeView.displayErrorMessage();
  }
};

const showSearchResults = async function (e) {
  e.preventDefault();

  // Step 1: Get the search string from view
  const searchString = searchView.getSearchTerm();
  if (!searchString) return; // Guard clause

  resultsView.showSpinner();
  try {
    // Step 2: Retrieve the results
    await loadSearchResult(searchString);
    // Step 2: Fill the html with the data of the recipe :: Also mark the page number and only pass the set of records for the pagination
    resultsView.render(getSearchResultsPerPage(1));

    // Call method to show the pagination button
    paginationView.render(state.search);
  } catch (err) {
    resultsView.displayErrorMessage();
  }
};

const handlePaginationClicks = function (targetPage) {
  resultsView.render(getSearchResultsPerPage(targetPage));
  paginationView.render(state.search);
};

const controlUpdateServings = function (newServings) {
  // Update the underlying data for servings
  updateServings(newServings);
  // Update the view with new data
  recipeView.update(state.recipe);
};

const controlBookMarks = function () {
  // Call the model
  addDeleteBookMarks(state.recipe);
  // Update the recipie view again
  recipeView.update(state.recipe);
  // Update the bookmark view
  bookmarkView.render(state.bookmark);
};

const renderBookMark = function () {
  bookmarkView.render(state.bookmark);
};

const getFormData = async function (data) {
  const formDataObj = Object.fromEntries(data);

  try {
    // Start the spinner
    addRecipieView.showSpinner();

    // Call the model to pass this data for save
    await uploadRecipe(formDataObj);

    // Render the recipe
    recipeView.render(state.recipe);

    // SHow a success message
    addRecipieView.displaySuccessMessage(`Recipe uploaded successfully.`);

    // Re render bookmark so that the recipe will come up
    renderBookMark();

    // Change the hash in URL
    window.history.pushState(null, '', `#${state.recipe.id}`);

    // Close the modal
    setTimeout(function () {
      addRecipieView.hideShowForm();
    }, 2000);
  } catch (err) {
    console.log(err.message);
    addRecipieView.displayErrorMessage(err.message);
  }
};

// -------------------------------------------------------------------------------------------------------------
// As a subscriber the controller will pass the handler method to view for calling at the beginning
const init = function () {
  bookmarkView.addLoadHandler(renderBookMark);
  recipeView.addEventForLoad(showRecipie);
  recipeView.addEventForServingButton(controlUpdateServings);
  recipeView.addEventForBookMark(controlBookMarks);
  searchView.addEventForSearch(showSearchResults);
  paginationView.addEventsForPageClick(handlePaginationClicks);
  addRecipieView.addFormSubmissionEvent(getFormData);
};

init();
