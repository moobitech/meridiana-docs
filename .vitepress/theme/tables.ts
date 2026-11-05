// The wide tables of the doc pages scroll sideways inside their frame (`.table-wrap`, markdown.ts):
// while there is more on the right, the frame gets `has-more`, and docs.css shows an edge fade and
// a "Scroll →" cue.
const watched = new WeakSet<HTMLElement>();

export function watchTables() {
  for (const wrap of document.querySelectorAll<HTMLElement>('.VPDoc .table-wrap')) {
    if (watched.has(wrap)) continue;

    const table = wrap.querySelector('table');
    if (!table) continue;

    watched.add(wrap);
    const update = () => {
      const more = table.scrollWidth - table.clientWidth - table.scrollLeft > 4;
      wrap.classList.toggle('has-more', more);
    };
    table.addEventListener('scroll', update, { passive: true });
    new ResizeObserver(update).observe(table);
    update();
  }
}
