this.bundle = this.bundle || {};
this.bundle.js = (function () {
  'use strict';

  var a = 1;

  function main() {
    console.log(a);
  }

  return main;

}());
