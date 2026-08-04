export default function PaymentLoading() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <header className="border-b border-[#1e1e1e] h-14 flex items-center px-6 justify-between">
        <div className="w-28 h-6 bg-[#1f1f1f] rounded animate-pulse" />
      </header>

      <div className="container py-10 max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <div className="w-48 h-6 bg-[#1f1f1f] rounded animate-pulse" />
          <div className="w-full h-48 bg-[#1f1f1f] rounded-xl animate-pulse" />
          <div className="w-full h-12 bg-[#1f1f1f] rounded-xl animate-pulse" />
        </div>
        <div className="lg:col-span-2 bg-[#141414] border border-[#1e1e1e] rounded-2xl p-6 space-y-4">
          <div className="w-36 h-6 bg-[#1f1f1f] rounded animate-pulse" />
          <div className="w-full h-24 bg-[#1f1f1f] rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}
