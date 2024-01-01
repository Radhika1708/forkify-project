import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsView extends View {
  // would be v similar to recipe view
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again;)';
  _message = '';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join(''); // for each of the bookmarks we want to render the preview & all of this should be a string that we need to return from generateMarkup method
    // so that in View it can insert the markup into the DOM
  }
}

export default new ResultsView();
