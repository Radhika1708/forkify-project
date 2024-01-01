import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';
// import { getJSON, sendJSON } from './helpers.js';
export const state = {
  // this is our big state obj, which will contain the recipe
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  // let recipe = data.data.recipe; or
  const { recipe } = data.data; // creating a new recipe object
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // add only if key exist for a recipe .// if true, then same as key: recipe.key
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      // some returns true or false, with this all the recipes that we now load will always have bookmarked set to either true or false
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;

    // console.log(state.recipe);
  } catch (err) {
    // console.error(`${err}`);
    throw err; // note we're throwing error, same reason that we want controller block to handle it
  }
};

export const loadSearchResults = async function (query) {
  // since it would be an AJAX call
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      // we'll put this also in state
      // array of objects which we get & now we want to create a new array which contains the new objects, where the property names are different, hence map
      return {
        // returning new object
        id: rec.id,
        title: rec.title,
        publisher: rec.publisher,
        image: rec.image_url,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.search.page = 1;
    // console.log(state.search.results);
  } catch (err) {
    console.log(`${err}`);
    throw err;
  }
};

// pagination
export const getSearchResultsPage = function (page = state.search.page) {
  // won't be an async func, since we already loaded the results
  state.search.page = page; // to get to know, on which page we currrently are
  const start = (page - 1) * state.search.resultsPerPage; // 0
  const end = page * state.search.resultsPerPage; // 9
  return state.search.results.slice(start, end); // from result 1 to 10
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

const persistBookmarks = function () {
  //storing bookmarks
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);
  // Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  // delete bookmark
  // pretty common pattern to notice that when we add we need the whole data, but when we delete we just need the id
  const index = state.bookmarks.findIndex(el => el.id === id); // looking for element whose id is equal to the id of element we passed in
  state.bookmarks.splice(index, 1); // to delete something, we use splice (index & how many items u want to delete)
  // Mark current recipe as not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

export const uploadRecipe = async function (newRecipe) {
  // console.log(Object.entries(newRecipe));
  // this one will eventually make a request to API, async func which will recieve data for new recipe
  // first it will take the raw input data(which is just normal text, has 6 ingredients properties) & transform it into the same format as data that we also get out of the API(this is nicely formatted, has array of ingredients which contains a bunch of obj where each contains quantity, unit, description)
  // so we need to put all of data in one array & also separate each of these strings into quantity, unit, description
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(
        // opposite of formEntries  (creating array ingredients, using map but first we need to convert the object (newRecipe) to an array)
        entry => entry[0].startsWith('ingredient') && entry[1] !== ''
      ) //entry[0].startsWith('ingredient') && entry[1] !== '' till this step we get the required array elements, then (after map)we need to do is basically take the data out of the string here and put that into an object
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please use the correct format :)'
          ); // we want to render this error mgs to addRecipeView i.e controller
        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe); // ready to be sent to API
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
  // creating actual recipe obj which needs to be uploaded
};
