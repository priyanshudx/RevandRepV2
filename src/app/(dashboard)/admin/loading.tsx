export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <header className="border-b border-[#1e1e1e] bg-[#080808]/80 h-14 flex items-center px-6 justify-between">
        <div className="w-32 h-6 bg-[#1f1f1f] rounded animate-pulse" />
        <div className="w-24 h-6 bg-[#1f1f1f] rounded animate-pulse" />
      </header>

      <div className="container py-8 space-y-6">
        <div className="w-48 h-8 bg-[#1f1f1f] rounded animate-pulse" />

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-[#141414] border border-[#1e1e1e] rounded-xl space-y-2">
              <div className="w-20 h-4 bg-[#1f1f1f] rounded animate-pulse" />
              <div className="w-12 h-6 bg-[#1f1f1f] rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <div className="w-full h-10 bg-[#1f1f1f] rounded animate-pulse" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-full h-12 bg-[#1f1f1f]/50 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
