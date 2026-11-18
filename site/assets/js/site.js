/* CyruTech Capital — site behaviour. No dependencies. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header: scrolled state ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var ticking = false;
    var progress = header.querySelector(".scroll-progress");
    var updateHeader = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      if (progress) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
      }
      ticking = false;
    };
    window.addEventListener("resize", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateHeader); }
    });
    window.addEventListener("scroll", function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(updateHeader); }
    }, { passive: true });
    updateHeader();
  }

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var desktop = window.matchMedia("(min-width: 1024px)");

    var setOpen = function (open, returnFocus) {
      root.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      if (open) {
        var first = nav.querySelector("a");
        if (first) first.focus({ preventScroll: true });
      } else if (returnFocus) {
        toggle.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true", true);
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false, false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("nav-open")) setOpen(false, true);
    });

    var onBreakpoint = function (e) { if (e.matches) setOpen(false, false); };
    if (desktop.addEventListener) desktop.addEventListener("change", onBreakpoint);
    else if (desktop.addListener) desktop.addListener(onBreakpoint);

    /* Keep keyboard focus inside the open menu */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !root.classList.contains("nav-open")) return;
      var items = [toggle].concat(Array.prototype.slice.call(nav.querySelectorAll("a")));
      var firstEl = items[0];
      var lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
      else if (items.indexOf(document.activeElement) === -1) { e.preventDefault(); firstEl.focus(); }
    });
  }

  /* ---------- Text split: words (default) or letters ---------- */
  var splitEls = document.querySelectorAll("[data-split]");
  if (reduceMotion) splitEls.forEach(function (el) { el.classList.add("is-in"); });
  if (splitEls.length && !reduceMotion) {
    splitEls.forEach(function (el) {
      var chars = el.getAttribute("data-split") === "chars";
      var i = 0;
      var walk = function (node) {
        Array.prototype.slice.call(node.childNodes).forEach(function (child) {
          if (child.nodeType === 3) {
            var parts = chars ? Array.from(child.textContent) : child.textContent.split(/(\s+)/);
            if (!child.textContent.trim()) return;
            var frag = document.createDocumentFragment();
            parts.forEach(function (part) {
              if (!part) return;
              if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
              var span = document.createElement("span");
              span.className = chars ? "ch" : "w";
              span.style.setProperty("--i", i++);
              span.textContent = part;
              frag.appendChild(span);
            });
            node.replaceChild(frag, child);
          } else if (child.nodeType === 1) {
            walk(child);
          }
        });
      };
      walk(el);
    });
    var showSplit = function (el) { el.classList.add("is-in"); };
    if ("IntersectionObserver" in window) {
      var so = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { so.unobserve(entry.target); showSplit(entry.target); }
        });
      }, { rootMargin: "0px 0px -6% 0px", threshold: 0.15 });
      /* Two frames so the hidden state paints before transitioning in. */
      window.requestAnimationFrame(function () {
        window.requestAnimationFrame(function () { splitEls.forEach(function (el) { so.observe(el); }); });
      });
      window.addEventListener("beforeprint", function () { splitEls.forEach(showSplit); });
    } else {
      splitEls.forEach(showSplit);
    }
  }

  /* ---------- Count-up numbers ---------- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && !reduceMotion && "IntersectionObserver" in window) {
    var runCount = function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var start = null;
      var dur = 1400;
      var step = function (ts) {
        if (start === null) start = ts;
        var t = Math.min(1, (ts - start) / dur);
        var eased = 1 - Math.pow(1 - t, 4);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) window.requestAnimationFrame(step);
      };
      window.requestAnimationFrame(step);
    };
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { co.unobserve(entry.target); runCount(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = "0"; co.observe(el); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
      /* Safety net: never leave content hidden (e.g. print, odd viewports). */
      window.addEventListener("beforeprint", function () {
        revealEls.forEach(function (el) { el.classList.add("is-in"); });
      });
    }
  }

  /* ==========================================================================
     Detailed motion
     ========================================================================== */
  var finePointer = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* Pause SVG (SMIL) animations when motion is reduced */
  if (reduceMotion) {
    document.querySelectorAll(".orbit svg, .x-svg").forEach(function (svgEl) {
      if (svgEl.pauseAnimations) svgEl.pauseAnimations();
    });
  }

  /* Eyebrow labels decode from scrambled letters */
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var scramble = function (el) {
    if (el.children.length || el.dataset.scrambled) return;
    el.dataset.scrambled = "1";
    var final = el.textContent;
    var frames = 22;
    var frame = 0;
    el.classList.add("is-scrambling");
    var tick = function () {
      frame++;
      var reveal = Math.floor((frame / frames) * final.length);
      var out = "";
      for (var k = 0; k < final.length; k++) {
        var ch = final.charAt(k);
        out += (k < reveal || /[\s—·.,&]/.test(ch)) ? ch : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
      }
      el.textContent = out;
      if (frame < frames) window.setTimeout(function () { window.requestAnimationFrame(tick); }, 28);
      else { el.textContent = final; el.classList.remove("is-scrambling"); }
    };
    tick();
  };
  if (!reduceMotion && "IntersectionObserver" in window) {
    var eo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { eo.unobserve(entry.target); window.setTimeout(function () { scramble(entry.target); }, 120); }
      });
    }, { threshold: 0.6 });
    document.querySelectorAll(".eyebrow").forEach(function (el) { eo.observe(el); });
  }

  /* Hero: content drifts out on scroll (all viewports) */
  var hero = document.querySelector(".hero");
  var orbitEl = document.querySelector(".orbit");
  if (hero && !reduceMotion) {
    var heroTick = false;
    var heroScroll = function () {
      var h = hero.offsetHeight || 1;
      var prog = Math.max(0, Math.min(1, window.scrollY / h));
      hero.style.setProperty("--hp", prog.toFixed(3));
      if (orbitEl) orbitEl.style.setProperty("--hp", prog.toFixed(3));
      heroTick = false;
    };
    window.addEventListener("scroll", function () {
      if (!heroTick) { heroTick = true; window.requestAnimationFrame(heroScroll); }
    }, { passive: true });
    heroScroll();
  }

  if (finePointer && !reduceMotion) {
    /* Hero: cursor spotlight + orbit parallax */
    if (hero) {
      var hx = 0, hy = 0, heroRaf = 0;
      var heroMove = function () {
        heroRaf = 0;
        var r = hero.getBoundingClientRect();
        hero.style.setProperty("--sx", (hx - r.left) + "px");
        hero.style.setProperty("--sy", (hy - r.top) + "px");
        if (orbitEl) {
          orbitEl.style.setProperty("--mx", (((hx - r.left) / r.width) * 2 - 1).toFixed(3));
          orbitEl.style.setProperty("--my", (((hy - r.top) / r.height) * 2 - 1).toFixed(3));
        }
      };
      hero.addEventListener("pointermove", function (e) {
        hx = e.clientX; hy = e.clientY;
        hero.classList.add("is-pointer");
        if (!heroRaf) heroRaf = window.requestAnimationFrame(heroMove);
      });
      hero.addEventListener("pointerleave", function () {
        hero.classList.remove("is-pointer");
        if (orbitEl) { orbitEl.style.setProperty("--mx", "0"); orbitEl.style.setProperty("--my", "0"); }
      });
    }

    /* Sliding highlight behind hovered nav links */
    var navEl = document.getElementById("site-nav");
    if (navEl) {
      var pill = document.createElement("span");
      pill.className = "nav-pill";
      pill.setAttribute("aria-hidden", "true");
      navEl.appendChild(pill);
      navEl.classList.add("has-pill");
      navEl.querySelectorAll("a:not(.nav-mobile-cta)").forEach(function (a) {
        a.addEventListener("pointerenter", function () {
          pill.style.width = a.offsetWidth + "px";
          pill.style.transform = "translateX(" + a.offsetLeft + "px)";
          pill.style.opacity = "1";
        });
      });
      navEl.addEventListener("pointerleave", function () { pill.style.opacity = "0"; });
    }

    /* Cursor spotlight on cards */
    document.querySelectorAll(".venture, .benefit, .course-card, .quote, .feature, .member").forEach(function (card) {
      card.classList.add("spot");
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--x", (e.clientX - r.left) + "px");
        card.style.setProperty("--y", (e.clientY - r.top) + "px");
      });
    });

    /* 3D tilt */
    document.querySelectorAll(".venture, .course-card").forEach(function (card) {
      card.classList.add("tilt");
      var raf = 0, px = 0, py = 0;
      var apply = function () {
        raf = 0;
        var r = card.getBoundingClientRect();
        var nx = (px - r.left) / r.width - 0.5;
        var ny = (py - r.top) / r.height - 0.5;
        card.style.transform = "perspective(1000px) rotateX(" + (-ny * 6).toFixed(2) + "deg) rotateY(" + (nx * 8).toFixed(2) + "deg) translateY(-4px)";
      };
      card.addEventListener("pointerenter", function () { card.style.transition = "transform 0.2s ease-out, box-shadow 0.4s, border-color 0.3s"; });
      card.addEventListener("pointermove", function (e) {
        px = e.clientX; py = e.clientY;
        if (!raf) raf = window.requestAnimationFrame(apply);
      });
      card.addEventListener("pointerleave", function () {
        if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
        card.style.transition = "transform 0.8s cubic-bezier(0.2, 0.7, 0.1, 1), box-shadow 0.4s, border-color 0.3s";
        card.style.transform = "";
      });
    });

    /* Magnetic primary buttons */
    document.querySelectorAll(".hero .btn, .page-hero .btn, .cta-band .btn, .header-cta .btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        var r = b.getBoundingClientRect();
        var dx = e.clientX - (r.left + r.width / 2);
        var dy = e.clientY - (r.top + r.height / 2);
        b.style.transition = "transform 0.15s ease-out, background-color 0.25s";
        b.style.transform = "translate(" + (dx * 0.18).toFixed(1) + "px," + (dy * 0.3).toFixed(1) + "px)";
      });
      b.addEventListener("pointerleave", function () {
        b.style.transition = "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.25s";
        b.style.transform = "";
      });
    });
  }

  /* ---------- "How it works" explainer: scroll-driven steps ---------- */
  document.querySelectorAll("[data-explainer]").forEach(function (ex) {
    var tabs = Array.prototype.slice.call(ex.querySelectorAll("[data-step-btn]"));
    var panels = Array.prototype.slice.call(ex.querySelectorAll("[data-step-panel]"));
    var track = ex.closest("[data-x-track]");
    if (!tabs.length || !track) return;
    var pin = track.firstElementChild;
    var STEPS = tabs.length;
    var step = 0;
    var hdr = document.querySelector(".site-header");
    var headerH = function () { return hdr ? hdr.offsetHeight : 0; };

    var go = function (n) {
      if (n === step) return;
      step = n;
      ex.setAttribute("data-step", String(n));
      tabs.forEach(function (t, i) {
        var on = i + 1 === n;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.setAttribute("tabindex", on ? "0" : "-1");
      });
      panels.forEach(function (p) { p.hidden = Number(p.getAttribute("data-step-panel")) !== n; });
    };
    var geometry = function () {
      var r = track.getBoundingClientRect();
      return { top: r.top, docTop: r.top + window.scrollY, total: track.offsetHeight - pin.offsetHeight };
    };
    var raf = 0;
    var update = function () {
      raf = 0;
      var g = geometry();
      if (g.total <= 0) { go(STEPS); return; }
      var p = Math.max(0, Math.min(0.9999, (headerH() - g.top) / g.total));
      var n = Math.floor(p * STEPS) + 1;
      var intra = p * STEPS - (n - 1);
      go(n);
      tabs.forEach(function (t, i) {
        var bar = t.querySelector(".x-tab-bar span");
        if (bar) bar.style.setProperty("--p", i + 1 < n ? "1" : i + 1 === n ? intra.toFixed(3) : "0");
      });
    };
    var request = function () { if (!raf) raf = window.requestAnimationFrame(update); };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);

    /* Clicking or arrowing to a step scrolls to that point of the track. */
    var scrollToStep = function (n) {
      var g = geometry();
      var f = (n - 1 + 0.15) / STEPS;
      var y = g.docTop - headerH() + g.total * f;
      window.scrollTo({ top: Math.round(y), behavior: reduceMotion ? "auto" : "smooth" });
      go(n);
    };
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { scrollToStep(i + 1); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") n = Math.min(STEPS, step + 1);
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = Math.max(1, step - 1);
        else if (e.key === "Home") n = 1;
        else if (e.key === "End") n = STEPS;
        if (n !== null) { e.preventDefault(); scrollToStep(n); tabs[n - 1].focus({ preventScroll: true }); }
      });
    });
    update();
  });

  /* ==========================================================================
     Signature layer
     ========================================================================== */
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var onScreen = function (el, cb) {
    if (!("IntersectionObserver" in window)) { cb(true); return; }
    new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting); }); }, { rootMargin: "100px" }).observe(el);
  };

  /* Intro curtain: drop the class once it has played */
  if (root.classList.contains("intro")) {
    window.setTimeout(function () { root.classList.remove("intro"); }, 2100);
  }

  /* ---------- Topographic field (Perlin noise + marching squares) ---------- */
  var perm = (function () {
    var p = [], i, seed = 7;
    for (i = 0; i < 256; i++) p[i] = i;
    for (i = 255; i > 0; i--) { seed = (seed * 16807) % 2147483647; var r = seed % (i + 1); var t = p[i]; p[i] = p[r]; p[r] = t; }
    var out = new Uint8Array(512);
    for (i = 0; i < 512; i++) out[i] = p[i & 255];
    return out;
  })();
  var fade = function (t) { return t * t * t * (t * (t * 6 - 15) + 10); };
  var lerp = function (a, b, t) { return a + t * (b - a); };
  var grad = function (h, x, y, z) {
    h &= 15;
    var u = h < 8 ? x : y, v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
    return ((h & 1) ? -u : u) + ((h & 2) ? -v : v);
  };
  var noise3 = function (x, y, z) {
    var X = Math.floor(x) & 255, Y = Math.floor(y) & 255, Z = Math.floor(z) & 255;
    x -= Math.floor(x); y -= Math.floor(y); z -= Math.floor(z);
    var u = fade(x), v = fade(y), w = fade(z);
    var A = perm[X] + Y, AA = perm[A] + Z, AB = perm[A + 1] + Z, B = perm[X + 1] + Y, BA = perm[B] + Z, BB = perm[B + 1] + Z;
    return lerp(
      lerp(lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u), lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u), v),
      lerp(lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u), lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u), v),
      w);
  };
  /* edges: 0 top, 1 right, 2 bottom, 3 left */
  var SEGS = [null, [[3, 2]], [[2, 1]], [[3, 1]], [[0, 1]], [[0, 1], [3, 2]], [[0, 2]], [[3, 0]], [[3, 0]], [[0, 2]], [[3, 0], [2, 1]], [[0, 1]], [[3, 1]], [[2, 1]], [[3, 2]], null];

  document.querySelectorAll("canvas[data-topo]").forEach(function (cv) {
    var ctx = cv.getContext && cv.getContext("2d");
    if (!ctx) return;
    var host = cv.parentElement;
    var W = 0, H = 0, cell = 16, cols = 0, rows = 0, field = null;
    var mx = -9999, my = -9999, tmx = -9999, tmy = -9999;
    var visible = true, t0 = performance.now(), last = 0, raf = 0;

    var resize = function () {
      var r = host.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height));
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = W < 700 ? 22 : 16;
      cols = Math.ceil(W / cell) + 1; rows = Math.ceil(H / cell) + 1;
      field = new Float32Array(cols * rows);
    };
    var draw = function (time) {
      var z = time * 0.00006;
      mx += (tmx - mx) * 0.08; my += (tmy - my) * 0.08;
      for (var j = 0; j < rows; j++) {
        for (var i = 0; i < cols; i++) {
          var x = i * cell, y = j * cell;
          var v = noise3(x * 0.0036, y * 0.0036, z) + 0.45 * noise3(x * 0.009 + 40, y * 0.009, z * 1.4);
          var dx = x - mx, dy = y - my;
          v += 0.55 * Math.exp(-(dx * dx + dy * dy) / 26000);
          field[j * cols + i] = v;
        }
      }
      ctx.clearRect(0, 0, W, H);
      var minor = new Path2D(), major = new Path2D();
      var li = 0;
      for (var L = -0.6; L <= 0.9; L += 0.1, li++) {
        var path = li % 4 === 0 ? major : minor;
        for (var jj = 0; jj < rows - 1; jj++) {
          for (var ii = 0; ii < cols - 1; ii++) {
            var a = field[jj * cols + ii], b = field[jj * cols + ii + 1];
            var c = field[(jj + 1) * cols + ii + 1], d = field[(jj + 1) * cols + ii];
            var idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (c > L ? 2 : 0) | (d > L ? 1 : 0);
            var segs = SEGS[idx];
            if (!segs) continue;
            for (var k = 0; k < segs.length; k++) {
              for (var e = 0; e < 2; e++) {
                var edge = segs[k][e], px, py;
                if (edge === 0) { px = ii + (L - a) / (b - a); py = jj; }
                else if (edge === 1) { px = ii + 1; py = jj + (L - b) / (c - b); }
                else if (edge === 2) { px = ii + (L - d) / (c - d); py = jj + 1; }
                else { px = ii; py = jj + (L - a) / (d - a); }
                if (e === 0) path.moveTo(px * cell, py * cell); else path.lineTo(px * cell, py * cell);
              }
            }
          }
        }
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(62, 224, 122, 0.11)"; ctx.stroke(minor);
      ctx.strokeStyle = "rgba(62, 224, 122, 0.26)"; ctx.stroke(major);
    };
    var loop = function (now) {
      raf = 0;
      if (!visible || document.hidden) return;
      if (now - last > 40) { last = now; draw(now - t0); }
      raf = window.requestAnimationFrame(loop);
    };
    var start = function () { if (!raf && !reduceMotion) raf = window.requestAnimationFrame(loop); };

    resize();
    draw(0);
    if (window.ResizeObserver) new ResizeObserver(function () { resize(); draw(performance.now() - t0); }).observe(host);
    if (!reduceMotion) {
      onScreen(host, function (v) { visible = v; if (v) start(); });
      document.addEventListener("visibilitychange", start);
      if (finePointer) {
        host.addEventListener("pointermove", function (e) {
          var r = host.getBoundingClientRect();
          tmx = e.clientX - r.left; tmy = e.clientY - r.top;
          if (mx < -1000) { mx = tmx; my = tmy; }
        });
        host.addEventListener("pointerleave", function () { tmx = -9999; tmy = -9999; });
      }
      start();
    }
  });

  /* ---------- Manifesto: words light up with scroll ---------- */
  document.querySelectorAll("[data-scroll-text]").forEach(function (el) {
    if (reduceMotion) return;
    var words = [];
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          if (!child.textContent.trim()) return;
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            var sp = document.createElement("span");
            sp.className = "sw"; sp.textContent = part;
            words.push(sp); frag.appendChild(sp);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) walk(child);
      });
    };
    walk(el);
    var active = false, raf2 = 0;
    var paint = function () {
      raf2 = 0;
      var r = el.getBoundingClientRect(), vh = window.innerHeight;
      var p = clamp((vh * 0.85 - r.top) / (vh * 0.5 + r.height * 0.5), 0, 1);
      var n = words.length;
      for (var i = 0; i < n; i++) {
        var o = clamp(p * (n + 4) - i, 0, 1);
        words[i].style.setProperty("--o", (0.14 + 0.86 * o).toFixed(3));
      }
    };
    onScreen(el, function (v) { active = v; if (v) paint(); });
    window.addEventListener("scroll", function () { if (active && !raf2) raf2 = window.requestAnimationFrame(paint); }, { passive: true });
    paint();
  });

  /* ---------- Sections open from a card to full-bleed ---------- */
  var expanders = Array.prototype.slice.call(document.querySelectorAll("main > .section--ink, main > .section--ink-2")).filter(function (sec) {
    var prev = sec.previousElementSibling;
    return sec.id !== "how" && prev && !/section--ink|hero|page-hero/.test(prev.className);
  });
  if (expanders.length && !reduceMotion) {
    var exRaf = 0;
    var exPaint = function () {
      exRaf = 0;
      var vh = window.innerHeight;
      expanders.forEach(function (sec) {
        var top = sec.getBoundingClientRect().top;
        var p = clamp((vh - top) / (vh * 0.75), 0, 1);
        sec.style.setProperty("--ex", (1 - p).toFixed(3));
      });
    };
    expanders.forEach(function (sec) { sec.classList.add("expand"); });
    window.addEventListener("scroll", function () { if (!exRaf) exRaf = window.requestAnimationFrame(exPaint); }, { passive: true });
    window.addEventListener("resize", exPaint);
    exPaint();
  }

  /* ---------- Velocity-reactive marquee ---------- */
  document.querySelectorAll(".marquee-track").forEach(function (track) {
    if (reduceMotion) return;
    track.classList.add("is-js");
    var x = 0, skew = 0, lastY = window.scrollY, vis = true, mraf = 0, hover = false;
    var half = function () { return track.scrollWidth / 2; };
    var step = function () {
      mraf = 0;
      if (!vis) return;
      var y = window.scrollY, v = y - lastY; lastY = y;
      var speed = (hover ? 0.25 : 0.9) + v * 0.35;
      x -= speed;
      var h = half();
      if (h > 0) { while (x <= -h) x += h; while (x > 0) x -= h; }
      skew += (clamp(-v * 0.4, -10, 10) - skew) * 0.12;
      track.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0) skewX(" + skew.toFixed(2) + "deg)";
      mraf = window.requestAnimationFrame(step);
    };
    var host2 = track.parentElement;
    host2.addEventListener("pointerenter", function () { hover = true; });
    host2.addEventListener("pointerleave", function () { hover = false; });
    onScreen(host2, function (v) { vis = v; lastY = window.scrollY; if (v && !mraf) mraf = window.requestAnimationFrame(step); });
  });

  /* ---------- Fine-pointer extras: cursor + portfolio preview + footer wordmark ---------- */
  if (finePointer && !reduceMotion) {
    /* Cursor ring with contextual labels */
    var cur = document.createElement("div");
    cur.className = "cursor";
    cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = '<span class="cursor-label"></span>';
    document.body.appendChild(cur);
    var curLabel = cur.firstChild;
    var cx = -100, cy = -100, tx = -100, ty = -100, craf = 0;
    var cstep = function () {
      craf = 0;
      cx += (tx - cx) * 0.22; cy += (ty - cy) * 0.22;
      cur.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      if (Math.abs(tx - cx) > 0.2 || Math.abs(ty - cy) > 0.2) craf = window.requestAnimationFrame(cstep);
    };
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType && e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (!cur.classList.contains("is-on")) { cx = tx; cy = ty; cur.classList.add("is-on"); }
      if (!craf) craf = window.requestAnimationFrame(cstep);
    }, { passive: true });
    document.documentElement.addEventListener("pointerleave", function () { cur.classList.remove("is-on"); });
    document.addEventListener("pointerdown", function () { cur.classList.add("is-down"); });
    document.addEventListener("pointerup", function () { cur.classList.remove("is-down"); });
    document.addEventListener("pointerover", function (e) {
      var t = e.target;
      var labelled = t.closest && t.closest("[data-cursor]");
      var text = t.closest && t.closest("input:not([type=radio]):not([type=checkbox]), textarea, select");
      var link = t.closest && t.closest("a, button, label, [role=tab]");
      cur.classList.toggle("is-text", !!text);
      cur.classList.toggle("is-label", !!labelled && !text);
      cur.classList.toggle("is-link", !labelled && !!link && !text);
      if (labelled) curLabel.textContent = labelled.getAttribute("data-cursor");
    });

    /* Floating logo preview over the portfolio index */
    var vindex = document.querySelector(".vindex");
    if (vindex && window.matchMedia("(min-width: 900px)").matches) {
      var pv = document.createElement("div");
      pv.className = "vpreview";
      pv.setAttribute("aria-hidden", "true");
      var pvImg = document.createElement("img");
      pvImg.alt = "";
      var firstLogo = vindex.querySelector(".vrow-logo img");
      if (firstLogo) pvImg.src = firstLogo.getAttribute("src");
      pv.appendChild(pvImg);
      document.body.appendChild(pv);
      var px = 0, py = 0, ptx = 0, pty = 0, prot = 0, praf = 0, pon = false, curRow = null;
      var pstep = function () {
        praf = 0;
        var dx = ptx - px;
        px += dx * 0.14; py += (pty - py) * 0.14;
        prot += (clamp(dx * 0.08, -12, 12) - prot) * 0.15;
        pv.style.transform = "translate3d(" + (px + 28).toFixed(1) + "px," + (py - 85).toFixed(1) + "px,0) rotate(" + prot.toFixed(2) + "deg)";
        if (pon || Math.abs(dx) > 0.3) praf = window.requestAnimationFrame(pstep);
      };
      vindex.addEventListener("pointermove", function (e) {
        ptx = e.clientX; pty = e.clientY;
        var row = e.target.closest(".vrow");
        if (row && row !== curRow) {
          var src = row.querySelector(".vrow-logo img").getAttribute("src");
          if (curRow) {
            pv.classList.add("is-swap");
            window.setTimeout(function () { pvImg.src = src; pv.classList.remove("is-swap"); }, 160);
          } else { pvImg.src = src; px = ptx; py = pty; }
          curRow = row;
        }
        if (!pon) { pon = true; pv.classList.add("is-on"); }
        if (!praf) praf = window.requestAnimationFrame(pstep);
      });
      vindex.addEventListener("pointerleave", function () { pon = false; curRow = null; pv.classList.remove("is-on"); });
    }

    /* Footer wordmark: letters swell toward the cursor */
    var fword = document.querySelector(".footer-word");
    var footerEl = document.querySelector(".site-footer");
    if (fword && footerEl) {
      var chars = fword.querySelectorAll(".ch");
      if (chars.length) {
        var tuned = false;
        footerEl.addEventListener("pointermove", function (e) {
          if (!fword.classList.contains("is-in")) return;
          if (!tuned) { tuned = true; chars.forEach(function (ch) { ch.style.transition = "font-weight 0.3s ease, color 0.3s ease"; ch.style.transitionDelay = "0s"; }); }
          var fr = fword.getBoundingClientRect();
          var near = clamp(1 - Math.abs(e.clientY - (fr.top + fr.height / 2)) / 420, 0, 1);
          chars.forEach(function (ch) {
            var r = ch.getBoundingClientRect();
            var k = clamp(1 - Math.abs(e.clientX - (r.left + r.width / 2)) / 280, 0, 1) * near;
            ch.style.fontWeight = String(Math.round(300 + 500 * k * k));
            ch.style.color = "rgba(62, 224, 122, " + (0.85 * k * k).toFixed(3) + ")";
          });
        });
        footerEl.addEventListener("pointerleave", function () {
          chars.forEach(function (ch) { ch.style.fontWeight = ""; ch.style.color = ""; });
        });
      }
    }
  }

  /* ---------- Live La Jolla clock + back to top ---------- */
  var ljEls = document.querySelectorAll("[data-lj-time]");
  if (ljEls.length) {
    var ljFmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });
    var ljTick = function () { var t = "La Jolla · " + ljFmt.format(new Date()); ljEls.forEach(function (el) { el.textContent = t; }); };
    ljTick();
    window.setInterval(ljTick, 15000);
  }
  document.querySelectorAll("[data-to-top]").forEach(function (b) {
    b.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      var skip = document.querySelector(".brand");
      if (skip) skip.focus({ preventScroll: true });
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* ---------- Contact forms ---------- */
  var ENDPOINT = "https://script.google.com/macros/s/AKfycbyiAqrWtAhyO6_sjZ7DiqXc01Je5Ij9Pa0QwdHlpbv9z2atBX6ymnp5Mp6F6GvKi3ql/exec";
  var FIELDS = ["fullName", "email", "phone", "websiteUrl", "message"];
  var MESSAGES = {
    fullName: "Please enter your name.",
    email: "Please enter a valid email address.",
    phone: "Please enter a phone number we can reach you on.",
    websiteUrl: "Please enter a full URL, starting with https://",
    message: "Please tell us a little about what you need."
  };

  var fieldError = function (input) {
    var v = input.validity;
    if (v.valid) return "";
    return MESSAGES[input.name] || input.validationMessage;
  };

  var showError = function (input, msg) {
    var err = document.getElementById(input.id + "-error");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg;
  };

  document.querySelectorAll("form[data-contact-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector('button[type="submit"]');
    var buttonLabel = button ? button.querySelector(".btn-label") : null;
    var idleLabel = buttonLabel ? buttonLabel.textContent : "";
    var sending = false;

    var setStatus = function (state, text) {
      if (!status) return;
      status.setAttribute("data-state", state);
      status.textContent = text;
    };

    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("blur", function () {
        if (input.value.trim() !== "" || input.getAttribute("aria-invalid") === "true") showError(input, fieldError(input));
      });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") showError(input, fieldError(input));
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (sending) return;

      /* Trim whitespace-only answers so "required" catches them. */
      FIELDS.forEach(function (name) {
        var el = form.elements[name];
        if (el && el.value.trim() === "") el.value = "";
      });
      /* Be forgiving: "example.com" -> "https://example.com" */
      var site = form.elements.websiteUrl;
      if (site && site.value && !/^https?:\/\//i.test(site.value.trim())) {
        site.value = "https://" + site.value.trim();
      }

      var firstInvalid = null;
      FIELDS.forEach(function (name) {
        var el = form.elements[name];
        if (!el) return;
        var msg = fieldError(el);
        showError(el, msg);
        if (msg && !firstInvalid) firstInvalid = el;
      });
      if (firstInvalid) {
        setStatus("error", "Please check the highlighted fields.");
        firstInvalid.focus();
        return;
      }

      /* Honeypot: bots fill hidden fields. Pretend success, send nothing. */
      var trap = form.elements.company;
      if (trap && trap.value) {
        form.reset();
        setStatus("success", "Thanks — your message is on its way. We'll be in touch shortly.");
        return;
      }

      var payload = {};
      FIELDS.forEach(function (name) {
        var el = form.elements[name];
        if (el) payload[name] = el.value.trim();
      });

      sending = true;
      setStatus("", "");
      if (button) { button.disabled = true; button.setAttribute("aria-busy", "true"); }
      if (buttonLabel) buttonLabel.textContent = "Sending…";

      var controller = "AbortController" in window ? new AbortController() : null;
      var timer = controller ? window.setTimeout(function () { controller.abort(); }, 15000) : null;

      /* Google Apps Script does not send CORS headers, so the response is opaque:
         a resolved promise means the request reached Google; a rejection means it didn't. */
      fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined
      })
        .then(function () {
          form.reset();
          form.querySelectorAll("[aria-invalid]").forEach(function (el) { el.setAttribute("aria-invalid", "false"); });
          setStatus("success", "Thanks — your message is on its way. We'll be in touch shortly.");
        })
        .catch(function () {
          setStatus("error", "We couldn't send your message. Please check your connection and try again, or email team@cyrutech.com.");
        })
        .then(function () {
          if (timer) window.clearTimeout(timer);
          sending = false;
          if (button) { button.disabled = false; button.removeAttribute("aria-busy"); }
          if (buttonLabel) buttonLabel.textContent = idleLabel;
        });
    });
  });
})();

/* ---------- News strip: rotate the "Latest" headlines ---------- */
(function () {
  var list = document.querySelector("[data-newsbar]");
  if (!list) return;
  var items = list.querySelectorAll(".newsbar-item");
  if (items.length < 2) return;
  var i = 0, timer = null, paused = false;
  function step() {
    var cur = items[i];
    i = (i + 1) % items.length;
    var next = items[i];
    cur.classList.remove("is-on");
    cur.classList.add("is-out");
    next.classList.remove("is-out");
    next.classList.add("is-on");
    setTimeout(function () { cur.classList.remove("is-out"); }, 650);
  }
  function start() { if (!timer && !paused && !document.hidden) timer = setInterval(step, 4500); }
  function stop() { clearInterval(timer); timer = null; }
  var bar = list.closest(".newsbar");
  bar.addEventListener("mouseenter", function () { paused = true; stop(); });
  bar.addEventListener("mouseleave", function () { paused = false; start(); });
  bar.addEventListener("focusin", function () { paused = true; stop(); });
  bar.addEventListener("focusout", function (e) { if (!bar.contains(e.relatedTarget)) { paused = false; start(); } });
  document.addEventListener("visibilitychange", function () { document.hidden ? stop() : start(); });
  start();
})();
