class searchView {
  _parentEl = document.querySelector('.search');
  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
  addHandlerSearch(handler) {
    //this would be publisher & controlSearch res func subscriber
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault(); // since we want to first prevent the default action of relaod when we submit
      handler();
    });
  }
}

export default new searchView();
