export function DraftNotice() {
  return (
    <div
      role="note"
      className="mt-8 inline-flex items-center gap-3 rounded-[var(--radius-card)] border border-gold bg-gold/10 px-4 py-2.5 font-mono text-[0.8125rem] text-ink"
    >
      <span aria-hidden className="h-2 w-2 rounded-full bg-gold" />
      Draft — to be reviewed.
    </div>
  );
}
