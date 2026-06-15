import { useState } from 'react'
import { analyzeReddit } from '../services/api'

export default function RedditForm({ onResult, onError }) {
  const [subreddit, setSubreddit] = useState('')
  const [query, setQuery] = useState('')
  const [limit, setLimit] = useState(25)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!subreddit.trim() && !query.trim()) return
    setLoading(true)
    try {
      const data = await analyzeReddit({ subreddit: subreddit.trim(), query: query.trim(), limit })
      onResult(data)
    } catch (err) {
      onError(err?.response?.data?.detail || 'Failed to fetch Reddit posts.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-xs text-gray-500">
        Requires Reddit API credentials in <code className="bg-gray-100 px-1 rounded">backend/.env</code>.{' '}
        <a
          href="https://www.reddit.com/prefs/apps"
          target="_blank"
          rel="noreferrer"
          className="text-indigo-600 underline"
        >
          Register a free app →
        </a>
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Subreddit</label>
          <input
            type="text"
            value={subreddit}
            onChange={(e) => setSubreddit(e.target.value)}
            placeholder="e.g. technology"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Search query (optional)</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. AI news"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="space-y-1 w-32">
        <label className="block text-sm font-medium text-gray-700">Post limit</label>
        <input
          type="number"
          min={1}
          max={100}
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        type="submit"
        disabled={loading || (!subreddit.trim() && !query.trim())}
        className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Fetching…' : 'Fetch & Analyze'}
      </button>
    </form>
  )
}
