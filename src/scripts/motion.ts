/**
 * Site-wide motion, per the design system's motion guidelines (master doc §8b).
 *
 * Static markup opts in with data-attributes rather than becoming a React
 * island just to animate:
 *
 *   data-reveal / data-reveal-item  section reveals with a stagger
 *   data-count="94"                 score counts up when scrolled into view
 *   data-hover-lift                 card lifts, ember plates fan, bar expands
 *   data-hover-bar                  the underline bar inside a lifted card
 *   data-thumb-stack                ranking row's ember plates slide out
 *   data-flame                      logomark idle flicker
 *
 * GSAP is ~44 kB gzipped — far too much to put in front of first paint on a
 * site that lives or dies by search traffic. So it is imported dynamically
 * once the browser goes idle, and never at all for visitors who asked for
 * reduced motion.
 *
 * That makes every animation strictly additive. Scores render their final
 * value in the HTML, and reveals only ever fade content *in*, so if this
 * module never runs the page is complete and correct — just still.
 */

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

async function boot() {
  const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);

  gsap.registerPlugin(ScrollTrigger);

  const EASE = "expo.out";
  /** Elements already animated, so a re-scan never replays them. */
  const seen = new WeakSet<Element>();

  function revealSections() {
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((section) => {
      if (seen.has(section)) return;
      seen.add(section);

      const items = section.querySelectorAll<HTMLElement>("[data-reveal-item]");
      const targets = items.length ? Array.from(items) : [section];
      const stagger = Number(section.dataset.revealStagger ?? 0.06);

      gsap.from(targets, {
        opacity: 0,
        y: 24,
        duration: 0.7,
        ease: EASE,
        stagger,
        scrollTrigger: { trigger: section, start: "top 85%", once: true },
      });
    });
  }

  /** §8b: "score numbers count up from 0 when scrolled into view". */
  function countScores() {
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
      if (seen.has(node)) return;
      seen.add(node);

      const target = Number(node.dataset.count);
      if (!Number.isFinite(target)) return;

      const counter = { n: 0 };
      gsap.to(counter, {
        n: target,
        duration: 1.1,
        ease: EASE,
        scrollTrigger: { trigger: node, start: "top 92%", once: true },
        onUpdate: () => {
          node.textContent = String(Math.round(counter.n));
        },
        onComplete: () => {
          node.textContent = String(target);
        },
      });
    });
  }

  function scan() {
    revealSections();
    countScores();
    ScrollTrigger.refresh();
  }

  /* -------------------------------------------------------------- hovers -- */

  function lift(card: HTMLElement, on: boolean) {
    const face = card.querySelector(
      ".hero-card__face, .review-card__body, .guide-card__body",
    );
    if (face) {
      gsap.to(face, { y: on ? -6 : 0, duration: 0.45, ease: EASE, overwrite: "auto" });
    }

    const layers = card.querySelectorAll(".hero-card__layer");
    if (layers.length) {
      gsap.to(layers, {
        x: on ? 4 : 0,
        y: on ? 4 : 0,
        duration: 0.5,
        ease: EASE,
        stagger: on ? 0.04 : 0,
        overwrite: "auto",
      });
    }

    // §8b: "cards lift subtly on hover with the underline bar expanding".
    const bar = card.querySelector("[data-hover-bar]");
    if (bar) {
      gsap.to(bar, {
        scaleX: on ? 1.7 : 1,
        duration: 0.4,
        ease: EASE,
        transformOrigin: "left center",
        overwrite: "auto",
      });
    }
  }

  function thumbStack(row: HTMLElement, on: boolean) {
    gsap.to(row.querySelector(".rank-row__thumb-layer--b"), {
      x: on ? 6 : 0,
      y: on ? 6 : 0,
      duration: 0.4,
      ease: EASE,
      overwrite: "auto",
    });
    gsap.to(row.querySelector(".rank-row__thumb-layer--a"), {
      x: on ? 3 : 0,
      y: on ? 3 : 0,
      duration: 0.4,
      ease: EASE,
      overwrite: "auto",
    });
  }

  // Delegated, so island content that hydrates later is covered for free.
  const handle = (event: Event, on: boolean) => {
    const target = event.target as HTMLElement | null;
    if (!target?.closest) return;

    const card = target.closest<HTMLElement>("[data-hover-lift]");
    if (card) lift(card, on);

    const row = target.closest<HTMLElement>("[data-thumb-stack]");
    if (row) thumbStack(row, on);
  };

  document.addEventListener("mouseover", (e) => handle(e, true));
  document.addEventListener("mouseout", (e) => handle(e, false));
  document.addEventListener("focusin", (e) => handle(e, true));
  document.addEventListener("focusout", (e) => handle(e, false));

  /* --------------------------------------------------------------- flame -- */

  /** §8b: "the flame logomark has one discreet idle animation". */
  const marks = document.querySelectorAll<HTMLElement>("[data-flame]");
  if (marks.length) {
    gsap.to(marks, {
      scaleY: 1.06,
      skewX: -1.5,
      transformOrigin: "50% 100%",
      duration: 1.7,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }

  /* ---------------------------------------------------------------- boot -- */

  scan();

  // Islands re-render their own subtree; this is how they ask to be animated.
  document.addEventListener("sibi:content", scan);

  // Fonts land after first paint and shift layout, which would otherwise leave
  // every trigger measured against stale positions.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

if (!reduced.matches) {
  if ("requestIdleCallback" in window) {
    requestIdleCallback(() => void boot(), { timeout: 1500 });
  } else {
    setTimeout(() => void boot(), 200);
  }
}
