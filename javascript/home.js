(function () {
  var SERVER = "loddysmp.net";
  document.getElementById("year").textContent = new Date().getFullYear();

  var toast = document.getElementById("toast"), timer;
  function say(msg) {
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove("show"); }, 2500);
  }
  function copyIp() {
    try {
      navigator.clipboard.writeText(SERVER).then(
        function () { say("IP copied: " + SERVER); },
        function () { say("Cannot copy. The IP is: " + SERVER); });
    } catch (e) { say("Cannot copy. The IP is: " + SERVER); }
  }
  document.getElementById("copyIp").addEventListener("click", copyIp);
  var copy2 = document.getElementById("copyIp2");
  if (copy2) copy2.addEventListener("click", copyIp);
  document.querySelectorAll("[data-copy-ip]").forEach(function (b) { b.addEventListener("click", copyIp); });

  // fade cards in as they scroll into view (only when the browser supports it)
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.08 });
    document.querySelectorAll("main .card").forEach(function (c) { c.classList.add("reveal"); io.observe(c); });
  }

  var onlineEl = document.getElementById("online"), countEl = document.getElementById("count"),
      textEl = document.getElementById("statusText"), dotEl = document.getElementById("dot");
  function setState(cls, n, text) {
    if (dotEl) dotEl.className = "dot " + cls;
    if (countEl) countEl.textContent = n;
    onlineEl.textContent = n === "–" ? "0" : n;
    if (textEl) textEl.textContent = text;
  }
  function loadStatus() {
    fetch("https://api.mcstatus.io/v2/status/java/" + SERVER)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.online) {
          var p = d.players || {};
          setState("on", String(p.online != null ? p.online : 0), p.max ? "players online" : "players online");
        } else { setState("off", "0", "Server is offline"); }
      })
      .catch(function () { setState("", "–", "Status nu niet beschikbaar"); });
  }
  loadStatus(); setInterval(loadStatus, 60000);

  var canvas = document.getElementById("particles"), ctx = canvas && canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parts = [], w = 0, h = 0;
  function spawn(any) {
    return { x: Math.random() * w, y: any ? Math.random() * h : h + 6, r: 1 + Math.random() * 2.5,
             v: 0.3 + Math.random() * 0.9, a: Math.random() * 6.28, o: 0.2 + Math.random() * 0.4 };
  }
})();