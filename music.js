(function () {
  'use strict';

  var VOLUME = 0.7; // 70%

  var music = document.getElementById('bg-music');
  music.volume = VOLUME;

  var events = ['pointerdown', 'touchstart', 'keydown', 'click'];

  function removeListeners() {
    events.forEach(function (e) { document.removeEventListener(e, start, true); });
  }

  function start() {
    var p = music.play();
    if (p && p.then) {
      p.then(removeListeners).catch(function () { /* still blocked; wait for next interaction */ });
    } else {
      removeListeners();
    }
  }

  // Browsers block sound until the visitor interacts with the page,
  // so try right away and otherwise start on the first tap, click or key press.
  events.forEach(function (e) { document.addEventListener(e, start, true); });
  start();
})();