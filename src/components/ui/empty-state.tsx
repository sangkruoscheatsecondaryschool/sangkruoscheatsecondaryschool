import { ReactNode } from "react";
import { FileQuestion } from "lucide-react";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50">
      <div className="p-4 bg-white rounded-full shadow-sm mb-4">
        <FileQuestion className="h-8 w-8 text-slate-400" />
      </div>
      <h3 className="font-moul text-lg text-slate-900 mb-1">{title}</h3>
      <p className="text-slate-500 text-sm max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
}