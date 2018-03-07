/* global window */
(() => {
  class Sub {
    constructor(initval) {
      this.val = initval;
    }
    sub(val) {
      this.val -= val;
    }
    currentState() { return this.val; }
  }
  window.Sub = Sub;
})();
