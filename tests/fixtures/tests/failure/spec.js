/* global window */
(() => {
  describe('Add Test', () => {
    let adder;
    beforeEach(() => {
      adder = new window.Adder(0);
    });
    it('Should add the value', () => {
      adder.add(1);
      expect(adder.currentState()).to.be.equal(0);
    });
  });
  describe('Sub Test', () => {
    let sub;
    beforeEach(() => {
      sub = new window.Sub(0);
    });
    it('Should add the value', () => {
      sub.sub(1);
      expect(sub.currentState()).to.be.equal(0);
    });
  });
})();
