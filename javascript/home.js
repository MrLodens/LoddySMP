(function () {
  var SERVER = "loddysmp.net";
  document.getElementById("year").textContent = new Date().getFullYear();

  try { if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark"); } catch (e) {}
  document.getElementById("theme").addEventListener("click", function () {
    var dark = document.body.classList.toggle("dark");
    try { localStorage.setItem("theme", dark ? "dark" : "light"); } catch (e) {}
  });

  var toast = document.getElementById("toast"), timer;
  function say(msg) {
    toast.textContent = msg; toast.classList.add("show");
    clearTimeout(timer);
    timer = setTimeout(function () { toast.classList.remove("show"); }, 2500);
  }
  function copyIp() {
    try {
      navigator.clipboard.writeText(SERVER).then(
        function () { say("IP gekopieerd: " + SERVER); },
        function () { say("Kopiëren lukt niet. Het IP is " + SERVER); });
    } catch (e) { say("Kopiëren lukt niet. Het IP is " + SERVER); }
  }
  document.getElementById("copyIp").addEventListener("click", copyIp);
  document.getElementById("copyIp2").addEventListener("click", copyIp);

  var onlineEl = document.getElementById("online"), countEl = document.getElementById("count"),
      textEl = document.getElementById("statusText"), dotEl = document.getElementById("dot");
  function setState(cls, n, text) {
    dotEl.className = "dot " + cls; countEl.textContent = n;
    onlineEl.textContent = n === "–" ? "0" : n; textEl.textContent = text;
  }
  function loadStatus() {
    fetch("https://api.mcstatus.io/v2/status/java/" + SERVER)
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d && d.online) {
          var p = d.players || {};
          setState("on", String(p.online != null ? p.online : 0), p.max ? "spelers online (max. " + p.max + ")" : "spelers online");
        } else { setState("off", "0", "Server is offline"); }
      })
      .catch(function () { setState("", "–", "Status nu niet beschikbaar"); });
  }
  loadStatus(); setInterval(loadStatus, 60000);

  var canvas = document.getElementById("particles"), ctx = canvas.getContext("2d");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var parts = [], w = 0, h = 0;
  function spawn(any) {
    return { x: Math.random() * w, y: any ? Math.random() * h : h + 6, r: 1 + Math.random() * 2.5,
             v: 0.3 + Math.random() * 0.9, a: Math.random() * 6.28, o: 0.2 + Math.random() * 0.4 };
  }
})();