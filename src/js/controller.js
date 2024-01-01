// perfect architectue : maintainability + structure + expandability
// 1) loading recipe
// 2) rendering it, displayed icons, spinner functionality
// 3) event listener for the change in hash value
// 4) Refactoring according to MVC
// 5) installed fractional lib using nom install fractional
// 6) broke down to more files
// 7) Publisher Subscriber
// 8) Implementing search results, created new view named searchView.js
// 9) Creating result view
// 10) Implementing pagination(per page we want to render 10 results), for event listener in button, we will use publisher suscriber pattern
// 11) Updating recipes servings
// 12) Develop Algorithm for Updating the DOM only at places where it actually changed
// 13) giving selected class touch
// 14) Implementing bookmarks
// 15) Displaying bookmarks
// 16) Persist the bookmark as we reload it (Storing bookmarks to local storage)
// 17) Uploading a new recipe (KHATARNAAK😶)
// 18) Marking recipe as our own
// 19) Adding documentations (not done here - u can refer last lecture)
// 20) deployment (first, we create final bundle using build command, before that deleted parcel-cache & dist folder inorder to get fresh start)
// changed the build command to "build": "parcel build index.html --dist-dir ./dist",  --dist dir stands for distribution directory
// go to netlify to deploy
// git installed, start with git init, then git config --global user.name Radhika1708, then git config --global user.email radhikasoni.jpr@gmail.com
// made .gitignore file, where we want all those files which we want git to ignore
// sheck using git status, then brought all files to staging area, or to track our files using git add -A
// FINALLY COMMIT git commit -m 'Initial commit'
// U CAN GO TO PREVIOUS COMMIT using git reset --hard HEAD
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable'; // for polyfilling everything else // with this, we make sure that most real old browsers are still being supported by our application
import 'regenerator-runtime/runtime'; // this polyfilling async await
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   // activating hot module reloading using parcel
//   module.hot.accept();
// }

// 1. Loading recepies from API
// write npm init --> PACKAGE.JSON created --> added start, build field
// then installed parcel using npm i parcel@2 -D // @2 for version 2 & -D for devDependency --> node modules created
// start parce using npm start --> it gave error first bec we are using parcel v2, so i removed line "main" from package.json --> will create dist folder
// reason for removing main -> when a main field is seen, Parcel infers that your project is a library and uses it as the output path.
// for polyfills related work, npm i core-js regenerator-runtime

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1); // The window.location object in JavaScript provides information
    // about the current URL of the browser.The .hash property of window.location returns the fragment
    // identifier (the part of the URL that comes after the # symbol).slice(1)to remove #

    if (!id) return;
    recipeView.renderSpinner();
    // 0. update result view to mark selected search result
    resultsView.update(model.getSearchResultsPage());
    // 1. updating bookmarks view
    bookmarksView.update(model.state.bookmarks); // to highlight current recipe in bookmarks section
    // 2. Loading recipe - this part we're taking from model by calling the function
    await model.loadRecipe(id); // the recipe will be loaded here & will be stored in state obj, this is not returning anything, but here we'll get access to state.recipe & that state.recipe will be manipulated in model.js, So load recipe is clearly not a pure function, it has a side effect(but we're not dealing with thi problem now)

    // 3. Rendering the data
    recipeView.render(model.state.recipe); // data which we recived from step1 // in render we're passing the data which is model.state.recipe
    // const recipeView = new recipeView(model.state.recipe) // if we had imported the class and not the object but above one is better
  } catch (err) {
    recipeView.renderError(); // we're not passing msg rn, that means in view.js, error msg would be set to default
  }
};
controlRecipes();

// 8. search
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // a) get search query
    const query = searchView.getQuery();
    if (!query) return;
    // b) load search results
    await model.loadSearchResults(query);
    // c) render results
    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());
    // d) render initial pagination buttons
    paginationView.render(model.state.search); // passing entire search object
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  // a) render NEW result
  resultsView.render(model.getSearchResultsPage(goToPage));
  // d) render NEW pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipes servings (in state)
  model.updateServings(newServings);
  // Update the recipe view(by overriding complete recipe i.e. by re-rendering it again)
  // recipeView.render(model.state.recipe); // bec of rendering page was flickering, so instead of render we'll use update method
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // a) Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  // b) update recipe view
  recipeView.update(model.state.recipe);
  // c) render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  // this func will recieve new recipe data
  // console.log(newRecipe);
  try {
    // show loading spinner
    addRecipeView.renderSpinner();
    // upload the new recipe data
    await model.uploadRecipe(newRecipe);

    // render recipe
    recipeView.render(model.state.recipe);

    // success message
    addRecipeView.renderMessage();

    // render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // change id in the url
    window.history.pushState(null, '', `#${model.state.recipe.id}`); // will allow us to change the url without reloading the page, pushState takes 3 args(state, title, url )
    // window.history.back(); // going back and forth using arrows

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🎆', err);
    addRecipeView.renderError(err.message);
  }
};
// 3. Event listener for change in hash val
// window.addEventListener('hashchange', controlRecipes);
// // also we need to listen for the load event
// window.addEventListener('load', controlRecipes); // this event is fired off immediately after the page has completed loading
// instead of above see recipeView.js
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  // controlServings();// HERE, it will give error bec here we are not considering asynchronous nature of js, since at this time state.recipe might not be defined
  // and we also want this controller to run when we click button on recipeView, therefore we'll create new event listener in the recipeView
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init(); // this will immediately run addHandlerRender, & we passed in the controller func or the handler func(controlRecipes)
// that we want to get executed as soon as the event happens
