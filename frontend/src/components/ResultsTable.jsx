const SENTIMENT_STYLES = {
  positive: 'bg-green-100 text-green-700',
  neutral: 'bg-slate-100 text-slate-600',
  negative: 'bg-red-100 text-red-700',
}

export default function ResultsTable({ results }) {
  if (!results || results.length === 0) return null

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800">Results</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left w-1/2">Text</th>
              <th className="px-6 py-3 text-left">Sentiment</th>
              <th className="px-6 py-3 text-left">Score</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {results.map((r, i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-gray-700 max-w-xs truncate" title={r.text}>
                  {r.text}
                </td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${SENTIMENT_STYLES[r.sentiment] || 'bg-gray-100 text-gray-600'}`}>
                    {r.sentiment}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-600">{(r.score * 100).toFixed(1)}%</td>
                <td className="px-6 py-3 text-gray-400">{r.timestamp || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
