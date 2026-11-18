/* CyruTech Capital — consultation booking.
   Availability is generated from business hours (no server), requests are
   delivered by Web3Forms, and both sides get one-click Google Calendar links. */
(function () {
  "use strict";

  var CONFIG = {
    accessKey: "318db7ff-a710-47ee-9852-d56ada295461", // Web3Forms (same key as the Next.js site)
    endpoint: "https://api.web3forms.com/submit",
    businessTz: "America/Los_Angeles",
    days: [1, 2, 3, 4, 5],          // Mon–Fri (0 = Sunday)
    startMinutes: 9 * 60,           // 9:00 AM Pacific
    endMinutes: 17 * 60,            // 5:00 PM Pacific (last slot ends here)
    slotMinutes: 30,
    minNoticeHours: 12,
    windowDays: 28,
    teamEmail: "team@cyrutech.com",
    eventTitle: "CyruTech consultation"
  };

  var root = document.querySelector("[data-booking]");
  if (!root) return;

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var visitorTz = (Intl.DateTimeFormat().resolvedOptions().timeZone) || "UTC";

  /* ---------- Time zone helpers (no libraries) ---------- */
  var partsCache = {};
  var tzParts = function (ts, tz) {
    var fmt = partsCache[tz] || (partsCache[tz] = new Intl.DateTimeFormat("en-US", {
      timeZone: tz, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric",
      hour: "numeric", minute: "numeric", second: "numeric", weekday: "short"
    }));
    var out = {};
    fmt.formatToParts(new Date(ts)).forEach(function (p) { out[p.type] = p.value; });
    return {
      y: +out.year, m: +out.month, d: +out.day,
      h: +out.hour % 24, mi: +out.minute, s: +out.second,
      wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(out.weekday)
    };
  };
  var offsetMinutes = function (ts, tz) {
    var p = tzParts(ts, tz);
    var asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi, p.s);
    return Math.round((asUtc - Math.floor(ts / 1000) * 1000) / 60000);
  };
  /* Wall-clock time in a zone -> UTC timestamp (handles DST). */
  var zonedToUtc = function (y, m, d, h, mi, tz) {
    var wall = Date.UTC(y, m - 1, d, h, mi);
    var ts = wall - offsetMinutes(wall, tz) * 60000;
    ts = wall - offsetMinutes(ts, tz) * 60000;
    return ts;
  };
  var pad = function (n) { return (n < 10 ? "0" : "") + n; };
  var localKey = function (ts) {
    var d = new Date(ts);
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  };

  /* ---------- Slot generation ---------- */
  var buildSlots = function () {
    var now = Date.now();
    var earliest = now + CONFIG.minNoticeHours * 3600000;
    var today = tzParts(now, CONFIG.businessTz);
    var byDay = {};
    var keys = [];
    for (var i = 0; i <= CONFIG.windowDays; i++) {
      var base = new Date(Date.UTC(today.y, today.m - 1, today.d + i));
      var y = base.getUTCFullYear(), m = base.getUTCMonth() + 1, d = base.getUTCDate();
      if (CONFIG.days.indexOf(base.getUTCDay()) === -1) continue;
      for (var t = CONFIG.startMinutes; t + CONFIG.slotMinutes <= CONFIG.endMinutes; t += CONFIG.slotMinutes) {
        var start = zonedToUtc(y, m, d, Math.floor(t / 60), t % 60, CONFIG.businessTz);
        if (start < earliest) continue;
        var key = localKey(start);
        if (!byDay[key]) { byDay[key] = []; keys.push(key); }
        byDay[key].push(start);
      }
    }
    keys.sort();
    keys.forEach(function (k) { byDay[k].sort(function (a, b) { return a - b; }); });
    return { byDay: byDay, keys: keys };
  };

  /* ---------- Formatting ---------- */
  var fmtTime = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  var fmtDayLong = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" });
  var fmtMonth = new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" });
  var fmtFull = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
  var fmtPacific = new Intl.DateTimeFormat("en-US", { timeZone: CONFIG.businessTz, weekday: "long", month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" });
  var tzShort = (function () {
    try {
      var p = new Intl.DateTimeFormat(undefined, { timeZoneName: "short" }).formatToParts(new Date());
      for (var i = 0; i < p.length; i++) if (p[i].type === "timeZoneName") return p[i].value;
    } catch (e) { /* ignore */ }
    return "";
  })();
  var keyToDate = function (key) {
    var a = key.split("-");
    return new Date(+a[0], +a[1] - 1, +a[2], 12);
  };

  /* ---------- Calendar links ---------- */
  var gcalStamp = function (ts) { return new Date(ts).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
  var gcalLink = function (start, title, details, guest) {
    var end = start + CONFIG.slotMinutes * 60000;
    var q = "action=TEMPLATE" +
      "&text=" + encodeURIComponent(title) +
      "&dates=" + gcalStamp(start) + "/" + gcalStamp(end) +
      "&details=" + encodeURIComponent(details) +
      (guest ? "&add=" + encodeURIComponent(guest) : "");
    return "https://calendar.google.com/calendar/render?" + q;
  };
  var icsEscape = function (s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n"); };
  var icsFile = function (start, title, details, name, email) {
    var end = start + CONFIG.slotMinutes * 60000;
    var uid = start + "-" + Math.random().toString(36).slice(2) + "@cyrutech.com";
    return [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CyruTech Capital//Booking//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      "UID:" + uid,
      "DTSTAMP:" + gcalStamp(Date.now()),
      "DTSTART:" + gcalStamp(start),
      "DTEND:" + gcalStamp(end),
      "SUMMARY:" + icsEscape(title),
      "DESCRIPTION:" + icsEscape(details),
      "ORGANIZER;CN=CyruTech Capital:mailto:" + CONFIG.teamEmail,
      "ATTENDEE;CN=" + icsEscape(name) + ";RSVP=TRUE:mailto:" + email,
      "STATUS:TENTATIVE",
      "END:VEVENT", "END:VCALENDAR", ""
    ].join("\r\n");
  };


  /* ---------- Elements ---------- */
  var q = function (sel) { return root.querySelector(sel); };
  var steps = {
    pick: q('[data-bk-step="pick"]'),
    details: q('[data-bk-step="details"]'),
    done: q('[data-bk-step="done"]')
  };
  var monthLabel = q("[data-bk-month]");
  var prevBtn = q("[data-bk-prev]");
  var nextBtn = q("[data-bk-next]");
  var grid = q("[data-bk-grid]");
  var dayLabel = q("[data-bk-day]");
  var slotWrap = q("[data-bk-slots]");
  var tzLabels = root.querySelectorAll("[data-bk-tz]");
  var chosenLabels = root.querySelectorAll("[data-bk-chosen]");
  var form = q("form[data-bk-form]");
  var status = q("[data-bk-status]");
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn.querySelector(".btn-label");
  var idleLabel = submitLabel.textContent;
  var sky = q("[data-bk-sky]");
  var arc = q("[data-bk-arc]");
  var sun = q("[data-bk-sun]");
  var pTime = q("[data-bk-ptime]");
  var pSub = q("[data-bk-psub]");

  var data = buildSlots();
  var state = { month: null, day: null, slot: null, sending: false };
  var sameZone = offsetMinutes(Date.now(), visitorTz) === offsetMinutes(Date.now(), CONFIG.businessTz);
  var fmtPacificTime = new Intl.DateTimeFormat("en-US", { timeZone: CONFIG.businessTz, hour: "numeric", minute: "2-digit" });

  tzLabels.forEach(function (el) { el.textContent = visitorTz.replace(/_/g, " ") + (tzShort ? " (" + tzShort + ")" : ""); });

  /* ---------- Live clocks ---------- */
  (function () {
    var clocks = Array.prototype.slice.call(root.querySelectorAll("[data-clock]"));
    if (!clocks.length) return;
    var wrap = q("[data-bk-clocks]");
    if (sameZone) {
      clocks[1].hidden = true;
      clocks[0].querySelector(".ck-label").textContent = "La Jolla · same as you";
      if (wrap) wrap.classList.add("is-single");
    }
    var fmts = {};
    var tick = function () {
      var now = Date.now();
      clocks.forEach(function (c) {
        if (c.hidden) return;
        var tz = c.getAttribute("data-clock") === "local" ? visitorTz : c.getAttribute("data-clock");
        var p = tzParts(now, tz);
        var ms = now % 1000;
        var sec = p.s + (reduceMotion ? 0 : ms / 1000);
        var set = function (hand, deg) {
          var el = c.querySelector('[data-hand="' + hand + '"]');
          if (el) el.setAttribute("transform", "rotate(" + deg.toFixed(2) + " 32 32)");
        };
        set("h", (p.h % 12) * 30 + p.mi * 0.5);
        set("m", p.mi * 6 + p.s * 0.1);
        set("s", sec * 6);
        var f = fmts[tz] || (fmts[tz] = new Intl.DateTimeFormat(undefined, { timeZone: tz, hour: "numeric", minute: "2-digit" }));
        var t = c.querySelector("[data-clock-time]");
        var txt = f.format(new Date(now));
        if (t.textContent !== txt) t.textContent = txt;
      });
    };
    tick();
    if (reduceMotion) window.setInterval(tick, 1000);
    else (function loop() { tick(); window.requestAnimationFrame(loop); })();
  })();

  /* ---------- Steps ---------- */
  var showStep = function (name, focusEl) {
    Object.keys(steps).forEach(function (k) {
      steps[k].hidden = k !== name;
      steps[k].classList.toggle("is-active", k === name);
    });
    root.setAttribute("data-stage", name);
    if (focusEl) focusEl.focus({ preventScroll: true });
    var top = steps[name].getBoundingClientRect().top;
    if (top < 80 || top > window.innerHeight * 0.6) {
      window.scrollTo({ top: window.scrollY + top - 140, behavior: reduceMotion ? "auto" : "smooth" });
    }
  };

  /* ---------- Sun / sky preview ---------- */
  var arcLen = arc && arc.getTotalLength ? arc.getTotalLength() : 0;
  var mix = function (a, b, t) {
    return "rgb(" + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(",") + ")";
  };
  var previewSlot = function (ts) {
    if (!ts || !sky) return;
    var d = new Date(ts);
    var hour = d.getHours() + d.getMinutes() / 60;
    var night = hour < 6 || hour >= 20;
    var t = Math.max(0, Math.min(1, (hour - 6) / 14));
    sky.classList.toggle("is-night", night);
    if (arcLen) {
      var pt = arc.getPointAtLength((night ? 0.5 : t) * arcLen);
      sun.setAttribute("transform", "translate(" + pt.x.toFixed(1) + " " + pt.y.toFixed(1) + ")");
    }
    /* morning gold -> midday -> evening coral */
    var c1 = t < 0.5 ? mix([255, 214, 102], [255, 236, 170], t * 2) : mix([255, 236, 170], [255, 140, 90], (t - 0.5) * 2);
    sky.style.setProperty("--sun", night ? "#e8ecf5" : c1);
    sky.style.setProperty("--sky-top", night ? "#0b1424" : (t < 0.5 ? mix([255, 243, 214], [226, 245, 233], t * 2) : mix([226, 245, 233], [255, 226, 205], (t - 0.5) * 2)));
    pTime.textContent = fmtTime.format(d);
    pSub.textContent = sameZone
      ? (night ? "After hours for you" : "La Jolla time")
      : fmtPacificTime.format(d) + " in La Jolla" + (night ? " · night for you" : "");
  };

  /* ---------- Calendar ---------- */
  var monthKey = function (key) { return key.slice(0, 7); };
  var months = [];
  var computeMonths = function () {
    months = [];
    data.keys.forEach(function (k) { var mk = monthKey(k); if (months.indexOf(mk) === -1) months.push(mk); });
  };
  computeMonths();
  var maxPerDay = (CONFIG.endMinutes - CONFIG.startMinutes) / CONFIG.slotMinutes;

  var renderMonth = function (direction) {
    var mk = state.month;
    var parts = mk.split("-");
    var y = +parts[0], m = +parts[1];
    var first = new Date(y, m - 1, 1, 12);
    var daysInMonth = new Date(y, m, 0).getDate();

    monthLabel.textContent = "";
    var mName = document.createElement("span");
    mName.className = "serif";
    mName.textContent = new Intl.DateTimeFormat(undefined, { month: "long" }).format(first);
    var yName = document.createElement("span");
    yName.className = "bk-year";
    yName.textContent = String(y);
    monthLabel.appendChild(mName);
    monthLabel.appendChild(document.createTextNode(" "));
    monthLabel.appendChild(yName);
    monthLabel.setAttribute("aria-label", fmtMonth.format(first));

    prevBtn.disabled = months.indexOf(mk) <= 0;
    nextBtn.disabled = months.indexOf(mk) >= months.length - 1;

    grid.textContent = "";
    grid.classList.remove("slide-next", "slide-prev");
    var lead = first.getDay();
    for (var i = 0; i < lead; i++) {
      var blank = document.createElement("span");
      blank.className = "bk-day bk-day--blank";
      blank.setAttribute("aria-hidden", "true");
      grid.appendChild(blank);
    }
    var todayKey = localKey(Date.now());
    for (var d = 1; d <= daysInMonth; d++) {
      var key = y + "-" + pad(m) + "-" + pad(d);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bk-day";
      var num = document.createElement("span");
      num.className = "bk-num";
      num.textContent = String(d);
      btn.appendChild(num);
      btn.setAttribute("data-key", key);
      var count = data.byDay[key] ? data.byDay[key].length : 0;
      var date = keyToDate(key);
      btn.setAttribute("aria-label", fmtDayLong.format(date) + (count ? ", " + count + " times available" : ", unavailable"));
      if (!count) btn.disabled = true;
      else {
        var meter = document.createElement("i");
        meter.className = "bk-meter";
        meter.style.setProperty("--fill", Math.max(0.2, Math.min(1, count / maxPerDay)).toFixed(2));
        btn.appendChild(meter);
      }
      if (key === todayKey) btn.classList.add("is-today");
      var sel = key === state.day;
      btn.classList.toggle("is-selected", sel);
      btn.setAttribute("aria-pressed", sel ? "true" : "false");
      btn.style.setProperty("--i", lead + d);
      grid.appendChild(btn);
    }
    if (direction && !reduceMotion) {
      void grid.offsetWidth;
      grid.classList.add(direction > 0 ? "slide-next" : "slide-prev");
    }
  };

  var groupName = function (ts) {
    var h = new Date(ts).getHours();
    return h < 12 ? "Morning" : h < 17 ? "Afternoon" : "Evening";
  };

  var renderSlots = function () {
    slotWrap.textContent = "";
    if (!state.day) return;
    dayLabel.textContent = fmtDayLong.format(keyToDate(state.day));
    var groups = {};
    var order = [];
    data.byDay[state.day].forEach(function (ts) {
      var g = groupName(ts);
      if (!groups[g]) { groups[g] = []; order.push(g); }
      groups[g].push(ts);
    });
    var idx = 0;
    order.forEach(function (g) {
      var head = document.createElement("p");
      head.className = "bk-group bk-group--" + g.toLowerCase();
      head.textContent = g;
      slotWrap.appendChild(head);
      var ul = document.createElement("ul");
      ul.className = "bk-slots";
      groups[g].forEach(function (ts) {
        var li = document.createElement("li");
        li.className = "bk-slot-item";
        li.style.setProperty("--i", idx++);
        var b = document.createElement("button");
        b.type = "button";
        b.className = "bk-slot";
        b.setAttribute("data-ts", String(ts));
        b.setAttribute("aria-pressed", "false");
        b.textContent = fmtTime.format(new Date(ts));
        b.setAttribute("aria-label", fmtFull.format(new Date(ts)));
        var go = document.createElement("button");
        go.type = "button";
        go.className = "bk-continue";
        go.setAttribute("data-bk-continue", "");
        go.tabIndex = -1;
        go.innerHTML = 'Continue <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
        li.appendChild(b);
        li.appendChild(go);
        ul.appendChild(li);
      });
      slotWrap.appendChild(ul);
    });
    previewSlot(state.slot && localKey(state.slot) === state.day ? state.slot : data.byDay[state.day][0]);
  };

  var selectSlot = function (ts) {
    state.slot = ts;
    slotWrap.querySelectorAll(".bk-slot-item").forEach(function (li) {
      var b = li.querySelector(".bk-slot");
      var on = Number(b.getAttribute("data-ts")) === ts;
      li.classList.toggle("is-selected", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
      li.querySelector(".bk-continue").tabIndex = on ? 0 : -1;
    });
    previewSlot(ts);
  };

  var proceed = function () {
    if (!state.slot) return;
    var label = fmtFull.format(new Date(state.slot));
    chosenLabels.forEach(function (el) { el.textContent = label; });
    showStep("details", form.elements.name);
  };

  var selectDay = function (key, direction) {
    var monthChanged = state.month !== monthKey(key);
    state.day = key;
    state.month = monthKey(key);
    renderMonth(monthChanged ? direction : 0);
    renderSlots();
  };

  if (!data.keys.length) {
    root.classList.add("is-empty");
    steps.pick.innerHTML = '<p class="bk-empty">No times are open right now. Email <a href="mailto:' + CONFIG.teamEmail + '">' + CONFIG.teamEmail + "</a> and we'll find one.</p>";
    return;
  }
  selectDay(data.keys[0]);
  root.classList.add("is-ready");

  prevBtn.addEventListener("click", function () {
    var i = months.indexOf(state.month);
    if (i > 0) { state.month = months[i - 1]; renderMonth(-1); }
  });
  nextBtn.addEventListener("click", function () {
    var i = months.indexOf(state.month);
    if (i < months.length - 1) { state.month = months[i + 1]; renderMonth(1); }
  });
  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".bk-day[data-key]");
    if (!b || b.disabled) return;
    state.slot = null;
    selectDay(b.getAttribute("data-key"));
    var again = grid.querySelector('[data-key="' + state.day + '"]');
    if (again) again.focus({ preventScroll: true });
  });
  slotWrap.addEventListener("click", function (e) {
    if (e.target.closest("[data-bk-continue]")) { proceed(); return; }
    var b = e.target.closest(".bk-slot");
    if (!b) return;
    var ts = Number(b.getAttribute("data-ts"));
    if (state.slot === ts) { proceed(); return; }
    selectSlot(ts);
  });
  var hoverPreview = function (e) {
    var b = e.target.closest && e.target.closest(".bk-slot");
    if (b) previewSlot(Number(b.getAttribute("data-ts")));
  };
  slotWrap.addEventListener("pointerover", hoverPreview);
  slotWrap.addEventListener("focusin", hoverPreview);
  slotWrap.addEventListener("pointerleave", function () {
    previewSlot(state.slot && localKey(state.slot) === state.day ? state.slot : data.byDay[state.day][0]);
  });
  root.querySelectorAll("[data-bk-back]").forEach(function (b) {
    b.addEventListener("click", function () {
      showStep("pick");
      var sel = slotWrap.querySelector('.bk-slot[data-ts="' + state.slot + '"]');
      if (sel) sel.focus({ preventScroll: true });
    });
  });

  /* Topic from ?topic= */
  var topicParam = new URLSearchParams(window.location.search).get("topic");
  var topicMap = { consulting: "Consulting", investment: "Investment / fundraising", sulldog: "Website or app (SullDog)", bootcamp: "Bootcamp" };
  if (topicParam && topicMap[topicParam] && form.elements.topic) form.elements.topic.value = topicMap[topicParam];

  /* Phone becomes required for phone calls */
  var syncFormat = function () {
    var phoneCall = form.elements.format.value === "Phone call";
    form.elements.phone.required = phoneCall;
    var opt = root.querySelector("[data-bk-phone-opt]");
    if (opt) opt.hidden = phoneCall;
  };
  Array.prototype.forEach.call(form.querySelectorAll('input[name="format"]'), function (r) { r.addEventListener("change", syncFormat); });
  syncFormat();

  /* ---------- Validation ---------- */
  var MESSAGES = {
    name: "Please enter your name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a phone number for the call.",
    topic: "Please choose a topic."
  };
  var FIELDS = ["name", "email", "phone", "company", "topic", "notes"];
  var errorFor = function (el) { return el.validity.valid ? "" : (MESSAGES[el.name] || el.validationMessage); };
  var setError = function (el, msg) {
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    var err = document.getElementById(el.id + "-error");
    if (err) err.textContent = msg;
  };
  FIELDS.forEach(function (n) {
    var el = form.elements[n];
    if (!el) return;
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") setError(el, errorFor(el)); });
    el.addEventListener("blur", function () { if (el.value.trim()) setError(el, errorFor(el)); });
  });
  var setStatus = function (st, text) { status.setAttribute("data-state", st); status.textContent = text; };

  /* ---------- Confetti ---------- */
  var confetti = function () {
    var host = q("[data-bk-confetti]");
    if (!host || reduceMotion) return;
    host.textContent = "";
    var colors = ["#1db954", "#3ee07a", "#ffd84d", "#0a0f0d", "#ff8c5a"];
    for (var i = 0; i < 46; i++) {
      var piece = document.createElement("i");
      var angle = (Math.random() * 140 + 20) * Math.PI / 180;
      var dist = 90 + Math.random() * 170;
      piece.style.setProperty("--x", (Math.cos(angle) * dist * (Math.random() < 0.5 ? -1 : 1)).toFixed(0) + "px");
      piece.style.setProperty("--y", (-Math.sin(angle) * dist).toFixed(0) + "px");
      piece.style.setProperty("--r", (Math.random() * 720 - 360).toFixed(0) + "deg");
      piece.style.setProperty("--d", (Math.random() * 0.15).toFixed(2) + "s");
      piece.style.background = colors[i % colors.length];
      if (i % 3 === 0) piece.style.borderRadius = "50%";
      host.appendChild(piece);
    }
    window.setTimeout(function () { host.textContent = ""; }, 2400);
  };

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (state.sending || !state.slot) return;
    FIELDS.forEach(function (n) { var el = form.elements[n]; if (el && el.value.trim() === "") el.value = ""; });
    var firstBad = null;
    FIELDS.forEach(function (n) {
      var el = form.elements[n];
      if (!el) return;
      var msg = errorFor(el);
      setError(el, msg);
      if (msg && !firstBad) firstBad = el;
    });
    if (firstBad) { setStatus("error", "Please check the highlighted fields."); firstBad.focus(); return; }

    var v = function (n) { return form.elements[n] ? form.elements[n].value.trim() : ""; };
    var name = v("name"), email = v("email"), format = form.elements.format.value;
    var pacific = fmtPacific.format(new Date(state.slot));
    var local = fmtFull.format(new Date(state.slot)) + " — " + visitorTz;
    var teamDetails = "Consultation request from the CyruTech website\n\n" +
      "Name: " + name + "\nEmail: " + email + (v("phone") ? "\nPhone: " + v("phone") : "") +
      (v("company") ? "\nCompany: " + v("company") : "") + "\nTopic: " + v("topic") + "\nFormat: " + format +
      (v("notes") ? "\n\nNotes:\n" + v("notes") : "");
    var visitorDetails = "Your consultation request with CyruTech Capital (" + v("topic") + ", " + format.toLowerCase() + ").\n" +
      "We'll confirm by email. Questions: " + CONFIG.teamEmail;

    var finish = function () {
      root.querySelector("[data-bk-gcal]").href = gcalLink(state.slot, CONFIG.eventTitle, visitorDetails, CONFIG.teamEmail);
      root.querySelector("[data-bk-ics]").onclick = function () {
        var blob = new Blob([icsFile(state.slot, CONFIG.eventTitle, visitorDetails, name, email)], { type: "text/calendar;charset=utf-8" });
        var url = URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url; a.download = "cyrutech-consultation.ics";
        document.body.appendChild(a); a.click(); a.remove();
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      };
      root.querySelector("[data-bk-email]").textContent = email;
      showStep("done", root.querySelector("[data-bk-done-title]"));
      confetti();
    };

    /* Honeypot: pretend success for bots, send nothing. */
    if (form.elements.company_site && form.elements.company_site.value) { finish(); return; }

    var payload = {
      access_key: CONFIG.accessKey,
      subject: "Consultation request: " + name + " — " + pacific,
      from_name: "CyruTech website",
      name: name,
      email: email,
      phone: v("phone") || "—",
      company: v("company") || "—",
      topic: v("topic"),
      format: format,
      "requested time (Pacific)": pacific,
      "requested time (visitor)": local,
      notes: v("notes") || "—",
      "add to Google Calendar": gcalLink(state.slot, CONFIG.eventTitle + " — " + name, teamDetails, email)
    };

    state.sending = true;
    setStatus("", "");
    submitBtn.disabled = true; submitBtn.setAttribute("aria-busy", "true");
    submitLabel.textContent = "Sending…";
    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, 15000) : null;

    fetch(CONFIG.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (json) { return { ok: res.ok, json: json }; }); })
      .then(function (r) {
        if (r.ok && r.json && r.json.success) finish();
        else setStatus("error", "We couldn't send your request" + (r.json && r.json.message ? " (" + r.json.message + ")" : "") + ". Please try again or email " + CONFIG.teamEmail + ".");
      })
      .catch(function () {
        setStatus("error", "We couldn't reach our booking service. Please check your connection and try again, or email " + CONFIG.teamEmail + ".");
      })
      .then(function () {
        if (timer) window.clearTimeout(timer);
        state.sending = false;
        submitBtn.disabled = false; submitBtn.removeAttribute("aria-busy");
        submitLabel.textContent = idleLabel;
      });
  });

  /* Book another */
  var again = root.querySelector("[data-bk-again]");
  if (again) again.addEventListener("click", function () {
    form.reset(); syncFormat();
    FIELDS.forEach(function (n) { var el = form.elements[n]; if (el) setError(el, ""); });
    setStatus("", "");
    data = buildSlots();
    computeMonths();
    if (!data.keys.length) { window.location.reload(); return; }
    var keep = data.byDay[state.day] ? state.day : data.keys[0];
    state.slot = null;
    state.month = null;
    selectDay(keep);
    showStep("pick");
  });
})();
