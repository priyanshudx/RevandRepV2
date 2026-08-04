export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-[#c41e3a] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#a0a0a0] text-sm font-medium animate-pulse">Loading Rev & Rep...</p>
      </div>
    </div>
  );
}
