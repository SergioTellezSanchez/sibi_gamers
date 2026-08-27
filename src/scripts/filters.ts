/**
 * Filtering without a framework.
 *
 * Every card is server-rendered and stays in the DOM; a filter only toggles
 * `hidden`. That keeps the full catalogue in the HTML for crawlers, costs no
 * hydration, and means the page works identically before this script loads —
 * it just starts on "All".
 *
 * Markup contract:
 *   <div data-filter-for="reviews"><button data-filter="Mixed">…
 *   <div data-filter-group="reviews"><article data-filter-value="mid">…
 *   <p data-filter-empty="reviews">        shown when nothing matches
 *
 * A group may declare `data-filter-map` — JSON mapping a pill label to the
 * `data-filter-value`s it accepts — for cases like score bands, where the
 * label ("Recommended") is not the value ("high").
 */

const ALL = "All";

function apply(group: string, label: string) {
  const list = document.querySelector<HTMLElement>(`[data-filter-group="${group}"]`);
  if (!list) return;

  const raw = list.dataset.filterMap;
  const map: Record<string, string[]> = raw ? JSON.parse(raw) : {};
  const accepted = map[label] ?? [label];

  let visible = 0;
  list.querySelectorAll<HTMLElement>("[data-filter-value]").forEach((item) => {
    const show = label === ALL || accepted.includes(item.dataset.filterValue ?? "");
    item.hidden = !show;
    if (show) visible += 1;
  });

  // Day headings on the news feed disappear when they empty out.
  list.querySelectorAll<HTMLElement>("[data-filter-section]").forEach((section) => {
    const any = section.querySelectorAll<HTMLElement>("[data-filter-value]:not([hidden])");
    section.hidden = any.length === 0;
  });

  const empty = document.querySelector<HTMLElement>(`[data-filter-empty="${group}"]`);
  if (empty) empty.hidden = visible > 0;

  document.dispatchEvent(new CustomEvent("sibi:content"));
}

document.querySelectorAll<HTMLElement>("[data-filter-for]").forEach((bar) => {
  const group = bar.dataset.filterFor!;

  bar.addEventListener("click", (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>("[data-filter]");
    if (!button) return;

    bar.querySelectorAll("[data-filter]").forEach((b) => {
      b.setAttribute("aria-pressed", String(b === button));
    });

    apply(group, button.dataset.filter!);
  });
});
