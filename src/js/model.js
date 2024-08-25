// Imports
import { APP_URL, RECORDS_PAGINATION, API_KEY } from './config.js';
import { getJsonResponseFromAPI, postDataToAPI } from './helper.js';

// In model we will need a state variable to make other module (controller access the data) access data
export const state = {
  // Holds the current displaye recipe
  recipe: {},
  // Holds the state of searched results
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RECORDS_PAGINATION,
  },
  // Holds list of bookmarked items
  bookmark: [],
};

const createRecipeObject = function (recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    bookmarked: state.bookmark.some(el => el.id === recipe.id),
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const { recipe } = await getJsonResponseFromAPI(
      `${APP_URL}${id}?key=${API_KEY}`
    );
    state.recipe = createRecipeObject(recipe);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResult = async function (searchString) {
  try {
    state.search.query = searchString;
    state.search.page = 1;
    const { recipes } = await getJsonResponseFromAPI(
      `${APP_URL}?search=${searchString}&key=${API_KEY}`
    );

    state.search.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPerPage = function (pageNo) {
  // Set the current page number in state variable
  state.search.page = pageNo;

  // Calculate the first and last page no
  const start = (pageNo - 1) * state.search.resultsPerPage;
  const end = pageNo * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (servings) {
  state.recipe.ingredients.forEach(
    ing => (ing.quantity = ing.quantity * (servings / state.recipe.servings))
  );
  // oldQuantity * newServings / oldservings
  state.recipe.servings = servings;
};

export const addDeleteBookMarks = function (recipe) {
  // Check if the recipie is already a bookmark
  const index = state.bookmark.findIndex(rec => rec.id === recipe.id);
  if (index !== -1) {
    // It means its already bookmarked. So unbookmark it
    state.bookmark.splice(index, 1);
    state.recipe.bookmarked = false;
    persistBookMarks();
    return;
  }
  // Update the bookmark Array
  state.bookmark.push(recipe);

  // Check if the current displayed recipe is bookmarked
  if (state.recipe.id === recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookMarks();
};

export const uploadRecipe = async function (data) {
  try {
    // Convert the object to entries for iterating
    const ingredients = Object.entries(data)
      .filter(el => el[0].startsWith('ingredient') && el[1] !== '')
      .map(el => {
        const ingArray = el[1].replaceAll(' ', '').split(',');

        // Check if array is of wrong format
        if (ingArray.length !== 3)
          throw new Error(
            `Wrong format defined for ingredients. Please use current format!!!`
          );
        const [quantity, unit, description] = ingArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    // Form the object
    const newRecipe = {
      title: data.title,
      publisher: data.publisher,
      source_url: data.sourceUrl,
      image_url: data.image,
      servings: +data.servings,
      cooking_time: +data.cookingTime,
      ingredients,
    };

    const { recipe } = await postDataToAPI(
      `${APP_URL}?key=${API_KEY}`,
      newRecipe
    );

    state.recipe = createRecipeObject(recipe);
    // Add the created recipe as bookmark
    addDeleteBookMarks(state.recipe);
  } catch (err) {
    throw err;
  }
};

const persistBookMarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

const getBookMarksFromLocalStorage = function () {
  const bookmarkData = localStorage.getItem('bookmarks');
  if (!bookmarkData) return;
  state.bookmark = JSON.parse(bookmarkData);
};

// ------------------------------------------------------------------------------
const init = function () {
  // Load the bookmarks if any
  getBookMarksFromLocalStorage();
};

init();
