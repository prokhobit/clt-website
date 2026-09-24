/* CLT · ABOUT · Team roster hydrator (inline in About → Page settings → Before </body>, above about-us.js)
   The roster is a Collection List on the "Team Members" CMS collection. Webflow can only bind CMS
   fields to text, so each item carries its slug and social URLs as hidden text (.au-member__data).
   This turns every item into the card about-us.js expects: data hooks, #au-<slug> id (deep links),
   aria wiring, initials for people without a headshot, and social icons for the links that are set. */
(function () {
  "use strict";

  function text(el) { return el ? (el.textContent || "").trim() : ""; }

  function initials(name) {
    var parts = name.split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    return (parts[0].charAt(0) + (parts.length > 1 ? parts[parts.length - 1].charAt(0) : "")).toUpperCase();
  }

  function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  function hydrate(root) {
    (root || document).querySelectorAll(".au-roster").forEach(function (list) {
      list.setAttribute("data-au-roster", "");
    });
    (root || document).querySelectorAll(".au-roster > .au-member:not([data-au-ready])").forEach(function (card) {
      card.setAttribute("data-au-ready", "");
      card.setAttribute("data-au-member", "");

      var name = text(card.querySelector(".au-member__name"));
      var slug = text(card.querySelector("[data-au-slug]")) || slugify(name);
      card.id = "au-" + slug;

      var trigger = card.querySelector("[data-au-toggle]");
      var detail = card.querySelector(".au-member__detail");
      if (detail) detail.id = "au-bio-" + slug;
      if (trigger && detail) trigger.setAttribute("aria-controls", detail.id);

      var close = card.querySelector("[data-au-close]");
      if (close) close.setAttribute("aria-label", "Close " + name + "'s profile");

      var seal = card.querySelector("[data-au-initials]");
      if (seal) seal.textContent = initials(name);

      // No headshot in the CMS → Webflow still renders an empty <img>; drop it so the seal shows.
      var img = card.querySelector(".au-member__portrait img");
      if (img && (img.classList.contains("w-dyn-bind-empty") || !img.getAttribute("src"))) {
        img.parentNode.removeChild(img);
      }

      var socials = card.querySelector(".au-member__socials");
      if (socials) {
        socials.querySelectorAll("[data-au-social]").forEach(function (a) {
          var network = a.getAttribute("data-au-social");
          var url = text(card.querySelector('[data-au-link="' + network + '"]'));
          if (!/^https?:\/\//i.test(url)) { a.parentNode.removeChild(a); return; }
          a.href = url;
          a.target = "_blank";
          a.rel = "noopener";
          a.setAttribute("aria-label", name + " on " + network);
        });
        if (!socials.querySelector("a")) socials.parentNode.removeChild(socials);
      }

      var data = card.querySelector(".au-member__data");
      if (data) data.parentNode.removeChild(data);
    });
  }

  window.cltHydrateTeam = hydrate;
  hydrate(document);
})();
