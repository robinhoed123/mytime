(function () {
  'use strict';

  // ---------- Analog clock ----------
  // Pivot point = centre of the light-green "MY TIME" circle in clock-face.png (1080x1080).
  var CX = 565;
  var CY = 527;

  var hourHand = document.getElementById('hour-hand');
  var minuteHand = document.getElementById('minute-hand');

  function setAnalog(now) {
    var h = now.getHours() % 12;
    var m = now.getMinutes();
    var s = now.getSeconds();
    var minuteDeg = (m + s / 60) * 6;          // 360 / 60
    var hourDeg = (h + m / 60) * 30;           // 360 / 12
    hourHand.setAttribute('transform', 'rotate(' + hourDeg + ' ' + CX + ' ' + CY + ')');
    minuteHand.setAttribute('transform', 'rotate(' + minuteDeg + ' ' + CX + ' ' + CY + ')');
  }

  // ---------- Digital clock ----------
  // Each digit is a hand-drawn-style stroke path in a 60 x 100 box,
  // drawn twice: a wide cyan outline underneath and dark ink on top,
  // like the letters in the "MY TIME" logo.
  var GLYPHS = {
    '0': 'M30 8 C6 8 6 92 30 92 C54 92 54 8 30 8',
    '1': 'M16 24 L34 8 L34 92',
    '2': 'M10 26 C12 2 52 4 50 30 C48 52 14 76 8 92 L52 92',
    '3': 'M10 10 L50 10 L26 44 C58 42 60 92 30 92 C20 92 12 88 8 82',
    '4': 'M40 92 L40 8 L8 64 L54 64',
    '5': 'M50 8 L14 8 L10 46 C38 34 58 54 52 76 C46 96 18 94 8 84',
    '6': 'M46 10 C22 4 8 40 10 66 C12 96 52 96 50 66 C48 42 16 42 10 62',
    '7': 'M8 8 L52 8 L24 92',
    '8': 'M30 48 C8 46 10 8 30 8 C50 8 52 46 30 48 C4 50 6 92 30 92 C54 92 56 50 30 48',
    '9': 'M50 36 C50 4 10 4 10 34 C10 60 48 60 50 36 L44 92'
  };

  // Slot layout: x position, small tilt and vertical nudge for a playful look.
  var SLOTS = [
    { x: 20,  rot: -6, dy: 4 },
    { x: 92,  rot: 5,  dy: -4 },
    // colon goes between
    { x: 228, rot: -4, dy: 2 },
    { x: 300, rot: 7,  dy: -2 }
  ];

  var SVG_NS = 'http://www.w3.org/2000/svg';
  var svg = document.getElementById('digits');
  var timeText = document.getElementById('time-text');
  var slotPaths = [];

  function el(name, attrs, parent) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  SLOTS.forEach(function (slot) {
    var g = el('g', {
      transform: 'translate(' + slot.x + ' ' + (25 + slot.dy) + ') rotate(' + slot.rot + ' 30 50)'
    }, svg);
    slotPaths.push({
      outline: el('path', { 'class': 'outline' }, g),
      ink: el('path', { 'class': 'ink' }, g),
      value: null
    });
  });

  var colon = el('g', { id: 'colon' }, svg);
  [55, 95].forEach(function (cy) {
    el('circle', { 'class': 'outline', cx: 190, cy: cy, r: 12 }, colon);
    el('circle', { 'class': 'ink', cx: 190, cy: cy, r: 8 }, colon);
  });

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function setDigital(now) {
    var hh = pad(now.getHours());
    var mm = pad(now.getMinutes());
    var chars = hh + mm;
    for (var i = 0; i < 4; i++) {
      var slot = slotPaths[i];
      if (slot.value !== chars[i]) {
        slot.value = chars[i];
        slot.outline.setAttribute('d', GLYPHS[chars[i]]);
        slot.ink.setAttribute('d', GLYPHS[chars[i]]);
      }
    }
    // Blink the colon every second
    colon.setAttribute('class', now.getSeconds() % 2 ? 'dim' : '');

    var label = hh + ':' + mm;
    if (timeText.textContent !== label) timeText.textContent = label;
  }

  // ---------- Tick ----------
  function tick() {
    var now = new Date();
    setAnalog(now);
    setDigital(now);
    // Schedule the next update right after the next full second
    setTimeout(tick, 1000 - now.getMilliseconds() + 5);
  }

  tick();

  // Catch up immediately when a phone wakes up or the tab becomes visible again
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) {
      var now = new Date();
      setAnalog(now);
      setDigital(now);
    }
  });
})();
