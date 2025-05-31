export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="animate-pulse">
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-28 bg-slate-200 rounded"></div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
          ))}
        </div>

        <div className="h-64 bg-slate-200 rounded-lg mb-6"></div>

        <div className="h-10 bg-slate-200 rounded mb-6"></div>

        <div className="h-8 bg-slate-200 rounded mb-4"></div>

        <div className="h-96 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  )
}
