/* CyruTech Capital — internship application (conversational form).
   Applications are delivered by Web3Forms (same key as the booking calendar).
   Without JavaScript the form posts straight to Web3Forms with native validation. */
(function () {
  "use strict";

  var ENDPOINT = "https://api.web3forms.com/submit";
  var TEAM_EMAIL = "team@cyrutech.com";
  var form = document.querySelector("[data-cv]");
  if (!form) return;
  var done = document.querySelector("[data-cv-done]");
  var status = form.querySelector("[data-cv-msg]");
  var submitBtn = form.querySelector("[data-cv-submit]");
  var submitLabel = form.querySelector("[data-cv-label]");
  var idleLabel = submitLabel.textContent;
  var rolesGroup = form.querySelector(".cv-line--roles");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sending = false;

  form.noValidate = true;
  var f = form.elements;

  /* ---------- Helpers ---------- */
  var normalizeUrl = function (v) {
    v = v.trim();
    if (v && !/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) v = "https://" + v;
    return v;
  };
  var validUrl = function (v) {
    try {
      var u = new URL(v);
      return (u.protocol === "https:" || u.protocol === "http:") && /\.[a-z]{2,}$/i.test(u.hostname);
    } catch (e) { return false; }
  };
  var validEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); };
  var roles = function () {
    return Array.prototype.filter.call(form.querySelectorAll("[data-cv-role]"), function (c) { return c.checked; })
      .map(function (c) { return c.value; });
  };
  var listRoles = function (r) { return r.length < 2 ? r.join("") : r.slice(0, -1).join(", ") + " and " + r[r.length - 1]; };

  /* ---------- Validation ---------- */
  var RULES = {
    name: function () { return f.name.value.trim().length >= 2 ? "" : "Please enter your full name."; },
    roles: function () { return roles().length ? "" : "Pick at least one role."; },
    email: function () {
      var v = f.email.value.trim();
      return !v ? "Please enter your school email." : (validEmail(v) ? "" : "That email doesn't look right.");
    },
    phone: function () { return f.phone.value.replace(/\D/g, "").length >= 7 ? "" : "Please enter a phone number we can reach you on."; },
    resume: function () {
      var v = f.resume.value.trim();
      return !v ? "Please add a link to your résumé or cover letter." : (validUrl(normalizeUrl(v)) ? "" : "That doesn't look like a valid link.");
    },
    acknowledgement: function () { return f.acknowledgement.checked ? "" : "Please confirm you understand the internship is unpaid."; }
  };
  var ORDER = ["name", "roles", "email", "phone", "resume", "acknowledgement"];
  var ERR_ID = { name: "a-name-error", roles: "a-roles-error", email: "a-email-error", phone: "a-phone-error", resume: "a-resume-error", acknowledgement: "a-ack-error" };
  var target = function (key) { return key === "roles" ? rolesGroup : f[key]; };
  var check = function (key) {
    var msg = RULES[key]();
    target(key).setAttribute("aria-invalid", msg ? "true" : "false");
    document.getElementById(ERR_ID[key]).textContent = msg;
    return msg;
  };
  var touched = {};
  ["name", "email", "phone", "resume"].forEach(function (key) {
    f[key].addEventListener("blur", function () { if (f[key].value.trim()) { touched[key] = true; check(key); } });
    f[key].addEventListener("input", function () { if (touched[key]) check(key); });
  });
  Array.prototype.forEach.call(form.querySelectorAll("[data-cv-role]"), function (c) {
    c.addEventListener("change", function () { if (rolesGroup.getAttribute("aria-invalid") === "true") check("roles"); });
  });
  f.acknowledgement.addEventListener("change", function () { if (f.acknowledgement.getAttribute("aria-invalid") === "true") check("acknowledgement"); });
  f.resume.addEventListener("blur", function () {
    var v = f.resume.value.trim();
    if (v && validUrl(normalizeUrl(v))) { f.resume.value = normalizeUrl(v); f.resume.dispatchEvent(new Event("change")); }
  });

  var setStatus = function (state, text) { status.setAttribute("data-state", state); status.textContent = text; };

  /* Clear the summary message once everything that was flagged is fixed. */
  form.addEventListener("input", function () { if (status.textContent && !form.querySelector('[aria-invalid="true"]')) setStatus("", ""); });
  form.addEventListener("change", function () { if (status.textContent && !form.querySelector('[aria-invalid="true"]')) setStatus("", ""); });

  /* Size the blanks to their text where CSS field-sizing isn't supported (Safari, Firefox). */
  if (!(window.CSS && CSS.supports && CSS.supports("field-sizing", "content"))) {
    var canvas = document.createElement("canvas").getContext("2d");
    var MIN_EM = { "a-name": 7, "a-email": 6.4, "a-phone": 6.4, "a-resume": 10, "a-questions": 4.5 };
    var fit = function (el) {
      var cs = getComputedStyle(el);
      if (window.matchMedia("(max-width: 599px)").matches) { el.style.width = ""; return; }
      canvas.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
      var size = parseFloat(cs.fontSize);
      var text = el.value || el.placeholder || "";
      var w = canvas.measureText(text).width + (parseFloat(cs.letterSpacing) || 0) * text.length;
      var px = Math.max(w + size * 0.35, (MIN_EM[el.id] || 5) * size);
      el.style.width = Math.ceil(px) + "px";
    };
    var blanks = Array.prototype.slice.call(form.querySelectorAll(".cv-in"));
    var fitAll = function () { blanks.forEach(fit); };
    blanks.forEach(function (el) { el.addEventListener("input", function () { fit(el); }); el.addEventListener("change", function () { fit(el); }); });
    window.addEventListener("resize", fitAll);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
    fitAll();
  }

  /* ---------- Submit ---------- */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (sending) return;
    var firstBad = null;
    ORDER.forEach(function (key) { touched[key] = true; if (check(key) && !firstBad) firstBad = key; });
    if (firstBad) {
      setStatus("error", "Please fill in the highlighted parts.");
      var el = firstBad === "roles" ? form.querySelector("[data-cv-role]") : f[firstBad];
      el.focus();
      return;
    }
    setStatus("", "");

    var r = roles();
    var name = f.name.value.trim();
    var email = f.email.value.trim();
    var ref = "CT-" + String(new Date().getFullYear()).slice(2) + Math.random().toString(36).slice(2, 6).toUpperCase();

    var finish = function () {
      done.querySelector("[data-cv-done-name]").textContent = name.split(/\s+/)[0];
      done.querySelector("[data-cv-done-roles]").textContent = listRoles(r);
      done.querySelector("[data-cv-done-email]").textContent = email;
      form.hidden = true;
      done.hidden = false;
      done.querySelector("[data-cv-done-title]").focus({ preventScroll: true });
      var top = done.getBoundingClientRect().top + window.scrollY - 140;
      window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
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
      "résumé / cover letter": normalizeUrl(f.resume.value),
      "unpaid internship": "I certify — " + form.querySelector(".cv-terms p").textContent.trim(),
      "questions for the recruiter": f.questions.value.trim() || "—"
    };

    sending = true;
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy", "true");
    submitLabel.textContent = "Sending…";
    var controller = "AbortController" in window ? new AbortController() : null;
    var timer = controller ? window.setTimeout(function () { controller.abort(); }, 15000) : null;

    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      signal: controller ? controller.signal : undefined
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (json) { return { ok: res.ok, json: json }; });
      })
      .then(function (res) {
        if (res.ok && res.json && res.json.success) finish();
        else setStatus("error", "We couldn't send your application" + (res.json && res.json.message ? " (" + res.json.message + ")" : "") + ". Please try again or email " + TEAM_EMAIL + ".");
      })
      .catch(function () {
        setStatus("error", "We couldn't reach our application service. Please check your connection and try again, or email " + TEAM_EMAIL + ".");
      })
      .then(function () {
        if (timer) window.clearTimeout(timer);
        sending = false;
        submitBtn.disabled = false;
        submitBtn.removeAttribute("aria-busy");
        submitLabel.textContent = idleLabel;
      });
  });
})();
