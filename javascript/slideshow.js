(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll("[data-slideshow]").forEach(function (root) {
    var slides = [].slice.call(root.querySelectorAll(".slide"));
    var dotsBox = root.querySelector(".sdots");
    var prev = root.querySelector(".prev"), next = root.querySelector(".next");
    var i = 0, timer = null, dots = [];

    if (slides.length < 2) {
      [prev, next, dotsBox].forEach(function (el) { if (el) el.hidden = true; });
      return;
    }

    slides.forEach(function (s, n) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "sdot";
      b.setAttribute("aria-label", "Show build " + (n + 1));
      b.addEventListener("click", function () { go(n, true); });
      dotsBox.appendChild(b);
      dots.push(b);
    });

    function go(n, user) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", on ? "false" : "true");
        dots[k].classList.toggle("is-active", on);
        if (on) dots[k].setAttribute("aria-current", "true"); else dots[k].removeAttribute("aria-current");
      });
      if (user) play();
    }
    function play() {
      stop();
      if (!reduce) timer = setInterval(function () { go(i + 1); }, 6000);
    }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    prev.addEventListener("click", function () { go(i - 1, true); });
    next.addEventListener("click", function () { go(i + 1, true); });
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(i - 1, true); }
      else if (e.key === "ArrowRight") { go(i + 1, true); }
    });
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", play);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", play);
    document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else play(); });

    var x0 = null;
    root.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 !== null) {
        var dx = e.changedTouches[0].clientX - x0;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), true); else play();
      }
      x0 = null;
    });

    go(0);
    play();
  });
})();
