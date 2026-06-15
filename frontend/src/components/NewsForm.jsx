import { useState } from 'react'
import { analyzeNews } from '../services/api'

const PRESETS = [
  { label: 'BBC News', url: 'https://feeds.bbci.co.uk/news/rss.xml' },
  { label: 'Reuters', url: 'https://feeds.reuters.com/reuters/topNews' },
  { label: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
]

export default function NewsForm({ onResult, onError }) {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    try {
      const data = await analyzeNews(url.trim())
      onResult(data)
    } catch (err) {
      onError(err?.response?.data?.detail || 'Failed to parse RSS feed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">RSS Feed URL</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://feeds.bbci.co.uk/news/rss.xml"
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => setUrl(p.url)}
            className="text-xs px-3 py-1 bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-700 rounded-full border border-gray-200 transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Fetching…' : 'Fetch & Analyze'}
      </button>
    </form>
  )
}
