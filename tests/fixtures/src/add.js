/* global window */
(() => {
  class Adder {
    constructor(initval) {
      this.val = initval;
    }

    add(val) {
      this.val += val;
    }

    currentState() { return this.val; }
  }
  window.Adder = Adder;
})();
