export default function QuestionnaireLoading() {
  return (
    <div className="min-h-screen bg-[#080808]">
      <header className="border-b border-[#1e1e1e] h-14 flex items-center px-6 justify-between">
        <div className="w-28 h-6 bg-[#1f1f1f] rounded animate-pulse" />
      </header>
      <div className="container py-10 max-w-xl mx-auto space-y-6">
        <div className="w-full h-2 bg-[#1f1f1f] rounded-full animate-pulse" />
        <div className="bg-[#141414] border border-[#1e1e1e] rounded-2xl p-8 space-y-6">
          <div className="w-48 h-6 bg-[#1f1f1f] rounded animate-pulse" />
          <div className="space-y-4">
            <div className="w-full h-12 bg-[#1f1f1f] rounded-xl animate-pulse" />
            <div className="w-full h-12 bg-[#1f1f1f] rounded-xl animate-pulse" />
            <div className="w-full h-12 bg-[#1f1f1f] rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
