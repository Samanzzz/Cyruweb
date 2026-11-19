/* CyruTech Capital — internship application.
   A three-step form with a live "intern pass" preview; applications are
   delivered by Web3Forms (same key as the booking calendar). Without JS the
   form still posts straight to Web3Forms. */
(function () {
  "use strict";

  var CONFIG = {
    endpoint: "https://api.web3forms.com/submit",
    teamEmail: "team@cyrutech.com"
  };
  var root = document.querySelector("[data-ap]");
  if (!root) return;
  var form = root.querySelector("[data-ap-form]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var STEPS = ["role", "you", "send"];
  var q = function (sel) { return root.querySelector(sel); };
  var qa = function (sel) { return Array.prototype.slice.call(root.querySelectorAll(sel)); };
  var status = q("[data-ap-msg]");
  var submitBtn = q("[data-ap-submit]");
  var submitLabel = q("[data-ap-submit-label]");
  var idleLabel = submitLabel.textContent;
  var sending = false;

  root.classList.add("is-js");
  form.noValidate = true;

  /* ---------- Steps ---------- */
  var stage = "role";
  var showStep = function (name, focus) {
    stage = name;
    root.setAttribute("data-stage", name);
    qa("[data-ap-step]").forEach(function (el) {
      var on = el.getAttribute("data-ap-step") === name;
      el.hidden = !on;
      el.classList.toggle("is-active", on);
    });
    if (focus) {
      var target = name === "done" ? q("[data-ap-done-title]") : q('[data-ap-step="' + name + '"] .ap-legend');
      if (target) target.focus({ preventScroll: true });
      var top = root.getBoundingClientRect().top + window.scrollY - 120;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
    }
    paint();
  };

  /* ---------- Validation ---------- */
  var MESSAGES = {
    name: "Please enter your first and last name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a phone number we can reach you on.",
    resume: "Please paste a link to your résumé or cover letter.",
    acknowledgement: "Please confirm you understand the internship is unpaid."
  };
  var setError = function (el, id, msg) {
    if (el) el.setAttribute("aria-invalid", msg ? "true" : "false");
    var err = document.getElementById(id);
    if (err) err.textContent = msg;
  };
  var normalizeUrl = function (v) {
    v = v.trim();
    if (v && !/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) v = "https://" + v;
    return v;
  };
  var validUrl = function (v) {
    try { var u = new URL(v); return (u.protocol === "https:" || u.protocol === "http:") && /\./.test(u.hostname); } catch (e) { return false; }
  };
  var checkField = function (n) {
    var el = form.elements[n];
    var msg = "";
    if (n === "resume") {
      var v = normalizeUrl(el.value);
      msg = v && validUrl(v) ? "" : (el.value.trim() ? "That doesn't look like a valid link." : MESSAGES.resume);
    } else if (n === "name") {
      msg = el.value.trim().length >= 2 ? "" : MESSAGES.name;
    } else if (n === "phone") {
      msg = (el.value.replace(/\D/g, "").length >= 7) ? "" : MESSAGES.phone;
    } else if (n === "acknowledgement") {
      msg = el.checked ? "" : MESSAGES.acknowledgement;
    } else {
      msg = el.validity.valid && el.value.trim() ? "" : MESSAGES[n];
    }
    setError(el, "a-" + (n === "acknowledgement" ? "ack" : n) + "-error", msg);
    return msg ? el : null;
  };
  var roles = function () { return qa("[data-ap-role]").filter(function (c) { return c.checked; }).map(function (c) { return c.value; }); };
  var checkRoles = function () {
    var ok = roles().length > 0;
    document.getElementById("a-roles-error").textContent = ok ? "" : "Choose at least one role.";
    return ok ? null : qa("[data-ap-role]")[0];
  };
  var validate = function (step) {
    var bad = null;
    var take = function (el) { if (el && !bad) bad = el; };
    if (step === "role") take(checkRoles());
    if (step === "you") ["name", "email", "phone", "resume"].forEach(function (n) { take(checkField(n)); });
    if (step === "send") take(checkField("acknowledgement"));
    if (bad) bad.focus();
    return !bad;
  };
  ["name", "email", "phone", "resume"].forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener("input", function () { if (el.getAttribute("aria-invalid") === "true") checkField(n); paint(); });
    el.addEventListener("blur", function () { if (el.value.trim()) checkField(n); });
  });
  form.elements.acknowledgement.addEventListener("change", function () { checkField("acknowledgement"); paint(); });
  qa("[data-ap-role]").forEach(function (c) {
    c.addEventListener("change", function () { if (roles().length) document.getElementById("a-roles-error").textContent = ""; paint(); });
  });

  qa("[data-ap-next]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (!validate(stage)) return;
      showStep(STEPS[STEPS.indexOf(stage) + 1], true);
    });
  });
  qa("[data-ap-back]").forEach(function (b) {
    b.addEventListener("click", function () { showStep(STEPS[STEPS.indexOf(stage) - 1], true); });
  });
  /* Enter in a text field moves forward instead of submitting early */
  form.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" || e.target.tagName === "TEXTAREA" || e.target.tagName === "BUTTON") return;
    if (stage !== "send") { e.preventDefault(); var n = q('[data-ap-step="' + stage + '"] [data-ap-next]'); if (n) n.click(); }
  });

  /* ---------- Live pass ---------- */
  var out = function (k) { return q('[data-ap-out="' + k + '"]'); };
  var setOut = function (k, v) { var el = out(k); var t = v || el.getAttribute("data-empty"); if (el.textContent !== t) { el.textContent = t; el.classList.toggle("is-set", !!v); bump(el); } };
  var bump = function (el) { if (reduceMotion) return; el.classList.remove("is-bump"); void el.offsetWidth; el.classList.add("is-bump"); };
  var shortUrl = function (v) {
    v = normalizeUrl(v);
    if (!validUrl(v)) return "";
    var u = new URL(v); return u.hostname.replace(/^www\./, "") + (u.pathname.length > 1 ? "/…" : "");
  };
  var lastRoles = "";
  var paint = function () {
    var f = form.elements;
    setOut("name", f.name.value.trim());
    setOut("email", f.email.value.trim());
    setOut("phone", f.phone.value.trim());
    setOut("resume", shortUrl(f.resume.value));
    var r = roles(), key = r.join("|");
    if (key !== lastRoles) {
      lastRoles = key;
      var host = out("roles");
      host.textContent = "";
      if (!r.length) { var e = document.createElement("span"); e.className = "ap-pass-tag is-empty"; e.textContent = "Pick a role"; host.appendChild(e); }
      r.forEach(function (x) { var t = document.createElement("span"); t.className = "ap-pass-tag"; t.textContent = x; host.appendChild(t); });
    }
    var done = [r.length > 0, f.name.value.trim().length >= 2, f.email.validity.valid && !!f.email.value.trim(),
      f.phone.value.replace(/\D/g, "").length >= 7, validUrl(normalizeUrl(f.resume.value)), f.acknowledgement.checked];
    var pct = Math.round(done.filter(Boolean).length / done.length * 100);
    q("[data-ap-meter]").style.width = (stage === "done" ? 100 : pct) + "%";
  };

  /* Pass tilt (pointer devices only) */
  var pass = q(".ap-pass");
  if (pass && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    var raf = 0, px = 0, py = 0;
    var tilt = function () {
      raf = 0;
      var r = pass.getBoundingClientRect();
      var nx = (px - r.left) / r.width - 0.5, ny = (py - r.top) / r.height - 0.5;
      pass.style.setProperty("--rx", (-ny * 8).toFixed(2) + "deg");
      pass.style.setProperty("--ry", (nx * 10).toFixed(2) + "deg");
      pass.style.setProperty("--gx", ((nx + 0.5) * 100).toFixed(0) + "%");
      pass.style.setProperty("--gy", ((ny + 0.5) * 100).toFixed(0) + "%");
    };
    pass.addEventListener("pointermove", function (e) { px = e.clientX; py = e.clientY; if (!raf) raf = requestAnimationFrame(tilt); });
    pass.addEventListener("pointerleave", function () { pass.style.setProperty("--rx", "0deg"); pass.style.setProperty("--ry", "0deg"); });
  }

  /* ---------- Confetti ---------- */
  var confetti = function () {
    var host = q("[data-ap-confetti]");
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
  var setStatus = function (st, text) { status.setAttribute("data-state", st); status.textContent = text; };
  var listRoles = function (r) { return r.length < 2 ? r.join("") : r.slice(0, -1).join(", ") + " and " + r[r.length - 1]; };

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    for (var i = 0; i < STEPS.length; i++) {
      if (STEPS[i] === stage) { if (!validate(stage)) return; break; }
      if (!validate(STEPS[i])) { showStep(STEPS[i], false); validate(STEPS[i]); return; }
    }
    var f = form.elements;
    var r = roles();
    var name = f.name.value.trim(), email = f.email.value.trim();
    var resume = normalizeUrl(f.resume.value);
    var ref = "CT-" + new Date().getFullYear().toString().slice(2) + Math.random().toString(36).slice(2, 6).toUpperCase();

    var finish = function () {
      q("[data-ap-done-name]").textContent = name.split(/\s+/)[0];
      q("[data-ap-done-roles]").textContent = listRoles(r);
      q("[data-ap-done-email]").textContent = email;
      setOut("ref", ref);
      var st = q("[data-ap-status]"); st.textContent = "Submitted"; st.classList.add("is-sent");
      showStep("done", true);
      confetti();
    };

    if (f.company_site.value) { finish(); return; } // honeypot: bots get a fake success

    var payload = {
      access_key: f.access_key.value,
      subject: "Internship application: " + name + " — " + r.join(", "),
      from_name: "CyruTech careers",
      replyto: email,
      reference: ref,
      name: name,
      email: email,
      phone: f.phone.value.trim(),
      positions: r.join(", "),
      "résumé / cover letter": resume,
      "unpaid internship": "I certify — " + f.acknowledgement.closest("label").querySelector(".ap-ack-text").textContent.replace(/^I certify\.\s*/, ""),
      "questions for the recruiter": f.questions.value.trim() || "—"
    };

    sending = true;
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
      .then(function (res) {
        if (res.ok && res.json && res.json.success) finish();
        else setStatus("error", "We couldn't send your application" + (res.json && res.json.message ? " (" + res.json.message + ")" : "") + ". Please try again or email " + CONFIG.teamEmail + ".");
      })
      .catch(function () {
        setStatus("error", "We couldn't reach our application service. Please check your connection and try again, or email " + CONFIG.teamEmail + ".");
      })
      .then(function () {
        if (timer) window.clearTimeout(timer);
        sending = false;
        submitBtn.disabled = false; submitBtn.removeAttribute("aria-busy");
        submitLabel.textContent = idleLabel;
      });
  });

  showStep("role", false);
})();
