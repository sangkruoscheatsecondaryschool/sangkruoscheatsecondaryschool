export function Placeholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center">
      <p className="font-moul text-base">{title}</p>
      {description ? (
        <p className="text-muted mt-2 text-sm">{description}</p>
      ) : null}
    </div>
  );
}