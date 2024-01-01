import icons from 'url:../../img/icons.svg';
export default class View {
  // we'll use it as a parent class of these other child views
  _data;

  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    // will receive data from controller
    this._data = data; // would be equal to model.state.search.results
    const markup = this._generateMarkup();
    if (!render) return markup;
    // before inserting new markup, we need to get rid of that markup that is already there
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup(); // generate new Mrkup & then compare it with old markup. This markup is just a string, so it would be v difficult to compare to DOM elements we currently have
    const newDOM = document.createRange().createContextualFragment(newMarkup); // to solve above problem. It will convert string to real DOM Node objects
    // newDOM will be like virtual DOM, i.e. which is not living on the page, but which lives in our memory
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // console.log(newElements); // entire list of all the elements in the newDOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // comparing both
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl)); // will check contents of both node

      // UPDATES CHANGED TEXT
      if (
        !newEl.isEqualNode(curEl) && //newEl.firstChild.nodeValue.trim() !== '' added bec we only want elements that are actually only text
        newEl.firstChild?.nodeValue.trim() !== '' // val of nodeValue will be null if node is an element, but if it is text, then we actually get the content of the text node
      ) {
        // to trim whitespaces
        curEl.textContent = newEl.textContent;
      }

      // UPDATES CHANGED ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        // console.log(newEl.attributes);// print attribute property of all the elements that have changed
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  // spinner
  renderSpinner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}#icon-loader"></use>
            </svg>
          </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    // we're keeping the ability of passing in a message. but, if no message is psased in, then we will set the default
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
          `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
