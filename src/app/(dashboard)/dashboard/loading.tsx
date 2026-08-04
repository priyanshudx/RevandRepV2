export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Header Skeleton */}
      <header className="border-b border-[#1e1e1e] bg-[#080808]/80 h-14 flex items-center px-6 justify-between">
        <div className="w-28 h-6 bg-[#1f1f1f] rounded animate-pulse" />
        <div className="w-20 h-6 bg-[#1f1f1f] rounded animate-pulse" />
      </header>

      {/* Main Container Skeleton */}
      <div className="container py-10 max-w-4xl mx-auto space-y-8">
        {/* User Greeting */}
        <div className="space-y-2">
          <div className="w-24 h-4 bg-[#1f1f1f] rounded animate-pulse" />
          <div className="w-48 h-8 bg-[#1f1f1f] rounded animate-pulse" />
        </div>

        {/* Highlight Card */}
        <div className="rounded-2xl p-6 bg-[#141414] border border-[#1e1e1e] space-y-4">
          <div className="w-1/3 h-5 bg-[#1f1f1f] rounded animate-pulse" />
          <div className="w-2/3 h-4 bg-[#1f1f1f] rounded animate-pulse" />
          <div className="w-32 h-10 bg-[#1f1f1f] rounded-xl animate-pulse" />
        </div>

        {/* Orders list skeleton */}
        <div className="space-y-4">
          <div className="w-36 h-6 bg-[#1f1f1f] rounded animate-pulse" />
          <div className="rounded-2xl p-6 bg-[#141414] border border-[#1e1e1e] space-y-3">
            <div className="w-full h-4 bg-[#1f1f1f] rounded animate-pulse" />
            <div className="w-3/4 h-4 bg-[#1f1f1f] rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
