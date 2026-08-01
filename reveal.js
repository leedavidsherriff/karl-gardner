// Sections breathe in on scroll — once, slowly, or not at all if the
// visitor has asked the OS for less motion.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  var targets = document.querySelectorAll(
    '.model, .commission .step, .guarantee, .appointment, .card, .model-detail, .compare'
  );
  if (!targets.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('rv-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });

  targets.forEach(function (t) {
    t.classList.add('rv');
    io.observe(t);
  });
})();
