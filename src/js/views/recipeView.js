import View from './View.js';
import icons from 'url:../../img/icons.svg'; // while rendering html, images are not showing bec now the images according to dist folder needs to be rendered, but we have original ones sp we need to import original ones from src
// for static files we need to write url
import { Fraction } from 'fractional';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  addHandlerRender(handler) {
    // we recieve controlRecipe as handler here
    // this is publisher, we needs to get access to subscriber{
    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler));
  } // note that these things should be present in view.js but if we move code there, controlRecipes needs to be tackled as well
  // but we can't move logic part of controlRecipes in view, so we can solve this type of problem using 'Publisher-Subscriber' pattern

  //'Publisher-Subscriber' pattern
  //Code that wants to react: SUBSCRIBER, code that knows when to react: PUBLISHER
  // controlRecipes will be passed into addHandlerRender when program starts
  //addHandlerRender listens for events(addEventListener) & uses controlRecipes as callback
  // this will allow us to keep the handler in the controller & listener into view
  // in summary, the handler subscribes to the publisher, which is the listener in this case, & then as the publisher publishes an event, the subscriber is executed

  addHandlerUpdateServings(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings'); //using event delegation
      if (!btn) return;
      const { updateTo } = btn.dataset; // for property data-update-to
      if (+updateTo > 0) handler(+updateTo);
      // to determine the no. of servings we have added the property 'data-update-to' in _generateMarkUp in + and - btns
    });
  }

  addHandlerAddBookmark(handler) {
    this._parentElement.addEventListener('click', function (e) {
      // not again putting event listener on actual element instead using parent element, & theen checking if the click happened on the desired on(event delegation)
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handler();
    });
  }
  _generateMarkup() {
    return `
        <figure class="recipe__fig">
          <img src="${this._data.image}" alt="Tomato" class="recipe__img" />
          <h1 class="recipe__title">
            <span>${this._data.title}</span>
          </h1>
        </figure>
      
        <div class="recipe__details">
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-clock"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--minutes">${
              this._data.cookingTime
            }</span>
            <span class="recipe__info-text">minutes</span>
          </div>
          <div class="recipe__info">
            <svg class="recipe__info-icon">
              <use href="${icons}#icon-users"></use>
            </svg>
            <span class="recipe__info-data recipe__info-data--people">${
              this._data.servings
            }</span>
            <span class="recipe__info-text">servings</span>
      
            <div class="recipe__info-buttons">
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings - 1
              }">
                <svg>
                  <use href="${icons}#icon-minus-circle"></use>
                </svg>
              </button>
              <button class="btn--tiny btn--update-servings" data-update-to="${
                this._data.servings + 1
              }">
                <svg>
                  <use href="${icons}#icon-plus-circle"></use>
                </svg>
              </button>
            </div>
          </div>
      
          <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
          <button class="btn--round btn--bookmark">
            <svg class="">
              <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
            </svg>
          </button>
        </div>
      
        <div class="recipe__ingredients">
          <h2 class="heading--2">Recipe ingredients</h2>
          <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
            
        </div>
      
        <div class="recipe__directions">
          <h2 class="heading--2">How to cook it</h2>
          <p class="recipe__directions-text">
            This recipe was carefully designed and tested by
            <span class="recipe__publisher">${
              this._data.publisher
            }</span>. Please check out
            directions at their website.
          </p>
          <a
            class="btn--small recipe__btn"
            href="${this._data.sourceUrl}"
            target="_blank"
          >
            <span>Directions</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </a>
        </div>`;
  }
  _generateMarkupIngredient(ing) {
    return `
      <li class="recipe__ingredient">
      <svg class="recipe__icon">
        <use href="src/img/icons.svg#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ing.quantity ? new Fraction(ing.quantity).toString() : ''
      }</div>
      <div class="recipe__description">
        <span class="recipe__unit">${ing.unit}</span>
        ${ing.description}
      </div>
    </li>`;
  }
}
export default new RecipeView(); // exporting the object
