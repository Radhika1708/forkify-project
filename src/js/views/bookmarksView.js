// we'll use previewView kind of as a child view of the bookmarksView and of the resultsView
import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  // would be v similar to recipe view
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join(''); // for each of the bookmarks we want to render the preview & all of this should be a string that we need to return from generateMarkup method
    // so that in View it can insert the markup into the DOM
  }
}

export default new BookmarksView();
