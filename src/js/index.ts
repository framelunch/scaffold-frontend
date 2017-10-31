import * as $ from 'jquery';

class Main {
  constructor() {
    this.onDOMContentLoaded = this.onDOMContentLoaded.bind(this);
  }

  onDOMContentLoaded() {
    console.log('jquery version:', $.fn.jquery);
  }
}

const main = new Main();
window.addEventListener('DOMContentLoaded', main.onDOMContentLoaded);
