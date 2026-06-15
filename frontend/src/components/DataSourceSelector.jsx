const TABS = [
  { id: 'manual', label: 'Manual Text' },
  { id: 'upload', label: 'CSV / Excel' },
  { id: 'reddit', label: 'Reddit' },
  { id: 'news', label: 'RSS / News' },
]

export default function DataSourceSelector({ active, onChange }) {
  return (
    <div className="flex gap-2 border-b border-gray-200 mb-6">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium rounded-t transition-colors
            ${active === tab.id
              ? 'bg-indigo-600 text-white border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-indigo-600'
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
