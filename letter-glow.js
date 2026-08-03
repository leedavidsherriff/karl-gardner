// Text that lights up letter by letter as it rises through the viewport.
// Quiet and continuous — the sweep is tied to scroll position, not a timer,
// so it moves exactly as fast as the reader does.
//
// Never touches the hero: that copy sits over film and must read instantly.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var SELECTORS = [
    '.collection > h2', '.collection .ethos',
    '.commission-head h2',
    '.commission .step p',
    '.guarantee h2', '.guarantee p',
    '.appointment h2', '.appointment .note',
    '.board h2', '.board > p',
    '.own-job h2', '.own-job-note',
    '.model-detail .desc'
  ].join(',');

  var DIM = 0.16;      // resting state — present, but unlit
  var SPREAD = 14;     // characters in the lit gradient at any moment
  var START = 0.88;    // begins when the element top is this far down the screen
  var END = 0.38;      // fully lit by the time it reaches here

  var targets = [];

  function split(el) {
    if (el.dataset.lgDone) return null;
    var chars = [];
    // Only split raw text nodes, so any inline markup inside survives.
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);

    nodes.forEach(function (node) {
      var text = node.nodeValue;
      if (!text.trim()) return;
      var frag = document.createDocumentFragment();
      // Word-level wrappers keep line breaking normal; chars live inside them.
      text.split(/(\s+)/).forEach(function (chunk) {
        if (!chunk) return;
        if (/^\s+$/.test(chunk)) { frag.appendChild(document.createTextNode(chunk)); return; }
        var w = document.createElement('span');
        w.className = 'lg-w';
        for (var i = 0; i < chunk.length; i++) {
          var c = document.createElement('span');
          c.className = 'lg-c';
          c.textContent = chunk[i];
          c.style.opacity = DIM;
          w.appendChild(c);
          chars.push(c);
        }
        frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });

    if (!chars.length) return null;
    el.dataset.lgDone = '1';
    return { el: el, chars: chars, active: false, last: -1 };
  }

  Array.prototype.forEach.call(document.querySelectorAll(SELECTORS), function (el) {
    var t = split(el);
    if (t) targets.push(t);
  });
  if (!targets.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].el === e.target) { targets[i].active = e.isIntersecting; break; }
      }
    });
  }, { rootMargin: '20% 0px 20% 0px' });
  targets.forEach(function (t) { io.observe(t.el); });

  function paint() {
    var vh = window.innerHeight || 1;
    for (var i = 0; i < targets.length; i++) {
      var t = targets[i];
      if (!t.active) continue;
      var top = t.el.getBoundingClientRect().top;
      var p = (START * vh - top) / ((START - END) * vh);
      p = p < 0 ? 0 : p > 1 ? 1 : p;
      if (Math.abs(p - t.last) < 0.0015) continue;   // nothing worth repainting
      t.last = p;
      var n = t.chars.length;
      var head = p * (n + SPREAD);
      for (var c = 0; c < n; c++) {
        var lit = (head - c) / SPREAD;
        lit = lit < 0 ? 0 : lit > 1 ? 1 : lit;
        t.chars[c].style.opacity = (DIM + (1 - DIM) * lit).toFixed(3);
      }
    }
    requestAnimationFrame(paint);
  }
  requestAnimationFrame(paint);
})();
