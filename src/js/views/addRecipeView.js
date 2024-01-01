import View from './View.js';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded.';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }
  toggleWindow() {
    this._overlay.classList.toggle('hidden'); // removing/adding hidden class
    this._window.classList.toggle('hidden');
  }
  _addHandlerShowWindow() {
    // we want this func to be called as soon as the page loads, now in this case, it has nothing to do with any controller bec there is nothing special happening
    // here that controller needs to tell us, so when this click happens on the btn open all that will happen is really for the window to show
    // So, the controller, it doesn't need to interfere in any of this & so therefore we can simply run this function here as soon as this obj is created, so we'll make a constructor
    this._btnOpen.addEventListener(
      'click',
      this.toggleWindow.bind(this) // Here, bind(this) ensures that when the toggleWindow method is called in response to the click event, the this inside toggleWindow refers to the instance of the object containing the _addHandlerShowWindow
      //   this._overlay.classList.toggle('hidden'); we are not using these lines here, bec it will give error of undefined which happens bec, here we're using this keyword
      //   this._window.classList.toggle('hidden'); // but we already know that the this keyword on which inside the handler function points to the element on which listener is attached to, so in this case that is _btnOpen
      // so we're exporting this entire func into another method & then call that method with the correct keyword bound to it
    );
  }

  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArr = [...new FormData(this)]; // in FormData constructor, we have to pass in an element that is a form, & so that form in this case is 'this' keyword
      // bec we're inside of an handler func & so this points to this.parentElement which is ofcourse the upload form. [...new FormData(this)] bec we are spreading obj to an array which contains all the fields with all values in there
      // now what we want to do with this data eventually?we want to upload it to the API & that action of uploading the data is going to be just another API call, & API calls happen in model
      // and so therefore, we will need a way of getting this data to the model, so we need to create a controller function which will then be the handler of this event
      // ususally our recipe data is always an object & not array of entries
      const data = Object.fromEntries(dataArr); // take entries and convert it to object
      handler(data);
    });
  }
  _generateMarkup() {}
}

export default new AddRecipeView();
