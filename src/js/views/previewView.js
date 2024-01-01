// since recipeView and bookmarksView has exactly same markup, only meant for generating the markup

import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  // would be v similar to recipe view
  _parentElement = ''; // since we don't need any parent element here

  _generateMarkup(result) {
    // 13. selected class touch
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">      
    <a class="preview__link ${
      this._data.id === id ? 'preview__link--active' : '' // if this._data id is equal to current id
    }" href="#${this._data.id}">
      <figure class="preview__fig">
        <img src="${this._data.image}" alt="${this._data.title}" />
      </figure>
      <div class="preview__data">
        <h4 class="preview__title">${this._data.title}</h4>
        <p class="preview__publisher">${this._data.publisher}</p>
      
      <div class="preview__user-generated ${this._data.key ? '' : 'hidden'}">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
      </div>
      </div>
    </a>
  </li>
    `;
  }
}

export default new PreviewView();
