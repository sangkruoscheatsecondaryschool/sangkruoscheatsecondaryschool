export function SelectorEmpty({
  hasSubjects,
  hasMonth,
}: {
  hasSubjects: boolean;
  hasMonth: boolean;
}) {
  const message = !hasSubjects
    ? "សូមជ្រើសរើសមុខវិជ្ជា"
    : !hasMonth
      ? "សូមជ្រើសរើសខែ"
      : "—";

  return (
    <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
      <p className="text-muted text-sm">{message}</p>
    </div>
  );
}