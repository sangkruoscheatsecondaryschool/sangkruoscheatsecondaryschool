export function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="rounded-btn mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
}