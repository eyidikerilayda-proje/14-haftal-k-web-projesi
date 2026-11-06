// Ne Yapalım? - uygulama mantığı (games.js bu dosyadan ÖNCE yüklenmelidir)
// Ekranların yapısı index.html içinde hazır durur. Bu dosya sadece
// hangi ekranın görüneceğini seçer ve içlerini doldurur.
(function () {
  var KEY = "neYapalim.v1";          // localStorage anahtarı
  var S = load();                    // S = uygulamanın durumu (kayıtlı veriyle başlar)
  var sel = null;                    // oy ekranında seçili seçenek (kaydedilmez)
  var onlyFit = true;                // öneriler kişi sayısına göre süzülsün mü
  var tab = "setup";                 // açık sekme: setup, games, acts
  var confirming = false;            // onay ekranı açık mı

  function $(id) { return document.getElementById(id); }
  function show(id, on) { $(id).hidden = !on; }
  function el(tag, text, cls) {
    var e = document.createElement(tag);
    if (text != null) e.textContent = text;   // textContent: güvenli metin yazma
    if (cls) e.className = cls;
    return e;
  }

  /* ---------- Kayıt: localStorage ---------- */
  function fresh() {
    // stage: setup / vote / result | phase: pick (oy ver) / done (oy kullanıldı)
    // tie: kura ile seçilen seçeneğin sırası, çekilmediyse null
    return { stage: "setup", players: [], options: [], counts: [], current: 0, phase: "pick", tie: null };
  }
  function isStrArr(a) {
    return Array.isArray(a) && a.every(function (x) { return typeof x === "string"; });
  }
  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      // Kayıt bozuksa uygulama çökmesin diye şekli kontrol ediyoruz
      if (s && ["setup", "vote", "result"].indexOf(s.stage) > -1 &&
          isStrArr(s.players) && isStrArr(s.options) &&
          Array.isArray(s.counts) && s.counts.length === s.options.length &&
          typeof s.current === "number" && (s.phase === "pick" || s.phase === "done") &&
          (s.tie === null || typeof s.tie === "number")) {
        return s;
      }
    } catch (e) {}
    return fresh();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  }

  /* ---------- Ekleme ve silme ---------- */
  function addItem(list, value) {
    value = value.trim();
    if (!value) return "Boş bırakılamaz.";
    if (value.length > 30) return "En fazla 30 karakter.";
    S[list].push(value);
    if (list === "options") S.counts.push(0);
    save(); render();
    return "";
  }
  function removeItem(list, i) {
    S[list].splice(i, 1);
    if (list === "options") S.counts.splice(i, 1);
    save(); render();
  }
  function fillChips(list, ulId) {
    var ul = $(ulId);
    ul.textContent = "";
    S[list].forEach(function (text, i) {
      var li = el("li");
      li.appendChild(el("span", text));
      var b = el("button", "×");
      b.setAttribute("aria-label", text + " sil");
      b.addEventListener("click", function () { removeItem(list, i); });
      li.appendChild(b);
      ul.appendChild(li);
    });
  }

  /* ---------- Kurulum ekranı ---------- */
  function renderSetup() {
    fillChips("players", "player-list");
    fillChips("options", "option-list");
    var ok = S.players.length >= 2 && S.options.length >= 2;
    $("start-btn").disabled = !ok;
    $("start-hint").textContent = ok ? "Başlamadan önce son bir kontrol ekranı gelir." : "En az 2 katılımcı ve 2 seçenek gerekli.";
  }

  /* ---------- Sekmeler ve öneriler ---------- */
  function renderTabs() {
    ["setup", "games", "acts"].forEach(function (t) {
      $("tab-" + t).hidden = (tab !== t);
      $("tabbtn-" + t).setAttribute("aria-selected", tab === t ? "true" : "false");
    });
    if (tab === "games") renderSuggestions("o", "games");
    if (tab === "acts") renderSuggestions("e", "acts");
  }
  function renderSuggestions(type, prefix) {
    var n = S.players.length;
    $(prefix + "-info").textContent = S.options.length ? "Seçeneklerin (" + S.options.length + "): " + S.options.join(", ") : "Henüz seçenek eklemedin.";
    $(prefix + "-sub").textContent = n >= 2 ? n + " kişiye uygun öneriler gösteriliyor." : "Katılımcı ekleyince liste kişi sayına göre daralır.";
    $(prefix + "-filter").textContent = onlyFit ? "Hepsini göster" : "Sadece uygun olanlar";

    var box = $(prefix + "-list");
    box.textContent = "";
    var list = GAMES.filter(function (g) {
      return g.t === type && (!onlyFit || n < 2 || (n >= g.a && n <= g.b));
    });
    if (!list.length) box.appendChild(el("p", "Bu kişi sayısına uygun öneri yok.", "hint"));
    list.forEach(function (g) {
      var added = S.options.indexOf(g.n) > -1;
      var card = el("div", null, "game");
      card.appendChild(el("b", g.n));
      card.appendChild(el("small", g.a === g.b ? g.a + " kişi" : g.a + "–" + g.b + " kişi"));
      card.appendChild(el("p", g.d));
      var btn = el("button", added ? "Eklendi" : "Seçeneklere ekle");
      btn.disabled = added;
      btn.addEventListener("click", function () { addItem("options", g.n); });
      card.appendChild(btn);
      box.appendChild(card);
    });
  }

  /* ---------- Onay ekranı ---------- */
  function renderConfirm() {
    $("confirm-count").textContent = S.players.length + " katılımcı, " + S.options.length + " seçenek";
    $("confirm-players").textContent = "Katılımcılar: " + S.players.join(", ");
    $("confirm-options").textContent = "Seçenekler: " + S.options.join(", ");
  }
  function start() {
    S.stage = "vote";
    S.counts = S.options.map(function () { return 0; });
    S.current = 0; S.phase = "pick"; S.tie = null;
    confirming = false; sel = null;
    save(); render();
  }
  function reset() {
    S = fresh(); sel = null; confirming = false; tab = "setup";
    save(); render();
  }

  /* ---------- Oylama ekranı ---------- */
  function renderVote() {
    var n = S.players.length;
    $("vote-progress").textContent = S.current + " / " + n + " kişi oy kullandı";
    var done = S.phase === "done";
    show("vote-pick", !done);
    show("vote-done", done);
    if (done) {
      var last = S.current + 1 >= n;
      $("done-text").textContent = last ? "Herkes oy verdi." : "Telefonu sıradakine ver.";
      $("done-next").textContent = last ? "Sonucu göster" : "Sıradaki oy verecek";
      return;
    }
    $("vote-title").textContent = "Sıra " + S.players[S.current] + " kişisinde";
    var box = $("vote-options");
    box.textContent = "";
    S.options.forEach(function (text, i) {
      var b = el("button", text, "opt");
      b.setAttribute("aria-pressed", sel === i ? "true" : "false");
      b.addEventListener("click", function () { sel = i; render(); });
      box.appendChild(b);
    });
    $("vote-submit").disabled = (sel === null);
  }
  function submitVote() {
    if (sel === null) return;
    S.counts[sel]++;            // sadece sayaç artar, kimin oy verdiği saklanmaz
    S.phase = "done"; sel = null;
    save(); render();
  }
  function nextVoter() {
    if (S.current + 1 >= S.players.length) { S.stage = "result"; }
    else { S.current++; S.phase = "pick"; }
    sel = null;
    save(); render();
  }

  /* ---------- Sonuç ekranı ---------- */
  function tiedList() {
    var max = Math.max.apply(null, S.counts);
    var tied = [];
    S.counts.forEach(function (c, i) { if (c === max) tied.push(i); });
    return tied;
  }
  function drawTie() {
    var tied = tiedList();
    S.tie = tied[Math.floor(Math.random() * tied.length)];  // kura bir kez çekilir ve kaydedilir
    save(); render();
  }
  function renderResult() {
    var tied = tiedList();
    var win = tied.length === 1 ? tied[0] : S.tie;
    show("result-tie", win === null);
    show("result-winner", win !== null);
    if (win === null) {
      $("tie-text").textContent = tied.map(function (i) { return S.options[i]; }).join(", ") + " aynı oyu aldı.";
    } else {
      $("winner-label").textContent = tied.length > 1 ? "Kura sonucu" : "Kazanan";
      $("winner-name").textContent = S.options[win];
    }
    var total = S.counts.reduce(function (a, b) { return a + b; }, 0) || 1;
    var bars = $("result-bars");
    bars.textContent = "";
    S.options.map(function (o, i) { return i; })
      .sort(function (a, b) { return S.counts[b] - S.counts[a]; })
      .forEach(function (i) {
        var bar = el("div", null, "bar" + (i === win ? " win" : ""));
        var t = el("div", null, "t");
        t.appendChild(el("span", S.options[i]));
        t.appendChild(el("span", S.counts[i] + " oy"));
        var track = el("div", null, "b");
        var fill = document.createElement("i");
        fill.style.width = Math.round(S.counts[i] / total * 100) + "%";
        track.appendChild(fill);
        bar.appendChild(t);
        bar.appendChild(track);
        bars.appendChild(bar);
      });
  }

  /* ---------- Hangi ekran görünecek? ---------- */
  function render() {
    show("screen-setup", S.stage === "setup" && !confirming);
    show("screen-confirm", S.stage === "setup" && confirming);
    show("screen-vote", S.stage === "vote");
    show("screen-result", S.stage === "result");
    if (S.stage === "setup" && !confirming) { renderSetup(); renderTabs(); }
    if (S.stage === "setup" && confirming) renderConfirm();
    if (S.stage === "vote") renderVote();
    if (S.stage === "result") renderResult();
  }

  /* ---------- Butonları bağla (olaylar) ---------- */
  function top() { window.scrollTo(0, 0); }
  function wireAdd(list, inputId, btnId, errId) {
    function go() {
      var msg = addItem(list, $(inputId).value);
      $(errId).textContent = msg;
      if (!msg) $(inputId).value = "";
    }
    $(btnId).addEventListener("click", go);
    $(inputId).addEventListener("keydown", function (e) { if (e.key === "Enter") go(); });
  }
  wireAdd("players", "player-input", "player-add", "player-err");
  wireAdd("options", "option-input", "option-add", "option-err");

  ["setup", "games", "acts"].forEach(function (t) {
    $("tabbtn-" + t).addEventListener("click", function () { tab = t; render(); top(); });
  });
  Array.prototype.forEach.call(document.querySelectorAll(".goto-setup"), function (b) {
    b.addEventListener("click", function () { tab = "setup"; render(); top(); });
  });
  ["games", "acts"].forEach(function (p) {
    $(p + "-filter").addEventListener("click", function () { onlyFit = !onlyFit; render(); });
  });

  $("start-btn").addEventListener("click", function () { confirming = true; render(); top(); });
  $("confirm-start").addEventListener("click", start);
  $("confirm-back").addEventListener("click", function () { confirming = false; render(); });
  $("vote-submit").addEventListener("click", submitVote);
  $("done-next").addEventListener("click", nextVoter);
  $("draw-btn").addEventListener("click", drawTie);
  $("new-vote").addEventListener("click", reset);
  $("reset-btn").addEventListener("click", function () {
    if (confirm("Oylama sıfırlansın mı?")) reset();
  });

  render();   // sayfa açılınca kayıtlı duruma göre ekranı çiz
})();
