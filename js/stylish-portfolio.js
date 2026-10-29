(function($) {
  "use strict";

  var $menu = $("#sidebar-wrapper");
  var $toggle = $(".menu-toggle");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function setMenu(open, restoreFocus) {
    $menu.toggleClass("active", open);
    $toggle.toggleClass("active", open)
      .attr("aria-expanded", String(open))
      .attr("aria-label", open ? "Close navigation" : "Open navigation");
    $toggle.find("i").toggleClass("fa-bars", !open).toggleClass("fa-times", open);
    if (restoreFocus) $toggle.trigger("focus");
  }

  $toggle.on("click", function() {
    setMenu(!$menu.hasClass("active"), false);
  });

  $(document).on("keydown", function(event) {
    if (event.key === "Escape" && $menu.hasClass("active")) setMenu(false, true);
  });

  $(document).on("click", function(event) {
    if (!$(event.target).closest("#sidebar-wrapper, .menu-toggle").length) setMenu(false, false);
  });

  $menu.on("focusout", function() {
    // Hide the menu after keyboard focus leaves both it and its toggle.
    window.setTimeout(function() {
      if (!$(document.activeElement).closest("#sidebar-wrapper, .menu-toggle").length) setMenu(false, false);
    }, 0);
  });

  $('a.js-scroll-trigger[href^="#"]').on("click", function(event) {
    var target = document.getElementById(this.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    setMenu(false, false);
    var hash = this.hash;
    $("html, body").stop(true).animate({scrollTop: $(target).offset().top}, reducedMotion.matches ? 0 : 450, "easeInOutExpo").promise().done(function() {
      // Move keyboard focus with the page, without adding sections to the tab order.
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({preventScroll: true});
      if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    });
  });

  function updateScrollButton() {
    $(".scroll-to-top").toggle(window.scrollY > 100);
  }
  $(window).on("scroll", updateScrollButton);
  updateScrollButton();

  // Faunio chase: the bear follows the rabbit across the strip, looping only
  // while it is on screen. Animations created off screen stay on the main thread.
  var chase = document.querySelector(".chase");
  if (chase && chase.animate && "IntersectionObserver" in window) {
    var pack = chase.querySelector(".chase-pack");
    // World units per second; the CSS walk-cycle durations are tuned to it.
    var SPEED = 200;
    var PAUSE_MS = 700;
    var travel = null;
    var trackWidth = 0;

    var startTravel = function() {
      if (travel) travel.cancel();
      var scale = parseFloat(getComputedStyle(chase).getPropertyValue("--k")) || 1;
      var packWidth = pack.offsetWidth;
      trackWidth = chase.clientWidth;
      var runMs = (trackWidth + packWidth) / (SPEED * scale) * 1000;
      var totalMs = runMs + PAUSE_MS;
      travel = pack.animate([
        {transform: "translateX(" + -packWidth + "px)"},
        {transform: "translateX(" + trackWidth + "px)", offset: runMs / totalMs},
        {transform: "translateX(" + trackWidth + "px)"}
      ], {duration: totalMs, iterations: Infinity});
      // Start with the pair already in view instead of waiting for them to enter.
      travel.currentTime = runMs * (packWidth + trackWidth * .08) / (trackWidth + packWidth);
    };

    var setLive = function(live) {
      if (live === (chase.getAttribute("data-live") === "true")) return;
      chase.setAttribute("data-live", String(live));
      if (live) {
        startTravel();
      } else if (travel) {
        travel.cancel();
        travel = null;
      }
    };

    new IntersectionObserver(function(entries) {
      setLive(entries[entries.length - 1].isIntersecting && !reducedMotion.matches);
    }).observe(chase);

    var resizeTimer;
    $(window).on("resize", function() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function() {
        if (travel && chase.clientWidth !== trackWidth) startTravel();
      }, 200);
    });
  }
})(jQuery);
