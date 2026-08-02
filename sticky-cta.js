// A quiet gold-leaf "Request an appointment" pill.
// Rules, so it never nags:
//   · never over a hero — the hero has its own call to action
//   · never while the real appointment form is on screen — it would be a
//     second button asking for the same thing
//   · on pages with no hero, wait until the visitor has actually scrolled
(function () {
  if (document.querySelector('.sticky-cta')) return;

  var onIndex = !!document.getElementById('contact');
  var a = document.createElement('a');
  a.className = 'sticky-cta';
  a.href = onIndex ? '#contact' : './index.html#contact';
  a.textContent = 'Request an appointment';
  document.body.appendChild(a);

  var hero = document.querySelector('.hero, .model-hero');
  var form = document.querySelector('.appointment');

  var heroVisible = !!hero;      // assume covered until told otherwise
  var formVisible = false;
  var scrolledEnough = !!hero;   // hero pages gate on the hero, not scroll

  function update() {
    var show = !heroVisible && !formVisible && scrolledEnough;
    a.classList.toggle('is-shown', show);
  }

  if ('IntersectionObserver' in window) {
    if (hero) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { heroVisible = e.isIntersecting; });
        update();
      }, { threshold: 0.12 }).observe(hero);
    }
    if (form) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { formVisible = e.isIntersecting; });
        update();
      }, { threshold: 0.18 }).observe(form);
    }
  } else {
    heroVisible = false;         // no observer support: fall back to scroll only
  }

  if (!hero) {
    var onScroll = function () {
      scrolledEnough = window.scrollY > 320;
      update();
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  update();
})();
