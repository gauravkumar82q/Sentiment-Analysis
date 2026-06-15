import { useState } from 'react'
import { analyzeText } from '../services/api'

export default function ManualInput({ onResult, onError }) {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    try {
      const data = await analyzeText(text)
      onResult(data)
    } catch (err) {
      onError(err?.response?.data?.detail || 'Failed to analyze text.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={5}
        placeholder="Enter any text to analyze sentiment…"
        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
      />
      <button
        type="submit"
        disabled={loading || !text.trim()}
        className="px-5 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {loading ? 'Analyzing…' : 'Analyze'}
      </button>
    </form>
  )
}
