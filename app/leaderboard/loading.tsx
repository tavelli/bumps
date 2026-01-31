export default function Loading() {
  return (
    <div className="animate-pulse p-4">
      {/* Table Placeholder */}
      <div className="space-y-4">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center border-b pb-4">
            <div className="h-8 w-8 bg-slate-100 rounded"></div>
            <div className="h-8 w-full bg-slate-100 rounded"></div>
            <div className="h-8 w-12 bg-slate-100 rounded"></div>
            <div className="h-8 w-16 bg-slate-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
